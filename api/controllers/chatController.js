const path = require("path");
const { history, clearHistory } = require(path.join(__dirname + "/../redis"));
console.log("loading chat");

const getAllHistory = (req, res) => {
  let { page, limit } = req.query;
  page = !isNaN(page) ? Number(page) : undefined;
  limit = !isNaN(limit) ? Number(limit) : undefined;

  return history(page, limit)
    .then(messages => res.json(messages))
    .catch(error =>
      res.status(500).json({
        message: error.message,
        success: false
      })
    );
};

const deleteHistory = (req, res) => {
  return clearHistory()
    .then(message => res.json(message))
    .catch(error =>
      res.status(500).json({
        message: error.message,
        success: false
      })
    );
};

module.exports = {
  getAllHistory,
  deleteHistory
};
