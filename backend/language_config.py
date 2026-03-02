"""Language configuration: languages, levels, curriculum, vocabulary."""

LANGUAGES = {
    "hindi": {
        "name": "Hindi",
        "native_name": "हिन्दी",
        "script": "Devanagari",
        "has_honorifics": True,
        "tts_model": "facebook/mms-tts-hin",
        "bcp47": "hi-IN",
        "flag": "🇮🇳",
        "sample_text": "नमस्ते! मैं आपकी शिक्षिका हूँ।",
        "notes": "Uses Devanagari script. Has formal/informal address (आप/तुम/तू)."
    },
    "tamil": {
        "name": "Tamil",
        "native_name": "தமிழ்",
        "script": "Tamil",
        "has_honorifics": True,
        "tts_model": "facebook/mms-tts-tam",
        "bcp47": "ta-IN",
        "flag": "🇮🇳",
        "sample_text": "வணக்கம்! நான் உங்கள் ஆசிரியர்.",
        "notes": "Uses Tamil script. Rich literary tradition."
    },
    "telugu": {
        "name": "Telugu",
        "native_name": "తెలుగు",
        "script": "Telugu",
        "has_honorifics": True,
        "tts_model": "facebook/mms-tts-tel",
        "bcp47": "te-IN",
        "flag": "🇮🇳",
        "sample_text": "నమస్కారం! నేను మీ టీచర్ని.",
        "notes": "Uses Telugu script. Known as 'Italian of the East'."
    },
    "bengali": {
        "name": "Bengali",
        "native_name": "বাংলা",
        "script": "Bengali",
        "has_honorifics": True,
        "tts_model": "facebook/mms-tts-ben",
        "bcp47": "bn-IN",
        "flag": "🇧🇩",
        "sample_text": "নমস্কার! আমি আপনার শিক্ষিকা।",
        "notes": "Uses Bengali script. Second most spoken language in India."
    },
    "marathi": {
        "name": "Marathi",
        "native_name": "मराठी",
        "script": "Devanagari",
        "has_honorifics": True,
        "tts_model": "facebook/mms-tts-mar",
        "bcp47": "mr-IN",
        "flag": "🇮🇳",
        "sample_text": "नमस्कार! मी तुमची शिक्षिका आहे.",
        "notes": "Uses Devanagari script. Official language of Maharashtra."
    },
    "gujarati": {
        "name": "Gujarati",
        "native_name": "ગુજરાતી",
        "script": "Gujarati",
        "has_honorifics": True,
        "tts_model": "facebook/mms-tts-guj",
        "bcp47": "gu-IN",
        "flag": "🇮🇳",
        "sample_text": "નમસ્તે! હું તમારી શિક્ષિકા છું.",
        "notes": "Uses Gujarati script. Official language of Gujarat."
    },
    "kannada": {
        "name": "Kannada",
        "native_name": "ಕನ್ನಡ",
        "script": "Kannada",
        "has_honorifics": True,
        "tts_model": "facebook/mms-tts-kan",
        "bcp47": "kn-IN",
        "flag": "🇮🇳",
        "sample_text": "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಶಿಕ್ಷಕಿ.",
        "notes": "Uses Kannada script. Official language of Karnataka."
    },
    "malayalam": {
        "name": "Malayalam",
        "native_name": "മലയാളം",
        "script": "Malayalam",
        "has_honorifics": True,
        "tts_model": "facebook/mms-tts-mal",
        "bcp47": "ml-IN",
        "flag": "🇮🇳",
        "sample_text": "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ അധ്യാപിക.",
        "notes": "Uses Malayalam script. Official language of Kerala."
    },
    "english": {
        "name": "English",
        "native_name": "English",
        "script": "Latin",
        "has_honorifics": False,
        "tts_model": "facebook/mms-tts-eng",
        "bcp47": "en-US",
        "flag": "🇬🇧",
        "sample_text": "Hello! I am your teacher.",
        "notes": "Uses Latin script. Global lingua franca."
    },
    "spanish": {
        "name": "Spanish",
        "native_name": "Español",
        "script": "Latin",
        "has_honorifics": True,
        "tts_model": "facebook/mms-tts-spa",
        "bcp47": "es-ES",
        "flag": "🇪🇸",
        "sample_text": "¡Hola! Soy tu profesora.",
        "notes": "Uses Latin script. Formal/informal (usted/tú)."
    },
    "french": {
        "name": "French",
        "native_name": "Français",
        "script": "Latin",
        "has_honorifics": True,
        "tts_model": "facebook/mms-tts-fra",
        "bcp47": "fr-FR",
        "flag": "🇫🇷",
        "sample_text": "Bonjour! Je suis votre professeure.",
        "notes": "Uses Latin script. Formal/informal (vous/tu)."
    },
    "japanese": {
        "name": "Japanese",
        "native_name": "日本語",
        "script": "Hiragana/Katakana/Kanji",
        "has_honorifics": True,
        "tts_model": "facebook/mms-tts-jpn",
        "bcp47": "ja-JP",
        "flag": "🇯🇵",
        "sample_text": "こんにちは！私はあなたの先生です。",
        "notes": "Uses three scripts. Complex honorific system (keigo)."
    }
}

LEVELS = {
    "A1": {
        "name": "A1 - Beginner",
        "description": "Start from zero. Learn basic words, greetings, and simple sentences.",
        "vocab_limit": 500,
        "grammar_complexity": "simple",
        "correction_style": "gentle",
        "response_length": "3-6 sentences"
    },
    "A2": {
        "name": "A2 - Elementary",
        "description": "Build on basics. Learn everyday conversations, tenses, and practical phrases.",
        "vocab_limit": 1000,
        "grammar_complexity": "moderate",
        "correction_style": "moderate",
        "response_length": "4-8 sentences"
    }
}

CURRICULUM = {
    "A1": [
        {
            "id": "greetings",
            "title": "Greetings & Introductions",
            "icon": "👋",
            "description": "Hello, goodbye, my name is...",
            "objectives": ["Basic greetings", "Self-introduction", "Polite expressions"]
        },
        {
            "id": "numbers",
            "title": "Numbers & Counting",
            "icon": "🔢",
            "description": "Count from 1-100, tell time, ages",
            "objectives": ["Numbers 1-20", "Tens up to 100", "Basic math phrases"]
        },
        {
            "id": "family",
            "title": "Family & People",
            "icon": "👨‍👩‍👧‍👦",
            "description": "Family members, relationships, descriptions",
            "objectives": ["Family vocabulary", "Describing people", "Possessives"]
        },
        {
            "id": "food",
            "title": "Food & Drinks",
            "icon": "🍽️",
            "description": "Ordering food, meals, tastes",
            "objectives": ["Common foods", "Ordering at restaurant", "Expressing preferences"]
        },
        {
            "id": "colors",
            "title": "Colors & Shapes",
            "icon": "🎨",
            "description": "Basic colors, shapes, descriptions",
            "objectives": ["Primary colors", "Common shapes", "Describing objects"]
        },
        {
            "id": "daily_phrases",
            "title": "Daily Phrases",
            "icon": "💬",
            "description": "Essential everyday expressions",
            "objectives": ["Please/Thank you", "Yes/No questions", "Common responses"]
        }
    ],
    "A2": [
        {
            "id": "daily_routine",
            "title": "Daily Routine",
            "icon": "⏰",
            "description": "Describe your day, habits, schedules",
            "objectives": ["Time expressions", "Habitual actions", "Sequence words"]
        },
        {
            "id": "shopping",
            "title": "Shopping & Money",
            "icon": "🛍️",
            "description": "Buying things, prices, bargaining",
            "objectives": ["Shop vocabulary", "Asking prices", "Comparisons"]
        },
        {
            "id": "directions",
            "title": "Directions & Places",
            "icon": "🗺️",
            "description": "Navigate, ask for directions, landmarks",
            "objectives": ["Direction words", "Location prepositions", "Asking for help"]
        },
        {
            "id": "weather",
            "title": "Weather & Seasons",
            "icon": "🌤️",
            "description": "Weather talk, seasons, climate",
            "objectives": ["Weather vocabulary", "Seasons", "Making plans"]
        },
        {
            "id": "health",
            "title": "Health & Body",
            "icon": "🏥",
            "description": "Body parts, feeling sick, at the doctor",
            "objectives": ["Body vocabulary", "Symptoms", "Doctor visit phrases"]
        },
        {
            "id": "hobbies",
            "title": "Hobbies & Activities",
            "icon": "⚽",
            "description": "Sports, music, free time activities",
            "objectives": ["Hobby vocabulary", "Likes/dislikes", "Inviting someone"]
        }
    ]
}

VOCABULARY = {
    "hindi": {
        "greetings": [
            {"word": "नमस्ते", "transliteration": "namaste", "meaning": "Hello/Greetings"},
            {"word": "धन्यवाद", "transliteration": "dhanyavaad", "meaning": "Thank you"},
            {"word": "कृपया", "transliteration": "kripaya", "meaning": "Please"},
            {"word": "अलविदा", "transliteration": "alvida", "meaning": "Goodbye"},
            {"word": "शुभ प्रभात", "transliteration": "shubh prabhaat", "meaning": "Good morning"},
            {"word": "मेरा नाम", "transliteration": "mera naam", "meaning": "My name"},
            {"word": "आप कैसे हैं?", "transliteration": "aap kaise hain?", "meaning": "How are you?"},
            {"word": "मैं ठीक हूँ", "transliteration": "main theek hoon", "meaning": "I am fine"}
        ],
        "numbers": [
            {"word": "एक", "transliteration": "ek", "meaning": "One"},
            {"word": "दो", "transliteration": "do", "meaning": "Two"},
            {"word": "तीन", "transliteration": "teen", "meaning": "Three"},
            {"word": "चार", "transliteration": "chaar", "meaning": "Four"},
            {"word": "पाँच", "transliteration": "paanch", "meaning": "Five"},
            {"word": "दस", "transliteration": "das", "meaning": "Ten"},
            {"word": "बीस", "transliteration": "bees", "meaning": "Twenty"},
            {"word": "सौ", "transliteration": "sau", "meaning": "Hundred"}
        ],
        "family": [
            {"word": "माँ", "transliteration": "maa", "meaning": "Mother"},
            {"word": "पिता", "transliteration": "pita", "meaning": "Father"},
            {"word": "भाई", "transliteration": "bhai", "meaning": "Brother"},
            {"word": "बहन", "transliteration": "bahan", "meaning": "Sister"},
            {"word": "परिवार", "transliteration": "parivaar", "meaning": "Family"},
            {"word": "दादा", "transliteration": "daada", "meaning": "Grandfather"},
            {"word": "दादी", "transliteration": "daadi", "meaning": "Grandmother"},
            {"word": "बच्चा", "transliteration": "bachcha", "meaning": "Child"}
        ],
        "food": [
            {"word": "रोटी", "transliteration": "roti", "meaning": "Bread"},
            {"word": "चावल", "transliteration": "chaaval", "meaning": "Rice"},
            {"word": "पानी", "transliteration": "paani", "meaning": "Water"},
            {"word": "दूध", "transliteration": "doodh", "meaning": "Milk"},
            {"word": "चाय", "transliteration": "chaay", "meaning": "Tea"},
            {"word": "सब्ज़ी", "transliteration": "sabzi", "meaning": "Vegetable"},
            {"word": "फल", "transliteration": "phal", "meaning": "Fruit"},
            {"word": "मिठाई", "transliteration": "mithai", "meaning": "Sweet/Dessert"}
        ],
        "colors": [
            {"word": "लाल", "transliteration": "laal", "meaning": "Red"},
            {"word": "नीला", "transliteration": "neela", "meaning": "Blue"},
            {"word": "हरा", "transliteration": "hara", "meaning": "Green"},
            {"word": "पीला", "transliteration": "peela", "meaning": "Yellow"},
            {"word": "सफेद", "transliteration": "safed", "meaning": "White"},
            {"word": "काला", "transliteration": "kaala", "meaning": "Black"}
        ],
        "daily_phrases": [
            {"word": "हाँ", "transliteration": "haan", "meaning": "Yes"},
            {"word": "नहीं", "transliteration": "nahin", "meaning": "No"},
            {"word": "माफ़ कीजिए", "transliteration": "maaf kijiye", "meaning": "Excuse me/Sorry"},
            {"word": "कोई बात नहीं", "transliteration": "koi baat nahin", "meaning": "No problem"},
            {"word": "फिर मिलेंगे", "transliteration": "phir milenge", "meaning": "See you again"},
            {"word": "ठीक है", "transliteration": "theek hai", "meaning": "Okay/Alright"}
        ]
    },
    "gujarati": {
        "greetings": [
            {"word": "નમસ્તે", "transliteration": "namaste", "meaning": "Hello"},
            {"word": "આભાર", "transliteration": "aabhaar", "meaning": "Thank you"},
            {"word": "કૃપા કરીને", "transliteration": "krupa karine", "meaning": "Please"},
            {"word": "આવજો", "transliteration": "aavjo", "meaning": "Goodbye"},
            {"word": "સુપ્રભાત", "transliteration": "suprabhaat", "meaning": "Good morning"},
            {"word": "મારું નામ", "transliteration": "maaru naam", "meaning": "My name"},
            {"word": "તમે કેમ છો?", "transliteration": "tame kem chho?", "meaning": "How are you?"},
            {"word": "હું મજામાં છું", "transliteration": "hu majama chhu", "meaning": "I am fine"}
        ],
        "numbers": [
            {"word": "એક", "transliteration": "ek", "meaning": "One"},
            {"word": "બે", "transliteration": "be", "meaning": "Two"},
            {"word": "ત્રણ", "transliteration": "tran", "meaning": "Three"},
            {"word": "ચાર", "transliteration": "chaar", "meaning": "Four"},
            {"word": "પાંચ", "transliteration": "paanch", "meaning": "Five"},
            {"word": "દસ", "transliteration": "das", "meaning": "Ten"}
        ],
        "family": [
            {"word": "મા", "transliteration": "maa", "meaning": "Mother"},
            {"word": "બાપા", "transliteration": "baapa", "meaning": "Father"},
            {"word": "ભાઈ", "transliteration": "bhai", "meaning": "Brother"},
            {"word": "બહેન", "transliteration": "bahen", "meaning": "Sister"},
            {"word": "કુટુંબ", "transliteration": "kutumb", "meaning": "Family"},
            {"word": "દાદા", "transliteration": "daada", "meaning": "Grandfather"},
            {"word": "દાદી", "transliteration": "daadi", "meaning": "Grandmother"}
        ],
        "food": [
            {"word": "રોટલી", "transliteration": "rotli", "meaning": "Bread"},
            {"word": "ભાત", "transliteration": "bhaat", "meaning": "Rice"},
            {"word": "પાણી", "transliteration": "paani", "meaning": "Water"},
            {"word": "દૂધ", "transliteration": "doodh", "meaning": "Milk"},
            {"word": "ચા", "transliteration": "chaa", "meaning": "Tea"},
            {"word": "શાક", "transliteration": "shaak", "meaning": "Vegetable"}
        ],
        "colors": [
            {"word": "લાલ", "transliteration": "laal", "meaning": "Red"},
            {"word": "વાદળી", "transliteration": "vaadli", "meaning": "Blue"},
            {"word": "લીલો", "transliteration": "leelo", "meaning": "Green"},
            {"word": "પીળો", "transliteration": "peelo", "meaning": "Yellow"}
        ],
        "daily_phrases": [
            {"word": "હા", "transliteration": "haa", "meaning": "Yes"},
            {"word": "ના", "transliteration": "naa", "meaning": "No"},
            {"word": "માફ કરશો", "transliteration": "maaf karsho", "meaning": "Sorry/Excuse me"},
            {"word": "કોઈ વાંધો નહીં", "transliteration": "koi vaandho nahin", "meaning": "No problem"},
            {"word": "ફરી મળીશું", "transliteration": "fari malishu", "meaning": "See you again"},
            {"word": "બરાબર", "transliteration": "baraabar", "meaning": "Okay/Alright"}
        ]
    }
}


def get_language(lang_key):
    return LANGUAGES.get(lang_key)


def get_topics(level):
    return CURRICULUM.get(level, [])


def get_vocabulary(lang_key, topic_id):
    lang_vocab = VOCABULARY.get(lang_key, {})
    return lang_vocab.get(topic_id, [])


def get_all_languages():
    return [{"key": k, "name": v["name"], "native_name": v["native_name"], "flag": v["flag"], "bcp47": v["bcp47"]}
            for k, v in LANGUAGES.items()]


def get_curriculum_data():
    return {
        "languages": get_all_languages(),
        "levels": LEVELS,
        "curriculum": CURRICULUM
    }
