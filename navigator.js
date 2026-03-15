// Campus Navigator Data
const places = [
    {
        id: 1,
        name: "VK Samaranayake Auditorium",
        category: "auditoriums",
        image: "placeholder_auditorium.jpg", // Manual placeholder
        description: "The main auditorium of the university, used for major events and guest lectures. When you get up to the 4th floor from the main staircase, the auditorium is right next to you on your right hand side.",
        location: "4th Floor, Main Building",
        capacity: "500+",
        plugPoints: "Limited (near walls)",
        ac: "Yes",
        proTip: "Usually from 12PM to 1PM this area is very crowded during lunch breaks.",
        images: ["vks1.jpg", "vks2.jpg"] // Placeholders
    },
    {
        id: 2,
        name: "Main Library Study Area",
        category: "study areas",
        image: "placeholder_study.jpg",
        description: "A quiet space for students to focus and study. Located on the 2nd floor of the Library building.",
        location: "2nd Floor, Library Building",
        capacity: "100",
        plugPoints: "Available at every table",
        ac: "Yes",
        proTip: "Arrive before 8:30 AM to secure a spot with a plug point.",
        images: ["study1.jpg"]
    },
    {
        id: 3,
        name: "Advanced Graphics Lab",
        category: "labs",
        image: "placeholder_lab.jpg",
        description: "High-performance lab for graphics and multimedia projects. Found on the 3rd floor, West Wing.",
        location: "3rd Floor, West Wing",
        capacity: "40",
        plugPoints: "Available at every station",
        ac: "Yes",
        proTip: "The lab is usually less crowded on Friday afternoons.",
        images: ["lab1.jpg"]
    },
    {
        id: 4,
        name: "Lecture Hall 01",
        category: "lecture halls",
        image: "placeholder_hall.jpg",
        description: "Large lecture hall for first-year modules. Located on the ground floor, right after the entrance.",
        location: "Ground Floor",
        capacity: "150",
        plugPoints: "None",
        ac: "No (Fans only)",
        proTip: "Sit in the middle rows for the best acoustics.",
        images: ["hall1.jpg"]
    },
    {
        id: 5,
        name: "Main Washroom (Male)",
        category: "washrooms",
        image: "placeholder_washroom.jpg",
        description: "Clean and well-maintained washrooms. Located next to the canteen area.",
        location: "Ground Floor, Near Canteen",
        capacity: "N/A",
        plugPoints: "1 (near mirrors)",
        ac: "No",
        toilets: "8",
        proTip: "Usually very crowded right after a 2-hour lecture ends.",
        images: ["washroom1.jpg"]
    },
    {
        id: 6,
        name: "Mini Library",
        category: "libraries",
        image: "placeholder_mini_lib.jpg",
        description: "Quick access to reference books and journals. Located on the 1st floor of the Computer Science building.",
        location: "1st Floor, CS Building",
        capacity: "30",
        plugPoints: "6 available",
        ac: "Yes",
        proTip: "Great place for quick group discussions as it's less strict than the main library.",
        images: ["minilib1.jpg"]
    }
];

// DOM Elements
const placesGrid = document.getElementById('places-grid');
const searchInput = document.getElementById('place-search');
const catTabs = document.querySelectorAll('.cat-tab');
const modal = document.getElementById('info-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close-modal');
const openFloorMapBtn = document.getElementById('open-floor-map');

// Initialize
function init() {
    renderPlaces(places);
    setupEventListeners();
}

// Render Cards
function renderPlaces(data) {
    placesGrid.innerHTML = '';
    
    if (data.length === 0) {
        placesGrid.innerHTML = '<p class="empty-message">No places found matching your search.</p>';
        return;
    }

    data.forEach(place => {
        const card = document.createElement('div');
        card.className = 'place-card glass';
        card.innerHTML = `
            <div class="place-img">
                <i data-lucide="image"></i>
                <!-- <img src="${place.image}" alt="${place.name}"> -->
            </div>
            <div class="place-info">
                <span class="category-tag">${place.category}</span>
                <h3>${place.name}</h3>
                <p><i data-lucide="map-pin" style="width:14px; height:14px; display:inline; margin-right:4px;"></i> ${place.location}</p>
            </div>
        `;
        card.addEventListener('click', () => openInfoPage(place));
        placesGrid.appendChild(card);
    });
    
    lucide.createIcons();
}

// Event Listeners
function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const activeCat = document.querySelector('.cat-tab.active').dataset.category;
        
        filterPlaces(term, activeCat);
    });

    // Category Tabs
    catTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            catTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const category = tab.dataset.category;
            const term = searchInput.value.toLowerCase();
            
            filterPlaces(term, category);
        });
    });

    // Modal Close
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Floor Map Button
    openFloorMapBtn.addEventListener('click', () => {
        window.open('UCSC Floor Map.pdf', '_blank');
    });
}

// Filter Logic
function filterPlaces(term, category) {
    const filtered = places.filter(place => {
        const matchesSearch = place.name.toLowerCase().includes(term) || 
                              place.description.toLowerCase().includes(term) ||
                              place.location.toLowerCase().includes(term);
        
        const matchesCat = category === 'all' || place.category === category;
        
        return matchesSearch && matchesCat;
    });
    
    renderPlaces(filtered);
}

// Open Info Page (Modal)
function openInfoPage(place) {
    modalBody.innerHTML = `
        <div class="info-page">
            <div class="info-visuals">
                <div class="info-img-large">
                    <i data-lucide="image" style="width: 64px; height: 64px;"></i>
                    <!-- <img src="${place.images[0]}" alt="${place.name}"> -->
                </div>
                <div class="info-map-location">
                    <i data-lucide="map" style="margin-bottom: 10px;"></i>
                    <p><strong>Floor Map Location</strong></p>
                    <p class="small-text">${place.location}</p>
                    <div style="margin-top: 15px; width: 80%; height: 4px; background: var(--primary); border-radius: 2px;"></div>
                </div>
            </div>
            <div class="info-content">
                <span class="info-category">${place.category}</span>
                <h2>${place.name}</h2>
                <p class="info-description">${place.description}</p>
                
                <div class="info-details-grid">
                    <div class="detail-item">
                        <label>Capacity</label>
                        <span>${place.capacity || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <label>Plug Points</label>
                        <span>${place.plugPoints || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <label>Air Conditioned</label>
                        <span>${place.ac || 'No'}</span>
                    </div>
                    <div class="detail-item">
                        <label>${place.category === 'washrooms' ? 'Toilets' : 'Access'}</label>
                        <span>${place.toilets || 'Public'}</span>
                    </div>
                </div>
                
                <div class="pro-tip">
                    <h4><i data-lucide="sparkles"></i> Pro Tip</h4>
                    <p>${place.proTip}</p>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
