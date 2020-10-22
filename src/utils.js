 
const dateString = (date) => {
  if (typeof(date) == "string") {
    date = new Date(date);
  }
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date)
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)

  return `${ye}-${mo}-${da}`
}

function humanReadableDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
}

function daysAgo(date) {
  const day = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((new Date() - new Date(date)) / day));
}

export {
  dateString,
  humanReadableDate,
  daysAgo
}
