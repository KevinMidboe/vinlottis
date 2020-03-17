const express = require("express");
const path = require("path");
const router = express.Router();

const { history, clearHistory } = require(path.join(__dirname + "/../api/redis"));

router.use((req, res, next) => {
  next();
});

router.route("/chat/history").get(async (req, res) => {
  let { skip, take } = req.query;
  skip = !isNaN(skip) ? Number(skip) : undefined;
  take = !isNaN(take) ? Number(take) : undefined;

  try {
    const messages = await history(skip, take);
    res.json(messages)
  } catch(error) {
    res.status(500).send(error);
  }
});

router.route("/chat/history").delete(async (req, res) => {
  try {
    const messages = await clearHistory();
    res.json(messages)
  } catch(error) {
    res.status(500).send(error);
  }
});

module.exports = router;
