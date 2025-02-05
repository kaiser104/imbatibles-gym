// Importar Firebase desde la CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configuración de Firebase (usa tus datos reales de Firebase)
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

// Esperar a que la página cargue antes de ejecutar el script
document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita que la página se recargue

        const formData = new FormData(registerForm);
        const data = {
            nombres: formData.get("nombres"),
            apellidos: formData.get("apellidos"),
            tipoDocumento: formData.get("tipoDocumento"),
            documento: formData.get("documento"),
            email: formData.get("email"),
            celular: formData.get("celular"),
            fechaNacimiento: formData.get("fechaNacimiento"),
            objetivo: formData.getAll("objetivo"),
            descripcionObjetivo: formData.get("descripcionObjetivo") || "Sin descripción",
            talla: formData.get("talla"),
            peso: formData.get("peso")
        };

        try {
            // Guardar datos en Firebase Firestore
            const docRef = await addDoc(collection(db, "usuarios"), data);
            alert("Registro exitoso. ID del usuario: " + docRef.id);
            registerForm.reset(); // Limpia el formulario
        } catch (error) {
            console.error("Error al registrar: ", error);
            alert("Error al registrar, revisa la consola.");
        }
    });
});
.register-link {
    font-size: 1.2rem;
    color: #4CAF50; /* Verde */
    text-decoration: none;
    margin-left: 15px;
}

.register-link:hover {
    text-decoration: underline;
}
