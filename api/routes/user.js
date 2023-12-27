const express = require("express");
const router = express.Router();
const db = require("../db");

// Page de création de compte (formulaire)
router.get("/", async function (req, res, next) {
  const halRepresentation = {
    _links: {
      self: { href: "/register" },
      previous: { href: "/", title: "home" },
      next: {
        href: "/login",
        title: "login",
      },
      profile: { href: "/profile/user" },
      create: {
        href: "/register",
        method: "POST",
        title: "Créer un nouvel utilisateur",
        templated: false,
        description: "Permet de créer un nouvel utilisateur",
      },
    },
    message: "Bonjour, veuillez créer votre compte pour pouvoir réserver !",
  };

  res.render("createUser", {
    title: "Créer un compte",
    _links: halRepresentation._links,
    message: halRepresentation.message,
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
    const successResponse = {
      _links: {
        self: selfLink,
      },
      message: `votre nom ${username} a bien été créé en BDD`,
    };
    res.status(201).json(successResponse);
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
