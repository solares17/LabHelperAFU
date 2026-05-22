
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
                    // ── Магнитная антенна ──
                    // Форма как на картинке: большой рупор + волновод + малый треугольный рупор
                    // Все координаты относительно центра крепления (0,0), раскрыв смотрит в dir

                    // 1. Большой рупор (левая часть)
                    mainCtx.beginPath();
                    mainCtx.moveTo(0,        -28);
                    mainCtx.lineTo(50 * dir, -58);  // верхний угол раскрыва
                    mainCtx.lineTo(50 * dir,  58);  // нижний угол раскрыва
                    mainCtx.lineTo(0,          28);
                    mainCtx.closePath();
                    mainCtx.fill();
                    mainCtx.stroke();

                    // 2. Волновод (прямоугольная секция посередине)
                    const wdx = isRight ? 0 : -46;
                    mainCtx.fillRect(wdx,   -16, 46, 32);
                    mainCtx.strokeRect(wdx, -16, 46, 32);

                    // 3. Маленький треугольный рупор (правая часть — сужается к точке)
                    const tx = isRight ? -46 : 46; // начало малого рупора
                    mainCtx.beginPath();
                    mainCtx.moveTo(tx,           -16); // верх волновода
                    mainCtx.lineTo(tx + 32*dir,  -28); // верхний угол малого рупора
                    mainCtx.lineTo(tx + 60*dir,    0); // острие (точка)
                    mainCtx.lineTo(tx + 32*dir,   28); // нижний угол малого рупора
                    mainCtx.lineTo(tx,            16); // низ волновода
                    mainCtx.closePath();
                    mainCtx.fill();
                    mainCtx.stroke();

                } else {
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
