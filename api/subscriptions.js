const express = require("express");
const path = require("path");
const router = express.Router();
const webpush = require("web-push"); //requiring the web-push module
const mongoose = require("mongoose");
const schedule = require("node-schedule");

mongoose.connect("mongodb://localhost:27017/vinlottis", {
  useNewUrlParser: true
});

const config = require(path.join(__dirname + "/../config/env/push.config"));
const Subscription = require(path.join(__dirname + "/../schemas/Subscription"));
const lotteryConfig = require(path.join(
  __dirname + "/../config/env/lottery.config"
));

const vapidKeys = {
  publicKey: config.publicKey,
  privateKey: config.privateKey
};
//setting our previously generated VAPID keys
webpush.setVapidDetails(
  config.mailto,
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const sendNotification = (subscription, dataToSend = "") => {
  try {
    webpush.sendNotification(subscription, dataToSend);
  } catch (e) {
    console.log("error", e);
  }
};

router.use((req, res, next) => {
  next();
});

router.route("/save-subscription").post(async (req, res) => {
  const subscription = req.body;
  await saveToDatabase(subscription); //Method to save the subscription to Database
  res.json({ message: "success" });
});

const saveToDatabase = async subscription => {
  let found = await Subscription.find({
    endpoint: subscription.endpoint,
    "keys.p256dh": subscription.keys.p256dh,
    "keys.auth": subscription.keys.auth
  });

  if (found.length > 0) {
    return;
  } else {
    let newSubscription = new Subscription(subscription);
    await newSubscription.save();
  }
};

router.route("/send-notification").post(async (req, res) => {
  if (!req.isAuthenticated()) {
    res.send(false);
    return;
  }
  const message = req.body.message;
  let subs = await Subscription.find();
  for (let i = 0; i < subs.length; i++) {
    let subscription = subs[i]; //get subscription from your databse here.
    sendNotification(subscription, message);
  }
});

schedule.scheduleJob(
  `0 50 ${lotteryConfig.hours - 1} * * ${lotteryConfig.date}`,
  async () => {
    let subs = await Subscription.find();
    for (let i = 0; i < subs.length; i++) {
      let subscription = subs[i]; //get subscription from your databse here.
      const message = "Husk vinlotteriet, det begynner om 10 minutter!";
      sendNotification(subscription, message);
    }
  }
);

module.exports = router;
