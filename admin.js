import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
    const userInfo = document.getElementById("userInfo");
    const adminContent = document.getElementById("adminContent");
    const accessDenied = document.getElementById("accessDenied");
    const logoutButton = document.getElementById("logoutButton");

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const querySnapshot = await getDocs(collection(db, "usuarios"));
            let userFound = false;

            querySnapshot.forEach((docSnapshot) => {
                const userData = docSnapshot.data();
                if (userData.email === user.email) {
                    userFound = true;
                    userInfo.innerText = `Bienvenido, ${userData.nombres} (${userData.perfil})`;

                    if (userData.perfil === "administrador") {
                        adminContent.style.display = "block";
                        cargarUsuarios();
                    } else {
                        accessDenied.style.display = "block";
                    }
                }
            });

            if (!userFound) {
                accessDenied.style.display = "block";
            }
        } else {
            window.location.href = "index.html";
        }
    });

    logoutButton.addEventListener("click", async function () {
        try {
            await signOut(auth);
            alert("Sesión cerrada.");
            window.location.href = "index.html";
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    });
});
