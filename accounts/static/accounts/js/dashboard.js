// ========================================
// ELEMENTS
// ========================================

const sidebar =
    document.querySelector(".dashboard-sidebar");

const menuBtn =
    document.getElementById("mobileMenuBtn");

// ========================================
// CREATE OVERLAY
// ========================================

const overlay =
    document.createElement("div");

overlay.className =
    "sidebar-overlay";

document.body.appendChild(overlay);

// ========================================
// OPEN SIDEBAR
// ========================================

menuBtn?.addEventListener(

    "click",

    () => {

        sidebar?.classList.add("show");

        overlay.classList.add("show");

    }

);

// ========================================
// CLOSE SIDEBAR
// ========================================

overlay.addEventListener(

    "click",

    () => {

        sidebar?.classList.remove("show");

        overlay.classList.remove("show");

    }

);

// ========================================
// DESKTOP RESET
// ========================================

window.addEventListener(

    "resize",

    () => {

        if (window.innerWidth > 992) {

            sidebar?.classList.remove("show");

            overlay.classList.remove("show");

        }

    }

);