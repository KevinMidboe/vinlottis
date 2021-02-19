const path = require("path");
const Wine = require(path.join(__dirname, "/schemas/Wine"));

const { WineNotFound } = require(path.join(__dirname, "/vinlottisErrors"));

const addWine = async wine => {
  let existingWine = await Wine.findOne({ name: wine.name, id: wine.id, year: wine.year });

  if (existingWine == undefined) {
    let newWine = new Wine({
      name: wine.name,
      vivinoLink: wine.vivinoLink,
      rating: wine.rating,
      occurences: 1,
      id: wine.id,
      year: wine.year,
      image: wine.image,
      price: wine.price,
      country: wine.country
    });
    await newWine.save();
    return newWine;
  } else {
    existingWine.occurences += 1;
    await existingWine.save();
    return existingWine;
  }
};

const allWines = (limit = undefined) => {
  if (limit) {
    return Wine.find().limit(limit);
  } else {
    return Wine.find();
  }
};

const wineById = id => {
  return Wine.findOne({ _id: id }).then(wine => {
    if (wine == null) {
      throw new WineNotFound();
    }

    return wine;
  });
};

const findWine = wine => {
  return Wine.findOne({ name: wine.name, id: wine.id, year: wine.year }).then(wine => {
    if (wine == null) {
      throw new WineNotFound();
    }

    return wine;
  });
};

module.exports = {
  addWine,
  allWines,
  wineById,
  findWine
};
