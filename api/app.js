//app.js
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
var indexRouter = require("./routes/index");
var courtsRouter = require("./routes/courts");
var loginRouter = require("./routes/login");
var logOutRouter = require("./routes/logout");
var createUserRouter = require("./routes/user");
var courtRouter = require("./routes/court");
var ReservationRouter = require("./routes/reservation");

const checkAuthentication = require("./tools/checkAuthentification");

const session = require("express-session");
const crypto = require("crypto");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/**
 * configuration de la session
 * génère une secret key avec crypto
 *
 */
const secretKey = crypto.randomBytes(32).toString("hex");
app.use(
  session({
    secret: secretKey, // clé secrète de la session
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000,
    },
  })
);

/**
 * Enregistrement des routes
 */
app.use("/login", loginRouter);
app.use("/logout", logOutRouter);
app.use("/register", createUserRouter);
app.use("/courts", courtsRouter);
app.use("/courts/court", checkAuthentication, courtRouter);
app.use("/reservations", ReservationRouter);

app.use("/", indexRouter); // Mettez cette ligne à la fin pour les routes non spécifiées
/**
 * Configuration Swagger, exposition de la doc sur la route /doc
 */
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("Error");
});

module.exports = app;
