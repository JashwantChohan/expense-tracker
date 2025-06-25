document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalAmount = document.getElementById("total-amount");
    const filterCategory = document.getElementById("filter-category");

    let expenses = [];

    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();
    
        const name = document.getElementById('expense-name').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const category = document.getElementById('expense-category').value;
        const date = document.getElementById('expense-date').value;
    
        const editingId = expenseForm.getAttribute("data-editing-id");
    
        if (editingId) {
            // Update the existing expense
            const expense = expenses.find(expense => expense.id === parseInt(editingId));
            expense.name = name;
            expense.amount = amount;
            expense.category = category;
            expense.date = date;
    
            // Remove the editing attribute
            expenseForm.removeAttribute("data-editing-id");
        } else {
            // Add a new expense
            const expense = {
                id: Date.now(),
                name,
                amount,
                category,
                date
            };
            expenses.push(expense);
        }
    
        displayExpenses(expenses);
        updateTotalAmount();
    
        expenseForm.reset();
    });

    expenseList.addEventListener("click", (e) => {
        // Delete Button Functionality
        if (e.target.classList.contains("delete-btn")) {
            const id = parseInt(e.target.dataset.id);  // Get the ID from data-id
            expenses = expenses.filter(expense => expense.id !== id);  // Remove the expense with matching ID
            displayExpenses(expenses);  // Refresh the list
            updateTotalAmount();  // Update the total amount
        }

        // Edit Button Functionality
        if (e.target.classList.contains("edit-btn")) {
            const id = parseInt(e.target.dataset.id);

            console.log("Edit Button Clicked! ID: ", id);  // Debugging log for the ID
            console.log("Current Expenses: ", expenses);   // Debugging log for current expenses

            const expense = expenses.find(expense => expense.id === id);  // Find the expense with the matching ID

            if (!expense) {
                console.error("Expense not found!");
                return;
            }

            // Pre-fill the form with the selected expense for editing
            document.getElementById("expense-name").value = expense.name;
            document.getElementById("expense-amount").value = expense.amount;
            document.getElementById("expense-category").value = expense.category;
            document.getElementById("expense-date").value = expense.date;

            // Add a temporary attribute to the form to indicate editing mode
            expenseForm.setAttribute("data-editing-id", id);
        }

    });

    filterCategory.addEventListener("change", (e) => {
        const category = e.target.value;
        if (category === "All") {
            displayExpenses(expenses);
        } else {
            const filteredExpenses = expenses.filter(expense => expense.category === category);
            displayExpenses(filteredExpenses);
        }
    });

    function displayExpenses(expenses) {
        expenseList.innerHTML = "";  // Clear the list before displaying new rows
        expenses.forEach(expense => {
            const row = document.createElement("tr");

            row.innerHTML = `
            <td>${expense.name}</td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td>${expense.category}</td> 
            <td>${expense.date}</td>     
            <td>
                <button class="edit-btn" data-id="${expense.id}">Edit</button>     
                <button class="delete-btn" data-id="${expense.id}">Delete</button>     
            </td>   
            `;

            expenseList.appendChild(row);
        });
    }

    function updateTotalAmount() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.textContent = total.toFixed(2);
    }
});
