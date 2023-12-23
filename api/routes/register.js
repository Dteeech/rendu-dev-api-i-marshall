const express = require("express");
const router = express.Router();
const db = "../db";

/*
 *Route get pour accéder à la route de regiser
 */
router.get("/", function (req, res, next) {
  res.render("register", { message: "Bienvenue sur la page d'inscription" });
});

/*
 *route post pour ajouter un user
 */
router.post("/", function (req, res, next) {});
