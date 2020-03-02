const express = require("express");
const path = require("path");
const router = express.Router();
const webpush = require("web-push"); //requiring the web-push module
const mongoose = require("mongoose");
const schedule = require("node-schedule");

mongoose.connect("mongodb://localhost:27017/vinlottis", {
  useNewUrlParser: true
});

const config = require(path.join(__dirname + "/../config/env/push"));
const Subscription = require(path.join(__dirname + "/../schemas/Subscription"));
const lotteryConfig = require(path.join(
  __dirname + "/../config/env/lottery.config"
));

router.use((req, res, next) => {
  next();
});

if (!config.publicKey) {
  console.error(
    "You are missing the push-setup! Server will continue running even without this."
  );
  module.exports = router;
  return;
}

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

  const message = JSON.stringify({
    message: req.body.message,
    title: "Vinlotteri!"
  });
  let subs = await Subscription.find();
  for (let i = 0; i < subs.length; i++) {
    let subscription = subs[i]; //get subscription from your databse here.
    sendNotification(subscription, message);
  }
  res.json(true);
  return;
});

schedule.scheduleJob(
  `0 50 ${lotteryConfig.hours - 1} * * ${lotteryConfig.date}`,
  async () => {
    let subs = await Subscription.find();
    for (let i = 0; i < subs.length; i++) {
      let subscription = subs[i]; //get subscription from your databse here.
      const message = JSON.stringify({
        message: "Husk vinlotteriet, det begynner om 10 minutter!",
        title: "Vinlotteri!"
      });
      sendNotification(subscription, message);
    }
  }
);

module.exports = router;
module.exports.sendNotification = sendNotification;
