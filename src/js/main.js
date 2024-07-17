import { displayChart } from './chart.js';

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('table-body');
    let customers = [];
    let transactions = [];

    const refreshTable = (customers, transactions) => {
        const filterName = document.getElementById('filter-name').value.trim().toLowerCase();
        const filterAmount = parseFloat(document.getElementById('filter-amount').value.trim());
        tableBody.innerHTML = '';

        customers.forEach(customer => {
            const customerTransactions = transactions.filter(transaction => transaction.customer_id == customer.id);

            if (!customerTransactions.length) {
                console.log('No transactions found for customer:', customer);
                return;
            }

            const transactionAmounts = customerTransactions.map(transaction => transaction.amount);
            const totalTransactionAmount = transactionAmounts.reduce((total, amount) => total + amount, 0);

            if (filterName && !customer.name.toLowerCase().includes(filterName)) {
                return;
            }

            if (!isNaN(filterAmount) && !transactionAmounts.includes(filterAmount)) {
                return;
            }

            const row = document.createElement('tr');
            row.classList.add('odd:bg-main', 'even:bg-odd', 'group', 'hover:cursor-pointer', 'border-border');

            const customerIdCell = document.createElement('td');
            customerIdCell.classList.add('p-3', 'text-sm', 'whitespace-nowrap', 'group-hover:text-lg', 'text-header', 'group-hover:text-textHover', 'font-bold');
            customerIdCell.textContent = customer.id;
            row.appendChild(customerIdCell);

            const nameCell = document.createElement('td');
            nameCell.classList.add('p-3', 'text-sm', 'whitespace-nowrap', 'font-semibold', 'group-hover:text-textHover', 'group-hover:text-lg');
            nameCell.innerHTML = `<i class="fa-solid fa-user pr-2"></i>${customer.name}`;
            row.appendChild(nameCell);

            const transactionIdsCell = document.createElement('td');
            transactionIdsCell.classList.add('p-3', 'text-sm', 'whitespace-nowrap', 'font-semibold', 'group-hover:text-textHover', 'group-hover:text-lg');
            transactionIdsCell.innerHTML = `<ul class="list-none">${customerTransactions.map(transaction => `<li>${transaction.id}</li>`).join('')}</ul>`;
            row.appendChild(transactionIdsCell);

            const transactionDatesCell = document.createElement('td');
            transactionDatesCell.classList.add('p-3', 'text-sm', 'whitespace-nowrap', 'font-semibold', 'group-hover:text-textHover', 'group-hover:text-lg');
            transactionDatesCell.innerHTML = `<ul class="list-none">${customerTransactions.map(transaction => `<li><i class="fa-solid fa-calendar-days pr-2"></i>${transaction.date}</li>`).join('')}</ul>`;
            row.appendChild(transactionDatesCell);

            const transactionAmountsCell = document.createElement('td');
            transactionAmountsCell.classList.add('p-3', 'text-sm', 'whitespace-nowrap', 'font-semibold', 'group-hover:text-textHover', 'group-hover:text-lg');
            transactionAmountsCell.innerHTML = `<ul class="list-none"> ${transactionAmounts.map(amount => `<li><i class="fa-solid fa-sack-dollar pr-2 text-icon text-money"></i> ${amount} </li> `).join('')}</ul>`;
            row.appendChild(transactionAmountsCell);

            const totalTransactionAmountCell = document.createElement('td');
            totalTransactionAmountCell.classList.add('p-3', 'text-sm', 'whitespace-nowrap', 'font-semibold', 'group-hover:text-textHover', 'group-hover:text-lg');
            totalTransactionAmountCell.textContent = totalTransactionAmount;
            row.appendChild(totalTransactionAmountCell);

            row.addEventListener('click', () => {
                displayChart(customer.id, transactions);
                $('.chart').removeClass('hidden');
                $('html, body').animate({
                    scrollTop: $('#chart-container').offset().top
                }, 500);
                $('.scroll-top').removeClass('hidden');
            });

            tableBody.appendChild(row);
        });
    };

    // Fetch data and initialize table
    $('.loading-layer').removeClass('hidden').addClass('flex');

    Promise.all([
        fetch('http://localhost:3000/customers'),
        fetch('http://localhost:3000/transactions')
    ])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(data => {
        customers = data[0];
        transactions = data[1];

        console.log('Fetched Customers:', customers);
        console.log('Fetched Transactions:', transactions);

        refreshTable(customers, transactions);

        // Hide loading layer after 1 second
        setTimeout(() => {
            $('.loading-layer').addClass('hidden').removeClass('flex');
        }, 1000);

        // Filter handling
        const filterHandler = () => refreshTable(customers, transactions);
        document.getElementById('filter-name').addEventListener('input', filterHandler);
        document.getElementById('filter-amount').addEventListener('input', filterHandler);
    })
    .catch(error => console.error('Error fetching data:', error));

    // Scroll-to-top button functionality
    $('.scroll-top').on('click', () => {
        $('html, body').animate({ scrollTop: 0 }, 500, () => {
            $('.scroll-top').addClass('hidden');
        });
    });

    $(window).on('scroll', () => {
        if ($(window).scrollTop() > 100) {
            $(".scroll-top").removeClass('hidden');
        } else {
            $(".scroll-top").addClass('hidden');
        }
    });
});
