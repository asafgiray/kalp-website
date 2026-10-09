(() => {
  "use strict";

  const cfg = Object.assign(
    { name: "", email: "", music: "", questionCats: [], happyCats: [] },
    window.KALP_CONFIG || {}
  );
  // ?test ile açınca "Evet" mail göndermez (kendin denerken işine yarar)
  const testMode = new URLSearchParams(location.search).has("test");

  const $ = (sel) => document.querySelector(sel);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const rand = (min, max) => min + Math.random() * (max - min);

  const question = $("#question");
  const celebration = $("#celebration");
  const yesBtn = $("#yes");
  const noBtn = $("#no");
  const cardCat = $("#card-cat");
  const soundBtn = $("#sound");
  const confetti = $(".confetti");
  const startedAt = Date.now();

  const NO_TEXTS = [
    "Hayır",
    "Emin misin? 🤨",
    "Gerçekten mi? 😳",
    "Bir daha düşün 🥺",
    "Son kararın mı? 😢",
    "Kalbimi kırıyorsun 💔",
    "Yapma böyle 😭",
    "Kediler üzülecek 🐱",
    "Bu buton bozuk galiba 😅",
    "Yakalayamazsın 😜",
    "Evet'e bas artık 😤",
    "Hayır diye bir seçenek yok 😌",
  ];

  let attempts = 0;
  let lastFlee = -Infinity;
  let freed = false;
  let done = false;
  let catMood = -1;

  /* ---------- Kedi GIF'leri ---------- */

  const isTenor = (src) => !/[/.]/.test(src);

  function catMedia(src, alt) {
    const wrap = document.createElement("div");
    wrap.className = "cat-media";
    if (/\.(mp4|webm)$/i.test(src)) {
      // Videoyu GIF gibi oynat: sessiz, döngüde, iPhone'da tam ekrana geçmeden
      const video = document.createElement("video");
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("aria-label", alt);
      video.src = src;
      wrap.append(video);
      video.play().catch(() => {});
      return wrap;
    }
    const img = new Image();
    img.alt = alt;
    img.decoding = "async";
    img.referrerPolicy = "no-referrer";
    if (isTenor(src)) {
      img.src = `https://tenor.com/view/${src}.gif`;
      img.onerror = () => {
        const frame = document.createElement("iframe");
        frame.src = `https://tenor.com/embed/${src.split("-").pop()}`;
        frame.title = alt;
        frame.loading = "lazy";
        frame.tabIndex = -1;
        img.replaceWith(frame);
      };
    } else {
      img.src = src;
    }
    wrap.append(img);
    return wrap;
  }

  function showCardCat(mood) {
    const src = cfg.questionCats[Math.min(mood, cfg.questionCats.length - 1)];
    if (mood === catMood || !src) return;
    catMood = mood;
    cardCat.replaceChildren(catMedia(src, "Tatlı kedi"));
  }

  /* ---------- Arkadaki kalpler ---------- */

  const hearts = $(".hearts");
  for (let i = 0; i < 16; i++) {
    const s = document.createElement("span");
    s.textContent = pick(["💗", "💕", "💖", "🤍", "💘"]);
    s.style.setProperty("--x", `${rand(0, 100)}vw`);
    s.style.setProperty("--size", `${rand(14, 36)}px`);
    s.style.setProperty("--dur", `${rand(9, 19)}s`);
    s.style.setProperty("--delay", `${-rand(0, 18)}s`);
    hearts.append(s);
  }

  /* ---------- Kaçan "Hayır" butonu ---------- */

  function freeNoButton() {
    if (freed) return;
    freed = true;
    const r = noBtn.getBoundingClientRect();
    noBtn.style.left = `${r.left}px`;
    noBtn.style.top = `${r.top}px`;
    noBtn.classList.add("free");
    document.body.append(noBtn);
    noBtn.getBoundingClientRect(); // geçiş animasyonu buradan başlasın
  }

  function pickSpot(w, h, px, py) {
    const m = 12;
    const maxX = Math.max(m, innerWidth - w - m);
    const maxY = Math.max(m, innerHeight - h - m);
    const yes = yesBtn.getBoundingClientRect();
    let best = { x: m, y: m };
    let bestDist = -1;
    for (let i = 0; i < 50; i++) {
      const x = rand(m, maxX);
      const y = rand(m, maxY);
      const hitsYes = x < yes.right + 12 && x + w > yes.left - 12 && y < yes.bottom + 12 && y + h > yes.top - 12;
      if (hitsYes) continue;
      const dist = Math.hypot(x + w / 2 - px, y + h / 2 - py);
      if (dist > 170) return { x, y };
      if (dist > bestDist) {
        bestDist = dist;
        best = { x, y };
      }
    }
    return best;
  }

  function puff(x, y) {
    const p = document.createElement("span");
    p.className = "puff";
    p.textContent = "💨";
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    p.addEventListener("animationend", () => p.remove());
    document.body.append(p);
  }

  function growYes() {
    const maxGrow = Math.max(
      1,
      Math.min(3.4, (innerWidth * 0.85) / yesBtn.offsetWidth, (innerHeight * 0.3) / yesBtn.offsetHeight)
    );
    const grow = Math.min(maxGrow, 1 + attempts * 0.16);
    yesBtn.style.setProperty("--grow", grow.toFixed(2));
    // Büyüyen buton yazıların üstüne binmesin diye etrafına yer aç
    yesBtn.parentElement.style.minHeight = `${Math.ceil(yesBtn.offsetHeight * grow) + 8}px`;
  }

  function flee(px, py, force) {
    if (done) return;
    const now = performance.now();
    if (now - lastFlee < (force ? 120 : 300)) return;
    lastFlee = now;
    attempts++;

    const old = noBtn.getBoundingClientRect();
    puff(old.left + old.width / 2, old.top + old.height / 2);
    freeNoButton();

    noBtn.textContent = attempts < NO_TEXTS.length ? NO_TEXTS[attempts] : pick(NO_TEXTS.slice(4));
    noBtn.style.scale = Math.max(0.7, 1 - attempts * 0.025).toFixed(3);
    const spot = pickSpot(noBtn.offsetWidth, noBtn.offsetHeight, px, py);
    noBtn.style.left = `${spot.x}px`;
    noBtn.style.top = `${spot.y}px`;
    noBtn.classList.remove("wiggle");
    void noBtn.offsetWidth;
    noBtn.classList.add("wiggle");

    growYes();
    showCardCat(attempts >= 8 ? 2 : attempts >= 3 ? 1 : 0);
  }

  function fleeFromSelf(force) {
    const r = noBtn.getBoundingClientRect();
    flee(r.left + r.width / 2, r.top + r.height / 2, force);
  }

  noBtn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    flee(e.clientX, e.clientY, true);
  });
  noBtn.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse") flee(e.clientX, e.clientY, false);
  });
  noBtn.addEventListener("click", (e) => {
    // Klavyeyle (Enter/Boşluk) basılırsa da kaçsın; dokunma sonrası gelen tıklamayı yok say
    e.preventDefault();
    if (performance.now() - lastFlee > 600) fleeFromSelf(true);
  });
  document.addEventListener("pointermove", (e) => {
    if (done || e.pointerType !== "mouse") return;
    const r = noBtn.getBoundingClientRect();
    const pad = 30;
    if (e.clientX > r.left - pad && e.clientX < r.right + pad && e.clientY > r.top - pad && e.clientY < r.bottom + pad) {
      flee(e.clientX, e.clientY, false);
    }
  });
  addEventListener("resize", () => {
    if (!freed || done) return;
    const x = Math.min(parseFloat(noBtn.style.left), innerWidth - noBtn.offsetWidth - 12);
    const y = Math.min(parseFloat(noBtn.style.top), innerHeight - noBtn.offsetHeight - 12);
    noBtn.style.left = `${Math.max(12, x)}px`;
    noBtn.style.top = `${Math.max(12, y)}px`;
  });

  /* ---------- Müzik ---------- */

  let audio = null;
  let audioFailed = !cfg.music;
  let musicStarted = false;
  let ctx = null;
  let synthGain = null;
  let synthOn = false;
  let muted = false;
  const SYNTH_VOLUME = 0.13;

  if (cfg.music) {
    audio = new Audio();
    audio.loop = true;
    audio.preload = "auto";
    audio.addEventListener("error", () => {
      audioFailed = true;
      if (musicStarted) startSynth();
    });
    audio.src = cfg.music;
  }

  function startMusic() {
    musicStarted = true;
    // AudioContext'i tıklama anında açıyoruz; mobil tarayıcılar ancak böyle izin veriyor
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctx.resume();
    } catch (_) {
      ctx = null;
    }
    if (audio && !audioFailed) {
      audio.play().catch(() => startSynth());
    } else {
      startSynth();
    }
  }

  // mp3 bulunamazsa çalacak neşeli yedek melodi
  function startSynth() {
    if (synthOn || !ctx) return;
    synthOn = true;
    synthGain = ctx.createGain();
    synthGain.gain.value = muted ? 0 : SYNTH_VOLUME;
    synthGain.connect(ctx.destination);

    const F = {
      C4: 261.63, F4: 349.23, G4: 392.0, A4: 440.0,
      C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0,
      C6: 1046.5, D6: 1174.66, E6: 1318.51,
    };
    const melody = [
      "C5", "E5", "G5", "C6", "E6", "C6", "E6", null,
      "D6", "C6", "A5", "C6", "G5", null, "G5", null,
      "A5", "C6", "A5", "G5", "E5", "G5", "C6", null,
      "D6", "D6", "E6", "D6", "C6", null, "C6", null,
    ];
    const bass = ["C4", "C4", "F4", "F4", "A4", "A4", "G4", "G4"];
    const step = 60 / 150 / 2;
    let i = 0;
    let next = ctx.currentTime + 0.05;

    const note = (freq, t, dur, type, vol) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(synthGain);
      o.start(t);
      o.stop(t + dur + 0.05);
    };

    const tick = () => {
      while (next < ctx.currentTime + 0.25) {
        const n = melody[i % melody.length];
        if (n) note(F[n], next, step * 0.9, "square", 0.5);
        if (i % 2 === 0) note(F[bass[(i / 4) % bass.length | 0]], next, step * 0.8, "triangle", 0.9);
        next += step;
        i++;
      }
    };
    tick();
    setInterval(tick, 60);
  }

  function setMuted(value) {
    muted = value;
    if (audio) audio.muted = muted;
    if (synthGain) synthGain.gain.value = muted ? 0 : SYNTH_VOLUME;
    soundBtn.textContent = muted ? "🔇" : "🔊";
    soundBtn.setAttribute("aria-label", muted ? "Sesi aç" : "Sesi kapat");
  }
  soundBtn.addEventListener("click", () => setMuted(!muted));

  document.addEventListener("visibilitychange", () => {
    if (!musicStarted) return;
    if (document.hidden) {
      if (audio) audio.pause();
      if (ctx) ctx.suspend();
    } else {
      if (audio && !audioFailed) audio.play().catch(() => {});
      if (ctx) ctx.resume();
    }
  });

  /* ---------- Bana haber ver ---------- */

  function formatDuration(ms) {
    const total = Math.round(ms / 1000);
    const min = Math.floor(total / 60);
    const sec = total % 60;
    return min ? `${min} dk ${sec} sn` : `${sec} sn`;
  }

  function notify() {
    const email = cfg.email.trim();
    if (!email || testMode) return;
    const data = {
      _subject: "💖 EVET DEDİ! 💖",
      _template: "box",
      Durum: "Çıkma teklifini KABUL ETTİ! 🎉🐱",
      "Hayır'a basma denemesi": attempts,
      "Karar süresi": formatDuration(Date.now() - startedAt),
      Zaman: new Date().toLocaleString("tr-TR"),
    };
    fetch(`https://formsubmit.co/ajax/${email}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
      keepalive: true,
    }).catch(() => {});
  }

  /* ---------- Evet! ---------- */

  function confettiBurst(count) {
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.textContent = pick(["💖", "💕", "😻", "😸", "🐱", "✨", "🎉", "💘", "🐾"]);
      s.style.setProperty("--x", `${rand(0, 100)}vw`);
      s.style.setProperty("--size", `${rand(18, 38)}px`);
      s.style.setProperty("--dur", `${rand(3, 6.5)}s`);
      s.style.setProperty("--drift", `${rand(-80, 80)}px`);
      s.style.setProperty("--rot", `${rand(-540, 540)}deg`);
      s.style.animationDelay = `${rand(0, count > 10 ? 1.2 : 0.3)}s`;
      s.addEventListener("animationend", () => s.remove());
      confetti.append(s);
    }
  }

  function celebrate() {
    if (done) return;
    done = true;
    startMusic();
    notify();

    noBtn.remove();
    question.hidden = true;

    const [mainCat, ...otherCats] = cfg.happyCats;
    if (mainCat) $("#main-cat").replaceChildren(catMedia(mainCat, "Happy happy happy kedi"));
    const grid = $("#cat-grid");
    otherCats.forEach((src, i) => {
      const tile = catMedia(src, "Sevinen kedi");
      tile.classList.add("tile");
      tile.style.setProperty("--d", `${0.5 + i * 0.3}s`);
      grid.append(tile);
    });

    celebration.hidden = false;
    soundBtn.hidden = false;
    scrollTo(0, 0);

    confettiBurst(60);
    setInterval(() => {
      if (!document.hidden) confettiBurst(3);
    }, 450);
  }

  yesBtn.addEventListener("click", celebrate);

  /* ---------- Başlangıç ---------- */

  if (cfg.name.trim()) $("#title").textContent = `${cfg.name.trim()}, sevgilim olur musun? 🥺👉👈`;
  showCardCat(0);

  // Kutlama kedilerini önceden yükle ki "Evet" anında hazır olsunlar
  setTimeout(() => {
    cfg.happyCats.forEach((src) => {
      if (!isTenor(src)) return;
      const img = new Image();
      img.referrerPolicy = "no-referrer";
      img.src = `https://tenor.com/view/${src}.gif`;
    });
  }, 1500);
})();
