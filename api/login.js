const passport = require("passport");
const path = require("path");
const User = require(path.join(__dirname + "/../schemas/User"));
const router = require("express").Router();

router.get("/", function(req, res) {
  console.log("here", req.isAuthenticated());
  if (!req.isAuthenticated()) {
    res.sendFile(path.join(__dirname + "/../public/login.html"));
    return;
  }
  res.sendFile(path.join(__dirname + "/../public/index.html"));
});

router.get("/register", function(req, res) {
  res.sendFile(path.join(__dirname + "/../public/register.html"));
});

router.post("/register", function(req, res, next) {
  console.log("registering user");
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    function(err) {
      if (err) {
        console.log("error while user register!", err);
        return next(err);
      }

      console.log("user registered!");

      res.redirect("/");
    }
  );
});

router.get("/login", function(req, res) {
  res.sendFile(path.join(__dirname + "/../public/login.html"));
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login"
  }),
  function(req, res) {
    res.redirect("/");
  }
);

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
