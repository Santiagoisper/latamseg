const revealItems = Array.from(document.querySelectorAll('.reveal'));

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const delay = Number(entry.target.dataset.delay || 0);
    window.setTimeout(() => {
      entry.target.classList.add('is-visible');
    }, delay);
    observer.unobserve(entry.target);
  }
}, { threshold: 0.18 });

revealItems.forEach((item) => observer.observe(item));

const gauge = document.querySelector('.gauge');
if (gauge) {
  const value = Number(getComputedStyle(gauge).getPropertyValue('--gauge-value').trim() || '72');
  gauge.animate(
    [
      { transform: 'scale(0.92)', opacity: 0.3 },
      { transform: 'scale(1)', opacity: 1 }
    ],
    { duration: 900, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
  );
  gauge.setAttribute('aria-label', `Impacto potencial ${value}%`);
}

const canvas = document.getElementById('grid-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawGrid(time) {
  if (!canvas || !ctx) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  ctx.clearRect(0, 0, w, h);

  const step = 42;
  ctx.strokeStyle = 'rgba(117, 191, 255, 0.08)';
  ctx.lineWidth = 1;

  for (let x = 0; x <= w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  for (let y = 0; y <= h; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  const waveY = h * 0.22;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 8) {
    const y = waveY + Math.sin((x * 0.011) + (time * 0.0015)) * 18;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = 'rgba(56, 216, 200, 0.35)';
  ctx.lineWidth = 1.6;
  ctx.stroke();

  requestAnimationFrame(drawGrid);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
requestAnimationFrame(drawGrid);

window.latamSegFormSuccess = function latamSegFormSuccess() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  form.innerHTML = '<div style="grid-column:1 / -1;padding:28px;border:1px solid rgba(117,191,255,.22);border-radius:20px;background:rgba(117,191,255,.08);color:#ebf6ff"><strong style="display:block;font-family:Space Grotesk,sans-serif;font-size:1.25rem;margin-bottom:8px">Consulta recibida</strong><span style="color:#8ea8bb;line-height:1.7">Ya tenemos tu contacto. El siguiente paso es bajar la operacion, la cantidad de puntos y el nivel de riesgo para diseñar la propuesta.</span></div>';
};
