export const LANGUAGES = {
  hindi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    ttsModel: 'facebook/mms-tts-hin',
    greeting: 'नमस्ते',
    honorifics: true,
    notes: 'Uses Devanagari script. Formal/informal "you" distinction (आप/तुम/तू).',
  },
  tamil: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    ttsModel: 'facebook/mms-tts-tam',
    greeting: 'வணக்கம்',
    honorifics: true,
    notes: 'Uses Tamil script. Rich honorific system. Agglutinative language.',
  },
  telugu: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    ttsModel: 'facebook/mms-tts-tel',
    greeting: 'నమస్కారం',
    honorifics: true,
    notes: 'Uses Telugu script. Known as "Italian of the East" for vowel endings.',
  },
  bengali: {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    ttsModel: 'facebook/mms-tts-ben',
    greeting: 'নমস্কার',
    honorifics: true,
    notes: 'Uses Bengali script. Three levels of politeness (তুই/তুমি/আপনি).',
  },
  marathi: {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    ttsModel: 'facebook/mms-tts-mar',
    greeting: 'नमस्कार',
    honorifics: true,
    notes: 'Uses Devanagari script (like Hindi). Three grammatical genders.',
  },
  gujarati: {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'Gujarati',
    ttsModel: 'facebook/mms-tts-guj',
    greeting: 'નમસ્તે',
    honorifics: true,
    notes: 'Uses Gujarati script. SOV word order like Hindi.',
  },
  kannada: {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    ttsModel: 'facebook/mms-tts-kan',
    greeting: 'ನಮಸ್ಕಾರ',
    honorifics: true,
    notes: 'Uses Kannada script. Agglutinative Dravidian language.',
  },
  malayalam: {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    ttsModel: 'facebook/mms-tts-mal',
    greeting: 'നമസ്കാരം',
    honorifics: true,
    notes: 'Uses Malayalam script. Complex conjunct consonants.',
  },
  english: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    script: 'Latin',
    ttsModel: 'facebook/mms-tts-eng',
    greeting: 'Hello',
    honorifics: false,
    notes: 'Uses Latin script. Global lingua franca.',
  },
};

export const LEVELS = {
  A1: {
    name: 'Beginner',
    description: 'Learn basic greetings, numbers, and simple phrases',
    vocabLimit: 500,
    grammarFocus: 'present tense, basic sentence structure, common postpositions',
    correctionStyle: 'gentle',
    responseLength: 'short',
  },
  A2: {
    name: 'Elementary',
    description: 'Build sentences, have simple conversations, describe daily routines',
    vocabLimit: 1000,
    grammarFocus: 'past tense, future tense, compound sentences, conjunctions',
    correctionStyle: 'moderate',
    responseLength: 'medium',
  },
};

export const CURRICULUM = {
  A1: [
    {
      id: 'greetings',
      title: 'Greetings & Introductions',
      description: 'Learn to say hello, introduce yourself, and basic courtesies',
      icon: '👋',
    },
    {
      id: 'numbers',
      title: 'Numbers & Counting',
      description: 'Learn numbers 1-100 and basic counting',
      icon: '🔢',
    },
    {
      id: 'family',
      title: 'Family & Relationships',
      description: 'Learn words for family members and relationships',
      icon: '👨‍👩‍👧‍👦',
    },
    {
      id: 'food',
      title: 'Food & Drink',
      description: 'Learn names of common foods and how to order',
      icon: '🍛',
    },
    {
      id: 'colors-shapes',
      title: 'Colors & Shapes',
      description: 'Learn basic colors and shapes',
      icon: '🎨',
    },
    {
      id: 'daily-phrases',
      title: 'Daily Phrases',
      description: 'Essential everyday phrases like please, thank you, sorry',
      icon: '💬',
    },
  ],
  A2: [
    {
      id: 'daily-routine',
      title: 'Daily Routine',
      description: 'Describe your day, habits, and schedules',
      icon: '🌅',
    },
    {
      id: 'shopping',
      title: 'Shopping & Bargaining',
      description: 'Learn to shop, ask prices, and negotiate',
      icon: '🛍️',
    },
    {
      id: 'directions',
      title: 'Directions & Travel',
      description: 'Ask for and give directions, travel vocabulary',
      icon: '🗺️',
    },
    {
      id: 'weather',
      title: 'Weather & Seasons',
      description: 'Talk about weather and seasonal activities',
      icon: '☀️',
    },
    {
      id: 'health',
      title: 'Health & Body',
      description: 'Describe symptoms, body parts, visit a doctor',
      icon: '🏥',
    },
    {
      id: 'hobbies',
      title: 'Hobbies & Interests',
      description: 'Discuss hobbies, sports, and leisure activities',
      icon: '⚽',
    },
  ],
};

export const VOCABULARY = {
  hindi: {
    greetings: [
      { word: 'नमस्ते', transliteration: 'namaste', meaning: 'hello/goodbye' },
      { word: 'धन्यवाद', transliteration: 'dhanyavaad', meaning: 'thank you' },
      { word: 'कृपया', transliteration: 'kripaya', meaning: 'please' },
      { word: 'माफ़ कीजिए', transliteration: 'maaf kijiye', meaning: 'excuse me/sorry' },
      { word: 'मेरा नाम', transliteration: 'mera naam', meaning: 'my name' },
      { word: 'आप कैसे हैं?', transliteration: 'aap kaise hain?', meaning: 'how are you?' },
      { word: 'मैं ठीक हूँ', transliteration: 'main theek hoon', meaning: 'I am fine' },
      { word: 'फिर मिलेंगे', transliteration: 'phir milenge', meaning: 'see you again' },
    ],
    numbers: [
      { word: 'एक', transliteration: 'ek', meaning: 'one (1)' },
      { word: 'दो', transliteration: 'do', meaning: 'two (2)' },
      { word: 'तीन', transliteration: 'teen', meaning: 'three (3)' },
      { word: 'चार', transliteration: 'chaar', meaning: 'four (4)' },
      { word: 'पाँच', transliteration: 'paanch', meaning: 'five (5)' },
      { word: 'दस', transliteration: 'das', meaning: 'ten (10)' },
      { word: 'बीस', transliteration: 'bees', meaning: 'twenty (20)' },
      { word: 'सौ', transliteration: 'sau', meaning: 'hundred (100)' },
    ],
    family: [
      { word: 'माँ', transliteration: 'maa', meaning: 'mother' },
      { word: 'पिता', transliteration: 'pita', meaning: 'father' },
      { word: 'भाई', transliteration: 'bhai', meaning: 'brother' },
      { word: 'बहन', transliteration: 'bahan', meaning: 'sister' },
      { word: 'दादा', transliteration: 'dada', meaning: 'grandfather (paternal)' },
      { word: 'दादी', transliteration: 'dadi', meaning: 'grandmother (paternal)' },
    ],
    food: [
      { word: 'रोटी', transliteration: 'roti', meaning: 'bread' },
      { word: 'चावल', transliteration: 'chawal', meaning: 'rice' },
      { word: 'दाल', transliteration: 'dal', meaning: 'lentils' },
      { word: 'पानी', transliteration: 'paani', meaning: 'water' },
      { word: 'चाय', transliteration: 'chai', meaning: 'tea' },
      { word: 'दूध', transliteration: 'doodh', meaning: 'milk' },
    ],
  },
  tamil: {
    greetings: [
      { word: 'வணக்கம்', transliteration: 'vanakkam', meaning: 'hello/greetings' },
      { word: 'நன்றி', transliteration: 'nandri', meaning: 'thank you' },
      { word: 'தயவுசெய்து', transliteration: 'dayavu seidhu', meaning: 'please' },
      { word: 'மன்னிக்கவும்', transliteration: 'mannikkavum', meaning: 'sorry/excuse me' },
      { word: 'என் பெயர்', transliteration: 'en peyar', meaning: 'my name' },
      { word: 'எப்படி இருக்கீர்கள்?', transliteration: 'eppadi irukkeerkal?', meaning: 'how are you?' },
    ],
    numbers: [
      { word: 'ஒன்று', transliteration: 'ondru', meaning: 'one (1)' },
      { word: 'இரண்டு', transliteration: 'irandu', meaning: 'two (2)' },
      { word: 'மூன்று', transliteration: 'moondru', meaning: 'three (3)' },
      { word: 'நான்கு', transliteration: 'naanku', meaning: 'four (4)' },
      { word: 'ஐந்து', transliteration: 'ainthu', meaning: 'five (5)' },
      { word: 'பத்து', transliteration: 'pathu', meaning: 'ten (10)' },
    ],
  },
  telugu: {
    greetings: [
      { word: 'నమస్కారం', transliteration: 'namaskaram', meaning: 'hello/greetings' },
      { word: 'ధన్యవాదాలు', transliteration: 'dhanyavaadaalu', meaning: 'thank you' },
      { word: 'దయచేసి', transliteration: 'dayachesi', meaning: 'please' },
      { word: 'క్షమించండి', transliteration: 'kshaminchhandi', meaning: 'sorry/excuse me' },
      { word: 'నా పేరు', transliteration: 'naa peru', meaning: 'my name' },
      { word: 'మీరు ఎలా ఉన్నారు?', transliteration: 'meeru ela unnaaru?', meaning: 'how are you?' },
    ],
  },
  bengali: {
    greetings: [
      { word: 'নমস্কার', transliteration: 'namaskar', meaning: 'hello/greetings' },
      { word: 'ধন্যবাদ', transliteration: 'dhanyabaad', meaning: 'thank you' },
      { word: 'দয়া করে', transliteration: 'doya kore', meaning: 'please' },
      { word: 'মাফ করবেন', transliteration: 'maaf korben', meaning: 'sorry/excuse me' },
      { word: 'আমার নাম', transliteration: 'aamar naam', meaning: 'my name' },
      { word: 'আপনি কেমন আছেন?', transliteration: 'apni kemon aachhen?', meaning: 'how are you?' },
    ],
  },
  marathi: {
    greetings: [
      { word: 'नमस्कार', transliteration: 'namaskar', meaning: 'hello/greetings' },
      { word: 'धन्यवाद', transliteration: 'dhanyavaad', meaning: 'thank you' },
      { word: 'कृपया', transliteration: 'krupaya', meaning: 'please' },
      { word: 'माफ करा', transliteration: 'maaf kara', meaning: 'sorry/excuse me' },
      { word: 'माझे नाव', transliteration: 'majhe naav', meaning: 'my name' },
      { word: 'तुम्ही कसे आहात?', transliteration: 'tumhi kase aahat?', meaning: 'how are you?' },
    ],
  },
  gujarati: {
    greetings: [
      { word: 'નમસ્તે', transliteration: 'namaste', meaning: 'hello/greetings' },
      { word: 'આભાર', transliteration: 'aabhaar', meaning: 'thank you' },
      { word: 'મહેરબાની કરીને', transliteration: 'maherbaani karine', meaning: 'please' },
      { word: 'માફ કરજો', transliteration: 'maaf karjo', meaning: 'sorry/excuse me' },
      { word: 'મારું નામ', transliteration: 'maaru naam', meaning: 'my name' },
      { word: 'તમે કેમ છો?', transliteration: 'tame kem chho?', meaning: 'how are you?' },
    ],
  },
  kannada: {
    greetings: [
      { word: 'ನಮಸ್ಕಾರ', transliteration: 'namaskara', meaning: 'hello/greetings' },
      { word: 'ಧನ್ಯವಾದ', transliteration: 'dhanyavaada', meaning: 'thank you' },
      { word: 'ದಯವಿಟ್ಟು', transliteration: 'dayavittu', meaning: 'please' },
      { word: 'ಕ್ಷಮಿಸಿ', transliteration: 'kshamisi', meaning: 'sorry/excuse me' },
      { word: 'ನನ್ನ ಹೆಸರು', transliteration: 'nanna hesaru', meaning: 'my name' },
      { word: 'ನೀವು ಹೇಗಿದ್ದೀರಿ?', transliteration: 'neevu hegiddiri?', meaning: 'how are you?' },
    ],
  },
  malayalam: {
    greetings: [
      { word: 'നമസ്കാരം', transliteration: 'namaskaram', meaning: 'hello/greetings' },
      { word: 'നന്ദി', transliteration: 'nandi', meaning: 'thank you' },
      { word: 'ദയവായി', transliteration: 'dayavaayi', meaning: 'please' },
      { word: 'ക്ഷമിക്കണം', transliteration: 'kshamikkanam', meaning: 'sorry/excuse me' },
      { word: 'എന്റെ പേര്', transliteration: 'ente per', meaning: 'my name' },
      { word: 'സുഖമാണോ?', transliteration: 'sukhamaano?', meaning: 'how are you?' },
    ],
  },
  english: {
    greetings: [
      { word: 'Hello', transliteration: 'hello', meaning: 'a common greeting' },
      { word: 'Thank you', transliteration: 'thank you', meaning: 'expression of gratitude' },
      { word: 'Please', transliteration: 'please', meaning: 'polite request word' },
      { word: 'Excuse me', transliteration: 'excuse me', meaning: 'getting attention or apologizing' },
      { word: 'My name is', transliteration: 'my name is', meaning: 'introducing yourself' },
      { word: 'How are you?', transliteration: 'how are you', meaning: 'asking about wellbeing' },
    ],
  },
};

export function getLanguage(langKey) {
  return LANGUAGES[langKey] || null;
}

export function getTopics(level) {
  return CURRICULUM[level] || [];
}

export function getVocabulary(langKey, topicId) {
  const langVocab = VOCABULARY[langKey];
  if (!langVocab) return [];
  return langVocab[topicId] || [];
}

export function getAllLanguages() {
  return Object.entries(LANGUAGES).map(([key, lang]) => ({
    key,
    ...lang,
  }));
}
