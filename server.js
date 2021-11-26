const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require("path");
const session = require("express-session");
const User = require(path.join(__dirname + "/api/schemas/User"));
global.__base = path.join(__dirname, "/api/");
global.__middleware = path.join(__dirname, "/api/middleware");
global.__controllers = path.join(__dirname, "/api/controllers");

const apiRouter = require(path.join(__dirname + "/api/router.js"));
const subscriptionApi = require(path.join(__dirname + "/api/subscriptions"));

//This is required for the chat to work
const chat = require(path.join(__dirname + "/api/chat"))(io);
const smsGatewayLogs = require(path.join(__dirname + "/api/smsGatewayLogs"))(io);
io.of('/chat', chat)
io.of('/logs/sms-gateway', smsGatewayLogs)

const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);

// mongoose / database
console.log("Trying to connect with mongodb..");
mongoose.promise = global.Promise;
mongoose
  .connect("mongodb://localhost/vinlottis", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // initial connection timeout
  })
  .then(_ => console.log("Mongodb connection established!"))
  .catch(err => {
    console.log(err);
    console.error("ERROR! Mongodb required to run.");
    process.exit(1);
  });
mongoose.set("debug", false);

// middleware
const setupCORS = require(path.join(__dirname, "/api/middleware/setupCORS"));
const setupHeaders = require(path.join(__dirname, "/api/middleware/setupHeaders"));
app.use(setupCORS);
app.use(setupHeaders);

if (process.env.NODE_ENV == "development") {
  console.info(`NODE_ENV=development set, your are now always an authenticated user.`);
  const alwaysAuthenticatedWhenLocalhost = require(path.join(
    __dirname,
    "/api/middleware/alwaysAuthenticatedWhenLocalhost"
  ));

  app.use(alwaysAuthenticatedWhenLocalhost);
}

// parse application/json
app.use(express.json());

const addIdToRequest = require(`${__middleware}/addIdToRequest`);
app.use(addIdToRequest);

app.use(
  session({
    secret: "passport-tutorial",
    cookie: { maxAge: 86400 * 24 * 24 },
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);

app.set("socketio", io); // set io instance to key "socketio"

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
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/service-worker.js", express.static(path.join(__dirname, "public/sw/serviceWorker.js")));

// api endpoints
app.use("/api/", apiRouter);

// push-notifications
app.use("/subscription", subscriptionApi);

// No other route defined, return index file
app.use("/", (req, res) => res.sendFile(path.join(__dirname + "/public/dist/index.html")));

server.listen(30030);
console.log("Server listening on :30030");
