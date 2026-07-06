import { db } from "./firebase-config.js";
import { logAudit } from "./firebase-audit.js";

import {
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query,
    where,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// ========================================
// DOM ELEMENTS
// ========================================

const productModal = document.getElementById("productModal");
const addProductBtn = document.getElementById("addProductBtn");
const closeModal = document.getElementById("closeModal");
const productForm = document.getElementById("productForm");

const productTableBody = document.getElementById("productTableBody");
const searchInput = document.getElementById("searchProduct");

const productImage = document.getElementById("productImage");
const previewImage = document.getElementById("previewImage");

// ========================================
// VARIABLES
// ========================================

let products = [];

let editingProductId = null;

const modalTitle =
    document.getElementById("modalTitle");

const DEFAULT_IMAGE =
    "https://placehold.co/250x250?text=No+Image";

// ========================================
// MODAL
// ========================================

function openModal() {

    productModal.classList.add("active");

}

function closeProductModal() {

    productModal.classList.remove("active");

    resetProductForm();

}

function resetProductForm() {

    productForm.reset();

    previewImage.src = DEFAULT_IMAGE;

}

// ========================================
// IMAGE PREVIEW
// ========================================

productImage.addEventListener("change", () => {

    if (!productImage.value) {

        previewImage.src = DEFAULT_IMAGE;

        return;

    }

    previewImage.src =
    `/static/accounts/images/${productImage.value}`;

});

// ========================================
// MODAL EVENTS
// ========================================

addProductBtn.addEventListener("click", openModal);

closeModal.addEventListener("click", closeProductModal);

productModal.addEventListener("click", (e) => {

    if (e.target === productModal) {

        closeProductModal();

    }

});

// ========================================
// PRODUCT FORM
// ========================================

productForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const product = {

        name: document.getElementById("productName").value.trim(),

        category: document.getElementById("productCategory").value.trim(),

        description: document.getElementById("productDescription").value.trim(),

        image: document.getElementById("productImage").value,

        price: Number(document.getElementById("productPrice").value),

        stock: Number(document.getElementById("productStock").value),

        minimumStock: Number(document.getElementById("minimumStock").value),

        available:
            document.getElementById("productAvailable").value === "true"

    };

    try {

        if (editingProductId) {

            await updateDoc(

                doc(db, "products", editingProductId),

                product

            );

            await logAudit(
                "Updated Product",
                product.name
            );

            alert("Product updated successfully.");

        } else {

            product.createdAt = serverTimestamp();

            product.isArchived = false;

            await addDoc(

                collection(db, "products"),

                product

            );

            await logAudit(
                "Added Product",
                product.name
            );

            alert("Product added successfully.");

        }

        editingProductId = null;

        modalTitle.textContent = "Add Product";

        closeProductModal();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

});

// ========================================
// LOAD PRODUCTS
// ========================================

const productsRef = query(

    collection(db, "products"),

    where("isArchived", "==", false)

);

onSnapshot(productsRef, (snapshot) => {

    products = [];

    snapshot.forEach((doc) => {

        products.push({

            id: doc.id,

            ...doc.data()

        });

    });

    renderProducts();

});

// ========================================
// RENDER PRODUCTS
// ========================================

function renderProducts() {

    const keyword = searchInput.value.toLowerCase();

    productTableBody.innerHTML = "";

    products

        .filter(product =>
            product.name?.toLowerCase().includes(keyword)
        )

        .forEach(product => {

            productTableBody.innerHTML += `

                <tr>

                    <td>

                        <img

                              src="${
                                  product.image
                                   ? `/static/accounts/images/${product.image}`
                              : DEFAULT_IMAGE
    }"
                                 alt="${product.name}">
                    </td>

                    <td>${product.name}</td>

                    <td>${product.category}</td>

                    <td>₱${Number(product.price).toLocaleString()}</td>

                    <td>${product.stock}</td>

                    <td>

                        ${product.available ? "Available" : "Unavailable"}

                    </td>

                    <td>

                        <button
                            class="action-btn edit-btn"
                            data-id="${product.id}">

                            Edit

                        </button>

                        <button
                            class="action-btn delete-btn"
                            data-id="${product.id}">

                            Archive

                        </button>

                    </td>

                </tr>

            `;

        });

}

function editProduct(id) {

    const product = products.find(p => p.id === id);

    if (!product) return;

    editingProductId = id;

    modalTitle.textContent = "Edit Product";

    document.getElementById("productName").value =
        product.name;

    document.getElementById("productCategory").value =
        product.category;

    document.getElementById("productDescription").value =
        product.description;

    document.getElementById("productPrice").value =
        product.price;

    document.getElementById("productStock").value =
        product.stock;

    document.getElementById("minimumStock").value =
        product.minimumStock;

    document.getElementById("productAvailable").value =
        String(product.available);

    document.getElementById("productImage").value =
        product.image;

    previewImage.src =
        `/static/accounts/images/${product.image}`;

    openModal();

}

async function archiveProduct(id) {

    const product = products.find(p => p.id === id);

    if (!product) return;

    const confirmArchive = confirm(
        `Archive "${product.name}"?`
    );

    if (!confirmArchive) return;

    try {

        await updateDoc(

            doc(db, "products", id),

            {
                isArchived: true
            }

        );

        await logAudit(
            "Archived Product",
            product.name
        );

        alert("Product archived successfully.");

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}


productTableBody.addEventListener("click", (e) => {

    const button = e.target.closest("button");

    if (!button) return;

    const id = button.dataset.id;

    if (button.classList.contains("edit-btn")) {

        editProduct(id);

    }

    if (button.classList.contains("delete-btn")) {

        archiveProduct(id);

    }

});

// ========================================
// SEARCH
// ========================================

searchInput.addEventListener("input", renderProducts);