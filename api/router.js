const express = require("express");
const path = require("path");

const mustBeAuthenticated = require(path.join(__dirname, "/middleware/mustBeAuthenticated"));
const setAdminHeaderIfAuthenticated = require(path.join(__dirname, "/middleware/setAdminHeaderIfAuthenticated"));

const requestController = require(path.join(__dirname, "/controllers/requestController"));
const vinmonopoletController = require(path.join(__dirname, "/controllers/vinmonopoletController"));
const chatController = require(path.join(__dirname, "/controllers/chatController"));
const userController = require(path.join(__dirname, "/controllers/userController"));
const historyController = require(path.join(__dirname, "/controllers/historyController"));
const attendeeController = require(path.join(__dirname, "/controllers/lotteryAttendeeController"));
const prelotteryWineController = require(path.join(__dirname, "/controllers/lotteryWineController"));
const winnerController = require(path.join(__dirname, "/controllers/lotteryWinnerController"));
const lotteryController = require(path.join(__dirname, "/controllers/lotteryController"));
const prizeDistributionController = require(path.join(__dirname, "/controllers/prizeDistributionController"));
const wineController = require(path.join(__dirname, "/controllers/wineController"));
const messageController = require(path.join(__dirname, "/controllers/messageController"));

const router = express.Router();

router.get("/vinmonopolet/wine/search", vinmonopoletController.searchWines);
router.get("/vinmonopolet/wine/by-ean/:ean", vinmonopoletController.wineByEAN);
router.get("/vinmonopolet/wine/by-id/:id", vinmonopoletController.wineById);
router.get("/vinmonopolet/stores/", vinmonopoletController.allStores);
router.get("/vinmonopolet/stores/search", vinmonopoletController.searchStores);

router.get("/requests", setAdminHeaderIfAuthenticated, requestController.allRequests);
router.post("/request", requestController.addRequest);
router.delete("/request/:id", mustBeAuthenticated, requestController.deleteRequest);

router.get("/wines", wineController.allWines); // sort = by-date, by-name, by-occurences
router.get("/wine/:id", wineController.wineById); // sort = by-date, by-name, by-occurences
// router.update("/wine/:id", mustBeAuthenticated, wineController.update);

router.get("/history", historyController.all);
router.get("/history/latest", historyController.latest);
router.get("/history/by-wins/", historyController.orderByWins);
router.get("/history/by-color/", historyController.groupByColor);
router.get("/history/by-date/:date", historyController.byDate);
router.get("/history/by-name/:name", historyController.byName);
router.get("/history/search/", historyController.search);
router.get("/history/by-date/", historyController.groupByDate);

// router.get("/purchases", purchaseController.lotteryPurchases);
// // returns list per date and count of each colors that where bought
// router.get("/purchases/summary", purchaseController.lotteryPurchases);
// // returns total, wins?, stolen
// router.get("/purchase/:date", purchaseController.lotteryPurchaseByDate);

router.get("/lottery/wines", prelotteryWineController.allWines);
router.get("/lottery/wine/schema", mustBeAuthenticated, prelotteryWineController.wineSchema);
router.get("/lottery/wine/:id", mustBeAuthenticated, prelotteryWineController.wineById);
router.post("/lottery/wines", mustBeAuthenticated, prelotteryWineController.addWines);
router.delete("/lottery/wines", mustBeAuthenticated, prelotteryWineController.deleteWines);
router.put("/lottery/wine/:id", mustBeAuthenticated, prelotteryWineController.updateWineById);
router.delete("/lottery/wine/:id", mustBeAuthenticated, prelotteryWineController.deleteWineById);

router.get("/lottery/attendees", setAdminHeaderIfAuthenticated, attendeeController.allAttendees);
router.delete("/lottery/attendees", mustBeAuthenticated, attendeeController.deleteAttendees);
router.post("/lottery/attendee", mustBeAuthenticated, attendeeController.addAttendee);
router.put("/lottery/attendee/:id", mustBeAuthenticated, attendeeController.updateAttendeeById);
router.delete("/lottery/attendee/:id", mustBeAuthenticated, attendeeController.deleteAttendeeById);

router.get("/lottery/winners", winnerController.allWinners);
router.get("/lottery/winner/:id", winnerController.winnerById);
router.post("/lottery/winners", mustBeAuthenticated, winnerController.addWinners);
router.delete("/lottery/winners", mustBeAuthenticated, winnerController.deleteWinners);
router.put("/lottery/winner/:id", mustBeAuthenticated, winnerController.updateWinnerById);
router.delete("/lottery/winner/:id", mustBeAuthenticated, winnerController.deleteWinnerById);

router.get("/lottery/draw", mustBeAuthenticated, lotteryController.drawWinner);
router.post("/lottery/archive", mustBeAuthenticated, lotteryController.archiveLottery);
router.get("/lottery/latest", lotteryController.latestLottery);
router.get("/lottery/:epoch", lotteryController.lotteryByDate);
router.get("/lotteries/", lotteryController.allLotteries);

// router.get("/lottery/prize-distribution/status", mustBeAuthenticated, prizeDistributionController.status);
router.post("/lottery/prize-distribution/start", mustBeAuthenticated, prizeDistributionController.start);
// router.post("/lottery/prize-distribution/stop", mustBeAuthenticated, prizeDistributionController.stop);
router.get("/lottery/prize-distribution/prizes/:id", prizeDistributionController.getPrizesForWinnerById);
router.post("/lottery/prize-distribution/prize/:id", prizeDistributionController.submitPrizeForWinnerById);

router.post("/lottery/messages/winner/:id", mustBeAuthenticated, messageController.notifyWinnerById);

router.get("/chat/history", chatController.getAllHistory);
router.delete("/chat/history", mustBeAuthenticated, chatController.deleteHistory);

router.post("/login", userController.login);

router.get("/logout", userController.logout);
if(process.env !== "production") {
    // We don't want to hide registering behind a
    // authentication-wall if we are in dev
    router.post("/register", userController.register);
} else {
    router.post("/register", mustBeAuthenticated, userController.register);
}

// router.get("/", documentation.apiInfo);

// router.get("/wine/schema", mustBeAuthenticated, update.schema);
// router.get("/purchase/statistics", retrieve.allPurchase);
// router.get("/highscore/statistics", retrieve.highscore);
// router.get("/wines/statistics", retrieve.allWines);
// router.get("/wines/statistics/overall", retrieve.allWinesSummary);

module.exports = router;
