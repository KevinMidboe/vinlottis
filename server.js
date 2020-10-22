const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require("path");
const session = require("express-session");
const User = require(path.join(__dirname + "/schemas/User"));

const apiRouter = require(path.join(__dirname + "/api/router.js"));

const loginApi = require(path.join(__dirname + "/api/login"));
const subscriptionApi = require(path.join(__dirname + "/api/subscriptions"));

//This is required for the chat to work
const chat = require(path.join(__dirname + "/api/chat"))(io);
const chatHistory = require(path.join(__dirname + "/api/chatHistory"));

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

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/dist", express.static(path.join(__dirname, "public/dist")));
app.use("/", loginApi);
app.use("/api/", chatHistory);
app.use("/api/", apiRouter);
app.use("/subscription", subscriptionApi);

app.get("/dagens", function(req, res) {
  res.redirect("/#/dagens");
});
app.get("/winner/:id", function(req, res) {
  res.redirect("/#/winner/" + req.params.id);
});

app.use("/service-worker.js", function(req, res) {
  res.sendFile(path.join(__dirname, "public/sw/serviceWorker.js"));
});

server.listen(30030);
