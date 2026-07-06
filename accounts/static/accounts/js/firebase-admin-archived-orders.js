import { db } from "./firebase-config.js";
import { logAudit } from "./firebase-audit.js";

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

const archiveTableBody =
    document.getElementById("archiveTableBody");

// ========================================
// VARIABLES
// ========================================

let archivedOrders = [];

// ========================================
// LOAD ARCHIVED ORDERS
// ========================================

const archiveQuery = query(

    collection(db, "orders"),

    where("isArchived", "==", true)

);

onSnapshot(archiveQuery, (snapshot) => {

    archivedOrders = [];

    snapshot.forEach((docSnap) => {

        archivedOrders.push({

            id: docSnap.id,

            ...docSnap.data()

        });

    });

    renderArchivedOrders();

});

// ========================================
// RENDER TABLE
// ========================================

function renderArchivedOrders() {

    archiveTableBody.innerHTML = "";

    if (archivedOrders.length === 0) {

        archiveTableBody.innerHTML = `

            <tr>

                <td colspan="6">

                    No archived orders found.

                </td>

            </tr>

        `;

        return;

    }

    archivedOrders.forEach((order) => {

        archiveTableBody.innerHTML += `

            <tr>

                <td>${order.productName}</td>

                <td>${order.customerName || "Unknown"}</td>

                <td>${order.status}</td>

                <td>₱${Number(order.total).toLocaleString()}</td>

                <td>${order.deliveryDate}</td>

                <td>

                    <button
                        class="action-btn restore-btn"
                        data-id="${order.id}">

                        Restore

                    </button>

                </td>

            </tr>

        `;

    });

}

// ========================================
// RESTORE ORDER
// ========================================

async function restoreOrder(id) {

    const order =
        archivedOrders.find(o => o.id === id);

    if (!order) return;

    const confirmed = confirm(

        `Restore order for "${order.customerName}"?`

    );

    if (!confirmed) return;

    try {

        await updateDoc(

            doc(db, "orders", id),

            {

                isArchived: false

            }

        );

        await logAudit(

            "Restored Order",

            order.productName

        );

        alert("Order restored successfully.");

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// ========================================
// BUTTON EVENTS
// ========================================

archiveTableBody.addEventListener("click", (event) => {

    const button =
        event.target.closest(".restore-btn");

    if (!button) return;

    restoreOrder(button.dataset.id);

});