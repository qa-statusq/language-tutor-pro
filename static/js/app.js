/* Language Tutor - Main App */
(function () {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  const state = {
    curriculum: null,
    teachers: [],
    targetLang: null,
    instructionLang: null,
    level: null,
    topic: null,
    teacherId: null,
    sessionId: null,
    xp: 0,
    step: 1,
    muted: false,
    recording: false,
    mediaRecorder: null,
    audioChunks: [],
    keepAliveTimer: null,
  };

  // ---- DOM refs ----
  const dom = {};
  function bindDom() {
    dom.onboarding = $("#onboarding");
    dom.lesson = $("#lesson");
    dom.targetGrid = $("#targetLangGrid");
    dom.instrGrid = $("#instructionLangGrid");
    dom.levelGrid = $("#levelGrid");
    dom.teacherGrid = $("#teacherGrid");
    dom.topicGrid = $("#topicGrid");
    dom.btnStart = $("#btnStart");
    dom.btnBack = $("#btnStepBack");
    dom.lsLang = $("#lsLang");
    dom.lsTopic = $("#lsTopic");
    dom.tsPhoto = $("#tsPhoto");
    dom.tsName = $("#tsName");
    dom.tsStatus = $("#tsStatus");
    dom.chatMsgs = $("#chatMsgs");
    dom.msgInput = $("#msgInput");
    dom.btnSend = $("#btnSend");
    dom.btnMic = $("#btnMic");
    dom.btnEnd = $("#btnEnd");
    dom.btnQuiz = $("#btnQuiz");
    dom.btnMute = $("#btnMute");
    dom.btnCloseQuiz = $("#btnCloseQuiz");
    dom.quizOverlay = $("#quizOverlay");
    dom.quizBody = $("#quizBody");
    dom.quizFoot = $("#quizFoot");
    dom.xpVal = $("#xpVal");
    dom.icoVol = $("#icoVol");
    dom.icoMute = $("#icoMute");
    dom.teacherStrip = $("#teacherStrip");
  }

  // ---- Steps ----
  function goStep(n) {
    state.step = n;
    $$(".ob-panel").forEach((p) => p.classList.remove("active"));
    const panel = $(`#step${n}`);
    if (panel) panel.classList.add("active");

    $$(".ob-step-pill").forEach((p) => {
      const s = +p.dataset.s;
      p.classList.remove("active", "done");
      if (s < n) p.classList.add("done");
      if (s === n) p.classList.add("active");
    });

    dom.btnBack.classList.toggle("show", n > 1);
    updateStartBtn();
  }

  function updateStartBtn() {
    dom.btnStart.disabled = !(
      state.targetLang &&
      state.instructionLang &&
      state.level &&
      state.teacherId &&
      state.topic
    );
  }

  // ---- Render helpers ----
  function renderLanguageGrid(container, languages, onSelect, excludeKey) {
    container.innerHTML = languages
      .filter((l) => l.key !== excludeKey)
      .map(
        (l) => `
      <div class="g-lang" data-key="${l.key}">
        <span class="gl-flag">${l.flag}</span>
        <span class="gl-name">${l.name}</span>
        <span class="gl-native">${l.native_name}</span>
      </div>`
      )
      .join("");

    container.querySelectorAll(".g-lang").forEach((el) => {
      el.addEventListener("click", () => {
        container
          .querySelectorAll(".g-lang")
          .forEach((c) => c.classList.remove("sel"));
        el.classList.add("sel");
        onSelect(el.dataset.key);
      });
    });
  }

  function renderLevels() {
    if (!state.curriculum) return;
    const levels = state.curriculum.levels;
    dom.levelGrid.innerHTML = Object.entries(levels)
      .map(
        ([k, v]) => `
      <div class="g-level" data-key="${k}">
        <h3>${v.name}</h3>
        <p>${v.description}</p>
      </div>`
      )
      .join("");

    dom.levelGrid.querySelectorAll(".g-level").forEach((el) => {
      el.addEventListener("click", () => {
        dom.levelGrid
          .querySelectorAll(".g-level")
          .forEach((c) => c.classList.remove("sel"));
        el.classList.add("sel");
        state.level = el.dataset.key;
        goStep(4);
      });
    });
  }

  function renderTeachers() {
    dom.teacherGrid.innerHTML = state.teachers
      .map(
        (t) => `
      <div class="g-teacher" data-id="${t.id}" style="--tc:${t.color};--tc-l:${t.color_light}">
        <img class="gt-photo" src="${t.photo}" alt="${t.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22><rect fill=%22%23ddd%22 width=%2260%22 height=%2260%22/><text x=%2230%22 y=%2235%22 text-anchor=%22middle%22 font-size=%2224%22>${t.name[0]}</text></svg>'">
        <div class="gt-info">
          <div class="gt-name">${t.name}</div>
          <div class="gt-title">${t.title}</div>
          <div class="gt-style">${t.style}</div>
          <div class="gt-desc">${t.description}</div>
        </div>
      </div>`
      )
      .join("");

    dom.teacherGrid.querySelectorAll(".g-teacher").forEach((el) => {
      el.addEventListener("click", () => {
        dom.teacherGrid
          .querySelectorAll(".g-teacher")
          .forEach((c) => c.classList.remove("sel"));
        el.classList.add("sel");
        state.teacherId = el.dataset.id;
        renderTopics();
        goStep(5);
      });
    });
  }

  function renderTopics() {
    if (!state.curriculum || !state.level) return;
    const topics = state.curriculum.curriculum[state.level] || [];
    dom.topicGrid.innerHTML = topics
      .map(
        (t) => `
      <div class="g-topic" data-id="${t.id}">
        <span class="gt-icon">${t.icon}</span>
        <span class="gt-label">${t.title}</span>
        <span class="gt-sub">${t.description}</span>
      </div>`
      )
      .join("");

    dom.topicGrid.querySelectorAll(".g-topic").forEach((el) => {
      el.addEventListener("click", () => {
        dom.topicGrid
          .querySelectorAll(".g-topic")
          .forEach((c) => c.classList.remove("sel"));
        el.classList.add("sel");
        state.topic = el.dataset.id;
        updateStartBtn();
      });
    });
  }

  // ---- API ----
  async function loadCurriculum() {
    try {
      const res = await fetch("/api/curriculum");
      state.curriculum = await res.json();
    } catch (e) {
      console.error("Failed to load curriculum", e);
    }
  }

  async function loadTeachers() {
    try {
      const res = await fetch("/api/teachers");
      const data = await res.json();
      state.teachers = data.teachers || [];
    } catch (e) {
      console.error("Failed to load teachers", e);
    }
  }

  async function startSession() {
    dom.btnStart.disabled = true;
    dom.btnStart.textContent = "Starting...";
    setTeacherStatus("Preparing lesson...");

    try {
      const res = await fetch("/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_lang: state.targetLang,
          instruction_lang: state.instructionLang,
          level: state.level,
          topic: state.topic,
          teacher_id: state.teacherId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start session");

      state.sessionId = data.session_id;
      state.xp = 0;
      updateXp(0);

      // Set up lesson UI
      const lang = state.curriculum.languages.find(
        (l) => l.key === state.targetLang
      );
      dom.lsLang.textContent = lang
        ? `${lang.flag} ${lang.name}`
        : state.targetLang;

      const topics = state.curriculum.curriculum[state.level] || [];
      const topic = topics.find((t) => t.id === state.topic);
      dom.lsTopic.textContent = topic
        ? `${state.level} - ${topic.title}`
        : state.topic;

      // Teacher strip
      const teacher = state.teachers.find((t) => t.id === state.teacherId);
      if (teacher) {
        dom.tsPhoto.src = teacher.photo;
        dom.tsPhoto.alt = teacher.name;
        dom.tsName.textContent = teacher.name;
        dom.tsName.style.color = teacher.color;
        document.documentElement.style.setProperty("--tc", teacher.color);
        document.documentElement.style.setProperty(
          "--tc-l",
          teacher.color_light
        );
      }

      // Switch view
      dom.onboarding.classList.add("hidden");
      dom.lesson.classList.remove("hidden");
      dom.chatMsgs.innerHTML = "";

      addMessage("tutor", data.greeting);
      setTeacherStatus("Listening...");

      // Start keep-alive
      state.keepAliveTimer = setInterval(
        () => fetch("/api/ping", { method: "POST" }).catch(() => {}),
        120000
      );
    } catch (e) {
      alert(e.message);
      dom.btnStart.disabled = false;
      dom.btnStart.innerHTML =
        'Start Lesson <svg width="16" height="16" fill="none"><path d="M3 8h10m-4-4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
  }

  async function sendChat(text) {
    if (!text || !state.sessionId) return;
    addMessage("student", text);
    dom.msgInput.value = "";
    dom.msgInput.disabled = true;
    dom.btnSend.disabled = true;
    setTeacherStatus("Thinking...");
    showTyping();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: state.sessionId,
          message: text,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Chat failed");

      hideTyping();
      addMessage("tutor", data.reply);
      if (data.xp) updateXp(data.xp);
    } catch (e) {
      hideTyping();
      addMessage("tutor", "Sorry, something went wrong. Please try again.");
    } finally {
      dom.msgInput.disabled = false;
      dom.btnSend.disabled = false;
      dom.msgInput.focus();
      setTeacherStatus("Listening...");
    }
  }

  async function generateQuiz() {
    dom.quizOverlay.classList.remove("hidden");
    dom.quizBody.innerHTML =
      '<div class="quiz-loading">Generating quiz...</div>';
    dom.quizFoot.innerHTML = "";

    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: state.sessionId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Quiz failed");

      renderQuiz(data.quiz_text);
    } catch (e) {
      dom.quizBody.innerHTML =
        '<div class="quiz-loading">Failed to generate quiz. Try again later.</div>';
    }
  }

  function renderQuiz(text) {
    const blocks = text.split("[QUIZ]").filter((b) => b.trim());
    const questions = [];

    blocks.forEach((block) => {
      const clean = block.replace("[/QUIZ]", "").trim();
      const qMatch = clean.match(/Q:\s*(.+)/);
      const aMatch = clean.match(/A:\s*(.+)/);
      const bMatch = clean.match(/B:\s*(.+)/);
      const cMatch = clean.match(/C:\s*(.+)/);
      const dMatch = clean.match(/D:\s*(.+)/);
      const ansMatch = clean.match(/ANSWER:\s*([A-D])/i);

      if (qMatch && ansMatch) {
        questions.push({
          q: qMatch[1].trim(),
          opts: [
            { letter: "A", text: aMatch ? aMatch[1].trim() : "" },
            { letter: "B", text: bMatch ? bMatch[1].trim() : "" },
            { letter: "C", text: cMatch ? cMatch[1].trim() : "" },
            { letter: "D", text: dMatch ? dMatch[1].trim() : "" },
          ],
          answer: ansMatch[1].toUpperCase(),
        });
      }
    });

    if (!questions.length) {
      dom.quizBody.innerHTML = `<div style="font-size:.9rem;line-height:1.7;white-space:pre-wrap">${escHtml(text)}</div>`;
      dom.quizFoot.innerHTML =
        '<button class="btn-sec" id="btnDoneQuiz">Close</button>';
      $("#btnDoneQuiz").addEventListener("click", () =>
        dom.quizOverlay.classList.add("hidden")
      );
      return;
    }

    let score = 0;
    let answered = 0;

    dom.quizBody.innerHTML = questions
      .map(
        (q, i) => `
      <div class="q-block" data-qi="${i}">
        <div class="q-text">${i + 1}. ${escHtml(q.q)}</div>
        <div class="q-opts">
          ${q.opts
            .map(
              (o) => `
            <div class="q-opt" data-qi="${i}" data-letter="${o.letter}">
              <span class="q-opt-letter">${o.letter}</span>
              ${escHtml(o.text)}
            </div>`
            )
            .join("")}
        </div>
      </div>`
      )
      .join("");

    dom.quizBody.querySelectorAll(".q-opt").forEach((opt) => {
      opt.addEventListener("click", () => {
        const qi = +opt.dataset.qi;
        const block = dom.quizBody.querySelector(`.q-block[data-qi="${qi}"]`);
        if (block.classList.contains("answered")) return;
        block.classList.add("answered");
        answered++;

        const correct = questions[qi].answer;
        const picked = opt.dataset.letter;

        block.querySelectorAll(".q-opt").forEach((o) => {
          if (o.dataset.letter === correct) o.classList.add("correct");
          if (o.dataset.letter === picked && picked !== correct)
            o.classList.add("wrong");
        });

        if (picked === correct) score++;

        if (answered === questions.length) {
          const pct = Math.round((score / questions.length) * 100);
          const cls = pct >= 75 ? "great" : pct >= 50 ? "ok" : "low";
          dom.quizFoot.innerHTML = `
            <div class="quiz-score">
              <div class="quiz-score-num ${cls}">${pct}%</div>
              <div class="quiz-score-label">${score}/${questions.length} correct</div>
            </div>
            <button class="btn-pri" id="btnDoneQuiz">Close</button>`;
          $("#btnDoneQuiz").addEventListener("click", () =>
            dom.quizOverlay.classList.add("hidden")
          );
        }
      });
    });

    dom.quizFoot.innerHTML = "";
  }

  // ---- Chat UI helpers ----
  function addMessage(role, text) {
    const div = document.createElement("div");
    div.className = `msg ${role}`;
    div.innerHTML = formatMsg(text);
    dom.chatMsgs.appendChild(div);
    dom.chatMsgs.scrollTop = dom.chatMsgs.scrollHeight;

    if (role === "tutor" && !state.muted) speak(text);
  }

  function showTyping() {
    let el = $("#typingInd");
    if (el) return;
    el = document.createElement("div");
    el.id = "typingInd";
    el.className = "typing-ind";
    el.innerHTML =
      '<div class="t-dot"></div><div class="t-dot"></div><div class="t-dot"></div>';
    dom.chatMsgs.appendChild(el);
    dom.chatMsgs.scrollTop = dom.chatMsgs.scrollHeight;
  }

  function hideTyping() {
    const el = $("#typingInd");
    if (el) el.remove();
  }

  function setTeacherStatus(txt) {
    if (dom.tsStatus) dom.tsStatus.textContent = txt;
  }

  function updateXp(val) {
    state.xp = val;
    dom.xpVal.textContent = `${val} XP`;
  }

  function formatMsg(text) {
    let s = escHtml(text);
    // Strip raw format markers that LLM may still output
    s = s.replace(/\[\/?DIALOGUE\]/gi, "");
    s = s.replace(/\[\/?SENTENCE_BUILDER\]/gi, "");
    // Render [VOCAB]...[/VOCAB] blocks as styled vocab cards
    s = s.replace(
      /\[VOCAB\]\s*([\s\S]*?)\s*\[\/VOCAB\]/gi,
      '<div class="vocab-card">$1</div>'
    );
    // Cultural notes
    s = s.replace(
      /\[CULTURAL NOTE:\s*(.*?)\]/gi,
      '<div class="cultural-note"><div class="cultural-note-title">Cultural Note</div>$1</div>'
    );
    // Bold
    s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    // Italic
    s = s.replace(/\*(.+?)\*/g, "<em>$1</em>");
    // Line breaks
    s = s.replace(/\n/g, "<br>");
    return s;
  }

  function escHtml(t) {
    return t
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // ---- TTS with voice selection ----
  let voicesCache = [];

  function loadVoices() {
    voicesCache = window.speechSynthesis.getVoices();
  }

  function findVoice(langCode, gender) {
    if (!voicesCache.length) loadVoices();
    const prefix = (langCode || "").split("-")[0].toLowerCase();
    const genderKey = (gender || "").toLowerCase();

    // Keywords to match gender in voice names
    const femaleHints = ["female", "woman", "zira", "heera", "priya", "lekha", "meera", "samantha", "fiona", "paulina", "amelie", "haruka"];
    const maleHints = ["male", "man", "david", "ravi", "daniel", "thomas", "jorge", "takumi"];
    const hints = genderKey === "female" ? femaleHints : genderKey === "male" ? maleHints : [];

    // Filter voices matching language prefix
    const langVoices = voicesCache.filter((v) => v.lang.toLowerCase().startsWith(prefix));
    if (!langVoices.length) return null;

    // Try to find gender match
    if (hints.length) {
      const genderMatch = langVoices.find((v) => {
        const name = v.name.toLowerCase();
        return hints.some((h) => name.includes(h));
      });
      if (genderMatch) return genderMatch;
    }

    // Fallback to first voice for this language
    return langVoices[0];
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    // Strip markdown-like formatting for speech
    const clean = text
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/\[CULTURAL NOTE:.*?\]/gi, "")
      .replace(/\[\/?DIALOGUE\]/gi, "")
      .replace(/\[\/?SENTENCE_BUILDER\]/gi, "")
      .replace(/\[\/?VOCAB\]/gi, "");
    const utt = new SpeechSynthesisUtterance(clean);
    utt.rate = 0.85;

    // Look up instruction language BCP-47 code and teacher gender
    const instrLang = state.curriculum
      ? state.curriculum.languages.find((l) => l.key === state.instructionLang)
      : null;
    const langCode = instrLang ? instrLang.bcp47 : null;
    const teacher = state.teachers.find((t) => t.id === state.teacherId);
    const gender = teacher ? teacher.gender : null;

    if (langCode) {
      utt.lang = langCode;
      const voice = findVoice(langCode, gender);
      if (voice) utt.voice = voice;
    }

    // Slightly higher pitch for female voices
    if (gender === "female") utt.pitch = 1.1;

    utt.onstart = () => dom.tsPhoto && dom.tsPhoto.classList.add("speaking");
    utt.onend = () => dom.tsPhoto && dom.tsPhoto.classList.remove("speaking");
    window.speechSynthesis.speak(utt);
  }

  // ---- Recording (preview before send) ----
  function getInstructionBcp47() {
    if (!state.curriculum) return "en-US";
    const lang = state.curriculum.languages.find((l) => l.key === state.instructionLang);
    return lang ? lang.bcp47 : "en-US";
  }

  function setRecordingUI(active) {
    state.recording = active;
    dom.btnMic.classList.toggle("recording", active);
    const inputBox = dom.msgInput.closest(".input-box");
    if (inputBox) inputBox.classList.toggle("recording", active);
    if (active) {
      dom.msgInput.placeholder = "Listening...";
    } else {
      dom.msgInput.placeholder = "Type your message...";
    }
  }

  async function startRecording() {
    const SRClass = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SRClass) {
      // Primary: SpeechRecognition API — live transcript, preview before send
      const recog = new SRClass();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = getInstructionBcp47();
      state._speechRecog = recog;

      recog.onresult = (e) => {
        let transcript = "";
        for (let i = 0; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript;
        }
        dom.msgInput.value = transcript;
      };

      recog.onend = () => {
        setRecordingUI(false);
        state._speechRecog = null;
        // Text stays in input for user to review/edit — no auto-send
        dom.msgInput.focus();
      };

      recog.onerror = (e) => {
        if (e.error !== "aborted") {
          console.warn("SpeechRecognition error:", e.error);
        }
        setRecordingUI(false);
        state._speechRecog = null;
      };

      recog.start();
      dom.msgInput.value = "";
      setRecordingUI(true);
    } else {
      // Fallback: MediaRecorder → POST to /api/stt → fill input
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        state.mediaRecorder = new MediaRecorder(stream);
        state.audioChunks = [];

        state.mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) state.audioChunks.push(e.data);
        };

        state.mediaRecorder.onstop = async () => {
          stream.getTracks().forEach((t) => t.stop());
          const blob = new Blob(state.audioChunks, { type: "audio/webm" });
          dom.msgInput.placeholder = "Transcribing...";

          try {
            const fd = new FormData();
            fd.append("audio", blob, "recording.webm");
            const res = await fetch("/api/stt", { method: "POST", body: fd });
            const data = await res.json();
            if (data.text) {
              dom.msgInput.value = data.text;
            }
          } catch (err) {
            console.error("STT failed:", err);
          }

          setRecordingUI(false);
          dom.msgInput.focus();
        };

        state.mediaRecorder.start();
        dom.msgInput.value = "";
        dom.msgInput.placeholder = "Recording...";
        setRecordingUI(true);
      } catch {
        alert("Voice input not supported in this browser.");
      }
    }
  }

  function stopRecording() {
    // Stop SpeechRecognition if active
    if (state._speechRecog) {
      state._speechRecog.stop();
      state._speechRecog = null;
    }

    // Stop MediaRecorder if active
    if (state.mediaRecorder && state.mediaRecorder.state === "recording") {
      state.mediaRecorder.stop();
    }

    setRecordingUI(false);
  }

  // ---- End lesson ----
  function endLesson() {
    if (state.keepAliveTimer) clearInterval(state.keepAliveTimer);
    window.speechSynthesis && window.speechSynthesis.cancel();
    state.sessionId = null;

    dom.lesson.classList.add("hidden");
    dom.onboarding.classList.remove("hidden");

    // Reset selections
    state.targetLang = null;
    state.instructionLang = null;
    state.level = null;
    state.topic = null;
    state.teacherId = null;

    $$(".g-lang, .g-level, .g-teacher, .g-topic").forEach((el) =>
      el.classList.remove("sel")
    );
    dom.btnStart.disabled = true;
    dom.btnStart.innerHTML =
      'Start Lesson <svg width="16" height="16" fill="none"><path d="M3 8h10m-4-4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    goStep(1);
  }

  // ---- Init ----
  async function init() {
    bindDom();

    // Initialize TTS voices
    if ("speechSynthesis" in window) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    await Promise.all([loadCurriculum(), loadTeachers()]);

    if (!state.curriculum) {
      dom.targetGrid.innerHTML =
        '<p style="color:#f66;padding:12px">Failed to load languages. Is the server running?</p>';
      return;
    }

    // Render step 1: target language
    renderLanguageGrid(
      dom.targetGrid,
      state.curriculum.languages,
      (key) => {
        state.targetLang = key;
        // Re-render instruction grid excluding target
        renderLanguageGrid(
          dom.instrGrid,
          state.curriculum.languages,
          (k2) => {
            state.instructionLang = k2;
            renderLevels();
            goStep(3);
          },
          key
        );
        goStep(2);
      }
    );

    renderTeachers();
    goStep(1);

    // Events
    dom.btnBack.addEventListener("click", () => {
      if (state.step > 1) goStep(state.step - 1);
    });

    dom.btnStart.addEventListener("click", () => startSession());

    dom.btnSend.addEventListener("click", () =>
      sendChat(dom.msgInput.value.trim())
    );
    dom.msgInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendChat(dom.msgInput.value.trim());
      }
    });

    dom.btnMic.addEventListener("click", () => {
      state.recording ? stopRecording() : startRecording();
    });

    dom.btnEnd.addEventListener("click", () => endLesson());

    dom.btnQuiz.addEventListener("click", () => generateQuiz());
    dom.btnCloseQuiz.addEventListener("click", () =>
      dom.quizOverlay.classList.add("hidden")
    );

    dom.btnMute.addEventListener("click", () => {
      state.muted = !state.muted;
      dom.icoVol.classList.toggle("hidden", state.muted);
      dom.icoMute.classList.toggle("hidden", !state.muted);
      if (state.muted) window.speechSynthesis && window.speechSynthesis.cancel();
    });
  }

  // Boot
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
