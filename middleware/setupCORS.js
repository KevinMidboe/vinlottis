const openCORS = (req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*")
  return next();
};

module.exports = openCORS;
