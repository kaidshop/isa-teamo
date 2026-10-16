// ============================================================
// CONFIGURACIÓN E INICIALIZACIÓN
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Inicializar funciones interactivas
  initCanvasHearts();
  initEnvelopeOpener();
  initLoveCounter();
  initLoveLetterDate();
  initReasonsGenerator();
  initEscapingNoButton();
  initMusicController();
});

// ============================================================
// REPRODUCTOR DE YOUTUBE: https://www.youtube.com/watch?v=bslNoCMejnw
// ============================================================
const YOUTUBE_VIDEO_ID = 'bslNoCMejnw';
let ytPlayer = null;
let ytReady = false;
let isAudioPlaying = false;

// Callback oficial de YouTube API
window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('yt-player', {
    height: '0',
    width: '0',
    videoId: YOUTUBE_VIDEO_ID,
    playerVars: {
      autoplay: 0,
      controls: 0,
      loop: 1,
      playlist: YOUTUBE_VIDEO_ID,
      playsinline: 1
    },
    events: {
      onReady: () => {
        ytReady = true;
      }
    }
  });
};

function playRomanticSong() {
  const musicStatus = document.getElementById('music-status');
  const musicIcon = document.querySelector('.music-icon');

  if (ytPlayer && ytReady && typeof ytPlayer.playVideo === 'function') {
    ytPlayer.playVideo();
    isAudioPlaying = true;
    if (musicStatus) musicStatus.textContent = "Reproduciendo tu canción 🎶";
    if (musicIcon) musicIcon.classList.add('spinning');
  } else {
    // Fallback con sintetizador suave si el reproductor de YouTube tarda en cargar
    toggleSynthMelody(true);
  }
}

function pauseRomanticSong() {
  const musicStatus = document.getElementById('music-status');
  const musicIcon = document.querySelector('.music-icon');

  if (ytPlayer && ytReady && typeof ytPlayer.pauseVideo === 'function') {
    ytPlayer.pauseVideo();
  }
  toggleSynthMelody(false);
  isAudioPlaying = false;
  if (musicStatus) musicStatus.textContent = "Música en pausa ⏸️";
  if (musicIcon) musicIcon.classList.remove('spinning');
}

function initMusicController() {
  const musicBtn = document.getElementById('music-btn');
  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (isAudioPlaying) {
        pauseRomanticSong();
      } else {
        playRomanticSong();
      }
    });
  }
}

// ============================================================
// 1. PARTICULAS FLOTANTES DE CORAZONES EN CANVAS
// ============================================================
function initCanvasHearts() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const hearts = [];
  const colors = ['#ffe5ec', '#fbb1bd', '#ffb3c6', '#ff8fa3'];

  class Heart {
    constructor(x, y, isBurst = false) {
      this.x = x ?? Math.random() * width;
      this.y = y ?? (isBurst ? y : height + Math.random() * 20);
      this.size = Math.random() * 14 + 10;
      this.speedY = isBurst ? (Math.random() - 0.5) * 6 : -(Math.random() * 1.5 + 0.6);
      this.speedX = isBurst ? (Math.random() - 0.5) * 6 : (Math.random() - 0.5) * 0.8;
      this.opacity = isBurst ? 1 : Math.random() * 0.6 + 0.3;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      this.isBurst = isBurst;
      this.life = isBurst ? 60 : Infinity;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      
      ctx.beginPath();
      const topCurveHeight = this.size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
      ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size);
      ctx.bezierCurveTo(0, this.size, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
      ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;

      if (this.isBurst) {
        this.life--;
        this.opacity = this.life / 60;
      }
    }
  }

  for (let i = 0; i < 25; i++) {
    hearts.push(new Heart());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    hearts.forEach((heart, index) => {
      heart.update();
      heart.draw();

      if (!heart.isBurst && heart.y < -30) {
        heart.y = height + 10;
        heart.x = Math.random() * width;
      }

      if (heart.isBurst && heart.life <= 0) {
        hearts.splice(index, 1);
      }
    });

    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('click', (e) => {
    for (let i = 0; i < 6; i++) {
      hearts.push(new Heart(e.clientX, e.clientY, true));
    }
  });
}

// ============================================================
// 2. APERTURA INTERACTIVA DEL SOBRE
// ============================================================
function initEnvelopeOpener() {
  const openBtn = document.getElementById('open-letter-btn');
  const envelopeBox = document.getElementById('envelope');
  const envelopeSection = document.getElementById('envelope-section');
  const mainContent = document.getElementById('main-content');

  function openLetter() {
    confetti({
      particleCount: 130,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#ffe5ec', '#ff758f', '#ffffff', '#fbb1bd']
    });

    // Iniciar canción elegida por el usuario
    playRomanticSong();

    envelopeSection.classList.add('fade-out');

    setTimeout(() => {
      mainContent.classList.add('visible');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  }

  if (openBtn) openBtn.addEventListener('click', openLetter);
  if (envelopeBox) envelopeBox.addEventListener('click', openLetter);
}

// ============================================================
// 3. CONTADOR DE TIEMPO JUNTOS (CALCULO DESDE EL 28 DE HACE 2 MESES)
// ============================================================
function initLoveCounter() {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const datePicker = document.getElementById('love-date-picker');

  // Calcular la fecha exacta:
  // Si cumplieron 1 mes el pasado 28, iniciaron el 28 del mes previo
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed (9 = Oct)
  
  // Mes de inicio = dos meses atrás si hoy es antes o después del 28
  let startMonth = currentMonth - 1;
  let startYear = currentYear;
  if (now.getDate() < 28) {
    // Si hoy estamos a 15, el mes pasado fue el mes anterior
    startMonth = currentMonth - 2;
  }
  if (startMonth < 0) {
    startMonth += 12;
    startYear -= 1;
  }

  // Formato YYYY-MM-DD
  const calculatedDefaultDate = `${startYear}-${String(startMonth + 1).padStart(2, '0')}-28`;

  // Recuperar fecha guardada o usar la calculada
  const initialDate = localStorage.getItem('isa_love_start_date') || calculatedDefaultDate;
  
  if (datePicker) {
    datePicker.value = initialDate;
    datePicker.addEventListener('change', (e) => {
      localStorage.setItem('isa_love_start_date', e.target.value);
      updateTimer();
    });
  }

  function updateTimer() {
    const selectedDateString = datePicker ? datePicker.value : initialDate;
    const startDate = new Date(selectedDateString + 'T00:00:00');
    const currentTime = new Date();
    
    const diff = Math.max(0, currentTime - startDate);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// ============================================================
// 4. FECHA DE LA CARTA
// ============================================================
function initLoveLetterDate() {
  const dateEl = document.getElementById('current-letter-date');
  if (dateEl) {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = today.toLocaleDateString('es-ES', options);
  }
}

// ============================================================
// 5. GENERADOR DE RAZONES PARA AMARTE
// ============================================================
function initReasonsGenerator() {
  const reasons = [
    "Amo cómo nos divertimos juntos jugando y riendo.",
    "Amo que cada 28 sea un recordatorio de lo mucho que te quiero.",
    "Amo tu voz, es la melodía más dulce que he escuchado.",
    "Amo que contigo puedo ser yo mismo sin miedo a nada.",
    "Amo la forma en que me miras y me haces sentir en las nubes.",
    "Amo tus abrazos, son mi lugar favorito en el mundo entero.",
    "Amo tus ocurrencias y la facilidad con la que me sacas una sonrisa.",
    "Amo soñar despierto e imaginar un futuro infinito a tu lado.",
    "Amo cuando nos quedamos hablando de cualquier tontería.",
    "Amo cómo te preocupas por mí con ese corazón tan noble.",
    "Amo que cada segundo a tu lado siempre se me pasa volando.",
    "Amo celebrar cada 28 a tu lado y ver cómo crece nuestro amor.",
    "Amo que eres mi personita favorita en todo el universo.",
    "Amo ver cómo sonríes cuando te digo que te amo.",
    "Amo cada detalle, cada gesto y cada momento juntos.",
    "Amo lo hermosa y única que eres por dentro y por fuera.",
    "Amo que me alegres el día con un solo mensajito tuyo.",
    "Amo nuestro primer mes y todos los meses que aún nos faltan por vivir.",
    "Amo que seas mi niña consentida.",
    "¡Y sobre todo, amo que existas y seas mi Isabela hermosa!"
  ];

  let currentIndex = 0;
  const reasonText = document.getElementById('reason-text');
  const reasonCard = document.getElementById('reason-card');
  const btnNext = document.getElementById('btn-next-reason');
  const reasonCounter = document.getElementById('reason-counter');

  if (!btnNext || !reasonText) return;

  btnNext.addEventListener('click', () => {
    reasonCard.style.opacity = '0';
    reasonCard.style.transform = 'scale(0.95)';

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % reasons.length;
      reasonText.textContent = `"${reasons[currentIndex]}"`;
      if (reasonCounter) {
        reasonCounter.textContent = `Razón ${currentIndex + 1} de ${reasons.length}`;
      }

      reasonCard.style.opacity = '1';
      reasonCard.style.transform = 'scale(1)';

      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#ffe5ec', '#ff758f', '#fbb1bd']
      });
    }, 250);
  });
}

// ============================================================
// 6. BOTÓN TRAVIESO "NO" QUE SE ESCAPA Y "SÍ" QUE CRECE
// ============================================================
function initEscapingNoButton() {
  const btnNo = document.getElementById('btn-no');
  const btnYes = document.getElementById('btn-yes');
  const acceptedMessage = document.getElementById('accepted-message');

  if (!btnNo || !btnYes) return;

  const playfulPhrases = [
    "¡Ups, se me escapó!",
    "¿Segura, mi amor? 🥺",
    "¡Ese botón no sirve!",
    "Por aquí no es 💕",
    "Ni lo pienses jaja",
    "¡El 'SÍ' te está esperando!"
  ];

  let phraseIndex = 0;
  let yesScale = 1;

  function moveNoButton() {
    const x = (Math.random() - 0.5) * 220;
    const y = (Math.random() - 0.5) * 120;
    btnNo.style.transform = `translate(${x}px, ${y}px)`;
    
    btnNo.textContent = playfulPhrases[phraseIndex % playfulPhrases.length];
    phraseIndex++;

    yesScale += 0.08;
    btnYes.style.transform = `scale(${yesScale})`;
  }

  btnNo.addEventListener('mouseenter', moveNoButton);
  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
  });

  btnYes.addEventListener('click', () => {
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ffe5ec', '#ff758f', '#fbb1bd', '#111113']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ffe5ec', '#ff758f', '#fbb1bd', '#ffffff']
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    btnNo.style.display = 'none';
    btnYes.style.display = 'none';
    acceptedMessage.classList.remove('hidden');
  });
}

// ============================================================
// SINTETIZADOR DE APOYO
// ============================================================
let audioCtx = null;
let synthInterval = null;

function toggleSynthMelody(play) {
  if (!play) {
    if (synthInterval) clearInterval(synthInterval);
    return;
  }

  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const notes = [261.63, 329.63, 392.00, 493.88, 523.25, 349.23, 440.00, 523.25];
  let step = 0;
  if (synthInterval) clearInterval(synthInterval);
  synthInterval = setInterval(() => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(notes[step % notes.length], audioCtx.currentTime);
    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.06, audioCtx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.6);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 1.6);
    step++;
  }, 700);
}
