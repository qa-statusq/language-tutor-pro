---
title: Language Tutor LLM Proxy
emoji: 🤖
colorFrom: purple
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# Language Tutor — LLM Proxy

Lightweight proxy that forwards chat completion and STT requests to HuggingFace Inference API.

**Endpoints:**
- `POST /api/chat` — Chat completion (JSON body: `{messages, max_tokens, temperature}`)
- `POST /api/stt` — Speech-to-text (multipart form: `audio` file)
- `GET /api/health` — Health check

Set `HF_TOKEN` as a Space secret.
