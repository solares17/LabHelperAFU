// ─────────────────────────────────────────────────────────────
// ПАРАМЕТРЫ АНТЕНН
// ─────────────────────────────────────────────────────────────
const ANTENNA_PARAMS = {
    A1: { label: 'А1', G_dB: 10.0 },
    A2: { label: 'А2', G_dB: 12.0 },
};
const STANDARD_ROLES = { generator: 'A1', indicator: 'A2' };

// ─────────────────────────────────────────────────────────────
// ТАБЛИЦА 1 — E от частоты (рупорная А2, угол 0°)
// ─────────────────────────────────────────────────────────────
const TABLE_1_FREQ = {
    title: 'Зависимость E от частоты — рупор',
    conditions: { angleA2_deg: 0, attenuator_dB: 0, probe: 'выкл' },
    columns: ['f, МГц', 'E, дБ(мкВ/м)', 'I, мкА'],
    rows: [
        { f_MHz: 410,  E_mkVm: -37.3, I_mkA: 0   },
        { f_MHz: 450,  E_mkVm: -26.1, I_mkA: 0   },
        { f_MHz: 462,  E_mkVm:  -0.5, I_mkA: 10  },
        { f_MHz: 470,  E_mkVm:  -6.3, I_mkA: 7   },
        { f_MHz: 477,  E_mkVm: -34.1, I_mkA: 0   },
        { f_MHz: 492,  E_mkVm: -25.7, I_mkA: 1   },
        { f_MHz: 510,  E_mkVm: -34.5, I_mkA: 2   },
        { f_MHz: 534,  E_mkVm: -16.5, I_mkA: 0   },
        { f_MHz: 540,  E_mkVm: -30.2, I_mkA: 0   },
        { f_MHz: 560,  E_mkVm: -31.6, I_mkA: 1   },
        { f_MHz: 596,  E_mkVm: -10.5, I_mkA: 1   },
        { f_MHz: 610,  E_mkVm: -24.2, I_mkA: 0   },
        { f_MHz: 635,  E_mkVm: -18.3, I_mkA: 7   },
        { f_MHz: 645,  E_mkVm: -24.8, I_mkA: 20  },
        { f_MHz: 657,  E_mkVm: -15.5, I_mkA: 60  },
        { f_MHz: 663,  E_mkVm: -19.3, I_mkA: 6   },
        { f_MHz: 694,  E_mkVm:  -6.3, I_mkA: 72  },
        { f_MHz: 705,  E_mkVm:  -1.8, I_mkA: 30  },
        { f_MHz: 712,  E_mkVm:  -7.6, I_mkA: 8   },
        { f_MHz: 742,  E_mkVm:   6.0, I_mkA: 120 },
        { f_MHz: 750,  E_mkVm:   5.5, I_mkA: 120 },
        { f_MHz: 759,  E_mkVm:   7.9, I_mkA: 98  },
        { f_MHz: 784,  E_mkVm:  -4.3, I_mkA: 120 },
        { f_MHz: 795,  E_mkVm:   3.5, I_mkA: 120 },
        { f_MHz: 810,  E_mkVm:  -0.3, I_mkA: 35  },
        { f_MHz: 819,  E_mkVm:   7.8, I_mkA: 120 },
        { f_MHz: 823,  E_mkVm:   4.3, I_mkA: 120 },
        { f_MHz: 835,  E_mkVm:   8.3, I_mkA: 120 },
        { f_MHz: 856,  E_mkVm:   2.9, I_mkA: 40  },
        { f_MHz: 875,  E_mkVm:  -3.2, I_mkA: 19  },
        { f_MHz: 880,  E_mkVm: -12.3, I_mkA: 42  },
        { f_MHz: 890,  E_mkVm:  -2.1, I_mkA: 76  },
        { f_MHz: 920,  E_mkVm:   3.9, I_mkA: 120 },
        { f_MHz: 932,  E_mkVm:   1.4, I_mkA: 90  },
        { f_MHz: 942,  E_mkVm:   4.2, I_mkA: 100 },
        { f_MHz: 950,  E_mkVm:   1.8, I_mkA: 77  },
        { f_MHz: 960,  E_mkVm:  -1.3, I_mkA: 120 },
        { f_MHz: 978,  E_mkVm:  -0.8, I_mkA: 70  },
        { f_MHz: 990,  E_mkVm: -11.0, I_mkA: 120 },
        { f_MHz: 1030, E_mkVm:   2.3, I_mkA: 120 },
        { f_MHz: 1049, E_mkVm:   3.3, I_mkA: 89  },
        { f_MHz: 1058, E_mkVm:   4.3, I_mkA: 120 },
        { f_MHz: 1068, E_mkVm:   1.9, I_mkA: 98  },
        { f_MHz: 1080, E_mkVm:   3.8, I_mkA: 100 },
        { f_MHz: 1100, E_mkVm:  -2.8, I_mkA: 120 },
        { f_MHz: 1108, E_mkVm:  -1.7, I_mkA: 99  },
        { f_MHz: 1115, E_mkVm:  -4.1, I_mkA: 80  },
        { f_MHz: 1120, E_mkVm:  -9.0, I_mkA: 76  },
        { f_MHz: 1135, E_mkVm:   0.0, I_mkA: 43  },
        { f_MHz: 1160, E_mkVm:   5.6, I_mkA: 66  },
        { f_MHz: 1170, E_mkVm:   5.3, I_mkA: 40  },
        { f_MHz: 1186, E_mkVm:   5.7, I_mkA: 65  },
        { f_MHz: 1205, E_mkVm:   1.4, I_mkA: 20  },
        { f_MHz: 1220, E_mkVm: -10.3, I_mkA: 82  },
        { f_MHz: 1225, E_mkVm: -16.6, I_mkA: 70  },
    ],
};

// ─────────────────────────────────────────────────────────────
// ТАБЛИЦА 3а — Диаграмма направленности А2 (рупор)
// ─────────────────────────────────────────────────────────────
const TABLE_3_ANGLE_HORN = {
    title: 'Диаграмма направленности А2 — рупор',
    conditions: { freq_MHz: 835, attenuator_dB: 0, probe: 'выкл' },
    columns: ['θ, °', 'E, дБ(мкВ/м)', 'I, мкА'],
    rows: [
        { angle_deg: -90, E_mkVm: -20.0, I_mkA: 25  },
        { angle_deg: -75, E_mkVm: -14.0, I_mkA: 35  },
        { angle_deg: -60, E_mkVm: -12.0, I_mkA: 40  },
        { angle_deg: -45, E_mkVm:  -7.2, I_mkA: 40  },
        { angle_deg: -30, E_mkVm:  -4.7, I_mkA: 60  },
        { angle_deg: -15, E_mkVm:   1.4, I_mkA: 121 },
        { angle_deg:   0, E_mkVm:   8.3, I_mkA: 120 },
        { angle_deg:  15, E_mkVm:   1.4, I_mkA: 120 },
        { angle_deg:  30, E_mkVm:  -4.7, I_mkA: 60  },
        { angle_deg:  45, E_mkVm:  -7.2, I_mkA: 40  },
        { angle_deg:  60, E_mkVm: -12.0, I_mkA: 40  },
        { angle_deg:  75, E_mkVm: -14.0, I_mkA: 35  },
        { angle_deg:  90, E_mkVm: -20.0, I_mkA: 25  },
    ],
};

// ─────────────────────────────────────────────────────────────
// ТАБЛИЦА 3б — Диаграмма направленности А2 (магнитная антенна)
// Заполни по аналогии с 3а после измерений.
// ─────────────────────────────────────────────────────────────
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
