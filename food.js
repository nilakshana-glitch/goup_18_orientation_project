// Food Finder Data
const foodSpots = [
    {
        id: 1,
        name: "UCSC Canteen (Bhawana)",
        category: "canteen",
        icon: "🍱",
        location: "Ground Floor, UCSC building",
        hours: "7.00 AM - 8.00 PM",
        capacity: "60+ seats",
        description: "The primary dining hub for UCSC students, offering a wide variety of traditional Sri Lankan meals and quick snacks. It's the most convenient spot for those in the UCSC.",
        proTip: "Make sure to clean your plate and the table after eating, as the canteen staff appreciate the help in keeping the place tidy.",
        menu: {
            "Breakfast": [
                { name: "Rice & Curry", price: "LKR 150" },
                { name: "String Hoppers", price: "LKR 10" },
                { name: "milk rice", price: "LKR 50" },
                { name: "noodles", price: "LKR 130" }
            ],
            "Lunch": [
                { name: "Chicken Rice", price: "LKR 250" },
                { name: "fish Rice", price: "LKR 150" },
                { name: "Egg Rice", price: "LKR 160" },
                { name: "Vegetable Rice", price: "LKR 120" }
            ],
            "snacks": [
                { name: "egg rolls", price: "LKR 80" },
                { name: "veg roll", price: "LKR 60" },
                { name: "parata", price: "LKR 40" },
                { name: "Wade", price: "LKR 30" }
            ],
            "drinks": [
                { name: "plain tea", price: "LKR 20" },
                { name: "milk tea", price: "LKR 70" },
                { name: "nescafe", price: "LKR 100" },
                { name: "sunquick", price: "LKR 150" }
            ]
        }
    },
    {
        id: 2,
        name: "UOC Food Court and Convenience Store",
        category: "food court",
        icon: "🍕",
        location: "next to the Planetarium",
        hours: "7:00 AM - 7:00 PM",
        capacity: "100 seats",
        description: "A modern food court with multiple vendors serving everything from rice and curry to western cuisine. Great for group lunches and evening hangouts.",
        proTip: "The prices here are bit higher than the canteens, but the variety and quality make it worth it.",
        menu: {
            "Main Meals": [
                { name: "Fried Rice", price: "LKR 350" },
                { name: "Kottu Roti", price: "LKR 400" },
                { name: "Noodles", price: "LKR 300" }
            ],
            "snacks": [
                { name: "eclairs", price: "LKR 450" },
                { name: "Sandwich", price: "LKR 250" },
                { name: "chocolate cake", price: "LKR 200" }
            ],
            "drinks": [
                { name: "milkshake", price: "LKR 350" },
                { name: "mixfruit juice", price: "LKR 200" },
                { name: "falooda", price: "LKR 200" }
            ]
        }
    },
    {
        id: 3,
        name: "UCSC Juice Bar",
        category: "juice bar",
        icon: "🥤",
        location: "Next to New Arts Theatre",
        hours: "8:00 AM - 5:00 PM",
        capacity: "Outdoor seating (10)",
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
        name: "SSC canteen (Balagiriya)",
        category: "canteen",
        icon: "🥗",
        location: "Administration Building",
        hours: "7:00 AM - 7.30 PM",
        capacity: "40 seats",
        description: "A quiet and cozy cafe primarily used by staff but open to students. Ideal for a peaceful cup of coffee or a quick cake slice.",
        proTip: "The Chocolate Cake here is often considered the best on campus.",
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
    },
    {
        id: 5,
        name: "SSC Juice bar",
        category: "juice bar",
        icon: "🥤",
        location: "UCSC Building, Ground Floor",
        hours: "7:00 AM - 5:00 PM",
        capacity: "80 seats",
        description: "Specializes in affordable Rice & Curry and a variety of short eats. A favorite among computer science students.",
        proTip: "The Fish Bun is a student favorite for a quick breakfast on the go.",
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
        id: 6,
        name: "Art Canteen",
        category: "canteen",
        icon: "🍜",
        location: "Faculty of Arts",
        hours: "7:00 AM - 4:00 PM",
        capacity: "150 seats",
        description: "A large and vibrant canteen serving the Faculty of Arts. Known for its affordable and diverse menu, it's a popular meeting spot for students across the university.",
        proTip: "The lunch rush can be intense, so try to arrive a bit earlier or later than peak noon.",
        menu: {
            "Meals": [
                { name: "Rice & Curry (Veg)", price: "LKR 120" },
                { name: "Rice & Curry (Fish)", price: "LKR 150" },
                { name: "Rice & Curry (Chicken)", price: "LKR 200" }
            ],
            "Snacks": [
                { name: "Pol Roti", price: "LKR 30" },
                { name: "Lunu Miris", price: "LKR 10" },
                { name: "Ulundu Wade", price: "LKR 40" }
            ]
        }
    },
    {
        id: 7,
        name: "Management Canteen",
        category: "canteen",
        icon: "🍛",
        location: "Faculty of Management & Finance",
        hours: "7:30 AM - 5:00 PM",
        capacity: "100 seats",
        description: "A well-organized canteen offering a range of meals and snacks. It provides a comfortable environment for students to dine and discuss their projects.",
        proTip: "Their sandwiches are freshly made every morning and are perfect for a quick bite between classes.",
        menu: {
            "Breakfast": [
                { name: "Milk Rice", price: "LKR 60" },
                { name: "Bread & Dahl", price: "LKR 80" }
            ],
            "Lunch": [
                { name: "Mixed Rice", price: "LKR 250" },
                { name: "Fried Rice", price: "LKR 300" }
            ],
            "Beverages": [
                { name: "Fruit Juice", price: "LKR 120" },
                { name: "Coffee", price: "LKR 90" }
            ]
        }
    },
    {
        id: 8,
        name: "Law Canteen",
        category: "canteen",
        icon: "🍲",
        location: "Faculty of Law",
        hours: "8:00 AM - 4:00 PM",
        capacity: "80 seats",
        description: "A quieter canteen located within the Faculty of Law. It offers a selection of quality meals in a more reserved setting.",
        proTip: "The quiet atmosphere makes it a good place to catch up on some reading while you eat.",
        menu: {
            "Main Meals": [
                { name: "Rice & Curry", price: "LKR 140" },
                { name: "Noodles", price: "LKR 150" }
            ],
            "Short Eats": [
                { name: "Patties", price: "LKR 50" },
                { name: "Cutlets", price: "LKR 60" }
            ],
            "Drinks": [
                { name: "Tea", price: "LKR 40" },
                { name: "Ginger Beer", price: "LKR 100" }
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
