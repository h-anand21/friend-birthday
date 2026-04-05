/**
 * ===================================================
 * GSAP & LENIS ANIMATIONS — animations.js
 * Enhancing the experience without changing the layout
 * ===================================================
 */

// Initialize Smooth Scrolling (Lenis)
const initLenis = () => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Integrate Lenis with ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
};

// Initialize GSAP Scroll Animations
const initGsapAnimations = () => {
  gsap.registerPlugin(ScrollTrigger);

  // 1. Page Load — Hero Section
  gsap.from(".hero-content > *", {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: "power3.out",
    delay: 6.8, // Wait for the Birthday Blast loader to finish (6.5s)
  });

  gsap.from(".hero-portrait-wrap", {
    scale: 0.9,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    delay: 7,
  });

  // 2. Scroll Animations — Text Elements
  // We target standard text elements across sections
  const textElements = document.querySelectorAll('.section-title, .section-subtitle, .section-tag, .hero-message, .footer-title, .footer-msg');
  textElements.forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });
  });

  // 3. Scroll Animations — Images
  const images = document.querySelectorAll('.photo-frame img, .marquee-img, .blast-photo img, .marquee-face-card img');
  images.forEach((img) => {
    gsap.from(img, {
      scrollTrigger: {
        trigger: img,
        start: "top 90%",
      },
      scale: 0.9,
      duration: 0.8,
      ease: "power1.out"
    });
  });

  // 4. Scroll Animations — Cards
  const cards = document.querySelectorAll('.photo-card, .message-card, .fw-card, .marquee-face-card');
  cards.forEach((card) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 88%",
      },
      y: 40,
      scale: 0.98,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.15
    });
  });

  // 5. Hover Effects (JS-based Smoothness)
  const buttons = document.querySelectorAll('.btn-primary, .btn-ghost, .social-btn, .nav-cta, .btn-blow');
  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, { scale: 1.05, duration: 0.3, ease: "power2.out" });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { scale: 1, duration: 0.3, ease: "power2.out" });
    });
  });

  const interactiveCards = document.querySelectorAll('.photo-card, .message-card, .fw-card');
  interactiveCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -5, duration: 0.3, ease: "power2.out" });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0, duration: 0.3, ease: "power2.out" });
    });
  });
};

// Check for mobile to reduce intensity
const isMobile = window.innerWidth <= 768;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  
  if (!isMobile) {
    initGsapAnimations();
  } else {
    // Reduced intensity for mobile as requested in JSON
    console.log("Mobile detected: Reducing GSAP intensity.");
    gsap.registerPlugin(ScrollTrigger);
    // Simple fade-ins only
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.from(el, {
        scrollTrigger: el,
        opacity: 0,
        y: 20,
        duration: 0.5
      });
    });
  }
});
