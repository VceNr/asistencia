const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  //TODOS LOS CAMIONES REGISTRADOS
router.get("/camiones", async (req, res) => {
  try {
    const snapshot = await db.collection("camiones").get();

    const camiones = [];

    snapshot.forEach(doc => {
      const data = doc.data();

      camiones.push({
        camion_id: doc.id,
        patente: data.patente || "N/A",
        chofer: data.chofer || "N/A",
        activo: data.activo ?? true
      });
    });

    res.json(camiones);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  //CAMIONES DENTRO
  router.get("/camiones-dentro", async (req, res) => {
    try {
      const estadoSnap = await db.collection("estado_actual").get();

      const resultado = [];

      for (const doc of estadoSnap.docs) {
        const data = doc.data();

        if (data.dentro === true) {
          const camionId = doc.id;

          const camionDoc = await db.collection("camiones").doc(camionId).get();

          if (camionDoc.exists) {
            const camionData = camionDoc.data();

            resultado.push({
              camion_id: camionId,
              patente: camionData.patente || "N/A",
              chofer: camionData.chofer || "N/A"
            });
          }
        }
      }

      res.json(resultado);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};