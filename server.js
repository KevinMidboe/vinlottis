const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const User = require(path.join(__dirname + "/schemas/User"));

const updateApi = require(path.join(__dirname + "/api/update"));
const retrieveApi = require(path.join(__dirname + "/api/retrieve"));
const loginApi = require(path.join(__dirname + "/api/login"));
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const cors = require("cors");

const referrerPolicy = require("referrer-policy");
const helmet = require("helmet");
const featurePolicy = require("feature-policy");

const compression = require("compression");
app.use(compression());

app.use(
  featurePolicy({
    features: {
      fullscreen: ["*"],
      //vibrate: ["'none'"],
      payment: ["'none'"],
      microphone: ["'none'"],
      camera: ["'none'"],
      speaker: ["*"],
      syncXhr: ["'self'"]
      //notifications: ["'self'"]
    }
  })
);
app.use(helmet());
app.use(helmet.frameguard({ action: "sameorigin" }));
app.use(referrerPolicy({ policy: "origin" }));

app.use(cors());
mongoose.promise = global.Promise;
mongoose.connect("mongodb://localhost/vinlottis");
mongoose.set("debug", true);

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.use(
  session({
    secret: "passport-tutorial",
    cookie: { maxAge: 86400 * 24 * 24 },
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);

const passport = require("passport");
const LocalStrategy = require("passport-local");

app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/dist", express.static(path.join(__dirname, "public/dist")));
app.use("/", loginApi);
app.use("/api/", updateApi);
app.use("/api/", retrieveApi);

app.use("/service-worker.js", function(req, res) {
  res.sendFile(path.join(__dirname, "public/service-worker.js"));
});

app.listen(30030);
