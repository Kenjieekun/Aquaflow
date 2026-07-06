import { db } from "./firebase-config.js";

import {
    collection,
    getDocs,
    onSnapshot,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// ========================================
// DOM ELEMENTS
// ========================================

const customerTableBody =
    document.getElementById("customerTableBody");

const searchCustomer =
    document.getElementById("searchCustomer");

const customerModal =
    document.getElementById("customerModal");

const closeCustomerModal =
    document.getElementById("closeCustomerModal");

const customerName =
    document.getElementById("customerName");

const customerEmail =
    document.getElementById("customerEmail");

const customerPhone =
    document.getElementById("customerPhone");

const customerAddress =
    document.getElementById("customerAddress");

const customerOrders =
    document.getElementById("customerOrders");

const customerStatus =
    document.getElementById("customerStatus");

const customerCreated =
    document.getElementById("customerCreated");

// ========================================
// VARIABLES
// ========================================

let customers = [];
let filteredCustomers = [];

// ========================================
// LOAD CUSTOMERS
// ========================================

onSnapshot(collection(db, "users"), (snapshot) => {

    customers = [];

    snapshot.forEach((docSnap) => {

        const customer = docSnap.data();

        if (customer.role === "customer") {

            customers.push({

                id: docSnap.id,

                ...customer

            });

        }

    });

    filterCustomers();

});

// ========================================
// SEARCH
// ========================================

searchCustomer.addEventListener("input", filterCustomers);

function filterCustomers() {

    const keyword = searchCustomer.value.toLowerCase();

    filteredCustomers = customers.filter(customer => {

        const fullName =
            `${customer.firstName} ${customer.lastName}`.toLowerCase();

        return (

            fullName.includes(keyword) ||

            customer.email.toLowerCase().includes(keyword) ||

            customer.phone.includes(keyword)

        );

    });

    renderCustomers();

}

// ========================================
// RENDER TABLE
// ========================================

async function renderCustomers() {

    customerTableBody.innerHTML = "";

    if (filteredCustomers.length === 0) {

        customerTableBody.innerHTML = `

            <tr>

                <td colspan="6">

                    No customers found.

                </td>

            </tr>

        `;

        return;

    }

    for (const customer of filteredCustomers) {

        const orders = await getCustomerOrders(customer.uid);

        customerTableBody.innerHTML += `

            <tr>

                <td>

                    ${customer.firstName} ${customer.lastName}

                </td>

                <td>

                    ${customer.email}

                </td>

                <td>

                    ${customer.phone}

                </td>

                <td>

                    ${orders}

                </td>

                <td>

                    <span class="status ${customer.status}">

                        ${customer.status}

                    </span>

                </td>

                <td>

                    <div class="action-buttons">

                        <button

                            class="view-btn"

                            data-id="${customer.id}">

                            View

                        </button>

                        <button

                            class="toggle-btn ${customer.status === "disabled" ? "enable" : ""}"

                            data-id="${customer.id}">

                            ${customer.status === "disabled"

                                ? "Enable"

                                : "Disable"}

                        </button>

                    </div>

                </td>

            </tr>

        `;

    }

}

// ========================================
// TOTAL ORDERS
// ========================================

async function getCustomerOrders(uid) {

    const snapshot = await getDocs(collection(db, "orders"));

    let total = 0;

    snapshot.forEach(doc => {

        if (doc.data().userId === uid) {

            total++;

        }

    });

    return total;

}

// ========================================
// BUTTONS
// ========================================

document.addEventListener("click", async (event) => {

    // ===============================
    // VIEW
    // ===============================

    const viewBtn =
        event.target.closest(".view-btn");

    if (viewBtn) {

        const customer = customers.find(

            c => c.id === viewBtn.dataset.id

        );

        if (!customer) return;

        customerName.textContent =
            `${customer.firstName} ${customer.lastName}`;

        customerEmail.textContent =
            customer.email;

        customerPhone.textContent =
            customer.phone;

        customerAddress.textContent =
            customer.address;

        customerStatus.textContent =
            customer.status;

        customerOrders.textContent =
            await getCustomerOrders(customer.uid);

        if (customer.createdAt?.seconds) {

            customerCreated.textContent =
                new Date(

                    customer.createdAt.seconds * 1000

                ).toLocaleDateString();

        }

        else {

            customerCreated.textContent = "-";

        }

        customerModal.classList.add("show");

        return;

    }

    // ===============================
    // ENABLE / DISABLE
    // ===============================

    const toggleBtn =
        event.target.closest(".toggle-btn");

    if (!toggleBtn) return;

    const customer =
        customers.find(

            c => c.id === toggleBtn.dataset.id

        );

    if (!customer) return;

    const newStatus =

        customer.status === "active"

            ? "disabled"

            : "active";

    const confirmed = confirm(

        `${newStatus === "disabled"

            ? "Disable"

            : "Enable"} this customer?`

    );

    if (!confirmed) return;

    try {

        await updateDoc(

            doc(db, "users", customer.id),

            {

                status: newStatus

            }

        );

        alert(

            `Customer ${newStatus} successfully.`

        );

    }

    catch (error) {

        console.error(error);

        alert("Unable to update customer.");

    }

});

// ========================================
// CLOSE MODAL
// ========================================

closeCustomerModal.addEventListener("click", () => {

    customerModal.classList.remove("show");

});

window.addEventListener("click", (event) => {

    if (event.target === customerModal) {

        customerModal.classList.remove("show");

    }

});