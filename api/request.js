const express = require("express");
const path = require("path");
const RequestedWine = require(path.join(
  __dirname + "/../schemas/RequestedWine"
));
const Wine = require(path.join(
  __dirname + "/../schemas/Wine"
));

const deleteRequestedWineById = async (req, res) => {
  const { id } = req.params;
  if(id == null){
    return res.json({
      message: "Id er ikke definert",
      success: false
    })
  }

  await RequestedWine.deleteOne({wineId: id})
  return res.json({
    message: `Slettet vin med id: ${id}`,
    success: true
  }); 
}

const getAllRequestedWines = async (req, res) => {
  const allWines = await RequestedWine.find({}).populate("wine");
  
  return res.json(allWines);
}

const requestNewWine = async (req, res) => {
  const {wine} = req.body

  console.log(req.body)
  
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
  
  return res.send(requestedWine);
}

module.exports = {
  requestNewWine,
  getAllRequestedWines,
  deleteRequestedWineById
};
