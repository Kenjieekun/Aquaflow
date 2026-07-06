const themeBtn =
    document.getElementById("themeToggle") ||
    document.getElementById("theme-toggle");

// ========================================
// Load Saved Theme
// ========================================

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

} else {

    document.body.classList.remove("dark");

}

// ========================================
// Theme Toggle
// ========================================

if (themeBtn) {

    themeBtn.innerHTML = document.body.classList.contains("dark")
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {

            localStorage.setItem("theme", "dark");

            themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';

        } else {

            localStorage.setItem("theme", "light");

            themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';

        }

    });

}