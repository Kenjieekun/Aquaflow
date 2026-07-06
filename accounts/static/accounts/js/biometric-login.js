import { auth } from "./firebase-config.js";

import {
    signInWithCustomToken
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";


document.addEventListener("DOMContentLoaded", () => {

    const biometricButton = document.getElementById(
        "biometric-login-btn"
    );

    if (!biometricButton) return;

    biometricButton.addEventListener(
        "click",
        beginBiometricLogin
    );

});


function base64urlToBuffer(base64url) {

    const padding =
        "=".repeat((4 - (base64url.length % 4)) % 4);

    const base64 = (base64url + padding)

        .replace(/-/g, "+")

        .replace(/_/g, "/");

    const binary = atob(base64);

    return Uint8Array.from(

        [...binary].map(

            character => character.charCodeAt(0)

        )

    );

}


function bufferToBase64url(buffer) {

    const bytes = new Uint8Array(buffer);

    let binary = "";

    bytes.forEach(byte => {

        binary += String.fromCharCode(byte);

    });

    return btoa(binary)

        .replace(/\+/g, "-")

        .replace(/\//g, "_")

        .replace(/=/g, "");

}


async function beginBiometricLogin() {

    try {

        // ==========================================
        // Begin Authentication
        // ==========================================

        const beginResponse = await fetch(

            "/webauthn/authenticate/begin/",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                },

                body: JSON.stringify({})

            }

        );

        const options = await beginResponse.json();

        if (!beginResponse.ok) {

            alert(options.message);

            return;

        }

        options.challenge = base64urlToBuffer(
            options.challenge
        );

        options.allowCredentials =
            options.allowCredentials.map(

                credential => ({

                    ...credential,

                    id: base64urlToBuffer(
                        credential.id
                    )

                })

            );

        // ==========================================
        // Open Biometrics Prompt
        // ==========================================

        const credential =
            await navigator.credentials.get({

                publicKey: options

            });

        // ==========================================
        // Finish Authentication
        // ==========================================

        const finishResponse = await fetch(

            "/webauthn/authenticate/finish/",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                },

                body: JSON.stringify({

                    id: credential.id,

                    rawId: bufferToBase64url(
                        credential.rawId
                    ),

                    type: credential.type,

                    response: {

                        authenticatorData:
                            bufferToBase64url(
                                credential.response.authenticatorData
                            ),

                        clientDataJSON:
                            bufferToBase64url(
                                credential.response.clientDataJSON
                            ),

                        signature:
                            bufferToBase64url(
                                credential.response.signature
                            ),

                        userHandle:
                            credential.response.userHandle

                                ? bufferToBase64url(
                                    credential.response.userHandle
                                )

                                : null

                    }

                })

            }

        );

        const result =
            await finishResponse.json();

        if (!result.success) {

            alert(result.message);

            return;

        }

        // ==========================================
        // Firebase Login
        // ==========================================

        await signInWithCustomToken(

            auth,

            result.token

        );

        window.location.href =
            "/admin-panel/dashboard/";

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}