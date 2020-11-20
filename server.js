const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require("path");
const session = require("express-session");
const User = require(path.join(__dirname + "/schemas/User"));

const apiRouter = require(path.join(__dirname + "/api/router.js"));
const subscriptionApi = require(path.join(__dirname + "/api/subscriptions"));

//This is required for the chat to work
const chat = require(path.join(__dirname + "/api/chat"))(io);

const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);

// mongoose / database
mongoose.promise = global.Promise;
mongoose.connect("mongodb://localhost/vinlottis", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000 // initial connection timeout
}).then(_ => console.log("Mongodb connection established!"))
.catch(err => {
  console.log(err);
  console.error("ERROR! Mongodb required to run.");
  process.exit(1);
})
mongoose.set("debug", process.env.NODE_ENV === "development");

// middleware
const setupCORS = require(path.join(__dirname, "/middleware/setupCORS"));
const setupHeaders = require(path.join(__dirname, "/middleware/setupHeaders"));
app.use(setupCORS)
app.use(setupHeaders)

// parse application/json
app.use(express.json());

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

app.set('socketio', io);

const passport = require("passport");
const LocalStrategy = require("passport-local");

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// files
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/dist", express.static(path.join(__dirname, "dist")));

// api endpoints
app.use("/api/", apiRouter);

// redirects
app.get("/dagens", (req, res) => res.redirect("/#/dagens"));
app.get("/winner/:id", (req, res) => res.redirect("/#/winner/" + req.params.id));

// push-notifications & service workers
app.use("/subscription", subscriptionApi);
app.use("/service-worker.js", function(req, res) {
  if (process.env.NODE_ENV == "development") {
    return res.end(); // cancel serving service worker if localhost
  }
  res.sendFile(path.join(__dirname, "src/serviceWorker.js"));
});

app.use("/", (req, res) => res.sendFile(path.join(__dirname + "/dist/index.html")));

server.listen(30030);
