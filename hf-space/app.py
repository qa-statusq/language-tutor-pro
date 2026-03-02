"""HF Space — Lightweight LLM + STT proxy.

Holds the HF_TOKEN as a Space secret and exposes two endpoints:
  POST /api/chat   — forwards chat completions to HF Router
  POST /api/stt    — transcribes audio via HF Inference API
  GET  /api/health — liveness check
"""

import os
import logging
import requests

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from flask import Flask, request, jsonify

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

HF_TOKEN = os.environ.get("HF_TOKEN", "")
CHAT_API_URL = "https://router.huggingface.co/v1/chat/completions"
PRIMARY_MODEL = "Qwen/Qwen2.5-72B-Instruct"
FALLBACK_MODEL = "meta-llama/Llama-3.2-3B-Instruct"
STT_MODEL = "openai/whisper-base"


@app.route("/")
def index():
    return jsonify({"service": "language-tutor-proxy", "status": "ok"})


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "models": {
            "llm": PRIMARY_MODEL,
            "llm_fallback": FALLBACK_MODEL,
            "stt": STT_MODEL,
        },
        "token_configured": bool(HF_TOKEN),
    })


@app.route("/api/chat", methods=["POST"])
def chat():
    """Forward chat completion request to HF Router."""
    data = request.json or {}
    messages = data.get("messages", [])
    max_tokens = data.get("max_tokens", 1024)
    temperature = data.get("temperature", 0.7)

    if not messages:
        return jsonify({"error": "messages required"}), 400

    headers = {
        "Authorization": f"Bearer {HF_TOKEN}",
        "Content-Type": "application/json",
    }

    for model in [PRIMARY_MODEL, FALLBACK_MODEL]:
        try:
            payload = {
                "model": model,
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": temperature,
                "stream": False,
            }
            resp = requests.post(CHAT_API_URL, headers=headers, json=payload, timeout=90)
            resp.raise_for_status()
            result = resp.json()
            content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
            if content:
                return jsonify({"content": content, "model": model})
        except Exception as e:
            logger.warning(f"Model {model} failed: {e}")
            continue

    return jsonify({"content": "", "model": "none", "error": "All models failed"}), 502


@app.route("/api/stt", methods=["POST"])
def stt():
    """Transcribe uploaded audio via HF Inference API."""
    audio_file = request.files.get("audio")
    if not audio_file:
        return jsonify({"error": "No audio file"}), 400

    audio_bytes = audio_file.read()
    try:
        from huggingface_hub import InferenceClient
        client = InferenceClient(token=HF_TOKEN)
        result = client.automatic_speech_recognition(audio_bytes, model=STT_MODEL)
        text = ""
        if isinstance(result, dict):
            text = result.get("text", "")
        elif hasattr(result, "text"):
            text = result.text
        else:
            text = str(result) if result else ""
        return jsonify({"text": text})
    except Exception as e:
        logger.warning(f"STT failed: {e}")
        return jsonify({"text": "", "error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    print(f"\n  LLM Proxy running at http://localhost:{port}\n")
    app.run(host="0.0.0.0", port=port, debug=False)
