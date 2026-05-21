
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
 
    // ── Поправка на инверсию ролей антенн ──
    // Таблицы сняты при стандарте: A1=генератор, A2=индикатор.
    // Если роли поменяли — добавляем разницу коэффициентов усиления.
    let dE_swap = 0;
    const stdGen = STANDARD_ROLES.generator;   // 'A1'
    const stdInd = STANDARD_ROLES.indicator;   // 'A2'
    const curGen = state.roleA1 === 'generator' ? 'A1' : 'A2';
    const curInd = state.roleA1 === 'indicator' ? 'A1' : 'A2';
    const isInverted = curGen !== stdGen;
    if (isInverted) {
        // При инверсии: генератор теперь A2, индикатор — A1
        // Поправка = (G_нового_генератора - G_стандартного_генератора)
        //          + (G_стандартного_индикатора - G_нового_индикатора) 
        // Упрощённо: разница усилений между антеннами, взятая со знаком
        dE_swap = (ANTENNA_PARAMS[curGen].G_dB - ANTENNA_PARAMS[stdGen].G_dB)
                + (ANTENNA_PARAMS[stdInd].G_dB - ANTENNA_PARAMS[curInd].G_dB);
    }
 
    // ── Итог (всё складывается в dB-арифметике) ──
    return E_base + dE_angle + dE_probe + dE_freq + atten_dB + dE_swap;
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
            eDisplay.textContent = sign + E.toFixed(1) + ' дБ';
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
 (() => {
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
})();
 
