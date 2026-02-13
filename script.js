// --- 1. LOADER ---
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.style.opacity = '0';
        setTimeout(() => { loader.style.display = 'none'; }, 1500);
    }, 1500);
});

// --- 2. PARTICLE ENGINE (CANVAS) ---
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];
let mouse = { x: 0, y: 0 };

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = Math.random() > 0.8 ? 'rgba(249, 115, 22,' : 'rgba(255, 255, 255,'; 
        this.alpha = Math.random() * 0.5 + 0.1;
    }

    update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if(dist < 150) {
            this.speedX -= dx * 0.0005;
            this.speedY -= dy * 0.0005;
        }

        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
    }

    draw() {
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    ctx.lineWidth = 0.5;
    for(let i = 0; i < particles.length; i++) {
        for(let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx*dx + dy*dy);

            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(50, 50, 60, ${0.1 - distance/1000})`;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}
animate();

// --- 3. CURSOR & INTERACTION ---
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        cursorRing.style.left = e.clientX + 'px';
        cursorRing.style.top = e.clientY + 'px';
    }, 80);
});

const clickables = document.querySelectorAll('a, button, input, textarea, .group, .cursor-pointer');
clickables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorRing.style.width = '64px';
        cursorRing.style.height = '64px';
        cursorRing.style.borderColor = '#F97316';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
    });
    el.addEventListener('mouseleave', () => {
        cursorRing.style.width = '32px';
        cursorRing.style.height = '32px';
        cursorRing.style.borderColor = 'rgba(255,255,255,0.3)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});

// --- 4. SCROLL OBSERVER ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-[slideUp_0.8s_ease-out_forwards]', 'opacity-100');
            entry.target.classList.remove('opacity-0');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    el.classList.add('opacity-0');
    observer.observe(el);
});
