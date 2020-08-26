const fetch = require('node-fetch')
const path = require('path')

const byEAN = async (req, res) => {
  const vinmonopoletResponse = await fetch("https://app.vinmonopolet.no/vmpws/v2/vmp/products/barCodeSearch/" + req.params.ean)
    .then(resp => resp.json())

  if (vinmonopoletResponse.errors != null) {
    return vinmonopoletResponse.errors.map(error => {
      if (error.type == "UnknownProductError") {
        return res.status(404).json({
          message: error.message
        })
      } else {
        return next()
      }
    })
  }

  return res.send(vinmonopoletResponse);
};

module.exports = {
  byEAN
};
