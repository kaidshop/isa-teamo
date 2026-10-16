// ============================================================
// CONFIGURACIÓN E INICIALIZACIÓN
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Inicializar todas las funciones interactivas
  initCanvasHearts();
  initEnvelopeOpener();
  initLoveCounter();
  initLoveLetterDate();
  initReasonsGenerator();
  initEscapingNoButton();
  initWebAudioSynthesizer();
});

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
      
      // Dibujar forma de corazón con curvas Bezier
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

  // Crear corazones continuos de fondo
  for (let i = 0; i < 25; i++) {
    hearts.push(new Heart());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    hearts.forEach((heart, index) => {
      heart.update();
      heart.draw();

      // Reciclar corazones que salen por arriba
      if (!heart.isBurst && heart.y < -30) {
        heart.y = height + 10;
        heart.x = Math.random() * width;
      }

      // Eliminar partículas de click
      if (heart.isBurst && heart.life <= 0) {
        hearts.splice(index, 1);
      }
    });

    requestAnimationFrame(animate);
  }
  animate();

  // Crear mini explosión de corazones al hacer click en cualquier parte
  window.addEventListener('click', (e) => {
    // Si no es un botón interactivo, lanzar mini destellos
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
    // Lanzar confeti estelar
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ffe5ec', '#ff758f', '#ffffff', '#fbb1bd']
    });

    // Iniciar melodía suave automáticamente con la acción del usuario
    toggleMelody(true);

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
// 3. CONTADOR DE TIEMPO JUNTOS
// ============================================================
function initLoveCounter() {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const datePicker = document.getElementById('love-date-picker');

  // Recuperar fecha guardada o usar una por defecto
  const savedDate = localStorage.getItem('isa_love_start_date') || '2024-01-01';
  if (datePicker) {
    datePicker.value = savedDate;
    datePicker.addEventListener('change', (e) => {
      localStorage.setItem('isa_love_start_date', e.target.value);
      updateTimer();
    });
  }

  function updateTimer() {
    const startDate = new Date(datePicker ? datePicker.value : savedDate);
    const now = new Date();
    
    // Diferencia en milisegundos
    const diff = Math.max(0, now - startDate);

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
    "Amo cómo se ilumina tu carita cada vez que te ríes.",
    "Amo la paz que transmites con solo tomar mi mano.",
    "Amo tu voz, es la melodía más dulce que he escuchado en mi vida.",
    "Amo tu manera tan tierna y única de ver el mundo.",
    "Amo la forma en que me miras y me haces sentir la persona más afortunada.",
    "Amo tus abrazos, son mi refugio perfecto en cualquier tormenta.",
    "Amo cómo te preocupas por las personas que quieres con un corazón tan puro.",
    "Amo tus ocurrencias y la facilidad con la que me sacas una sonrisa.",
    "Amo que contigo puedo ser 100% yo mismo sin ningún miedo.",
    "Amo soñar despierto e imaginar un futuro infinito a tu lado.",
    "Amo la calidez de tus besitos inesperados.",
    "Amo lo inteligente y perseverante que eres para lograr lo que te propones.",
    "Amo cómo haces que los días más simples se conviertan en recuerdos inolvidables.",
    "Amo escuchar tus historias y ver el brillo en tus ojos al hablar.",
    "Amo la dulzura infinita que guardas en tu corazón.",
    "Amo que cada segundo contigo siempre sabe a poco.",
    "Amo que eres mi mejor amiga, mi compañera y el amor de mi vida.",
    "Amo tu paciencia y el amor con el que me acompañas día a día.",
    "Amo cada detalle, cada gesto y cada suspiro tuyo.",
    "Y sobre todo: ¡Amo que existas en este universo y seas mi Isabela!"
  ];

  let currentIndex = 0;
  const reasonText = document.getElementById('reason-text');
  const reasonCard = document.getElementById('reason-card');
  const btnNext = document.getElementById('btn-next-reason');
  const reasonCounter = document.getElementById('reason-counter');

  if (!btnNext || !reasonText) return;

  btnNext.addEventListener('click', () => {
    // Animación de salida
    reasonCard.style.opacity = '0';
    reasonCard.style.transform = 'scale(0.95)';

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % reasons.length;
      reasonText.textContent = `"${reasons[currentIndex]}"`;
      if (reasonCounter) {
        reasonCounter.textContent = `Razón ${currentIndex + 1} de ${reasons.length}`;
      }

      // Animación de entrada
      reasonCard.style.opacity = '1';
      reasonCard.style.transform = 'scale(1)';

      // Disparar pequeño confeti temático
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
    
    // Cambiar texto juguetonamente
    btnNo.textContent = playfulPhrases[phraseIndex % playfulPhrases.length];
    phraseIndex++;

    // Hacer crecer el botón SÍ
    yesScale += 0.08;
    btnYes.style.transform = `scale(${yesScale})`;
  }

  btnNo.addEventListener('mouseenter', moveNoButton);
  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
  });

  // Al hacer clic en SÍ
  btnYes.addEventListener('click', () => {
    // Gran explosión de confeti en toda la pantalla
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
// 7. SINTETIZADOR DE MÚSICA ROMÁNTICA (WEB AUDIO API)
// Sin necesidad de archivos mp3 externos que puedan fallar!
// ============================================================
let audioCtx = null;
let isMelodyPlaying = false;
let melodyInterval = null;

function initWebAudioSynthesizer() {
  const musicBtn = document.getElementById('music-btn');
  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      toggleMelody();
    });
  }
}

function toggleMelody(forcePlay = false) {
  const musicStatus = document.getElementById('music-status');
  const musicIcon = document.querySelector('.music-icon');

  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (forcePlay && isMelodyPlaying) return;

  if (isMelodyPlaying && !forcePlay) {
    // Detener melodía
    isMelodyPlaying = false;
    clearInterval(melodyInterval);
    if (musicStatus) musicStatus.textContent = "Pausado";
    if (musicIcon) musicIcon.classList.remove('spinning');
  } else {
    // Iniciar melodía suave estilo caja de música romántica (Lofi chimes)
    isMelodyPlaying = true;
    if (musicStatus) musicStatus.textContent = "Melodía sonando 🎶";
    if (musicIcon) musicIcon.classList.add('spinning');
    startRomanticChimes();
  }
}

function startRomanticChimes() {
  // Notas de acorde romántico cálido (Cmaj7 - Fmaj7 - G - Am)
  const notes = [
    261.63, 329.63, 392.00, 493.88, 523.25, 
    349.23, 440.00, 523.25, 659.25, 
    392.00, 493.88, 587.33, 
    440.00, 523.25, 659.25
  ];

  let step = 0;
  melodyInterval = setInterval(() => {
    if (!isMelodyPlaying) return;
    const freq = notes[step % notes.length];
    playSweetChime(freq);
    step++;
  }, 650);
}

function playSweetChime(frequency) {
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  // Tipo de onda sinusoidal pura y suave como campanas
  osc.type = 'sine';
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  // Envolvente de sonido suave (Fade in y fade out cálido)
  gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.8);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 1.8);
}
