const manualsList = document.querySelector(".manuals-list");

if (manualsList) {
    manuals.forEach(manual => {
        const card = document.createElement("div");
        card.classList.add("manual-card");

        card.innerHTML = `
            <div class="card-header">
                <img src="${manual.img}" class="equip-img" alt="${manual.title}">
                <div class="equip-info">
                    <h3>${manual.title}</h3>
                </div>
            </div>

            <div class="card-details">
                
                <a href="${manual.downloadUrl}" download target="_blank" class="download-btn">
                    Скачать методичку
                </a>
            </div>
        `;

        card.addEventListener("click", function(event) {
            if(event.target.tagName === 'A') return; 
            card.classList.toggle("active");
        });

        manualsList.appendChild(card);
    });
}
