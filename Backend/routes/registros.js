const express = require("express");
const admin = require("firebase-admin");
const router = express.Router();

module.exports = (db) => {

  // GET registros
  router.get("/", async (req, res) => {
    try {
      const snapshot = await db.collection("registros").get();

      const registros = [];
      snapshot.forEach(doc => registros.push(doc.data()));

      res.json(registros);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  //POST registros
  router.post("/", async (req, res) => {
    try {
      const { camion_id, tipo, metodo } = req.body;

      if (!camion_id || !tipo || !metodo) {
        return res.status(400).json({ error: "Faltan datos" });
      }

      if (!["entrada", "salida"].includes(tipo)) {
        return res.status(400).json({ error: "Tipo inválido" });
      }

      if (!["rfid", "manual"].includes(metodo)) {
        return res.status(400).json({ error: "Método inválido" });
      }

      await db.collection("registros").add({
        camion_id,
        tipo,
        metodo,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

      const estadoRef = db.collection("estado_actual").doc(camion_id);

      if (tipo === "entrada") {
        await estadoRef.set({
          dentro: true,
          ultima_entrada: admin.firestore.FieldValue.serverTimestamp()
        });
      } else {
        await estadoRef.set({ dentro: false }, { merge: true });
      }

      res.json({ mensaje: "Registro guardado" });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};