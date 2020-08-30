const express = require("express");
const path = require("path");
const router = express.Router();
const fetch = require('node-fetch');
const { send } = require("process");
const RequestedWine = require(path.join(
  __dirname + "/../schemas/RequestedWine"
));
const Wine = require(path.join(
  __dirname + "/../schemas/Wine"
));

router.use((req, res, next) => {
  next();
});


router.route("/request").get(async (req, res) => {
  const rWines = await RequestedWine.find({}).populate("wine")
  return res.send(rWines)
})

router.route("/request").post(async (req, res) => {
  const {wine} = req.body

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

  res.send(requestedWine);

});

module.exports = router;
