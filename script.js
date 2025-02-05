// Importar Firebase desde la CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configuración de Firebase (usa tus propios datos)
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
    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita que la página se recargue

        const formData = new FormData(registerForm);
        const email = formData.get("email");
        const password = formData.get("password");

        try {
            // Crear usuario en Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Guardar datos adicionales en Firestore
            await addDoc(collection(db, "usuarios"), {
                uid: user.uid, // ID único del usuario
                nombres: formData.get("nombres"),
                apellidos: formData.get("apellidos"),
                tipoDocumento: formData.get("tipoDocumento"),
                documento: formData.get("documento"),
                email: email,
                celular: formData.get("celular"),
                fechaNacimiento: formData.get("fechaNacimiento"),
                objetivo: formData.getAll("objetivo"),
                descripcionObjetivo: formData.get("descripcionObjetivo") || "Sin descripción",
                talla: formData.get("talla"),
                peso: formData.get("peso")
            });

            alert("Registro exitoso. Usuario creado con email: " + email);
            registerForm.reset(); // Limpia el formulario
        } catch (error) {
            console.error("Error al registrar:", error);
            alert("Error al registrar: " + error.message);
        }
    });
});
