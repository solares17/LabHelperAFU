
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
            eDisplay.textContent = (E >= 0 ? '+' : '') + E.toFixed(1) + ' дБм';
        }
    }

    // Стрелочный прибор — нормируем I по максимуму таблицы 1
    const validRows = AFU_TABLES.table1.rows.filter(r => r.I_mkA != null);
    const I_max = validRows.length ? Math.max(...validRows.map(r => r.I_mkA)) : 120;
    let meterValue = 0;
    if (state.powerOn && I != null) {
        meterValue = Math.min(100, Math.max(0, (I / I_max) * 100));
    }
    if (typeof drawMeter === 'function') drawMeter(meterValue);

    // Обновляем схему с учётом типа антенны
    if (typeof drawMainSchema === 'function') drawMainSchema();
}

// ─────────────────────────────────────────────────────────────
// ПОДПИСКА НА СОБЫТИЯ
// ─────────────────────────────────────────────────────────────

(() => { 
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
})();


 
