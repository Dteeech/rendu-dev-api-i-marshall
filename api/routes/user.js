const express = require("express");
const router = express.Router();
const db = require("../db");

// Page de création de compte (formulaire)
router.get("/", async function (req, res, next) {
  console.log("Entrée dans la route /createUser");
  res.render("createUser", {
    message: "Bonjour, veuillez créer votre compte pour pouvoir réserver !",
  });
});

// Authentification de l'utilisateur (traitement du formulaire soumis)
router.post("/", async function (req, res, next) {
  // se connecter à la bdd
  const conn = await db.mysql.createConnection(db.dsn);

  console.log(req.body);

  const { username } = req.body;
  console.log(username);
  try {
    //on vérifie si l'utilisateur existe déjà en bdd
    console.log("dans le try");
    const [existingUser] = await conn.execute(
      `SELECT * FROM User WHERE first_name = ?`,
      [username]
    );

    if (existingUser.length > 0) {
      console.log("verification nom existe déjà en bdd");
      res.render("createUser", {
        error: `le nom d'utilisateur ${username} existe déjà`,
      });
      return;
    }
    // faire une requete post pour créer un nouvel utilisateur
    const [rows] = await conn.execute(
      `INSERT into User (first_name) VALUES(?)`,
      [username]
    );
    //renvoyer une res sous forme json hal
    res.render("createUser", {
      message: `votre nom ${username} a bien été créé en BDD`,
    });
  } catch (error) {
    console.log("dans le catch");
    console.error("Erreur de création de compte: " + error.stack);
    res.status(500).json({
      msg: "Nous rencontrons des difficultés, merci de réessayer plus tard.",
    });
  } finally {
    conn.end();
  }
});

module.exports = router;
