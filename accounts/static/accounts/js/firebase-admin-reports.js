import { db } from "./firebase-config.js";

import {
    collection,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// ========================================
// DOM ELEMENTS
// ========================================

const totalRevenue = document.getElementById("totalRevenue");
const totalOrders = document.getElementById("totalOrders");
const totalCustomers = document.getElementById("totalCustomers");
const productsSold = document.getElementById("productsSold");

const bestSellingTable = document.getElementById("bestSellingTable");
const recentSalesTable = document.getElementById("recentSalesTable");

const chartContext =
    document.getElementById("salesChart").getContext("2d");

let salesChart;

// ========================================
// LOAD REPORTS
// ========================================

onSnapshot(collection(db, "orders"), (orderSnapshot) => {

    onSnapshot(collection(db, "users"), (userSnapshot) => {

        generateReports(
            orderSnapshot.docs,
            userSnapshot.docs
        );

    });

});

// ========================================
// GENERATE REPORTS
// ========================================

function generateReports(orderDocs, userDocs) {

    let revenue = 0;
    let orders = 0;
    let sold = 0;

    const monthlyRevenue = {};
    const productSales = {};

    bestSellingTable.innerHTML = "";
    recentSalesTable.innerHTML = "";

    orderDocs.forEach((docSnap) => {

        const order = docSnap.data();

        if (order.isArchived) return;

        orders++;

        if (order.status === "Delivered") {

            revenue += Number(order.total);
            sold += Number(order.quantity);

            if (order.createdAt?.seconds) {

                const month = new Date(
                    order.createdAt.seconds * 1000
                ).toLocaleString("default", {
                    month: "short"
                });

                monthlyRevenue[month] =
                    (monthlyRevenue[month] || 0) +
                    Number(order.total);

            }

        }

        productSales[order.productName] =
            (productSales[order.productName] || 0) +
            Number(order.quantity);

        recentSalesTable.innerHTML += `

            <tr>

                <td>${order.customerName}</td>

                <td>${order.productName}</td>

                <td>₱${Number(order.total).toLocaleString()}</td>

                <td>

                    <span class="status ${statusClass(order.status)}">

                        ${order.status}

                    </span>

                </td>

            </tr>

        `;

    });

    // ========================================
    // SUMMARY
    // ========================================

    totalRevenue.textContent = `₱${revenue.toLocaleString()}`;
    totalOrders.textContent = orders;

    totalCustomers.textContent =
        userDocs.filter(
            user => user.data().role === "customer"
        ).length;

    productsSold.textContent = sold;

    // ========================================
    // BEST SELLING PRODUCTS
    // ========================================

    Object.entries(productSales)

        .sort((a, b) => b[1] - a[1])

        .slice(0, 5)

        .forEach(([name, quantity]) => {

            bestSellingTable.innerHTML += `

                <tr>

                    <td>${name}</td>

                    <td>${quantity}</td>

                </tr>

            `;

        });

    renderChart(monthlyRevenue);

}

// ========================================
// SALES CHART
// ========================================

function renderChart(monthlyRevenue) {

    if (salesChart) {

        salesChart.destroy();

    }

    const labels = Object.keys(monthlyRevenue);

    const revenue = Object.values(monthlyRevenue);

    const cumulativeRevenue = [];

    revenue.reduce((sum, value) => {

        sum += value;

        cumulativeRevenue.push(sum);

        return sum;

    }, 0);

    salesChart = new Chart(chartContext, {

        data: {

            labels,

            datasets: [

                {

                    type: "bar",

                    label: "Monthly Revenue",

                    data: revenue,

                    backgroundColor: "rgba(59,130,246,.55)",

                    borderColor: "#3b82f6",

                    borderRadius: 8,

                    maxBarThickness: 45

                },

                {

                    type: "line",

                    label: "Cumulative Revenue",

                    data: cumulativeRevenue,

                    borderColor: "#facc15",

                    backgroundColor: "#facc15",

                    borderWidth: 3,

                    fill: false,

                    tension: .35,

                    pointRadius: 5,

                    pointHoverRadius: 7,

                    pointBackgroundColor: "#facc15",

                    pointBorderColor: "#fff",

                    pointBorderWidth: 2

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            interaction: {

                mode: "index",

                intersect: false

            },

            plugins: {

                legend: {

                    position: "bottom",

                    labels: {

                        color: "#d1d5db",

                        usePointStyle: true

                    }

                }

            },

            scales: {

                x: {

                    grid: {

                        display: false

                    },

                    ticks: {

                        color: "#d1d5db"

                    }

                },

                y: {

                    beginAtZero: true,

                    ticks: {

                        color: "#d1d5db",

                        callback(value) {

                            return "₱" + value.toLocaleString();

                        }

                    },

                    grid: {

                        color: "rgba(255,255,255,.08)"

                    }

                }

            }

        }

    });

}

// ========================================
// STATUS CLASS
// ========================================

function statusClass(status) {

    switch (status) {

        case "Pending":
            return "pending";

        case "Processing":
            return "processing";

        case "Out for Delivery":
            return "delivery";

        case "Delivered":
            return "delivered";

        case "Cancelled":
            return "cancelled";

        default:
            return "";

    }

}