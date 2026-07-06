import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// ========================================
// Elements
// ========================================

const email = document.getElementById("email");

const currentPassword = document.getElementById("currentPassword");

const newPassword = document.getElementById("newPassword");

const confirmPassword = document.getElementById("confirmPassword");

const changePasswordBtn = document.getElementById("changePasswordBtn");

// ========================================
// Authentication
// ========================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "/login/";

        return;

    }

    email.value = user.email;

});

// ========================================
// Change Password
// ========================================

changePasswordBtn.addEventListener("click", async () => {

    const user = auth.currentUser;

    if (!user) return;

    if (!currentPassword.value) {

        alert("Please enter your current password.");

        return;

    }

    if (!newPassword.value) {

        alert("Please enter a new password.");

        return;

    }

    if (newPassword.value.length < 6) {

        alert("Password must be at least 6 characters.");

        return;

    }

    if (newPassword.value !== confirmPassword.value) {

        alert("Passwords do not match.");

        return;

    }

    try {

        const credential = EmailAuthProvider.credential(

            user.email,

            currentPassword.value

        );

        await reauthenticateWithCredential(

            user,

            credential

        );

        await updatePassword(

            user,

            newPassword.value

        );

        alert("Password updated successfully!");

        currentPassword.value = "";

        newPassword.value = "";

        confirmPassword.value = "";

    }

    catch (error) {

        console.error(error);

        switch (error.code) {

            case "auth/invalid-credential":

            case "auth/wrong-password":

                alert("Current password is incorrect.");

                break;

            case "auth/too-many-requests":

                alert("Too many attempts. Please try again later.");

                break;

            default:

                alert("Failed to update password.");

        }

    }

});