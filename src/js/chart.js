export function displayChart(customerId, transactions) {
    const customerTransactions = transactions.filter(transaction => transaction.customer_id == customerId);
    console.log('Customer Transactions:', customerTransactions);

    const dailyTransactionAmounts = customerTransactions.reduce((acc, transaction) => {
        const date = transaction.date;
        const amount = transaction.amount;

        if (acc[date]) {
            acc[date] += amount;
        } else {
            acc[date] = amount;
        }

        return acc;
    }, {});

    console.log('Daily Transaction Amounts:', dailyTransactionAmounts);

    const dates = Object.keys(dailyTransactionAmounts);
    const totalAmounts = Object.values(dailyTransactionAmounts);

    console.log('Dates:', dates);
    console.log('Total Amounts:', totalAmounts);

    const ctx = document.getElementById('myChart').getContext('2d');

    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: `Total Transaction Amount per Day for Customer ${customerId}`,
                data: totalAmounts,
                borderColor: '#15F5BA',
                backgroundColor: 'rgba(30, 58, 138, 0.2)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#3E54AC'
                    }
                },
                x: {
                    ticks: {
                        color: '#3E54AC'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#3E54AC'
                    }
                },
                title: {
                    display: true,
                    text: 'Transaction Amounts Over Time',
                    color: '#3E54AC',
                    font: {
                        size: 18
                    }
                },
                tooltip: {
                    bodyColor: '#3E54AC'
                }
            }
        }
    });
}
