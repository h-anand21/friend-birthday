/**
 * =====================================================
 * BIRTHDAY WEBSITE — script.js
 * Interactive effects, animations, and functionality
 * =====================================================
 */

/* ===================================================
   1. SPARKLE / PARTICLE CANVAS
   =================================================== */
(function initSparkles() {
  const canvas = document.getElementById('sparkleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Sparkle particle class
  class Sparkle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x  = Math.random() * canvas.width;
      this.y  = initial ? Math.random() * canvas.height : canvas.height + 10;
      this.r  = Math.random() * 3 + 1;
      this.alpha = 0;
      this.targetAlpha = Math.random() * 0.7 + 0.1;
      this.fadeIn = true;
      this.speedY = -(Math.random() * 0.4 + 0.1);
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.life   = 0;
      this.maxLife = Math.random() * 200 + 100;
      this.colors = ['#f9a8d4', '#c084fc', '#fcd34d', '#ffffff', '#e879f9', '#f472b6'];
      this.color  = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.twinkle = Math.random() * Math.PI * 2;
      this.twinkleSpeed = Math.random() * 0.05 + 0.01;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;
      this.twinkle += this.twinkleSpeed;

      // Fade in/out
      if (this.life < 60) {
        this.alpha += (this.targetAlpha - this.alpha) * 0.05;
      } else if (this.life > this.maxLife - 60) {
        this.alpha -= this.targetAlpha / 60;
      }

      if (this.life >= this.maxLife) this.reset();
    }

    draw() {
      const glow = 0.5 + 0.5 * Math.sin(this.twinkle);
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha) * glow;
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur  = 8;

      // Draw 4-pointed star
      ctx.beginPath();
      const r = this.r;
      ctx.moveTo(this.x,     this.y - r * 2);
      ctx.lineTo(this.x + r * 0.5, this.y - r * 0.5);
      ctx.lineTo(this.x + r * 2,   this.y);
      ctx.lineTo(this.x + r * 0.5, this.y + r * 0.5);
      ctx.lineTo(this.x,     this.y + r * 2);
      ctx.lineTo(this.x - r * 0.5, this.y + r * 0.5);
      ctx.lineTo(this.x - r * 2,   this.y);
      ctx.lineTo(this.x - r * 0.5, this.y - r * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  // Create initial sparkles
  for (let i = 0; i < 60; i++) particles.push(new Sparkle());

  function animateSparkles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateSparkles);
  }
  animateSparkles();
})();


/* ===================================================
   2. CONFETTI CANNON
   =================================================== */
const confettiCanvas  = document.getElementById('confettiCanvas');
const confettiCtx     = confettiCanvas.getContext('2d');
let confettiParticles = [];
let confettiRunning   = false;
let confettiTimer     = null;

function resizeConfetti() {
  confettiCanvas.width  = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeConfetti();
window.addEventListener('resize', resizeConfetti);

class ConfettiPiece {
  constructor() {
    this.reset();
  }

  reset() {
    this.x      = Math.random() * confettiCanvas.width;
    this.y      = -20;
    this.w      = Math.random() * 12 + 5;
    this.h      = Math.random() * 6 + 3;
    this.color  = ['#f9a8d4','#c084fc','#fcd34d','#86efac','#f87171','#60a5fa','#e879f9','#fb923c'][Math.floor(Math.random() * 8)];
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.15;
    this.speedY   = Math.random() * 4 + 2;
    this.speedX   = (Math.random() - 0.5) * 2;
    this.opacity  = 1;
    this.shape    = Math.random() > 0.5 ? 'rect' : 'circle';
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.y * 0.02) * 0.5;
    this.rotation += this.rotSpeed;
    if (this.y > confettiCanvas.height + 20) {
      this.opacity -= 0.05;
    }
  }

  draw() {
    confettiCtx.save();
    confettiCtx.globalAlpha  = Math.max(0, this.opacity);
    confettiCtx.fillStyle    = this.color;
    confettiCtx.shadowColor  = this.color;
    confettiCtx.shadowBlur   = 4;
    confettiCtx.translate(this.x, this.y);
    confettiCtx.rotate(this.rotation);

    if (this.shape === 'rect') {
      confettiCtx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
    } else {
      confettiCtx.beginPath();
      confettiCtx.arc(0, 0, this.w / 2.5, 0, Math.PI * 2);
      confettiCtx.fill();
    }
    confettiCtx.restore();
  }
}

function launchConfetti(duration = 4000) {
  confettiCanvas.style.display = 'block';
  confettiRunning = true;
  confettiParticles = [];

  // Create burst of particles
  for (let i = 0; i < 180; i++) {
    const p = new ConfettiPiece();
    p.y = -Math.random() * 200;  // stagger start heights
    confettiParticles.push(p);
  }

  function animateConfetti() {
    if (!confettiRunning) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiParticles = confettiParticles.filter(p => p.opacity > 0);
    confettiParticles.forEach(p => { p.update(); p.draw(); });

    if (confettiParticles.length > 0) {
      requestAnimationFrame(animateConfetti);
    } else {
      stopConfetti();
    }
  }

  animateConfetti();

  // Auto-stop
  clearTimeout(confettiTimer);
  confettiTimer = setTimeout(stopConfetti, duration);
}

function stopConfetti() {
  confettiRunning = false;
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiCanvas.style.display = 'none';
}


/* ===================================================
   3. NAVIGATION
   =================================================== */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

// Sticky nav scroll effect
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  highlightActiveNav();
});

// Hamburger — slide-in drawer
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

function closeMobileMenu() {
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('open');
}
window.closeMobileMenu = closeMobileMenu;

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
    closeMobileMenu();
  }
});

// Pill nav — highlight active link on scroll
function highlightActiveNav() {
  const sections = ['hero', 'photos', 'cake', 'messages', 'rsvp'];
  let current = 'hero';

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= 130) current = id;
  });

  // Map section id → nav link id
  const map = { hero:'nav-home', photos:'nav-photos', cake:'nav-cake', messages:'nav-messages' };

  document.querySelectorAll('.nav-pill-link').forEach(link => {
    link.classList.remove('active');
  });

  const activeLink = document.getElementById(map[current]);
  if (activeLink) activeLink.classList.add('active');
}


/* ===================================================
   4. HERO STAR PARTICLES
   =================================================== */
(function initHeroStars() {
  const container = document.getElementById('heroStars');
  if (!container) return;
  for (let i = 0; i < 40; i++) {
    const star = document.createElement('div');
    star.classList.add('star-particle');
    const size = Math.random() * 5 + 2;
    star.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random()*100}%; left:${Math.random()*100}%;
      animation-duration:${Math.random()*3+2}s;
      animation-delay:${Math.random()*4}s;
    `;
    container.appendChild(star);
  }
})();

/* ===================================================
   4b. HERO PORTRAIT — Thumbnail Switcher + Auto-Rotate
   =================================================== */
(function initHeroPortrait() {
  const primaryImg = document.getElementById('heroPrimaryImg');
  const thumbs = document.querySelectorAll('.hero-thumb');
  if (!primaryImg || !thumbs.length) return;

  // Click to switch
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const src = thumb.dataset.src;
      // Animate out → switch → animate in
      primaryImg.style.opacity = '0';
      primaryImg.style.transform = 'scale(0.9)';
      setTimeout(() => {
        primaryImg.src = src;
        primaryImg.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        primaryImg.style.opacity = '1';
        primaryImg.style.transform = 'scale(1)';
      }, 300);
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  // Auto-rotate every 3.5s
  let autoIdx = 0;
  setInterval(() => {
    autoIdx = (autoIdx + 1) % thumbs.length;
    thumbs[autoIdx].click();
  }, 3500);
})();

/* ===================================================
   4c. PHOTO CARD LIGHTBOX
   =================================================== */
(function initLightbox() {
  // Create lightbox DOM
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.innerHTML = `
    <div class="lb-overlay"></div>
    <div class="lb-content">
      <button class="lb-close"><i class="fas fa-xmark"></i></button>
      <button class="lb-prev"><i class="fas fa-chevron-left"></i></button>
      <button class="lb-next"><i class="fas fa-chevron-right"></i></button>
      <img class="lb-img" src="" alt="" />
      <div class="lb-caption"></div>
    </div>
  `;
  document.body.appendChild(lb);

  // Inject lightbox styles
  const lbStyle = document.createElement('style');
  lbStyle.textContent = `
    #lightbox {
      position:fixed; inset:0; z-index:99999;
      display:flex; align-items:center; justify-content:center;
      opacity:0; pointer-events:none; transition:opacity .4s ease;
    }
    #lightbox.open { opacity:1; pointer-events:all; }
    .lb-overlay {
      position:absolute; inset:0;
      background:rgba(5,2,15,0.92);
      backdrop-filter:blur(14px);
    }
    .lb-content {
      position:relative; z-index:2;
      max-width:90vw; max-height:90vh;
      display:flex; flex-direction:column; align-items:center; gap:14px;
      animation:lbZoom .4s ease;
    }
    @keyframes lbZoom{from{transform:scale(.85);opacity:0;}to{transform:scale(1);opacity:1;}}
    .lb-img {
      max-width:85vw; max-height:78vh;
      object-fit:contain; border-radius:16px;
      box-shadow:0 0 80px rgba(247,37,133,0.3), 0 30px 80px rgba(0,0,0,0.7);
      border:2px solid rgba(247,37,133,0.2);
    }
    .lb-caption {
      font-family:'Dancing Script',cursive; font-size:1.1rem;
      color:rgba(255,255,255,0.7); text-align:center;
    }
    .lb-close,.lb-prev,.lb-next {
      position:absolute; background:rgba(247,37,133,0.2);
      border:1px solid rgba(247,37,133,0.35);
      color:#fff; border-radius:50%; width:44px; height:44px;
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; font-size:1rem;
      transition:all .3s; backdrop-filter:blur(8px);
    }
    .lb-close { top:-50px; right:0; }
    .lb-prev  { left:-56px; top:50%; transform:translateY(-50%); }
    .lb-next  { right:-56px; top:50%; transform:translateY(-50%); }
    .lb-close:hover,.lb-prev:hover,.lb-next:hover {
      background:rgba(247,37,133,0.5); transform:scale(1.1);
    }
    .lb-prev:hover{transform:translateY(-50%) scale(1.1);}
    .lb-next:hover{transform:translateY(-50%) scale(1.1);}
  `;
  document.head.appendChild(lbStyle);

  const lbImg = lb.querySelector('.lb-img');
  const lbCaption = lb.querySelector('.lb-caption');
  const photoCards = [...document.querySelectorAll('.photo-card')];
  let currentIdx = 0;

  function getCardData(card) {
    const img = card.querySelector('.photo-frame img');
    const cap = card.querySelector('.polaroid-caption');
    return {
      src: img ? img.src : '',
      caption: cap ? cap.textContent.trim() : ''
    };
  }

  function openLightbox(idx) {
    currentIdx = idx;
    const { src, caption } = getCardData(photoCards[idx]);
    lbImg.src = src;
    lbCaption.textContent = caption;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showNext() {
    openLightbox((currentIdx + 1) % photoCards.length);
  }

  function showPrev() {
    openLightbox((currentIdx - 1 + photoCards.length) % photoCards.length);
  }

  // Bind click on each photo card frame
  photoCards.forEach((card, idx) => {
    const frame = card.querySelector('.photo-frame');
    if (frame) {
      frame.style.cursor = 'zoom-in';
      frame.addEventListener('click', () => openLightbox(idx));
    }
  });

  lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
  lb.querySelector('.lb-prev').addEventListener('click', showPrev);
  lb.querySelector('.lb-next').addEventListener('click', showNext);
  lb.querySelector('.lb-overlay').addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft')  showPrev();
  });
})();


/* ===================================================
   4d. FRIENDS WISH CAROUSEL
   =================================================== */
(function initFriendsCarousel() {
  const track   = document.getElementById('friendsWishTrack');
  const prevBtn = document.getElementById('fwPrev');
  const nextBtn = document.getElementById('fwNext');
  const dotsContainer = document.getElementById('fwDots');
  if (!track || !prevBtn || !nextBtn) return;

  const cards = [...track.querySelectorAll('.fw-card')];
  const total = cards.length;
  // How many cards visible at once (2 on desktop, 1 on mobile)
  function cardsVisible() { return window.innerWidth <= 860 ? 1 : 2; }

  let currentPage = 0;
  function totalPages() { return Math.ceil(total / cardsVisible()); }

  // Build dot indicators
  function buildDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalPages(); i++) {
      const dot = document.createElement('button');
      dot.className = 'fw-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Page ${i + 1}`);
      dot.addEventListener('click', () => goToPage(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    dotsContainer.querySelectorAll('.fw-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentPage);
    });
  }

  function goToPage(page) {
    const pages = totalPages();
    currentPage = Math.max(0, Math.min(page, pages - 1));
    const cv = cardsVisible();
    const cardW = cards[0].offsetWidth + 22; // width + gap
    track.style.transition = 'transform .45s cubic-bezier(0.4,0,0.2,1)';
    track.style.transform  = `translateX(-${currentPage * cv * cardW}px)`;
    updateDots();
    // Arrow states
    prevBtn.style.opacity = currentPage === 0 ? '0.35' : '1';
    nextBtn.style.opacity = currentPage >= pages - 1 ? '0.35' : '1';
  }

  prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
  nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

  // Touch / swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? goToPage(currentPage + 1) : goToPage(currentPage - 1);
  }, { passive: true });

  // Keyboard arrow keys when section in view
  document.addEventListener('keydown', e => {
    const section = document.getElementById('messages');
    if (!section) return;
    const r = section.getBoundingClientRect();
    if (r.top > window.innerHeight || r.bottom < 0) return;
    if (e.key === 'ArrowRight') goToPage(currentPage + 1);
    if (e.key === 'ArrowLeft')  goToPage(currentPage - 1);
  });

  // Auto-advance every 5 seconds
  let autoTimer = setInterval(() => {
    const next = currentPage >= totalPages() - 1 ? 0 : currentPage + 1;
    goToPage(next);
  }, 5000);

  // Pause auto on user interaction
  [prevBtn, nextBtn].forEach(btn => {
    btn.addEventListener('click', () => {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => {
        goToPage(currentPage >= totalPages() - 1 ? 0 : currentPage + 1);
      }, 6000);
    });
  });

  // Rebuild on resize
  window.addEventListener('resize', () => { buildDots(); goToPage(0); });

  buildDots();
  goToPage(0);
})();


/* ===================================================
   5. COUNTDOWN TIMER
   =================================================== */
(function initCountdown() {
  // Target: next April 4th
  function getNextBirthday() {
    const now = new Date();
    // Month is 0-indexed (3 = April). Set to April 4 at 00:00:00 (12 AM)
    let target = new Date(2026, 3, 4, 0, 0, 0); 
    
    // If the date has already passed this year, loop to next year
    if (now >= target) {
      target = new Date(now.getFullYear() + 1, 3, 4, 0, 0, 0);
    }
    return target;
  }

  const labels = {
    days:  document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins:  document.getElementById('cd-mins'),
    secs:  document.getElementById('cd-secs'),
  };

  function pad(n) { return String(n).padStart(2, '0'); }

  let blastFired = false;

  function updateCountdown() {
    const now   = new Date();
    const target = getNextBirthday();
    const diff  = target - now;

    if (diff <= 0) {
      // It's her birthday today!
      Object.values(labels).forEach(el => { if(el) el.textContent = '00'; });
      // Overlay is now handled globally on page load
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    if (labels.days)  labels.days.textContent  = pad(d);
    if (labels.hours) labels.hours.textContent = pad(h);
    if (labels.mins)  labels.mins.textContent  = pad(m);
    if (labels.secs)  labels.secs.textContent  = pad(s);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Removed manual click overlay from countdown since it is now an intro loader
})();


/* ===================================================
   5b. BIRTHDAY BLAST ANIMATION (Page Intro Loader)
   =================================================== */
window.showBirthdayBlast = function() {
  const blastOverlay = document.getElementById('blastOverlay');
  const blastContainer = document.getElementById('blastPhotosContainer');
  if (!blastOverlay || !blastContainer) return;

  // Additional images to explosion list
  const extraPhotos = [
    'src/group pic of friend/1699598723588.jpg', 'src/group pic of friend/IMG-20231213-WA0019.jpg',
    'src/group pic of friend/IMG-20240117-WA0053.jpg', 'src/group pic of friend/IMG-20240126-WA0081.jpg',
    'src/group pic of friend/IMG-20240221-WA0080.jpg', 'src/group pic of friend/IMG-20240419-WA0263.jpg',
    'src/group pic of friend/IMG-20240928-WA0056.jpg', 'src/group pic of friend/IMG-20241217-WA0064.jpg',
    'src/group pic of friend/IMG-20250211-WA0040.jpg', 'src/group pic of friend/IMG-20250611-WA0105.jpg',
    'src/group pic of friend/IMG_0345.jpg', 'src/group pic of friend/IMG_20250928_183404.jpg',
    'src/friends/deepak.jpg', 'src/friends/gaurav.jpg', 'src/friends/himu.jpg', 
    'src/friends/krish.jpg', 'src/friends/shreya.jpg', 'src/friends/polo.jpg',
    'src/1699598724565.jpg', 'src/1707760858213.jpg', 'src/IMG-20240117-WA0134.jpg',
    'src/IMG-20240404-WA0025.jpg', 'src/IMG-20241217-WA0084.jpg', 'src/IMG-20250228-WA0002.jpg',
    'src/IMG-20250506-WA0016.jpg', 'src/IMG-20250929-WA0062.jpg', 'src/IMG-20251015-WA0346.jpg',
    'src/IMG_20250703_125815.jpg', 'src/IMG_20251015_165704.jpg', 'src/Snapchat-1829057751.jpg',
    'src/Snapchat-30221113.jpg', 'src/Snapchat-464783577.jpg'
  ];

  // Shuffle and pick around 12–15 more to avoid over-cluttering but look full
  const selectedExtras = extraPhotos.sort(() => 0.5 - Math.random()).slice(0, 18);

  selectedExtras.forEach(src => {
    const photoDiv = document.createElement('div');
    photoDiv.className = 'blast-photo';
    
    // Random scattered positions
    const rx = (Math.random() * 80 - 40) + 'vw';
    const ry = (Math.random() * 70 - 35) + 'vh';
    const rot = (Math.random() * 50 - 25) + 'deg';
    const scale = (Math.random() * 0.4 + 0.8);
    
    photoDiv.style.cssText = `--x: ${rx}; --y: ${ry}; --rot: ${rot}; --scale: ${scale};`;
    photoDiv.innerHTML = `<img src="${src}" alt="Memory">`;
    blastContainer.appendChild(photoDiv);
  });
  
  // Instantly show the overlay on load
  blastOverlay.classList.add('active');
  document.body.style.overflow = 'hidden'; 

  // Fire confetti
  setTimeout(() => launchConfetti(6000), 500);

  // Animate photos in
  const photos = document.querySelectorAll('.blast-photo');
  photos.forEach((photo, i) => {
    setTimeout(() => {
      photo.classList.add('pop-in');
    }, 600 + (i * 250)); // Stagger slightly after text appears
  });

  // Auto-dismiss the entire overlay after 6.5 seconds to reveal the site!
  setTimeout(() => {
    blastOverlay.style.opacity = '0';
    blastOverlay.style.pointerEvents = 'none';
    document.body.style.overflow = '';
    
    // Slight zoom transition effect on the main hero when revealed
    const heroWrapper = document.querySelector('.hero-section');
    if (heroWrapper) {
      heroWrapper.style.animation = 'heroReveal 1.2s cubic-bezier(0.175, 0.885, 0.32, 1) forwards';
    }
  }, 6500);
}

// Auto trigger on script load!
window.showBirthdayBlast();

/* ===================================================
   6. CAKE — BLOW CANDLES INTERACTION
   =================================================== */
(function initCake() {
  const blowBtn   = document.getElementById('blowBtn');
  const candles   = document.querySelectorAll('.candle');
  const wishOverlay = document.getElementById('wishOverlay');
  const cakeHint  = document.getElementById('cakeHint');
  const cakeWrapper = document.getElementById('cakeWrapper');
  let blownCount = 0;

  if (!blowBtn) return;

  function blowNextCandle() {
    if (blownCount >= candles.length) return;

    // Blow one candle
    candles[blownCount].classList.add('blown');
    blownCount++;

    // Update hint text
    const remaining = candles.length - blownCount;
    if (remaining === 0) {
      // All candles blown!
      cakeHint.textContent = '🌟 All candles blown! Your wish is on its way!';
      blowBtn.innerHTML    = '<i class="fas fa-sparkles"></i> Wish Granted!';
      blowBtn.disabled     = true;

      // Show overlay, trigger confetti, and trigger virtual crowd of friends!
      setTimeout(() => {
        wishOverlay.classList.add('active');
        const virtualCrowd = document.getElementById('virtualCrowd');
        if (virtualCrowd) virtualCrowd.classList.add('active');
        launchConfetti(5000);
      }, 400);

    } else {
      cakeHint.textContent = `${remaining} candle${remaining > 1 ? 's' : ''} remaining — keep going! 💨`;
    }
  }

  blowBtn.addEventListener('click', () => {
    blowNextCandle();

    // Small wiggle animation on click
    cakeWrapper.style.transform = 'scale(1.05)';
    setTimeout(() => { cakeWrapper.style.transform = ''; }, 200);
  });

  // We removed the cake-only listener and moved it to the entire document below.
})();


/* ===================================================
   INTERACTIVE BACKGROUND BACKGROUND STARS & BALLOONS
   =================================================== */

// Tiny click spark effect (The "Star" effect!)
function createClickSpark(x, y) {
  const emojis = ['✨', '⭐', '🌟', '💫', '💖'];
  for (let i = 0; i < 5; i++) {
    const spark = document.createElement('div');
    spark.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    spark.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      font-size: ${Math.random() * 12 + 10}px;
      pointer-events: none;
      z-index: 99999;
      animation: sparkFly 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      --dx: ${(Math.random() - 0.5) * 120}px;
      --dy: ${-(Math.random() * 90 + 30)}px;
      --rot: ${Math.random() * 360}deg;
    `;
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 900);
  }
}

// Global click event to spawn stars everywhere!
document.addEventListener('click', (e) => {
  createClickSpark(e.clientX, e.clientY);
});

// Interactive Balloon Popping!
document.querySelectorAll('.balloon').forEach(balloon => {
  balloon.addEventListener('click', function(e) {
    // Prevent the body click from firing if we click a balloon (or let it fire for extra stars?)
    // Let's just let stars spawn + balloon pop!
    if (this.classList.contains('popped')) return;
    
    this.classList.add('popped');
    
    // Fire a localized confetti burst right where the balloon popped!
    const rect = this.getBoundingClientRect();
    const bx = (rect.left + rect.width / 2) / window.innerWidth;
    const by = (rect.top + rect.height / 2) / window.innerHeight;
    
    if (window.confetti) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x: bx, y: by },
        colors: ['#f72585', '#7209b7', '#4cc9f0', '#ffd166'],
        startVelocity: 30,
      });
    }
    
    // After it completes floating up completely (if it was somehow recycled), remove it.
    // Actually we can just leave it hidden since it has 'forwards' animation to scale(0)
  });
});

// Inject sparkFly animation for the stars
const sparkStyle = document.createElement('style');
sparkStyle.textContent = `
  @keyframes sparkFly {
    0%   { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; }
    100% { transform: translate(var(--dx), var(--dy)) scale(0.2) rotate(var(--rot)); opacity: 0; }
  }
`;
document.head.appendChild(sparkStyle);


/* ===================================================
   INSTAGRAM PROFILE MODAL HANDLER
   =================================================== */
(function initIgModal() {
  const igBtn = document.getElementById('igModalBtn');
  const igOverlay = document.getElementById('igModalOverlay');
  const igClose = document.getElementById('igClose');

  if (!igBtn || !igOverlay || !igClose) return;

  function openIg(e) {
    if(e) e.preventDefault();
    igOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeIg() {
    igOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  igBtn.addEventListener('click', openIg);
  igClose.addEventListener('click', closeIg);
  
  igOverlay.addEventListener('click', (e) => {
    // click out to close
    if (e.target === igOverlay) closeIg();
  });
})();


/* ===================================================
   SPOTIFY MAGICAL MODAL HANDLER
   =================================================== */
(function initSpModal() {
  const spBtn = document.getElementById('spModalBtn');
  const spOverlay = document.getElementById('spotifyModalOverlay');
  const spClose = document.getElementById('spotifyClose');

  if (!spBtn || !spOverlay || !spClose) return;

  function openSp(e) {
    if(e) e.preventDefault();
    spOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSp(e) {
    if(e) e.preventDefault();
    spOverlay.classList.remove('active');
    
    // Only restore scroll if we didn't just hop over to IG modal instead
    const igOverlay = document.getElementById('igModalOverlay');
    if (!igOverlay || !igOverlay.classList.contains('active')) {
      document.body.style.overflow = '';
    }
  }

  spBtn.addEventListener('click', openSp);
  spClose.addEventListener('click', closeSp);
  
  spOverlay.addEventListener('click', (e) => {
    if (e.target === spOverlay) closeSp();
  });
})();

/* ===================================================
   7. ENVELOPE — OPEN LETTER
   =================================================== */
(function initEnvelope() {
  const envelope    = document.getElementById('envelope');
  const openBtn     = document.getElementById('openLetterBtn');
  const envelopeSeal = document.getElementById('envelopeSeal');
  let isOpen = false;

  function toggleEnvelope() {
    isOpen = !isOpen;
    envelope.classList.toggle('open', isOpen);
    openBtn.innerHTML = isOpen
      ? '<i class="fas fa-envelope"></i> Close Letter'
      : '<i class="fas fa-envelope-open-text"></i> Open Your Letter';
  }

  if (openBtn) openBtn.addEventListener('click', toggleEnvelope);
  if (envelope) envelope.addEventListener('click', toggleEnvelope);
})();


/* ===================================================
   8. DIGITAL GIFT BOX INTERACTION
   =================================================== */
(function initGiftBox() {
  const giftBoxBtn = document.getElementById('giftBoxBtn');
  const theGift = document.querySelector('.the-gift');
  const giftHint = document.getElementById('giftHint');
  let opened = false;

  if (giftBoxBtn && theGift) {
    giftBoxBtn.addEventListener('click', () => {
      if (opened) return;
      opened = true;
      theGift.classList.add('opened');
      if (giftHint) giftHint.style.display = 'none';

      // Fire a special colored burst of confetti from the gift box!
      const rect = giftBoxBtn.getBoundingClientRect();
      const originX = (rect.left + rect.width / 2) / window.innerWidth;
      const originY = (rect.top + rect.height / 2) / window.innerHeight;

      if (window.confetti) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { x: originX, y: originY },
          colors: ['#f72585', '#7209b7', '#3a0ca3', '#4cc9f0', '#ffffff'],
          startVelocity: 45,
          gravity: 1.2
        });
      } else {
        launchConfetti(2000); 
      }
    });
  }
})();

/* ===================================================
   9. BIRTHDAY MUSIC TOGGLE
   =================================================== */
(function initMusic() {
  const toggle    = document.getElementById('musicToggle');
  const audio     = document.getElementById('birthdayAudio');
  const icon      = document.getElementById('musicIcon');
  const label     = document.getElementById('musicLabel');
  let playing     = false;

  if (!toggle || !audio) return;

  toggle.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      icon.className  = 'fas fa-music';
      label.textContent = 'Play Music 🎵';
      toggle.style.borderColor = '';
      toggle.style.background  = '';
    } else {
      audio.play().catch(() => {
        // Autoplay blocked — show notification
        label.textContent = '🔇 Playback blocked by browser';
        setTimeout(() => { label.textContent = 'Play Music 🎵'; }, 2500);
        return;
      });
      icon.className  = 'fas fa-pause';
      label.textContent = 'Pause Music ⏸️';
      toggle.style.borderColor = '#f9a8d4';
      toggle.style.background  = 'rgba(249,168,212,0.15)';
    }
    playing = !playing;
  });
})();


/* ===================================================
   10. SCROLL REVEAL (Intersection Observer)
   =================================================== */
(function initScrollReveal() {
  // Add reveal classes to elements
  const revealEls = [
    { selector: '.section-header',    cls: 'reveal' },
    { selector: '.photo-card',        cls: 'reveal' },
    { selector: '.message-card',      cls: 'reveal' },
    { selector: '.cake-area',         cls: 'reveal' },
    { selector: '.rsvp-content',      cls: 'reveal' },
    { selector: '.envelope-wrapper',  cls: 'reveal' },
    { selector: '.detail-item',       cls: 'reveal-left' },
  ];

  revealEls.forEach(({ selector, cls }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add(cls);
      el.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
})();


/* ===================================================
   11. HOVER SPARKLES ON PHOTO CARDS
   =================================================== */
document.querySelectorAll('.photo-card').forEach(card => {
  card.addEventListener('mouseenter', (e) => {
    const rect = card.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + 10;
    createClickSpark(x, y);
  });
});


/* ===================================================
   12. MOUSE TRAIL EFFECT (Premium feel)
   =================================================== */
(function initMouseTrail() {
  const trail = [];
  const trailLength = 8;
  const colors = ['#f9a8d4', '#c084fc', '#fcd34d', '#e879f9', '#f472b6'];

  for (let i = 0; i < trailLength; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      width: ${8 - i}px;
      height: ${8 - i}px;
      border-radius: 50%;
      background: ${colors[i % colors.length]};
      pointer-events: none;
      z-index: 99998;
      opacity: ${1 - i * 0.12};
      transition: left 0.05s, top 0.05s;
      box-shadow: 0 0 6px ${colors[i % colors.length]};
    `;
    document.body.appendChild(dot);
    trail.push({ el: dot, x: 0, y: 0 });
  }

  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  let frame = 0;
  function animateTrail() {
    frame++;
    // Only update every frame for smooth effect
    for (let i = trail.length - 1; i > 0; i--) {
      trail[i].x += (trail[i - 1].x - trail[i].x) * 0.4;
      trail[i].y += (trail[i - 1].y - trail[i].y) * 0.4;
      trail[i].el.style.left = trail[i].x - trail[i].el.offsetWidth / 2 + 'px';
      trail[i].el.style.top  = trail[i].y - trail[i].el.offsetHeight / 2 + 'px';
    }
    trail[0].x = mouseX;
    trail[0].y = mouseY;
    trail[0].el.style.left = mouseX - trail[0].el.offsetWidth / 2 + 'px';
    trail[0].el.style.top  = mouseY - trail[0].el.offsetHeight / 2 + 'px';

    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Hide trail on mobile / touch devices
  if ('ontouchstart' in window) {
    trail.forEach(t => t.el.style.display = 'none');
  }
})();


/* ===================================================
   13. PHOTO CARD — TILT EFFECT
   =================================================== */
document.querySelectorAll('.photo-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect  = card.getBoundingClientRect();
    const cx    = rect.left + rect.width / 2;
    const cy    = rect.top  + rect.height / 2;
    const dx    = (e.clientX - cx) / rect.width;
    const dy    = (e.clientY - cy) / rect.height;
    const tiltX = dy * 10;
    const tiltY = -dx * 10;
    card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});


/* ===================================================
   14. MESSAGE CARD — CLICK RIPPLE
   =================================================== */
document.querySelectorAll('.message-card').forEach(card => {
  card.addEventListener('click', function (e) {
    const rect   = card.getBoundingClientRect();
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      left: ${e.clientX - rect.left}px;
      top:  ${e.clientY - rect.top}px;
      width: 0; height: 0;
      background: rgba(240, 98, 146, 0.15);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: cardRipple 0.6s ease forwards;
      pointer-events: none;
      z-index: 10;
    `;
    card.style.position = 'relative';
    card.style.overflow = 'hidden';
    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes cardRipple {
    to { width: 400px; height: 400px; opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);


/* ===================================================
   15. SECTION TAG SPARKLE ON HOVER
   =================================================== */
document.querySelectorAll('.section-tag').forEach(tag => {
  tag.addEventListener('mouseenter', (e) => {
    const rect = tag.getBoundingClientRect();
    createClickSpark(rect.left + rect.width / 2, rect.top);
  });
});


/* ===================================================
   16. GIFT ICONS — CLICK CONFETTI BURST
   =================================================== */
document.querySelectorAll('.gift-icon').forEach(icon => {
  icon.style.cursor = 'pointer';
  icon.addEventListener('click', (e) => {
    createClickSpark(e.clientX, e.clientY);
  });
});


/* ===================================================
   17. FOOTER HEARTS — CLICK EFFECT
   =================================================== */
document.querySelectorAll('.fh').forEach(heart => {
  heart.style.cursor = 'pointer';
  heart.addEventListener('click', (e) => {
    createClickSpark(e.clientX, e.clientY);
    heart.style.animation = 'none';
    heart.style.transform = 'scale(1.8)';
    setTimeout(() => {
      heart.style.transform = '';
      heart.style.animation  = '';
    }, 300);
  });
});


/* ===================================================
   18. DYNAMIC PAGE TITLE BLINKING (If Tab Inactive)
   =================================================== */
(function initPageTitleBlink() {
  const original = document.title;
  const messages = [
    '🎂 Happy Birthday Rajashree Dhar!',
    '🎉 You are special!',
    '💖 Thinking of you!',
    '✨ Open your gift!',
  ];
  let idx = 0;
  let blinkInterval = null;

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      blinkInterval = setInterval(() => {
        document.title = messages[idx % messages.length];
        idx++;
      }, 1500);
    } else {
      clearInterval(blinkInterval);
      document.title = original;
      idx = 0;
    }
  });
})();


/* ===================================================
   19. SMOOTH SCROLL FOR ALL ANCHOR LINKS
   =================================================== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ===================================================
   20. BIRTHDAY CONFETTI ON PAGE LOAD (After 1s)
   =================================================== */
window.addEventListener('load', () => {
  setTimeout(() => {
    launchConfetti(3000);
  }, 1000);
});

/* ===================================================
   CONSOLE EASTER EGG
   =================================================== */
console.log('%c🎂 Happy Birthday Rajashree Dhar! 🎂', 'color: #e64d8e; font-size: 20px; font-weight: bold;');
console.log('%c✨ This page was made with love, just for you! ✨', 'color: #a855f7; font-size: 14px;');


/* ===================================================
   21. BACKGROUND MUSIC LOGIC
   =================================================== */
(function initMusic() {
  const bgMusic = document.getElementById('bgMusic');
  const musicBtn = document.getElementById('musicToggleBtn');
  let isPlaying = false;

  if (!bgMusic || !musicBtn) return;

  function toggleMusic() {
    if (isPlaying) {
      bgMusic.pause();
      musicBtn.innerHTML = '<i class="fas fa-volume-xmark"></i>';
      musicBtn.classList.remove('playing');
    } else {
      bgMusic.play().catch(e => console.log('Audio play blocked:', e));
      musicBtn.innerHTML = '<i class="fas fa-music"></i>';
      musicBtn.classList.add('playing');
    }
    isPlaying = !isPlaying;
  }

  musicBtn.addEventListener('click', toggleMusic);

  // Attempt absolute FORCE autoplay immediately on load (without waiting for clicks!)
  const forcePlay = () => {
    if (!isPlaying) {
      bgMusic.play().then(() => {
        isPlaying = true;
        musicBtn.innerHTML = '<i class="fas fa-music"></i>';
        musicBtn.classList.add('playing');
        ['click', 'scroll', 'touchstart', 'keydown'].forEach(evt => document.removeEventListener(evt, autoPlay));
      }).catch(e => console.log('Browsers strict block applied:', e));
    }
  };
  
  // Try instantly
  forcePlay();

  // Auto-play attempt on first user interaction globally as a fallback
  const autoPlay = () => {
    if (!isPlaying) forcePlay();
  };

  // Modern browsers block raw autoplay. We bind it to the first organic engagement.
  ['click', 'scroll', 'touchstart', 'keydown'].forEach(evt => {
    document.addEventListener(evt, autoPlay, { once: true });
  });
})();

/* ===================================================
   NEW: DYNAMIC ASSETS LOADING (Cake Faces & Footer)
   =================================================== */
(function initDynamicAssets() {
  const baseImages = [
    'src/1699598722875.jpg', 'src/1699598724565.jpg', 'src/1707760858213.jpg',
    'src/IMG-20231111-WA0040.jpg', 'src/IMG-20240117-WA0134.jpg', 'src/IMG-20240130-WA0098.jpg',
    'src/IMG-20240404-WA0025.jpg', 'src/IMG-20241007-WA0177.jpg', 'src/IMG-20241217-WA0076.jpg',
    'src/IMG-20241217-WA0084.jpg', 'src/IMG-20250225-WA0013.jpg', 'src/IMG-20250228-WA0002.jpg',
    'src/IMG-20250327-WA0033.jpg', 'src/IMG-20250403-WA0665.jpg', 'src/IMG-20250410-WA0101.jpg',
    'src/IMG-20250429-WA0053.jpg', 'src/IMG-20250506-WA0016.jpg', 'src/IMG-20250728-WA0016.jpg',
    'src/IMG-20250929-WA0062.jpg', 'src/IMG-20251015-WA0346.jpg', 'src/IMG-20251210-WA0777.jpg',
    'src/IMG_20240323_184223_827.jpg', 'src/IMG_20250611_154055.jpg', 'src/IMG_20250703_125815.jpg',
    'src/IMG_20250703_125844.jpg', 'src/IMG_20250703_130734.jpg', 'src/IMG_20250928_113641.jpg',
    'src/IMG_20250928_171847.jpg', 'src/IMG_20251015_165704.jpg', 'src/Snapchat-1573921257.jpg',
    'src/Snapchat-1829057751.jpg', 'src/Snapchat-30221113-1.jpg', 'src/Snapchat-30221113.jpg',
    'src/Snapchat-464783577.jpg'
  ];

  const groupImages = [
    'src/group pic of friend/1699598723588.jpg', 'src/group pic of friend/IMG-20231005-WA0067.jpg',
    'src/group pic of friend/IMG-20231213-WA0019.jpg', 'src/group pic of friend/IMG-20240108-WA0025.jpg',
    'src/group pic of friend/IMG-20240117-WA0053.jpg', 'src/group pic of friend/IMG-20240126-WA0081.jpg',
    'src/group pic of friend/IMG-20240221-WA0080.jpg', 'src/group pic of friend/IMG-20240419-WA0263.jpg',
    'src/group pic of friend/IMG-20240615-WA0014.jpg', 'src/group pic of friend/IMG-20241217-WA0064.jpg',
    'src/group pic of friend/IMG_0345.jpg', 'src/group pic of friend/IMG_20250928_183404.jpg'
  ];

  const friendImages = [
    'src/friends/arisha.jpg', 'src/friends/deepak.jpg', 'src/friends/gaurav.jpg',
    'src/friends/himu.jpg', 'src/friends/krish.jpg', 'src/friends/niloy.jpg',
    'src/friends/partiksha.jpg', 'src/friends/polo.jpg', 'src/friends/shiny.jpg',
    'src/friends/shreya.jpg'
  ];

  // Interleave everything for the Scrolling Memories (1 src -> 1 friend -> 1 group)
  const allImages = [];
  const maxImages = Math.max(baseImages.length, groupImages.length, friendImages.length);
  for (let i = 0; i < maxImages; i++) {
    if (i < baseImages.length) allImages.push(baseImages[i]);
    if (i < friendImages.length) allImages.push(friendImages[i]);
    if (i < groupImages.length) allImages.push(groupImages[i]);
  }

  // 1. Populate Cake Faces with Scrolling Track
  const cakeTiers = [
    { id: 'cakeTopFaces', count: 12, speed: '18s' },
    { id: 'cakeMidFaces', count: 15, speed: '22s' },
    { id: 'cakeBottomFaces', count: 18, speed: '26s' }
  ];

  let usedImages = 0;
  cakeTiers.forEach(tier => {
    const container = document.getElementById(tier.id);
    if (!container) return;
    
    // Create a track for the faces
    const track = document.createElement('div');
    track.className = 'cake-face-track';
    track.style.animationDuration = tier.speed; 
    
    const tierSet = [];
    for (let i = 0; i < tier.count; i++) {
        tierSet.push(allImages[usedImages % allImages.length]);
        usedImages++;
    }
    
    const infiniteSet = [...tierSet, ...tierSet];
    infiniteSet.forEach(imgSrc => {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.className = 'cake-face';
        img.alt = 'Decoration';
        track.appendChild(img);
    });
    
    container.innerHTML = '';
    container.appendChild(track);
  });

  // 2. Populate Footer Marquee (Infinite Loop)
  const marqueeTrack = document.getElementById('dynamicFooterTrack');
  if (marqueeTrack) {
    // Duplicate the list for seamless right-to-left loop
    const fullList = [...allImages, ...allImages];
    fullList.forEach(imgSrc => {
      const card = document.createElement('div');
      card.className = 'marquee-face-card';
      card.innerHTML = `<img src="${imgSrc}" alt="Memory" loading="lazy">`;
      marqueeTrack.appendChild(card);
    });
  }
})();
