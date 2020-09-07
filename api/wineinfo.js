const fetch = require('node-fetch')
const path = require('path')
const config = require(path.join(__dirname + "/../config/env/lottery.config"));
const mustBeAuthenticated = require(path.join(__dirname + "/../middleware/mustBeAuthenticated"))

const convertToOurWineObject = wine => {
  if(wine.basic.ageLimit === "18"){
    return {
      name: wine.basic.productShortName,
      vivinoLink: "https://www.vinmonopolet.no/p/" + wine.basic.productId,
      rating: wine.basic.alcoholContent,
      occurences: 0,
      id: wine.basic.productId,
      image: `https://bilder.vinmonopolet.no/cache/500x500-0/${wine.basic.productId}-1.jpg`,
      price: wine.prices[0].salesPrice.toString(),
      country: wine.origins.origin.country
    }
  }
}

const wineSearch = async (req, res) => {
  const {query} = req.query
  let url = new URL(`https://apis.vinmonopolet.no/products/v0/details-normal?productShortNameContains=test&maxResults=15`)
  url.searchParams.set('productShortNameContains', query)
  
  const vinmonopoletResponse = await fetch(url, {
    headers: {
      "Ocp-Apim-Subscription-Key": config.vinmonopoletToken
    }
  })
    .then(resp => resp.json())
    .catch(err => console.error(err))
  
  
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
  const winesConverted = vinmonopoletResponse.map(convertToOurWineObject).filter(Boolean)

  return res.send(winesConverted);
}

const byEAN = async (req, res) => {
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

  return res.send(vinmonopoletResponse);
};

module.exports = {
  byEAN,
  wineSearch
};
