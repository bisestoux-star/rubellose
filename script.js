const card = document.getElementById('card');
const coinButton = document.getElementById('coinButton');
const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');

let scratchReady = false;
let isDrawing = false;
let lastPoint = null;

coinButton.addEventListener('click', () => {
  coinButton.classList.add('is-tapped');
  window.setTimeout(() => {
    card.classList.add('is-flipped');
    window.setTimeout(initScratchCard, 500);
  }, 350);
});

function initScratchCard() {
  if (scratchReady) return;
  scratchReady = true;

  resizeCanvas();
  drawHeartOverlay();

  canvas.addEventListener('pointerdown', startScratch);
  canvas.addEventListener('pointermove', scratch);
  canvas.addEventListener('pointerup', stopScratch);
  canvas.addEventListener('pointercancel', stopScratch);
  canvas.addEventListener('pointerleave', stopScratch);
}

window.addEventListener('resize', () => {
  if (!scratchReady) return;
  resizeCanvas();
  drawHeartOverlay();
});

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawHeartOverlay() {
  const rect = canvas.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;

  ctx.clearRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'source-over';

  ctx.save();
  heartPath(ctx, w, h);
  ctx.clip();

  // Goldene Rubbel-Fläche
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, '#d9bd7a');
  gradient.addColorStop(0.5, '#c5a365');
  gradient.addColorStop(1, '#e0c988');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  // dezenter Rubbelkarten-Schimmer
  ctx.globalAlpha = 0.18;
  for (let i = -w; i < w * 2; i += 18) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + h, h);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 7;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Rand
  ctx.restore();
  ctx.save();
  heartPath(ctx, w, h);
  ctx.strokeStyle = '#7b0008';
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.restore();
}

function heartPath(context, w, h) {
  context.beginPath();
  context.moveTo(w / 2, h * 0.95);
  context.bezierCurveTo(w * 0.05, h * 0.58, w * 0.00, h * 0.25, w * 0.24, h * 0.08);
  context.bezierCurveTo(w * 0.38, h * -0.02, w * 0.50, h * 0.12, w / 2, h * 0.20);
  context.bezierCurveTo(w * 0.50, h * 0.12, w * 0.62, h * -0.02, w * 0.76, h * 0.08);
  context.bezierCurveTo(w * 1.00, h * 0.25, w * 0.95, h * 0.58, w / 2, h * 0.95);
  context.closePath();
}

function getPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function startScratch(event) {
  event.preventDefault();
  isDrawing = true;
  lastPoint = getPoint(event);
  scratch(event);
}

function scratch(event) {
  if (!isDrawing) return;
  event.preventDefault();

  const point = getPoint(event);
  const rect = canvas.getBoundingClientRect();
  const brushSize = Math.max(22, rect.width * 0.09);

  ctx.globalCompositeOperation = 'destination-out';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = brushSize;

  ctx.beginPath();
  ctx.moveTo(lastPoint.x, lastPoint.y);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2);
  ctx.fill();

  lastPoint = point;
}

function stopScratch() {
  isDrawing = false;
  lastPoint = null;
}
