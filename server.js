import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import dotenv from 'dotenv';

import { getAllLanguages, getLanguage } from './src/language-config.js';
import { getModelInfo, speechToText, textToSpeech } from './src/hf-client.js';
import { startLesson, chat, getCurriculumData } from './src/tutor-engine.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure directories exist
const dataDir = join(__dirname, 'data');
const uploadsDir = join(__dirname, 'uploads');
if (!existsSync(dataDir)) await mkdir(dataDir, { recursive: true });
if (!existsSync(uploadsDir)) await mkdir(uploadsDir, { recursive: true });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Multer for audio uploads
const upload = multer({
  dest: uploadsDir,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

// In-memory conversation store (keyed by session)
const sessions = new Map();

// ============ API ROUTES ============

// Health check
app.get('/api/health', (req, res) => {
  const modelInfo = getModelInfo();
  res.json({
    status: 'ok',
    models: modelInfo,
    timestamp: new Date().toISOString(),
  });
});

// Get curriculum (languages, levels, topics)
app.get('/api/curriculum', (req, res) => {
  const languages = getAllLanguages();
  const curriculum = getCurriculumData();

  res.json({
    languages,
    levels: curriculum.levels,
    topics: {
      A1: curriculum.A1,
      A2: curriculum.A2,
    },
  });
});

// Start a new lesson
app.post('/api/lesson/start', async (req, res) => {
  try {
    const { language, level, topic, sessionId } = req.body;

    if (!language || !level || !topic) {
      return res.status(400).json({ error: 'Missing required fields: language, level, topic' });
    }

    const lang = getLanguage(language);
    if (!lang) {
      return res.status(400).json({ error: `Unknown language: ${language}` });
    }

    const result = await startLesson(language, level, topic);

    // Store conversation in session
    const sid = sessionId || `${language}-${level}-${topic}-${Date.now()}`;
    sessions.set(sid, {
      language,
      level,
      topic,
      messages: result.messages,
      startedAt: new Date().toISOString(),
    });

    res.json({
      sessionId: sid,
      response: result.response,
      language: lang,
    });
  } catch (err) {
    console.error('Lesson start error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Chat message
app.post('/api/chat', async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Missing required fields: sessionId, message' });
    }

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found. Please start a new lesson.' });
    }

    const result = await chat(message, session.messages);

    // Update session
    session.messages = result.messages;
    sessions.set(sessionId, session);

    // Try TTS for the response
    let audioBase64 = null;
    const lang = getLanguage(session.language);
    if (lang && lang.ttsModel) {
      try {
        const audioBuffer = await textToSpeech(result.response, lang.ttsModel);
        audioBase64 = audioBuffer.toString('base64');
      } catch (ttsErr) {
        console.warn('TTS unavailable:', ttsErr.message);
      }
    }

    res.json({
      response: result.response,
      audio: audioBase64,
      audioFormat: audioBase64 ? 'wav' : null,
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Voice input (STT + Chat + TTS)
app.post('/api/voice', upload.single('audio'), async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId || !req.file) {
      return res.status(400).json({ error: 'Missing sessionId or audio file' });
    }

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found. Please start a new lesson.' });
    }

    // Read uploaded audio
    const audioBuffer = await readFile(req.file.path);

    // STT: Convert speech to text
    const transcribedText = await speechToText(audioBuffer);

    // Chat: Get AI response
    const result = await chat(transcribedText, session.messages);
    session.messages = result.messages;
    sessions.set(sessionId, session);

    // TTS: Convert response to speech
    let audioBase64 = null;
    const lang = getLanguage(session.language);
    if (lang && lang.ttsModel) {
      try {
        const audioBuffer = await textToSpeech(result.response, lang.ttsModel);
        audioBase64 = audioBuffer.toString('base64');
      } catch (ttsErr) {
        console.warn('TTS unavailable:', ttsErr.message);
      }
    }

    // Clean up uploaded file
    try {
      const { unlink } = await import('fs/promises');
      await unlink(req.file.path);
    } catch {}

    res.json({
      transcribedText,
      response: result.response,
      audio: audioBase64,
      audioFormat: audioBase64 ? 'wav' : null,
    });
  } catch (err) {
    console.error('Voice error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get progress
app.get('/api/progress', async (req, res) => {
  const progressFile = join(dataDir, 'progress.json');
  try {
    if (existsSync(progressFile)) {
      const data = await readFile(progressFile, 'utf-8');
      res.json(JSON.parse(data));
    } else {
      res.json({ lessons: [], lastUpdated: null });
    }
  } catch (err) {
    console.error('Progress read error:', err);
    res.json({ lessons: [], lastUpdated: null });
  }
});

// Save progress
app.post('/api/progress', async (req, res) => {
  const progressFile = join(dataDir, 'progress.json');
  try {
    const progress = req.body;
    progress.lastUpdated = new Date().toISOString();
    await writeFile(progressFile, JSON.stringify(progress, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error('Progress save error:', err);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\nðŸŽ“ Language Tutor running at http://localhost:${PORT}`);
  console.log(`ðŸ“š API health check: http://localhost:${PORT}/api/health`);
  const modelInfo = getModelInfo();
  console.log(`ðŸ¤– HF Token configured: ${modelInfo.tokenConfigured}`);
  console.log(`ðŸ”¤ Primary model: ${modelInfo.primary}\n`);
});
