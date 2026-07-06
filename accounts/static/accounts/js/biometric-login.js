import { auth } from "./firebase-config.js";

import {
    signInWithCustomToken
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

    const button = document.getElementById(
        "biometric-login-btn"
    );

    if (!button) return;

    button.addEventListener(
        "click",
        beginBiometricLogin
    );

});

async function beginBiometricLogin() {

    try {

        // Step 1
        const beginResponse = await fetch(
            "/webauthn/begin-authentication/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({})
            }
        );

        const options = await beginResponse.json();

        console.log(options);

    }
    catch (error) {

        console.error(error);

    }

}