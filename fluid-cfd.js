document.addEventListener("DOMContentLoaded", function () {
    const canvas2 = document.getElementById("fluidCanvas2");
    const ctx2 = canvas2.getContext("2d");

    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight;

    // UI Controls
    const viscositySlider = document.getElementById("viscosity");
    const flowSpeedSlider = document.getElementById("flowSpeed");
    const animationSpeedSlider = document.getElementById("animationSpeed");
    const restartButton = document.getElementById("restart 2");
    const addBarrierButton = document.getElementById("addBarrier 2");

    const numParticles = 1000;
    let particles2 = [];
    let obstacles2 = [];
    let radius2 = 15;
    let restDensity2 = 1.0;
    let pressureStrength2 = 1000;
    let viscosity2 = parseFloat(viscositySlider.value) * 0.01;
    let gravity2 = 0.01;
    let vorticityStrength2 = 0.2;
    let turbulenceFactor2 = 0.1;
    let timeStep2 = parseFloat(animationSpeedSlider.value) * 0.5;

    let mouse2 = { x: 0, y: 0, down: false };

    // Perlin Noise for turbulence
    function perlinNoise(x, y) {
        return Math.sin(x * 0.05) * Math.cos(y * 0.05);
    }

    // Initialize Particles
    function initializeParticles2() {
        particles2 = [];
        for (let i = 0; i < numParticles; i++) {
            particles2.push({
                x: Math.random() * canvas2.width,
                y: Math.random() * canvas2.height,
                vx: (Math.random() - 0.5) * flowSpeedSlider.value,
                vy: (Math.random() - 0.5) * flowSpeedSlider.value,
                density: 0,
                pressure: 0,
                color: { r: 255, g: 50, b: 100, alpha: 1 }
            });
        }
    }
    initializeParticles2();

    // Add Obstacles
    function addObstacle2(x, y, width, height) {
        obstacles2.push({ x, y, width, height });
    }
    addObstacle2(canvas2.width / 2 - 50, canvas2.height / 2 - 50, 100, 100);

    // Compute Density & Pressure
    function computeDensityPressure2() {
        for (let p of particles2) {
            p.density = 0;
            for (let q of particles2) {
                let dx = p.x - q.x;
                let dy = p.y - q.y;
                let dist2 = dx * dx + dy * dy;
                if (dist2 < radius2 * radius2) {
                    p.density += 1;
                }
            }
            p.pressure = Math.max(pressureStrength2 * (p.density - restDensity2), 0);
        }
    }

    // Compute Forces (Pressure, Viscosity, Gravity, and Turbulence)
    function computeForces2() {
        for (let p of particles2) {
            let forceX = 0, forceY = gravity2;
            let curl = 0;

            for (let q of particles2) {
                let dx = p.x - q.x;
                let dy = p.y - q.y;
                let dist2 = dx * dx + dy * dy;
                if (dist2 > 0 && dist2 < radius2 * radius2) {
                    let distance = Math.sqrt(dist2);
                    let pressureForce = (p.pressure + q.pressure) / 2;
                    forceX -= (dx / distance) * pressureForce;
                    forceY -= (dy / distance) * pressureForce;

                    let viscosityForce = viscosity2 * (q.vx - p.vx + q.vy - p.vy);
                    forceX += viscosityForce * dx;
                    forceY += viscosityForce * dy;

                    // Vorticity (Swirling Effect)
                    curl += (q.vx - p.vx) * dy - (q.vy - p.vy) * dx;
                }
            }

            // Apply vorticity force
            let vorticityForceX = vorticityStrength2 * curl * -p.vy;
            let vorticityForceY = vorticityStrength2 * curl * p.vx;
            forceX += vorticityForceX;
            forceY += vorticityForceY;

            // Turbulence (Random Swirls)
            let noise = perlinNoise(p.x, p.y);
            forceX += turbulenceFactor2 * noise;
            forceY += turbulenceFactor2 * noise;

            p.vx += forceX * timeStep2;
            p.vy += forceY * timeStep2;
        }
    }

    // Update Particle Positions & Handle Boundaries/Obstacles
    function updateParticles2() {
        for (let p of particles2) {
            p.x += p.vx;
            p.y += p.vy;

            // Collision with walls
            if (p.x < 0 || p.x > canvas2.width) p.vx *= -0.8;
            if (p.y < 0 || p.y > canvas2.height) p.vy *= -0.8;

            // Collision with obstacles
            for (let obs of obstacles2) {
                if (p.x > obs.x && p.x < obs.x + obs.width && p.y > obs.y && p.y < obs.y + obs.height) {
                    p.vx *= -0.8;
                    p.vy *= -0.8;
                }
            }
        }
    }

    // Render Particles & Obstacles
    function drawParticles2() {
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

        // Draw particles
        for (let p of particles2) {
            ctx2.beginPath();
            ctx2.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx2.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.color.alpha})`;
            ctx2.fill();
            ctx2.closePath();
        }

        // Draw Obstacles
        ctx2.fillStyle = "black";
        obstacles2.forEach(obs => {
            ctx2.fillRect(obs.x, obs.y, obs.width, obs.height);
        });
    }

    // Animation Loop
    function animate2() {
        computeDensityPressure2();
        computeForces2();
        updateParticles2();
        drawParticles2();
        requestAnimationFrame(animate2);
    }

    animate2();

    // Update Parameters Dynamically
    viscositySlider.addEventListener("input", () => {
        viscosity2 = parseFloat(viscositySlider.value) * 0.01;
    });

    flowSpeedSlider.addEventListener("input", () => {
        particles2.forEach(p => {
            p.vx = (Math.random() - 0.5) * flowSpeedSlider.value;
            p.vy = (Math.random() - 0.5) * flowSpeedSlider.value;
        });
    });

    animationSpeedSlider.addEventListener("input", () => {
        timeStep2 = parseFloat(animationSpeedSlider.value) * 0.5;
    });

    // Restart Simulation
    restartButton.addEventListener("click", initializeParticles2);

    // Add Barrier
    addBarrierButton.addEventListener("click", () => {
        let x = Math.random() * (canvas2.width - 50);
        let y = Math.random() * (canvas2.height - 50);
        addObstacle2(x, y, 50, 50);
    });
});
