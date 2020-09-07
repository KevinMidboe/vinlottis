import fetch from "node-fetch";

const BASE_URL = __APIURL__ || window.location.origin;

const statistics = () => {
  const url = new URL("/api/purchase/statistics", BASE_URL);

  return fetch(url.href).then(resp => resp.json());
};

const colorStatistics = () => {
  const url = new URL("/api/purchase/statistics/color", BASE_URL);

  return fetch(url.href).then(resp => resp.json());
};

const highscoreStatistics = () => {
  const url = new URL("/api/highscore/statistics", BASE_URL);

  return fetch(url.href).then(resp => resp.json());
};

const overallWineStatistics = () => {
  const url = new URL("/api/wines/statistics/overall", BASE_URL);

  return fetch(url.href).then(resp => resp.json());
};

const allRequestedWines = () => {
  const url = new URL("/api/request/all", BASE_URL);

  return fetch(url.href)
    .then(resp => {
      const isAdmin = resp.headers.get("vinlottis-admin") || false;
      return Promise.all([resp.json(), Boolean(isAdmin)]);
    });
};

const chartWinsByColor = () => {
  const url = new URL("/api/purchase/statistics/color", BASE_URL);

  return fetch(url.href).then(resp => resp.json());
};

const chartPurchaseByColor = () => {
  const url = new URL("/api/purchase/statistics", BASE_URL);

  return fetch(url.href).then(resp => resp.json());
};

const prelottery = () => {
  const url = new URL("/api/wines/prelottery", BASE_URL);

  return fetch(url.href).then(resp => resp.json());
};

const sendLottery = sendObject => {
  const url = new URL("/api/lottery", BASE_URL);

  const options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(sendObject)
  };

  return fetch(url.href, options).then(resp => resp.json());
};

const sendLotteryWinners = sendObject => {
  const url = new URL("/api/lottery/winners", BASE_URL);

  const options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(sendObject)
  };

  return fetch(url.href, options).then(resp => resp.json());
};

const addAttendee = sendObject => {
  const url = new URL("/api/virtual/attendee/add", BASE_URL);

  const options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(sendObject)
  };

  return fetch(url.href, options).then(resp => resp.json());
};

const getVirtualWinner = () => {
  const url = new URL("/api/virtual/winner/draw", BASE_URL);

  return fetch(url.href).then(resp => resp.json());
};

const attendeesSecure = () => {
  const url = new URL("/api/virtual/attendee/all/secure", BASE_URL);

  return fetch(url.href).then(resp => resp.json());
};

const winnersSecure = () => {
  const url = new URL("/api/virtual/winner/all/secure", BASE_URL);

  return fetch(url.href).then(resp => resp.json());
};

const winners = () => {
  const url = new URL("/api/virtual/winner/all", BASE_URL);

  return fetch(url.href).then(resp => resp.json());
};

const deleteRequestedWine = wineToBeDeleted => {

  const url = new URL("api/request/"+ wineToBeDeleted._id, BASE_URL);

  const options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "DELETE",
    body: JSON.stringify(wineToBeDeleted)
  };

  return fetch(url.href, options).then(resp => resp.json())
}

const deleteWinners = () => {
  const url = new URL("/api/virtual/winner/all", BASE_URL);

  const options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "DELETE"
  };

  return fetch(url.href, options).then(resp => resp.json());
};

const deleteAttendees = () => {
  const url = new URL("/api/virtual/attendee/all", BASE_URL);

  const options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "DELETE"
  };

  return fetch(url.href, options).then(resp => resp.json());
};

const attendees = () => {
  const url = new URL("/api/virtual/attendee/all", BASE_URL);

  return fetch(url.href).then(resp => resp.json());
};

const requestNewWine = (wine) => {
  const options = {
    body: JSON.stringify({
      wine: wine
    }),
     headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "post"
  }

  const url = new URL("/api/request/new-wine", BASE_URL)

  return fetch(url.href, options).then(resp => resp.json())
}

const logWines = wines => {
  const url = new URL("/api/log/wines", BASE_URL);

  const options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(wines)
  };

  return fetch(url.href, options).then(resp => resp.json());
};

const wineSchema = () => {
  const url = new URL("/api/wineinfo/schema", BASE_URL);

  return fetch(url.href).then(resp => resp.json());
};

const barcodeToVinmonopolet = id => {
  const url = new URL("/api/wineinfo/" + id, BASE_URL);

  return fetch(url.href).then(async resp => {
    if (!resp.ok) {
      if (resp.status == 404) {
        throw await resp.json();
      }
    } else {
      return resp.json();
    }
  });
};

const searchForWine = searchString => {
  const url = new URL("/api/wineinfo/search?query=" + searchString, BASE_URL);

  return fetch(url.href).then(async resp => {
    if (!resp.ok) {
      if (resp.status == 404) {
        throw await resp.json();
      }
    } else {
      return resp.json();
    }
  });
};


const handleErrors = async resp => {
  if ([400, 409].includes(resp.status)) {
    throw await resp.json();
  } else {
    console.error("Unexpected error occured when login/register user:", resp);
    throw await resp.json();
  }
};

const login = (username, password) => {
  const url = new URL("/login", BASE_URL);
  const options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({ username, password })
  };

  return fetch(url.href, options).then(resp => {
    if (resp.ok) {
      return resp.json();
    } else {
      return handleErrors(resp);
    }
  });
};

const register = (username, password) => {
  const url = new URL("/register", BASE_URL);
  const options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({ username, password })
  };

  return fetch(url.href, options).then(resp => {
    if (resp.ok) {
      return resp.json();
    } else {
      return handleErrors(resp);
    }
  });
};

const getChatHistory = (skip = null, take = null) => {
  const url = new URL("/api/chat/history", BASE_URL);
  if (!isNaN(skip)) url.searchParams.append("skip", skip);
  if (!isNaN(take)) url.searchParams.append("take", take);

  return fetch(url.href).then(resp => resp.json());
};

const finishedDraw = () => {
  const url = new URL("/api/virtual/finish", BASE_URL);
  const options = {
    method: 'POST'
  }

  return fetch(url.href, options).then(resp => resp.json());
};

const getAmIWinner = id => {
  const url = new URL(`/api/winner/${id}`, BASE_URL);
  return fetch(url.href).then(resp => resp.json());
};

const postWineChosen = (id, wineName) => {
  const url = new URL(`/api/winner/${id}`, BASE_URL);
  const options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({ wineName: wineName })
  };

  return fetch(url.href, options).then(resp => {
    if (resp.ok) {
      return resp.json();
    } else {
      return handleErrors(resp);
    }
  });
};

const historyAll = () => {
  const url = new URL(`/api/lottery/all`, BASE_URL);

  return fetch(url.href).then(resp => {
    if (resp.ok) {
      return resp.json();
    } else {
      return handleErrors(resp);
    }
  });
}

export {
  statistics,
  colorStatistics,
  highscoreStatistics,
  overallWineStatistics,
  chartWinsByColor,
  chartPurchaseByColor,
  prelottery,
  sendLottery,
  sendLotteryWinners,
  logWines,
  wineSchema,
  barcodeToVinmonopolet,
  searchForWine,
  requestNewWine,
  allRequestedWines,
  login,
  register,
  addAttendee,
  getVirtualWinner,
  attendeesSecure,
  attendees,
  winners,
  winnersSecure,
  deleteWinners,
  deleteAttendees,
  deleteRequestedWine,
  getChatHistory,
  finishedDraw,
  getAmIWinner,
  postWineChosen,
  historyAll
};
