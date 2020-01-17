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
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
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

app.use("/", loginApi);
app.use("/api/", updateApi);
app.use("/api/", retrieveApi);

app.listen(30030);
