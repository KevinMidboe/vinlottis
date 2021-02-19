import fetch from "node-fetch";

const BASE_URL = window.location.origin;

const statistics = () => {
  return fetch("/api/purchase/statistics")
    .then(resp => resp.json());
};

const colorStatistics = () => {
  return fetch("/api/purchase/statistics/color")
    .then(resp => resp.json());
};

const highscoreStatistics = () => {
  return fetch("/api/highscore/statistics")
    .then(resp => resp.json());
};

const overallWineStatistics = () => {
  return fetch("/api/wines/statistics/overall")
    .then(resp => resp.json());
};

const allRequestedWines = () => {;
  return fetch("/api/request/all")
    .then(resp => {
      const isAdmin = resp.headers.get("vinlottis-admin") == "true";
      const getWinesFromBody = (resp) => resp.json().then(body => body.wines);
      return Promise.all([getWinesFromBody(resp), isAdmin]);
    });
};

const chartWinsByColor = () => {
  return fetch("/api/purchase/statistics/color")
    .then(resp => resp.json());
};

const chartPurchaseByColor = () => {
  return fetch("/api/purchase/statistics")
    .then(resp => resp.json());
};

const prelottery = () => {
  return fetch("/api/wines/prelottery")
    .then(resp => resp.json());
};

const sendLottery = sendObject => {
  const options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(sendObject)
  };

  return fetch("/api/lottery", options)
    .then(resp => resp.json());
};

const sendLotteryWinners = sendObject => {
  const options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(sendObject)
  };

  return fetch("/api/lottery/winners", options)
    .then(resp => resp.json());
};

const addAttendee = sendObject => {
  const options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(sendObject)
  };

  return fetch("/api/virtual/attendee/add", options)
    .then(resp => resp.json());
};

const getVirtualWinner = () => {
  return fetch("/api/virtual/winner/draw")
    .then(resp => resp.json());
};

const attendeesSecure = () => {
  return fetch("/api/virtual/attendee/all/secure")
    .then(resp => resp.json());
};

const winnersSecure = () => {
  return fetch("/api/virtual/winner/all/secure")
    .then(resp => resp.json());
};

const winners = () => {
  return fetch("/api/virtual/winner/all")
    .then(resp => resp.json());
};

const deleteRequestedWine = wineToBeDeleted => {
  const options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "DELETE"
  };

  return fetch("api/request/" + wineToBeDeleted.id, options)
    .then(resp => resp.json());
}

const deleteWinners = () => {
  const options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "DELETE"
  };

  return fetch("/api/virtual/winner/all", options)
    .then(resp => resp.json());
};

const deleteAttendees = () => {
  const options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "DELETE"
  };

  return fetch("/api/virtual/attendee/all", options)
    .then(resp => resp.json());
};

const attendees = () => {
  return fetch("/api/virtual/attendee/all")
    .then(resp => resp.json());
};

const requestNewWine = (wine) => {
  const options = {
    method: "POST",
     headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ wine })
  }

  return fetch("/api/request/new-wine", options)
    .then(resp => resp.json())
}

const logWines = wines => {
  const options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(wines)
  };

  return fetch("/api/log/wines", options)
    .then(resp => resp.json());
};

const wineSchema = () => {
  const url = new URL("/api/wineinfo/schema", BASE_URL);

  return fetch(url.href).then(resp => resp.json());
};

const barcodeToVinmonopolet = id => {
  return fetch("/api/wineinfo/")
    .then(async resp => {
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
  return fetch("/api/wineinfo/search?query=" + searchString)
    .then(async resp => {
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
  const options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({ username, password })
  };

  return fetch("/api/login", options)
    .then(resp => {
      if (resp.ok) {
        return resp.json();
      } else {
        return handleErrors(resp);
      }
    });
};

const register = (username, password) => {
  const options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({ username, password })
  };

  return fetch("/api/register", options)
    .then(resp => {
      if (resp.ok) {
        return resp.json();
      } else {
        return handleErrors(resp);
      }
    });
};

const getChatHistory = (page=1, limit=10) => {
  const url = new URL("/api/chat/history", BASE_URL);
  if (!isNaN(page)) url.searchParams.append("page", page);
  if (!isNaN(limit)) url.searchParams.append("limit", limit);

  return fetch(url.href)
    .then(resp => resp.json());
};

const finishedDraw = () => {
  const options = {
    method: 'POST'
  }

  return fetch("/api/virtual/finish", options)
    .then(resp => resp.json());
};

const getAmIWinner = id => {
  return fetch(`/api/winner/${id}`)
    .then(resp => resp.json());
};

const postWineChosen = (id, wineName) => {
  const options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({ wineName: wineName })
  };

  return fetch(`/api/winner/${id}`, options)
    .then(resp => {
      if (resp.ok) {
        return resp.json();
      } else {
        return handleErrors(resp);
      }
    });
};

const historyAll = () => {
  return fetch(`/api/lottery/all`)
    .then(resp => {
      if (resp.ok) {
        return resp.json();
      } else {
        return handleErrors(resp);
      }
    });
}

const historyByDate = (date) => {
  return fetch(`/api/lottery/by-date/${ date }`)
    .then(resp => {
      if (resp.ok) {
        return resp.json();
      } else {
        return handleErrors(resp);
      }
    });
}

const getWinnerByName = (name) => {
  const encodedName = encodeURIComponent(name)

  return fetch(`/api/lottery/by-name/${name}`)
    .then(resp => {
     if (resp.ok) {
      return resp.json();
     } else {
      return handleErrors(resp);
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
  historyAll,
  historyByDate,
  getWinnerByName
};
