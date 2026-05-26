    document.addEventListener('DOMContentLoaded', () => {

        // ── Роли антенн ──
        const roleA1Select = document.getElementById('role-a1');
        const roleA2Select = document.getElementById('role-a2');
        const roleConflict = document.getElementById('role-conflict');

        function updateRoleStyles() {
            const r1 = roleA1Select.value;
            const r2 = roleA2Select.value;

            roleA1Select.className = r1 === 'generator' ? 'role-generator' : 'role-indicator';
            roleA2Select.className = r2 === 'generator' ? 'role-generator' : 'role-indicator';

            if (r1 === r2) {
                roleConflict.textContent = '⚠ Обе антенны — ' + (r1 === 'generator' ? 'генераторы' : 'индикаторы');
            } else {
                roleConflict.textContent = '';
            }
            drawMainSchema();
        }

        roleA1Select.addEventListener('change', updateRoleStyles);
        roleA2Select.addEventListener('change', updateRoleStyles);

        // ── Главная схема ──
        const mainCanvas = document.getElementById('mainCanvas');
        const mainCtx = mainCanvas.getContext('2d');

        const angleSlider = document.getElementById('angle-slider');
        const angleValueDisplay = document.getElementById('angle-value');
        const probeSlider = document.getElementById('probe-slider');
        const probeValueDisplay = document.getElementById('probe-value');
        const btnProbeToggle = document.getElementById('btn-probe-toggle');

        let currentAngleA2 = 0;
        let currentProbeCm = 45.0;
        let probeActive = false; // начальное состояние — ВЫКЛ

        // Кнопка вкл/выкл каретки
        btnProbeToggle.addEventListener('click', () => {
            probeActive = !probeActive;
            btnProbeToggle.textContent = probeActive ? 'ВКЛ' : 'ВЫКЛ';
            btnProbeToggle.classList.toggle('active', probeActive);
            probeSlider.disabled = !probeActive;
            drawMainSchema();
        });

        // Инициализация: ползунок заблокирован при старте
        probeSlider.disabled = true;

        angleSlider.addEventListener('input', (e) => {
            currentAngleA2 = parseInt(e.target.value, 10);
            angleValueDisplay.textContent = currentAngleA2;
            drawMainSchema();
        });

        probeSlider.addEventListener('input', (e) => {
            currentProbeCm = parseFloat(e.target.value);
            probeValueDisplay.textContent = currentProbeCm.toFixed(1);
            drawMainSchema();
        });

        function drawMainSchema() {
            mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

            // Линейка
            mainCtx.fillStyle = '#2a2f3a';
            mainCtx.strokeStyle = '#3a3f4b';
            mainCtx.lineWidth = 2;
            mainCtx.beginPath();
            mainCtx.roundRect(100, 100, 600, 10, 4);
            mainCtx.fill();
            mainCtx.stroke();

            // Каретка (только если активна)
            if (probeActive) {
                const probeX = 100 + (currentProbeCm / 30) * 600;
                mainCtx.beginPath();
                mainCtx.moveTo(probeX, 78);
                mainCtx.lineTo(probeX, 132);
                mainCtx.lineWidth = 3;
                mainCtx.strokeStyle = '#4a9eff';
                mainCtx.stroke();

                // Подсветка под кареткой
                mainCtx.beginPath();
                mainCtx.arc(probeX, 105, 5, 0, 2 * Math.PI);
                mainCtx.fillStyle = 'rgba(74,158,255,0.25)';
                mainCtx.fill();
            }

            // Рупор
            function drawHorn(x, y, isRight, angleDeg = 0, label = '', role = 'generator', antType = 'horn') {
                mainCtx.save();
                mainCtx.translate(x, y);
                mainCtx.rotate(angleDeg * Math.PI / 180);

                const isMag  = antType === 'magnetic';
                const dir    = isRight ? -1 : 1;
                const accent = isMag ? '#00d4aa' : '#4a9eff';
                const fill   = isMag ? '#0d2a26' : '#1a2535';

                mainCtx.lineWidth   = 2;
                mainCtx.strokeStyle = accent;
                mainCtx.fillStyle   = fill;

                // ── Параболическое зеркало ──
                // Параболическая дуга: x = a*t², y = t  для t=-R..R
                const R   = 55;   // радиус раскрыва (полувысота)
                const dep = 38;   // глубина чаши
                const a   = dep / (R * R);
                const steps = 40;

                // Зеркало — заполненная парабола
                mainCtx.beginPath();
                for (let i = 0; i <= steps; i++) {
                    const t   = -R + (2 * R * i / steps);
                    const px  = a * t * t * dir;   // глубина в направлении антенны
                    const py  = t;
                    if (i === 0) mainCtx.moveTo(px, py);
                    else         mainCtx.lineTo(px, py);
                }
                // Замкнуть через раскрыв
                mainCtx.lineTo(0,  R);
                mainCtx.lineTo(0, -R);
                mainCtx.closePath();
                mainCtx.fill();
                mainCtx.stroke();

                // Край раскрыва (прямая линия по раскрыву)
                mainCtx.beginPath();
                mainCtx.moveTo(0, -R);
                mainCtx.lineTo(0,  R);
                mainCtx.lineWidth = 3;
                mainCtx.stroke();
                mainCtx.lineWidth = 2;

                // Облучатель в фокусе параболы (маленький прямоугольник)
                // Фокус параболы: f = 1/(4a) = R²/(4*dep)
                const focus = (R * R) / (4 * dep);
                const fx = focus * dir;
                mainCtx.fillStyle = accent;
                mainCtx.fillRect(fx - 5, -7, 10, 14);
                mainCtx.strokeRect(fx - 5, -7, 10, 14);

                // Стойка облучателя
                mainCtx.beginPath();
                mainCtx.moveTo(0, 0);
                mainCtx.lineTo(fx, 0);
                mainCtx.lineWidth = 1.5;
                mainCtx.setLineDash([3, 3]);
                mainCtx.stroke();
                mainCtx.setLineDash([]);
                mainCtx.lineWidth = 2;

                // Метка
                mainCtx.fillStyle    = role === 'generator' ? '#ff9f43' : '#20c997';
                mainCtx.font         = 'bold 12px Rubik, sans-serif';
                mainCtx.textBaseline = 'middle';
                const lx = isRight ? 14 : -38;
                mainCtx.fillText(label, lx, -R + 10);
                mainCtx.font = '10px Rubik, sans-serif';
                mainCtx.fillText(role === 'generator' ? 'ГЕН' : 'ИНД', lx, -R + 24);

                mainCtx.restore();
            }

            const labelA1 = roleA1Select ? roleA1Select.value : 'generator';
            const labelA2 = roleA2Select ? roleA2Select.value : 'indicator';
            drawHorn(160, 210, false, 0, 'A1', labelA1);
            const antTypeA2 = document.getElementById('ant-type-a2')?.value ?? 'horn';
            drawHorn(640, 210, true, currentAngleA2, 'A2', labelA2, antTypeA2);
        }

        drawMainSchema();

        
        updateRoleStyles();

        // ── Кнопка питания ──
        document.getElementById('btn-toggle').addEventListener('click', function () {
            this.classList.toggle('active');
        });
    });

// ─────────────────────────────────────────────────────────────
// ПАРАМЕТРЫ АНТЕНН
// ─────────────────────────────────────────────────────────────
const ANTENNA_PARAMS = {
    A1: { label: 'А1', G_dB: 10.0 },
    A2: { label: 'А2', G_dB: 12.0 },
};
const STANDARD_ROLES = { generator: 'A1', indicator: 'A2' };

const TABLE_1_FREQ = {
    title: 'Зависимость E от частоты — рупор',
    conditions: { angleA2_deg: 0, attenuator_dB: 0, probe: 'выкл' },
    columns: ['f, МГц', 'E, дБ(мкВ/м)', 'I, мкА'],
    rows: [
        { f_MHz: 2100,  E_mkVm: 2.4, I_mkA: 0   },
    ],
};

// ─────────────────────────────────────────────────────────────
// ТАБЛИЦА 3а — Диаграмма направленности А2 (рупор)
// ─────────────────────────────────────────────────────────────
const TABLE_3_ANGLE_HORN = {
    title: 'Диаграмма направленности — параболическое зеркало',
    conditions: { freq_MHz: 2100, attenuator_dB: 0, probe: 'выкл' },
    columns: ['θ, °', 'E, дБ(мкВ/м)', 'I, мкА'],
    rows: [
        { angle_deg: -90, E_mkVm:  -7.7, I_mkA: null },
        { angle_deg: -75, E_mkVm:  -8.7, I_mkA: null },
        { angle_deg: -60, E_mkVm:  -2.4, I_mkA: null },
        { angle_deg: -45, E_mkVm:  -0.4, I_mkA: null },
        { angle_deg: -30, E_mkVm:   0.0, I_mkA: null },
        { angle_deg: -15, E_mkVm:   2.0, I_mkA: null },
        { angle_deg:   0, E_mkVm:   2.4, I_mkA: null },
        { angle_deg:  15, E_mkVm:   2.0, I_mkA: null },
        { angle_deg:  30, E_mkVm:   0.0, I_mkA: null },
        { angle_deg:  45, E_mkVm:  -0.4, I_mkA: null },
        { angle_deg:  60, E_mkVm:  -2.4, I_mkA: null },
        { angle_deg:  75, E_mkVm:  -8.7, I_mkA: null },
        { angle_deg:  90, E_mkVm:  -7.7, I_mkA: null },
    ],
};

const TABLE_3_ANGLE_MAGNETIC = {
    title: 'Диаграмма направленности А2 — магнитная антенна',
    conditions: { freq_MHz: 835, attenuator_dB: 0, probe: 'выкл' },
    columns: ['θ, °', 'E, дБ(мкВ/м)', 'I, мкА'],
    rows: [
        { angle_deg: -90, E_mkVm: null, I_mkA: null },
        { angle_deg: -75, E_mkVm: null, I_mkA: null },
        { angle_deg: -60, E_mkVm: null, I_mkA: null },
        { angle_deg: -45, E_mkVm: null, I_mkA: null },
        { angle_deg: -30, E_mkVm: null, I_mkA: null },
        { angle_deg: -15, E_mkVm: null, I_mkA: null },
        { angle_deg:   0, E_mkVm: null, I_mkA: null },
        { angle_deg:  15, E_mkVm: null, I_mkA: null },
        { angle_deg:  30, E_mkVm: null, I_mkA: null },
        { angle_deg:  45, E_mkVm: null, I_mkA: null },
        { angle_deg:  60, E_mkVm: null, I_mkA: null },
        { angle_deg:  75, E_mkVm: null, I_mkA: null },
        { angle_deg:  90, E_mkVm: null, I_mkA: null },
    ],
};

// ─────────────────────────────────────────────────────────────
// ТАБЛИЦА 4 — Стоячая волна (динамическая)
// Максимумы: d_n = n * λ/2, где λ/2 (см) = 15000 / f_MHz
// Глубина модуляции (пучность→узел):
// ─────────────────────────────────────────────────────────────
const TABLE_4_PROBE = {
    title: 'Стоячая волна вдоль линии (динамика)',
    dE_node_dB: -28.0,  // глубина узла относительно пучности, дБ
};

// ─────────────────────────────────────────────────────────────
// Экспорт
// ─────────────────────────────────────────────────────────────
const AFU_TABLES = {
    table1:        TABLE_1_FREQ,
    table3_horn:   TABLE_3_ANGLE_HORN,
    table3_mag:    TABLE_3_ANGLE_MAGNETIC,
    table4:        TABLE_4_PROBE,
};

/**
 * logic.js — Логика эмулятора АФУ
 * Зависит от data.js (подключается раньше).
 */

// ─────────────────────────────────────────────────────────────
// ИНТЕРПОЛЯЦИЯ
// ─────────────────────────────────────────────────────────────

function lerp(x0, y0, x1, y1, x) {
    if (x1 === x0) return y0;
    return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
}

function interpolate(rows, keyProp, valProp, x) {
    const valid = rows
        .filter(r => r[keyProp] != null && r[valProp] != null)
        .sort((a, b) => a[keyProp] - b[keyProp]);
    if (!valid.length) return null;
    if (valid.length === 1) return valid[0][valProp];
    if (x <= valid[0][keyProp]) return valid[0][valProp];
    if (x >= valid[valid.length - 1][keyProp]) return valid[valid.length - 1][valProp];
    for (let i = 0; i < valid.length - 1; i++) {
        const a = valid[i], b = valid[i + 1];
        if (x >= a[keyProp] && x <= b[keyProp])
            return lerp(a[keyProp], a[valProp], b[keyProp], b[valProp], x);
    }
    return null;
}

// ─────────────────────────────────────────────────────────────
// ЧТЕНИЕ СОСТОЯНИЯ
// ─────────────────────────────────────────────────────────────

function readState() {
    const freq_MHz    = parseFloat(document.getElementById('freq')?.value) || null;
    const angleA2_deg = parseFloat(document.getElementById('angle-slider')?.value) || 0;
    const probe_cm    = parseFloat(document.getElementById('probe-slider')?.value) || 45;
    const probeActive = document.getElementById('btn-probe-toggle')?.classList.contains('active') ?? false;
    const atten_dB    = parseFloat(document.getElementById('attenuator')?.value) || 0;
    const powerOn     = document.getElementById('btn-toggle')?.classList.contains('active') ?? false;
    const roleA1      = document.getElementById('role-a1')?.value ?? 'generator';
    const roleA2      = document.getElementById('role-a2')?.value ?? 'indicator';
    const antTypeA2   = document.getElementById('ant-type-a2')?.value ?? 'horn';
    return { freq_MHz, angleA2_deg, probe_cm, probeActive,
             atten_dB, powerOn, roleA1, roleA2, antTypeA2 };
}

// ─────────────────────────────────────────────────────────────
// СТОЯЧАЯ ВОЛНА — поправка по позиции каретки
// λ/2 (см) = 15000 / f_MHz
// В пучности sin²=0 → поправка 0; в узле sin²=1 → dE_node_dB
// ─────────────────────────────────────────────────────────────

function probeCorrection(freq_MHz, probe_cm) {
    if (!freq_MHz || freq_MHz <= 0) return 0;
    const halfLambda = 15000 / freq_MHz;
    const sinSq = Math.pow(Math.sin(Math.PI * probe_cm / halfLambda), 2);
    return AFU_TABLES.table4.dE_node_dB * sinSq;
}

// ─────────────────────────────────────────────────────────────
// ОСНОВНОЙ РАСЧЁТ E (дБ мкВ/м)
// ─────────────────────────────────────────────────────────────

function computeE(state) {
    const { freq_MHz, angleA2_deg, probe_cm, probeActive,
            atten_dB, powerOn, roleA1, roleA2, antTypeA2 } = state;

    if (!powerOn || !freq_MHz) return null;

    // База из Таблицы 1
    const E_base = interpolate(AFU_TABLES.table1.rows, 'f_MHz', 'E_mkVm', freq_MHz);
    if (E_base == null) return null;

    // Поправка угла — выбираем таблицу по типу антенны
    let dE_angle = 0;
    const angleTable = antTypeA2 === 'magnetic'
        ? AFU_TABLES.table3_mag
        : AFU_TABLES.table3_horn;
    const E_at_angle = interpolate(angleTable.rows, 'angle_deg', 'E_mkVm', angleA2_deg);
    const E_at_zero  = interpolate(angleTable.rows, 'angle_deg', 'E_mkVm', 0);
    if (E_at_angle != null && E_at_zero != null) {
        dE_angle = E_at_angle - E_at_zero;
    }

    // Поправка каретки (динамическая стоячая волна)
    const dE_probe = probeActive ? probeCorrection(freq_MHz, probe_cm) : 0;

    // Поправка инверсии ролей
    let dE_swap = 0;
    const curGen = roleA1 === 'generator' ? 'A1' : 'A2';
    if (curGen !== STANDARD_ROLES.generator) {
        const stdGen = STANDARD_ROLES.generator;
        const stdInd = STANDARD_ROLES.indicator;
        const curInd = curGen === 'A1' ? 'A2' : 'A1';
        dE_swap = (ANTENNA_PARAMS[curGen].G_dB - ANTENNA_PARAMS[stdGen].G_dB)
                + (ANTENNA_PARAMS[stdInd].G_dB  - ANTENNA_PARAMS[curInd].G_dB);
    }

    return E_base + dE_angle + dE_probe + dE_swap + atten_dB;
}

// I из таблицы 1 — обратная интерполяция E → I
function computeI(E_dB) {
    if (E_dB == null) return null;
    return interpolate(AFU_TABLES.table1.rows, 'E_mkVm', 'I_mkA', E_dB);
}

// ─────────────────────────────────────────────────────────────
// ОБНОВЛЕНИЕ ДИСПЛЕЕВ
// ─────────────────────────────────────────────────────────────

function updateDisplays() {
    const state = readState();
    const E = computeE(state);
    const I = computeI(E);

    // Дисплей E
    const eDisplay = document.getElementById('field-display');
    if (eDisplay) {
        if (!state.powerOn) {
            eDisplay.textContent = '—';
        } else if (E == null) {
            eDisplay.textContent = 'нет данных';
        } else {
            eDisplay.textContent = (E >= 0 ? '+' : '') + E.toFixed(1) + ' дБ(мкВ/м)';
        }
    }

    // Обновляем схему с учётом типа антенны
    if (typeof drawMainSchema === 'function') drawMainSchema();
}

// ─────────────────────────────────────────────────────────────
// ПОДПИСКА НА СОБЫТИЯ
// ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    ['freq', 'angle-slider', 'probe-slider', 'attenuator',
     'role-a1', 'role-a2', 'ant-type-a2'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input',  updateDisplays);
            el.addEventListener('change', updateDisplays);
        }
    });

    ['btn-toggle', 'btn-probe-toggle'].forEach(id => {
        document.getElementById(id)
            ?.addEventListener('click', () => setTimeout(updateDisplays, 0));
    });

    // Следим за крутилкой мощности через MutationObserver (на случай если она осталась)
    const powerDisplay = document.getElementById('power-display');
    if (powerDisplay) {
        new MutationObserver(updateDisplays)
            .observe(powerDisplay, { childList: true, subtree: true, characterData: true });
    }

    updateDisplays();
});
