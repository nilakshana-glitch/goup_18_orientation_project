// Campus Navigator Data
const places = [
    {
        id: 1,
        name: "Vidya Jyothi Professor V K Samaranayake Auditorium",
        category: "auditoriums",
        image: "images/vk samaranayake auditorium.jpg",
        description: "The main auditorium of the university, used for major events and guest lectures. When you get up to the 4th floor from the main staircase, the auditorium is right next to you on your right hand side.",
        location: "4th Floor, South Wing",
        capacity: "423",
        plugPoints: "Limited (near walls)",
        ac: "Yes",
        proTip: "Bags, water bottles or food items are not allowed inside.",
        images: ["images/vk samaranayake auditorium.jpg"] 
    },
    {
        id: 14,
        name: "3rd Year Computer Lab",
        category: "labs",
        image: "images/3rd year lab.jpg",
        description: "Computer labs dedicated to 3rd year undergraduate students, equipped for project work and practical sessions.",
        location: "2nd Floor, East Wing",
        capacity: "100",
        plugPoints: "Available at every station",
        ac: "Yes",
        proTip: "Best to arrive early during exam periods to secure a spot.",
        images: ["images/3rd year lab.jpg"]
    },
    {
        id: 18,
        name: "Open Study Area",
        category: "study areas",
        image: "images/open study area.webp",
        description: "A relaxed, open-air space for students to study, collaborate on projects, or take breaks between lectures.",
        location: "Ground Floor, Main Building",
        capacity: "100+",
        plugPoints: "Available at fixed tables",
        ac: "No (Natural ventilation)",
        proTip: "Perfect for group discussions; it gets quite lively during the day but is very peaceful in the evening.",
        images: ["images/open study area.webp"]
    },
    {
        id: 2,
        name: "UCSC Main Library",
        category: "libraries",
        image: "images/library.jpg",
        description: "The main university library offering a vast collection of books, journals, and quiet study spaces. It's the primary research hub for students.",
        location: "2nd floor",
        capacity: "300+",
        plugPoints: "Available at most tables",
        ac: "Yes",
        proTip: "The upper floors are usually quieter if you need deep focus.",
        images: ["images/library.jpg"]
    },
    {
        id: 15,
        name: "UOC Gym",
        category: "sports",
        image: "images/gym.png",
        description: "A well-equipped gym for students to maintain their physical health. It includes a variety of exercise machines and free weights.",
        location: "Near the Ground",
        capacity: "50",
        plugPoints: "N/A",
        ac: "No",
        proTip: "Usually less crowded in the morning; remember to bring your student ID and a towel.",
        images: ["images/gym.png"]
    },
    {
        id: 16,
        name: "Lecture Hall S104",
        category: "lecture halls",
        image: "images/S104.webp",
        description: "A spacious lecture hall commonly used for undergraduate lectures and presentations.",
        location: "1st Floor, South wing",
        capacity: "175",
        plugPoints: "None",
        ac: "No",
        proTip: "Great acoustics, but try to arrive early for a seat in the middle rows.",
        images: ["images/S104.webp"]
    },
    {
        id: 5,
        name: "Ground Floor Washrooms",
        category: "washrooms",
        image: "placeholder_washroom.jpg",
        description: "Clean and well-maintained washrooms for both male and female students. Located next to the canteen area.",
        location: "Ground Floor, Near Canteen",
        capacity: "N/A",
        plugPoints: "1 (near mirrors)",
        ac: "No",
        toilets: "8 per section",
        proTip: "Usually very crowded right after a 2-hour lecture ends.",
        images: ["washroom1.jpg"]
    },
    {
        id: 7,
        name: "Mini Auditorium",
        category: "auditoriums",
        image: "placeholder_mini_auditorium.jpg",
        description: "A smaller auditorium used for smaller lectures and seminars. Located on the 2nd floor.",
        location: "2nd Floor, Main Building",
        capacity: "100",
        plugPoints: "Available at front rows",
        ac: "Yes",
        proTip: "Perfect for presentations; check for availability in the morning.",
        images: ["placeholder_mini_auditorium.jpg"]
    },
    {
        id: 8,
        name: "1st Floor Washrooms",
        category: "washrooms",
        image: "placeholder_washroom_1.jpg",
        description: "Standard washrooms located on the 1st floor, easily accessible from the main staircase.",
        location: "1st Floor, Main Building",
        capacity: "N/A",
        plugPoints: "None",
        ac: "No",
        toilets: "6",
        proTip: "Usually less crowded than the ground floor washrooms.",
        images: ["placeholder_washroom_1.jpg"]
    },
    {
        id: 9,
        name: "2nd Floor Washrooms",
        category: "washrooms",
        image: "placeholder_washroom_2.jpg",
        description: "Clean washrooms located on the 2nd floor, near the lecture halls.",
        location: "2nd Floor, Main Building",
        capacity: "N/A",
        plugPoints: "None",
        ac: "No",
        toilets: "6",
        proTip: "Good option during lecture breaks on the 2nd floor.",
        images: ["placeholder_washroom_2.jpg"]
    },
    {
        id: 10,
        name: "3rd Floor Washrooms",
        category: "washrooms",
        image: "placeholder_washroom_3.jpg",
        description: "Washrooms located on the 3rd floor, convenient for students in the labs.",
        location: "3rd Floor, Main Building",
        capacity: "N/A",
        plugPoints: "None",
        ac: "No",
        toilets: "4",
        proTip: "Quietest washrooms in the building.",
        images: ["placeholder_washroom_3.jpg"]
    },
    {
        id: 11,
        name: "Computer Labs A, B, C, D & E",
        category: "labs",
        image: "images/labs.jpg",
        description: "A series of interconnected computer labs used for practical sessions and individual study. All labs are located in the same corridor, providing a vast area for computer-based work.",
        location: "2nd Floor, West Wing",
        capacity: "200+ (Total)",
        plugPoints: "Available at every station",
        ac: "Yes",
        proTip: "Lab C usually has the newest peripherals; try to grab a spot there if you're doing heavy tasks.",
        images: ["images/labs.jpg"]
    },
    {
        id: 12,
        name: "MSc. Computer Labs",
        category: "labs",
        image: "images/Msc. labs.jpg",
        description: "Dedicated computer labs for postgraduate students, equipped with high-end workstations and specialized software for research and advanced coursework.",
        location: "4th Floor, Main Building",
        capacity: "60",
        plugPoints: "Available at every station",
        ac: "Yes",
        proTip: "This is one of the quietest lab areas, ideal for focused research and thesis work.",
        images: ["images/Msc. labs.jpg"]
    },
    {
        id: 13,
        name: "4th Year Computer Labs",
        category: "labs",
        image: "images/4th year labs.png",
        description: "Specialized labs for final year undergraduate students, equipped with the necessary tools for research projects and advanced practical sessions.",
        location: "4th Floor, Main Building",
        capacity: "50",
        plugPoints: "Available at every station",
        ac: "Yes",
        proTip: "Usually less crowded in the early morning, making it a great spot for focused project work.",
        images: ["images/4th year labs.png"]
    },
    {
        id: 17,
        name: "Lecture Hall S202",
        category: "lecture halls",
        image: "images/S202.jpg",
        description: "A modern lecture hall equipped with audiovisual facilities for lectures and seminars.",
        location: "2nd Floor, Main Building",
        capacity: "150",
        plugPoints: "Limited (near walls)",
        ac: "Yes",
        proTip: "This hall is known for being quite cold; you might want to bring a light jacket.",
        images: ["images/S202.jpg"]
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

    // Sort: prioritize places with real images over placeholders
    // While maintaining array order for those with images
    const sortedData = [...data].sort((a, b) => {
        const aHasImage = a.image && !a.image.startsWith('placeholder');
        const bHasImage = b.image && !b.image.startsWith('placeholder');
        
        if (aHasImage && !bHasImage) return -1;
        if (!aHasImage && bHasImage) return 1;
        return 0;
    });

    sortedData.forEach(place => {
        const card = document.createElement('div');
        card.className = 'place-card glass';
        const hasImage = place.image && !place.image.startsWith('placeholder');
        card.innerHTML = `
            <div class="place-img">
                ${hasImage ? `<img src="${place.image}" alt="${place.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">` : '<i data-lucide="image"></i>'}
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
    const hasImage = place.images && place.images.length > 0 && !place.images[0].startsWith('placeholder');
    modalBody.innerHTML = `
        <div class="info-page">
            <div class="info-visuals">
                <div class="info-img-large">
                    ${hasImage ? `<img src="${place.images[0]}" alt="${place.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">` : '<i data-lucide="image" style="width: 64px; height: 64px;"></i>'}
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
