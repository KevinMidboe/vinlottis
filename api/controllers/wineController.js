const path = require("path");
const vinmonopoletRepository = require(path.join(__dirname, "../vinmonopolet"));

function search(req, res) {
  const { query, page } = req.query;
  console.log(query, page);

  return vinmonopoletRepository.searchByQuery(query, page).then(wines =>
    res.json({
      wines: wines,
      count: wines.length,
      page: page,
      success: true
    })
  );
}

function ean(req, res) {
  const { ean } = req.params;

  return vinmonopoletRepository.searchByEAN(ean).then(wines =>
    res.json({
      wines: wines,
      success: true
    })
  );
}

function id(req, res) {
  const { id } = req.params;

  return vinmonopoletRepository.searchById(id).then(wines =>
    res.json({
      wine: wines[0],
      success: true
    })
  );
}

module.exports = {
  search,
  ean,
  id
};
