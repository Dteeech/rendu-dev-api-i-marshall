const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async function (req, res) {
  const conn = await db.mysql.createConnection(db.dsn);
  // Vérifiez si l'utilisateur est authentifié en consultant la session
  if (req.session.username) {
    // L'utilisateur est authentifié, accédez à l'information de session
    const username = req.session.username;
    res.send(`Bienvenue sur le profil, ${username}!`);
  } else {
    // L'utilisateur n'est pas authentifié, redirigez-le vers la page de connexion
    res.redirect("/login");
    res.render("login", { message: "L'utilisateur n'est pas authentifié" });
  }
});

router.post("/", function (req, res) {});

module.exports = router;
