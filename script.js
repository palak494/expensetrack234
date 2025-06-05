let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let editIndex = -1;

// DOM elements
const categorySelect = document.getElementById('category-select');
const typeSelect = document.getElementById('type-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const recurringCheckbox = document.getElementById('recurring-checkbox');
const addBtn = document.getElementById('add-btn');
const expensesTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');
const darkModeBtn = document.getElementById('dark-mode-btn');

function saveToStorage() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function renderExpenses() {
  expensesTableBody.innerHTML = '';
  let totalAmount = 0;

  const selectedCategory = document.getElementById('filter-category').value.toLowerCase();
  const selectedType = document.getElementById('filter-type').value.toLowerCase();
  const fromDate = document.getElementById('from-date').value;
  const toDate = document.getElementById('to-date').value;
  const searchTerm = document.getElementById('search-input').value.toLowerCase();

  const filteredExpenses = expenses.filter(expense => {
    const expenseCategory = expense.category.toLowerCase();
    const expenseType = expense.type.toLowerCase();
    const expenseDate = expense.date;

    const matchCategory = !selectedCategory || selectedCategory === "all" || expenseCategory === selectedCategory;
    const matchType = !selectedType || selectedType === "all" || expenseType === selectedType;
    const matchDate = (!fromDate || expenseDate >= fromDate) && (!toDate || expenseDate <= toDate);

    const matchesSearch = Object.values(expense)
      .map(v => String(v).toLowerCase())
      .join(' ')
      .includes(searchTerm);

    return matchCategory && matchType && matchDate && matchesSearch;
  });

  filteredExpenses.forEach((expense, index) => {
    totalAmount += expense.type === "income" ? Number(expense.amount) : -Number(expense.amount);

    const newRow = expensesTableBody.insertRow();

    newRow.insertCell().textContent = expense.category;
    newRow.insertCell().textContent = expense.type;
    newRow.insertCell().textContent = expense.amount;
    newRow.insertCell().textContent = expense.date;
    newRow.insertCell().textContent = expense.recurring ? "Yes" : "No";

    const editCell = newRow.insertCell();
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-btn');
    editBtn.addEventListener('click', () => {
      categorySelect.value = expense.category;
      typeSelect.value = expense.type;
      amountInput.value = expense.amount;
      dateInput.value = expense.date;
      recurringCheckbox.checked = expense.recurring;

      editIndex = index;
      addBtn.textContent = 'Update';
    });
    editCell.appendChild(editBtn);

    const deleteCell = newRow.insertCell();
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => {
      expenses.splice(index, 1);
      saveToStorage();
      renderExpenses();
      resetForm();
    });
    deleteCell.appendChild(deleteBtn);
  });

  totalAmountCell.textContent = totalAmount.toFixed(2);
  saveToStorage();
}

function resetForm() {
  categorySelect.value = '';
  typeSelect.value = 'expense';
  amountInput.value = '';
  dateInput.value = '';
  recurringCheckbox.checked = false;
  editIndex = -1;
  addBtn.textContent = 'Add';
}

addBtn.addEventListener('click', () => {
  const category = categorySelect.value;
  const type = typeSelect.value.toLowerCase();
  const amount = Number(amountInput.value);
  const date = dateInput.value;
  const recurring = recurringCheckbox.checked;

  if (!category) {
    alert('Please select a category');
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }
  if (!date) {
    alert('Please select a date');
    return;
  }

  const newExpense = { category, type, amount, date, recurring };

  if (editIndex === -1) {
    expenses.push(newExpense);
  } else {
    expenses[editIndex] = newExpense;
  }

  renderExpenses();
  resetForm();
});

// Dark mode toggle
darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem("theme", isDark ? "dark" : "light");
  darkModeBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
});

// Set theme on page load
document.addEventListener("DOMContentLoaded", () => {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark");
    darkModeBtn.textContent = "Light Mode";
  } else {
    darkModeBtn.textContent = "Dark Mode";
  }

  renderExpenses(); 
});

// Filter event listeners
document.getElementById('search-input').addEventListener('input', renderExpenses);
document.getElementById('filter-category').addEventListener('change', renderExpenses);
document.getElementById('filter-type').addEventListener('change', renderExpenses);
document.getElementById('from-date').addEventListener('change', renderExpenses);
document.getElementById('to-date').addEventListener('change', renderExpenses);
