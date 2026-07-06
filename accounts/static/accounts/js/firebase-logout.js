import { auth } from "./firebase-config.js";
import { logAudit } from "./firebase-audit.js";

import {
    signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        const confirmLogout = confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) return;

        try {

            const adminName =
                localStorage.getItem("adminName") || "Administrator";

            const adminEmail =
                localStorage.getItem("adminEmail") ||
                auth.currentUser?.email ||
                "";

            await logAudit(

                adminName,

                adminEmail,

                "Logout",

                "Authentication",

                "Administrator logged out of the system"

            );

            await signOut(auth);

            localStorage.removeItem("adminName");
            localStorage.removeItem("adminEmail");

            alert("Logged out successfully.");

            window.location.href = "/login/";

        } catch (error) {

            console.error(error);

            alert(error.message);

        }

    });

}