const express = require("express");
const router = express.Router();

module.exports = (db) => {

  router.post("/", async (req, res) => {
    try {
      const { camion_id } = req.body;

      if (!camion_id) {
        return res.status(400).json({ error: "Falta camion_id" });
      }

      const camionDoc = await db.collection("camiones").doc(camion_id).get();

      if (!camionDoc.exists) {
        return res.status(404).json({ error: "Camión no registrado" });
      }

      const estadoRef = db.collection("estado_actual").doc(camion_id);
      const estadoDoc = await estadoRef.get();

      let tipo = "entrada";

      if (estadoDoc.exists && estadoDoc.data().dentro === true) {
        tipo = "salida";
      }

      await db.collection("registros").add({
        camion_id,
        tipo,
        metodo: "manual",
        timestamp: new Date()
      });

      if (tipo === "entrada") {
        await estadoRef.set({ dentro: true, ultima_entrada: new Date() });
      } else {
        await estadoRef.set({ dentro: false }, { merge: true });
      }

      res.json({ mensaje: `Registro exitoso: ${tipo}` });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};