class UserNotFound extends Error {
  constructor(message = "User not found.") {
    super(message);
    this.name = "UserNotFound";
    this.statusCode = 404;
  }

  // TODO log missing user
}

class WineNotFound extends Error {
  constructor(message = "Wine not found.") {
    super(message);
    this.name = "WineNotFound";
    this.statusCode = 404;
  }

  // TODO log missing user
}

class WinnerNotFound extends Error {
  constructor(message = "Winner not found.") {
    super(message);
    this.name = "WinnerNotFound";
    this.statusCode = 404;
  }

  // TODO log missing user
}

class WinnersTimelimitExpired extends Error {
  constructor(message = "Timelimit expired, you will need to wait until it's your turn again.") {
    super(message);
    this.name = "WinnersTimelimitExpired";
    this.statusCode = 403;
  }
}

class WineSelectionWinnerNotNextInLine extends Error {
  constructor(message = "Not the winner next in line!") {
    super(message);
    this.name = "WineSelectionWinnerNotNextInLine";
    this.statusCode = 403;
  }

  // TODO log missing user
}

class NoMoreAttendeesToWin extends Error {
  constructor(message = "No more attendees left to drawn from.") {
    super(message);
    this.name = "NoMoreAttendeesToWin";
    this.statusCode = 404;
  }
}

class CouldNotFindNewWinnerAfterNTries extends Error {
  constructor(tries) {
    let message = `Could not a new winner after ${tries} tries.`;
    super(message);
    this.name = "CouldNotFindNewWinnerAfterNTries";
    this.statusCode = 404;
  }
}

class LotteryByDateNotFound extends Error {
  constructor(date) {
    const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
    const mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
    const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);

    const dateString = `${ye}-${mo}-${da}`;
    const dateUnix = date.getTime();
    const message = `Could not find lottery for date: ${dateString}.`;
    super(message);
    this.name = "LotteryByDateNotFoundError";
    this.statusCode = 404;
  }
}

module.exports = {
  UserNotFound,
  WineNotFound,
  WinnerNotFound,
  WinnersTimelimitExpired,
  WineSelectionWinnerNotNextInLine,
  NoMoreAttendeesToWin,
  CouldNotFindNewWinnerAfterNTries,
  LotteryByDateNotFound
};
