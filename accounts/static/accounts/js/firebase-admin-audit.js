import { db } from "./firebase-config.js";

import {

    collection,

    query,

    orderBy,

    onSnapshot

} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const tableBody =
document.getElementById("auditTableBody");

const searchInput =
document.getElementById("searchLog");

let logs = [];

const q = query(

    collection(db,"audit_logs"),

    orderBy("createdAt","desc")

);

onSnapshot(q,(snapshot)=>{

    logs = [];

    snapshot.forEach(doc=>{

        logs.push(doc.data());

    });

    renderLogs();

});

function renderLogs(){

    const keyword =
    searchInput.value.toLowerCase();

    tableBody.innerHTML = "";

    logs

    .filter(log=>{

        return (

            log.action?.toLowerCase().includes(keyword) ||

            log.module?.toLowerCase().includes(keyword) ||

            log.description?.toLowerCase().includes(keyword)

        );

    })

    .forEach(log=>{

        const date =

        log.createdAt

        ? log.createdAt.toDate().toLocaleString()

        : "-";

        tableBody.innerHTML += `

        <tr>

            <td>${date}</td>

            <td>${log.adminName}</td>

            <td>${log.module}</td>

            <td>${log.action}</td>

            <td>${log.description}</td>

        </tr>

        `;

    });

}

searchInput.addEventListener(

    "input",

    renderLogs

);