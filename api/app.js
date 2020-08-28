const express = require("express");
const path = require("path");

// Middleware
const mustBeAuthenticated = require(__dirname + "/../middleware/mustBeAuthenticated");

const update = require(path.join(__dirname + "/update"));
const retrieve = require(path.join(__dirname + "/retrieve"));
const subscriptionApi = require(path.join(__dirname + "/subscriptions"));
const loginApi = require(path.join(__dirname + "/login"));
const wineinfo = require(path.join(__dirname + "/wineinfo"));
const virtualApi = require(path.join(__dirname + "/virtualLottery"));
const virtualRegistrationApi = require(path.join(
  __dirname + "/virtualRegistration"
));
const lottery = require(path.join(__dirname + "/lottery"));


const router = express.Router();

router.get("/wineinfo/:ean", wineinfo.byEAN);

router.post("/log/wines", mustBeAuthenticated, update.submitWines);
router.get("/wineinfo/schema", update.schema);
router.post("/log", mustBeAuthenticated, update.submitLottery);

router.get("wines/prelottery", retrieve.prelotteryWines);
router.get("/purchases/statistics", retrieve.allPurchase);
router.get("/purchases/statistics/color", retrieve.purchaseByColor);
router.get("/highscore/statistics", retrieve.highscore)
router.get("/wines/statistics", retrieve.allWines);
router.get("/wines/statistics/overall", retrieve.allWinesSummary);

router.get("/lottery/all", lottery.all);
router.get("/lottery/latest", lottery.latest);
router.get("/lottery/by-date/:date", lottery.byEpochDate);
router.get("/lottery/by-name/:name", lottery.byName);

router.delete('/winners', mustBeAuthenticated, virtual.removeWinners);
router.delete('/attendees', mustBeAuthenticated, virtual.removeAttendees);
router.get('/winners', virtual.winners);
router.get('/winners/secure', mustBeAuthenticated, virtual.winnersSecure);
router.post('/finish', mustBeAuthenticated, virtual.finish);
router.get('/attendee/all', virtual.attendees);
router.get('/attendee/all/secure', mustBeAuthenticated, virtual.attendeesSecure);
router.post('attendee/add', mustBeAuthenticated, virtual.addAttendee);

// router.use("/api/", updateApi);
// router.use("/api/", retrieveApi);
// router.use("/api/", wineinfoApi);
// router.use("/api/lottery", lottery);
// router.use("/api/virtual-registration/", virtualRegistrationApi);

module.exports = router;
