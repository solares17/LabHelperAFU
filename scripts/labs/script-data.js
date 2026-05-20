/**
 * logic.js — Логика эмулятора АФУ
 *
 * Зависит от: data.js (должен быть подключён раньше)
 *
 * Что делает:
 *  1. Читает текущее состояние интерфейса (частота, мощность,
 *     угол А2, позиция каретки, аттенюатор, питание)
 *  2. По каждой таблице делает линейную интерполяцию
 *  3. Комбинирует результаты в итоговое E (мкВ/м)
 *  4. По таблице 5 пересчитывает E → I (мкА)
 *  5. Обновляет дисплей напряжённости и стрелочный прибор
 */
 
// ─────────────────────────────────────────────────────────────
// УТИЛИТЫ ИНТЕРПОЛЯЦИИ
// ─────────────────────────────────────────────────────────────
 
/**
 * Линейная интерполяция между двумя точками.
 * Если x вне диапазона — зажимаем к ближайшему краю.
 */
function lerp(x0, y0, x1, y1, x) {
    if (x1 === x0) return y0;
    const t = (x - x0) / (x1 - x0);
    return y0 + t * (y1 - y0);
}
 
/**
 * Интерполяция по массиву точек [{key, val}, ...].
 * Возвращает null если таблица пустая или все значения null.
 *
 * @param {Array}  rows    — строки таблицы
 * @param {string} keyProp — имя свойства-аргумента  (напр. 'P_W')
 * @param {string} valProp — имя свойства-результата (напр. 'E_mkVm')
 * @param {number} x       — искомое значение аргумента
 */
function interpolate(rows, keyProp, valProp, x) {
    // Фильтруем только строки с заполненными значениями
    const valid = rows.filter(r => r[keyProp] != null && r[valProp] != null);
    if (valid.length === 0) return null;
    if (valid.length === 1) return valid[0][valProp];
 
    // Сортируем по аргументу
    valid.sort((a, b) => a[keyProp] - b[keyProp]);
 
    // Зажимаем к краям диапазона
    if (x <= valid[0][keyProp])               return valid[0][valProp];
    if (x >= valid[valid.length - 1][keyProp]) return valid[valid.length - 1][valProp];
 
    // Находим соседние точки
    for (let i = 0; i < valid.length - 1; i++) {
        const a = valid[i], b = valid[i + 1];
        if (x >= a[keyProp] && x <= b[keyProp]) {
            return lerp(a[keyProp], a[valProp], b[keyProp], b[valProp], x);
        }
    }
    return null;
}
 
// ─────────────────────────────────────────────────────────────
// ЧТЕНИЕ СОСТОЯНИЯ ИНТЕРФЕЙСА
// ─────────────────────────────────────────────────────────────
 
function readState() {
    // Частота
    const freqInput = document.getElementById('freq');
    const freq_MHz = freqInput ? parseFloat(freqInput.value) || null : null;
 
    // Мощность — читаем из дисплея крутилки (формат "X.XX Вт")
    const powerDisplay = document.getElementById('power-display');
    let power_W = null;
    if (powerDisplay) {
        const match = powerDisplay.textContent.match(/[\d.]+/);
        if (match) power_W = parseFloat(match[0]);
    }
 
    // Угол А2
    const angleSlider = document.getElementById('angle-slider');
    const angleA2_deg = angleSlider ? parseFloat(angleSlider.value) : 0;
 
    // Позиция каретки
    const probeSlider  = document.getElementById('probe-slider');
    const probeToggle  = document.getElementById('btn-probe-toggle');
    const probe_cm     = probeSlider ? parseFloat(probeSlider.value) : 45;
    const probeActive  = probeToggle ? probeToggle.classList.contains('active') : false;
 
    // Аттенюатор
    const attSelect   = document.getElementById('attenuator');
    const atten_dB    = attSelect ? parseFloat(attSelect.value) : 0;
 
    // Питание
    const btnPower    = document.getElementById('btn-toggle');
    const powerOn     = btnPower ? btnPower.classList.contains('active') : false;
 
    // Роли антенн
    const roleA1 = document.getElementById('role-a1')?.value ?? 'generator';
    const roleA2 = document.getElementById('role-a2')?.value ?? 'indicator';
 
    return { freq_MHz, power_W, angleA2_deg, probe_cm, probeActive,
             atten_dB, powerOn, roleA1, roleA2 };
}
 
// ─────────────────────────────────────────────────────────────
// ОСНОВНОЙ РАСЧЁТ
// ─────────────────────────────────────────────────────────────
 
/**
 * Вычисляет итоговую напряжённость E (мкВ/м, дБ-шкала) на основе таблиц.
 *
 * Все значения E хранятся в дБ-подобных единицах (мкВ/м относительно
 * опорного уровня), поэтому поправки складываются, а не умножаются:
 *
 *   E_итог = E_база(P)
 *          + ΔE_угол(θ)      — отклонение от 0° по таблице 3
 *          + ΔE_каретка(d)   — отклонение от максимума по таблице 4
 *          + ΔE_частота(f)   — отклонение от опорной частоты по таблице 1
 *          + atten_dB        — аттенюатор (уже в dB)
 *
 * Если таблица не заполнена — её поправка = 0 (не влияет).
 */
function computeE(state) {
    const { freq_MHz, power_W, angleA2_deg, probe_cm,
            probeActive, atten_dB, powerOn } = state;
 
    if (!powerOn) return null;
 
    // ── База: E по мощности (Таблица 2) ──
    if (power_W == null) return null;
    const E_base = interpolate(AFU_TABLES.table2.rows, 'P_W', 'E_mkVm', power_W);
    if (E_base == null) return null;
 
    // ── Поправка угла (Таблица 3): ΔE = E(θ) − E(0°) ──
    let dE_angle = 0;
    const E_at_angle = interpolate(AFU_TABLES.table3.rows, 'angle_deg', 'E_mkVm', angleA2_deg);
    const E_at_zero  = interpolate(AFU_TABLES.table3.rows, 'angle_deg', 'E_mkVm', 0);
    if (E_at_angle != null && E_at_zero != null) {
        dE_angle = E_at_angle - E_at_zero;
    }
 
    // ── Поправка каретки (Таблица 4): ΔE = E(d) − E_max ──
    let dE_probe = 0;
    if (probeActive && probe_cm != null) {
        const E_at_probe = interpolate(AFU_TABLES.table4.rows, 'd_cm', 'E_mkVm', probe_cm);
        const validProbe = AFU_TABLES.table4.rows.filter(r => r.E_mkVm != null);
        const E_probe_max = validProbe.length ? Math.max(...validProbe.map(r => r.E_mkVm)) : null;
        if (E_at_probe != null && E_probe_max != null) {
            dE_probe = E_at_probe - E_probe_max;
        }
    }
 
    // ── Поправка частоты (Таблица 1): ΔE = E(f) − E(f_ref) ──
    let dE_freq = 0;
    if (freq_MHz != null) {
        const E_at_freq   = interpolate(AFU_TABLES.table1.rows, 'f_MHz', 'E_mkVm', freq_MHz);
        const f_ref       = AFU_TABLES.table2.conditions.freq_MHz;
        const E_at_fref   = interpolate(AFU_TABLES.table1.rows, 'f_MHz', 'E_mkVm', f_ref);
        if (E_at_freq != null && E_at_fref != null) {
            dE_freq = E_at_freq - E_at_fref;
        }
    }
 
    // ── Итог (всё складывается в dB-арифметике) ──
    return E_base + dE_angle + dE_probe + dE_freq + atten_dB;
}
 
/**
 * Пересчитывает E (мкВ/м) → I (мкА) через калибровочную таблицу 5.
 * Если таблица пуста — возвращает null.
 */
function computeI(E_mkVm) {
    if (E_mkVm == null) return null;
    return interpolate(AFU_TABLES.table5.rows, 'E_mkVm', 'I_mkA', E_mkVm);
}
 
// ─────────────────────────────────────────────────────────────
// ОБНОВЛЕНИЕ ИНТЕРФЕЙСА
// ─────────────────────────────────────────────────────────────
 
/**
 * Главная функция обновления — вызывается при любом изменении
 * параметров. Считает E и I, пишет в дисплеи.
 */
function updateDisplays() {
    const state   = readState();
    const E       = computeE(state);
    const I       = (E != null) ? computeI(E) : null;
 
    // Дисплей напряжённости
    const eDisplay = document.getElementById('field-display');
    if (eDisplay) {
        if (!state.powerOn) {
            eDisplay.textContent = '—';
        } else if (E == null) {
            eDisplay.textContent = 'нет данных';
        } else {
            const sign = E >= 0 ? '+' : '';
            eDisplay.textContent = sign + E.toFixed(1) + ' дБ(мкВ/м)';
        }
    }
 
    // Стрелочный прибор — нормируем I к шкале 0–100
    // Максимум шкалы берём как максимум по таблице 5
    const validCalib = AFU_TABLES.table5.rows.filter(r => r.I_mkA != null);
    const I_max      = validCalib.length ? Math.max(...validCalib.map(r => r.I_mkA)) : 100;
 
    let meterValue = 0;
    if (state.powerOn && I != null && I_max > 0) {
        meterValue = Math.min(100, (I / I_max) * 100);
    }
 
    // Вызываем drawMeter из script.js (функция уже определена там)
    if (typeof drawMeter === 'function') {
        drawMeter(meterValue);
    }
 
    // Дисплей тока — если хотим показывать числом тоже
    const iDisplay = document.getElementById('current-display');
    if (iDisplay) {
        if (!state.powerOn || I == null) {
            iDisplay.textContent = '—';
        } else {
            iDisplay.textContent = I.toFixed(2) + ' мкА';
        }
    }
}
 
// ─────────────────────────────────────────────────────────────
// ПОДПИСКА НА СОБЫТИЯ ИНТЕРФЕЙСА
// ─────────────────────────────────────────────────────────────
 
document.addEventListener('DOMContentLoaded', () => {
 
    // Все элементы, при изменении которых нужен пересчёт
    const triggers = [
        'freq',
        'angle-slider',
        'probe-slider',
        'attenuator',
        'role-a1',
        'role-a2',
    ];
 
    triggers.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateDisplays);
        if (el) el.addEventListener('change', updateDisplays);
    });
 
    // Кнопка питания
    const btnPower = document.getElementById('btn-toggle');
    if (btnPower) btnPower.addEventListener('click', () => {
        // Небольшая задержка, чтобы класс .active успел переключиться
        setTimeout(updateDisplays, 0);
    });
 
    // Кнопка каретки
    const btnProbe = document.getElementById('btn-probe-toggle');
    if (btnProbe) btnProbe.addEventListener('click', () => {
        setTimeout(updateDisplays, 0);
    });
 
    // Крутилка мощности — обновляем после изменения дисплея
    // Используем MutationObserver, т.к. крутилка не input-элемент
    const powerDisplay = document.getElementById('power-display');
    if (powerDisplay) {
        const observer = new MutationObserver(updateDisplays);
        observer.observe(powerDisplay, { childList: true, subtree: true, characterData: true });
    }
 
    // Первоначальный расчёт
    updateDisplays();
});
 




/**
 * data.js — Таблицы измерений для эмулятора АФУ
 * (тестовые значения для проверки логики)
 */
 
// ─────────────────────────────────────────────────────────────
// ТАБЛИЦА 1 — Зависимость E от частоты
// Условия: P=1Вт, угол=0°, аттенюатор выкл, каретка выкл
// ─────────────────────────────────────────────────────────────
const TABLE_1_FREQ = {
    title: 'Зависимость напряжённости от частоты',
    conditions: {
        power_W:      1.0,
        angleA2_deg:  0,
        attenuator_dB: 0,
        probe:        'выкл',
    },
    columns: ['f, МГц', 'E, мкВ/м', 'I, мкА'],
    rows: [
        { f_MHz: 410,  E_mkVm: -38.5, I_mkA: 8.2  },
        { f_MHz: 500,  E_mkVm: -32.1, I_mkA: 14.5 },
        { f_MHz: 600,  E_mkVm: -22.7, I_mkA: 24.0 },
        { f_MHz: 700,  E_mkVm: -12.4, I_mkA: 35.8 },
        { f_MHz: 800,  E_mkVm:   0.0, I_mkA: 52.0 },
        { f_MHz: 900,  E_mkVm:  -8.3, I_mkA: 42.1 },
        { f_MHz: 1000, E_mkVm: -15.6, I_mkA: 33.4 },
        { f_MHz: 1100, E_mkVm: -25.2, I_mkA: 20.7 },
        { f_MHz: 1220, E_mkVm: -35.9, I_mkA: 10.1 },
    ],
};
 
// ─────────────────────────────────────────────────────────────
// ТАБЛИЦА 2 — Зависимость E от мощности
// Условия: f=800МГц, угол=0°, аттенюатор выкл, каретка выкл
// ─────────────────────────────────────────────────────────────
const TABLE_2_POWER = {
    title: 'Зависимость напряжённости от мощности',
    conditions: {
        freq_MHz:     800,
        angleA2_deg:  0,
        attenuator_dB: 0,
        probe:        'выкл',
    },
    columns: ['P, Вт', 'E, мкВ/м', 'I, мкА'],
    rows: [
        { P_W: 0.1,  E_mkVm: -39.5, I_mkA:  6.8  },
        { P_W: 0.5,  E_mkVm: -25.5, I_mkA: 19.2  },
        { P_W: 1.0,  E_mkVm:   0.0, I_mkA: 52.0  },
        { P_W: 2.0,  E_mkVm:   6.0, I_mkA: 61.4  },
        { P_W: 3.0,  E_mkVm:   9.5, I_mkA: 66.8  },
        { P_W: 5.0,  E_mkVm:  14.0, I_mkA: 72.5  },
        { P_W: 7.0,  E_mkVm:  17.5, I_mkA: 76.3  },
        { P_W: 10.0, E_mkVm:  20.0, I_mkA: 79.8  },
    ],
};
 
// ─────────────────────────────────────────────────────────────
// ТАБЛИЦА 3 — Диаграмма направленности А2
// Условия: f=800МГц, P=1Вт, аттенюатор выкл, каретка выкл
// ─────────────────────────────────────────────────────────────
const TABLE_3_ANGLE = {
    title: 'Диаграмма направленности А2',
    conditions: {
        freq_MHz:     800,
        power_W:      1.0,
        attenuator_dB: 0,
        probe:        'выкл',
    },
    columns: ['θ, °', 'E, мкВ/м', 'I, мкА'],
    rows: [
        { angle_deg: -90, E_mkVm: -39.1, I_mkA:  7.0  },
        { angle_deg: -75, E_mkVm: -33.4, I_mkA: 12.8  },
        { angle_deg: -60, E_mkVm: -24.7, I_mkA: 22.5  },
        { angle_deg: -45, E_mkVm: -14.2, I_mkA: 34.6  },
        { angle_deg: -30, E_mkVm:  -5.8, I_mkA: 44.3  },
        { angle_deg: -15, E_mkVm:  -1.2, I_mkA: 50.1  },
        { angle_deg:   0, E_mkVm:   0.0, I_mkA: 52.0  },
        { angle_deg:  15, E_mkVm:  -1.2, I_mkA: 50.1  },
        { angle_deg:  30, E_mkVm:  -5.8, I_mkA: 44.3  },
        { angle_deg:  45, E_mkVm: -14.2, I_mkA: 34.6  },
        { angle_deg:  60, E_mkVm: -24.7, I_mkA: 22.5  },
        { angle_deg:  75, E_mkVm: -33.4, I_mkA: 12.8  },
        { angle_deg:  90, E_mkVm: -39.1, I_mkA:  7.0  },
    ],
};
 
// ─────────────────────────────────────────────────────────────
// ТАБЛИЦА 4 — Распределение поля вдоль линии (каретка)
// Условия: f=800МГц, P=1Вт, угол=0°, аттенюатор выкл
// ─────────────────────────────────────────────────────────────
const TABLE_4_PROBE = {
    title: 'Распределение поля вдоль линии (каретка)',
    conditions: {
        freq_MHz:     800,
        power_W:      1.0,
        angleA2_deg:  0,
        attenuator_dB: 0,
        probe:        'вкл',
    },
    columns: ['d, см', 'E, мкВ/м', 'I, мкА'],
    rows: [
        { d_cm:  0,  E_mkVm: -38.0, I_mkA:  8.5  },
        { d_cm:  5,  E_mkVm: -18.3, I_mkA: 30.2  },
        { d_cm: 10,  E_mkVm:   0.0, I_mkA: 52.0  },  // максимум (пучность)
        { d_cm: 15,  E_mkVm: -16.5, I_mkA: 32.4  },
        { d_cm: 20,  E_mkVm: -36.8, I_mkA:  9.8  },  // минимум (узел)
        { d_cm: 25,  E_mkVm: -17.2, I_mkA: 31.6  },
        { d_cm: 30,  E_mkVm:   0.0, I_mkA: 52.0  },  // максимум
        { d_cm: 35,  E_mkVm: -17.2, I_mkA: 31.6  },
        { d_cm: 40,  E_mkVm: -36.8, I_mkA:  9.8  },  // минимум
        { d_cm: 45,  E_mkVm: -17.8, I_mkA: 31.0  },
        { d_cm: 50,  E_mkVm:   0.0, I_mkA: 52.0  },  // максимум
        { d_cm: 55,  E_mkVm: -17.2, I_mkA: 31.6  },
        { d_cm: 60,  E_mkVm: -36.8, I_mkA:  9.8  },  // минимум
        { d_cm: 65,  E_mkVm: -18.3, I_mkA: 30.2  },
        { d_cm: 70,  E_mkVm:   0.0, I_mkA: 52.0  },  // максимум
        { d_cm: 75,  E_mkVm: -16.5, I_mkA: 32.4  },
        { d_cm: 80,  E_mkVm: -36.0, I_mkA: 10.5  },
        { d_cm: 85,  E_mkVm: -19.4, I_mkA: 29.1  },
        { d_cm: 90,  E_mkVm: -38.5, I_mkA:  8.2  },
    ],
};
 
// ─────────────────────────────────────────────────────────────
// ТАБЛИЦА 5 — Калибровка E (мкВ/м) ↔ I (мкА)
// Условия: f=800МГц, угол=0°, аттенюатор выкл
// ─────────────────────────────────────────────────────────────
const TABLE_5_CALIB = {
    title: 'Калибровочная кривая E → I',
    conditions: {
        freq_MHz:     800,
        angleA2_deg:  0,
        attenuator_dB: 0,
        probe:        'выкл',
        note:         'Мощность меняется плавно; фиксировать пары (E, I) одновременно',
    },
    columns: ['E, мкВ/м', 'I, мкА'],
    rows: [
        { E_mkVm: -40.0, I_mkA:  5.0  },
        { E_mkVm: -30.0, I_mkA: 11.8  },
        { E_mkVm: -20.0, I_mkA: 23.5  },
        { E_mkVm: -10.0, I_mkA: 38.2  },
        { E_mkVm:  -5.0, I_mkA: 45.4  },
        { E_mkVm:   0.0, I_mkA: 52.0  },
        { E_mkVm:   5.0, I_mkA: 58.6  },
        { E_mkVm:  10.0, I_mkA: 64.8  },
        { E_mkVm:  15.0, I_mkA: 71.5  },
        { E_mkVm:  20.0, I_mkA: 79.8  },
    ],
};
 
// ─────────────────────────────────────────────────────────────
// Экспорт
// ─────────────────────────────────────────────────────────────
const AFU_TABLES = {
    table1: TABLE_1_FREQ,
    table2: TABLE_2_POWER,
    table3: TABLE_3_ANGLE,
    table4: TABLE_4_PROBE,
    table5: TABLE_5_CALIB,
};
 
