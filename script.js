// Scene Management
function goToScene(sceneNumber) {
    // Hide all scenes
    document.querySelectorAll('.scene').forEach(scene => {
        scene.classList.remove('active');
    });
    // Show target scene
    document.getElementById(`scene-${sceneNumber}`).classList.add('active');

    // Trigger specific scene logic
    if (sceneNumber === 2) startHeartGame();
    if (sceneNumber === 3) initCakeCutting();
    if (sceneNumber === 6) startFinalCelebration();
}

// Background Floating Hearts
function createFloatingHearts() {
    const container = document.getElementById('particles-container');
    const heartSymbols = ['❤️', '💖', '✨', '🌸', '💕'];
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart-particle';
        heart.innerHTML = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = '100vh';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        heart.style.duration = (Math.random() * 3 + 2) + 's';
        
        container.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 5000);
    }, 300);
}

// Scene 2: Mini Game Logic
let score = 0;
function startHeartGame() {
    const gameArea = document.getElementById('game-area');
    score = 0;
    document.getElementById('score').innerText = score;

    const gameInterval = setInterval(() => {
        if (score >= 10) {
            clearInterval(gameInterval);
            setTimeout(() => goToScene(3), 1000);
            return;
        }

        const heart = document.createElement('div');
        heart.className = 'game-heart';
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 90 + '%';
        heart.style.top = '-50px';
        gameArea.appendChild(heart);

        // Animate falling
        let top = -50;
        const fall = setInterval(() => {
            top += 5;
            heart.style.top = top + 'px';
            
            if (top > gameArea.offsetHeight) {
                clearInterval(fall);
                heart.remove();
            }
        }, 30);

        heart.onclick = () => {
            score++;
            document.getElementById('score').innerText = score;
            clearInterval(fall);
            heart.innerHTML = '✨';
            setTimeout(() => heart.remove(), 200);
            if (score === 10) {
                createConfetti();
            }
        };
    }, 800);
}

// Scene 3: Cake Cutting Logic
function initCakeCutting() {
    const knife = document.getElementById('knife');
    const cake = document.getElementById('cake-container');
    const flame = document.getElementById('main-flame');
    const sliceLine = document.getElementById('slice-line');

    // Follow mouse/touch
    document.addEventListener('mousemove', (e) => {
        knife.style.left = e.pageX + 'px';
        knife.style.top = e.pageY + 'px';
    });

    cake.onclick = () => {
        // Blow out candle
        flame.style.display = 'none';
        sliceLine.style.display = 'block';
        
        // Effects
        createConfetti();
        
        setTimeout(() => {
            cake.style.transform = 'translateY(10px) scale(1.05)';
            setTimeout(() => goToScene(4), 2000);
        }, 500);
    };
}

// Confetti Effect
function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const conf = document.createElement('div');
        conf.className = 'heart-particle';
        conf.innerHTML = '🎉';
        conf.style.left = Math.random() * 100 + 'vw';
        conf.style.top = '100vh';
        conf.style.animation = `floatUp ${Math.random() * 2 + 1}s forwards`;
        document.body.appendChild(conf);
        setTimeout(() => conf.remove(), 2000);
    }
}

// Scene 6: Fireworks and Ending
function startFinalCelebration() {
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.velocity = {
                x: (Math.random() - 0.5) * 8,
                y: (Math.random() - 0.5) * 8
            };
            this.alpha = 1;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
        update() {
            this.velocity.y += 0.05;
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.alpha -= 0.01;
        }
    }

    function spawnFirework() {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.5;
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        for (let i = 0; i < 30; i++) {
            particles.push(new Particle(x, y, color));
        }
    }

    function animate() {
        if (document.getElementById('scene-6').classList.contains('active')) {
            requestAnimationFrame(animate);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (Math.random() < 0.05) spawnFirework();

            particles.forEach((p, i) => {
                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                } else {
                    p.update();
                    p.draw();
                }
            });
        }
    }
    animate();
    createConfetti();
    setInterval(createConfetti, 3000);
}

function restartGame() {
    location.reload();
}

// Initialize
window.onload = () => {
    createFloatingHearts();
};
