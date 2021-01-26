const fetch = require("node-fetch");
const path = require("path");
const config = require(path.join(__dirname + "/../config/env/lottery.config"));

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

const convertToOurStoreObject = store => {
  return {
    id: store.storeId,
    name: store.storeName,
    ...store.address
  };
};

const searchWinesByName = async (name, page = 1) => {
  const pageSize = 15;
  let url = new URL(
    `https://apis.vinmonopolet.no/products/v0/details-normal?productShortNameContains=gato&maxResults=15`
  );
  url.searchParams.set("maxResults", pageSize);
  url.searchParams.set("start", pageSize * (page - 1));
  url.searchParams.set("productShortNameContains", name);

  const vinmonopoletResponse = await fetch(url, {
    headers: {
      "Ocp-Apim-Subscription-Key": config.vinmonopoletToken
    }
  })
    .then(resp => resp.json())
    .catch(err => console.error(err));

  if (vinmonopoletResponse.errors != null) {
    return vinmonopoletResponse.errors.map(error => {
      if (error.type == "UnknownProductError") {
        return res.status(404).json({
          message: error.message
        });
      } else {
        return next();
      }
    });
  }
  const winesConverted = vinmonopoletResponse.map(convertToOurWineObject).filter(Boolean);

  return winesConverted;
};

const wineByEAN = ean => {
  const url = `https://app.vinmonopolet.no/vmpws/v2/vmp/products/barCodeSearch/${ean}`;
  return fetch(url)
    .then(resp => resp.json())
    .then(response => response.map(convertToOurWineObject));
};

const wineById = id => {
  const url = `https://apis.vinmonopolet.no/products/v0/details-normal?productId=${id}`;
  const options = {
    headers: {
      "Ocp-Apim-Subscription-Key": config.vinmonopoletToken
    }
  };

  return fetch(url, options)
    .then(resp => resp.json())
    .then(response => response.map(convertToOurWineObject));
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
