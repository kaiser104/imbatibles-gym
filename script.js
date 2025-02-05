// Importar Firebase desde la CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");
    const loginFormContainer = document.getElementById("loginFormContainer");
    const loginForm = document.getElementById("loginForm");

    // 🔹 Mostrar/Ocultar el formulario de inicio de sesión al hacer clic en "Ingresar"
    loginButton.addEventListener("click", function () {
        if (loginFormContainer.style.display === "none") {
            loginFormContainer.style.display = "block";
        } else {
            loginFormContainer.style.display = "none";
        }
    });

    // 🔹 Manejar el inicio de sesión con Firebase Authentication
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            alert("Inicio de sesión exitoso. Bienvenido " + userCredential.user.email);
            window.location.href = "admin.html"; // Redirigir a la página de administración
        } catch (error) {
            console.error("Error en inicio de sesión:", error);
            alert("Error: " + error.message);
        }
    });
});
