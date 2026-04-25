const text = "Hi, I'm Aman Pathan";
let index = 0;

function type() {
    if (index < text.length) {
        document.getElementById("typing").innerHTML += text.charAt(index);
        index++;
        setTimeout(type, 100);
    }
}

type();

const sections = document.querySelectorAll('.section');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        backToTop.style.display = "block";
    } else {
        backToTop.style.display = "none";
    }
});

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

const fills = document.querySelectorAll('.fill');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const width = entry.target.getAttribute('data-width');
            entry.target.style.width = width;
        }
    });
}, { threshold: 0.5 });

fills.forEach(fill => {
    skillObserver.observe(fill);
});

const canvas = document.createElement('canvas');
canvas.id = 'particles';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 80; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        dx: (Math.random() - 0.5) * 1.5,
        dy: (Math.random() - 0.5) * 1.5
    });
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#00ff88';
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(animateParticles);
}

animateParticles();

// ========== UPGRADED SPIDER ANIMATION (Cursor Following) ==========
// Remove old spider if exists
const oldSpider = document.getElementById('spider');
if (oldSpider) oldSpider.remove();

// Create new spider element
const spider = document.createElement('div');
spider.id = 'spider';
spider.innerHTML = '🕷️';
document.body.appendChild(spider);

// Add enhanced styles for the spider
const spiderStyle = document.createElement('style');
spiderStyle.textContent = `
#spider {
    position: fixed;
    font-size: 35px;
    z-index: 9999;
    pointer-events: none;
    filter: drop-shadow(0 0 5px #00ff88) hue-rotate(90deg) saturate(5) brightness(1.5);
    transition: transform 0.1s ease;
    will-change: left, top;
}

/* Excited animation when near interactive elements */
#spider.excited {
    animation: spiderWiggle 0.2s ease-in-out infinite;
    filter: drop-shadow(0 0 10px #ff00ff) hue-rotate(0deg) saturate(8) brightness(1.8);
}

@keyframes spiderWiggle {
    0%, 100% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(15deg) scale(1.2); }
}

/* Trail effect */
.spider-trail {
    position: fixed;
    width: 3px;
    height: 3px;
    background: #00ff88;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    opacity: 0.8;
    animation: trailFade 0.6s ease-out forwards;
    box-shadow: 0 0 5px #00ff88;
}

@keyframes trailFade {
    to {
        opacity: 0;
        transform: scale(2);
    }
}

/* Click effect */
#spider.clicked {
    animation: spiderJump 0.3s ease-out !important;
}

@keyframes spiderJump {
    0% { transform: scale(1); }
    50% { transform: scale(0.5) rotate(-20deg); }
    100% { transform: scale(1) rotate(0deg); }
}
`;
document.head.appendChild(spiderStyle);

let mouseX = 0, mouseY = 0;
let spiderX = 0, spiderY = 0;
let lastX = 0, lastY = 0;

// Create trail effect
function createTrail(x, y) {
    const trail = document.createElement('div');
    trail.className = 'spider-trail';
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    document.body.appendChild(trail);
    
    setTimeout(() => {
        trail.remove();
    }, 600);
}

// Track mouse movement
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Check what element is under cursor
    const elemUnderCursor = document.elementFromPoint(mouseX, mouseY);
    if (elemUnderCursor) {
        // Check if hovering over interactive elements
        const isInteractive = elemUnderCursor.closest('a, button, .btn, .btn-outline, .project-card, section, [href], .skill-bar, .social-icons a');
        
        if (isInteractive) {
            spider.classList.add('excited');
            // Create more trails on interactive elements
            createTrail(mouseX, mouseY);
        } else {
            spider.classList.remove('excited');
        }
        
        // Always create subtle trail
        if (Math.hypot(mouseX - lastX, mouseY - lastY) > 5) {
            createTrail(mouseX, mouseY);
            lastX = mouseX;
            lastY = mouseY;
        }
    }
});

// Smooth spider following animation
function followCursor() {
    // Smooth following (0.2 = faster, 0.1 = slower)
    spiderX += (mouseX - spiderX) * 0.2;
    spiderY += (mouseY - spiderY) * 0.2;
    
    spider.style.left = (spiderX - 17) + 'px';
    spider.style.top = (spiderY - 17) + 'px';
    
    requestAnimationFrame(followCursor);
}

followCursor();

// Spider reacts to clicks
document.addEventListener('click', (e) => {
    spider.classList.add('clicked');
    // Create explosion of trails on click
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createTrail(e.clientX + (Math.random() - 0.5) * 20, e.clientY + (Math.random() - 0.5) * 20);
        }, i * 30);
    }
    setTimeout(() => {
        spider.classList.remove('clicked');
    }, 300);
});

// Optional: Spider changes color on different sections
const sectionsForColor = document.querySelectorAll('.section');
sectionsForColor.forEach(section => {
    section.addEventListener('mouseenter', () => {
        spider.style.filter = 'drop-shadow(0 0 10px #ff6600) hue-rotate(180deg) saturate(8)';
    });
    section.addEventListener('mouseleave', () => {
        spider.style.filter = 'drop-shadow(0 0 5px #00ff88) hue-rotate(90deg) saturate(5) brightness(1.5)';
    });
});

// Handle window resize for particles
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

console.log('🕷️ Enhanced spider animation loaded! Hover over buttons, links, or sections to see it get excited!');