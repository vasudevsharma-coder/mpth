/**
 * MAHADEV POWERTOOLS & HARDWARE
 * Premium Vite-Powered Website — Main Entry
 */

import './style.css';
import 'swiper/css';
import 'swiper/css/pagination';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Swiper from 'swiper';
import { Pagination, Autoplay } from 'swiper/modules';

gsap.registerPlugin(ScrollTrigger);

// ─── Preloader ───
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const progress = document.getElementById('preloaderProgress');
  if (!preloader || !progress) return;

  let width = 0;
  const interval = setInterval(() => {
    width += Math.random() * 15 + 5;
    if (width >= 100) {
      width = 100;
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('hidden');
        gsap.to('.navbar, .hero, .services, .about, .contact, .footer', { opacity: 1, duration: 0.5 });
        initAllAnimations();
      }, 400);
    }
    progress.style.width = width + '%';
  }, 100);
}

// ─── Canvas Particle Background ───
function initCanvasBackground() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  const PARTICLE_COUNT = window.innerWidth < 768 ? 30 : 60;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.3 + 0.05;
      this.hue = Math.random() * 30 + 15; // orange range
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 90%, 55%, ${this.opacity})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(249, 115, 22, ${0.04 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  init();
  animate();
  window.addEventListener('resize', () => { resize(); });
}

// ─── Cursor Glow ───
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.innerWidth < 768) return;

  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  function lerp() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    glow.style.left = cx + 'px';
    glow.style.top = cy + 'px';
    requestAnimationFrame(lerp);
  }
  lerp();
}

// ─── Navbar ───
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active section highlight
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link[data-section]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 150;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    allNavLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  });
}

// ─── Smooth Scroll ───
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ─── Theme Toggle ───
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;
  const body = document.body;
  const iconPath = toggleBtn.querySelector('path');

  if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-theme');
    iconPath.setAttribute('d', 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'); // Moon icon
  } else {
    iconPath.setAttribute('d', 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'); // Sun icon
  }

  toggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    
    if (isLight) {
      iconPath.setAttribute('d', 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z');
    } else {
      iconPath.setAttribute('d', 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z');
    }
  });
}

// ─── Counter Animation ───
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target, duration: 2, ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.floor(this.targets()[0].val).toLocaleString();
          }
        });
      }
    });
  });
}

// ─── GSAP Scroll Animations ───
function initGSAPAnimations() {
  // Section headers
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header.children, {
      y: 40, opacity: 0, duration: 0.8, stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: header, start: 'top 85%', once: true }
    });
  });

  // Bento cards
  gsap.utils.toArray('.bento-card').forEach((card, i) => {
    gsap.from(card, {
      y: 50, opacity: 0, duration: 0.7, delay: i * 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 88%', once: true }
    });
  });

  // Gallery items
  gsap.utils.toArray('.gallery-item').forEach((item, i) => {
    gsap.from(item, {
      scale: 0.9, opacity: 0, duration: 0.6, delay: i * 0.06,
      ease: 'power3.out',
      scrollTrigger: { trigger: item, start: 'top 90%', once: true }
    });
  });

  // About section
  const aboutImgGroup = document.querySelector('.about-image-group');
  if (aboutImgGroup) {
    gsap.from(aboutImgGroup, {
      x: -60, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: aboutImgGroup, start: 'top 80%', once: true }
    });
  }
  const aboutText = document.querySelector('.about-text');
  if (aboutText) {
    gsap.from(aboutText.children, {
      x: 40, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: aboutText, start: 'top 80%', once: true }
    });
  }

  // Category cards
  gsap.utils.toArray('.cat-card').forEach((card, i) => {
    gsap.from(card, {
      y: 30, opacity: 0, duration: 0.5, delay: i * 0.04,
      ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 90%', once: true }
    });
  });

  // Contact tiles
  gsap.utils.toArray('.contact-tile').forEach((tile, i) => {
    gsap.from(tile, {
      y: 30, opacity: 0, duration: 0.6, delay: i * 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: tile, start: 'top 88%', once: true }
    });
  });

  // CTA banner
  const ctaContent = document.querySelector('.cta-content');
  if (ctaContent) {
    gsap.from(ctaContent.children, {
      y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: ctaContent, start: 'top 85%', once: true }
    });
  }

  // Hero animation on load
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    gsap.from('.hero-badge', { y: 20, opacity: 0, duration: 0.6, delay: 0.3 });
    gsap.from('.hero-line', { y: 60, opacity: 0, duration: 0.8, stagger: 0.12, delay: 0.5, ease: 'power3.out' });
    gsap.from('.hero-desc', { y: 30, opacity: 0, duration: 0.7, delay: 1 });
    gsap.from('.hero-cta-group', { y: 20, opacity: 0, duration: 0.6, delay: 1.2 });
    gsap.from('.hero-stats-bar', { y: 40, opacity: 0, duration: 0.7, delay: 1.4 });
  }

  // Parallax hero image
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    gsap.to(heroImg, {
      y: 80,
      scrollTrigger: {
        trigger: '.hero', start: 'top top', end: 'bottom top',
        scrub: 1
      }
    });
  }

  // Map card
  const mapCard = document.querySelector('.map-card');
  if (mapCard) {
    gsap.from(mapCard, {
      y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: mapCard, start: 'top 85%', once: true }
    });
  }
}

// ─── Swiper Testimonials ───
function initSwiper() {
  new Swiper('.testimonials-swiper', {
    modules: [Pagination, Autoplay],
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: { delay: 4000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: {
      640: { slidesPerView: 2, spaceBetween: 20 },
      1024: { slidesPerView: 3, spaceBetween: 24 },
    },
  });
}

// ─── Horizontal Category Scroll with Drag ───
function initCategoryScroll() {
  const wrapper = document.querySelector('.categories-scroll-wrapper');
  if (!wrapper) return;
  let isDown = false, startX, scrollLeft;

  wrapper.addEventListener('mousedown', (e) => {
    isDown = true; wrapper.style.cursor = 'grabbing';
    startX = e.pageX - wrapper.offsetLeft;
    scrollLeft = wrapper.scrollLeft;
  });
  wrapper.addEventListener('mouseleave', () => { isDown = false; wrapper.style.cursor = 'grab'; });
  wrapper.addEventListener('mouseup', () => { isDown = false; wrapper.style.cursor = 'grab'; });
  wrapper.addEventListener('mousemove', (e) => {
    if (!isDown) return; e.preventDefault();
    const x = e.pageX - wrapper.offsetLeft;
    wrapper.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
  wrapper.style.cursor = 'grab';
}

// ─── Magnetic Hover on Bento Cards ───
function initMagneticCards() {
  if (window.innerWidth < 768) return;
  document.querySelectorAll('.bento-card, .contact-tile').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      card.style.transform = `translateY(-4px) perspective(600px) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ─── Feedback Modal ───
function initFeedbackModal() {
  const modal = document.getElementById('feedbackModal');
  const openBtn = document.getElementById('navFeedbackBtn');
  const closeBtn = document.getElementById('feedbackClose');
  const submitBtn = document.getElementById('feedbackSubmit');
  const stars = document.querySelectorAll('.feedback-stars .star');
  let selectedRating = 0;

  if (!modal || !openBtn || !closeBtn) return;

  function openModal(e) {
    e.preventDefault();
    modal.classList.add('active');
    // Reset stars
    selectedRating = 0;
    stars.forEach(s => s.classList.remove('active'));
    submitBtn.classList.remove('active');
    submitBtn.disabled = true;
  }

  function closeModal() {
    modal.classList.remove('active');
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  stars.forEach(star => {
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.getAttribute('data-value'));
      stars.forEach(s => {
        if (parseInt(s.getAttribute('data-value')) <= selectedRating) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
      submitBtn.classList.add('active');
      submitBtn.disabled = false;
    });
  });

  submitBtn.addEventListener('click', () => {
    if (selectedRating > 0) {
      // General Google Maps search link to leave a review
      const query = encodeURIComponent("Mahadev PowerTools And Hardware Jarhabhata Mandir Chowk");
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
      closeModal();
    }
  });
}

// ─── Init Everything ───
function initAllAnimations() {
  initGSAPAnimations();
  animateCounters();
  initSwiper();
  initCategoryScroll();
  initMagneticCards();
  initFeedbackModal();
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initCanvasBackground();
  initCursorGlow();
  initNavbar();
  initSmoothScroll();
  initPreloader();
});
