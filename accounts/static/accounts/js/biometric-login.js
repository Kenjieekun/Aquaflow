import { auth } from "./firebase-config.js";

import {
    signInWithCustomToken,
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// ========================================
// INITIALIZE
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    document
        .getElementById("biometric-login-btn")
        ?.addEventListener("click", beginBiometricLogin);
});

// ========================================
// HELPERS
// ========================================

function base64urlToBuffer(base64url) {
    const padding = "=".repeat((4 - (base64url.length % 4)) % 4);

    const base64 = (base64url + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    return Uint8Array.from(
        atob(base64),
        char => char.charCodeAt(0)
    );
}

function bufferToBase64url(buffer) {
    return btoa(
        String.fromCharCode(...new Uint8Array(buffer))
    )
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}

// ========================================
// BIOMETRIC LOGIN
// ========================================

async function beginBiometricLogin() {

    if (!window.PublicKeyCredential) {
        alert("This device does not support biometrics.");
        return;
    }

    try {

        const options = await beginAuthentication();

        const credential =
            await navigator.credentials.get({
                publicKey: options,
            });

        if (!credential) {
            throw new Error("Authentication cancelled.");
        }

        const result =
            await finishAuthentication(credential);

        await signInWithCustomToken(
            auth,
            result.token
        );

        window.location.href =
            "/admin-panel/dashboard/";

    } catch (error) {

        console.error(error);
        alert(error.message);

    }

}

async function beginAuthentication() {

    const response = await fetch(
        "/webauthn/authenticate/begin/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        }
    );

    let options;

    try {
        options = await response.json();
    } catch {
        throw new Error("Invalid server response.");
    }

    if (!response.ok) {
        throw new Error(
            options.message ||
            "Unable to begin authentication."
        );
    }

    options.challenge =
        base64urlToBuffer(options.challenge);

    options.allowCredentials =
        (options.allowCredentials || []).map(
            credential => ({
                ...credential,
                id: base64urlToBuffer(
                    credential.id
                ),
            })
        );

    return options;

}

async function finishAuthentication(
    credential
) {

    const response = await fetch(
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
                            : null,

                },

            }),
        }
    );

    let result;

    try {
        result = await response.json();
    } catch {
        throw new Error("Invalid server response.");
    }

    if (!response.ok || !result.success) {
        throw new Error(
            result.message ||
            "Authentication failed."
        );
    }

    return result;

}