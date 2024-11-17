"use strict";

// Global variables
let isEditing = false;
let editingId = null;
let editingSectionName = null;
const totalIncomeDisplay = document.querySelector('.total_income_card');

// Add separate ID counters for each section
const idCounters = {
    room: 1,
    catering: 1,
    entertainment: 1
};

// Store income data for each section
const incomeData = {
    room: [],
    catering: [],
    entertainment: []
};

// Configuration object for all income sections
const incomeSections = {
    room: {
        dateInput: '#date-for-room',
        roomInput: '#room-for-room',
        nameInput: '#name-for-room',
        billInput: '#bill-for-room',
        submitBtn: '#btn_submit',
        tableContainer: '.tbl_data[data-section="room"]',
        totalDisplay: '.incomes_card'
    },
    catering: {
        dateInput: '#dates-for-cat',
        roomInput: '#room-for-cat',
        nameInput: '#name-for-cat',
        billInput: '#bill-for-cat',
        submitBtn: '#btn_submit1',
        tableContainer: '.tbl_data[data-section="catering"]',
        totalDisplay: '.expenses_card'
    },
    entertainment: {
        dateInput: '#date-for-dog',
        roomInput: '#room-for-dog',
        nameInput: '#name-for-dog',
        billInput: '#bill-for-dog',
        submitBtn: '#btn_submit2',
        tableContainer: '.tbl_data[data-section="entertainment"]',
        totalDisplay: '.balance_card'
    }
};

// Initialize income section
function initializeIncomeSection(sectionName, config) {
    const dateEl = document.querySelector(config.dateInput);
    const roomEl = document.querySelector(config.roomInput);
    const nameEl = document.querySelector(config.nameInput);
    const billEl = document.querySelector(config.billInput);
    const submitBtn = document.querySelector(config.submitBtn);
    const totalDisplay = document.querySelector(config.totalDisplay);

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addIncome(sectionName, {
            dateEl,
            roomEl,
            nameEl,
            billEl,
            totalDisplay
        });
    });
}

// Add income entry
function addIncome(sectionName, elements) {
    const { dateEl, roomEl, nameEl, billEl, totalDisplay } = elements;
    const submitBtn = document.querySelector(incomeSections[sectionName].submitBtn);

    if (!dateEl.value || !roomEl.value || !nameEl.value || !billEl.value || billEl.value <= 0) {
        errorMessage("Please fill all fields with valid values!");
        return;
    }

    if (isEditing) {
        // Update existing entry
        const itemIndex = incomeData[sectionName].findIndex(item => item.id === editingId);
        if (itemIndex !== -1) {
            incomeData[sectionName][itemIndex] = {
                ...incomeData[sectionName][itemIndex],
                date: dateEl.value,
                room: roomEl.value,
                name: nameEl.value,
                amount: parseInt(billEl.value)
            };

            const itemElement = document.querySelector(`.tbl_data[data-section="${sectionName}"] .tbl_tr_content[data-id="${editingId}"]`);
            if (itemElement) {
                const listItems = itemElement.getElementsByTagName('li');
                listItems[1].textContent = dateEl.value;
                listItems[2].textContent = roomEl.value;
                listItems[3].textContent = nameEl.value;
                listItems[4].innerHTML = `<span>CNY-</span>${billEl.value}`;
            }
        }

        isEditing = false;
        editingId = null;
        editingSectionName = null;
        submitBtn.textContent = 'Submit';
    } else {
        // Add new entry
        const newIncome = {
            id: idCounters[sectionName]++,
            sectionName: sectionName,
            date: dateEl.value,
            room: roomEl.value,
            name: nameEl.value,
            amount: parseInt(billEl.value)
        };

        incomeData[sectionName].push(newIncome);
        addIncomeToTable(newIncome, sectionName);
    }

    [dateEl, roomEl, nameEl, billEl].forEach(el => el.value = '');
    updateBalance(sectionName, totalDisplay);
}

// Add income to table
function addIncomeToTable(income, sectionName) {
    const targetContainer = document.querySelector(`.tbl_data[data-section="${sectionName}"]`);
    const html = `
        <ul class="tbl_tr_content" 
            data-id="${income.id}" 
            data-section="${sectionName}"
            data-date="${income.date}"
            data-room="${income.room}"
            data-name="${income.name}"
            data-amount="${income.amount}">
            <li>${income.id}</li>
            <li>${income.date}</li>
            <li>${income.room}</li>
            <li>${income.name}</li>
            <li><span>CNY-</span>${income.amount}</li>
            <li>
                <button type="button" class="btn_edit" onclick="editIncome('${sectionName}', ${income.id})">Edit</button>
                <button type="button" class="btn_delete" onclick="deleteIncome('${sectionName}', ${income.id})">Delete</button>
            </li>
        </ul>`;
    
    targetContainer.insertAdjacentHTML("afterbegin", html);
}

// Delete income entry
function deleteIncome(sectionName, id) {
    id = parseInt(id);
    incomeData[sectionName] = incomeData[sectionName].filter(item => item.id !== id);
    const itemToDelete = document.querySelector(`.tbl_data[data-section="${sectionName}"] .tbl_tr_content[data-id="${id}"]`);
    if (itemToDelete) itemToDelete.remove();
    const totalDisplay = document.querySelector(incomeSections[sectionName].totalDisplay);
    updateBalance(sectionName, totalDisplay);
}

// Update balance display
function updateBalance(sectionName, displayElement) {
    const total = incomeData[sectionName].reduce((sum, item) => sum + item.amount, 0);
    displayElement.textContent = total;
    updateTotalIncome();
}

// Update total income with tax and net balance
function updateTotalIncome() {
    const roomTotal = incomeData.room.reduce((sum, item) => sum + item.amount, 0);
    const cateringTotal = incomeData.catering.reduce((sum, item) => sum + item.amount, 0);
    const entertainmentTotal = incomeData.entertainment.reduce((sum, item) => sum + item.amount, 0);

    const grossTotal = roomTotal + cateringTotal + entertainmentTotal;

    // Calculate 5% tax
    const tax = grossTotal * 0.05;

    // Calculate net balance
    const netBalance = grossTotal - tax;

    totalIncomeDisplay.textContent = grossTotal.toFixed(2);
    document.querySelector('.total_tax_card').textContent = tax.toFixed(2);
    document.querySelector('.net_income_card').textContent = netBalance.toFixed(2);
}

// Error message handler
function errorMessage(msg) {
    alert(msg);
}

// Edit income
function editIncome(sectionName, id) {
    const item = document.querySelector(`.tbl_data[data-section="${sectionName}"] .tbl_tr_content[data-id="${id}"]`);
    if (!item) return;

    isEditing = true;
    editingId = id;
    editingSectionName = sectionName;

    const config = incomeSections[sectionName];
    const dateEl = document.querySelector(config.dateInput);
    const roomEl = document.querySelector(config.roomInput);
    const nameEl = document.querySelector(config.nameInput);
    const billEl = document.querySelector(config.billInput);
    const submitBtn = document.querySelector(config.submitBtn);

    dateEl.value = item.dataset.date;
    roomEl.value = item.dataset.room;
    nameEl.value = item.dataset.name;
    billEl.value = item.dataset.amount;

    submitBtn.textContent = 'Update';
}

// Initialize all sections when DOM loads
document.addEventListener("DOMContentLoaded", () => {
    Object.entries(incomeSections).forEach(([sectionName, config]) => {
        initializeIncomeSection(sectionName, config);
    });
});
