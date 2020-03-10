
const mustBeAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send({
      success: false,
      message: "Du må være logget inn."
    })
  }

  return next()
}

module.exports = mustBeAuthenticated;