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

// ===== ADMIN CONTENT RENDER =====
async function renderAdminContent() {
  const newsRoot = document.getElementById('adminNewsList');
  const experienceRoot = document.getElementById('adminExperienceList');

  if (!newsRoot && !experienceRoot) return;

  try {
    const response = await fetch('./content/content-manifest.json');
    if (!response.ok) return;

    const data = await response.json();
    const berita = Array.isArray(data.berita) ? data.berita : [];
    const pengalaman = Array.isArray(data.pengalaman) ? data.pengalaman : [];

    if (newsRoot) {
      berita.forEach(item => {
        const card = document.createElement('a');
        card.href = item.link_url || '#';
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.className = 'press-card';

        const dateText = item.date ? new Date(item.date).toLocaleDateString('id-ID', {
          day: 'numeric', month: 'long', year: 'numeric'
        }) : 'Tanggal tidak tersedia';

        card.innerHTML = `
          <div class="press-icon-box"><i class="fas fa-newspaper"></i></div>
          <div class="press-content">
            <span class="press-site">${item.media_name || 'Admin Content'}</span>
            <h4>${item.title || 'Judul belum tersedia'}</h4>
            <p>${item.summary || item.body || 'Belum ada ringkasan.'}</p>
            <small style="display:block; margin-top:8px; color:#6b7280;">${dateText}</small>
          </div>
        `;
        newsRoot.appendChild(card);
      });
    }

    if (experienceRoot) {
      pengalaman.forEach(item => {
        const itemNode = document.createElement('div');
        itemNode.className = 'timeline-item';

        const dateText = item.date ? new Date(item.date).toLocaleDateString('id-ID', {
          day: 'numeric', month: 'long', year: 'numeric'
        }) : 'Tanggal tidak tersedia';

        const imageUrl = item.image_url || item.image || '';
        const safeImageUrl = imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')
          ? `/${imageUrl.replace(/^\.\//, '')}`
          : imageUrl;

        const titleContent = item.link_url
          ? `<a href="${item.link_url}" target="_blank" rel="noopener noreferrer" class="timeline-link">${item.title || 'Judul kegiatan'}</a>`
          : `<h3>${item.title || 'Judul kegiatan'}</h3>`;

        const imageMarkup = safeImageUrl
          ? `<img src="${safeImageUrl}" alt="${item.title || 'Kegiatan'}" class="timeline-image" loading="lazy" style="max-width:100%; border-radius:12px; margin-top: 14px; margin-bottom: 12px; display:block; object-fit:cover;">`
          : '';

        itemNode.innerHTML = `
          <div class="timeline-dot"></div>
          <div class="timeline-card">
            <div class="timeline-year">${dateText}</div>
            ${titleContent}
            <div class="timeline-org">${item.category || 'Kegiatan Admin'}</div>
            ${imageMarkup}
            <p>${item.description || item.body || 'Keterangan kegiatan belum tersedia.'}</p>
          </div>
        `;
        experienceRoot.appendChild(itemNode);
      });
    }
  } catch (error) {
    console.warn('Tidak ada data admin yang tersedia:', error);
  }
}

renderAdminContent();

// ===== CONTACT FORM TO EMAIL REDIRECT =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();

    const subjectText = subject ? `Re: ${subject}` : 'Kontak Portfolio';
    const mailSubject = encodeURIComponent(subjectText);
    const mailBody = encodeURIComponent(
      `Halo Alamsyah Gautama,\n\nNama: ${name}\nEmail: ${email}\nKeperluan: ${subject}\n\nPesan:\n${message}`
    );

    window.location.href = `mailto:alamrambe1@gmail.com?subject=${mailSubject}&body=${mailBody}`;
  });
}
