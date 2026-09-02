// ===== GALLERY IMAGE SLIDER =====
const slides = document.querySelectorAll('.slider-item');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
const dotsContainer = document.getElementById('sliderDots');
let currentSlideIndex = 0;
let slideInterval;

if (slides.length > 0) {
  // Create pagination dots dynamically
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (index === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${index + 1}`);
    dot.addEventListener('click', () => showSlide(index));
    if (dotsContainer) dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.slider-dot');

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentSlideIndex = (index + slides.length) % slides.length;
    slides[currentSlideIndex].classList.add('active');
    if (dots[currentSlideIndex]) dots[currentSlideIndex].classList.add('active');
  }

  function nextSlide() {
    showSlide(currentSlideIndex + 1);
  }

  function prevSlide() {
    showSlide(currentSlideIndex - 1);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

  function startAutoplay() {
    slideInterval = setInterval(nextSlide, 4500);
  }

  function resetAutoplay() {
    clearInterval(slideInterval);
    startAutoplay();
  }

  startAutoplay();
}

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== MOBILE NAV MENU TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    if (navToggle) navToggle.classList.remove('active');
  });
});

// ===== ACTIVE NAVIGATION LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 150;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
});

// ===== ANIMATED COUNTERS =====
const counters = document.querySelectorAll('.stat-number');
let counterStarted = false;

function animateCounters() {
  counters.forEach(counter => {
    const target = +counter.dataset.target;
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    }
    requestAnimationFrame(update);
  });
}

// Trigger counters when hero section is visible
const heroSection = document.getElementById('home');
if (heroSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counterStarted) {
        counterStarted = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });
  observer.observe(heroSection);
}

// ===== CONTACT FORM TO WHATSAPP REDIRECT =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    const waNumber = "6281375992892";
    const formattedText = `Halo Bung Alamsyah Gautama,

Saya: *${name}* (${email})
Keperluan: *${subject}*

Pesan:
${message}
`;

    const encodedText = encodeURIComponent(formattedText);
    const waUrl = `https://wa.me/${waNumber}?text=${encodedText}`;

    window.open(waUrl, '_blank');
  });
}
