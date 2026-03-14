// State Management
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let budgets = JSON.parse(localStorage.getItem('budgets')) || {};
let courses = JSON.parse(localStorage.getItem('courses')) || [];
let assignments = JSON.parse(localStorage.getItem('assignments')) || [];

// DOM Elements
const views = document.querySelectorAll('.view');
const navBtns = document.querySelectorAll('.nav-btn');
const viewTitle = document.getElementById('view-title');
const viewTagline = document.getElementById('view-tagline');
const logoutBtn = document.getElementById('logout-btn');

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

function ensureAuthenticated() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return false;
    }

    const savedUser = JSON.parse(localStorage.getItem('authUser') || '{}');
    const profileName = document.querySelector('.user-profile span');
    if (profileName && savedUser.name) {
        profileName.innerText = savedUser.name;
    }

    return true;
}

function setupAuth() {
    if (!logoutBtn) return;
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('authUser');
        window.location.href = 'login.html';
    });
}

// Initialize App
function init() {
    if (!ensureAuthenticated()) return;
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
    setupGPACalculator();
    startAssignmentCountdown();
    setupAuth();
    updateOverviewHub();
}

// Overview Hub Logic
function updateOverviewHub() {
    // 1. Financial Overview
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;
    
    const hubBalanceEl = document.getElementById('current-balance-hub');
    if (hubBalanceEl) {
        hubBalanceEl.innerText = `LKR ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    }

    const hubRecentList = document.getElementById('hub-recent-list');
    if (hubRecentList) {
        hubRecentList.innerHTML = '';
        const recent = transactions.slice(-2).reverse();
        if (recent.length === 0) {
            hubRecentList.innerHTML = '<li class="empty-mini">No recent transactions</li>';
        } else {
            recent.forEach(t => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${t.desc}</span>
                    <strong style="color: ${t.type === 'income' ? 'var(--income)' : 'var(--expense)'}">
                        ${t.type === 'income' ? '+' : '-'} ${t.amount.toLocaleString()}
                    </strong>
                `;
                hubRecentList.appendChild(li);
            });
        }
    }

    // 2. Budget Planner
    const budgetCount = Object.keys(budgets).length;
    const hubBudgetCount = document.getElementById('hub-budget-count');
    if (hubBudgetCount) hubBudgetCount.innerText = budgetCount;
    
    const hubBudgetProgress = document.getElementById('hub-budget-progress');
    const hubBudgetStatus = document.getElementById('hub-budget-status');
    
    if (budgetCount > 0) {
        const totalBudget = Object.values(budgets).reduce((a, b) => a + b, 0);
        const totalSpent = transactions
            .filter(t => t.type === 'expense' && budgets[t.category])
            .reduce((a, b) => a + b, 0);
        const percent = Math.min((totalSpent / totalBudget) * 100, 100);
        if (hubBudgetProgress) hubBudgetProgress.style.width = `${percent}%`;
        if (hubBudgetStatus) hubBudgetStatus.innerText = `${percent.toFixed(0)}% of total budget utilized`;
    } else {
        if (hubBudgetProgress) hubBudgetProgress.style.width = '0%';
        if (hubBudgetStatus) hubBudgetStatus.innerText = 'No budgets defined yet.';
    }

    // 3. Spending Insights
    const catTotals = {};
    transactions.filter(t => t.type === 'expense').forEach(t => catTotals[t.category] = (catTotals[t.category] || 0) + t.amount);
    let topCat = '-', topAmt = 0;
    for (let c in catTotals) { if (catTotals[c] > topAmt) { topCat = c; topAmt = catTotals[c]; } }
    
    const hubTopCatEl = document.getElementById('hub-top-category');
    if (hubTopCatEl) hubTopCatEl.innerText = topCat;
    const hubTopAmtEl = document.getElementById('hub-top-amount');
    if (hubTopAmtEl) hubTopAmtEl.innerText = `LKR ${topAmt.toLocaleString()} spent this month`;

    // 4. Academic Hub
    const pending = assignments.filter(a => !a.completed).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    const nextAssignmentEl = document.getElementById('hub-next-assignment');
    const assignmentDaysEl = document.getElementById('hub-assignment-days');
    
    if (pending.length > 0) {
        const next = pending[0];
        if (nextAssignmentEl) nextAssignmentEl.innerText = next.title;
        const diff = new Date(next.dueDate) - new Date();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (assignmentDaysEl) {
            assignmentDaysEl.innerText = days < 0 ? 'Overdue!' : days === 0 ? 'Due today' : `Due in ${days} days`;
            assignmentDaysEl.style.color = days <= 1 ? 'var(--expense)' : 'var(--text-muted)';
        }
    } else {
        if (nextAssignmentEl) nextAssignmentEl.innerText = 'No assignments';
        if (assignmentDaysEl) {
            assignmentDaysEl.innerText = 'All caught up!';
            assignmentDaysEl.style.color = 'var(--text-muted)';
        }
    }

    // 5. GPA Tracker
    const hubGpaEl = document.getElementById('hub-current-gpa');
    if (hubGpaEl) hubGpaEl.innerText = courses.length > 0 ? calculateGPAValue() : '-';
    const hubCourseCountEl = document.getElementById('hub-course-count');
    if (hubCourseCountEl) hubCourseCountEl.innerText = `${courses.length} courses tracked`;
}

function calculateGPAValue() {
    let totalGradePoints = 0;
    let totalCredits = 0;
    courses.forEach(course => {
        totalGradePoints += course.grade * course.credits;
        totalCredits += course.credits;
    });
    return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '0.00';
}

// Liquid Effect - Mouse Tracking
function setupLiquidEffect() {
    const glassElements = document.querySelectorAll('.glass');

    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;

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
            if (!viewId) return;
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
        overview: { main: 'Overview Hub', sub: 'Your personal academic and financial productivity dashboard.' },
        budget: { main: 'Budgeting & Finance', sub: 'Comprehensive tools to track spending, set budgets, and analyze trends.' },
        assignment: { main: 'Assignment', sub: 'Organize deadlines and stay on top of coursework.' },
        timer: { main: 'Focus Timer', sub: 'Stay productive with deep work sessions.' },
        gpa: { main: 'GPA Calculator', sub: 'Calculate your weighted GPA based on courses and grades.' }
    };
    if (viewTitle && titles[viewId]) viewTitle.innerText = titles[viewId].main;
    if (viewTagline && titles[viewId]) viewTagline.innerText = titles[viewId].sub;

    if (viewId === 'budget') {
        renderTrendChart();
        renderBudgets();
        renderTransactions();
    }
    if (viewId === 'assignment') renderAssignments();
}
window.showView = showView;

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
    const termInput = document.getElementById('transaction-search');
    if (termInput) {
        termInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            renderTransactions(term);
        });
    }
}

// Core Functions
function updateSummary() {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;

    const balanceEl = document.getElementById('current-balance');
    const incomeEl = document.getElementById('total-income');
    const expenseEl = document.getElementById('total-expense');

    if (balanceEl) animateValue(balanceEl, balance);
    if (incomeEl) animateValue(incomeEl, income);
    if (expenseEl) animateValue(expenseEl, expenses);

    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateOverviewHub();
}

function animateValue(obj, value) {
    const start = parseFloat(obj.innerText.replace(/LKR|,/g, '')) || 0;
    const duration = 1500;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const current = easeProgress * (value - start) + start;
        obj.innerText = `LKR ${current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

function renderTransactions(filter = '') {
    transactionHistory.innerHTML = '';
    const filtered = transactions
        .filter(t => t.desc.toLowerCase().includes(filter) || (t.category && t.category.toLowerCase().includes(filter)))
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
    if (!recentTransactionsTable) return;
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

window.deleteTransaction = function (id) {
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
    updateOverviewHub();
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
    updateOverviewHub();
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
    updateOverviewHub();
};

window.deleteAssignment = function(id) {
    const assignment = assignments.find(a => a.id === id);
    if (!confirm(`Are you sure you want to delete "${assignment?.title}"?`)) return;
    assignments = assignments.filter(a => a.id !== id);
    localStorage.setItem('assignments', JSON.stringify(assignments));
    renderAssignments();
    updateOverviewHub();
};

// Analytics & Charts
function updateAnalytics() {
    // Avg Daily Spend
    const last30Days = transactions.filter(t => t.type === 'expense' && (new Date() - new Date(t.date)) / (1000 * 60 * 60 * 24) <= 30);
    const total30 = last30Days.reduce((sum, t) => sum + t.amount, 0);
    const avgEl = document.getElementById('avg-daily-spend');
    if (avgEl) avgEl.innerText = `LKR ${(total30 / 30).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

    // Top Category
    const catTotals = {};
    transactions.filter(t => t.type === 'expense').forEach(t => catTotals[t.category] = (catTotals[t.category] || 0) + t.amount);
    let topCat = '-', topAmt = 0;
    for (let c in catTotals) { if (catTotals[c] > topAmt) { topCat = c; topAmt = catTotals[c]; } }
    const topCatEl = document.getElementById('top-category-name');
    if (topCatEl) topCatEl.innerText = topCat;
    const topAmtEl = document.getElementById('top-category-amount');
    if (topAmtEl) topAmtEl.innerText = `LKR ${topAmt.toLocaleString()}`;
}

function renderChart() {
    const chartEl = document.getElementById('expenseChart');
    if (!chartEl) return;
    const ctx = chartEl.getContext('2d');
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
    const chartEl = document.getElementById('trendChart');
    if (!chartEl) return;
    const ctx = chartEl.getContext('2d');
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
            labels: last7Days.map(d => new Date(d).toLocaleDateString(undefined, { weekday: 'short' })),
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

    if (startBtn) startBtn.addEventListener('click', startTimer);
    if (pauseBtn) pauseBtn.addEventListener('click', pauseTimer);
    if (resetBtn) resetBtn.addEventListener('click', resetTimer);

    if (minutesInput) {
        minutesInput.addEventListener('change', () => {
            if (!isTimerRunning) {
                timerSeconds = minutesInput.value * 60;
                updateTimerDisplay();
            }
        });
    }

    updateTimerDisplay();
}

function startTimer() {
    if (isTimerRunning) return;

    isTimerRunning = true;
    const startBtn = document.getElementById('start-timer');
    const pauseBtn = document.getElementById('pause-timer');
    const minutesInput = document.getElementById('set-minutes');

    if (startBtn) startBtn.style.display = 'none';
    if (pauseBtn) pauseBtn.style.display = 'flex';
    if (minutesInput) minutesInput.disabled = true;

    timerInterval = setInterval(() => {
        if (timerSeconds > 0) {
            timerSeconds--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            isTimerRunning = false;
            if (startBtn) startBtn.style.display = 'flex';
            if (pauseBtn) pauseBtn.style.display = 'none';
            if (minutesInput) minutesInput.disabled = false;
            alert("Time's up!");
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    const startBtn = document.getElementById('start-timer');
    const pauseBtn = document.getElementById('pause-timer');
    if (startBtn) startBtn.style.display = 'flex';
    if (pauseBtn) pauseBtn.style.display = 'none';
}

function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    const startBtn = document.getElementById('start-timer');
    const pauseBtn = document.getElementById('pause-timer');
    const minutesInput = document.getElementById('set-minutes');
    
    if (minutesInput) timerSeconds = minutesInput.value * 60;

    if (startBtn) startBtn.style.display = 'flex';
    if (pauseBtn) pauseBtn.style.display = 'none';
    if (minutesInput) minutesInput.disabled = false;

    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutesEl = document.getElementById('timer-minutes');
    const secondsEl = document.getElementById('timer-seconds');
    if (!minutesEl || !secondsEl) return;

    const hours = Math.floor(timerSeconds / 3600);
    const minutes = Math.floor((timerSeconds % 3600) / 60);
    const seconds = timerSeconds % 60;

    minutesEl.innerText = String(minutes + (hours * 60)).padStart(2, '0');
    secondsEl.innerText = String(seconds).padStart(2, '0');
}

// GPA Calculator Functions
function setupGPACalculator() {
    const addCourseBtn = document.getElementById('add-course-btn');
    const calculateGpaBtn = document.getElementById('calculate-gpa-btn');
    const clearCoursesBtn = document.getElementById('clear-courses-btn');
    const courseName = document.getElementById('course-name');

    if (addCourseBtn) addCourseBtn.addEventListener('click', addCourse);
    if (calculateGpaBtn) calculateGpaBtn.addEventListener('click', calculateGPA);
    if (clearCoursesBtn) clearCoursesBtn.addEventListener('click', clearAllCourses);

    if (courseName) {
        courseName.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addCourse();
        });
    }

    renderCourses();
}

function addCourse() {
    const courseName = document.getElementById('course-name');
    const courseGrade = document.getElementById('course-grade');
    const courseCredits = document.getElementById('course-credits');

    if (!courseName.value.trim()) {
        alert('Please enter a course name');
        courseName.focus();
        return;
    }

    if (!courseGrade.value) {
        alert('Please select a grade');
        courseGrade.focus();
        return;
    }

    if (!courseCredits.value || parseFloat(courseCredits.value) <= 0) {
        alert('Please enter valid credits');
        courseCredits.focus();
        return;
    }

    const newCourse = {
        id: Date.now(),
        name: courseName.value.trim(),
        grade: parseFloat(courseGrade.value),
        credits: parseFloat(courseCredits.value)
    };

    courses.push(newCourse);
    saveCourses();

    courseName.value = '';
    courseGrade.value = '';
    courseCredits.value = '';
    courseName.focus();

    renderCourses();
    hideGPAResult();
}

function deleteCourse(id) {
    courses = courses.filter(course => course.id !== id);
    saveCourses();
    renderCourses();
    hideGPAResult();
}

function renderCourses() {
    const container = document.getElementById('courses-container');
    if (!container) return;

    if (courses.length === 0) {
        container.innerHTML = '<p class="empty-message">No courses added yet. Add your first course above!</p>';
        return;
    }

    container.innerHTML = courses.map(course => `
        <div class="course-item">
            <div class="course-info">
                <div class="course-item-name">${course.name}</div>
                <div class="course-item-details">
                    <span>Grade: ${getGradeLetter(course.grade)} (${course.grade})</span>
                    <span>Credits: ${course.credits}</span>
                </div>
            </div>
            <button class="course-item-delete" onclick="deleteCourse(${course.id})">
                <i data-lucide="trash-2"></i> Delete
            </button>
        </div>
    `).join('');

    lucide.createIcons();
}

function getGradeLetter(gpa) {
    if (gpa >= 3.7) return 'A';
    if (gpa >= 3.3) return 'A-';
    if (gpa >= 3.0) return 'B+';
    if (gpa >= 2.7) return 'B';
    if (gpa >= 2.3) return 'B-';
    if (gpa >= 2.0) return 'C+';
    if (gpa >= 1.7) return 'C';
    if (gpa >= 1.3) return 'C-';
    if (gpa >= 1.0) return 'D+';
    if (gpa >= 0.7) return 'D';
    return 'F';
}

function calculateGPA() {
    if (courses.length === 0) {
        alert('Please add at least one course before calculating GPA');
        return;
    }

    let totalGradePoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
        totalGradePoints += course.grade * course.credits;
        totalCredits += course.credits;
    });

    const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;

    const gpaValEl = document.getElementById('gpa-value');
    const totCoursesEl = document.getElementById('total-courses');
    const totCreditsEl = document.getElementById('total-credits');
    const gradePtsEl = document.getElementById('grade-points');

    if (gpaValEl) gpaValEl.textContent = gpa;
    if (totCoursesEl) totCoursesEl.textContent = courses.length;
    if (totCreditsEl) totCreditsEl.textContent = totalCredits.toFixed(1);
    if (gradePtsEl) gradePtsEl.textContent = totalGradePoints.toFixed(2);

    showGPAResult();
}

function showGPAResult() {
    const resEl = document.getElementById('gpa-result');
    if (resEl) resEl.classList.remove('hidden');
}

function hideGPAResult() {
    const resEl = document.getElementById('gpa-result');
    if (resEl) resEl.classList.add('hidden');
}

function clearAllCourses() {
    if (courses.length === 0) return;
    if (confirm('Are you sure you want to delete all courses?')) {
        courses = [];
        saveCourses();
        renderCourses();
        hideGPAResult();
    }
}

function saveCourses() {
    localStorage.setItem('courses', JSON.stringify(courses));
    updateOverviewHub();
}

init();
