"use strict";

const dateDescEl = document.querySelector('.dates_input');
const roomDescEl = document.querySelector('.rooms_input');
const nameDescEl = document.querySelector('.names_input');
const incomesCardEl = document.querySelector('.incomes_card');
const billDescEl = document.querySelector('.bill_input');

let itemList = [];
let itemId = 1;

function btnEvents() {
    const btnincomesCal = document.querySelector('#btn_submit');


    btnincomesCal.addEventListener("click", (e) => {
        e.preventDefault();
        incomesFun();
    });


}

// Calling Button Events on DOM Load
document.addEventListener("DOMContentLoaded", btnEvents);

// Incomes Function
function incomesFun() {
    let dateDescValue = dateDescEl.value;
    let roomDescValue = roomDescEl.value;
    let nameDescValue = nameDescEl.value;
    let billAmountValue = billDescEl.value;

    if (dateDescValue === "" || roomDescValue === "" || nameDescValue === "" || 
        billAmountValue === "" || billAmountValue <= 0) {
        errorMessage("Please Enter Bill Description or Amount (greater than 0)!");
    } else {
        let amount = parseInt(billAmountValue);
        billDescEl.value = "";
        nameDescEl.value = "";
        roomDescEl.value = "";
        dateDescEl.value = "";

        let income = {
            id: itemId,
            date: dateDescValue,
            room: roomDescValue,
            name: nameDescValue,
            amount: amount,
        };
        itemId++;
        itemList.push(income);

        // Add income inside the HTML page
        addIncomes(income);
        showBalance();
    }
}

// Add Incomes to the Budget Details Section
function addIncomes(incomePara) {
    const html = `<ul class="tbl_tr_content" data-id="${incomePara.id}">
                    <li>${incomePara.id}</li>
                    <li>${incomePara.date}</li>
                    <li>${incomePara.room}</li>
                    <li>${incomePara.name}</li>
                    <li><span>CNY-</span>${incomePara.amount}</li>
                    <li>
                        <button type="button" class="btn_edit" onclick="editIncome(${incomePara.id})">Edit</button>
                        <button type="button" class="btn_delete" onclick="deleteIncome(${incomePara.id})">Delete</button>
                    </li>
                  </ul>`;
    document.querySelector('.tbl_data').insertAdjacentHTML("beforeend", html);
}

// Show Balance
function showBalance() {
    const incomes = totalIncomes();
    incomesCardEl.textContent = incomes; // Update incomes card with the total income
}

// Total Incomes Calculation
function totalIncomes() {
    return itemList.reduce((acc, curr) => acc + curr.amount, 0);
}

// Edit Income Function
function editIncome(id) {
    const income = itemList.find(item => item.id == id);
    if (income) {
        dateDescEl.value = income.date;
        roomDescEl.value = income.room;
        nameDescEl.value = income.name;
        billDescEl.value = income.amount;

        // Remove from the list to allow re-adding after editing
        deleteIncome(id);
    }
}

// Delete Income Function
function deleteIncome(id) {
    itemList = itemList.filter(item => item.id !== id);
    const incomeEl = document.querySelector(`.tbl_tr_content[data-id="${id}"]`);
    if (incomeEl) {
        incomeEl.remove();
    }
    showBalance();
}

// Error message function (you can define this as per your UI needs)
function errorMessage(msg) {
    alert(msg); // You can replace this with a better UI error handling
}
