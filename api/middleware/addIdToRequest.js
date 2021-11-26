const crypto = require("crypto");
const httpContext = require("express-http-context");

const addIdToRequest = (req, res, next) => {
  try {
    crypto.randomBytes(16, (err, buf) => {
      if (err) {
        // log err
        id = null;
      }
      id = buf.toString("hex");

      httpContext.set("sessionId", id);
      next();
    });
  } catch (err) {
    // log err
    httpContext.set("sessionId", null);
    next();
  }
};

module.exports = addIdToRequest;