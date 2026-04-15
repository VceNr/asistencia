async function cargarActividad() {
  try {
    const res = await fetch('/api/registros');
    const data = await res.json();

    const contador = {};

    data.forEach(reg => {
      // 🔥 ignorar registros basura
      if (!reg.camion_id || reg.camion_id === "PYTHON-GUI") return;

      contador[reg.camion_id] = (contador[reg.camion_id] || 0) + 1;
    });

    const camiones = Object.keys(contador);
    const cantidades = Object.values(contador);

    new Chart(document.getElementById('grafico'), {
      type: 'bar',
      data: {
        labels: camiones,
        datasets: [{
          label: 'Movimientos por camión',
          data: cantidades
        }]
      },
      options: {
        responsive: true
      }
    });

  } catch (error) {
    console.error("Error cargando actividad:", error);
  }
}

cargarActividad();