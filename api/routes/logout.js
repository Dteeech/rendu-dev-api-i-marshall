const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      console.error("Erreur lors de la déconnexion : " + err.stack);
    }
    res.redirect("/login");
  });
});

module.exports = router;
