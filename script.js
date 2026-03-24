// ═══════════════════════════════════════
// LATAM SEG — Script principal
// ════════════════════════════════════════

// Header scroll effect
const header = document.getElementById('site-header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
}, { passive: true });

// Reveal on scroll
const revealItems = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealItems.forEach((item) => observer.observe(item));

// Mobile menu toggle
const mobileToggle = document.getElementById('mobile-toggle');
const siteNav = document.getElementById('site-nav');

if (mobileToggle && siteNav) {
  mobileToggle.addEventListener('click', () => {
    const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', !expanded);
    siteNav.classList.toggle('nav-open');
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const headerHeight = header.offsetHeight;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
    // Close mobile nav if open
    if (siteNav && siteNav.classList.contains('nav-open')) {
      siteNav.classList.remove('nav-open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// Form success handler
window.latamSegFormSuccess = function latamSegFormSuccess() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  form.innerHTML = `
    <div style="grid-column:1/-1;padding:32px;border:1px solid rgba(0,201,167,0.2);border-radius:16px;background:rgba(0,201,167,0.05);text-align:center">
      <strong style="display:block;font-size:1.25rem;color:#1a2744;margin-bottom:10px">Consulta recibida</strong>
      <span style="color:#5a6275;line-height:1.7;font-size:0.95rem">Ya tenemos tu contacto. El siguiente paso es bajar la operaci&oacute;n, la cantidad de puntos y el nivel de riesgo para dise&ntilde;ar la propuesta.</span>
    </div>
  `;
};

// Counter animation for stats
const statItems = document.querySelectorAll('.stat-item strong');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const text = el.textContent;
    // Only animate if it contains a number
    const match = text.match(/^([<>]?)(\d[\d.,]*)/);
    if (!match) return;
    const prefix = match[1];
    const targetStr = match[2];
    const suffix = text.replace(prefix + targetStr, '');
    const targetNum = parseInt(targetStr.replace(/[.,]/g, ''));
    
    if (isNaN(targetNum) || targetNum === 0) return;
    
    let current = 0;
    const duration = 1500;
    const step = targetNum / (duration / 16);
    
    const animate = () => {
      current += step;
      if (current >= targetNum) {
        el.innerHTML = prefix + targetStr + suffix;
        return;
      }
      const formatted = Math.floor(current).toLocaleString('es-AR');
      el.innerHTML = prefix + formatted + suffix;
      requestAnimationFrame(animate);
    };
    
    el.innerHTML = prefix + '0' + suffix;
    requestAnimationFrame(animate);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

statItems.forEach((item) => counterObserver.observe(item));
