const path = require("path");
const { history, clearHistory } = require(path.join(__dirname + "/../api/redis"));

const getAllHistory = (req, res) => {
  let { skip, take } = req.query;
  skip = !isNaN(skip) ? Number(skip) : undefined;
  take = !isNaN(take) ? Number(take) : undefined;

  return history(skip, take)
    .then(messages => res.json(messages))
    .catch(error =>  res.status(500).json({
      message: error.message,
      success: false
    }));
};

const deleteHistory = (req, res) => {
  return clearHistory()
    .then(message => res.json(message))
    .catch(error => res.status(500).json({
      message: error.message,
      success: false
    }));
};

module.exports = {
  getAllHistory,
  deleteHistory
};
