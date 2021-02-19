const alwaysAuthenticatedWhenLocalhost = (req, res, next) => {
  req.isAuthenticated = () => true;
  return next();
};

module.exports = alwaysAuthenticatedWhenLocalhost;
