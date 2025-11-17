// Physics-themed visual effects

// 1. Oscilloscope trace animation
class OscilloscopeTrace {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.time = 0;
        this.frequency = 2;
        this.amplitude = 30;
        this.mouse = { x: 0, y: 0 };

        this.resize();
        this.setupEventListeners();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Only draw in hero section area
        const heroHeight = Math.min(window.innerHeight, 800);

        // Draw oscilloscope trace
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
        this.ctx.lineWidth = 2;

        const points = 200;
        const spacing = this.canvas.width / points;

        // Modulate frequency based on mouse X position
        const mouseInfluence = this.mouse.x / this.canvas.width;
        const freq = this.frequency + mouseInfluence * 3;

        for (let i = 0; i < points; i++) {
            const x = i * spacing;
            const t = this.time + i * 0.05;

            // Sine wave with mouse-influenced amplitude
            const baseY = heroHeight * 0.3;
            const amp = this.amplitude * (1 + mouseInfluence * 0.5);
            const y = baseY + Math.sin(t * freq) * amp;

            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }

        this.ctx.stroke();

        this.time += 0.05;
        requestAnimationFrame(() => this.animate());
    }
}

// 2. Circuit board pathways
class CircuitPathways {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.paths = [];
        this.resize();
        this.generatePaths();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    generatePaths() {
        // Create vertical circuit traces between sections
        const sections = ['#about', '#skills', '#experience', '#projects', '#blog'];

        sections.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element && index < sections.length - 1) {
                const rect = element.getBoundingClientRect();
                const nextElement = document.querySelector(sections[index + 1]);
                if (nextElement) {
                    const nextRect = nextElement.getBoundingClientRect();

                    this.paths.push({
                        x: window.innerWidth * 0.1,
                        y1: rect.bottom + window.scrollY,
                        y2: nextRect.top + window.scrollY,
                        progress: 0,
                        speed: 0.002
                    });
                }
            }
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const scrollY = window.scrollY;

        this.paths.forEach(path => {
            // Draw the trace
            this.ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([5, 5]);

            this.ctx.beginPath();
            this.ctx.moveTo(path.x, path.y1 - scrollY);
            this.ctx.lineTo(path.x, path.y2 - scrollY);
            this.ctx.stroke();

            // Animate current flow
            path.progress = (path.progress + path.speed) % 1;
            const currentY = path.y1 + (path.y2 - path.y1) * path.progress - scrollY;

            // Draw moving "current"
            this.ctx.fillStyle = 'rgba(6, 182, 212, 0.8)';
            this.ctx.beginPath();
            this.ctx.arc(path.x, currentY, 3, 0, Math.PI * 2);
            this.ctx.fill();

            // Glow effect
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = 'rgba(6, 182, 212, 0.6)';
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// 3. Fermi Surface 3D Visualization
class FermiSurface {
    constructor(container) {
        this.container = container;
        this.rotation = 0;
        this.createSVG();
        this.animate();
    }

    createSVG() {
        // Create SVG for 3D-ish Fermi surface
        const svg = `
            <svg width="200" height="200" viewBox="0 0 200 200">
                <defs>
                    <radialGradient id="fermiGrad">
                        <stop offset="0%" style="stop-color:rgba(6,182,212,0.4)" />
                        <stop offset="100%" style="stop-color:rgba(6,182,212,0.1)" />
                    </radialGradient>
                </defs>
                <g id="fermiGroup" transform="translate(100, 100)">
                    <ellipse cx="0" cy="0" rx="60" ry="40" fill="none" stroke="rgba(6,182,212,0.4)" stroke-width="1.5"/>
                    <ellipse cx="0" cy="0" rx="45" ry="60" fill="none" stroke="rgba(6,182,212,0.3)" stroke-width="1.5"/>
                    <circle cx="0" cy="0" r="50" fill="url(#fermiGrad)" opacity="0.3"/>
                </g>
            </svg>
        `;
        this.container.innerHTML = svg;
        this.group = this.container.querySelector('#fermiGroup');
    }

    animate() {
        this.rotation += 0.5;
        this.group.setAttribute('transform', `translate(100, 100) rotate(${this.rotation})`);
        requestAnimationFrame(() => this.animate());
    }
}

// 4. Wave Interference on Click
function createRipple(e, tile) {
    const rect = tile.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.transform = 'translate(-50%, -50%)';

    tile.appendChild(ripple);

    setTimeout(() => ripple.remove(), 1500);
}

// 5. Hall Effect Cursor Trail
class HallEffectTrail {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.trail = [];
        this.maxTrailLength = 20;
        this.mouse = { x: 0, y: 0 };
        this.lastMouse = { x: 0, y: 0 };

        this.resize();
        this.setupEventListeners();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.lastMouse = { ...this.mouse };
            this.mouse = { x: e.clientX, y: e.clientY };

            // Calculate velocity for Hall effect curvature
            const dx = this.mouse.x - this.lastMouse.x;
            const dy = this.mouse.y - this.lastMouse.y;

            // Hall effect: perpendicular deflection
            const perpX = -dy * 0.3;
            const perpY = dx * 0.3;

            this.trail.push({
                x: this.mouse.x + perpX,
                y: this.mouse.y + perpY,
                age: 0
            });

            if (this.trail.length > this.maxTrailLength) {
                this.trail.shift();
            }
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw trail
        this.trail.forEach((point, index) => {
            point.age += 0.05;

            const opacity = (1 - point.age) * 0.5;
            const size = 3 * (1 - point.age);

            // Draw particle
            this.ctx.fillStyle = `rgba(6, 182, 212, ${opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            this.ctx.fill();

            // Connect particles
            if (index > 0) {
                const prevPoint = this.trail[index - 1];
                this.ctx.strokeStyle = `rgba(6, 182, 212, ${opacity * 0.3})`;
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(prevPoint.x, prevPoint.y);
                this.ctx.lineTo(point.x, point.y);
                this.ctx.stroke();
            }
        });

        // Remove old trail points
        this.trail = this.trail.filter(p => p.age < 1);

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize all effects when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // 1. Oscilloscope
    const oscilloscopeCanvas = document.getElementById('oscilloscopeCanvas');
    if (oscilloscopeCanvas) {
        new OscilloscopeTrace(oscilloscopeCanvas);
    }

    // 2. Circuit pathways
    const circuitCanvas = document.getElementById('circuitCanvas');
    if (circuitCanvas) {
        setTimeout(() => new CircuitPathways(circuitCanvas), 500); // Delay for sections to load
    }

    // 3. Fermi surface
    const fermiContainer = document.getElementById('fermiSurface');
    if (fermiContainer) {
        new FermiSurface(fermiContainer);
    }

    // 4. Ripple on tile click
    document.querySelectorAll('.glass-tile').forEach(tile => {
        tile.addEventListener('click', (e) => createRipple(e, tile));
    });

    // 5. Hall effect cursor trail
    const cursorTrailCanvas = document.getElementById('cursorTrailCanvas');
    if (cursorTrailCanvas) {
        new HallEffectTrail(cursorTrailCanvas);
    }
});
