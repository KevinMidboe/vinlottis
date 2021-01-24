const passport = require("passport");
const path = require("path");
const User = require(path.join(__dirname, "/schemas/User"));

class UserExistsError extends Error {
  constructor(message = "Username already exists.") {
    super(message);
    this.name = "UserExists";
    this.statusCode = 409;
  }
}

class MissingUsernameError extends Error {
  constructor(message = "No username given.") {
    super(message);
    this.name = "MissingUsernameError";
    this.statusCode = 400;
  }
}

class MissingPasswordError extends Error {
  constructor(message = "No password given.") {
    super(message);
    this.name = "MissingPasswordError";
    this.statusCode = 400;
  }
}

class IncorrectUserCredentialsError extends Error {
  constructor(message = "Incorrect username or password") {
    super(message);
    this.name = "IncorrectUserCredentialsError";
    this.statusCode = 404;
  }
}

function userAuthenticationErrorHandler(err) {
  if (err.name == "UserExistsError") {
    throw new UserExistsError(err.message);
  } else if (err.name == "MissingUsernameError") {
    throw new MissingUsernameError(err.message);
  } else if (err.name == "MissingPasswordError") {
    throw new MissingPasswordError(err.message);
  }

  throw err;
}

const register = (username, password) => {
  return User.register(new User({ username: username }), password).catch(userAuthenticationErrorHandler);
};

const authenticate = req => {
  return new Promise((resolve, reject) => {
    const { username, password } = req.body;

    if (username == undefined) throw new MissingUsernameError();
    if (password == undefined) throw new MissingPasswordError();

    passport.authenticate("local", function(err, user, info) {
      if (err) {
        reject(err);
      }

      if (!user) {
        reject(new IncorrectUserCredentialsError());
      }

      resolve(user);
    })(req);
  });
};

const login = (req, user) => {
  return new Promise((resolve, reject) => {
    req.logIn(user, err => {
      if (err) {
        reject(err);
      }

      resolve(user);
    });
  });
};

module.exports = {
  register,
  authenticate,
  login
};
