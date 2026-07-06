import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "/login/";
        return;

    }

    try {

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return;

        const data = userSnap.data();

        const fullName = `${data.firstName} ${data.lastName}`;

        const userName = document.getElementById("userName");
        const navbarName = document.getElementById("navbarName");
        const avatarLetter = document.getElementById("avatarLetter");

        if (userName) {

            userName.textContent = data.firstName;

        }

        if (navbarName) {

            navbarName.textContent = fullName;

        }

        if (avatarLetter) {

            avatarLetter.textContent =
                data.firstName.charAt(0).toUpperCase();

        }

    }

    catch (error) {

        console.error(error);

    }

});