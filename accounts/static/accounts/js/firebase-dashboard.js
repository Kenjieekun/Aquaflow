import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    collection,
    query,
    where,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

onAuthStateChanged(auth, (user) => {

    if (!user) {

        console.log("No authenticated user.");
        return;

    }

    loadDashboardStats(user.uid);
    loadRecentOrders(user.uid);

});

// ========================================
// Dashboard Statistics (Realtime)
// ========================================

function loadDashboardStats(userId) {

    const totalOrders = document.getElementById("totalOrders");
    const pendingOrders = document.getElementById("pendingOrders");
    const deliveredOrders = document.getElementById("deliveredOrders");
    const totalSpent = document.getElementById("totalSpent");

    if (
        !totalOrders ||
        !pendingOrders ||
        !deliveredOrders ||
        !totalSpent
    ) {
        return;
    }

    const ordersQuery = query(
        collection(db, "orders"),
        where("userId", "==", userId)
    );

    onSnapshot(ordersQuery, (snapshot) => {

        let total = 0;
        let pending = 0;
        let delivered = 0;
        let spent = 0;

        snapshot.forEach((doc) => {

            const order = doc.data();

            total++;

            spent += Number(order.total) || 0;

            switch (order.status) {

                case "Pending":
                    pending++;
                    break;

                case "Delivered":
                    delivered++;
                    break;

            }

        });

        totalOrders.textContent = total;
        pendingOrders.textContent = pending;
        deliveredOrders.textContent = delivered;
        totalSpent.textContent = `₱${spent.toLocaleString()}`;

    }, (error) => {

        console.error("Dashboard Error:", error);

    });

}

// ========================================
// Recent Orders (Realtime)
// ========================================

function loadRecentOrders(userId) {

    const recentOrdersTable =
        document.getElementById("recentOrdersTable");

    if (!recentOrdersTable) return;

    const ordersQuery = query(
        collection(db, "orders"),
        where("userId", "==", userId)
    );

    onSnapshot(ordersQuery, (snapshot) => {

        recentOrdersTable.innerHTML = "";

        const recentOrders = snapshot.docs
            .sort((a, b) => {

                const aTime = a.data().createdAt?.seconds || 0;
                const bTime = b.data().createdAt?.seconds || 0;

                return bTime - aTime;

            })
            .slice(0, 5);

        if (recentOrders.length === 0) {

            recentOrdersTable.innerHTML = `

                <tr>

                    <td colspan="4">

                        No Orders Yet

                    </td>

                </tr>

            `;

            return;

        }

        recentOrders.forEach((doc) => {

            const order = doc.data();

            recentOrdersTable.innerHTML += `

                <tr>

                    <td>${doc.id.substring(0, 8)}</td>

                    <td>${order.productName}</td>

                    <td>

                        <span class="status ${order.status.toLowerCase()}">

                            ${order.status}

                        </span>

                    </td>

                    <td>

                        ₱${Number(order.total).toLocaleString()}

                    </td>

                </tr>

            `;

        });

    }, (error) => {

        console.error("Recent Orders Error:", error);

    });

}