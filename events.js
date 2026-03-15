// State Management
let events = JSON.parse(localStorage.getItem('uniEventsList') || '[]');
let editId = null;

// DOM Elements
const eventName = document.getElementById('eventName');
const eventDate = document.getElementById('eventDate');
const eventTime = document.getElementById('eventTime');
const eventVenue = document.getElementById('eventVenue');
const eventDescription = document.getElementById('eventDescription');
const eventCategory = document.getElementById('eventCategory');
const addEventBtn = document.getElementById('addEventBtn');
const saveEditBtn = document.getElementById('saveEditBtn');
const clearBtn = document.getElementById('clearBtn');
const eventCards = document.getElementById('eventCards');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const nextCountdown = document.getElementById('nextCountdown');
const todayList = document.getElementById('todayList');
const miniCalendar = document.getElementById('miniCalendar');

// Initialize
function init() {
    displayEvents();
    renderCalendar();
    updateTodayList();
    startCountdownTimer();
    setupEventListeners();
}

function setupEventListeners() {
    addEventBtn.addEventListener('click', addEvent);
    saveEditBtn.addEventListener('click', saveEdit);
    clearBtn.addEventListener('click', clearForm);
    searchInput.addEventListener('input', displayEvents);
    categoryFilter.addEventListener('change', displayEvents);
    
    document.getElementById('exportAllBtn').addEventListener('click', exportAllEvents);
    document.getElementById('clearAllBtn').addEventListener('click', clearAllEvents);
}

function saveEvents() {
    localStorage.setItem('uniEventsList', JSON.stringify(events));
}

function clearForm() {
    eventName.value = '';
    eventDate.value = '';
    eventTime.value = '';
    eventVenue.value = '';
    eventDescription.value = '';
    eventCategory.value = 'Academic';
    editId = null;
    addEventBtn.classList.remove('hidden');
    saveEditBtn.classList.add('hidden');
}

function displayEvents() {
    const query = searchInput.value.toLowerCase();
    const filter = categoryFilter.value;
    
    const filtered = events.filter(e => {
        const matchesSearch = e.title.toLowerCase().includes(query) || 
                            e.venue.toLowerCase().includes(query) || 
                            e.description.toLowerCase().includes(query);
        const matchesFilter = filter === 'all' || e.category === filter;
        return matchesSearch && matchesFilter;
    }).sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

    eventCards.innerHTML = '';
    
    if (filtered.length === 0) {
        eventCards.innerHTML = '<div class="empty-message full-span">No events found. Plan your first event above!</div>';
        return;
    }

    filtered.forEach((event, index) => {
        const card = document.createElement('div');
        card.className = 'event-card glass animate-on-load';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="event-card-header">
                <span class="badge badge-${event.category}">${event.category}</span>
                <div class="card-actions-mini">
                    <button class="btn-icon" onclick="editEvent('${event.id}')"><i data-lucide="edit-3"></i></button>
                    <button class="btn-icon" onclick="deleteEvent('${event.id}')" style="color: #f87171;"><i data-lucide="trash-2"></i></button>
                </div>
            </div>
            <div class="event-title">${event.title}</div>
            <div class="meta-row">
                <div class="meta-item"><i data-lucide="calendar"></i> <span>${new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
                <div class="meta-item"><i data-lucide="clock"></i> <span>${event.time}</span></div>
                <div class="meta-item"><i data-lucide="map-pin"></i> <span>${event.venue}</span></div>
            </div>
            <p class="event-desc">${event.description || 'No description provided.'}</p>
            <div class="card-actions">
                <button class="btn btn-primary" onclick="markAttending('${event.id}')">
                    ${event.attending ? '<i data-lucide="check-circle"></i> Attending' : 'Mark Attending'}
                </button>
                <button class="btn btn-secondary" onclick="exportEventICS('${event.id}')">
                    <i data-lucide="download"></i> ICS
                </button>
            </div>
        `;
        eventCards.appendChild(card);
    });
    
    lucide.createIcons();
}

function addEvent() {
    if (!eventName.value || !eventDate.value || !eventTime.value || !eventVenue.value) {
        alert('Please fill in all required fields.');
        return;
    }

    const newEvent = {
        id: Date.now().toString(),
        title: eventName.value,
        date: eventDate.value,
        time: eventTime.value,
        venue: eventVenue.value,
        description: eventDescription.value,
        category: eventCategory.value,
        attending: false
    };

    events.push(newEvent);
    saveEvents();
    clearForm();
    displayEvents();
    updateTodayList();
    renderCalendar();
}

function editEvent(id) {
    const event = events.find(e => e.id === id);
    if (!event) return;

    eventName.value = event.title;
    eventDate.value = event.date;
    eventTime.value = event.time;
    eventVenue.value = event.venue;
    eventDescription.value = event.description;
    eventCategory.value = event.category;
    
    editId = id;
    addEventBtn.classList.add('hidden');
    saveEditBtn.classList.remove('hidden');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function saveEdit() {
    const idx = events.findIndex(e => e.id === editId);
    if (idx === -1) return;

    events[idx] = {
        ...events[idx],
        title: eventName.value,
        date: eventDate.value,
        time: eventTime.value,
        venue: eventVenue.value,
        description: eventDescription.value,
        category: eventCategory.value
    };

    saveEvents();
    clearForm();
    displayEvents();
    updateTodayList();
    renderCalendar();
}

function deleteEvent(id) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    events = events.filter(e => e.id !== id);
    saveEvents();
    displayEvents();
    updateTodayList();
    renderCalendar();
}

function markAttending(id) {
    events = events.map(e => e.id === id ? { ...e, attending: !e.attending } : e);
    saveEvents();
    displayEvents();
}

function updateTodayList() {
    const today = new Date().toISOString().split('T')[0];
    const todaysEvents = events.filter(e => e.date === today);
    
    if (todaysEvents.length === 0) {
        todayList.innerHTML = '<div class="hint">No events scheduled for today.</div>';
        return;
    }

    todayList.innerHTML = todaysEvents.map(e => `
        <div class="today-item">
            <strong>${e.title}</strong>
            <span>${e.time}</span>
        </div>
    `).join('');
}

function renderCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    let html = `
        <div class="calendar-header">
            <strong>${monthNames[month]} ${year}</strong>
        </div>
        <div class="calendar-grid">
            <div class="cal-day">Su</div><div class="cal-day">Mo</div><div class="cal-day">Tu</div>
            <div class="cal-day">We</div><div class="cal-day">Th</div><div class="cal-day">Fr</div><div class="cal-day">Sa</div>
    `;
    
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="cal-cell empty"></div>';
    }
    
    const datesWithEvents = new Set(events.filter(e => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() === month;
    }).map(e => new Date(e.date).getDate()));
    
    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = d === now.getDate();
        const hasEvent = datesWithEvents.has(d);
        html += `<div class="cal-cell ${isToday ? 'active' : ''} ${hasEvent ? 'with-event' : ''}">${d}</div>`;
    }
    
    html += '</div>';
    miniCalendar.innerHTML = html;
}

function startCountdownTimer() {
    setInterval(updateCountdown, 1000);
    updateCountdown();
}

function updateCountdown() {
    const now = new Date();
    const upcoming = events
        .map(e => ({ ...e, dateTime: new Date(`${e.date}T${e.time}`) }))
        .filter(e => e.dateTime > now)
        .sort((a, b) => a.dateTime - b.dateTime);

    if (upcoming.length === 0) {
        nextCountdown.textContent = 'Next Event in: None';
        return;
    }

    const next = upcoming[0].dateTime;
    const diff = next - now;
    
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    nextCountdown.textContent = `Next Event in: ${d}d ${h}h ${m}m ${s}s`;
}

function exportEventICS(id) {
    const e = events.find(event => event.id === id);
    if (!e) return;
    
    const start = e.date.replace(/-/g, '') + 'T' + e.time.replace(/:/g, '') + '00';
    const end = e.date.replace(/-/g, '') + 'T' + (parseInt(e.time.split(':')[0]) + 1).toString().padStart(2, '0') + e.time.split(':')[1].replace(/:/g, '') + '00';
    
    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `SUMMARY:${e.title}`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `LOCATION:${e.venue}`,
        `DESCRIPTION:${e.description}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${e.title.replace(/\s+/g, '_')}.ics`;
    link.click();
}

function exportAllEvents() {
    if (events.length === 0) return;
    events.forEach(e => exportEventICS(e.id));
}

function clearAllEvents() {
    if (events.length === 0) return;
    if (confirm('Are you sure you want to delete ALL events? This cannot be undone.')) {
        events = [];
        saveEvents();
        displayEvents();
        updateTodayList();
        renderCalendar();
    }
}

// Start App
init();
