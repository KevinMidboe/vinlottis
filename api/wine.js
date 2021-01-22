const path = require("path");
const Wine = require(path.join(__dirname, "/schemas/Wine"));

async function findSaveWine(prelotteryWine) {
  let wonWine = await Wine.findOne({ name: prelotteryWine.name });
  if (wonWine == undefined) {
    let newWonWine = new Wine({
      name: prelotteryWine.name,
      vivinoLink: prelotteryWine.vivinoLink,
      rating: prelotteryWine.rating,
      occurences: 1,
      image: prelotteryWine.image,
      id: prelotteryWine.id
    });
    await newWonWine.save();
    wonWine = newWonWine;
  } else {
    wonWine.occurences += 1;
    wonWine.image = prelotteryWine.image;
    wonWine.id = prelotteryWine.id;
    await wonWine.save();
  }

  return wonWine;
}

module.exports.findSaveWine = findSaveWine;
