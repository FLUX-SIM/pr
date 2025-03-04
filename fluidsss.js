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
const particleCount = 3000;

let selectedBarrier = null;
let offsetX = 0, offsetY = 0;

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
  ctx.fillStyle = 'rgba(255, 7, 7, 0.87)'; 
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 10;
}

function drawBarriers() {
  for (const barrier of barriers) {
    
    ctx.fillStyle = 'rgb(255, 255, 255)'; 
    ctx.fillRect(barrier.x, barrier.y, barrier.width, barrier.height);

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 10;
    ctx.strokeRect(barrier.x, barrier.y, barrier.width, barrier.height);
  }
}

    function updateParticles() {
      for (const particle of particles) {
        particle.x += particle.vx * animationSpeed;
        particle.y += particle.vy * animationSpeed;
    
        particle.vx *= 1 - 0.002 * viscosity;
        particle.vy *= 1 - 0.002 * viscosity;
    
        if (particle.x < 0) particle.vx = Math.abs(particle.vx);
        if (particle.x > canvas.width) particle.vx = -Math.abs(particle.vx);
        if (particle.y < 0) particle.vy = Math.abs(particle.vy);
        if (particle.y > canvas.height) particle.vy = -Math.abs(particle.vy);
    
        for (const barrier of barriers) {
          if (
            particle.x > barrier.x &&
            particle.x < barrier.x + barrier.width &&
            particle.y > barrier.y &&
            particle.y < barrier.y + barrier.height
          ) {
            particle.vx *= -0.8; 
            particle.vy *= -0.8;
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFluidEffect();
  drawBarriers();
  updateParticles();
  drawParticles();
  requestAnimationFrame(animate);
}

canvas.addEventListener('mousedown', (e) => {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;
  selectedBarrier = null;
  
  for (const barrier of barriers) {
    if (
      mouseX > barrier.x &&
      mouseX < barrier.x + barrier.width &&
      mouseY > barrier.y &&
      mouseY < barrier.y + barrier.height
    ) {
      selectedBarrier = barrier;
      offsetX = mouseX - barrier.x;
      offsetY = mouseY - barrier.y;
      return;
    }
  }
  
  if (!selectedBarrier) {
    barriers.push({ x: mouseX, y: mouseY, width: 100, height: 50 });
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (selectedBarrier) {
    selectedBarrier.x = e.offsetX - offsetX;
    selectedBarrier.y = e.offsetY - offsetY;
  }
});

canvas.addEventListener('mouseup', () => {
  selectedBarrier = null;
});

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
