import { db } from "../firebase-config.js";

import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

export function listenToOrders(userId, callback) {

    const q = query(
        collection(db, "orders"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(q, callback);

}

export async function cancelOrder(orderId) {

    await updateDoc(
        doc(db, "orders", orderId),
        {
            status: "Cancelled"
        }
    );

}