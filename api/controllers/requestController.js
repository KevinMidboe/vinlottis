const path = require("path");
const requestRepository = require(path.join(__dirname, "../request"));

function addRequest(req, res) {
  const { wine } = req.body;

  return verifyWineValues(wine)
    .then(_ => requestRepository.addNew(wine))
    .then(wine =>
      res.json({
        message: "Successfully added new request",
        wine: wine,
        success: true
      })
    )
    .catch(error => {
      const { message, statusCode } = error;

      return res.status(statusCode || 500).send({
        success: false,
        message: message || "Unable to add requested wine."
      });
    });
}

function allRequests(req, res) {
  return requestRepository
    .getAll()
    .then(wines =>
      res.json({
        wines: wines,
        success: true
      })
    )
    .catch(error => {
      const { message, statusCode } = error;
      return res.status(statusCode || 500).json({
        success: false,
        message: message || "Unable to fetch all requested wines."
      });
    });
}

function deleteRequest(req, res) {
  const { id } = req.params;

  return requestRepository
    .deleteById(id)
    .then(_ =>
      res.json({
        message: `Slettet vin med id: ${id}`,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        success: false,
        message: message || "Unable to delete requested wine."
      });
    });
}

function verifyWineValues(wine) {
  return new Promise((resolve, reject) => {
    if (wine == undefined) {
      reject({
        message: "No wine object found in request body.",
        status: 400
      });
    }

    if (wine.id == null) {
      reject({
        message: "Wine object missing value id.",
        status: 400
      });
    } else if (wine.name == null) {
      reject({
        message: "Wine object missing value name.",
        status: 400
      });
    } else if (wine.vivinoLink == null) {
      reject({
        message: "Wine object missing value vivinoLink.",
        status: 400
      });
    } else if (wine.image == null) {
      reject({
        message: "Wine object missing value image.",
        status: 400
      });
    }

    resolve();
  });
}

module.exports = {
  addRequest,
  allRequests,
  deleteRequest
};
