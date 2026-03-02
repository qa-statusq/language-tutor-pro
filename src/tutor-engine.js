import { LEVELS, getLanguage, getTopics, getVocabulary } from './language-config.js';
import { chatCompletion } from './hf-client.js';

function buildSystemPrompt(langKey, level, topicId) {
  const lang = getLanguage(langKey);
  const levelConfig = LEVELS[level];
  const topics = getTopics(level);
  const topic = topics.find(t => t.id === topicId);
  const vocab = getVocabulary(langKey, topicId);

  if (!lang || !levelConfig || !topic) {
    throw new Error(`Invalid configuration: language=${langKey}, level=${level}, topic=${topicId}`);
  }

  const vocabSection = vocab.length > 0
    ? `\nKey vocabulary for this lesson:\n${vocab.map(v => `- ${v.word} (${v.transliteration}) = ${v.meaning}`).join('\n')}`
    : '';

  const honorificNote = lang.honorifics
    ? `\nIMPORTANT: ${lang.name} has formal/informal speech levels. Always teach the polite/formal form first for beginners.`
    : '';

  return `You are a friendly, patient, and encouraging ${lang.name} language tutor.
You are teaching a ${levelConfig.name} (${level}) level student.
Current topic: ${topic.title} - ${topic.description}

LANGUAGE DETAILS:
- Language: ${lang.name} (${lang.nativeName})
- Script: ${lang.script}
- ${lang.notes}${honorificNote}

LEVEL GUIDELINES (${level} - ${levelConfig.name}):
- Vocabulary limit: ~${levelConfig.vocabLimit} words
- Grammar focus: ${levelConfig.grammarFocus}
- Correction style: ${levelConfig.correctionStyle}
- Keep responses ${levelConfig.responseLength}
${vocabSection}

TEACHING RULES:
1. Always write the ${lang.name} word/phrase FIRST in native ${lang.script} script
2. Immediately follow with transliteration in parentheses
3. Then provide the English meaning
4. Format: [${lang.script} script] ([transliteration]) - [English meaning]
5. Use simple English to explain grammar points
6. Give 1-2 practice examples per concept
7. Praise correct attempts enthusiastically
8. Gently correct mistakes, showing the right form
9. Ask the student to practice after teaching something new
10. Keep responses concise - teach one concept at a time
11. If the student writes in ${lang.name}, acknowledge it and respond bilingually

RESPONSE FORMAT:
- Use the target language with transliteration and translation
- Keep responses focused and not too long (3-6 sentences for A1, 4-8 for A2)
- End with a question or practice prompt to keep the conversation going`;
}

function buildGreetingPrompt(langKey, level, topicId) {
  const lang = getLanguage(langKey);
  const topics = getTopics(level);
  const topic = topics.find(t => t.id === topicId);

  return `Start the lesson with a warm greeting in ${lang.name} (with transliteration and translation).
Then briefly introduce what we'll learn today: "${topic.title}".
Teach the first word or phrase from this topic.
End by asking the student to try saying/writing something.
Keep it short and welcoming - this is the very start of the lesson.`;
}

export async function startLesson(langKey, level, topicId) {
  const systemPrompt = buildSystemPrompt(langKey, level, topicId);
  const userPrompt = buildGreetingPrompt(langKey, level, topicId);

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  const response = await chatCompletion(messages);

  return {
    response,
    systemPrompt,
    messages: [
      ...messages,
      { role: 'assistant', content: response },
    ],
  };
}

export async function chat(userMessage, conversationHistory) {
  const messages = [
    ...conversationHistory,
    { role: 'user', content: userMessage },
  ];

  const response = await chatCompletion(messages);

  return {
    response,
    messages: [
      ...messages,
      { role: 'assistant', content: response },
    ],
  };
}

export function evaluateResponse(userText, langKey, topicId) {
  const vocab = getVocabulary(langKey, topicId);
  if (vocab.length === 0) return null;

  const lowerText = userText.toLowerCase();
  const matchedWords = vocab.filter(v =>
    lowerText.includes(v.word.toLowerCase()) ||
    lowerText.includes(v.transliteration.toLowerCase())
  );

  return {
    vocabUsed: matchedWords.length,
    totalVocab: vocab.length,
    percentage: Math.round((matchedWords.length / vocab.length) * 100),
    matchedWords: matchedWords.map(v => v.word),
  };
}

export function getCurriculumData() {
  return {
    levels: LEVELS,
    A1: getTopics('A1'),
    A2: getTopics('A2'),
  };
}
