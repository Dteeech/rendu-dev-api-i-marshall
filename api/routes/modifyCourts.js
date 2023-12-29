const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/:id/modify-availability", async function (req, res, next) {
  const courtId = req.params.id;

  try {
    const conn = await db.mysql.createConnection(db.dsn);

    // Récupérer le statut actuel du court
    const [currentStatusRows] = await conn.execute(
      "SELECT Status FROM Court WHERE ID = ?",
      [courtId]
    );
    const currentStatus = currentStatusRows[0].Status;

    // Mettre à jour le statut en fonction de l'état actuel
    const newStatus = currentStatus === 1 ? 0 : 1;
    await conn.execute("UPDATE Court SET Status = ? WHERE ID = ?", [
      newStatus,
      courtId,
    ]);

    // Supprimer les réservations associées au court
    if (newStatus === 1) {
      // Si le court devient disponible, supprimez les réservations associées
      await conn.execute("DELETE FROM Reservation WHERE Court_ID = ?", [
        courtId,
      ]);
    }

    // Ajoutez ici la logique pour mettre à jour les autres données de disponibilité (si applicable)
    // ...

    conn.end();

    res.redirect(`/courts/court/${courtId}`);
  } catch (error) {
    console.error(
      "Error in /courts/court/:id/modify-availability route: " + error.stack
    );
    res.status(500).json({
      msg: "Nous rencontrons des difficultés, merci de réessayer plus tard.",
    });
  }
});

module.exports = router;
