const checkIsAdmin = (req, res, next) => {
  if (req.session.username === "admybad") {
    next();
  } else {
    res.status(403).send("Accès interdit");
  }
};

module.exports = checkIsAdmin;
