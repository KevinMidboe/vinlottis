try {
  module.exports = require("../env/push.config");
} catch (e) {
  console.error(
    "⚠️ You haven't defined push-parameters, you sure you want to continue without them?\n"
  );
  module.exports = { publicKey: false, privateKey: false, mailto: false };
}
