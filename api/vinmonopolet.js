const fetch = require("node-fetch");
const path = require("path");
const config = require(path.join(__dirname + "/../config/env/lottery.config"));
const vinmonopoletCache = require(path.join(__dirname, "vinmonopoletCache"));

const convertToOurWineObject = wine => {
  if (wine.basic.ageLimit === "18") {
    return {
      name: wine.basic.productShortName,
      vivinoLink: "https://www.vinmonopolet.no/p/" + wine.basic.productId,
      rating: wine.basic.alcoholContent,
      occurences: 0,
      id: wine.basic.productId,
      year: wine.basic.vintage,
      image: `https://bilder.vinmonopolet.no/cache/500x500-0/${wine.basic.productId}-1.jpg`,
      price: wine.prices[0].salesPrice.toString(),
      country: wine.origins.origin.country
    };
  }
};

const convertVinmonopoletProductResponseToWineObject = wine => {
  return {
    name: wine.name,
    vivinoLink: "https://www.vinmonopolet.no" + wine.url,
    rating: null,
    occurences: 0,
    id: wine.code,
    year: wine.year,
    image: wine.images[1].url,
    price: wine.price.value,
    country: wine.main_country.name
  }
};

const convertToOurStoreObject = store => {
  return {
    id: store.storeId,
    name: store.storeName,
    ...store.address
  };
};

const searchWinesByName = (name, page = 1) => {
  const pageSize = 25;

  return vinmonopoletCache.wineByQueryName(name, page, pageSize)
    .catch(_ => {
      console.log(`No wines matching query: ${name} at page ${page} found in elastic index, searching vinmonopolet..`)

      const url = `https://www.vinmonopolet.no/api/search?q=${name}:relevance:visibleInSearch:true&searchType=product&pageSize=${pageSize}&currentPage=${page-1}`
      const options = {
        headers: { "Content-Type": 'application/json' }
      };

      return fetch(url, options)
        .then(resp => {
          if (resp.ok == false) {
            return Promise.reject({
              statusCode: 404,
              message: `No wines matching query ${name} at page ${page} found in local cache or at vinmonopolet.`,
            })
          }

          return resp.json()
            .then(response => response?.productSearchResult?.products)
        })
    })
    .then(wines => wines.map(convertVinmonopoletProductResponseToWineObject))
};

const wineByEAN = ean => {
  const url = `https://app.vinmonopolet.no/vmpws/v2/vmp/products/barCodeSearch/${ean}`;
  return fetch(url)
    .then(resp => resp.json())
    .then(response => response.map(convertToOurWineObject));
};

const wineById = id => {
  return vinmonopoletCache.wineById(id)
    .catch(_ => {
      console.log(`Wine id: ${id} not found in elastic index, searching vinmonopolet..`)

      const url = `https://www.vinmonopolet.no/api/products/${id}?fields=FULL`
      const options = {
        headers: {
          "Content-Type": 'application/json'
        }
      };

      return fetch(url, options)
        .then(resp => {
          if (resp.ok == false) {
            return Promise.reject({
              statusCode: 404,
              message: `Wine with id ${id} not found in local cache or at vinmonopolet.`,
            })
          }

          return resp.json()
        })
    })
    .then(wine => convertVinmonopoletProductResponseToWineObject(wine))
};

const allStores = () => {
  const url = `https://apis.vinmonopolet.no/stores/v0/details`;
  const options = {
    headers: {
      "Ocp-Apim-Subscription-Key": config.vinmonopoletToken
    }
  };

  return fetch(url, options)
    .then(resp => resp.json())
    .then(response => response.map(convertToOurStoreObject));
};

const searchStoresByName = name => {
  const url = `https://apis.vinmonopolet.no/stores/v0/details?storeNameContains=${name}`;
  const options = {
    headers: {
      "Ocp-Apim-Subscription-Key": config.vinmonopoletToken
    }
  };

  return fetch(url, options)
    .then(resp => resp.json())
    .then(response => response.map(convertToOurStoreObject));
};

module.exports = {
  searchWinesByName,
  wineByEAN,
  wineById,
  allStores,
  searchStoresByName
};
