const express = require("express");
const path = require("path");
const router = express.Router();
const fetch = require('node-fetch')

const mustBeAuthenticated = require(path.join(__dirname + "/../middleware/mustBeAuthenticated"))

router.use((req, res, next) => {
  next();
});

router.route("/wineinfo/:ean").get(async (req, res) => {
  const vinmonopoletResponse = await fetch("https://app.vinmonopolet.no/vmpws/v2/vmp/products/barCodeSearch/" + req.params.ean)
    .then(resp => resp.json())

  if (vinmonopoletResponse.errors != null) {
    return vinmonopoletResponse.errors.map(error => {
      if (error.type == "UnknownProductError") {
        return res.status(404).json({
          message: error.message
        })
      } else {
        return next()
      }
    })
  }

  res.send(vinmonopoletResponse);
});

module.exports = router;
