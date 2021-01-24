const path = require("path");
const userRepository = require(path.join(__dirname, "../user"));

function register(req, res, next) {
  const { username, password } = req.body;

  return userRepository
    .register(username, password)
    .then(user => userRepository.login(req, user))
    .then(_ =>
      res.send({
        messsage: `Bruker registrert. Velkommen ${username}`,
        success: true
      })
    )
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        message: message || "Unable to sign in with given username and passowrd",
        success: false
      });
    });
}

const login = (req, res, next) => {
  return userRepository
    .authenticate(req)
    .then(user => userRepository.login(req, user))
    .then(user => {
      res.send({
        message: `Velkommen ${user.username}`,
        success: true
      });
    })
    .catch(error => {
      const { statusCode, message } = error;

      return res.status(statusCode || 500).send({
        message: message || "Unable to sign in with given username and passowrd",
        success: false
      });
    });
};

const logout = (req, res) => {
  req.logout();
  res.redirect("/");
};

module.exports = {
  register,
  login,
  logout
};
