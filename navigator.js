// Campus Navigator Data
const places = [
    {
        id: 1,
        name: "VK Samaranayake Auditorium",
        category: "auditoriums",
        description: "The main auditorium of the university, used for major events and guest lectures. When you get up to the 4th floor from the main staircase, the auditorium is right next to you on your right hand side.",
        location: "4th Floor, Main Building",
        capacity: "500+",
        plugPoints: "Limited (near walls)",
        ac: "Yes",
        proTip: "Usually from 12PM to 1PM this area is very crowded during lunch breaks."
    }
    // ... more data can be added manually
];

const placesGrid = document.getElementById('places-grid');
const searchInput = document.getElementById('place-search');
const catTabs = document.querySelectorAll('.cat-tab');
const modal = document.getElementById('info-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close-modal');

function init() {
    renderPlaces(places);
    setupEventListeners();
}

function renderPlaces(data) {
    placesGrid.innerHTML = '';
    data.forEach(place => {
        const card = document.createElement('div');
        card.className = 'place-card glass';
        card.innerHTML = `
            <div class="place-img"><i data-lucide="image" size="48"></i></div>
            <div class="place-info">
                <span class="category-tag">${place.category}</span>
                <h3>${place.name}</h3>
                <p><i data-lucide="map-pin" size="14"></i> ${place.location}</p>
            </div>
        `;
        card.addEventListener('click', () => openInfo(place));
        placesGrid.appendChild(card);
    });
    lucide.createIcons();
}

function setupEventListeners() {
    searchInput?.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = places.filter(p => p.name.toLowerCase().includes(term));
        renderPlaces(filtered);
    });
    closeModal?.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
}

function openInfo(place) {
    modalBody.innerHTML = `
        <div class="info-page">
            <div class="info-visuals">
                <div class="info-img-large"><i data-lucide="image" size="64"></i></div>
                <div class="info-map-location">
                    <i data-lucide="map"></i>
                    <p><strong>Floor Map Location</strong></p>
                    <p>${place.location}</p>
                </div>
            </div>
            <div class="info-content">
                <span class="info-category">${place.category}</span>
                <h2>${place.name}</h2>
                <p>${place.description}</p>
                <div class="info-details-grid">
                    <div class="detail-item"><label>Capacity</label><span>${place.capacity}</span></div>
                    <div class="detail-item"><label>Plug Points</label><span>${place.plugPoints}</span></div>
                    <div class="detail-item"><label>AC</label><span>${place.ac}</span></div>
                </div>
                <div class="pro-tip"><h4>Pro Tip</h4><p>${place.proTip}</p></div>
            </div>
        </div>
    `;
    modal.style.display = 'block';
    lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', init);
