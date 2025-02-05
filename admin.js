// Importar Firebase desde la CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configuración de Firebase (usa los datos de tu Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyCHLCYjP74kM2X4v0HvlRyyCafcW3GH-eI",
    authDomain: "imbatiblesgym-7976f.firebaseapp.com",
    projectId: "imbatiblesgym-7976f",
    storageBucket: "imbatiblesgym-7976f.firebasestorage.app",
    messagingSenderId: "557069881698",
    appId: "1:557069881698:web:16e2fd17055e32c3a95c3b",
    measurementId: "G-1KZ9VTR9GV"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para obtener y mostrar los usuarios registrados
async function mostrarUsuarios() {
    const usersList = document.getElementById("usersList");
    usersList.innerHTML = ""; // Limpiar la lista antes de cargar nuevos datos

    try {
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const li = document.createElement("li");
            li.textContent = `${userData.nombres} ${userData.apellidos} - ${userData.email}`;
            usersList.appendChild(li);
        });
    } catch (error) {
        console.error("Error obteniendo usuarios:", error);
    }
}

// Llamar la función cuando se cargue la página
document.addEventListener("DOMContentLoaded", mostrarUsuarios);
