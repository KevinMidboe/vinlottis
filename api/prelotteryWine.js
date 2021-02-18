const path = require("path");

const PreLotteryWine = require(path.join(__dirname, "/schemas/PreLotteryWine"));
const { WineNotFound } = require(path.join(__dirname, "/vinlottisErrors"));

const allWines = () => {
  return PreLotteryWine.find().populate("winner");
};

const allWinesWithoutWinner = () => {
  return PreLotteryWine.find({ winner: { $exists: false } });
};

const addWines = wines => {
  const prelotteryWines = wines.map(wine => {
    let newPrelotteryWine = new PreLotteryWine({
      name: wine.name,
      vivinoLink: wine.vivinoLink,
      rating: wine.rating,
      year: wine.year,
      image: wine.image,
      price: wine.price,
      country: wine.country,
      id: wine.id
    });

    return newPrelotteryWine.save();
  });

  return Promise.all(prelotteryWines);
};

const wineById = id => {
  return PreLotteryWine.findOne({ _id: id }).then(wine => {
    if (wine == null) {
      throw new WineNotFound();
    }
    return wine;
  });
};

const updateWineById = (id, updateModel) => {
  return PreLotteryWine.findOne({ _id: id }).then(wine => {
    if (wine == null) {
      throw new WineNotFound();
    }

    const updatedWine = {
      name: updateModel.name != null ? updateModel.name : wine.name,
      vivinoLink: updateModel.vivinoLink != null ? updateModel.vivinoLink : wine.vivinoLink,
      rating: updateModel.rating != null ? updateModel.rating : wine.rating,
      year: updateModel.year != null ? updateModel.year : wine.year,
      image: updateModel.image != null ? updateModel.image : wine.image,
      price: updateModel.price != null ? updateModel.price : wine.price,
      country: updateModel.country != null ? updateModel.country : wine.country,
      id: updateModel.id != null ? updateModel.id : wine.id
    };

    return PreLotteryWine.updateOne({ _id: id }, updatedWine).then(_ => updatedWine);
  });
};

const addWinnerToWine = (wine, winner) => {
  wine.winner = winner;
  winner.prize_selected = true;
  return Promise.all(wine.save(), winner.save());
};

const deleteWineById = id => {
  return PreLotteryWine.findOne({ _id: id }).then(wine => {
    if (wine == null) {
      throw new WineNotFound();
    }

    return PreLotteryWine.deleteOne({ _id: id }).then(_ => wine);
  });
};

const deleteWines = () => {
  return PreLotteryWine.deleteMany();
};

const wineSchema = () => {
  let schema = { ...PreLotteryWine.schema.obj };
  let nulledSchema = Object.keys(schema).reduce((accumulator, current) => {
    accumulator[current] = "";
    return accumulator;
  }, {});

  return Promise.resolve(nulledSchema);
};

module.exports = {
  allWines,
  allWinesWithoutWinner,
  addWines,
  wineById,
  addWinnerToWine,
  updateWineById,
  deleteWineById,
  deleteWines,
  wineSchema
};
