const page = document.querySelector('.page');
const btn = document.getElementById('continueBtn');
const bubble = document.querySelector('.bubble');
const canvas = document.querySelector('.confetti');
const ctx = canvas.getContext('2d');
let particles = [];
let rafId = null;

function resizeCanvas() {
  if (!canvas) return;
  const { width, height } = canvas.getBoundingClientRect();
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createParticles(count) {
  const colors = ['#7BDFF2', '#B9FBC0', '#FF7BAC', '#FDE74C', '#9B87F5'];
  const rect = canvas.getBoundingClientRect();
  for (let i = 0; i < count; i++) {
    const angle = (Math.random() * Math.PI) - (Math.PI / 2);
    const speed = 6 + Math.random() * 6;
    particles.push({
      x: rect.width / 2 + (Math.random() * 40 - 20),
      y: rect.height / 3,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (Math.random() * 2),
      g: 0.2 + Math.random() * 0.25,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 10,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 90 + Math.random() * 60,
      alpha: 1
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });
}

function updateParticles() {
  particles.forEach(p => {
    p.vy += p.g;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life -= 1;
    if (p.life < 30) p.alpha = Math.max(0, p.life / 30);
  });
  particles = particles.filter(p => p.life > 0 && p.y < canvas.height + 40);
}

function loop() {
  drawParticles();
  updateParticles();
  if (particles.length > 0) {
    rafId = requestAnimationFrame(loop);
  } else {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

function shootConfetti() {
  createParticles(140);
  if (!rafId) loop();
}

window.addEventListener('resize', resizeCanvas);
const ro = new ResizeObserver(resizeCanvas);
ro.observe(document.querySelector('.scene'));
resizeCanvas();

btn.addEventListener('click', () => {
  // Switch to celebrate state
  page.classList.add('celebrate');

  // Announce message for accessibility
  bubble.setAttribute('aria-live', 'polite');
  // Fire confetti
  shootConfetti();
  // Prevent repeated clicks
  btn.disabled = true;
  btn.style.filter = 'grayscale(0.15)';
});
