const express = require("express");
const path = require("path");
const router = express.Router();
const fetch = require('node-fetch')

const mustBeAuthenticated = require(path.join(__dirname + "/../middleware/mustBeAuthenticated"))

router.use((req, res, next) => {
  next();
});

const convertToOurWineObject = wine => {
  console.log("traff her", wine)
  return {
    name: wine.basic.productShortName,
    image: `https://bilder.vinmonopolet.no/cache/300x300-0/${wine.basic.productId}-1.jpg`,
    rating: undefined,
    price: wine.prices[0].salesPrice,
    country: wine.origins.origin.country,
    vivinoLink: undefined
  }
}

router.route("/wineinfo/search").get(async (req, res) => {
  console.log("h")
  console.log(req)
  const {query} = req.query
  let url = new URL(`https://apis.vinmonopolet.no/products/v0/details-normal?productShortNameContains=test&maxResults=5`)
  url.searchParams.set('productShortNameContains', query)

  const vinmonopoletResponse = await fetch(url, {
    headers: {
      "Ocp-Apim-Subscription-Key": ""
    }
  })
    .then(resp => resp.json())

  const winesConverted = vinmonopoletResponse.map(convertToOurWineObject)
  console.log(winesConverted)

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

  res.send(winesConverted);
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
