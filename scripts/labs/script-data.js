const ANTENNA_PARAMS = {
    A1: {
        label: 'А1',
        G_dB: 10.0,   // <-- сюда коэффициент усиления А1
    },
    A2: {
        label: 'А2',
        G_dB: 12.0,   // <-- сюда коэффициент усиления А2
    },
};
 
// Таблицы снимались при стандартном подключении:
//   A1 = генератор, A2 = индикатор.
// При инверсии логика добавит поправку dE_swap = G_A1 - G_A2.
const STANDARD_ROLES = { generator: 'A1', indicator: 'A2' };


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
    columns: ['f, МГц', 'E, dB', 'I, мкА'],
    rows: [
        { f_MHz: 410,  E_mkVm: -37.3, I_mkA: 0  },
        { f_MHz: 450,  E_mkVm: -26.1, I_mkA: 0  },
        { f_MHz: 462,  E_mkVm: -0.5, I_mkA: 10  },
        { f_MHz: 470,  E_mkVm: -6.3, I_mkA: 7  },
        { f_MHz: 477,  E_mkVm: -34.1, I_mkA: 0  },
        { f_MHz: 492,  E_mkVm: -25.7, I_mkA: 1  },
        { f_MHz: 510,  E_mkVm: -34.5, I_mkA: 2  },
        { f_MHz: 534,  E_mkVm: -16.5, I_mkA: 0 },
        { f_MHz: 540,  E_mkVm: -30.2, I_mkA: 0 },
        { f_MHz: 560,  E_mkVm: -31.6, I_mkA: 1  },
        { f_MHz: 596,  E_mkVm: -10.5, I_mkA: 1 },
        { f_MHz: 610,  E_mkVm: -24.2, I_mkA: 0 },
        { f_MHz: 635,  E_mkVm: -18.3, I_mkA: 7  },
        { f_MHz: 645,  E_mkVm: -24.8, I_mkA: 20 },
        { f_MHz: 657,  E_mkVm: -15.5, I_mkA: 60 },
        { f_MHz: 663,  E_mkVm: -19.3, I_mkA: 6 },
        { f_MHz: 694,  E_mkVm:  -6.3, I_mkA: 72 },
        { f_MHz: 705,  E_mkVm: -1.8, I_mkA: 30  },
        { f_MHz: 712, E_mkVm: -7.6, I_mkA: 8 },
        { f_MHz: 742, E_mkVm:6, I_mkA: 120},
        { f_MHz: 750, E_mkVm: 5.5, I_mkA: 120 },
        { f_MHz: 759,  E_mkVm: 7.9, I_mkA: 98  },
        { f_MHz: 784,  E_mkVm: -4.3, I_mkA: 120 },
        { f_MHz: 795,  E_mkVm: 3.5, I_mkA: 120 },
        { f_MHz: 810,  E_mkVm: -00.3, I_mkA: 35  },
        { f_MHz: 819,  E_mkVm: 7.8, I_mkA: 120 },
        { f_MHz: 823,  E_mkVm: 4.3, I_mkA: 120  },
        { f_MHz: 835,  E_mkVm: 8.3, I_mkA: 120  },
        { f_MHz: 856,  E_mkVm: 2.9, I_mkA: 40 },
        { f_MHz: 875,  E_mkVm: -3.2, I_mkA: 19 },
        { f_MHz: 880,  E_mkVm: -12.3, I_mkA: 42  },
        { f_MHz: 890,  E_mkVm: -2.1, I_mkA: 76  },
        { f_MHz: 920,  E_mkVm: 3.9, I_mkA: 120  },
        { f_MHz: 932,  E_mkVm: 1.4, I_mkA: 90 },
        { f_MHz: 942,  E_mkVm: 4.2, I_mkA: 100  },
        { f_MHz: 950,  E_mkVm: 1.8, I_mkA: 77 },
        { f_MHz: 960,  E_mkVm: -1.3, I_mkA: 120  },
        { f_MHz: 978,  E_mkVm: -0.8, I_mkA: 70  },
        { f_MHz: 990,  E_mkVm: -11.0, I_mkA: 120 },
        { f_MHz: 1030,  E_mkVm: 2.3, I_mkA: 120  },
        { f_MHz: 1049,  E_mkVm: 3.3, I_mkA: 89  },
        { f_MHz: 1058,  E_mkVm: 4.3, I_mkA: 120 },
        { f_MHz: 1068,  E_mkVm: 1.9, I_mkA: 98  },
        { f_MHz: 1080,  E_mkVm: 3.8, I_mkA: 100  },
        { f_MHz: 1100,  E_mkVm: -2.8, I_mkA: 120 },
        { f_MHz: 1108,  E_mkVm: -1.7, I_mkA:99  },
        { f_MHz: 1115,  E_mkVm: -4.1, I_mkA: 80  },
        { f_MHz: 1120,  E_mkVm: -9, I_mkA:76  },
        { f_MHz: 1135,  E_mkVm: 0.0, I_mkA: 43 },
        { f_MHz: 1160,  E_mkVm: 5.6, I_mkA: 66  },
        { f_MHz: 1170,  E_mkVm: 5.3, I_mkA: 40  },
        { f_MHz: 1186,  E_mkVm: 5.7, I_mkA: 65  },
        { f_MHz: 1205,  E_mkVm: 1.4, I_mkA: 20  },
        { f_MHz: 1220,  E_mkVm: -10.3, I_mkA: 82  },
        { f_MHz: 1225,  E_mkVm: -16.6, I_mkA: 70 }
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
 
