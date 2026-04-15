import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAcXtEv0KgulGryJdB0k4S9M7v_pIjz7Dk",
  authDomain: "control-acceso-cam.firebaseapp.com",
  projectId: "control-acceso-cam",
  storageBucket: "control-acceso-cam.firebasestorage.app",
  messagingSenderId: "168128418954",
  appId: "1:168128418954:web:e2689602c343bdfdf78973"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ELEMENTOS
const loginDiv = document.getElementById("login");
const panelDiv = document.getElementById("app");

const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");
const btnDashboard = document.getElementById("btnDashboard");

// 🔐 LOGIN
btnLogin.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    alert("Error: " + error.message);
  }
});

// LOGOUT
btnLogout.addEventListener("click", async () => {
  await signOut(auth);
});

// DASHBOARD
btnDashboard.addEventListener("click", () => {
  window.location.href = "dashboard-entradas.html";
});

const btnActividad = document.getElementById("btnActividad");

btnActividad.addEventListener("click", () => {
  window.location.href = "dashboard-actividad.html";
});

// CONTROL DE SESIÓN
onAuthStateChanged(auth, (user) => {

  if (user) {
    loginDiv.classList.add("hidden");
    panelDiv.classList.remove("hidden");

    cargarCamionesRegistrados();

  } else {
    loginDiv.classList.remove("hidden");
    panelDiv.classList.add("hidden");
  }

});

// CAMIONES REGISTRADOS
async function cargarCamionesRegistrados() {
  try {
    const res = await fetch("/api/camiones");

    if (!res.ok) throw new Error("Error en API");

    const data = await res.json();

    const lista = document.getElementById("listaCamionesAdmin");
    lista.innerHTML = "";

    if (data.length === 0) {
      lista.innerHTML = "<p>No hay camiones registrados</p>";
      return;
    }

    data.forEach(camion => {
      const card = document.createElement("div");
      card.className = "camion-card";

      card.innerHTML = `
        <div class="camion-header">
          <span class="badge">ACTIVO</span>
        </div>

        <div class="camion-info">
          <p class="patente">${camion.patente || "Sin patente"}</p>
          <p class="chofer">${camion.chofer || "Sin chofer"}</p>
        </div>

        <div class="camion-footer">
          <small>ID: ${camion.camion_id}</small>
        </div>
      `;

      lista.appendChild(card);
    });

  } catch (error) {
    console.error("Error cargando camiones:", error);
  }
}