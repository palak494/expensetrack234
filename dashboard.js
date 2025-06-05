const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const totalIncomeEl = document.getElementById("total-income");
const totalExpensesEl = document.getElementById("total-expenses");
const balanceEl = document.getElementById("balance");
const recentTransactionsList = document.getElementById("recent-transactions-list");
const categoryChartEl = document.getElementById("categoryChart").getContext("2d");

let totalIncome = 0;
let totalExpenses = 0;

expenses.forEach(exp => {
  const amount = Number(exp.amount);
  if (exp.type.toLowerCase() === "income") {
    totalIncome += amount;
  } else if (exp.type.toLowerCase() === "expense") {
    totalExpenses += amount;
  }
});

const balance = totalIncome - totalExpenses;

totalIncomeEl.textContent = `${totalIncome.toFixed(2)}`;
totalExpensesEl.textContent = `${totalExpenses.toFixed(2)}`;
balanceEl.textContent = `${balance.toFixed(2)}`;

const sortedExpenses = expenses.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
recentTransactionsList.innerHTML = ""; // clear old entries

sortedExpenses.slice(0, 5).forEach(exp => {
  const li = document.createElement("li");
  li.textContent = `${exp.date} - ${exp.category} - ₹${Number(exp.amount).toFixed(2)} (${exp.type})`;
  recentTransactionsList.appendChild(li);
});

const categoryTotals = {};

expenses.forEach(exp => {
  if (exp.type.toLowerCase() === "expense") {
    const amount = Number(exp.amount);
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + amount;
  }
});

const categoryLabels = Object.keys(categoryTotals);
const categoryData = Object.values(categoryTotals);
const backgroundColors = [
  "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
];

new Chart(categoryChartEl, {
  type: "doughnut",
  data: {
    labels: categoryLabels,
    datasets: [{
      label: "Amount",
      data: categoryData,
      backgroundColor: backgroundColors.slice(0, categoryLabels.length),
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }
});
