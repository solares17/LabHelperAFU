fetch("/LabHelperAFU/pages/header.html")
    .then(r => r.text())
    .then(html => document.getElementById("include-header").innerHTML = html);

fetch("/LabHelperAFU/pages/footer.html")
    .then(r => r.text())
    .then(html => document.getElementById("include-footer").innerHTML = html);

fetch('/LabHelperAFU/pages/rupor.html')
    .then(response => response.text())
    .then(html => {
        // 1. Вставляем HTML стенда. Теперь все <canvas> и <input> существуют
        document.getElementById('include-rupor').innerHTML = html;

        // 2. Список скриптов в СТРОГОМ порядке зависимостей
        const scripts = [
            '/LabHelperAFU/scripts/labs/script-rupor.js',
            '/LabHelperAFU/scripts/labs/script-data.js',// Потом UI и функции рисования
            '/LabHelperAFU/scripts/labs/script-logic.js'         // Логика в самом конце
        ];

        // 3. Добавляем их на страницу
        scripts.forEach(src => {
            // Проверяем, не загружен ли скрипт уже (чтобы не дублировать при переключениях)
            if (!document.querySelector(`script[src="${src}"]`)) {
                const script = document.createElement('script');
                script.src = src;
                
                // КРИТИЧЕСКИ ВАЖНО! Это гарантирует, что logic.js 
                // не запустится, пока не отработают data.js и script-rupor.js
                script.async = false; 
                
                document.body.appendChild(script);
            } else {
                // (Опционально) Если вы переключаетесь между стендами без перезагрузки страницы,
                // файлы уже скачаны. Но так как HTML перерисовался, нужно заново повесить события.
                // В этом случае лучше упаковать логику инициализации каждого файла в функцию 
                // типа window.initLogic() и вызывать её здесь.
            }
        });
    });
