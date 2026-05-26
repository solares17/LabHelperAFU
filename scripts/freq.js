const state = {
  fc: 2500, amp: 0.5, fm: 1000, um: 100, lfOn: true,
  det: 1, Q: 1, t: 0
};

const colors = { 1: '#2ea043', 2: '#58a6ff', 3: '#bc8cff' };
const el = (id) => document.getElementById(id);


const expData = [
  { fc: 2200, d1_1: -0.05, d1_2: -0.02, d1_3: -0.01, d1_4: 0.00, d2_1: -0.20, d3_1: 0.40 },
  { fc: 2250, d1_1: -0.08, d1_2: -0.04, d1_3: -0.02, d1_4: -0.01, d2_1: -0.22, d3_1: 0.42 },
  { fc: 2300, d1_1: -0.15, d1_2: -0.08, d1_3: -0.04, d1_4: -0.02, d2_1: -0.26, d3_1: 0.44 },
  { fc: 2350, d1_1: -0.30, d1_2: -0.15, d1_3: -0.08, d1_4: -0.05, d2_1: -0.32, d3_1: 0.45 },
  { fc: 2400, d1_1: -0.45, d1_2: -0.28, d1_3: -0.15, d1_4: -0.10, d2_1: -0.40, d3_1: 0.40 },
  { fc: 2450, d1_1: -0.25, d1_2: -0.45, d1_3: -0.30, d1_4: -0.20, d2_1: -0.25, d3_1: 0.20 },
  { fc: 2500, d1_1:  0.00, d1_2:  0.00, d1_3:  0.00, d1_4:  0.00, d2_1:  0.00, d3_1: 0.00 },
  { fc: 2550, d1_1:  0.25, d1_2:  0.45, d1_3:  0.30, d1_4:  0.20, d2_1:  0.25, d3_1: -0.20 },
  { fc: 2600, d1_1:  0.45, d1_2:  0.28, d1_3:  0.15, d1_4:  0.10, d2_1:  0.40, d3_1: -0.40 },
  { fc: 2650, d1_1:  0.30, d1_2:  0.15, d1_3:  0.08, d1_4:  0.05, d2_1:  0.32, d3_1: -0.45 },
  { fc: 2700, d1_1:  0.15, d1_2:  0.08, d1_3:  0.04, d1_4:  0.02, d2_1:  0.26, d3_1: -0.44 },
  { fc: 2750, d1_1:  0.08, d1_2:  0.04, d1_3:  0.02, d1_4:  0.01, d2_1:  0.22, d3_1: -0.42 },
  { fc: 2800, d1_1:  0.05, d1_2:  0.02, d1_3:  0.01, d1_4:  0.00, d2_1:  0.20, d3_1: -0.40 }
];

// --- ИНТЕРПОЛЯЦИЯ (поиск значения между точками таблицы) ---
function getTableValue(fc, det, Q) {
  // Формируем ключ, например 'd1_2' (Детектор 1, Q=2). 
  // Для 2 и 3 детектора в этом примере используем Q=1, если у тебя нет для них разных Q.
  const key = det === 1 ? `d1_${Q}` : `d${det}_1`;

  // Ищем нужный интервал в массиве
  let lower = expData[0];
  let upper = expData[expData.length - 1];

  for (let i = 0; i < expData.length - 1; i++) {
    if (fc >= expData[i].fc && fc <= expData[i + 1].fc) {
      lower = expData[i];
      upper = expData[i + 1];
      break;
    }
  }

  // Если выкрутили ползунок за пределы таблицы — отдаем крайние значения
  if (fc <= lower.fc) return (lower[key] || 0) * (state.amp / 0.5);
  if (fc >= upper.fc) return (upper[key] || 0) * (state.amp / 0.5);

  // Считаем пропорцию между двумя точками
  const ratio = (fc - lower.fc) / (upper.fc - lower.fc);
  const baseValue = lower[key] + ratio * (upper[key] - lower[key]);

  // Умножаем на коэффициент амплитуды генератора (state.amp / 0.5), 
  // чтобы ползунок Uc визуально влиял на размах графика и выходное напряжение.
  return baseValue * (state.amp / 0.5);
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
  el('sb-fc').textContent = state.fc;
  el('sb-amp').textContent = state.amp.toFixed(2);
  el('sb-fm').textContent = state.fm;
  el('sb-det').textContent = '№' + state.det;
  el('sb-q').textContent = 'Q' + state.Q;

  el('disp-fc').textContent = state.fc.toFixed(1) + ' кГц';
  el('disp-amp').textContent = state.amp.toFixed(2) + ' В';
  el('disp-fm').textContent = state.fm + ' Гц';
  el('disp-um').textContent = state.um + ' мВ';

  // Берем значение из нашей таблицы
  const udc = getTableValue(state.fc, state.det, state.Q);
  el('disp-uout').textContent = udc.toFixed(3) + ' В';
  el('sb-out').textContent = udc.toFixed(3);
}

// --- Отрисовка Канвасов ---
function drawChart() {
  const cvs = el('main-chart');
  if (!cvs) return;
  const ctx = cvs.getContext('2d'), W = cvs.width, H = cvs.height;

  ctx.clearRect(0, 0, W, H);
  
  ctx.strokeStyle = '#30363d'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H/2); ctx.lineTo(W, H/2); ctx.stroke();

  const maxV = state.amp * 0.95; // Масштаб по оси Y
  
  // Рисуем кривые из таблицы
  [1,2,3].forEach(det => {
    ctx.beginPath();
    ctx.strokeStyle = colors[det];
    ctx.lineWidth = det === state.det ? 2.5 : 1;
    ctx.globalAlpha = det === state.det ? 1 : 0.3;
    
    // Идем по оси частот с шагом 5 кГц для гладкой линии
    for (let fc = 2200; fc <= 2800; fc += 5) {
      const u = getTableValue(fc, det, state.Q);
      const px = (fc - 2200) / 600 * W;
      const py = H/2 - (u / maxV) * (H/2 - 10); 
      if (fc === 2200) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
  });
  ctx.globalAlpha = 1;

  // Оранжевый маркер текущего положения
  ctx.beginPath();
  const currentU = getTableValue(state.fc, state.det, state.Q);
  ctx.arc((state.fc - 2200) / 600 * W, H/2 - (currentU / maxV) * (H/2 - 10), 6, 0, 7);
  ctx.fillStyle = '#f0883e'; ctx.fill();
}

function drawOsc(cvsId, color, type) {
  const cvs = el(cvsId); if (!cvs) return;
  const ctx = cvs.getContext('2d'), W = cvs.width, H = cvs.height;
  ctx.clearRect(0,0,W,H);
  
  ctx.strokeStyle = '#21262d'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H/2); ctx.lineTo(W, H/2); ctx.stroke();
  
  ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 1.5;
  for (let px = 0; px < W; px += 2) {
    const t = (px / W) * (type === 'lf' ? 3 : 8);
    let y = 0;
    if (type === 'lf') {
      y = state.lfOn ? Math.sin(2*Math.PI*t) * (state.um/200) * 0.8 : 0;
    } else if (type === 'hf') {
      const mod = state.lfOn ? Math.sin(2*Math.PI * t * (state.fm/(state.fc*1000)) * 0.1) : 0;
      y = Math.sin(2*Math.PI * t * (1 + 0.15*mod)) * state.amp;
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
  drawChart();
  requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", () => {
  setupListeners();
  updateUI();
  animate();
});
