import { auth, db } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validate Contact Number
    if (phone.length !== 11) {
        alert("Contact number must be exactly 11 digits.");
        return;
    }

    // Validate Password Match
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // Validate Email Format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    try {

        // Create Authentication Account
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        // Update Firebase Authentication Profile
        await updateProfile(userCredential.user, {
            displayName: `${firstName} ${lastName}`
        });

        // Save User Information to Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {

            uid: userCredential.user.uid,

            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            address: address,

            role: "customer",
            status: "active",

            createdAt: serverTimestamp()

        });

        alert("Registration successful!");

        window.location.href = "/login/";

    } catch (error) {

        switch (error.code) {

            case "auth/email-already-in-use":
                alert("This email is already registered.");
                break;

            case "auth/invalid-email":
                alert("Please enter a valid email address.");
                break;

            case "auth/weak-password":
                alert("Password must be at least 6 characters long.");
                break;

            case "permission-denied":
            case "firestore/permission-denied":
                alert("You don't have permission to save data.");
                break;

            default:
                alert("Registration failed.\n\n" + error.message);
        }

        console.error("Firebase Error:", error);

    }

});