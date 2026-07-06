import { auth, db } from "./firebase-config.js";

import {
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    doc,
    getDoc,
    increment,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";   

// ========================================
// Elements
// ========================================

const productGrid = document.getElementById("productGrid");

const searchInput = document.getElementById("searchInput");
const stockFilter = document.getElementById("stockFilter");

const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
const pageNumber = document.getElementById("pageNumber");

const orderModal = document.getElementById("orderModal");
const closeModal = document.getElementById("closeModal");
const cancelOrder = document.getElementById("cancelOrder");
const placeOrder = document.getElementById("placeOrder");

const modalProductName = document.getElementById("modalProductName");
const modalPrice = document.getElementById("modalPrice");

const orderQuantity = document.getElementById("orderQuantity");
const orderTotal = document.getElementById("orderTotal");

const deliveryDate = document.getElementById("deliveryDate");
const deliveryAddress = document.getElementById("deliveryAddress");

const paymentMethod = document.getElementById("paymentMethod");

let selectedProduct = null;

let products = [];

let filteredProducts = [];

let currentPage = 1;

const PRODUCTS_PER_PAGE = 6;

searchInput.addEventListener("input", filterProducts);

stockFilter.addEventListener("change", filterProducts);

nextPage.addEventListener("click", () => {

    if (currentPage * PRODUCTS_PER_PAGE < filteredProducts.length) {

        currentPage++;

        renderProducts();

    }

});

prevPage.addEventListener("click", () => {

    if (currentPage > 1) {

        currentPage--;

        renderProducts();

    }

});


// ========================================
// Load Products
// ========================================

function loadProducts() {

    onSnapshot(

        collection(db, "products"),

        (snapshot) => {

            products = [];

            snapshot.forEach((docSnap) => {

                products.push({

                    id: docSnap.id,

                    ...docSnap.data()

                });

            });

            filterProducts();

        },

        (error) => {

            console.error("Error loading products:", error);

        }

    );

}

function filterProducts() {

    const search = searchInput.value.toLowerCase();

    const stock = stockFilter.value;

    filteredProducts = products.filter(product => {

        const matchSearch =
            product.name.toLowerCase().includes(search);

        let matchStock = true;

        if (stock === "available") {

            matchStock = product.stock > 0;

        }

        else if (stock === "out") {

            matchStock = product.stock <= 0;

        }

        return matchSearch && matchStock;

    });

    currentPage = 1;

    renderProducts();

}

function renderProducts() {

    productGrid.innerHTML = "";

    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;

    const end = start + PRODUCTS_PER_PAGE;

    const pageProducts = filteredProducts.slice(start, end);

    if (pageProducts.length === 0) {

        productGrid.innerHTML = "<p>No products found.</p>";

    }

    pageProducts.forEach(product => {

        productGrid.innerHTML += `

        <div class="product-card">

            <img
                src="/static/accounts/images/${product.image}"
                class="product-image"
                alt="${product.name}">

            <h3 class="product-name">

                ${product.name}

            </h3>

            <p>

                ${product.description}

            </p>

            <div class="product-price">

                ₱${product.price}

            </div>

            <div class="product-stock">

                Stock: ${product.stock}

            </div>

            <button
                class="order-btn"
                data-id="${product.id}"
                data-name="${product.name}"
                data-price="${product.price}"
                data-stock="${product.stock}"
                ${product.stock <= 0 ? "disabled" : ""}>

                ${product.stock <= 0 ? "Out of Stock" : "Order Now"}

                </button>
        </div>

        `;

    });

    pageNumber.textContent =
        `Page ${currentPage}`;

    prevPage.disabled = currentPage === 1;

    nextPage.disabled =
        end >= filteredProducts.length;

}


// ========================================
// Modal Functions
// ========================================

function openOrderModal(product) {

    selectedProduct = product;

    modalProductName.textContent = product.name;
    modalPrice.textContent = product.price;

    orderQuantity.value = 1;
    orderTotal.textContent = product.price;

    deliveryDate.value = "";
    deliveryAddress.value = "";
    paymentMethod.value = "";   

    orderModal.classList.add("show");

}

function closeOrderModal() {

    orderModal.classList.remove("show");

}

// ========================================
// Update Total
// ========================================

function updateTotal() {

    if (!selectedProduct) return;

    const quantity = Number(orderQuantity.value) || 1;

    orderTotal.textContent = quantity * selectedProduct.price;

}

// ========================================
// Place Order
// ========================================

async function placeNewOrder() {

    if (!deliveryAddress.value.trim()) {

        alert("Please enter your delivery address.");
        return;

    }

    if (!paymentMethod.value) {

        alert("Please select a payment method.");
        return;

    }

    const quantity = Number(orderQuantity.value);

    if (selectedProduct.stock <= 0) {

        alert("This product is out of stock.");
        return;

    }

    if (quantity > selectedProduct.stock) {

        alert(`Only ${selectedProduct.stock} item(s) left in stock.`);
        return;

    }

    try {

        // Get customer information
        const userSnapshot = await getDoc(

            doc(db, "users", auth.currentUser.uid)

        );

        const customer = userSnapshot.exists()
            ? userSnapshot.data()
            : {};

        // Save order
        await addDoc(

            collection(db, "orders"),

            {

                userId: auth.currentUser.uid,

                customerName:
                    `${customer.firstName || ""} ${customer.lastName || ""}`.trim(),

                customerEmail:
                    customer.email || "",

                customerPhone:
                    customer.phone || "",

                customerAddress:
                    customer.address || "",

                productId:
                    selectedProduct.id,

                productName:
                    selectedProduct.name,

                quantity,

                price:
                    selectedProduct.price,

                total:
                    Number(orderTotal.textContent),

                deliveryDate:
                    deliveryDate.value,

                deliveryAddress:
                    deliveryAddress.value,

                paymentMethod:
                    paymentMethod.value,

                status:
                "Pending",

                isArchived:
                false,

                createdAt:
                 serverTimestamp()

            }

        );

        // Update product stock
        await updateDoc(

            doc(db, "products", selectedProduct.id),

            {

                stock: increment(-quantity)

            }

        );

        alert("Order placed successfully!");

        closeOrderModal();

    }

    catch (error) {

        console.error("Error placing order:", error);

        alert("Failed to place order.");

    }

}

// ========================================
// Event Listeners
// ========================================

document.addEventListener("click", (e) => {

    if (!e.target.classList.contains("order-btn")) return;

    openOrderModal({

        id: e.target.dataset.id,

        name: e.target.dataset.name,

        price: Number(e.target.dataset.price),

        stock: Number(e.target.dataset.stock)

    });

});

closeModal.addEventListener("click", closeOrderModal);

cancelOrder.addEventListener("click", closeOrderModal);

window.addEventListener("click", (e) => {

    if (e.target === orderModal) {

        closeOrderModal();

    }

});

orderQuantity.addEventListener("input", updateTotal);

placeOrder.addEventListener("click", placeNewOrder);

// ========================================
// Initialize
// ========================================

loadProducts();