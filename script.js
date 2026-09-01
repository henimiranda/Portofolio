// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE NAV =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 200;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
});

// ===== HERO PARTICLES =====
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 40; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  p.style.left = Math.random() * 100 + '%';
  p.style.top = Math.random() * 100 + '%';
  p.style.animationDelay = Math.random() * 4 + 's';
  p.style.animationDuration = (3 + Math.random() * 3) + 's';
  p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
  particlesContainer.appendChild(p);
}

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.stat-number');
let counterStarted = false;
function animateCounters() {
  counters.forEach(counter => {
    const target = +counter.dataset.target;
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// ===== SCROLL REVEAL =====
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Trigger counters
      if (entry.target.closest('.hero') && !counterStarted) {
        counterStarted = true;
        animateCounters();
      }
      // Trigger skill bars
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  });
}, observerOptions);

// Observe elements
document.querySelectorAll('.timeline-item, .speaking-card, .skill-card, .gallery-item, .contact-item, .about-grid, .hero-stats').forEach(el => {
  observer.observe(el);
});

// Observe hero for counters
const heroStats = document.querySelector('.hero-stats');
if (heroStats) observer.observe(heroStats);

// ===== TESTIMONIALS SLIDER =====
const testimonials = document.querySelectorAll('.testimonial-card');
const dotsContainer = document.getElementById('testimonialDots');
let currentSlide = 0;

testimonials.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

function goToSlide(index) {
  testimonials.forEach(t => t.classList.remove('active'));
  dotsContainer.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
  testimonials[index].classList.add('active');
  dotsContainer.children[index].classList.add('active');
  currentSlide = index;
}

setInterval(() => {
  goToSlide((currentSlide + 1) % testimonials.length);
}, 5000);

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.innerHTML = '<i class="fas fa-check"></i> Pesan Terkirim!';
  btn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Pesan';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
