var express = require("express");
var router = express.Router();
var db = require("../db");

/* GET courts page. */
router.get("/", async function (req, res, next) {
  // #swagger.summary = "Page des terrains de tennis"

  const conn = await db.mysql.createConnection(db.dsn);

  /*
   *fonction qui détermine si ouvert ou fermé
   * jours et heure
   * si Dimanche ferme
   * lundi a samedi
   */
  // const isOpen = () => {
  //   const openingHours = {
  //     monday: { open: "10:00", close: "22:00" },
  //     tuesday: { open: "10:00", close: "22:00" },
  //     wednesday: { open: "10:00", close: "22:00" },
  //     thursday: { open: "10:00", close: "22:00" },
  //     friday: { open: "10:00", close: "22:00" },
  //     saturday: { open: "10:00", close: "22:00" },
  //     sunday: { open: null, close: null }, // Fermeture le dimanche
  //   };

  //   const today = new Date().toLocaleDateString("fr-FR", {
  //     weekday: "lowercase",
  //   });

  //   if (openingHours[today]) {
  //     const { open, close } = openingHours[today];
  //     if (open && close) {
  //       // Vérifiez si actuellement dans les heures d'ouverture
  //       const currentTime = new Date().toLocaleTimeString("en-US", {
  //         hour: "2-digit",
  //         minute: "2-digit",
  //       });
  //       if (currentTime >= open && currentTime <= close) {
  //         console.log("Le magasin est ouvert !");
  //       } else {
  //         console.log("Le magasin est fermé.");
  //       }
  //     } else {
  //       console.log("Le magasin est fermé aujourd'hui.");
  //     }
  //   } else {
  //     console.log("Le jour actuel n'a pas de données d'ouverture définies.");
  //   }
  // };

  try {
    const [rows] = await conn.execute(`SELECT * FROM Court`);
    console.log(rows);

    const courts = rows.map((element) => {
      return {
        Name: element.Name,
        Status: element.Status === 1 ? "disponible" : "non disponible",
        UnavailableDays: element.UnavailableDays,
      };
    });
    isOpen();

    res.render("courts", {
      title: "RESTful web api",
      courts: courts,
    });
    console.log("Fin de la route /courts avec succès");
  } catch (error) {
    console.error("Error connecting: " + error.stack);
    res.status(500).json({
      msg: "Nous rencontrons des difficultés, merci de réessayer plus tard.",
    });
  } finally {
    conn.end(); // Assurez-vous de toujours fermer la connexion à la base de données
  }
});

module.exports = router;
