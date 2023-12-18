var express = require("express");
var router = express.Router();
var db = require("../db");

/* GET courts page. */
router.get("/courts", async function (req, res, next) {
  // #swagger.summary = "Page des terrains de tennis"

  const conn = await db.mysql.createConnection(db.dsn);

  try {
    const [rows] = await conn.execute(`SELECT * FROM tennis_court`);

    const courts = rows.map((element) => {
      return {
        name: element.name,
        status: element.status,
        daysAvailable: element.daysAvailable,
      };
    });
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
