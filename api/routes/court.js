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
          next: { href: `/courts/court/${courtId}/reserve-form` },
        },
        Name: courtDetails.Name,
        Status: courtDetails.Status === 1 ? "disponible" : "réservé",
        UnavailableDays: courtDetails.UnavailableDays,
        reserve: {
          href: `/courts/court/${courtId}/reserve`,
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
        message: req.session.username,
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

router.get("/:id/reserve-form", async function (req, res, next) {
  const courtId = req.params.id;

  console.log("court id dans /:id/reserve-form :", courtId);

  // Vérifiez si l'utilisateur est connecté
  if (!req.session.username) {
    res.redirect("/login");
    return;
  }

  res.render("reserve-form", {
    title: `Réserver le terrain ${courtId}`,
    courtId: courtId,
    message: req.session.username,
  });
});

router.post("/:id/reserve-form", async function (req, res, next) {
  const courtId = req.params.id;
  const userId = req.session.userId;
  const duration = 45;

  const reservationDate = req.body.reservationDate;
  const reservationTime = req.body.reservationTime;
  console.log("courtId:", courtId);
  console.log("userId:", userId);
  console.log("duration:", duration);
  console.log("reservationDate:", reservationDate);
  console.log("reservationTime:", reservationTime);

  if (!courtId || !userId || !reservationDate || !reservationTime) {
    res.status(400).json({
      msg: "Paramètres manquants pour la réservation.",
    });
    return;
  }

  const date = reservationDate;
  const time = reservationTime;

  const conn = await db.mysql.createConnection(db.dsn);

  try {
    // Vérifier si la plage horaire spécifique est disponible
    const [rows] = await conn.execute(
      "SELECT * FROM Reservation WHERE Court_ID = ? AND Date = ? AND Time = ?",
      [courtId, date, time]
    );

    // Vérifier si l'heure de réservation est entre 10h et 22h
    const reservationDateTime = new Date(`${date} ${time}`);
    const openingHour = 10;
    const closingHour = 22;
    const reservationHour = reservationDateTime.getHours();
    const reservationDay = reservationDateTime.getDay(); // 0 = dimanche, etc
    if (
      reservationDay === 0 ||
      reservationHour < openingHour ||
      reservationHour > closingHour
    ) {
      res.status(400).json({
        msg: "Les réservations ne sont autorisées qu'entre 10h et 22h.",
      });
      return;
    }

    if (rows.length === 0) {
      // La plage horaire est disponible, effectuer la réservation
      await conn.execute(
        "INSERT INTO Reservation (User_ID, Court_ID, Date, Time, Duration) VALUES (?, ?, ?, ?, ?)",
        [userId, courtId, date, time, duration]
      );

      // Mettre à jour le statut du terrain dans la table Court
      await conn.execute("UPDATE Court SET Status = 0 WHERE ID = ?", [courtId]);

      res.redirect(`/courts/court/${courtId}`);
    } else {
      // La plage horaire est déjà réservée
      res.status(400).json({
        msg: "La plage horaire spécifiée est déjà réservée.",
      });
    }
  } catch (error) {
    console.error("Error in /courts/court/:id/reserve route: " + error.stack);
    res.status(500).json({
      msg: "Nous rencontrons des difficultés, merci de réessayer plus tard.",
    });
  } finally {
    conn.end();
  }
});

module.exports = router;
