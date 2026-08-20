const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;
let fillRatio = 0.45;
let targetFill = 0.45;
let pouring = false;
function enterSite() {
  document.getElementById('modalWrap').classList.add('hide');
  targetFill = 0.0;
  pouring = true;
  document.getElementById('fadeOverlay').classList.add('active');
  setTimeout(() => { window.location.href = 'LectBeersite.html'; }, 400);
}
function underage() {
  document.getElementById('btnGroup').style.display = 'none';
  document.getElementById('underageMsg').style.display = 'block';
}
let t = 0;
const waves = [
  { amp:8, freq:0.006, speed:0.012, phase:0 },
  { amp:5, freq:0.009, speed:0.018, phase:1.5 },
  { amp:3, freq:0.013, speed:0.024, phase:3.0 },
];
function getSurfaceY(x) {
  return H * fillRatio + waves.reduce((s, w) => s + w.amp * Math.sin(w.freq * x + w.phase + t * w.speed), 0);
}
function drawBg() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#0a0500');
  g.addColorStop(1, '#1c0d00');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}
function drawBeer() {
  ctx.beginPath();
  ctx.moveTo(0, H);
  ctx.lineTo(0, getSurfaceY(0));
  for (let x = 0; x <= W; x += 3) {
    ctx.lineTo(x, getSurfaceY(x));
  }
  ctx.lineTo(W, H);
  ctx.closePath();
  const fillY = H * fillRatio;
  const g = ctx.createLinearGradient(0, fillY, 0, H);
  g.addColorStop(0, 'rgba(210,120,15,0.90)');
  g.addColorStop(0.4, 'rgba(160,80,10,0.85)');
  g.addColorStop(1, 'rgba(60,25,5,0.95)');
  ctx.fillStyle = g;
  ctx.fill();
}
const foam1 = Array.from({ length: 500 }, () => ({
  xRatio : Math.random(),
  layer : Math.random() * 10 - 5,
  r : Math.random() * 16 + 8,
  alpha : Math.random() * 0.5 + 0.2,
  vx : (Math.random() - 0.5) * 0.12,
}));
const foam2 = Array.from({ length: 400 }, () => ({
  xRatio : Math.random(),
  layer : Math.random() * 14 - 18,
  r : Math.random() * 10 + 4,
  alpha : Math.random() * 0.45 + 0.15,
  vx : (Math.random() - 0.5) * 0.1,
}));
function updateDrawFoam() {
  for (const f of [...foam1, ...foam2]) { 
    f.xRatio += f.vx / W;
    if (f.xRatio > 1.05) f.xRatio = -0.05;
    if (f.xRatio < -0.05) f.xRatio = 1.05;
    const x = f.xRatio * W;
    const y = getSurfaceY(x) - f.layer;
    ctx.beginPath();
    ctx.arc(x, y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,250,235,${f.alpha})`;
    ctx.fill();
  }
}
function newBubble(random) {
  return {
    x: Math.random() * W,
    y: random ? H * fillRatio + Math.random() * H * 0.5 : H + 5,
    r: Math.random() * 4 + 1,
    vy: -(Math.random() * 0.7 + 0.25),
    vx: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.3 + 0.07,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 0.03 + 0.01,
  };
}
const bubbles = Array.from({ length: 180 }, () => newBubble(true));
function updateDrawBubbles() {
  for (let i = 0; i < bubbles.length; i++) {
    const b = bubbles[i];
    b.wobble += b.wobbleSpeed;
    b.x += b.vx + Math.sin(b.wobble) * 0.45;
    b.y += b.vy;
    if (b.y < getSurfaceY(b.x)) { bubbles[i] = newBubble(false); continue; }
    ctx.save();
    const g = ctx.createRadialGradient(b.x-b.r*0.3, b.y-b.r*0.3, b.r*0.1, b.x, b.y, b.r);
    g.addColorStop(0, `rgba(255,240,180,${b.alpha*2})`);
    g.addColorStop(0.6, `rgba(220,150,30,${b.alpha})`);
    g.addColorStop(1, `rgba(160,80,10,${b.alpha*0.3})`);
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();
  }
}
function loop() {
  t++;
  if (pouring && fillRatio > targetFill) {
    fillRatio -= 0.008;
  }
  drawBg();
  drawBeer();
  updateDrawFoam();
  updateDrawBubbles();
  requestAnimationFrame(loop);
}
loop();
window.addEventListener('resize', () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
});
const track = document.getElementById('tickerTrack');
let tickerX = 0;
function tickerLoop() {
  tickerX -= 0.7;
  const halfW = track.scrollWidth / 2;
  if(Math.abs(tickerX) >= halfW) tickerX = 0;
  track.style.transform = `translateX(${tickerX}px)`;
  requestAnimationFrame(tickerLoop);
}
tickerLoop();
const footerTrack = document.getElementById('footerTrack');

// DOMが完全に読み込まれてから実行
window.addEventListener('load', () => {
  let fx = 0;
  function footerTick() {
    fx -= 0.5;
    if (Math.abs(fx) >= footerTrack.scrollWidth / 2) fx = 0;
    footerTrack.style.transform = `translateX(${fx}px)`;
    requestAnimationFrame(footerTick);
  }
  footerTick();
});