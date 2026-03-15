let friends = JSON.parse(localStorage.getItem('splitter-friends')) || [];
let history = JSON.parse(localStorage.getItem('splitter-history')) || [];

function init() {
    renderFriends();
    renderHistory();
    setupEventListeners();
}

function setupEventListeners() {
    document.getElementById('add-friend-btn')?.addEventListener('click', () => {
        const name = document.getElementById('friend-name').value.trim();
        if (name && !friends.includes(name)) {
            friends.push(name);
            localStorage.setItem('splitter-friends', JSON.stringify(friends));
            document.getElementById('friend-name').value = '';
            renderFriends();
        }
    });
    document.getElementById('expense-split-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const desc = document.getElementById('expense-desc').value;
        const amt = parseFloat(document.getElementById('expense-amount').value);
        const payer = document.getElementById('payer-select').value;
        history.push({ desc, amt, payer, date: new Date().toLocaleDateString() });
        localStorage.setItem('splitter-history', JSON.stringify(history));
        renderHistory();
        e.target.reset();
    });
}

function renderFriends() {
    const list = document.getElementById('friends-list');
    const select = document.getElementById('payer-select');
    if (!list || !select) return;
    list.innerHTML = friends.map(f => `<span class="friend-tag">${f}</span>`).join('');
    select.innerHTML = '<option value="You">You</option>' + friends.map(f => `<option value="${f}">${f}</option>`).join('');
}

function renderHistory() {
    const list = document.getElementById('splits-history');
    if (!list) return;
    list.innerHTML = history.map(h => `<div class="split-history-item"><h4>${h.desc}</h4><p>LKR ${h.amt} paid by ${h.payer}</p></div>`).join('');
}

document.addEventListener('DOMContentLoaded', init);
