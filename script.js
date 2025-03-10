// Importar Firebase desde la CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { createFFmpeg, fetchFile } from "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.6/+esm";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCHLCYjP74kM2X4v0HvlRyyCafcW3GH-eI",
    authDomain: "imbatiblesgym-7976f.firebaseapp.com",
    projectId: "imbatiblesgym-7976f",
    storageBucket: "imbatiblesgym-7976f.appspot.com",
    messagingSenderId: "557069881698",
    appId: "1:557069881698:web:16e2fd17055e32c3a95c3b",
    measurementId: "G-1KZ9VTR9GV"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const ffmpeg = createFFmpeg({ log: true });

// UID del usuario administrador
const ADMIN_UID = "8TLn84KxyVgnzlseCiDiemIwCwI3";

// ✅ Función para verificar y redirigir usuarios según su UID
async function checkUserRole(user) {
    if (!user) {
        console.log("No hay usuario autenticado.");
        return;
    }

    console.log("Usuario autenticado. Verificando UID..."); // Depuración
    console.log("UID del usuario:", user.uid); // Depuración: Verificar el UID

    if (user.uid === ADMIN_UID) {
        console.log("Redirigiendo a admin.html"); // Depuración: Verificar redirección
        window.location.href = "admin.html"; // Redirige a admin si es el UID correcto
    } else {
        console.log("El usuario no es administrador.");
        // Redirigir a otra página si no es administrador
        window.location.href = "index.html"; // Cambia esto según tu lógica
    }
}

// ✅ Verificar autenticación y redirigir
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Usuario autenticado:", user.uid); // Depuración: Verificar autenticación
        checkUserRole(user);
    } else {
        console.log("No hay usuario autenticado.");
        // Redirigir a la página de inicio de sesión si no hay usuario autenticado
        window.location.href = "index.html"; // Cambia esto según tu lógica
    }
});

// ✅ REGISTRO DE USUARIOS
document.addEventListener("DOMContentLoaded", function () {
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
            const objetivo = Array.from(document.querySelectorAll('input[name="objetivo"]:checked')).map(input => input.value);
            const descripcionObjetivo = document.getElementById("descripcionObjetivo").value;
            const talla = document.getElementById("talla").value;
            const peso = document.getElementById("peso").value;

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Guardar todos los datos del usuario en Firestore
                await setDoc(doc(db, "usuarios", user.uid), {
                    nombres,
                    apellidos,
                    tipoDocumento,
                    documento,
                    email,
                    celular,
                    fechaNacimiento,
                    objetivo,
                    descripcionObjetivo,
                    talla,
                    peso,
                    perfil: "usuario" // Se asigna por defecto como usuario
                });

                alert("Registro exitoso. ¡Bienvenido " + nombres + "!");
                window.location.href = "login.html";
            } catch (error) {
                console.error("Error en el registro:", error);
                alert("Error: " + error.message);
            }
        });
    }

    // ✅ INICIO DE SESIÓN
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                alert("Inicio de sesión exitoso.");
                console.log("Usuario autenticado:", userCredential.user.uid); // Depuración
                checkUserRole(userCredential.user); // Verificar el rol y redirigir
            } catch (error) {
                console.error("Error en inicio de sesión:", error);
                alert("Error: " + error.message);
            }
        });
    }

    // ✅ CARGA DE EJERCICIOS
    const uploadForm = document.getElementById("uploadForm");
    const exerciseImageInput = document.getElementById("exerciseImage");
    const previewContainer = document.getElementById("gifPreview");
    const dropZone = document.getElementById("dropZone");

    if (uploadForm) {
        // ✅ Mostrar vista previa antes de subir
        exerciseImageInput.addEventListener("change", async () => {
            const file = exerciseImageInput.files[0];
            if (file) {
                const gifBlob = await convertVideoToGif(file);
                const gifURL = URL.createObjectURL(gifBlob);
                previewContainer.innerHTML = `<img src="${gifURL}" alt="Vista previa del GIF" style="width: 320px; height: 320px;" />`;
            }
        });

        // ✅ Subir archivo a Firebase Storage
        uploadForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const file = exerciseImageInput.files[0];
            if (!file) {
                alert("Por favor selecciona un archivo.");
                return;
            }

            const gifBlob = await convertVideoToGif(file);
            const storageRef = ref(storage, `ejercicios/${file.name.replace(/\.[^/.]+$/, "")}.gif`);
            await uploadBytes(storageRef, gifBlob);
            const gifURL = await getDownloadURL(storageRef);

            alert("Ejercicio guardado correctamente.");
            console.log("GIF guardado en: ", gifURL);
        });

        // ✅ Soporte para arrastrar y soltar archivos
        dropZone.addEventListener("dragover", (event) => {
            event.preventDefault();
            dropZone.style.backgroundColor = "#555";
        });

        dropZone.addEventListener("dragleave", () => {
            dropZone.style.backgroundColor = "#444";
        });

        dropZone.addEventListener("drop", (event) => {
            event.preventDefault();
            dropZone.style.backgroundColor = "#444";
            const files = event.dataTransfer.files;
            if (files.length > 0) {
                exerciseImageInput.files = files;
            }
        });
    }
});