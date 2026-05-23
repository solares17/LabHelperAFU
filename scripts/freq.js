const state = {
  fc: 2500, amp: 0.5, fm: 1000, um: 100, lfOn: true,
  det: 1, Q: 1, t: 0,
  measurements: []
};

// Цвета графиков (в стиле GitHub Dark)
const colors = { 1: '#2ea043', 2: '#58a6ff', 3: '#bc8cff' };
const el = (id) => document.getElementById(id);

// --- Математические модели детекторов ---
function detectorOutput(fc, det, Q) {
  const amp = state.amp;
  const fc0 = 2500;
  const bw = 200 * [1.0, 0.7, 0.5, 0.35][Q-1]; 

  if (det === 1) { // АД
    const x = (fc - (fc0 + 80)) / (bw * 0.5);
    let u = amp * 0.9 * x / (1 + x*x) * 2;
    return +Math.max(-amp*0.9, Math.min(amp*0.9, u)).toFixed(3);
  } else if (det === 2) { // Дробный
    const x = (fc - fc0) / (bw * 0.6);
    let u = amp * 0.75 * x / (1 + 0.5*x*x) * 1.8;
    return +Math.max(-amp*0.8, Math.min(amp*0.8, u)).toFixed(3);
  } else { // ФД
    const x = (fc - fc0) / (bw * 0.8);
    let u = -amp * 0.85 * Math.atan(x*1.5) / (Math.PI/2);
    return +Math.max(-amp*0.85, Math.min(amp*0.85, u)).toFixed(3);
  }
}

function lfOutput() {
  if (!state.lfOn || state.um < 1) return 0;
  // Крутизна характеристики (производная)
  const slope = Math.abs((detectorOutput(state.fc+5, state.det, state.Q) - detectorOutput(state.fc-5, state.det, state.Q)) / 10);
  const df = state.um * 0.5;
  return Math.min(slope * df * (state.amp / 0.5), state.amp * 0.9) * 1000;
}

// --- Управление UI ---
function setupListeners() {
  el('sl-fc').addEventListener('input', e => { state.fc = +e.target.value; updateUI(); });
  el('sl-amp').addEventListener('input', e => { state.amp = +e.target.value; updateUI(); });
  el('sl-fm').addEventListener('input', e => { state.fm = +e.target.value; updateUI(); });
  el('sl-um').addEventListener('input', e => { state.um = +e.target.value; updateUI(); });
}

function setDet(n) {
  state.det = n;
  [1,2,3].forEach(i => el('det'+i).classList.toggle('active', i===n));
  updateUI();
}

function setQ(n) {
  state.Q = n;
  [1,2,3,4].forEach(i => el('qb'+i).classList.toggle('active', i===n));
  updateUI();
}

function toggleLF() {
  state.lfOn = !state.lfOn;
  el('lf-status-txt').textContent = state.lfOn ? 'Активен' : 'Отключен';
  el('lf-status-txt').className = state.lfOn ? 'hl-green' : 'hl-text';
  el('btn-lf-off').classList.toggle('hidden', !state.lfOn);
  el('btn-lf-on').classList.toggle('hidden', state.lfOn);
  updateUI();
}

function updateUI() {
  // Обновление текст-боксов
  el('sb-fc').textContent = state.fc;
  el('sb-amp').textContent = state.amp.toFixed(2);
  el('sb-fm').textContent = state.fm;
  el('sb-det').textContent = '№' + state.det;
  el('sb-q').textContent = 'Q' + state.Q;

  el('disp-fc').textContent = state.fc.toFixed(1) + ' кГц';
  el('disp-amp').textContent = state.amp.toFixed(2) + ' В';
  el('disp-fm').textContent = state.fm + ' Гц';
  el('disp-um').textContent = state.um + ' мВ';

  // Расчет выходов
  const udc = detectorOutput(state.fc, state.det, state.Q);
  el('disp-uout').textContent = udc.toFixed(3) + ' В';
  el('sb-out').textContent = udc.toFixed(3);
  
  // Анимация стрелки (от -85 до +85 градусов)
  el('needle').style.transform = `rotate(${(udc / (state.amp * 0.9)) * 85}deg)`;
}

// --- Отрисовка Канвасов ---
function drawChart() {
  const cvs = el('main-chart');
  if (!cvs) return;
  const ctx = cvs.getContext('2d'), W = cvs.width, H = cvs.height;

  ctx.clearRect(0, 0, W, H);
  
  // Центральная ось
  ctx.strokeStyle = '#30363d'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H/2); ctx.lineTo(W, H/2); ctx.stroke();

  const maxV = state.amp * 0.95;
  
  // Теоретические кривые
  [1,2,3].forEach(det => {
    ctx.beginPath();
    ctx.strokeStyle = colors[det];
    ctx.lineWidth = det === state.det ? 2.5 : 1;
    ctx.globalAlpha = det === state.det ? 1 : 0.3;
    for (let fc = 2200; fc <= 2800; fc += 5) {
      const u = detectorOutput(fc, det, state.Q);
      const px = (fc-2200) / 600 * W;
      const py = H/2 - (u / maxV) * (H/2 - 10); // padding 10px
      if (fc === 2200) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
  });
  ctx.globalAlpha = 1;

  // Измеренные точки
  state.measurements.forEach(m => {
    ctx.beginPath();
    ctx.arc((m.fc-2200)/600*W, H/2 - (m.u/maxV)*(H/2 - 10), 4, 0, 7);
    ctx.fillStyle = colors[m.det]; ctx.fill();
    ctx.strokeStyle = '#0d1117'; ctx.lineWidth = 1.5; ctx.stroke();
  });

  // Текущее положение
  ctx.beginPath();
  ctx.arc((state.fc-2200)/600*W, H/2 - (detectorOutput(state.fc, state.det, state.Q)/maxV)*(H/2 - 10), 6, 0, 7);
  ctx.fillStyle = '#f0883e'; ctx.fill();
}

function clearChart() { 
  state.measurements = []; 
}

function takeMeasurement() {
  state.measurements.push({fc: state.fc, det: state.det, Q: state.Q, u: detectorOutput(state.fc, state.det, state.Q)});
}

// --- Осциллографы ---
function drawOsc(cvsId, color, type) {
  const cvs = el(cvsId); if (!cvs) return;
  const ctx = cvs.getContext('2d'), W = cvs.width, H = cvs.height;
  ctx.clearRect(0,0,W,H);
  
  // Сетка (1 линия по центру)
  ctx.strokeStyle = '#21262d'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H/2); ctx.lineTo(W, H/2); ctx.stroke();
  
  ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 1.5;
  for (let px = 0; px < W; px += 2) {
    const t = (px / W) * (type === 'lf' ? 3 : 8);
    let y = 0;
    if (type === 'lf') y = state.lfOn ? Math.sin(2*Math.PI*t) * (state.um/200) * 0.8 : 0;
    else if (type === 'hf') {
      const mod = state.lfOn ? Math.sin(2*Math.PI * t * (state.fm/(state.fc*1000)) * 0.1) : 0;
      y = Math.sin(2*Math.PI * t * (1 + 0.15*mod)) * state.amp;
    } else { // out
      const udc = detectorOutput(state.fc, state.det, state.Q);
      const modulated = state.lfOn ? (lfOutput()/1000) * Math.sin(2*Math.PI * t * 0.8) : 0;
      y = udc / (state.amp * 0.9) * 0.5 + modulated / state.amp;
    }
    const py = H/2 - y * (H/2 - 4);
    if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.stroke();
}

function animate() {
  state.t += 0.016;
  drawOsc('osc-lf', '#2ea043', 'lf');
  drawOsc('osc-hf', '#58a6ff', 'hf');
  drawOsc('osc-out', '#f0883e', 'out');
  drawChart();
  requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", () => {
  setupListeners();
  updateUI();
  animate();
});
