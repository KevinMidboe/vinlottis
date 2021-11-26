const dateString = date => {
  if (typeof date == "string") {
    date = new Date(date);
  }
  const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  const mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
  const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);

  return `${ye}-${mo}-${da}`;
};

function humanReadableDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
}

function daysAgo(date) {
  const day = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((new Date() - new Date(date)) / day));
}

function minimalHumanDateResolution(seconds) {
  if (seconds < 999) {
    return `${seconds}s`;
  } else if (seconds) {
    return true
  }
}

export function createCookie(name, value, days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    var expires = "; expires=" + date.toGMTString();
  } else var expires = "";

  const domain = `${window.location.hostname}`;
  console.log("cookie:", `${name}=${value + expires}; path=/; domain=${domain}`);
  document.cookie = `${name}=${value + expires}; path=/; domain=${domain}`;
}

export function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function eraseCookie(name) {
  createCookie(name, "", -1);
}

export { dateString, humanReadableDate, daysAgo };
