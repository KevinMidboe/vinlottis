const path = require("path");
const wineRepository = require(path.join(__dirname, "../wine"));

const allWines = (req, res) => {
  // TODO add "includeWinners"
  let { limit } = req.query;

  if (limit && isNaN(limit)) {
    return res.status(400).send({
      message: "If limit query parameter is provided it must be a number",
      success: false
    });
  } else if (!!!isNaN(limit)) {
    limit = Number(limit);
  }

  return wineRepository
    .allWines(limit)
    .then(wines =>
      res.send({
        wines: wines,
        message: `All wines.`,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        success: false,
        message: message || "Unable to fetch all wines."
      });
    });
};

const wineById = (req, res) => {
  const { id } = req.params;

  return wineRepository
    .wineById(id)
    .then(wine => {
      res.send({
        wine,
        success: true
      });
    })
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        message: message || "Unexpected error occured while fetching wine by id.",
        success: false
      });
    });
};

module.exports = {
  allWines,
  wineById
};
