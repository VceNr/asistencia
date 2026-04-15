let chart = null;

// 🔙 VOLVER
function volver() {
  window.location.href = "admin.html";
}

//CARGAR DATOS
async function cargarDatos() {
  const fechaFiltro = document.getElementById("filtroFecha").value;

  try {
    const res = await fetch('/api/registros');
    const data = await res.json();

    const entradas = {};
    const salidas = {};

    data.forEach(reg => {
      const ts = reg.timestamp || reg.timestap;
      if (!ts || !ts._seconds) return;

      const fecha = new Date(ts._seconds * 1000);

      // FILTRO POR DÍA
      if (fechaFiltro) {
        const fechaStr = fecha.toISOString().split("T")[0];
        if (fechaStr !== fechaFiltro) return;
      }

      const hora = fecha.getHours();

      if (reg.tipo === "entrada") {
        entradas[hora] = (entradas[hora] || 0) + 1;
      } else if (reg.tipo === "salida") {
        salidas[hora] = (salidas[hora] || 0) + 1;
      }
    });

    const horas = [...new Set([
      ...Object.keys(entradas),
      ...Object.keys(salidas)
    ])].sort((a, b) => a - b);

    const datosEntradas = horas.map(h => entradas[h] || 0);
    const datosSalidas = horas.map(h => salidas[h] || 0);

    renderGrafico(horas, datosEntradas, datosSalidas);

  } catch (error) {
    console.error("Error cargando datos:", error);
  }
}

// RENDER GRAFICO
function renderGrafico(horas, entradas, salidas) {
  const ctx = document.getElementById('grafico');

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: horas.map(h => String(h).padStart(2, '0') + ":00"),
      datasets: [
        {
          label: 'Entradas',
          data: entradas,
          tension: 0.3
        },
        {
          label: 'Salidas',
          data: salidas,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        }
      }
    }
  });
}

//INICIO
cargarDatos();