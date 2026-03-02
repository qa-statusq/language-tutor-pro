import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

dotenv.config();

const PRIMARY_MODEL = 'Qwen/Qwen2.5-72B-Instruct';
const FALLBACK_MODEL = 'meta-llama/Llama-3.2-3B-Instruct';
const STT_MODEL = 'openai/whisper-base';

let hf = null;

function getClient() {
  if (!hf) {
    const token = process.env.HF_TOKEN;
    if (!token || token === 'your_huggingface_token_here') {
      throw new Error('HF_TOKEN not configured. Please set it in your .env file.');
    }
    hf = new HfInference(token);
  }
  return hf;
}

export async function chatCompletion(messages) {
  const client = getClient();

  // Try primary model first
  try {
    const response = await client.chatCompletion({
      model: PRIMARY_MODEL,
      messages,
      max_tokens: 512,
      temperature: 0.7,
    });
    return response.choices[0].message.content;
  } catch (err) {
    console.warn(`Primary model (${PRIMARY_MODEL}) failed: ${err.message}`);
    console.log(`Trying fallback model (${FALLBACK_MODEL})...`);
  }

  // Fallback model
  try {
    const response = await client.chatCompletion({
      model: FALLBACK_MODEL,
      messages,
      max_tokens: 512,
      temperature: 0.7,
    });
    return response.choices[0].message.content;
  } catch (err) {
    console.error(`Fallback model also failed: ${err.message}`);
    throw new Error('Both AI models are currently unavailable. Please try again later.');
  }
}

export async function speechToText(audioBuffer) {
  const client = getClient();

  try {
    const result = await client.automaticSpeechRecognition({
      model: STT_MODEL,
      data: audioBuffer,
    });
    return result.text;
  } catch (err) {
    console.error(`STT failed: ${err.message}`);
    throw new Error('Speech recognition is currently unavailable. Please type your message instead.');
  }
}

export async function textToSpeech(text, ttsModel) {
  const client = getClient();

  try {
    const response = await client.textToSpeech({
      model: ttsModel,
      inputs: text,
    });
    // response is a Blob; convert to Buffer
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (err) {
    console.error(`TTS failed for model ${ttsModel}: ${err.message}`);
    throw new Error('Text-to-speech is currently unavailable. Use browser speech synthesis instead.');
  }
}

export function getModelInfo() {
  return {
    primary: PRIMARY_MODEL,
    fallback: FALLBACK_MODEL,
    stt: STT_MODEL,
    tokenConfigured: !!(process.env.HF_TOKEN && process.env.HF_TOKEN !== 'your_huggingface_token_here'),
  };
}
