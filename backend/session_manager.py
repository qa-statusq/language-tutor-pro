"""Thread-safe session management for conversation state."""

import threading
import time
import uuid


class Session:
    def __init__(self, session_id, target_lang, instruction_lang, level, topic, teacher_id):
        self.session_id = session_id
        self.target_lang = target_lang
        self.instruction_lang = instruction_lang
        self.level = level
        self.topic = topic
        self.teacher_id = teacher_id
        self.messages = []
        self.created_at = time.time()
        self.last_active = time.time()
        self.vocabulary_seen = []
        self.vocabulary_mastered = []
        self.xp = 0
        self.streak_correct = 0

    def add_message(self, role, content):
        self.messages.append({"role": role, "content": content})
        self.last_active = time.time()

    def get_messages(self):
        return list(self.messages)

    def add_xp(self, points):
        self.xp += points

    def to_dict(self):
        return {
            "session_id": self.session_id,
            "target_lang": self.target_lang,
            "instruction_lang": self.instruction_lang,
            "level": self.level,
            "topic": self.topic,
            "teacher_id": self.teacher_id,
            "message_count": len(self.messages),
            "xp": self.xp,
            "streak_correct": self.streak_correct
        }


class SessionManager:
    def __init__(self, max_sessions=100, session_ttl=3600):
        self._sessions = {}
        self._lock = threading.Lock()
        self._max_sessions = max_sessions
        self._session_ttl = session_ttl

    def create_session(self, target_lang, instruction_lang, level, topic, teacher_id):
        session_id = str(uuid.uuid4())
        session = Session(session_id, target_lang, instruction_lang, level, topic, teacher_id)
        with self._lock:
            self._cleanup_expired()
            if len(self._sessions) >= self._max_sessions:
                oldest_key = min(self._sessions, key=lambda k: self._sessions[k].last_active)
                del self._sessions[oldest_key]
            self._sessions[session_id] = session
        return session

    def get_session(self, session_id):
        with self._lock:
            session = self._sessions.get(session_id)
            if session and (time.time() - session.last_active) < self._session_ttl:
                return session
            if session:
                del self._sessions[session_id]
            return None

    def _cleanup_expired(self):
        now = time.time()
        expired = [sid for sid, s in self._sessions.items()
                    if (now - s.last_active) >= self._session_ttl]
        for sid in expired:
            del self._sessions[sid]


sessions = SessionManager()
