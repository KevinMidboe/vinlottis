const passport = require("passport");
const path = require("path");
const User = require(path.join(__dirname + "/../schemas/User"));
const router = require("express").Router();

router.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/../public/index.html"));
});

router.get("/register", function(req, res) {
  res.sendFile(path.join(__dirname + "/../public/index.html"));
});

// router.post("/register", function(req, res, next) {
//   User.register(
//     new User({ username: req.body.username }),
//     req.body.password,
//     function(err) {
//       if (err) {
//         if (err.name == "UserExistsError")
//           res.status(409).send({ success: false, message: err.message })
//         else if (err.name == "MissingUsernameError" || err.name == "MissingPasswordError")
//           res.status(400).send({ success: false, message: err.message })
//         return next(err);
//       }

//       return res.status(200).send({ message: "Bruker registrert. Velkommen " + req.body.username, success: true })
//      }
//   );
// });

router.get("/login", function(req, res) {
  res.sendFile(path.join(__dirname + "/../public/index.html"));
});

router.post("/login", function(req, res, next) {
  passport.authenticate("local", function(err, user, info) { 
    if (err) {
      if (err.name == "MissingUsernameError" || err.name == "MissingPasswordError")
        return res.status(400).send({ message: err.message, success: false })
      return next(err);
    }

    if (!user) return res.status(404).send({ message: "Incorrect username or password", success: false })

    req.logIn(user, (err) => {
      if (err) { return next(err) }

      return res.status(200).send({ message: "Velkommen " + user.username, success: true })
    })
  })(req, res, next);
});

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
