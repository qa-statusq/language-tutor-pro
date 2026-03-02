class LanguageTutorApp {
  constructor() {
    this.curriculum = null;
    this.selectedLanguage = null;
    this.selectedLevel = null;
    this.selectedTopic = null;
    this.sessionId = null;
    this.isRecording = false;
    this.mediaRecorder = null;
    this.audioChunks = [];

    this.init();
  }

  async init() {
    this.bindElements();
    this.bindEvents();
    await this.loadCurriculum();
  }

  bindElements() {
    this.setupPanel = document.getElementById('setup-panel');
    this.chatPanel = document.getElementById('chat-panel');
    this.languageGrid = document.getElementById('language-grid');
    this.levelSection = document.getElementById('level-section');
    this.topicSection = document.getElementById('topic-section');
    this.topicGrid = document.getElementById('topic-grid');
    this.startSection = document.getElementById('start-section');
    this.startBtn = document.getElementById('start-btn');
    this.chatMessages = document.getElementById('chat-messages');
    this.messageInput = document.getElementById('message-input');
    this.sendBtn = document.getElementById('send-btn');
    this.voiceBtn = document.getElementById('voice-btn');
    this.recordingIndicator = document.getElementById('recording-indicator');
    this.newLessonBtn = document.getElementById('new-lesson-btn');
    this.chatLang = document.getElementById('chat-lang');
    this.chatLevel = document.getElementById('chat-level');
    this.chatTopic = document.getElementById('chat-topic');
    this.loadingOverlay = document.getElementById('loading-overlay');
    this.loadingText = document.getElementById('loading-text');
  }

  bindEvents() {
    this.startBtn.addEventListener('click', () => this.startLesson());
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    this.voiceBtn.addEventListener('click', () => this.toggleRecording());
    this.newLessonBtn.addEventListener('click', () => this.resetToSetup());
  }

  async loadCurriculum() {
    try {
      const res = await fetch('/api/curriculum');
      this.curriculum = await res.json();
      this.renderLanguages();
    } catch (err) {
      this.showError('Failed to load curriculum. Is the server running?');
    }
  }

  renderLanguages() {
    if (!this.curriculum) return;

    this.languageGrid.innerHTML = this.curriculum.languages.map(lang => `
      <div class="language-card" data-lang="${lang.key}">
        <span class="native-name">${lang.nativeName}</span>
        <span class="eng-name">${lang.name}</span>
      </div>
    `).join('');

    this.languageGrid.querySelectorAll('.language-card').forEach(card => {
      card.addEventListener('click', () => this.selectLanguage(card.dataset.lang));
    });
  }

  selectLanguage(langKey) {
    this.selectedLanguage = langKey;

    // Update UI selection
    this.languageGrid.querySelectorAll('.language-card').forEach(c => c.classList.remove('selected'));
    this.languageGrid.querySelector(`[data-lang="${langKey}"]`).classList.add('selected');

    // Show level section
    this.levelSection.style.display = '';
    this.selectedLevel = null;
    this.selectedTopic = null;
    this.topicSection.style.display = 'none';
    this.startSection.style.display = 'none';

    // Reset level selection
    document.querySelectorAll('.level-card').forEach(c => c.classList.remove('selected'));

    // Bind level cards
    document.querySelectorAll('.level-card').forEach(card => {
      card.onclick = () => this.selectLevel(card.dataset.level);
    });
  }

  selectLevel(level) {
    this.selectedLevel = level;

    document.querySelectorAll('.level-card').forEach(c => c.classList.remove('selected'));
    document.querySelector(`.level-card[data-level="${level}"]`).classList.add('selected');

    this.selectedTopic = null;
    this.startSection.style.display = 'none';
    this.topicSection.style.display = '';
    this.renderTopics(level);
  }

  renderTopics(level) {
    const topics = this.curriculum.topics[level] || [];

    this.topicGrid.innerHTML = topics.map(t => `
      <div class="topic-card" data-topic="${t.id}">
        <span class="topic-icon">${t.icon}</span>
        <span class="topic-title">${t.title}</span>
        <span class="topic-desc">${t.description}</span>
      </div>
    `).join('');

    this.topicGrid.querySelectorAll('.topic-card').forEach(card => {
      card.addEventListener('click', () => this.selectTopic(card.dataset.topic));
    });
  }

  selectTopic(topicId) {
    this.selectedTopic = topicId;

    this.topicGrid.querySelectorAll('.topic-card').forEach(c => c.classList.remove('selected'));
    this.topicGrid.querySelector(`[data-topic="${topicId}"]`).classList.add('selected');

    this.startSection.style.display = '';
  }

  async startLesson() {
    if (!this.selectedLanguage || !this.selectedLevel || !this.selectedTopic) return;

    this.showLoading('Starting your lesson...');

    try {
      const res = await fetch('/api/lesson/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: this.selectedLanguage,
          level: this.selectedLevel,
          topic: this.selectedTopic,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to start lesson');

      this.sessionId = data.sessionId;

      // Update chat header
      const lang = this.curriculum.languages.find(l => l.key === this.selectedLanguage);
      this.chatLang.textContent = `${lang.nativeName} (${lang.name})`;
      this.chatLevel.textContent = this.selectedLevel;

      const topics = this.curriculum.topics[this.selectedLevel];
      const topic = topics.find(t => t.id === this.selectedTopic);
      this.chatTopic.textContent = topic ? topic.title : '';

      // Switch panels
      this.setupPanel.style.display = 'none';
      this.chatPanel.style.display = 'flex';
      this.chatMessages.innerHTML = '';

      // Show tutor greeting
      this.addMessage('tutor', data.response);

    } catch (err) {
      this.showError(err.message);
    } finally {
      this.hideLoading();
    }
  }

  async sendMessage() {
    const text = this.messageInput.value.trim();
    if (!text || !this.sessionId) return;

    this.messageInput.value = '';
    this.addMessage('student', text);
    this.showLoading('Thinking...');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          message: text,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to get response');

      this.addMessage('tutor', data.response, data.audio, data.audioFormat);

    } catch (err) {
      this.addMessage('tutor', `Sorry, there was an error: ${err.message}`);
    } finally {
      this.hideLoading();
    }
  }

  async toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      await this.startRecording();
    }
  }

  async startRecording() {
    // Try MediaRecorder first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.audioChunks.push(e.data);
      };

      this.mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        await this.sendVoice(audioBlob);
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      this.voiceBtn.classList.add('recording');
      this.recordingIndicator.style.display = 'flex';
      return;
    } catch {
      // Fall through to Web Speech API
    }

    // Fallback: Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (e) => {
        const text = e.results[0][0].transcript;
        this.messageInput.value = text;
        this.sendMessage();
      };

      recognition.onerror = () => {
        this.showError('Speech recognition failed. Please type your message.');
      };

      recognition.onend = () => {
        this.isRecording = false;
        this.voiceBtn.classList.remove('recording');
        this.recordingIndicator.style.display = 'none';
      };

      recognition.start();
      this.isRecording = true;
      this.voiceBtn.classList.add('recording');
      this.recordingIndicator.style.display = 'flex';
    } else {
      this.showError('Voice recording is not supported in this browser.');
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
    }
    this.isRecording = false;
    this.voiceBtn.classList.remove('recording');
    this.recordingIndicator.style.display = 'none';
  }

  async sendVoice(audioBlob) {
    this.showLoading('Processing your voice...');

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('sessionId', this.sessionId);

      const res = await fetch('/api/voice', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Voice processing failed');

      // Show what was heard
      if (data.transcribedText) {
        this.addMessage('student', data.transcribedText);
      }

      this.addMessage('tutor', data.response, data.audio, data.audioFormat);

    } catch (err) {
      this.showError(err.message);
    } finally {
      this.hideLoading();
    }
  }

  addMessage(role, text, audioBase64 = null, audioFormat = null) {
    const label = role === 'tutor' ? 'Tutor' : 'You';

    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;

    let audioHtml = '';
    if (audioBase64 && audioFormat) {
      audioHtml = `<button class="message-audio-btn" onclick="app.playAudio('${audioBase64}', '${audioFormat}')">Play Audio</button>`;
    } else if (role === 'tutor') {
      // Offer browser TTS as fallback
      audioHtml = `<button class="message-audio-btn" onclick="app.speakText(this)" data-text="${this.escapeAttr(text)}">Speak</button>`;
    }

    msgDiv.innerHTML = `
      <div class="message-label">${label}</div>
      <div class="message-bubble">${this.formatMessage(text)}</div>
      ${audioHtml}
    `;

    this.chatMessages.appendChild(msgDiv);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  formatMessage(text) {
    // Basic sanitization
    let safe = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold: **text**
    safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic: *text*
    safe = safe.replace(/\*(.+?)\*/g, '<em>$1</em>');

    return safe;
  }

  escapeAttr(text) {
    return text.replace(/'/g, '&#39;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  playAudio(base64, format) {
    try {
      const mime = format === 'wav' ? 'audio/wav' : 'audio/mpeg';
      const byteChars = atob(base64);
      const byteArray = new Uint8Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        byteArray[i] = byteChars.charCodeAt(i);
      }
      const blob = new Blob([byteArray], { type: mime });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      audio.onended = () => URL.revokeObjectURL(url);
    } catch (err) {
      this.showError('Failed to play audio.');
    }
  }

  speakText(btn) {
    const text = btn.getAttribute('data-text');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    } else {
      this.showError('Browser speech synthesis not available.');
    }
  }

  resetToSetup() {
    this.sessionId = null;
    this.chatPanel.style.display = 'none';
    this.setupPanel.style.display = '';

    // Reset selections
    this.selectedLanguage = null;
    this.selectedLevel = null;
    this.selectedTopic = null;
    this.languageGrid.querySelectorAll('.language-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.level-card').forEach(c => c.classList.remove('selected'));
    this.levelSection.style.display = 'none';
    this.topicSection.style.display = 'none';
    this.startSection.style.display = 'none';
  }

  showLoading(text = 'Loading...') {
    this.loadingText.textContent = text;
    this.loadingOverlay.style.display = 'flex';
  }

  hideLoading() {
    this.loadingOverlay.style.display = 'none';
  }

  showError(message) {
    // Simple inline error - could enhance later
    console.error(message);
    alert(message);
  }
}

// Global instance
const app = new LanguageTutorApp();
