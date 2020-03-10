const BASE_URL = __APIURL__ || window.location.origin;

const statistics = () => {
  const url = new URL('/api/purchase/statistics', BASE_URL)

  return fetch(url.href)
    .then(resp => resp.json())
}

const colorStatistics = () => {
  const url = new URL("/api/purchase/statistics/color", BASE_URL)

  return fetch(url.href)
    .then(resp => resp.json())
}

const highscoreStatistics = () => {
  const url = new URL("/api/highscore/statistics", BASE_URL)

  return fetch(url.href)
    .then(resp => resp.json())
}

const overallWineStatistics = () => {
  const url = new URL("/api/wines/statistics/overall", BASE_URL)

  return fetch(url.href)
    .then(resp => resp.json())
}


const chartWinsByColor = () => {
  const url = new URL("/api/purchase/statistics/color", BASE_URL)

  return fetch(url.href)
    .then(resp => resp.json())
}

const chartPurchaseByColor = () => {
  const url = new URL("/api/purchase/statistics", BASE_URL)

  return fetch(url.href)
    .then(resp => resp.json())
}


const prelottery = () => {
  const url = new URL("/api/wines/prelottery", BASE_URL)

  return fetch(url.href)
    .then(resp => resp.json())
}

const log = (sendObject) => {
  const url = new URL("/api/log", BASE_URL)

  const options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(sendObject)
  } 

  return fetch(url.href, options)
    .then(resp => resp.json())
}

const logWines = (wines) => {
  const url = new URL("/api/log/wines", BASE_URL)

  const options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(wines)
  }

  return fetch(url.href, options)
    .then(resp => resp.json())
}

const wineSchema = () => {
  const url = new URL("/api/log/schema", BASE_URL)

  return fetch(url.href)
    .then(resp => resp.json())
}

const barcodeToVinmonopolet = (id) => {
  const url = new URL("/api/wineinfo/" + id, BASE_URL)

  return fetch(url.href)
    .then(async (resp) => {
      if (!resp.ok) {
        if (resp.status == 404) {
          throw await resp.json()
        }
      } else {
        return resp.json()
      }
    })
}

const handleErrors = async (resp) => {
  if ([400, 409].includes(resp.status)) {
    throw await resp.json()
  } else {
    console.error("Unexpected error occured when login/register user:", resp)
    throw await resp.json()
  }
}

const login = (username, password) => {
  const url = new URL("/login", BASE_URL)
  const options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({ username, password })
  }

  return fetch(url.href, options)
    .then(resp => {
      if (resp.ok) {        
        return resp.json()
      } else {
        return handleErrors(resp)
      }
    })
}

const register = (username, password) => {
  const url = new URL("/register", BASE_URL)
  const options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({ username, password })
  }

  return fetch(url.href, options)
    .then(resp => {
      if (resp.ok) {
        return resp.json()
      } else {
        return handleErrors(resp)
      }
    })
}

export {
  statistics,
  colorStatistics,
  highscoreStatistics,
  overallWineStatistics,
  chartWinsByColor,
  chartPurchaseByColor,
  prelottery,
  log,
  logWines,
  wineSchema,
  barcodeToVinmonopolet,
  login,
  register
}
