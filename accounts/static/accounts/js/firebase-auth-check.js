import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "/login/";
        return;

    }

    console.log("Logged in:", user.email);

});