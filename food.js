const foodSpots = [
    {
        id: 1, name: "Main Canteen", category: "canteen", icon: "🍱",
        location: "Ground Floor, East Wing", hours: "7:00 AM - 4:00 PM", capacity: "200 seats",
        description: "Primary dining hub.", proTip: "Try Fish Patties at 10:30 AM.",
        menu: { "Breakfast": [{ name: "Rice & Curry", price: "LKR 120" }] }
    }
];

function init() {
    renderSpots(foodSpots);
    setupEventListeners();
}

function renderSpots(data) {
    const grid = document.getElementById('food-spots-grid');
    if (!grid) return;
    grid.innerHTML = data.map(spot => `
        <div class="food-spot-card glass" onclick="openMenu(${spot.id})">
            <div class="spot-img">${spot.icon}</div>
            <div class="spot-info"><h3>${spot.name}</h3><div class="spot-meta">${spot.location}</div></div>
        </div>
    `).join('');
}

function setupEventListeners() {
    document.querySelector('.close-modal')?.addEventListener('click', () => {
        document.getElementById('menu-modal').style.display = 'none';
    });
}

window.openMenu = function(id) {
    const spot = foodSpots.find(s => s.id === id);
    const body = document.getElementById('menu-modal-body');
    if (!spot || !body) return;
    body.innerHTML = `
        <div class="spot-details-page">
            <div class="spot-details-left">
                <div class="spot-hero-img">${spot.icon}</div>
                <div class="spot-info-sidebar">
                    <div class="detail-item"><label>Location</label><span>${spot.location}</span></div>
                    <div class="detail-item"><label>Capacity</label><span>${spot.capacity}</span></div>
                </div>
                <div class="pro-tip"><h4>Pro Tip</h4><p>${spot.proTip}</p></div>
            </div>
            <div class="spot-details-right">
                <h2>${spot.name}</h2>
                <p>${spot.description}</p>
                <div class="menu-sections-grid">
                    ${Object.keys(spot.menu).map(cat => `
                        <div><h4>${cat}</h4>${spot.menu[cat].map(i => `<div class="menu-item"><span>${i.name}</span><span>${i.price}</span></div>`).join('')}</div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    document.getElementById('menu-modal').style.display = 'block';
};

document.addEventListener('DOMContentLoaded', init);
