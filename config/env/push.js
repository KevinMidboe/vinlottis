try {
  module.exports = require("./push.config");
} catch (e) {
  console.error(
    "You haven't defined push-parameters, you sure you want to continue without them?"
  );
  module.exports = { publicKey: false, privateKey: false, mailto: false };
}
