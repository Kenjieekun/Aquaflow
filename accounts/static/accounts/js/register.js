document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");
    const phone = document.getElementById("phone");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");

    // Numbers only
    phone.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "").slice(0, 11);
    });

    // Show / Hide Password
    document.querySelectorAll(".toggle-password").forEach(icon => {

        icon.addEventListener("click", function () {

    console.log("Eye icon clicked!");

    const input = this.parentElement.querySelector("input");

    if (input.type === "password") {

        input.type = "text";
        this.classList.replace("fa-eye", "fa-eye-slash");

    } else {

        input.type = "password";
        this.classList.replace("fa-eye-slash", "fa-eye");

    }

    });

    });

    // Validation
    form.addEventListener("submit", function (e) {

        e.preventDefault();

        if (phone.value.length !== 11) {
            alert("Contact number must be exactly 11 digits.");
            return;
        }

        if (password.value !== confirmPassword.value) {
            alert("Passwords do not match.");
            return;
        }

        alert("Registration Successful! (Firebase integration is next)");

    });

});