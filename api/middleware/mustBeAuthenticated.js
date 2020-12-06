const mustBeAuthenticated = (req, res, next) => {
  if (process.env.NODE_ENV == "development") {
    console.info(`Restricted endpoint ${req.originalUrl}, allowing with environment development.`)
    req.isAuthenticated = () => true;
    return next();
  }

  if (!req.isAuthenticated()) {
    return res.status(401).send({
      success: false,
      message: "Du må være logget inn."
    });
  }

  return next();
};

module.exports = mustBeAuthenticated;
