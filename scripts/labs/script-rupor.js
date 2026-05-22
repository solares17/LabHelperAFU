
 (() => {
         // ── Микроамперметр ──
        const meterCanvas = document.getElementById('meterCanvas');
        const meterCtx = meterCanvas.getContext('2d');

        window.drawMeter = function drawMeter(value) {
            const w = meterCanvas.width, h = meterCanvas.height;
            const cx = w / 2, cy = h - 10;
            const r = h - 30;
            meterCtx.clearRect(0, 0, w, h);

            meterCtx.beginPath();
            meterCtx.arc(cx, cy, r, Math.PI, 2 * Math.PI);
            meterCtx.lineWidth = 3;
            meterCtx.strokeStyle = '#3a3f4b';
            meterCtx.stroke();

            for (let i = 0; i <= 10; i++) {
                const a = Math.PI + Math.PI * (i / 10);
                const x1 = cx + (r - 8) * Math.cos(a);
                const y1 = cy + (r - 8) * Math.sin(a);
                const x2 = cx + r * Math.cos(a);
                const y2 = cy + r * Math.sin(a);
                meterCtx.beginPath();
                meterCtx.moveTo(x1, y1);
                meterCtx.lineTo(x2, y2);
                meterCtx.lineWidth = i % 5 === 0 ? 2 : 1;
                meterCtx.strokeStyle = '#6b7a8d';
                meterCtx.stroke();
            }

            meterCtx.fillStyle = '#6b7a8d';
            meterCtx.font = '11px Share Tech Mono, monospace';
            meterCtx.fillText('0', 8, cy - 4);
            meterCtx.fillText('100', w - 30, cy - 4);

            const clamped = Math.max(0, Math.min(100, value));
            const na = Math.PI + Math.PI * (clamped / 100);
            const nx = cx + (r - 12) * Math.cos(na);
            const ny = cy + (r - 12) * Math.sin(na);

            meterCtx.beginPath();
            meterCtx.moveTo(cx, cy);
            meterCtx.lineTo(nx, ny);
            meterCtx.lineWidth = 2;
            meterCtx.strokeStyle = '#ff6b6b';
            meterCtx.stroke();

            meterCtx.beginPath();
            meterCtx.arc(cx, cy, 5, 0, 2 * Math.PI);
            meterCtx.fillStyle = '#4a9eff';
            meterCtx.fill();
        }

        drawMeter(0);


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
                const probeX = 100 + (currentProbeCm / 90) * 600;
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

                const isMag = antType === 'magnetic';
                const dir   = isRight ? -1 : 1; // -1 = антенна смотрит влево (правая)

                mainCtx.lineWidth   = 2;
                mainCtx.strokeStyle = isMag ? '#00d4aa' : '#6b7a8d';
                mainCtx.fillStyle   = isMag ? '#1a3a35'  : '#2a2f3a';

             if (isMag) {
    // ── Рупорная антенна (как на фото) ──
    // Все координаты относительно центра крепления (0,0)
    // Переменная dir (1 или -1) определяет, в какую сторону смотрит главный (большой) рупор

    // 1. Задний кронштейн / волновод (направлен в противоположную сторону: -dir)
    mainCtx.beginPath();
    mainCtx.moveTo(-15 * dir, -12);            // верх у крепления
    mainCtx.lineTo(-70 * dir, -8);             // верх начала сужения
    mainCtx.lineTo(-70 * dir, 8);              // низ начала сужения
    mainCtx.lineTo(-15 * dir, 12);             // низ у крепления
    mainCtx.closePath();
    mainCtx.fillStyle = '#d0d0d0';             // светло-серый
    mainCtx.fill();
    mainCtx.strokeStyle = '#999';
    mainCtx.stroke();

    // 2. Задний сужающийся наконечник (красновато-коричневый, как на фото)
    mainCtx.beginPath();
    mainCtx.moveTo(-70 * dir, -8);
    mainCtx.lineTo(-120 * dir, -3);            // узкий конец (верх)
    mainCtx.lineTo(-120 * dir, 3);             // узкий конец (низ)
    mainCtx.lineTo(-70 * dir, 8);
    mainCtx.closePath();
    mainCtx.fillStyle = '#a0522d';             // цвет, похожий на ржавый/медный
    mainCtx.fill();
    mainCtx.strokeStyle = '#5c2e16';
    mainCtx.stroke();

    // Светлый блик на наконечнике (опционально, для объема)
    mainCtx.beginPath();
    mainCtx.arc(-120 * dir, 0, 3, 0, Math.PI * 2);
    mainCtx.fillStyle = '#e0e0e0';
    mainCtx.fill();

    // 3. Большой главный рупор (направлен в сторону dir)
    mainCtx.beginPath();
    mainCtx.moveTo(15 * dir, -15);             // верхняя точка у крепления
    mainCtx.lineTo(170 * dir, -50);            // верхний угол широкого раскрыва
    mainCtx.lineTo(170 * dir, 50);             // нижний угол широкого раскрыва
    mainCtx.lineTo(15 * dir, 15);              // нижняя точка у крепления
    mainCtx.closePath();
    mainCtx.fillStyle = '#e6e6e6';             // цвет алюминия
    mainCtx.fill();
    mainCtx.lineWidth = 1.5;
    mainCtx.strokeStyle = '#888';
    mainCtx.stroke();

    // Линия жесткости по центру большого рупора (как на фото)
    mainCtx.beginPath();
    mainCtx.moveTo(15 * dir, 0);
    mainCtx.lineTo(170 * dir, 0);
    mainCtx.strokeStyle = 'rgba(255, 255, 255, 0.7)'; // белый полупрозрачный блик
    mainCtx.stroke();

    // 4. Центральное поворотное крепление (зубчатый диск)
    mainCtx.beginPath();
    mainCtx.arc(0, 0, 22, 0, Math.PI * 2);     // Внешний контур механизма
    mainCtx.fillStyle = '#b0b0b0';
    mainCtx.fill();
    mainCtx.strokeStyle = '#666';
    mainCtx.stroke();

    // Внутреннее темное отверстие механизма
    mainCtx.beginPath();
    mainCtx.arc(0, 0, 12, 0, Math.PI * 2);
    mainCtx.fillStyle = '#333';
    mainCtx.fill();

    // Небольшая ось/болт в самом центре
    mainCtx.beginPath();
    mainCtx.arc(0, 0, 4, 0, Math.PI * 2);
    mainCtx.fillStyle = '#ddd';
    mainCtx.fill();
    mainCtx.stroke();
}   
             
             else {
                    // ── Обычный рупор ──
                    mainCtx.beginPath();
                    mainCtx.moveTo(0,        -28);
                    mainCtx.lineTo(76 * dir, -56);
                    mainCtx.lineTo(76 * dir,  56);
                    mainCtx.lineTo(0,          28);
                    mainCtx.closePath();
                    mainCtx.fill();
                    mainCtx.stroke();
                    // Волновод
                    mainCtx.strokeRect(isRight ? 0 : -58, -18, 58, 36);
                }

                // Метка (роль + тип)
                const labelColor = role === 'generator' ? '#ff9f43' : '#20c997';
                mainCtx.fillStyle    = labelColor;
                mainCtx.font         = 'bold 13px Rubik, sans-serif';
                mainCtx.textBaseline = 'middle';
                const lx = isRight ? 18 : -42;
                mainCtx.fillText(label, lx, 0);
                mainCtx.font = '10px Rubik, sans-serif';
                mainCtx.fillText(role === 'generator' ? 'ГЕН' : 'ИНД', lx, 16);
                if (isMag) {
                    mainCtx.fillStyle = '#00d4aa';
                    mainCtx.font      = '9px Rubik, sans-serif';
                    mainCtx.fillText('MAG', lx, 28);
                }

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
    })();
