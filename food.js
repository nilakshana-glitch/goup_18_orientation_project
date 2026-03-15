// Food Finder Data
const foodSpots = [
    {
        id: 1,
        name: "Main Canteen",
        category: "canteen",
        icon: "🍱",
        location: "Ground Floor, East Wing",
        hours: "7:00 AM - 4:00 PM",
        capacity: "200 seats",
        description: "The primary dining hub for students, offering a wide variety of traditional Sri Lankan meals and quick snacks. It's the most convenient spot for those in the East Wing.",
        proTip: "Try the 'Fish Patties' around 10:30 AM when they are fresh out of the kitchen!",
        menu: {
            "Breakfast": [
                { name: "Rice & Curry", price: "LKR 120" },
                { name: "String Hoppers", price: "LKR 80" },
                { name: "Bread with Dhal", price: "LKR 60" }
            ],
            "Lunch": [
                { name: "Chicken Rice", price: "LKR 250" },
                { name: "Egg Rice", price: "LKR 200" },
                { name: "Vegetable Rice", price: "LKR 150" }
            ],
            "Snacks": [
                { name: "Patties", price: "LKR 40" },
                { name: "Cutlets", price: "LKR 40" },
                { name: "Wade", price: "LKR 30" }
            ]
        }
    },
    {
        id: 2,
        name: "Upper Food Court",
        category: "food court",
        icon: "🍕",
        location: "3rd Floor, Student Center",
        hours: "9:00 AM - 7:00 PM",
        capacity: "150 seats",
        description: "A modern food court with multiple vendors serving everything from fried rice to burgers. Great for group lunches and evening hangouts.",
        proTip: "The Kottu here is legendary, but the queue gets long after 5:00 PM.",
        menu: {
            "Main Meals": [
                { name: "Fried Rice", price: "LKR 350" },
                { name: "Kottu Roti", price: "LKR 400" },
                { name: "Noodles", price: "LKR 300" }
            ],
            "Western": [
                { name: "Burger", price: "LKR 450" },
                { name: "Sandwich", price: "LKR 250" },
                { name: "French Fries", price: "LKR 200" }
            ]
        }
    },
    {
        id: 3,
        name: "Vitamin Juice Bar",
        category: "juice bar",
        icon: "🥤",
        location: "Next to Main Library",
        hours: "8:00 AM - 5:00 PM",
        capacity: "Outdoor seating (20)",
        description: "The best spot for refreshing fresh fruit juices and milkshakes. Located conveniently for a quick break from the library.",
        proTip: "Ask for 'no sugar' if you want it extra healthy; their fruits are always sweet!",
        menu: {
            "Fresh Juices": [
                { name: "Orange Juice", price: "LKR 150" },
                { name: "Lime Juice", price: "LKR 100" },
                { name: "Papaya Juice", price: "LKR 120" },
                { name: "Mixed Fruit Juice", price: "LKR 200" }
            ],
            "Shakes": [
                { name: "Banana Shake", price: "LKR 180" },
                { name: "Chocolate Shake", price: "LKR 220" },
                { name: "Iced Coffee", price: "LKR 150" }
            ]
        }
    },
    {
        id: 4,
        name: "Staff Cafe",
        category: "cafe",
        icon: "☕",
        location: "Administration Building",
        hours: "8:00 AM - 3:00 PM",
        capacity: "40 seats",
        description: "A quiet and cozy cafe primarily used by staff but open to students. Ideal for a peaceful cup of coffee or a quick cake slice.",
        proTip: "The Chocolate Cake here is often considered the best on campus.",
        menu: {
            "Coffee": [
                { name: "Black Coffee", price: "LKR 80" },
                { name: "Milk Coffee", price: "LKR 100" },
                { name: "Tea", price: "LKR 50" }
            ],
            "Bakery": [
                { name: "Chocolate Cake", price: "LKR 150" },
                { name: "Muffin", price: "LKR 120" },
                { name: "Egg Bun", price: "LKR 70" }
            ]
        }
    },
    {
        id: 5,
        name: "UCSC Canteen",
        category: "canteen",
        icon: "🍚",
        location: "UCSC Building, Ground Floor",
        hours: "7:00 AM - 5:00 PM",
        capacity: "80 seats",
        description: "Specializes in affordable Rice & Curry and a variety of short eats. A favorite among computer science students.",
        proTip: "The Fish Bun is a student favorite for a quick breakfast on the go.",
        menu: {
            "Lunch": [
                { name: "Fish Rice & Curry", price: "LKR 180" },
                { name: "Chicken Rice & Curry", price: "LKR 220" },
                { name: "Egg Rice & Curry", price: "LKR 160" }
            ],
            "Short Eats": [
                { name: "Fish Bun", price: "LKR 60" },
                { name: "Rolls", price: "LKR 50" },
                { name: "Samosa", price: "LKR 40" }
            ]
        }
    }
];

// DOM Elements
const spotsGrid = document.getElementById('food-spots-grid');
const searchInput = document.getElementById('food-search');
const catTabs = document.querySelectorAll('.food-cat-tab');
const modal = document.getElementById('menu-modal');
const modalBody = document.getElementById('menu-modal-body');
const closeModal = document.querySelector('.close-modal');

// Initialize
function init() {
    renderSpots(foodSpots);
    setupEventListeners();
}

function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const activeCat = document.querySelector('.food-cat-tab.active').dataset.category;
        filterSpots(term, activeCat);
    });

    // Category Filter
    catTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            catTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const category = tab.dataset.category;
            const term = searchInput.value.toLowerCase();
            filterSpots(term, category);
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
}

function filterSpots(term, category) {
    const filtered = foodSpots.filter(spot => {
        const matchesSearch = spot.name.toLowerCase().includes(term) || 
                              spot.location.toLowerCase().includes(term) ||
                              Object.values(spot.menu).some(section => 
                                section.some(item => item.name.toLowerCase().includes(term))
                              );
        const matchesCat = category === 'all' || spot.category === category;
        return matchesSearch && matchesCat;
    });
    renderSpots(filtered);
}

function renderSpots(data) {
    spotsGrid.innerHTML = '';
    if (data.length === 0) {
        spotsGrid.innerHTML = '<p class="empty-message">No food spots found matching your search.</p>';
        return;
    }

    data.forEach(spot => {
        const card = document.createElement('div');
        card.className = 'food-spot-card glass animate-on-load';
        card.innerHTML = `
            <div class="spot-img">${spot.icon}</div>
            <div class="spot-info">
                <span class="category-tag">${spot.category}</span>
                <h3>${spot.name}</h3>
                <div class="spot-meta">
                    <span><i data-lucide="map-pin" size="16"></i> ${spot.location}</span>
                    <span><i data-lucide="clock" size="16"></i> ${spot.hours}</span>
                </div>
            </div>
        `;
        card.addEventListener('click', () => openMenu(spot));
        spotsGrid.appendChild(card);
    });
    lucide.createIcons();
}

function openMenu(spot) {
    modalBody.innerHTML = `
        <div class="spot-details-page">
            <div class="spot-details-left">
                <div class="spot-hero-img">
                    ${spot.icon}
                </div>
                <div class="spot-info-sidebar">
                    <div class="detail-item">
                        <label>Location</label>
                        <span><i data-lucide="map-pin" size="14"></i> ${spot.location}</span>
                    </div>
                    <div class="detail-item">
                        <label>Seating Capacity</label>
                        <span><i data-lucide="users" size="14"></i> ${spot.capacity}</span>
                    </div>
                    <div class="detail-item">
                        <label>Opening Hours</label>
                        <span><i data-lucide="clock" size="14"></i> ${spot.hours}</span>
                    </div>
                </div>
                <div class="pro-tip" style="margin-top: 24px;">
                    <h4><i data-lucide="sparkles"></i> Pro Tip</h4>
                    <p>${spot.proTip}</p>
                </div>
            </div>
            
            <div class="spot-details-right">
                <span class="info-category">${spot.category}</span>
                <h2>${spot.name}</h2>
                <p class="spot-description">${spot.description}</p>
                
                <div class="menu-container">
                    <h3>Menu</h3>
                    <div class="menu-sections-grid">
                        ${Object.keys(spot.menu).map(section => `
                            <div class="menu-section">
                                <h4>${section}</h4>
                                <div class="menu-items-list">
                                    ${spot.menu[section].map(item => `
                                        <div class="menu-item">
                                            <span class="item-name">${item.name}</span>
                                            <span class="item-price">${item.price}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', init);
