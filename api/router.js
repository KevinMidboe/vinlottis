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

router.get("/wineinfo/schema", mustBeAuthenticated, update.schema);
router.get("/wineinfo/:ean", wineinfo.byEAN);

router.post("/log/wines", mustBeAuthenticated, update.submitWines);
router.post("/lottery", update.submitLottery);
router.post("/lottery/wines", update.submitWinesToLottery);
// router.delete("/lottery/wine/:id", update.deleteWineFromLottery);
router.post("/lottery/winners", update.submitWinnersToLottery);

router.get("/wines/prelottery", retrieve.prelotteryWines);
router.get("/purchase/statistics", retrieve.allPurchase);
router.get("/purchase/statistics/color", retrieve.purchaseByColor);
router.get("/highscore/statistics", retrieve.highscore)
router.get("/wines/statistics", retrieve.allWines);
router.get("/wines/statistics/overall", retrieve.allWinesSummary);

router.get("/lottery/all", lottery.all);
router.get("/lottery/latest", lottery.latest);
router.get("/lottery/by-date/:date", lottery.byEpochDate);
router.get("/lottery/by-name/:name", lottery.byName);

router.delete('/virtual/winner/all', mustBeAuthenticated, virtualApi.deleteWinners);
router.delete('/virtual/attendee/all', mustBeAuthenticated, virtualApi.deleteAttendees);
router.get('/virtual/winner/draw', virtualApi.drawWinner);
router.get('/virtual/winner/all', virtualApi.winners);
router.get('/virtual/winner/all/secure', mustBeAuthenticated, virtualApi.winnersSecure);
router.post('/virtual/finish', mustBeAuthenticated, virtualApi.finish);
router.get('/virtual/attendee/all', virtualApi.attendees);
router.get('/virtual/attendee/all/secure', mustBeAuthenticated, virtualApi.attendeesSecure);
router.post('/virtual/attendee/add', mustBeAuthenticated, virtualApi.addAttendee);

router.post('/winner/notify/:id', virtualRegistrationApi.sendNotificationToWinnerById);
router.get('/winner/:id', virtualRegistrationApi.getWinesToWinnerById);
router.post('/winner/:id', virtualRegistrationApi.registerWinnerSelection);

// router.use("/api/", updateApi);
// router.use("/api/", retrieveApi);
// router.use("/api/", wineinfoApi);
// router.use("/api/lottery", lottery);
// router.use("/virtual-registration/", virtualRegistrationApi);

module.exports = router;
