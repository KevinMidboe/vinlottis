const path = require("path");
const RequestRepository = require(path.join(__dirname, "../request"));

function addRequest(req, res) {
  const { wine } = req.body;

  return RequestRepository.addNew(wine)
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
  return RequestRepository.getAll()
    .then(wines =>
      res.json({
        wines: wines,
        success: true
      })
    )
    .catch(error => {
      console.log("error in getAllRequests:", error);

      const message = "Unable to fetch all requested wines.";
      return res.status(500).json({
        success: false,
        message: message
      });
    });
}

function deleteRequest(req, res) {
  const { id } = req.params;

  return RequestRepository.deleteById(id)
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

module.exports = {
  addRequest,
  allRequests,
  deleteRequest
};
