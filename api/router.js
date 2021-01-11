const express = require("express");
const path = require("path");

const mustBeAuthenticated = require(path.join(__dirname, "/middleware/mustBeAuthenticated"));
const setAdminHeaderIfAuthenticated = require(path.join(__dirname, "/middleware/setAdminHeaderIfAuthenticated"));

const update = require(path.join(__dirname, "/update"));
const retrieve = require(path.join(__dirname, "/retrieve"));
const request = require(path.join(__dirname, "/request"));
const subscriptionApi = require(path.join(__dirname, "/subscriptions"));
const userApi = require(path.join(__dirname, "/user"));
const wineinfo = require(path.join(__dirname, "/wineinfo"));
const virtualApi = require(path.join(__dirname, "/virtualLottery"));
const virtualRegistrationApi = require(path.join(
  __dirname, "/virtualRegistration"
));
const lottery = require(path.join(__dirname, "/lottery"));
const chatHistoryApi = require(path.join(__dirname, "/chatHistory"));
const githubController = require(path.join(__dirname, "/controllers/githubController"));

const router = express.Router();

router.get("/wineinfo/search", wineinfo.wineSearch);

router.get("/request/all", setAdminHeaderIfAuthenticated, request.getAllRequestedWines);
router.post("/request/new-wine", request.requestNewWine);
router.delete("/request/:id", request.deleteRequestedWineById);

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

router.get('/chat/history', chatHistoryApi.getAllHistory)
router.delete('/chat/history', mustBeAuthenticated, chatHistoryApi.deleteHistory)

router.get("/project/contributors", githubController.getProjectContributors);

router.post('/login', userApi.login);
router.post('/register', mustBeAuthenticated, userApi.register);
router.get('/logout', userApi.logout);

module.exports = router;
