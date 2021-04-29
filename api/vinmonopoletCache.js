const fetch = require("node-fetch");

const ELASTIC_URL = 'http://localhost:9200';
const INDEX_URL = `${ELASTIC_URL}/wines*`;

const verifyAndUnpackElasticSearchResult = response => {
  const searchHits = response?.hits?.hits;

  if (searchHits == null || searchHits.length == 0) {
    return Promise.reject({
      statusCode: 404,
      message: `Nothing found in vinmonopolet cache matching this.`,
    })
  }

  return searchHits;
}

const getWineObjectFromSearchHit = hit => {
  const { wine } = hit?._source;

  if (wine == null) {
    return Promise.reject({
      statusCode: 500,
      message: `Found response, but it's missing a wine object. Unable to convert!`,
    })
  }

  return wine;
}

const wineById = id => {
	const url = `${INDEX_URL}/_search`
  const options = {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      "size": 1,
      "query": {
        "match": {
          "wine.code": id
        }
      },
      "_source": {
        "includes": "wine"
      },
      "sort": [
        {
          "@timestamp": "desc"
        }
      ]
    })
  }

  return fetch(url, options)
    .then(resp => resp.json())
    .then(verifyAndUnpackElasticSearchResult)
    .then(searchHits => getWineObjectFromSearchHit(searchHits[0]))
}

const wineByQueryName = (name, page=1, size=25) => {
  const url = `${INDEX_URL}/_search`
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', },
    body: JSON.stringify({
      "from": page - 1,
      "size": size,
      "query": {
        "multi_match" : {
            "query" : name,
            "fields": ["wine.name"],
            "fuzziness": 2
        }
      },
      "sort": [
        {
          "_score": {
            "order": "desc"
          }
        }
      ], 
      "_source": {
        "includes": "wine"
      }
    })
  };

  return fetch(url, options)
    .then(resp => resp.json())
    .then(verifyAndUnpackElasticSearchResult)
    .then(searchHits => Promise.all(searchHits.map(getWineObjectFromSearchHit)))
}

module.exports = {
  wineById,
  wineByQueryName
}