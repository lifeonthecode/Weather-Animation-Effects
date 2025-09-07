
const lerp = (a, b, t) => a + (b - a) * t;
const setSky = (top, bottom) => {
    document.documentElement.style.setProperty('--sky-top', top);
    document.documentElement.style.setProperty('--sky-bottom', bottom);
};

// stars 
const starsEl = document.getElementById('stars');
function makeStars(count = 120) {
    starsEl.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const s = document.createElement('div');
        s.className = 'star';
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const d = Math.random() * 2.5;

        s.style.left = x + '%';
        s.style.top = y + '%';
        s.style.width = d + 'px';
        s.style.height = d + 'px';

        s.style.animationDelay = (Math.random() * 3) + 's';
        frag.appendChild(s);
    };
    starsEl.appendChild(frag);
};

makeStars();


const cloudsEl = document.getElementById('clouds');
function spawnClouds(n = 5, density = 1) {
    cloudsEl.innerHTML = '';
    const frag = document.createDocumentFragment();
    const total = Math.floor(n * density);
    for (let i = 0; i < total; i++) {
        const c = document.createElement('div');
        c.className = 'cloud';
        const size = 120 + Math.random() * 240;
        const y = 5 + Math.random() * 40;
        const speed = 50 + Math.random() * 60;
        const blur = Math.random() > .6 ? 2 + Math.random() * 4 : 0;
        const alpha = .55 + Math.random() * .4;

        c.style.setProperty('--size', size + 'px');
        c.style.setProperty('--y', y + 'vh');
        c.style.setProperty('--speed', speed + 's');
        c.style.setProperty('--blur', blur + 'px');
        c.style.setProperty('--alpha', alpha);
        c.style.transform = `translateX(${Math.random() * 120 - 20}vw)`;
        frag.appendChild(c);
    };
    cloudsEl.appendChild(frag);
};

spawnClouds(7, 1);



// canvas 
const canvas = document.getElementById('fx');
const ctx = canvas.getContext('2d');
let W = canvas.width = innerWidth;
let H = canvas.height = innerHeight;
addEventListener('resize', () => {
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
});

const FX = {
    mode: 'none',
    drops: [],
    max: 500,
    tick() {
        ctx.clearRect(0, 0, W, H);
        if (this.mode === 'rain') this.rainStep();
        if (this.mode === 'snow') this.snowStep();
        if (this.mode === 'leaves') this.leafStep();
        requestAnimationFrame(() => this.tick());
    },
    use(mode) {
        this.mode = mode;
        this.drops = this.drops.length = [];
    },

    rainStep() {
        while (this.drops.length < Math.min(this.max, W * 0.35)) {
            this.drops.push({
                x: Math.random() * W,
                y: -20,
                l: 8 + Math.random() * 16,
                s: 3 + Math.random() * 4,
            })
        };
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(40, 60, 120, .65)';
        for (const d of this.drops) {
            d.y += d.s * 5;
            d.x += 1.2;
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(d.x, d.y - d.l);
            ctx.stroke();
            if (d.y > H) {
                d.y = -20;
                d.x = Math.random() * W;
            }
        }
    },

    snowStep() {
        while (this.drops.length < Math.min(220, W * 0.12)) {
            this.drops.push({
                x: Math.random() * W,
                y: -20,
                r: 1 + Math.random() * 2.2,
                s: .6 + Math.random() * 1.2,
                a: Math.random() * Math.PI * 2,
            });
        };
        ctx.fillStyle = 'rgba(255, 255, 255, .9)';
        for (const d of this.drops) {
            d.y += d.s;
            d.a += .01;
            d.x += Math.sin(d.a) * .6;
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fill();
            if (d.y > H) {
                d.y = -10;
                d.x = Math.random() * W;
            }

        }
    },

    leafStep() {
        while (this.drops.length < Math.min(160, W * 0.08)) {
            hue = 20 + Math.random() * 40;
            this.drops.push({
                x: Math.random() * W,
                y: -20,
                w: 6 + Math.random() * 10,
                h: 3 + Math.random() * 6,
                s: .6 + Math.random() * 1.2,
                a: Math.random() * Math.PI * 2,
                hue
            })
        };

        for (const d of this.drops) {
            d.y += d.s * 1.2;
            d.a += .05;
            d.x += Math.sin(d.a) * 1.2 + 1.0;
            ctx.save();
            ctx.translate(d.x, d.y);
            ctx.rotate(Math.sin(d.a) * .6);
            ctx.fillStyle = `hsl(${d.hue} 70% 55% / .9)`;
            ctx.beginPath()
            ctx.ellipse(0, 0, d.w, d.h, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            if (d.y > H) {
                d.y = -10;
                d.x = Math.random() * W;
            }
        };
    }
}

FX.tick();




// Lightning 

const flashEl = document.getElementById('flash');
function lightningFlash() {

    flashEl.animate([
        {
            opacity: 0
        },
        {
            opacity: .9
        },
        {
            opacity: 0
        }
    ], { duration: 280, easing: 'cubic-bezier(.2,.8,.2,1)' });

    ctx.save();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, .9)';
    let x = lerp(W * .2, W * .8, Math.random());
    let y = 0;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let i = 0; i < 6; i++) {
        x += (Math.random() - .5) * 80;
        y += H / 8;
        ctx.lineTo(x, y);
    };

    ctx.stroke();
    ctx.restore();
    document.getElementById('scene').animate([{
        transform: 'translateX(0)'
    }, { transform: 'translateX(2px)' }, { transform: 'translateX(0)' }], { duration: 180 });


};


// Modes 
const skyEl = document.getElementById('sky');
const sunEl = document.getElementById('sun');
const moonEl = document.getElementById('moon');


const MODES = {
    sunny() {
        setSky('#87ceeb', '#e6f6ff');
        FX.use('none');
        sunEl.style.opacity = 1;
        sunEl.style.filter = 'saturate(1)';
        moonEl.style.opacity = 0;
        starsEl.style.opacity = 0;
        spawnClouds(6, .6);
        document.documentElement.style.setProperty('--wind', '12s')
    },
    cloudy() {
        setSky('#9ec3e0', '#d8e6f5');
        FX.use('none');
        sunEl.style.opacity = .6;
        sunEl.style.filter = 'saturate(.7) brightness(.9)';
        moonEl.style.opacity = 0;
        starsEl.style.opacity = 0;
        spawnClouds(10, 1.2);
        document.documentElement.style.setProperty('--wind', '10s')
    },

    rain() {
        setSky('#6888a9', '#a9c0d6');
        FX.use('rain');
        sunEl.style.opacity = .2;
        moonEl.style.opacity = 0;
        starsEl.style.opacity = 0;
        spawnClouds(12, 1.6);
        document.documentElement.style.setProperty('--wind', '8s');

    },

    snow() {
        setSky('#8bb3d6', '#f5fbff');
        FX.use('snow');
        sunEl.style.opacity = .35;
        moonEl.style.opacity = 0;
        starsEl.style.opacity = 0;
        spawnClouds(8, 1.1);
        document.documentElement.style.setProperty('--wind', '14s');
    },

    storm() {
        setSky('#273243', '#6a7a8d');
        FX.use('rain');
        sunEl.style.opacity = 0;
        moonEl.style.opacity = 0;
        starsEl.style.opacity = 0;
        spawnClouds(14, 1.8);
        document.documentElement.style.setProperty('--wind', '7s');
        const doBolt = () => {
            if (currentMode !== 'storm') return;
            const wait = 800 + Math.random() * 2600;
            setTimeout(() => {
                lightningFlash();
                doBolt();
            }, wait);
        };
        doBolt();
    },

    windy() {
        setSky('#8dc6e6', '#eaf7ff');
        FX.use('leaves');
        sunEl.style.opacity = .8;
        moonEl.style.opacity = 0;
        starsEl.style.opacity = 0;
        spawnClouds(9, .9);
        document.documentElement.style.setProperty('--wind', '5.5s');
    },

    night() {
        setSky('#0d1730', '#21345a');
        FX.use('none');
        sunEl.style.opacity = 0;
        moonEl.style.opacity = 1;
        moonEl.style.transform = 'scale(1)';
        starsEl.style.opacity = 1;
        spawnClouds(6, .5);
        document.documentElement.style.setProperty('--wind', '13s');
    },

    auto() {
        const seq = ['sunny', 'cloudy', 'rain', 'storm', 'snow', 'windy', 'night'];
        let i = 0;
        const step = () => {
            if (currentMode !== 'auto') return;
            MODES[seq[i % seq.length]]();
            highlight(seq[i % seq.length]);
            i++;
            setTimeout(step, 4500);
        };
        step();
    },

};


// controls 

let currentMode = 'sunny';
const hud = document.getElementById('hud');
function highlight(mode) {
    [...hud.querySelectorAll('button')].forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
};

hud.addEventListener('click', (e) => {
    // const btn = e.dataset.mode;
    const btn = e.target.closest('button[data-mode]');
    if (!btn) return;
    currentMode = btn.dataset.mode;
    highlight(currentMode);
    MODES[currentMode]();
});

MODES.sunny();
