import { db } from "./firebase-config.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

export async function logAudit(
    adminName,
    adminEmail,
    action,
    module,
    description
){

    try{

        await addDoc(
            collection(db,"audit_logs"),
            {

                adminName,

                adminEmail,

                action,

                module,

                description,

                createdAt:serverTimestamp()

            }
        );

    }catch(error){

        console.error("Audit Log Error:",error);

    }

}