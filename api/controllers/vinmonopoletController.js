const path = require("path");
const vinmonopoletRepository = require(path.join(__dirname, "../vinmonopolet"));

function searchWines(req, res) {
  const { name, page } = req.query;

  return vinmonopoletRepository.searchWinesByName(name, page).then(wines =>
    res.json({
      wines: wines,
      count: wines.length,
      page: page,
      success: true
    })
  );
}

function wineByEAN(req, res) {
  const { ean } = req.params;

  return vinmonopoletRepository.searchByEAN(ean).then(wines =>
    res.json({
      wines: wines,
      success: true
    })
  );
}

function wineById(req, res) {
  const { id } = req.params;

  return vinmonopoletRepository.searchById(id).then(wines =>
    res.json({
      wine: wines[0],
      success: true
    })
  );
}

function allStores(req, res) {
  return vinmonopoletRepository
    .allStores()
    .then(stores =>
      res.send({
        stores,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        message: message || "Unexpected error occured while fetch all vinmonopolet stores.",
        success: false
      });
    });
}

function searchStores(req, res) {
  const { name } = req.query;

  return vinmonopoletRepository
    .searchStoresByName(name)
    .then(stores =>
      res.send({
        stores,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        message: message || "Unexpected error occured while fetch all vinmonopolet stores.",
        success: false
      });
    });
}

module.exports = {
  searchWines,
  wineByEAN,
  wineById,
  allStores,
  searchStores
};
