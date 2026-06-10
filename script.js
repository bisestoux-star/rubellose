const card = document.getElementById('card');
const coinButton = document.getElementById('coinButton');
const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');

let scratchReady = false;
let isDrawing = false;
let lastPoint = null;

// Rubbel-Schicht direkt beim Laden vorbereiten,
// damit die Nachricht nie kurz sichtbar ist.
window.addEventListener('load', initScratchCard);

coinButton.addEventListener('click', () => {
  coinButton.classList.add('is-tapped');

  window.setTimeout(() => {
    card.classList.add('is-flipped');
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

  // Herzform
  ctx.save();
  heartPath(ctx, w, h);
  ctx.clip();

  // Glatte goldene Rubbel-Fläche ohne Schraffierung
  ctx.fillStyle = '#c7ad75';
  ctx.fillRect(0, 0, w, h);

  ctx.restore();

  // Dezenter Rand wie in deiner Vorlage
  ctx.save();
  heartPath(ctx, w, h);
  ctx.strokeStyle = '#7b0008';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();
}

function heartPath(context, w, h) {
  context.beginPath();

  // Etwas natürlichere Herzform, näher an deinem SVG:
  // breiter oben, Spitze unten, weniger gestaucht.
  context.moveTo(w / 2, h * 0.96);

  context.bezierCurveTo(
    w * 0.08, h * 0.62,
    w * 0.00, h * 0.28,
    w * 0.22, h * 0.10
  );

  context.bezierCurveTo(
    w * 0.36, h * -0.02,
    w * 0.49, h * 0.08,
    w / 2, h * 0.22
  );

  context.bezierCurveTo(
    w * 0.51, h * 0.08,
    w * 0.64, h * -0.02,
    w * 0.78, h * 0.10
  );

  context.bezierCurveTo(
    w * 1.00, h * 0.28,
    w * 0.92, h * 0.62,
    w / 2, h * 0.96
  );

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
