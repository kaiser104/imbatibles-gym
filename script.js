// Importar Firebase desde la CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configuración de Firebase
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
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
    // 🔹 REGISTRO DE USUARIOS
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            // Obtener valores del formulario
            const nombres = document.getElementById("nombres").value;
            const apellidos = document.getElementById("apellidos").value;
            const tipoDocumento = document.getElementById("tipoDocumento").value;
            const documento = document.getElementById("documento").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const celular = document.getElementById("celular").value;
            const fechaNacimiento = document.getElementById("fechaNacimiento").value;
            const objetivos = Array.from(document.querySelectorAll("input[name='objetivo']:checked")).map(input => input.value);
            const descripcionObjetivo = document.getElementById("descripcionObjetivo").value;
            const talla = document.getElementById("talla").value;
            const peso = document.getElementById("peso").value;

            try {
                // Crear usuario en Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Guardar los datos adicionales en Firestore
                await setDoc(doc(db, "usuarios", user.uid), {
                    nombres,
                    apellidos,
                    tipoDocumento,
                    documento,
                    email,
                    celular,
                    fechaNacimiento,
                    objetivos,
                    descripcionObjetivo,
                    talla,
                    peso
                });

                alert("Registro exitoso. ¡Bienvenido " + nombres + "!");
                window.location.href = "login.html"; // Redirigir a la página de login después del registro
            } catch (error) {
                console.error("Error en el registro:", error);
                alert("Error: " + error.message);
            }
        });
    }

    // 🔹 INICIO DE SESIÓN
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
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
    }
});
