const canvas = document.getElementById('fluidCanvas');
if (!canvas) {
  console.error("Canvas element with ID 'fluidCanvas' not found.");
}
const ctx = canvas.getContext('2d');

canvas.width = 850;
canvas.height = 500;

let viscosity = 1;
let flowSpeed = 10;
let animationSpeed = 1;
const barriers = [];

const particles = [];
const particleCount = 3000

function initializeParticles() {
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * flowSpeed,
      vy: (Math.random() - 0.5) * flowSpeed,
      color: `rgba(255, 20, 147, 0.6)`,
      size: Math.random() * 2 + 1
    });
  }
}
initializeParticles();

function drawBarriers() {
  ctx.fillStyle = 'white';
  for (const barrier of barriers) {
    ctx.fillRect(barrier.x, barrier.y, barrier.width, barrier.height);
  }
}

function updateParticles() {
  for (const particle of particles) {
    particle.x += particle.vx * animationSpeed;
    particle.y += particle.vy * animationSpeed;

    particle.vx *= 1 - 0.01 * viscosity;
    particle.vy *= 1 - 0.01 * viscosity;

    if (particle.x < 0) particle.x = canvas.width;
    if (particle.x > canvas.width) particle.x = 0;
    if (particle.y < 0) particle.y = canvas.height;
    if (particle.y > canvas.height) particle.y = 0;

    for (const barrier of barriers) {
      if (
        particle.x > barrier.x &&
        particle.x < barrier.x + barrier.width &&
        particle.y > barrier.y &&
        particle.y < barrier.y + barrier.height
      ) {
        particle.vx *= -1;
        particle.vy *= -1;
      }
    }
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const particle of particles) {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = particle.color;
    ctx.fill();
    ctx.closePath();
  }
}

function drawFluidEffect() {
  ctx.fillStyle = 'rgb(4, 117, 247)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function animate() {
  drawFluidEffect();
  drawBarriers();
  updateParticles();
  drawParticles();
  requestAnimationFrame(animate);
}

function restartAnimation() {
  particles.length = 0;
  initializeParticles();
}

function addBarrier() {
  const barrier = {
    x: Math.random() * (canvas.width - 100),
    y: Math.random() * (canvas.height - 50),
    width: 100,
    height: 50
  };
  barriers.push(barrier);
}

function removeLastBarrier() {
  if (barriers.length > 0) {
    barriers.pop();
  }
}

const viscosityInput = document.getElementById('viscosity');
const flowSpeedInput = document.getElementById('flowSpeed');
const animationSpeedInput = document.getElementById('animationSpeed');
const restartButton = document.getElementById('restart');
const addBarrierButton = document.getElementById('addBarrier');
const removeBarrierButton = document.getElementById('removeBarrier');

if (viscosityInput) {
  viscosityInput.addEventListener('input', (e) => {
    viscosity = parseFloat(e.target.value);
  });
}

if (flowSpeedInput) {
  flowSpeedInput.addEventListener('input', (e) => {
    flowSpeed = parseFloat(e.target.value);
    particles.forEach((particle) => {
      particle.vx = (Math.random() - 0.5) * flowSpeed;
      particle.vy = (Math.random() - 0.5) * flowSpeed;
    });
  });
}

if (animationSpeedInput) {
  animationSpeedInput.addEventListener('input', (e) => {
    animationSpeed = parseFloat(e.target.value);
  });
}

if (restartButton) {
  restartButton.addEventListener('click', restartAnimation);
}

if (addBarrierButton) {
  addBarrierButton.addEventListener('click', addBarrier);
}

if (removeBarrierButton) {
  removeBarrierButton.addEventListener('click', removeLastBarrier);
}

animate();
