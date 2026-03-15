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
const miniCalendar = document.getElementById('miniCalendar');
const todayList = document.getElementById('todayList');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const notificationStatus = document.getElementById('notificationStatus');
const reminderIndicator = document.getElementById('reminderIndicator');
const nextCountdown = document.getElementById('nextCountdown');
const exportAllBtn = document.getElementById('exportAllBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const alarmSound = document.getElementById('alarmSound');
const confettiLayer = document.getElementById('confetti');

let events = JSON.parse(localStorage.getItem('uniEventsList') || '[]');
let editId = null;

function saveEvents() {
    localStorage.setItem('uniEventsList', JSON.stringify(events));
}

function randomFrom(array) { return array[Math.floor(Math.random() * array.length)]; }

function getCategoryClass(cat) {
    if (cat === 'Academic') return 'badge-academic';
    if (cat === 'Cultural') return 'badge-cultural';
    if (cat === 'Sports') return 'badge-sports';
    return 'badge-club';
}

function clearForm() {
    eventName.value = '';
    eventDate.value = '';
    eventTime.value = '';
    eventVenue.value = '';
    eventDescription.value = '';
    eventCategory.value = 'Academic';
    editId = null;
    saveEditBtn.classList.add('hidden');
    addEventBtn.classList.remove('hidden');
}

function parseDateTime(item) {
    return new Date(`${item.date}T${item.time}:00`);
}

function updateCountdown() {
    const now = new Date();
    const upcoming = events
        .filter(e => parseDateTime(e) > now)
        .sort((a, b) => parseDateTime(a) - parseDateTime(b))[0];
    if (!upcoming) {
        nextCountdown.textContent = 'Next Event in: None';
        return;
    }
    const diff = parseDateTime(upcoming) - now;
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    nextCountdown.textContent = `Next Event in: ${d}d ${h}h ${m}m`;
}

function displayEvents() {
    const query = searchInput.value.trim().toLowerCase();
    const filter = categoryFilter.value;
    const today = new Date().toISOString().split('T')[0];

    const filtered = events.filter(event => {
        const matchQuery = [event.title, event.venue, event.description, event.category].join(' ').toLowerCase().includes(query);
        const matchCategory = filter === 'all' || event.category === filter;
        return matchQuery && matchCategory;
    }).sort((a, b) => parseDateTime(a) - parseDateTime(b));

    eventCards.innerHTML = filtered.length ? '' : '<div class="hint-row">No events found. Add your first event!</div>';

    filtered.forEach(event => {
        const card = document.createElement('article');
        card.className = 'event-card';

        const eventDateTime = parseDateTime(event);
        const now = new Date();
        const timeDiff = eventDateTime - now;
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((timeDiff / (1000 * 60)) % 60);
        const countdownText = timeDiff > 0 ? `${days}d ${hours}h ${mins}m` : 'Started';

        card.innerHTML = `
            <div class="event-top">
                <div>
                    <div class="event-title">${event.title}</div>
                    <div class="meta-row">
                        <div class="meta-item">📅 ${event.date}</div>
                        <div class="meta-item">⏱ ${event.time}</div>
                        <div class="meta-item">📍 ${event.venue}</div>
                    </div>
                </div>
                <span class="badge ${getCategoryClass(event.category)}">${event.category}</span>
            </div>
            <div class="status-line">
                <span class="countdown">Countdown: ${countdownText}</span>
                <span class="tag ${event.status === 'completed' ? 'tag-muted' : event.status === 'reminder-sent' ? 'tag-green' : 'tag tag-muted'}">${event.status.replace('-', ' ')}</span>
            </div>
            <div class="card-actions">
                <button class="btn btn-light" onclick="editEvent('${event.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteEvent('${event.id}')">Delete</button>
                <button class="btn btn-primary" onclick="markAttending('${event.id}')">${event.attending ? '✓ Attending' : 'Mark Attending'}</button>
                <button class="btn btn-secondary" onclick="exportEventICS('${event.id}')">Export .ics</button>
            </div>
            <p style="margin-top:6px;color:#55668f;font-size:.82rem;">${event.description || 'No description added.'}</p>
        `;

        eventCards.appendChild(card);
    });

    const todaysEvents = events.filter(e => e.date === today).sort((a,b)=>event.title.localeCompare(b.title));
    if (!todaysEvents.length) {
        todayList.innerHTML = '<div class="hint">No events scheduled for today.</div>';
    } else {
        todayList.innerHTML = todaysEvents.map(e => `<div>• <strong>${e.title}</strong> at ${e.time}</div>`).join('');
    }
    updateCountdown();
    renderMiniCalendar();
}

function renderMiniCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const first = new Date(year, month, 1);
    const startDay = first.getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const datesWithEvents = new Set(events.filter(e => e.date.startsWith(`${year}-${String(month + 1).padStart(2,'0')}`)).map(e => Number(e.date.split('-')[2])));

    miniCalendar.innerHTML = `<h3>${now.toLocaleString('default',{month:'long'})} ${year}</h3>`;
    const grid = document.createElement('div');
    grid.className = 'calendar-grid';
    ['S','M','T','W','T','F','S'].forEach(d => { const cell=document.createElement('div'); cell.className='cal-day'; cell.textContent=d; grid.appendChild(cell); });
    for (let i=0;i<startDay;i++){const cell=document.createElement('div'); cell.className='cal-cell'; cell.innerHTML='&nbsp;'; grid.appendChild(cell);}    
    for (let d=1; d<=totalDays; d++) {
        const cell = document.createElement('div');
        cell.className = 'cal-cell';
        if (datesWithEvents.has(d)) cell.classList.add('with-event');
        if (d === now.getDate()) cell.classList.add('active');
        cell.textContent = d;
        cell.onclick = () => {
            const selected = `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            searchInput.value = '';
            categoryFilter.value = 'all';
            displayEventsForDate(selected);
        };
        grid.appendChild(cell);
    }
    miniCalendar.appendChild(grid);
}

function displayEventsForDate(dateString) {
    const dayEvents = events.filter(e => e.date === dateString);
    if (!dayEvents.length) {
        eventCards.innerHTML = '<div class="hint-row">No events on selected date.</div>';
        return;
    }
    eventCards.innerHTML = '';
    dayEvents.forEach(event => {
        const card = document.createElement('article');
        card.className = 'event-card';
        const eventDateTime = parseDateTime(event);
        const now = new Date();
        const timeDiff = eventDateTime - now;
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((timeDiff / (1000 * 60)) % 60);
        const countdownText = timeDiff > 0 ? `${days}d ${hours}h ${mins}m` : 'Started';
        card.innerHTML = `
            <div class="event-top"><div><div class="event-title">${event.title}</div><div class="meta-row"><div class="meta-item">📅 ${event.date}</div><div class="meta-item">⏱ ${event.time}</div><div class="meta-item">📍 ${event.venue}</div></div></div><span class="badge ${getCategoryClass(event.category)}">${event.category}</span></div>
            <div class="status-line"><span class="countdown">Countdown: ${countdownText}</span></div>
            <div class="card-actions"><button class="btn btn-light" onclick="editEvent('${event.id}')">Edit</button><button class="btn btn-danger" onclick="deleteEvent('${event.id}')">Delete</button><button class="btn btn-primary" onclick="markAttending('${event.id}')">${event.attending ? '✓ Attending' : 'Mark Attending'}</button></div>
            <p style="margin-top:6px;color:#55668f;font-size:.82rem;">${event.description || 'No description added.'}</p>
        `;
        eventCards.appendChild(card);
    });
}

function addEvent() {
    const title = eventName.value.trim();
    const date = eventDate.value;
    const time = eventTime.value;
    const venue = eventVenue.value.trim();
    const description = eventDescription.value.trim();
    const category = eventCategory.value;

    if (!title || !date || !time || !venue) {
        alert('Please complete all required fields.');
        return;
    }

    if (editId) {
        const idx = events.findIndex(e => e.id === editId);
        if (idx < 0) return;
        events[idx] = { ...events[idx], title, date, time, venue, description, category };
        editId = null;
        saveEditBtn.classList.add('hidden');
        addEventBtn.classList.remove('hidden');
    } else {
        events.push({
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            title,
            date,
            time,
            venue,
            description,
            category,
            attending: false,
            status: 'upcoming',
            reminders: { twoDays: false, nightBefore: false },
        });
    }

    saveEvents();
    clearForm();
    displayEvents();
    sendNotification('Event saved', `${title} has been added to your schedule.`);
}

function editEvent(id) {
    const event = events.find(e => e.id === id);
    if (!event) return;
    editId = id;
    eventName.value = event.title;
    eventDate.value = event.date;
    eventTime.value = event.time;
    eventVenue.value = event.venue;
    eventDescription.value = event.description;
    eventCategory.value = event.category;
    addEventBtn.classList.add('hidden');
    saveEditBtn.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteEvent(id) {
    if (!confirm('Delete this event?')) return;
    events = events.filter(e => e.id !== id);
    saveEvents();
    displayEvents();
}

function markAttending(id) {
    events = events.map(e => e.id === id ? { ...e, attending: !e.attending } : e);
    saveEvents();
    displayEvents();
}

function requestNotificationPermission() {
    if (!('Notification' in window)) {
        notificationStatus.textContent = 'Notifications: Not supported';
        return;
    }
    Notification.requestPermission().then(p => {
        notificationStatus.textContent = `Notifications: ${p === 'granted' ? 'Enabled' : 'Disabled'}`;
    });
}

function sendNotification(title, body) {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: '' });
        alarmSound.play().catch(() => {});
    }
}

function scheduleReminders() {
    const now = new Date();
    let reminderSent = false;
    events = events.map(event => {
        const dateTime = parseDateTime(event);
        const msUntil = dateTime - now;
        if (msUntil <= 0 && event.status !== 'completed') {
            event.status = 'completed';
        }

        const twoDaysBefore = new Date(dateTime.getTime() - (2 * 24 * 60 * 60 * 1000));
        if (!event.reminders.twoDays && now >= twoDaysBefore && now < dateTime) {
            sendNotification(`Upcoming: ${event.title}`, `2 days remaining - ${event.date} at ${event.time}`);
            event.reminders.twoDays = true;
            reminderSent = true;
        }

        const nightBefore = new Date(dateTime.getTime() - (24 * 60 * 60 * 1000));
        nightBefore.setHours(20,0,0,0);
        if (!event.reminders.nightBefore && now >= nightBefore && now < dateTime) {
            sendNotification(`Reminder Tonight: ${event.title}`, `Event tomorrow at ${event.time} in ${event.venue}`);
            event.reminders.nightBefore = true;
            reminderSent = true;
        }

        if (dateTime.toDateString() === now.toDateString() && msUntil <= 2 * 60 * 1000 && msUntil > 0) {
            triggerConfetti();
        }
        return event;
    });
    if (reminderSent) reminderIndicator.textContent = 'Reminder Sent';
    saveEvents();
}

function triggerConfetti() {
    for (let i = 0; i < 30; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.background = randomFrom(['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']);
        piece.style.animationDuration = `${1 + Math.random() * 2}s`;
        piece.style.animationDelay = `${Math.random() * 0.3}s`;
        confettiLayer.appendChild(piece);
        setTimeout(() => piece.remove(), 2500);
    }
}

function exportEventICS(id) {
    const event = events.find(e => e.id === id);
    if (!event) return;
    const start = `${event.date.replace(/-/g, '')}T${event.time.replace(':','')}00`;
    const dtstamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//UniMate//Event Planner//EN\nBEGIN:VEVENT\nUID:${event.id}\nDTSTAMP:${dtstamp}\nDTSTART:${start}\nSUMMARY:${event.title}\nDESCRIPTION:${event.description || ''}\nLOCATION:${event.venue}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${event.title.replace(/\s+/g, '_')}.ics`;
    link.click();
}

function exportAllICS() {
    if (!events.length) { alert('No events to export yet.'); return; }
    events.forEach(e => exportEventICS(e.id));
}

function deleteAllEvents() {
    if (!confirm('Delete all events permanently?')) return;
    events = [];
    saveEvents();
    displayEvents();
}

function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    if (isDark) {
        document.body.style.background = '#0f172a';
        document.querySelectorAll('.glass-card').forEach(el=>el.style.background='rgba(15,23,42,.92)');
    } else {
        document.body.style.background = 'linear-gradient(180deg,#ebf0ff,#e4e8ff 30%,#f8f9ff 100%)';
        document.querySelectorAll('.glass-card').forEach(el=>el.style.background='white');
    }
    darkModeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
}

darkModeToggle.addEventListener('click', toggleDarkMode);
addEventBtn.addEventListener('click', addEvent);
saveEditBtn.addEventListener('click', addEvent);
clearBtn.addEventListener('click', clearForm);
searchInput.addEventListener('input', displayEvents);
categoryFilter.addEventListener('change', displayEvents);
exportAllBtn.addEventListener('click', exportAllICS);
clearAllBtn.addEventListener('click', deleteAllEvents);

window.deleteEvent = deleteEvent;
window.editEvent = editEvent;
window.markAttending = markAttending;
window.exportEventICS = exportEventICS;

requestNotificationPermission();
displayEvents();
scheduleReminders();
setInterval(() => { displayEvents(); scheduleReminders(); }, 60 * 1000);
