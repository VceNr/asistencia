const express = require("express");
const router = express.Router();

module.exports = (db) => {


  // REGISTRAR CAMIÓN
  router.post("/", async (req, res) => {
    try {
      const { camion_id, patente, chofer, rfid_uid } = req.body;

      if (!camion_id || !patente || !chofer || !rfid_uid) {
        return res.status(400).json({ error: "Faltan datos" });
      }

      const camionRef = db.collection("camiones").doc(camion_id);
      const camionDoc = await camionRef.get();

      if (camionDoc.exists) {
        return res.status(400).json({ error: "El camión ya existe" });
      }

      const patenteQuery = await db.collection("camiones")
        .where("patente", "==", patente)
        .get();

      if (!patenteQuery.empty) {
        return res.status(400).json({ error: "Patente ya registrada" });
      }

      const rfidQuery = await db.collection("camiones")
        .where("rfid_uid", "==", rfid_uid)
        .get();

      if (!rfidQuery.empty) {
        return res.status(400).json({ error: "RFID ya registrado" });
      }

      await camionRef.set({
        patente,
        chofer,
        rfid_uid,
        activo: true
      });

      res.json({ mensaje: "Camión registrado correctamente" });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // OBTENER CAMIONES
  router.get("/", async (req, res) => {
    try {
      const snapshot = await db.collection("camiones").get();

      const camiones = [];

      snapshot.forEach(doc => {
        camiones.push({
          camion_id: doc.id,
          ...doc.data()
        });
      });

      res.json(camiones);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};