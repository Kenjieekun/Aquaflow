import { auth, db } from "./firebase-config.js";
import { logAudit } from "./firebase-audit.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    // Check reCAPTCHA
    const recaptchaResponse = grecaptcha.getResponse();

    if (!recaptchaResponse) {
        alert("Please complete the reCAPTCHA.");
        return;
    }

    try {

        const userCredential = await signInWithEmailAndPassword(

    auth,
    email,
    password

);

localStorage.setItem("adminName", "Administrator");
localStorage.setItem("adminEmail", email);

await logAudit(

    "Administrator",

    email,

    "Login",

    "Authentication",

    "Administrator logged into the system"

);

const user = userCredential.user;

const userDoc = await getDoc(

    doc(db, "users", user.uid)

);

if (!userDoc.exists()) {

    alert("User profile not found.");

    return;

}

const userData = userDoc.data();

alert("Login successful!");

if (userData.role === "admin") {

    window.location.href = "/admin-panel/dashboard/";

}
else {

    window.location.href = "/dashboard/";

}

    } catch (error) {

        switch (error.code) {

            case "auth/invalid-email":
                alert("Please enter a valid email address.");
                break;

            case "auth/invalid-credential":
            case "auth/wrong-password":
            case "auth/user-not-found":
                alert("Incorrect email or password.");
                break;

            case "auth/too-many-requests":
                alert("Too many failed login attempts. Please try again later.");
                break;

            default:
                alert("Login failed.\n\n" + error.message);

        }

        grecaptcha.reset();

        console.error(error);

    }

});