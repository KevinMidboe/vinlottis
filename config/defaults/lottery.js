try {
  module.exports = require("../env/lottery.config");
} catch (e) {
  console.error(
    "⚠️ You haven't defined lottery-configs, you sure you want to continue without them?\n"
  );
  module.exports = {
    name: "NAME MISSING",
    phone: "PHONE_MISSING",
    price: 10,
    message: "INSERT MESSAGE",
    date: 5,
    hours: 15,
    apiUrl: "http://localhost:30030",
    gatewayToken: "asd"
  };
}
