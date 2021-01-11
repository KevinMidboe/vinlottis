const path = require("path");
const RequestedWine = require(path.join(
  __dirname, "/schemas/RequestedWine"
));
const Wine = require(path.join(
  __dirname, "/schemas/Wine"
));

class RequestedWineNotFound extends Error {
  constructor(message="Wine with this id was not found.") {
    super(message);
    this.name = "RequestedWineNotFound";
    this.statusCode = 404;
  }
}

const addNew = async (wine) => {
  let thisWineIsLOKO = await Wine.findOne({id: wine.id})

  if(thisWineIsLOKO == undefined){
    thisWineIsLOKO = new Wine({
      name: wine.name,
      vivinoLink: wine.vivinoLink,
      rating: null,
      occurences: null,
      image: wine.image,
      id: wine.id
    });
    await thisWineIsLOKO.save()
  }

  let requestedWine = await RequestedWine.findOne({ "wineId": wine.id})

  if(requestedWine == undefined){
    requestedWine = new RequestedWine({
      count: 1,
      wineId: wine.id,
      wine: thisWineIsLOKO
    })
  } else {
    requestedWine.count += 1;
  }
  await requestedWine.save()

  return requestedWine;
}

const getById = (id) => {
  return RequestedWine.findOne({ wineId: id }).populate("wine")
    .then(wine => {
      if (wine == null) {
        throw new RequestedWineNotFound();
      }

      return wine;
    })
}

const deleteById = (id) => {
  return getById(id)
    .then(wine => RequestedWine.deleteOne({ wineId: wine.id }))
}

const getAll = () => {
  return RequestedWine.find({}).populate("wine");
}

module.exports = {
  addNew,
  getAll,
  deleteById
};
