const inputCamion = document.getElementById("camion_id");
const btnRegistrar = document.getElementById("btnRegistrar");
const btnAdmin = document.getElementById("btnAdmin");
const resultado = document.getElementById("resultado");

// REGISTRAR
btnRegistrar.addEventListener("click", async () => {
  const camion_id = inputCamion.value.trim();

  if (!camion_id) {
    resultado.innerText = "Ingrese un ID válido";
    return;
  }

  try {
    const res = await fetch("/api/procesar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ camion_id })
    });

    const data = await res.json();

    resultado.innerText = data.mensaje || data.error;

    inputCamion.value = "";

    // actualizar lista después de registrar
    cargarCamionesDentro();

  } catch (error) {
    resultado.innerText = "Error de conexión";
  }
});

//IR A ADMIN
btnAdmin.addEventListener("click", () => {
  window.location.href = "admin.html";
});

// 🚛 CARGAR CAMIONES DENTRO
async function cargarCamionesDentro() {
  try {
    const res = await fetch('/api/camiones-dentro');
    const data = await res.json();

    const lista = document.getElementById("listaCamiones");
    const total = document.getElementById("totalCamiones");

    lista.innerHTML = "";
    total.innerText = `Total: ${data.length}`;

    data.forEach(camion => {
      const li = document.createElement("li");

      li.innerText = `${camion.camion_id} | ${camion.patente} | ${camion.chofer}`;

      lista.appendChild(li);
    });

  } catch (error) {
    console.error("Error cargando camiones:", error);
  }
}

// 🚀 INICIO
cargarCamionesDentro();

// 🔄 ACTUALIZA CADA 5 SEGUNDOS
setInterval(cargarCamionesDentro, 5000);