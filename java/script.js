"use strict";

const errorMesgEl = document.querySelector('.error_message');
const budgetInputEl = document.querySelector('.budget_input');
const expenseDescEl = document.querySelector('.expensess_input');
const expenseAmountEl = document.querySelector('.expensess_amount');
const tblRecordEl = document.querySelector('.tbl_data'); // Assuming tbl_data holds expense records
const budgetCardEl = document.querySelector('.budget_card');
const expensesCardEl = document.querySelector('.expenses_card'); // Corrected class name here
const balanceCardEl = document.querySelector('.balance_card');
let boxDollar = document.querySelector('#dollar-icon')

let itemList = [];
let itemId = 1;

function btnEvents() {
	const btnBudgetCal = document.querySelector('#btn_budget');
	const btnExpensesCal = document.querySelector('#btn_expenses');

	// Budget Event
	btnBudgetCal.addEventListener("click", (e) => {
		e.preventDefault();
		budgetFun();
	});

	// Expenses Event
	btnExpensesCal.addEventListener("click", (e) => {
		e.preventDefault();
		expensesFun();
	});
}

// Calling Button Events on DOM Load
document.addEventListener("DOMContentLoaded", btnEvents);

// Expenses Function
function expensesFun() {
	let expensesDescValue = expenseDescEl.value;
	let expenseAmountValue = expenseAmountEl.value;

	if (expensesDescValue === "" || expenseAmountValue === "" || expenseAmountValue <= 0) {
		errorMessage("Please Enter Expense Description or Amount (greater than 0)!");
	} else {
		let amount = parseInt(expenseAmountValue);
		expenseAmountEl.value = "";
		expenseDescEl.value = "";

		// Store the value inside an object
		let expense = {
			id: itemId,
			title: expensesDescValue,
			amount: amount,
		};
		itemId++;
		itemList.push(expense);

		// Add expense inside the HTML page
		addExpenses(expense);
		showBalance();
	}
}

// Add Expenses to the Budget Details Section
function addExpenses(expensePara) {
	const html = `<ul class="tbl_tr_content" data-id="${expensePara.id}">
					<li>${expensePara.id}</li>
					<li>${expensePara.title}</li>
					<li><span>CNY-</span>${expensePara.amount}</li>
					<li>
						<button type="button" class="btn_edit" onclick="editExpense(${expensePara.id})">Edit</button>
						<button type="button" class="btn_delete" onclick="deleteExpense(${expensePara.id})">Delete</button>
					</li>
				</ul>`;
	tblRecordEl.insertAdjacentHTML("beforeend", html);
}

// Budget Function
function budgetFun() {
	const budgetValue = budgetInputEl.value;
	if (budgetValue === "" || budgetValue <= 0) {
		errorMesgEl.innerHTML = "<p>Please Enter Budget Amount | More than 0</p>";
		errorMesgEl.classList.add("error");

		setTimeout(function () {
			errorMesgEl.innerHTML = "";
			errorMesgEl.classList.remove("error");
		}, 3000);
	} else {
		budgetCardEl.textContent  = parseInt(budgetValue) + parseInt(budgetCardEl.textContent); 
		budgetInputEl.value = "";
		showBalance();
	}
}

// Show Balance
function showBalance() {
	const expenses = totalExpenses();
	const total = parseInt(budgetCardEl.textContent) - expenses;
	if (total < 0){
		boxDollar.style.background = "red"

	}
	else {
		boxDollar.style.background =  " #bbf7d0	"
	}
	balanceCardEl.textContent = total;
	expensesCardEl.textContent = expenses; // Update expenses card with the total expenses
}

// Total Expenses Calculation
function totalExpenses() {
	return itemList.reduce((acc, curr) => acc + curr.amount, 0);
}

// Error Message Function
function errorMessage(msg) {
	errorMesgEl.innerHTML = `<p>${msg}</p>`;
	errorMesgEl.classList.add("error");
	setTimeout(() => {
		errorMesgEl.innerHTML = "";
		errorMesgEl.classList.remove("error");
	}, 3000);
}

// Edit Expense Function
function editExpense(id) {
	const expense = itemList.find(item => item.id === id);
	if (expense) {
		expenseDescEl.value = expense.title;
		expenseAmountEl.value = expense.amount;

		// Remove from the list to allow re-adding after editing
		deleteExpense(id);
	}
}

// Delete Expense Function
function deleteExpense(id) {
	itemList = itemList.filter(item => item.id !== id);
	const expenseEl = document.querySelector(`.tbl_tr_content[data-id="${id}"]`);
	if (expenseEl) {
		expenseEl.remove();
	}
	showBalance();
}
