// ============================================================
// CONFIGURACIÓN E INICIALIZACIÓN
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  initCanvasHearts();
  initEnvelopeOpener();
  initLoveCounter();
  initLoveLetterDate();
  initReasonsGenerator();
  initEscapingNoButton();
  initMusicController();
});

// ============================================================
// REPRODUCTOR DE MÚSICA: KRIS R - 4LIFE
// ============================================================
let isPlaying = false;

function getAudio() {
  return document.getElementById('romantic-audio');
}

function playSong() {
  const audio = getAudio();
  const musicStatus = document.getElementById('music-status');
  const musicIcon = document.querySelector('.music-icon');

  if (audio) {
    audio.play().then(() => {
      isPlaying = true;
      if (musicStatus) musicStatus.textContent = "KRIS R - 4LIFE 🎶";
      if (musicIcon) musicIcon.classList.add('spinning');
    }).catch((err) => {
      console.log("Audio esperando interacción del usuario:", err);
    });
  }
}

function pauseSong() {
  const audio = getAudio();
  const musicStatus = document.getElementById('music-status');
  const musicIcon = document.querySelector('.music-icon');

  if (audio) {
    audio.pause();
    isPlaying = false;
    if (musicStatus) musicStatus.textContent = "Música pausada ⏸️";
    if (musicIcon) musicIcon.classList.remove('spinning');
  }
}

function initMusicController() {
  const musicBtn = document.getElementById('music-btn');
  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (isPlaying) {
        pauseSong();
      } else {
        playSong();
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

    // Iniciar canción
    playSong();

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
// 3. CONTADOR DE TIEMPO JUNTOS (DESDE EL 28 DE AGOSTO)
// ============================================================
function initLoveCounter() {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const datePicker = document.getElementById('love-date-picker');

  // Limpiar cualquier residuo de 2024
  const stored = localStorage.getItem('isa_love_start_date');
  if (stored && stored.includes('2024')) {
    localStorage.removeItem('isa_love_start_date');
  }

  // Fecha fija: 28 de agosto (cumplieron 1 mes el 28 de septiembre)
  const officialStartDate = '2026-08-28';
  const effectiveDate = localStorage.getItem('isa_love_start_date') || officialStartDate;

  if (datePicker) {
    datePicker.value = effectiveDate;
    datePicker.addEventListener('change', (e) => {
      localStorage.setItem('isa_love_start_date', e.target.value);
      updateTimer();
    });
  }

  function updateTimer() {
    const selectedDateString = datePicker ? datePicker.value : effectiveDate;
    const startDate = new Date(selectedDateString + 'T00:00:00');
    const currentTime = new Date();
    
    const diff = Math.max(0, currentTime - startDate);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (daysEl) daysEl.textContent = String(days);
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
// 5. GENERADOR DE COSAS QUE SERGIO AMA DE ISABELA (A DISTANCIA)
// ============================================================
function initReasonsGenerator() {
  const reasons = [
    "Amo quedarme horas en videollamada contigo hasta que se nos pasa el tiempo sin darnos cuenta.",
    "Amo ver cómo te ríes frente a la pantalla y se te achinan los ojitos.",
    "Amo jugar Roblox juntos y hacer tonterías hasta tarde.",
    "Amo que cada 28 sea nuestro día especial y lo celebremos juntos.",
    "Amo cuando nos quedamos dormidos en llamada y saber que estás ahí conmigo.",
    "Amo que nos chateemos apenas nos despertemos, aunque siempre me levanto temprano yo... nah mentira jaja tú sabes que yo soy el dormilón.",
    "Amo cuando me cuentas cómo estuvo tu día con tanta emoción.",
    "Amo que la distancia no importe para nada cuando se trata de lo que sentimos.",
    "Amo imaginar el día exacto en que por fin llegue a donde estás y te dé ese abrazo tan esperado.",
    "Amo que seas mi niña consentida y la persona que más me alegra el día.",
    "Amo tus celitos tiernos y las caritas chistosas que me haces en la cámara.",
    "Amo cómo nos apoyamos en todo a pesar de los kilómetros.",
    "Amo que contigo puedo ser yo mismo, decir tonterías y reírnos a carcajadas.",
    "Amo planear todo lo que vamos a hacer juntos cuando nos veamos en persona.",
    "Amo nuestro primer mes y todos los meses que nos faltan por cumplir.",
    "Amo lo hermosa que eres, por fuera y sobre todo por dentro.",
    "Amo que seas tú, mi Isabela, la única dueña de mi corazón.",
    "¡Y sobre todo, amo ser tu novio y que tú seas mi niña hermosa!"
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
    "¡Ey, no se vale! 😂",
    "¿Segura, mi amor? 🥺",
    "¡Ni lo pienses jaja!",
    "El botón del 'NO' no sirve 💕",
    "¡El 'SÍ' te está esperando mi niña!"
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
