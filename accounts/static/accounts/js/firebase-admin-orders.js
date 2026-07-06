import { db } from "./firebase-config.js";

import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// ========================================
// DOM ELEMENTS
// ========================================

const ordersTable = document.getElementById("ordersTable");

// ========================================
// LOAD ORDERS
// ========================================

const ordersQuery = query(

    collection(db, "orders"),

    where("isArchived", "==", false)

);

onSnapshot(ordersQuery, (snapshot) => {

    ordersTable.innerHTML = "";

    if (snapshot.empty) {

        ordersTable.innerHTML = `

            <div class="admin-order">

                <h3>No orders found.</h3>

            </div>

        `;

        return;

    }

    snapshot.forEach((docSnap) => {

        const order = docSnap.data();

        ordersTable.innerHTML += `

            <div class="admin-order">

                <div class="admin-header">

                    <h3>${order.productName}</h3>

                    <strong>

                        ₱${Number(order.total).toLocaleString()}

                    </strong>

                </div>

                <div class="admin-details">

                    <p><strong>Customer:</strong> ${order.customerName || "Unknown"}</p>

                    <p><strong>Email:</strong> ${order.customerEmail || "-"}</p>

                    <p><strong>Phone:</strong> ${order.customerPhone || "-"}</p>

                    <p><strong>Address:</strong> ${order.customerAddress || "-"}</p>

                    <p><strong>Quantity:</strong> ${order.quantity}</p>

                    <p><strong>Payment:</strong> ${order.paymentMethod}</p>

                    <p><strong>Delivery Date:</strong> ${order.deliveryDate}</p>

                    <p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>

                </div>

                <div class="admin-actions">

                    <select
                        id="status-${docSnap.id}"
                        class="status-select">

                        <option value="Pending" ${order.status === "Pending" ? "selected" : ""}>Pending</option>

                        <option value="Processing" ${order.status === "Processing" ? "selected" : ""}>Processing</option>

                        <option value="Out for Delivery" ${order.status === "Out for Delivery" ? "selected" : ""}>Out for Delivery</option>

                        <option value="Delivered" ${order.status === "Delivered" ? "selected" : ""}>Delivered</option>

                        <option value="Cancelled" ${order.status === "Cancelled" ? "selected" : ""}>Cancelled</option>

                    </select>

                    <button
                        class="confirm-status-btn"
                        data-id="${docSnap.id}">

                        Confirm

                    </button>

                    <button
                        class="archive-order-btn"
                        data-id="${docSnap.id}"
                        data-status="${order.status}">

                        Archive

                    </button>

                </div>

            </div>

        `;

    });

});

// ========================================
// BUTTON EVENTS
// ========================================

document.addEventListener("click", async (event) => {

    // ==========================
    // UPDATE STATUS
    // ==========================

    const confirmBtn = event.target.closest(".confirm-status-btn");

    if (confirmBtn) {

        const orderId = confirmBtn.dataset.id;

        const statusSelect = document.getElementById(`status-${orderId}`);

        if (!statusSelect) return;

        const newStatus = statusSelect.value;

        if (!confirm(`Change order status to "${newStatus}"?`)) return;

        try {

            await updateDoc(

                doc(db, "orders", orderId),

                {

                    status: newStatus

                }

            );

            alert("Order status updated successfully.");

        }

        catch (error) {

            console.error(error);

            alert("Unable to update order status.");

        }

        return;

    }

    // ==========================
    // ARCHIVE ORDER
    // ==========================

    const archiveBtn = event.target.closest(".archive-order-btn");

    if (!archiveBtn) return;

    const orderId = archiveBtn.dataset.id;

    const status = archiveBtn.dataset.status;

    if (status === "Pending" || status === "Processing") {

        alert("Pending or Processing orders cannot be archived.");

        return;

    }

    if (!confirm("Archive this order?")) return;

    try {

        await updateDoc(

            doc(db, "orders", orderId),

            {

                isArchived: true

            }

        );

        alert("Order archived successfully.");

    }

    catch (error) {

        console.error(error);

        alert("Unable to archive order.");

    }

});