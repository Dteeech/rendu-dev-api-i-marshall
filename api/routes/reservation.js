const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all reservations
router.get("/", async function (req, res, next) {
  const conn = await db.mysql.createConnection(db.dsn);

  try {
    // Récupération des réservations
    const [rows] = await conn.execute("SELECT * FROM Reservation");

    const reservations = rows.map((element) => {
      return {
        _links: {
          self: { href: `/reservations/${element.ID}` },
          update: {
            href: `/reservations/${element.ID}`,
            method: "PUT",
            title: "Mettre à jour la réservation",
          },
          delete: {
            href: `/reservations/${element.ID}`,
            method: "DELETE",
            title: "Supprimer la réservation",
          },
        },
        ID: element.ID,
        User_ID: element.User_ID,
        Terrain_ID: element.Terrain_ID,
        DateTimeStart: element.Date + " " + element.Time,
        Duration: element.Duration,
      };
    });

    res.render("reservations", {
      title: "Liste des Reservations",
      message: "Hello",
      reservations: reservations,
    });
  } catch (error) {
    console.error("Error connecting: " + error.stack);
    res.status(500).json({
      msg: "Nous rencontrons des difficultés, merci de réessayer plus tard.",
    });
  } finally {
    // Fermer la connexion après utilisation
    conn.end();
  }
});

// GET details de la réservation par ID
router.get("/:id", async function (req, res, next) {
  const reservationId = req.params.id;
  const conn = await db.mysql.createConnection(db.dsn);

  try {
    // Récupération des détails de la réservation spécifiée par l'ID
    const [reservationRows] = await conn.execute(
      "SELECT * FROM Reservation WHERE ID = ?",
      [reservationId]
    );

    // Si une réservation est trouvée, la renvoyer en format Pug
    if (reservationRows.length > 0) {
      const reservationDetails = reservationRows[0];

      res.render("reservation", {
        title: `Détails de la réservation ${reservationDetails.ID}`,
        reservation: {
          ID: reservationDetails.ID,
          User_ID: reservationDetails.User_ID,
          Terrain_ID: reservationDetails.Terrain_ID,
          DateTimeStart:
            reservationDetails.Date + " " + reservationDetails.Time,
          Duration: reservationDetails.Duration,
        },
        message: req.session.username,
      });
    } else {
      // Si aucune réservation n'est trouvée, renvoyer une réponse appropriée
      res.status(404).json({ msg: "Reservation not found." });
    }
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res.status(500).json({
      msg: "Nous rencontrons des difficultés, merci de réessayer plus tard.",
    });
  } finally {
    conn.end();
  }
});

// PUT update details of a specific reservation
router.put("/:id", async function (req, res, next) {
  const reservationId = req.params.id;
  const { userId, courtId, reservationDate, reservationTime, duration } =
    req.body;
  const conn = await db.mysql.createConnection(db.dsn);

  try {
    // Vérification de l'existence de la réservation
    const [checkRows] = await conn.execute(
      "SELECT * FROM Reservation WHERE ID = ?",
      [reservationId]
    );

    if (checkRows.length === 0) {
      res.status(404).json({ msg: "Reservation not found." });
      return;
    }

    // Mise à jour des détails de la réservation
    const [updateResult] = await conn.execute(
      "UPDATE Reservation SET User_ID = ?, Court_ID = ?, Date = ?, Time = ?, Duration = ? WHERE ID = ?",
      [
        userId,
        courtId,
        reservationDate,
        reservationTime,
        duration,
        reservationId,
      ]
    );

    // Vérification si la mise à jour a réussi
    if (updateResult.affectedRows > 0) {
      res.status(200).json({ msg: "Reservation updated successfully." });
    } else {
      res.status(500).json({ msg: "Failed to update reservation." });
    }
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res.status(500).json({
      msg: "Nous rencontrons des difficultés, merci de réessayer plus tard.",
    });
  } finally {
    conn.end();
  }
});

// DELETE a specific reservation
router.delete("/:id", async function (req, res, next) {
  const reservationId = req.params.id;
  const userId = req.session.userId; // Obtenez l'ID de l'utilisateur depuis la session
  const conn = await db.mysql.createConnection(db.dsn);

  try {
    // Fetch the reservation details for the specified user
    const [reservationRows] = await conn.execute(
      "SELECT * FROM Reservation WHERE ID = ? AND User_ID = ?",
      [reservationId, userId]
    );

    // Check if the reservation exists for the specified user
    if (reservationRows.length === 0) {
      res.status(404).json({ msg: "Reservation not found." });
      return;
    }

    const reservationDetails = reservationRows[0];
    const courtId = reservationDetails.Court_ID;

    // Delete the reservation
    const [deleteResult] = await conn.execute(
      "DELETE FROM Reservation WHERE ID = ?",
      [reservationId]
    );

    // Check if the deletion was successful
    if (deleteResult.affectedRows > 0) {
      // Update the court availability to 1 (available)
      const [updateCourtResult] = await conn.execute(
        "UPDATE Courts SET Status = 1 WHERE ID = ?",
        [courtId]
      );

      if (updateCourtResult.affectedRows > 0) {
        res.status(200).json({ msg: "Reservation deleted successfully." });
      } else {
        res.status(500).json({ msg: "Failed to update court availability." });
      }
    } else {
      res.status(500).json({ msg: "Failed to delete reservation." });
    }
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res.status(500).json({
      msg: "Nous rencontrons des difficultés, merci de réessayer plus tard.",
    });
  } finally {
    conn.end();
  }
});

module.exports = router;
