const express = require("express");
const router = express.Router();
const db = require("../db");

// Authentification de l'utilisateur (traitement du formulaire soumis)
router.post("/", async function (req, res, next) {
  const conn = await db.mysql.createConnection(db.dsn);

  const { username } = req.body;
  console.log(username);

  if (!username) {
    res.render("login", { error: "Veuillez fournir un nom d'utilisateur" });
    return;
  }

  try {
    const [rows] = await conn.execute(
      `SELECT first_name FROM User WHERE username = ?`,
      [username]
    );
    console.log("Rows:", rows);

    if (rows.length > 0) {
      req.session.username = username;
      res.redirect("/");
      // Redirige l'utilisateur vers la page d'accueil après la connexion
      console.log("vous êtes connecté");
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
