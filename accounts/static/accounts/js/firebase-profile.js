import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// ========================================
// Elements
// ========================================

const firstName = document.getElementById("firstName");

const lastName = document.getElementById("lastName");

const email = document.getElementById("email");

const phone = document.getElementById("phone");

const address = document.getElementById("address");

const saveProfile = document.getElementById("saveProfile");

// ========================================
// Authentication
// ========================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "/login/";

        return;

    }

    loadProfile(user);

});

// ========================================
// Load Profile
// ========================================

async function loadProfile(user) {

    try {

        email.value = user.email;

        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return;

        const data = userSnap.data();

        firstName.value = data.firstName || "";

        lastName.value = data.lastName || "";

        phone.value = data.phone || "";

        address.value = data.address || "";

    }

    catch (error) {

        console.error("Error loading profile:", error);

    }

}

// ========================================
// Save Profile
// ========================================

saveProfile.addEventListener("click", async () => {

    const user = auth.currentUser;

    if (!user) return;

    try {

        await updateDoc(

            doc(db, "users", user.uid),

            {

                firstName: firstName.value.trim(),

                lastName: lastName.value.trim(),

                phone: phone.value.trim(),

                address: address.value.trim()

            }

        );

        alert("Profile updated successfully.");

    }

    catch (error) {

        console.error("Error updating profile:", error);

        alert("Unable to update profile.");

    }

});