const setAdminHeaderIfAuthenticated = (req, res, next) => {
  res.set("Vinlottis-Admin", req.isAuthenticated());
  return next();
};

module.exports = setAdminHeaderIfAuthenticated;
