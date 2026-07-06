import { db } from "./firebase-config.js";

import {
    collection,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// ========================================
// Dashboard Elements
// ========================================

const totalCustomers = document.getElementById("totalCustomers");
const totalOrders = document.getElementById("totalOrders");
const pendingOrders = document.getElementById("pendingOrders");
const deliveredOrders = document.getElementById("deliveredOrders");
const processingOrders = document.getElementById("processingOrders");
const totalSales = document.getElementById("totalSales");
const lowStockProducts = document.getElementById("lowStockProducts");
const outOfStockProducts = document.getElementById("outOfStockProducts");

// ========================================
// Customers
// ========================================

onSnapshot(collection(db, "users"), (snapshot) => {

    totalCustomers.textContent = snapshot.size;

});

// ========================================
// Orders
// ========================================

onSnapshot(collection(db, "orders"), (snapshot) => {

    totalOrders.textContent = snapshot.size;

    let pending = 0;
    let delivered = 0;
    let processing = 0;
    let sales = 0;

    snapshot.forEach((docSnap) => {

        const order = docSnap.data();

        switch (order.status) {

            case "Pending":
                pending++;
                break;

            case "Processing":
                processing++;
                break;

            case "Delivered":
                delivered++;
                sales += Number(order.total || 0);
                break;

        }

    });

    pendingOrders.textContent = pending;
    deliveredOrders.textContent = delivered;
    processingOrders.textContent = processing;

    totalSales.textContent = "₱" + sales.toLocaleString();

});

// ========================================
// Products
// ========================================

onSnapshot(collection(db, "products"), (snapshot) => {

    let lowStock = 0;
    let outOfStock = 0;

    snapshot.forEach((docSnap) => {

        const product = docSnap.data();

        const stock = Number(product.stock || 0);

        if (stock === 0) {

            outOfStock++;

        }
        else if (stock <= 10) {

            lowStock++;

        }

    });

    lowStockProducts.textContent = lowStock;
    outOfStockProducts.textContent = outOfStock;

});