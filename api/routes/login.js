const express = require("express");
const router = express.Router();
const db = require("../db");
const { halLinkObject } = require("../hal");

// Page d'authentification
router.get("/", async function (req, res, next) {
  const selfLink = halLinkObject("/login");
  const nextLink = halLinkObject("/register");
  const profileLink = halLinkObject("/profile/user");
  const createLink = halLinkObject(
    "/create-user",
    "POST",
    "créer un nouvel utilisateur",
    false,
    "permet de créer un nouvel utilisateur"
  );

  const halRepresentation = {
    _links: {
      self: selfLink,
      next: nextLink,
      profile: profileLink,
      create: createLink,
    },
    message: "Bonjour, veuillez créer votre compte pour pouvoir réserver !",
  };

  res.render("createUser", {
    title: "Titre de votre page",
    _links: halRepresentation._links,
    message: halRepresentation.message,
  });
});

// Authentification de l'utilisateur (traitement du formulaire soumis)
router.post("/", async function (req, res, next) {
  const conn = await db.mysql.createConnection(db.dsn);

  const { username } = req.body;

  console.log("req.body:", req.body);
  console.log("username:", username);

  if (!username) {
    res.render("login", { error: "Veuillez fournir un nom d'utilisateur" });
    return;
  }

  try {
    const [rows] = await conn.execute(
      `SELECT first_name FROM User WHERE first_name = ?`,
      [username]
    );
    console.log("Rows:", rows);

    if (rows.length > 0 || rows.data) {
      if (username === "admybad") {
        username = "admybad";
        req.session.username = username;
        // on va réserver la route pour modifier la disponibilité à l'admin via l'uri ->
        res.redirect("/admin/courts");
      }

      req.session.username = username; // on enregistre le nom dans la session

      res.redirect("/reservation");
      // Redirige l'utilisateur vers la page d'accueil après la connexion
      res.render("login", {
        message: `vous êtes connecté ${username}`,
      });
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
