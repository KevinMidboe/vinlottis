const path = require("path");
const lotteryRepository = require(path.join(__dirname, "../lottery"));

const allWines = (req, res) => {
  return lotteryRepository
    .allWines()
    .then(wines =>
      res.send({
        wines: wines,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        success: false,
        message: message || "Unable to fetch lottery wines."
      });
    });
};

const addWines = (req, res) => {
  const { wines } = req.body;

  if (!(wines instanceof Array)) {
    return res.status(400).send({
      message: "Wines must be array.",
      success: false
    });
  }

  const validateAllWines = wines =>
    wines.map(wine => {
      const requiredAttributes = ["name", "vivinoLink", "rating", "image", "country", "id", "price"];

      return Promise.all(
        requiredAttributes.map(attr => {
          if (typeof wine[attr] === "undefined") {
            return Promise.reject({
              message: `Incorrect or missing attribute: ${attr}.`,
              statusCode: 400,
              success: false
            });
          }
          return Promise.resolve();
        })
      ).then(_ => Promise.resolve(wine));
    });

  return Promise.all(validateAllWines(wines))
    .then(wines => lotteryRepository.addWines(wines))
    .then(savedWines => {
      var io = req.app.get("socketio");
      io.emit("new_wine", {});
      return true;
    })
    .then(success =>
      res.send({
        message: `Successfully added wines to lottery.`,
        success: success
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        message: message || "Unexpected error occured adding wines.",
        success: false
      });
    });
};

const updateWineById = (req, res) => {
  const { id } = req.params;
  const { wine } = req.body;

  return lotteryRepository
    .updateWineById(id, wine)
    .then(updatedWine => {
      var io = req.app.get("socketio");
      io.emit("refresh_data", {});
      return updatedWine;
    })
    .then(wine =>
      res.send({
        wine,
        message: `Updated wine: ${wine.name}`,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        message: message || "Unexpected error occured while deleteing wine by id.",
        success: false
      });
    });
};

const deleteWineById = (req, res) => {
  const { id } = req.params;

  return lotteryRepository
    .deleteWineById(id)
    .then(removedWine => {
      var io = req.app.get("socketio");
      io.emit("refresh_data", {});
      return removedWine;
    })
    .then(wine =>
      res.send({
        message: `Removed wine: ${wine.name}`,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        message: message || "Unexpected error occured while deleteing wine by id.",
        success: false
      });
    });
};

const deleteWines = (req, res) => {
  return lotteryRepository
    .deleteWines()
    .then(removedWine => {
      var io = req.app.get("socketio");
      io.emit("refresh_data", {});
    })
    .then(_ =>
      res.send({
        message: "Removed all wines",
        success: true
      })
    );
};

module.exports = {
  allWines,
  addWines,
  updateWineById,
  deleteWineById,
  deleteWines
};
