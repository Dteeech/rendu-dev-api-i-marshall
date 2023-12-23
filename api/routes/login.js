const express = require("express");
const router = express.Router();
const db = require("../db");

// Page d'authentification
router.get("/", async (req, res, next) => {
  const { username } = req.body;

  if (!username) {
    res.render("login", { error: "Veuillez fournir un nom d'utilisateur" });
    return;
  }

  const conn = await db.mysql.createConnection(db.dsn);

  try {
    const [rows] = await conn.execute(
      `SELECT Name FROM User WHERE first_name = ?`,
      [username]
    );

    if (rows.length > 0) {
      req.session.username = username;
      res.redirect("/"); // Redirigez l'utilisateur vers la page d'accueil après la connexion
    } else {
      res.render("login", { error: "Nom d'utilisateur incorrect" });
    }
  } catch (error) {
    console.error("Erreur de connexion : " + error.stack);
    res.status(500).json({
      msg: "Nous rencontrons des difficultés, merci de réessayer plus tard.",
    });
  } finally {
    conn.end();
  }
});

module.exports = router;
