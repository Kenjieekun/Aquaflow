import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// ========================================
// Elements
// ========================================

const ordersContainer = document.getElementById("ordersContainer");

// ========================================
// Authentication
// ========================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "/login/";
        return;

    }

    loadOrders(user.uid);

});

// ========================================
// Load Orders
// ========================================

function loadOrders(userId) {

    const ordersQuery = query(

        collection(db, "orders"),

        where("userId", "==", userId),

        orderBy("createdAt", "desc")

    );

    onSnapshot(

        ordersQuery,

        (snapshot) => {

            ordersContainer.innerHTML = "";

            ordersContainer.className = "";

            if (snapshot.empty) {

                ordersContainer.innerHTML = `

                    <div class="glass empty-orders">

                        <h3>No Orders Yet</h3>

                        <p>You haven't placed any orders.</p>

                    </div>

                `;

                return;

            }

            ordersContainer.classList.add("orders-list");

            let html = "";

            snapshot.forEach((docSnap) => {

                const order = docSnap.data();

                let statusClass = "pending";

                switch (order.status) {

                    case "Processing":
                        statusClass = "processing";
                        break;

                    case "Delivered":
                        statusClass = "delivered";
                        break;

                    case "Cancelled":
                        statusClass = "cancelled";
                        break;

                }

                html += `

                    <div class="order-card">

                        <div class="order-header">

                            <h3 class="order-title">

                                ${order.productName}

                            </h3>

                            <span class="status ${statusClass}">

                                ${order.status}

                            </span>

                        </div>

                        <div class="order-details">

                            <p><strong>Quantity:</strong> ${order.quantity}</p>

                            <p><strong>Total:</strong> ₱${Number(order.total).toLocaleString()}</p>

                            <p><strong>Delivery Date:</strong> ${order.deliveryDate}</p>

                            <p><strong>Payment:</strong> ${order.paymentMethod}</p>

                            <p><strong>Address:</strong> ${order.deliveryAddress}</p>

                        </div>

                        ${

                            order.status === "Pending"

                            ? `

                                <button
                                    class="cancel-order-btn"
                                    data-id="${docSnap.id}">

                                    Cancel Order

                                </button>

                            `

                            : ""

                        }

                    </div>

                `;

            });

            ordersContainer.innerHTML = html;

        },

        (error) => {

            console.error("Error loading orders:", error);

        }

    );

}

        (error) => {

            console.error("Error loading orders:", error);

        }


// ========================================
// Cancel Order
// ========================================

document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("cancel-order-btn")) return;

    const confirmCancel = confirm(

        "Are you sure you want to cancel this order?"

    );

    if (!confirmCancel) return;

    try {

        await updateDoc(

            doc(db, "orders", e.target.dataset.id),

            {

                status: "Cancelled"

            }

        );

        alert("Order cancelled successfully.");

    }

    catch (error) {

        console.error("Error cancelling order:", error);

        alert("Unable to cancel order.");

    }

});