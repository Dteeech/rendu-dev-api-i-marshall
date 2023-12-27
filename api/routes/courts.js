var express = require("express");
var router = express.Router();
var db = require("../db");

/* GET courts page. */
router.get("/", async function (req, res, next) {
  // #swagger.summary = "Page des terrains de tennis"

  const conn = await db.mysql.createConnection(db.dsn);

  try {
    const [rows] = await conn.execute(`SELECT * FROM Court`);
    console.log(rows);

    const courts = rows.map((element) => {
      const courtId = element.ID;
      const courtsLink = `/court/courts`;
      const courtLink = `/courts/court/${courtId}`;

      return {
        _links: {
          self: { href: courtsLink },
          previous: { href: "/", title: "Accueil" },
          next: { href: courtLink, title: "Voir le détail du terrain" },
        },
        Name: element.Name,
        Status: element.Status === 1 ? "disponible" : "non disponible",
        UnavailableDays: element.UnavailableDays,
      };
    });

    res.render("courts", {
      title: "RESTful web api",
      courts: courts,
      message: req.session.username,
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
