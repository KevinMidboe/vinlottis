const path = require("path");
const Wine = require(path.join(__dirname, "/schemas/Wine"));

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

module.exports = {
  addWine
};
