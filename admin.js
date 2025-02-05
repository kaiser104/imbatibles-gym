import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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
    const usersList = document.getElementById("usersList");
    const logoutButton = document.getElementById("logoutButton");

    // 🔹 Verificar si el usuario está autenticado y obtener su perfil
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                // Buscar el usuario en Firestore por su correo electrónico
                const querySnapshot = await getDocs(collection(db, "usuarios"));
                let userFound = false;

                querySnapshot.forEach((docSnapshot) => {
                    const userData = docSnapshot.data();
                    if (userData.email === user.email) {
                        userFound = true;
                        userInfo.innerText = `Bienvenido, ${userData.nombres} (${userData.perfil})`;

                        if (userData.perfil && userData.perfil.toLowerCase() === "administrador") {
                            adminContent.style.display = "block";
                            accessDenied.style.display = "none";
                            cargarUsuarios(); // Cargar lista de usuarios
                        } else {
                            adminContent.style.display = "none";
                            accessDenied.style.display = "block";
                        }
                    }
                });

                if (!userFound) {
                    accessDenied.style.display = "block";
                }
            } catch (error) {
                console.error("Error obteniendo usuario:", error);
            }
        } else {
            window.location.href = "index.html"; // Redirigir si no está autenticado
        }
    });

    // 🔹 Cargar lista de usuarios
    async function cargarUsuarios() {
        usersList.innerHTML = "";
        try {
            const querySnapshot = await getDocs(collection(db, "usuarios"));
            querySnapshot.forEach((docSnapshot) => {
                const userData = docSnapshot.data();
                const userId = docSnapshot.id;

                const li = document.createElement("li");
                li.innerHTML = `
                    <strong>${userData.nombres} ${userData.apellidos}</strong> - ${userData.email}
                    <br>
                    <label>Perfil:</label>
                    <select id="perfil-${userId}">
                        <option value="usuario" ${userData.perfil === "usuario" ? "selected" : ""}>Usuario</option>
                        <option value="gimnasio" ${userData.perfil === "gimnasio" ? "selected" : ""}>Gimnasio</option>
                        <option value="entrenador" ${userData.perfil === "entrenador" ? "selected" : ""}>Entrenador</option>
                        <option value="administrador" ${userData.perfil === "administrador" ? "selected" : ""}>Administrador</option>
                    </select>
                    <button onclick="actualizarPerfil('${userId}')">Guardar</button>
                    <button onclick="eliminarUsuario('${userId}')">Eliminar</button>
                `;

                usersList.appendChild(li);
            });
        } catch (error) {
            console.error("Error cargando usuarios:", error);
        }
    }

    // 🔹 Actualizar perfil del usuario
    window.actualizarPerfil = async function (userId) {
        const select = document.getElementById(`perfil-${userId}`);
        const nuevoPerfil = select.value;

        try {
            const userDocRef = doc(db, "usuarios", userId);
            await updateDoc(userDocRef, { perfil: nuevoPerfil });
            alert("Perfil actualizado correctamente.");
            cargarUsuarios(); // Recargar lista después de actualizar
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
        }
    };

    // 🔹 Eliminar usuario
    window.eliminarUsuario = async function (userId) {
        if (confirm("¿Estás seguro de eliminar este usuario?")) {
            try {
                await deleteDoc(doc(db, "usuarios", userId));
                alert("Usuario eliminado correctamente.");
                cargarUsuarios(); // Recargar la lista de usuarios
            } catch (error) {
                console.error("Error al eliminar usuario:", error);
            }
        }
    };

    // 🔹 Cerrar sesión
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
