// Bill Splitter Logic
let friends = JSON.parse(localStorage.getItem('splitter-friends')) || [];
let splits = JSON.parse(localStorage.getItem('splitter-history')) || [];

// DOM Elements
const friendsListEl = document.getElementById('friends-list');
const friendNameInput = document.getElementById('friend-name');
const addFriendBtn = document.getElementById('add-friend-btn');
const payerSelect = document.getElementById('payer-select');
const splitParticipantsEl = document.getElementById('split-participants');
const expenseForm = document.getElementById('expense-split-form');
const balancesDisplay = document.getElementById('balances-display');
const splitsHistoryEl = document.getElementById('splits-history');
const clearDataBtn = document.getElementById('clear-data-btn');

// Initialize
function init() {
    renderFriends();
    renderHistory();
    calculateBalances();
    setupEventListeners();
}

function setupEventListeners() {
    addFriendBtn.addEventListener('click', addFriend);
    friendNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addFriend();
    });

    expenseForm.addEventListener('submit', handleSplit);

    clearDataBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all friends and split history?')) {
            friends = [];
            splits = [];
            saveData();
            renderFriends();
            renderHistory();
            calculateBalances();
        }
    });
}

// Friend Management
function addFriend() {
    const name = friendNameInput.value.trim();
    if (!name) return;
    if (name.toLowerCase() === 'you') {
        alert('You are already included by default!');
        return;
    }
    if (friends.includes(name)) {
        alert('Friend already added!');
        return;
    }

    friends.push(name);
    friendNameInput.value = '';
    saveData();
    renderFriends();
}

window.removeFriend = function(name) {
    friends = friends.filter(f => f !== name);
    saveData();
    renderFriends();
    calculateBalances();
};

function renderFriends() {
    // 1. Render tags
    friendsListEl.innerHTML = '';
    friends.forEach(f => {
        const tag = document.createElement('div');
        tag.className = 'friend-tag';
        tag.innerHTML = `
            <span>${f}</span>
            <i data-lucide="x" class="remove-friend" onclick="removeFriend('${f}')"></i>
        `;
        friendsListEl.appendChild(tag);
    });

    // 2. Update Payer Select
    const currentPayer = payerSelect.value;
    payerSelect.innerHTML = '<option value="">Select Payer</option><option value="You">You</option>';
    friends.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f;
        opt.textContent = f;
        payerSelect.appendChild(opt);
    });
    payerSelect.value = currentPayer;

    // 3. Update Checkboxes
    const checkedParticipants = Array.from(splitParticipantsEl.querySelectorAll('input:checked')).map(i => i.value);
    splitParticipantsEl.innerHTML = `
        <div class="participant-checkbox">
            <input type="checkbox" id="split-you" value="You" ${checkedParticipants.includes('You') || checkedParticipants.length === 0 ? 'checked' : ''}>
            <label for="split-you">You</label>
        </div>
    `;
    friends.forEach(f => {
        const div = document.createElement('div');
        div.className = 'participant-checkbox';
        div.innerHTML = `
            <input type="checkbox" id="split-${f}" value="${f}" ${checkedParticipants.includes(f) ? 'checked' : ''}>
            <label for="split-${f}">${f}</label>
        `;
        splitParticipantsEl.appendChild(div);
    });

    lucide.createIcons();
}

// Expense Splitting
function handleSplit(e) {
    e.preventDefault();

    const desc = document.getElementById('expense-desc').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const payer = payerSelect.value;
    const participants = Array.from(splitParticipantsEl.querySelectorAll('input:checked')).map(i => i.value);

    if (participants.length === 0) {
        alert('Please select at least one person to split with.');
        return;
    }

    const splitAmount = amount / participants.length;

    const newSplit = {
        id: Date.now(),
        desc,
        amount,
        payer,
        participants,
        splitAmount,
        date: new Date().toISOString()
    };

    splits.push(newSplit);
    saveData();
    expenseForm.reset();
    renderHistory();
    calculateBalances();
}

// Balance Calculation
function calculateBalances() {
    const netBalances = {}; // name -> balance (positive means they are owed, negative means they owe)

    // Reset balances for all known people
    ['You', ...friends].forEach(name => netBalances[name] = 0);

    splits.forEach(split => {
        // Payer is owed the total amount minus their own share
        const payer = split.payer;
        // Check if payer is still in our friends list (or is 'You')
        if (netBalances[payer] === undefined) return;

        split.participants.forEach(p => {
            if (netBalances[p] === undefined) return;
            
            if (p !== payer) {
                // Participant owes payer the splitAmount
                netBalances[p] -= split.splitAmount;
                netBalances[payer] += split.splitAmount;
            }
        });
    });

    renderBalances(netBalances);
}

function renderBalances(netBalances) {
    balancesDisplay.innerHTML = '';
    
    // We want to show "Who owes whom"
    // For simplicity, let's just show the net balance for everyone
    // A more advanced version would resolve debts between specific people.
    
    const names = Object.keys(netBalances).sort();
    let hasBalances = false;

    names.forEach(name => {
        const bal = netBalances[name];
        if (Math.abs(bal) < 0.01) return;

        hasBalances = true;
        const div = document.createElement('div');
        div.className = 'balance-item';
        
        if (bal > 0) {
            div.innerHTML = `
                <div class="balance-text"><strong>${name}</strong> is owed</div>
                <div class="balance-amount">LKR ${bal.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            `;
        } else {
            div.innerHTML = `
                <div class="balance-text"><strong>${name}</strong> owes</div>
                <div class="balance-amount negative">LKR ${Math.abs(bal).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            `;
        }
        balancesDisplay.appendChild(div);
    });

    if (!hasBalances) {
        balancesDisplay.innerHTML = '<p class="empty-message">All settled up! No one owes anything.</p>';
    }
}

function renderHistory() {
    splitsHistoryEl.innerHTML = '';
    if (splits.length === 0) {
        splitsHistoryEl.innerHTML = '<p class="empty-message">No recent splits.</p>';
        return;
    }

    [...splits].reverse().slice(0, 10).forEach(split => {
        const div = document.createElement('div');
        div.className = 'split-history-item';
        div.innerHTML = `
            <h4>${split.desc}</h4>
            <p><strong>LKR ${split.amount.toLocaleString()}</strong> paid by <strong>${split.payer}</strong></p>
            <p>Split between: ${split.participants.join(', ')}</p>
        `;
        splitsHistoryEl.appendChild(div);
    });
}

function saveData() {
    localStorage.setItem('splitter-friends', JSON.stringify(friends));
    localStorage.setItem('splitter-history', JSON.stringify(splits));
}

document.addEventListener('DOMContentLoaded', init);
