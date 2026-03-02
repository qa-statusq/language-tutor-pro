"""Language Tutor - Flask app (local development)."""

import os
import base64
import logging

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from flask import Flask, request, jsonify, render_template

from backend.language_config import get_curriculum_data, LANGUAGES
from backend.teacher_profiles import get_all_teachers
from backend.session_manager import sessions
from backend.tutor_engine import build_system_prompt, build_greeting_prompt, evaluate_pronunciation
from backend.hf_client import chat_completion, speech_to_text, get_model_info, start_keep_alive

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder="static", template_folder="templates")

# Start keep-alive pinger for model warmth
start_keep_alive(interval_seconds=180)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "models": get_model_info()})


@app.route("/api/curriculum", methods=["GET"])
def curriculum():
    return jsonify(get_curriculum_data())


@app.route("/api/teachers", methods=["GET"])
def teachers():
    return jsonify({"teachers": get_all_teachers()})


@app.route("/api/teacher/voice-sample", methods=["POST"])
def teacher_voice_sample():
    data = request.json or {}
    target_lang = data.get("target_lang", "hindi")
    lang = LANGUAGES.get(target_lang)
    if not lang:
        return jsonify({"error": "Unknown language"}), 400
    return jsonify({"text": lang.get("sample_text", "Hello!")})


@app.route("/api/session/start", methods=["POST"])
def session_start():
    data = request.json or {}
    target_lang = data.get("target_lang")
    instruction_lang = data.get("instruction_lang", "english")
    level = data.get("level", "A1")
    topic = data.get("topic", "greetings")
    teacher_id = data.get("teacher_id", "anaya")

    if not target_lang or target_lang not in LANGUAGES:
        return jsonify({"error": "Invalid target language"}), 400
    if instruction_lang not in LANGUAGES:
        return jsonify({"error": "Invalid instruction language"}), 400

    session = sessions.create_session(target_lang, instruction_lang, level, topic, teacher_id)
    system_prompt = build_system_prompt(target_lang, instruction_lang, level, topic, teacher_id)
    session.add_message("system", system_prompt)

    greeting_prompt = build_greeting_prompt(target_lang, instruction_lang, level, topic, teacher_id)
    session.add_message("user", greeting_prompt)

    result = chat_completion(session.get_messages())
    greeting = result.get("content", "Hello! Let's begin our lesson.")
    session.add_message("assistant", greeting)

    return jsonify({
        "session_id": session.session_id,
        "greeting": greeting,
        "teacher_id": teacher_id
    })


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json or {}
    session_id = data.get("session_id")
    user_message = data.get("message", "").strip()

    if not session_id or not user_message:
        return jsonify({"error": "session_id and message required"}), 400

    session = sessions.get_session(session_id)
    if not session:
        return jsonify({"error": "Session expired or not found"}), 404

    session.add_message("user", user_message)
    result = chat_completion(session.get_messages())
    reply = result.get("content", "")
    session.add_message("assistant", reply)
    session.add_xp(5)

    return jsonify({
        "reply": reply,
        "xp": session.xp,
        "model": result.get("model", "")
    })


@app.route("/api/voice", methods=["POST"])
def voice():
    session_id = request.form.get("session_id")
    if not session_id:
        return jsonify({"error": "session_id required"}), 400

    session = sessions.get_session(session_id)
    if not session:
        return jsonify({"error": "Session expired or not found"}), 404

    audio_file = request.files.get("audio")
    if not audio_file:
        return jsonify({"error": "No audio file provided"}), 400

    audio_bytes = audio_file.read()
    transcribed = speech_to_text(audio_bytes)

    if not transcribed:
        return jsonify({"error": "Could not transcribe audio", "transcribed": ""}), 200

    session.add_message("user", transcribed)
    result = chat_completion(session.get_messages())
    reply = result.get("content", "")
    session.add_message("assistant", reply)
    session.add_xp(10)

    return jsonify({
        "transcribed": transcribed,
        "reply": reply,
        "xp": session.xp
    })


@app.route("/api/stt", methods=["POST"])
def stt():
    """Transcribe audio to text without sending to chat."""
    audio_file = request.files.get("audio")
    if not audio_file:
        return jsonify({"error": "No audio file provided"}), 400

    audio_bytes = audio_file.read()
    transcribed = speech_to_text(audio_bytes)

    return jsonify({"text": transcribed or ""})


@app.route("/api/quiz/generate", methods=["POST"])
def quiz_generate():
    """Generate a quiz based on the current lesson."""
    data = request.json or {}
    session_id = data.get("session_id")

    if not session_id:
        return jsonify({"error": "session_id required"}), 400

    session = sessions.get_session(session_id)
    if not session:
        return jsonify({"error": "Session not found"}), 404

    quiz_prompt = (
        "Based on what we've covered so far in this lesson, create a short quiz with exactly 4 questions. "
        "Format EACH question as:\n"
        "[QUIZ]\n"
        "Q: <question text>\n"
        "A: <option 1>\n"
        "B: <option 2>\n"
        "C: <option 3>\n"
        "D: <option 4>\n"
        "ANSWER: <correct letter>\n"
        "[/QUIZ]\n\n"
        "CRITICAL RULES FOR OPTIONS:\n"
        "- All 4 options (A, B, C, D) MUST be DIFFERENT from each other. No two options can be the same.\n"
        "- Each option should be a plausible but distinct answer.\n"
        "- Mix in words/phrases from the lesson as distractors.\n"
        "- Only ONE option should be the correct answer.\n\n"
        "Make sure questions test vocabulary and phrases taught in this lesson. "
        "Keep the same language rules — explain in the instruction language, test the target language."
    )

    session.add_message("user", quiz_prompt)
    result = chat_completion(session.get_messages())
    reply = result.get("content", "")
    session.add_message("assistant", reply)

    return jsonify({"quiz_text": reply})


@app.route("/api/pronunciation/score", methods=["POST"])
def pronunciation_score():
    data = request.json or {}
    session_id = data.get("session_id")
    expected = data.get("expected_text", "")
    transcribed = data.get("user_text", "")

    if not expected:
        return jsonify({"error": "expected_text required"}), 400

    if data.get("audio"):
        audio_bytes = base64.b64decode(data["audio"])
        transcribed = speech_to_text(audio_bytes) or transcribed

    result = evaluate_pronunciation(transcribed, expected)
    if session_id:
        session = sessions.get_session(session_id)
        if session and result["score"] >= 70:
            session.add_xp(15)
            result["xp_earned"] = 15

    return jsonify(result)


@app.route("/api/progress", methods=["GET"])
def get_progress():
    session_id = request.args.get("session_id")
    if not session_id:
        return jsonify({"error": "session_id required"}), 400
    session = sessions.get_session(session_id)
    if not session:
        return jsonify({"error": "Session not found"}), 404
    return jsonify(session.to_dict())


@app.route("/api/ping", methods=["POST"])
def ping():
    """Client keep-alive ping."""
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))
    print(f"\n  Language Tutor running at http://localhost:{port}\n")
    app.run(host="0.0.0.0", port=port, debug=True)
