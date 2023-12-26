// court.js
const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/:id", async function (req, res, next) {
  console.log("Entered /courts/court/:id route");
  const conn = await db.mysql.createConnection(db.dsn);
  const courtId = req.params.id;

  try {
    const [rows] = await conn.execute(`SELECT * FROM Court WHERE ID = ?`, [
      courtId,
    ]);

    if (rows.length > 0) {
      console.log(rows);
      const courtDetails = rows[0];

      // la représentation HAL
      const halRepresentation = {
        _links: {
          self: { href: `/courts/court/${courtId}` },
          previous: { href: `/courts/` },
        },
        Name: courtDetails.Name,
        Status: courtDetails.Status === 1 ? "disponible" : "non disponible",
        UnavailableDays: courtDetails.UnavailableDays,
        message: "veuillez être connecté pour réserver",
        reserve: {
          href: `/courts/court/${courtId}`,
          method: "POST",
          title:
            courtDetails.Status === 1 ? "Réserver" : "Annuler la réservation",
        },
      };

      console.log("représentation hal :", halRepresentation);
      console.log("court details name :", courtDetails.Name);
      res.render("court", {
        title: `Détails du terrain ${courtDetails.Name}`,
        court: halRepresentation,
      });
    } else {
      res.render("court", {
        title: `Détails du terrain introuvables`,
      });
    }
  } catch (error) {
    console.error("Error in /courts/court/:id route: " + error.stack);
    res.status(500).json({
      msg: "Nous rencontrons des difficultés, merci de réessayer plus tard.",
    });
  } finally {
    conn.end();
  }
});
router.post("/:id", async function (req, res, next) {
  const conn = await db.mysql.createConnection(db.dsn);
  const courtId = req.params.id;

  try {
    const [rows] = await conn.execute(`SELECT Status FROM Court WHERE ID = ?`, [
      courtId,
    ]);

    if (rows.length > 0) {
      const currentStatus = rows[0].Status;

      // Inversez l'état du terrain (true devient false, et vice versa)
      const newStatus = !currentStatus;

      // Mettez à jour le statut du terrain dans la base de données
      await conn.execute(`UPDATE Court SET Status = ? WHERE ID = ?`, [
        newStatus,
        courtId,
      ]);

      res.redirect(`/courts/court/${courtId}`);
    } else {
      // Le terrain n'a pas été trouvé
      res.status(404).json({
        msg: "Terrain introuvable",
      });
    }
  } catch (error) {
    console.error("Error connecting: " + error.stack);
    res.status(500).json({
      msg: "Nous rencontrons des difficultés, merci de réessayer plus tard.",
    });
  } finally {
    conn.end();
  }
});

module.exports = router;
