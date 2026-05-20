fetch("/LabHelperAFU/pages/header.html")
    .then(r => r.text())
    .then(html => document.getElementById("include-header").innerHTML = html);

fetch("/LabHelperAFU/pages/rupor.html")
    .then(r => r.text())
    .then(html => document.getElementById("include-rupor").innerHTML = html);

fetch("/LabHelperAFU/pages/footer.html")
    .then(r => r.text())
    .then(html => document.getElementById("include-footer").innerHTML = html);
