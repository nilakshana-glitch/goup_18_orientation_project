// State Management
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let budgets = JSON.parse(localStorage.getItem('budgets')) || {};
let assignments = JSON.parse(localStorage.getItem('assignments')) || [];

// DOM Elements
const views = document.querySelectorAll('.view');
const navBtns = document.querySelectorAll('.nav-btn');
const viewTitle = document.getElementById('view-title');
const viewTagline = document.getElementById('view-tagline');

const modalOverlay = document.getElementById('add-modal-overlay');
const openModalBtn = document.getElementById('open-modal');
const closeModalBtn = document.getElementById('close-modal');

const transactionHistory = document.querySelector('#full-transaction-history tbody');
const recentTransactionsTable = document.querySelector('#recent-transactions-table tbody');
const budgetProgressList = document.getElementById('budget-progress-list');
const assignmentForm = document.getElementById('assignment-form');
const assignmentCardsContainer = document.getElementById('assignment-cards');

// Charts
let expenseChart;
let trendChart;

// Initialize App
function init() {
    updateSummary();
    renderTransactions();
    renderRecentTransactions();
    renderChart();
    renderTrendChart();
    renderBudgets();
    renderAssignments();
    setupNavigation();
    setupModal();
    setupForms();
    setupSearch();
    updateAnalytics();
    setupLiquidEffect();
    setupTimer();
    startAssignmentCountdown();
}

// Liquid Effect - Mouse Tracking
function setupLiquidEffect() {
    const blobs = document.querySelectorAll('.blob');
    const glassElements = document.querySelectorAll('.glass');

    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 40;
        const y = (clientY / window.innerHeight - 0.5) * 40;

        // Move blobs slightly
        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 0.5;
            blob.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });

        // Update glass shine position
        glassElements.forEach(glass => {
            const rect = glass.getBoundingClientRect();
            const localX = clientX - rect.left;
            const localY = clientY - rect.top;
            glass.style.setProperty('--mouse-x', `${localX}px`);
            glass.style.setProperty('--mouse-y', `${localY}px`);
        });
    });
}

// Navigation Logic
function setupNavigation() {
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const viewId = btn.getAttribute('data-view');
            showView(viewId);
        });
    });
}

function showView(viewId) {
    // Update Sidebar
    navBtns.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-view') === viewId);
    });

    // Update Views
    views.forEach(v => {
        v.classList.toggle('active', v.id === `view-${viewId}`);
    });

    // Update Header
    const titles = {
        overview: { main: 'Overview', sub: 'Financial clarity for the modern student.' },
        transactions: { main: 'Transactions', sub: 'A detailed history of your financial flow.' },
        budget: { main: 'Budgeting', sub: 'Plan your spending and stay on track.' },
        analytics: { main: 'Analytics', sub: 'Deep insights into your spending habits.' },
        assignment: { main: 'Assignment', sub: 'Organize deadlines and stay on top of coursework.' },
        timer: { main: 'Focus Timer', sub: 'Stay productive with deep work sessions.' }
    };
    viewTitle.innerText = titles[viewId].main;
    viewTagline.innerText = titles[viewId].sub;

    if (viewId === 'analytics') renderTrendChart();
    if (viewId === 'budget') renderBudgets();
    if (viewId === 'assignment') renderAssignments();
}

// Modal Logic
function setupModal() {
    openModalBtn.addEventListener('click', () => modalOverlay.classList.add('active'));
    closeModalBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });

    // Tab Logic in Modal
    const tabBtns = modalOverlay.querySelectorAll('.tab-btn');
    const modalForms = modalOverlay.querySelectorAll('.modal-form');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            modalForms.forEach(f => f.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`${tabId}-form`).classList.add('active');
        });
    });
}

// Forms Logic
function setupForms() {
    document.getElementById('income-form').addEventListener('submit', (e) => addTransaction(e, 'income'));
    document.getElementById('expense-form').addEventListener('submit', (e) => addTransaction(e, 'expense'));
    document.getElementById('budget-form').addEventListener('submit', setBudget);
    if (assignmentForm) assignmentForm.addEventListener('submit', addAssignment);
}

// Search Logic
function setupSearch() {
    document.getElementById('transaction-search').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        renderTransactions(term);
    });
}

// Core Functions
function updateSummary() {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;

    animateValue(document.getElementById('current-balance'), balance);
    animateValue(document.getElementById('total-income'), income);
    animateValue(document.getElementById('total-expense'), expenses);

    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function animateValue(obj, value) {
    const start = parseFloat(obj.innerText.replace(/LKR|,/g, '')) || 0;
    const duration = 1500; // Slightly longer for smoothness
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Smoother easing: easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const current = easeProgress * (value - start) + start;
        
        obj.innerText = `LKR ${current.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

function renderTransactions(filter = '') {
    transactionHistory.innerHTML = '';
    const filtered = transactions
        .filter(t => t.desc.toLowerCase().includes(filter) || t.category?.toLowerCase().includes(filter))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    filtered.forEach(t => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(t.date).toLocaleDateString()}</td>
            <td><strong>${t.desc}</strong></td>
            <td><span class="badge">${t.category || 'Allowance'}</span></td>
            <td style="color: ${t.type === 'income' ? 'var(--income)' : 'var(--expense)'}">${t.type.toUpperCase()}</td>
            <td style="font-weight: 700">${t.type === 'income' ? '+' : '-'} LKR ${t.amount.toLocaleString()}</td>
            <td><button class="btn-text" style="color: var(--expense)" onclick="deleteTransaction('${t.id}')">Delete</button></td>
        `;
        transactionHistory.appendChild(row);
    });
}

function renderRecentTransactions() {
    recentTransactionsTable.innerHTML = '';
    transactions.slice(-5).reverse().forEach(t => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${t.desc}</strong></td>
            <td><span class="badge">${t.category || 'Allowance'}</span></td>
            <td style="font-weight: 700; color: ${t.type === 'income' ? 'var(--income)' : 'white'}">${t.type === 'income' ? '+' : '-'} LKR ${t.amount.toLocaleString()}</td>
        `;
        recentTransactionsTable.appendChild(row);
    });
}

function addTransaction(e, type) {
    e.preventDefault();
    const amount = parseFloat(e.target.querySelector('input[type="number"]').value);
    const desc = e.target.querySelector('input[type="text"]').value;
    const date = e.target.querySelector('input[type="date"]').value;
    const category = type === 'expense' ? e.target.querySelector('select').value : null;

    transactions.push({ id: Math.random().toString(36).substr(2, 9), type, amount, desc, date, category });
    e.target.reset();
    modalOverlay.classList.remove('active');
    
    updateSummary();
    renderTransactions();
    renderRecentTransactions();
    renderChart();
    updateAnalytics();
    if (document.getElementById('view-budget').classList.contains('active')) renderBudgets();
}

window.deleteTransaction = function(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateSummary();
    renderTransactions();
    renderRecentTransactions();
    renderChart();
    updateAnalytics();
};

// Budget Logic
function setBudget(e) {
    e.preventDefault();
    const cat = document.getElementById('budget-category').value;
    const amount = parseFloat(document.getElementById('budget-amount').value);
    budgets[cat] = amount;
    localStorage.setItem('budgets', JSON.stringify(budgets));
    e.target.reset();
    renderBudgets();
}

function renderBudgets() {
    budgetProgressList.innerHTML = '';
    const categories = ['Food', 'Transport', 'Study', 'Entertainment', 'Others'];
    
    categories.forEach(cat => {
        if (!budgets[cat]) return;
        
        const spent = transactions
            .filter(t => t.type === 'expense' && t.category === cat)
            .reduce((sum, t) => sum + t.amount, 0);
        
        const limit = budgets[cat];
        const percent = Math.min((spent / limit) * 100, 100);
        const color = percent > 90 ? 'var(--expense)' : percent > 70 ? 'var(--warning)' : 'var(--income)';

        const item = document.createElement('div');
        item.className = 'budget-item';
        item.innerHTML = `
            <div class="budget-label">
                <span>${cat}</span>
                <span>LKR ${spent.toLocaleString()} / ${limit.toLocaleString()}</span>
            </div>
            <div class="progress-bg">
                <div class="progress-fill" style="width: ${percent}%; background: ${color}"></div>
            </div>
        `;
        budgetProgressList.appendChild(item);
    });
}

// Assignment Logic
function addAssignment(e) {
    e.preventDefault();

    const title = document.getElementById('assignment-title').value.trim();
    const dueDate = document.getElementById('assignment-due-date').value;
    const priority = document.getElementById('assignment-priority').value;

    assignments.push({
        id: Math.random().toString(36).substr(2, 9),
        title,
        dueDate,
        priority,
        completed: false
    });

    localStorage.setItem('assignments', JSON.stringify(assignments));
    assignmentForm.reset();
    document.getElementById('assignment-priority').value = 'Medium';
    renderAssignments();
}

function renderAssignments() {
    if (!assignmentCardsContainer) return;
    assignmentCardsContainer.innerHTML = '';

    if (!assignments.length) {
        assignmentCardsContainer.innerHTML = '<p class="assignment-empty">No assignments yet. Add your first assignment from the form.</p>';
        return;
    }

    const sortedAssignments = [...assignments].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    sortedAssignments.forEach(a => {
        const remainingText = formatRemainingTime(a.dueDate, a.completed);
        const isOverdue = !a.completed && getAssignmentDeadline(a.dueDate) < new Date();

        const card = document.createElement('article');
        card.className = 'assignment-item-card glass';
        card.innerHTML = `
            <div class="assignment-card-head">
                <h4>${a.title}</h4>
                <span class="badge">${a.priority}</span>
            </div>
            <div class="assignment-card-meta">
                <p><strong>Due:</strong> ${new Date(a.dueDate).toLocaleDateString()}</p>
                <p><strong>Remaining:</strong> <span class="assignment-remaining ${isOverdue ? 'overdue' : ''}" data-due-date="${a.dueDate}" data-completed="${a.completed}">${remainingText}</span></p>
                <p><strong>Status:</strong> ${a.completed ? '<span class="assignment-status done">Done</span>' : isOverdue ? '<span class="assignment-status overdue">Overdue</span>' : '<span class="assignment-status pending">Pending</span>'}</p>
            </div>
            <div class="assignment-actions">
                <button class="btn-text assignment-toggle-btn ${a.completed ? 'assignment-toggle-btn--pending' : 'assignment-toggle-btn--done'}" onclick="toggleAssignmentStatus('${a.id}')">${a.completed ? 'Mark Pending' : 'Mark Done'}</button>
                <button class="btn-text assignment-delete-btn" onclick="deleteAssignment('${a.id}')">Delete</button>
            </div>
        `;
        assignmentCardsContainer.appendChild(card);
    });

    updateAssignmentCountdowns();
}

function getAssignmentDeadline(dueDate) {
    return new Date(`${dueDate}T23:59:59`);
}

function formatRemainingTime(dueDate, isCompleted) {
    if (isCompleted) return 'Completed';

    const now = new Date();
    const deadline = getAssignmentDeadline(dueDate);
    const diffMs = deadline - now;

    if (diffMs < 0) {
        const overdueMs = Math.abs(diffMs);
        const overdueDays = Math.floor(overdueMs / (1000 * 60 * 60 * 24));
        const overdueHours = Math.floor((overdueMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        return `Overdue by ${overdueDays}d ${overdueHours}h`;
    }

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function updateAssignmentCountdowns() {
    const countdowns = document.querySelectorAll('.assignment-remaining');
    countdowns.forEach(item => {
        const dueDate = item.getAttribute('data-due-date');
        const isCompleted = item.getAttribute('data-completed') === 'true';
        item.innerText = formatRemainingTime(dueDate, isCompleted);

        const overdue = !isCompleted && getAssignmentDeadline(dueDate) < new Date();
        item.classList.toggle('overdue', overdue);
    });
}

function startAssignmentCountdown() {
    setInterval(updateAssignmentCountdowns, 1000);
}

window.toggleAssignmentStatus = function(id) {
    assignments = assignments.map(a => {
        if (a.id !== id) return a;
        return { ...a, completed: !a.completed };
    });
    localStorage.setItem('assignments', JSON.stringify(assignments));
    renderAssignments();
};

window.deleteAssignment = function(id) {
    const assignment = assignments.find(a => a.id === id);
    if (!confirm(`Are you sure you want to delete "${assignment?.title}"?`)) return;
    assignments = assignments.filter(a => a.id !== id);
    localStorage.setItem('assignments', JSON.stringify(assignments));
    renderAssignments();
};

// Analytics & Charts
function updateAnalytics() {
    // Avg Daily Spend
    const last30Days = transactions.filter(t => t.type === 'expense' && (new Date() - new Date(t.date)) / (1000*60*60*24) <= 30);
    const total30 = last30Days.reduce((sum, t) => sum + t.amount, 0);
    document.getElementById('avg-daily-spend').innerText = `LKR ${(total30 / 30).toLocaleString(undefined, {maximumFractionDigits: 0})}`;

    // Top Category
    const catTotals = {};
    transactions.filter(t => t.type === 'expense').forEach(t => catTotals[t.category] = (catTotals[t.category] || 0) + t.amount);
    let topCat = '-', topAmt = 0;
    for (let c in catTotals) { if (catTotals[c] > topAmt) { topCat = c; topAmt = catTotals[c]; } }
    document.getElementById('top-category-name').innerText = topCat;
    document.getElementById('top-category-amount').innerText = `LKR ${topAmt.toLocaleString()}`;
}

function renderChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const catTotals = {};
    transactions.filter(t => t.type === 'expense').forEach(t => catTotals[t.category] = (catTotals[t.category] || 0) + t.amount);
    
    if (expenseChart) expenseChart.destroy();
    expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(catTotals),
            datasets: [{
                data: Object.values(catTotals),
                backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                borderWidth: 0,
                hoverOffset: 20
            }]
        },
        options: { 
            cutout: '75%', 
            plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { weight: '600' } } } }
        }
    });
}

function renderTrendChart() {
    const ctx = document.getElementById('trendChart').getContext('2d');
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const data = last7Days.map(date => {
        return transactions
            .filter(t => t.type === 'expense' && t.date === date)
            .reduce((sum, t) => sum + t.amount, 0);
    });

    if (trendChart) trendChart.destroy();
    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7Days.map(d => new Date(d).toLocaleDateString(undefined, {weekday: 'short'})),
            datasets: [{
                label: 'Spending',
                data: data,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: '#6366f1'
            }]
        },
        options: {
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

// Timer Logic
let timerInterval;
let timerSeconds = 25 * 60;
let isTimerRunning = false;

function setupTimer() {
    const startBtn = document.getElementById('start-timer');
    const pauseBtn = document.getElementById('pause-timer');
    const resetBtn = document.getElementById('reset-timer');
    const minutesInput = document.getElementById('set-minutes');

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    minutesInput.addEventListener('change', () => {
        if (!isTimerRunning) {
            timerSeconds = minutesInput.value * 60;
            updateTimerDisplay();
        }
    });

    updateTimerDisplay();
}

function startTimer() {
    if (isTimerRunning) return;
    
    isTimerRunning = true;
    document.getElementById('start-timer').style.display = 'none';
    document.getElementById('pause-timer').style.display = 'flex'; 
    document.getElementById('set-minutes').disabled = true;

    timerInterval = setInterval(() => {
        if (timerSeconds > 0) {
            timerSeconds--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            isTimerRunning = false;
            document.getElementById('start-timer').style.display = 'flex'; 
            document.getElementById('pause-timer').style.display = 'none';
            document.getElementById('set-minutes').disabled = false;
            alert("Time's up!");
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    document.getElementById('start-timer').style.display = 'flex';
    document.getElementById('pause-timer').style.display = 'none';
}

function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    const minutesInput = document.getElementById('set-minutes');
    timerSeconds = minutesInput.value * 60;
    
    document.getElementById('start-timer').style.display = 'flex';
    document.getElementById('pause-timer').style.display = 'none';
    document.getElementById('set-minutes').disabled = false;
    
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const hours = Math.floor(timerSeconds / 3600);
    const minutes = Math.floor((timerSeconds % 3600) / 60);
    const seconds = timerSeconds % 60;

    document.getElementById('timer-minutes').innerText = String(minutes + (hours * 60)).padStart(2, '0');
    document.getElementById('timer-seconds').innerText = String(seconds).padStart(2, '0');
}

init();
