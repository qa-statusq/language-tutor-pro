"""HuggingFace Inference client — production-grade, direct HF Router calls."""

import os
import logging
import requests
import threading
import time

logger = logging.getLogger(__name__)

HF_TOKEN = os.environ.get("HF_TOKEN", "")

CHAT_API_URL = "https://router.huggingface.co/v1/chat/completions"
PRIMARY_MODEL = "Qwen/Qwen2.5-72B-Instruct"
FALLBACK_MODEL = "meta-llama/Llama-3.2-3B-Instruct"
STT_MODEL = "openai/whisper-base"

_keep_alive_thread = None
_keep_alive_running = False

# Reusable session for connection pooling (faster repeat requests)
_session = requests.Session()


def chat_completion(messages, max_tokens=1024, temperature=0.7):
    """Send chat completion to HF Router with automatic fallback and retry."""
    if not HF_TOKEN:
        return {"content": "Server not configured. Set HF_TOKEN in .env", "model": "none"}

    headers = {
        "Authorization": f"Bearer {HF_TOKEN}",
        "Content-Type": "application/json",
    }

    for model in [PRIMARY_MODEL, FALLBACK_MODEL]:
        for attempt in range(2):  # 1 retry per model
            try:
                payload = {
                    "model": model,
                    "messages": messages,
                    "max_tokens": max_tokens,
                    "temperature": temperature,
                    "stream": False,
                }
                resp = _session.post(CHAT_API_URL, headers=headers, json=payload, timeout=90)
                resp.raise_for_status()
                data = resp.json()
                content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                if content:
                    return {"content": content, "model": model}
            except requests.exceptions.Timeout:
                logger.warning(f"Model {model} timed out (attempt {attempt + 1})")
                continue
            except Exception as e:
                logger.warning(f"Model {model} failed (attempt {attempt + 1}): {e}")
                if attempt == 0:
                    time.sleep(1)
                continue

    return {
        "content": "I'm having trouble right now. Please try again.",
        "model": "fallback",
    }


def speech_to_text(audio_bytes):
    """Transcribe audio via HF Inference API."""
    if not audio_bytes or not HF_TOKEN:
        return ""
    try:
        from huggingface_hub import InferenceClient
        client = InferenceClient(token=HF_TOKEN)
        result = client.automatic_speech_recognition(audio_bytes, model=STT_MODEL)
        if isinstance(result, dict):
            return result.get("text", "")
        if hasattr(result, "text"):
            return result.text
        return str(result) if result else ""
    except Exception as e:
        logger.warning(f"STT failed: {e}")
        return ""


def keep_alive_ping():
    """Lightweight ping to keep models warm."""
    if not HF_TOKEN:
        return
    try:
        _session.post(
            CHAT_API_URL,
            headers={"Authorization": f"Bearer {HF_TOKEN}", "Content-Type": "application/json"},
            json={"model": PRIMARY_MODEL, "messages": [{"role": "user", "content": "ping"}], "max_tokens": 1, "stream": False},
            timeout=15,
        )
    except Exception:
        pass


def start_keep_alive(interval_seconds=180):
    """Start background keep-alive thread."""
    global _keep_alive_thread, _keep_alive_running
    if _keep_alive_running:
        return
    _keep_alive_running = True

    def _run():
        while _keep_alive_running:
            time.sleep(interval_seconds)
            if _keep_alive_running:
                keep_alive_ping()

    _keep_alive_thread = threading.Thread(target=_run, daemon=True)
    _keep_alive_thread.start()


def stop_keep_alive():
    global _keep_alive_running
    _keep_alive_running = False


def get_model_info():
    return {
        "llm": PRIMARY_MODEL,
        "llm_fallback": FALLBACK_MODEL,
        "stt": STT_MODEL,
        "token_set": bool(HF_TOKEN),
    }
