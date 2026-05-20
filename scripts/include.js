fetch("/LabHelperAFU/pages/header.html")
    .then(r => r.text())
    .then(html => document.getElementById("include-header").innerHTML = html);

fetch("/LabHelperAFU/pages/footer.html")
    .then(r => r.text())
    .then(html => document.getElementById("include-footer").innerHTML = html);

fetch('https://solares17.github.io/LabHelperAFU/.../stand-rupor.html')
    .then(response => response.text())
    .then(html => {
        // 1. Вставляем HTML стенда на страницу
        document.getElementById('include-rupor').innerHTML = html;
        
        // 2. И только СЕЙЧАС, когда HTML точно на месте, запускаем логику
        if (typeof window.initRuporLab === 'function') {
            window.initRuporLab();
        }
    });
