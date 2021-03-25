

const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
mongoose.promise = global.Promise;
mongoose
  .connect("mongodb://localhost/vinlottis", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000 // initial connection timeout
  })
  .then(_ => console.log("Mongodb connection established!"))
  .catch(err => {
    console.log(err);
    console.error("ERROR! Mongodb required to run.");
    process.exit(1);
  });
mongoose.set("debug", false);

const path = require("path")
const prelotteryWineRepository = require(path.join(__dirname, "../api/prelotteryWine"));
const attendeeRepository = require(path.join(__dirname, "../api/attendee"));

async function add() {
    const wines = [
        {
            vivinoLink: 'https://www.vinmonopolet.no/Land/Frankrike/Devevey-Bourgogne-Hautes-C%C3%B4tes-de-Beaune-Rouge-2018/p/12351301',
            name: 'Devevey Bourgogne Hautes-Côtes de Beaune Rouge 2018',
            rating: 3,
            id: '12351301',
            year: 2018,
            image: "https://bilder.vinmonopolet.no/cache/300x300-0/12351301-1.jpg",
            price: '370',
            country: "Frankrike"
        },
        {
            vivinoLink: 'https://www.vinmonopolet.no/Land/Frankrike/Devevey-Rully-La-Chaume-Rouge-2018/p/12351101',
            name: 'Devevey Rully La Chaume Rouge 2018',
            rating: 4,
            id: '12351101',
            year: 2018,
            image: 'https://bilder.vinmonopolet.no/cache/300x300-0/12351101-1.jpg',
            price: '372',
            country: 'Frankrike'
        }
    ]

    const attendees = [
        {
            name: "Kasper Rynning-Tønnesen",
            red: 0,
            blue: 10,
            green: 0,
            yellow: 0,
            phoneNumber: 97777777,
            winner: false
        },
        {
            name: "Kevin Midbøe",
            red: 3,
            blue: 3,
            green: 3,
            yellow: 3,
            phoneNumber: 95012321,
            winner: false
        }
    ]

    await prelotteryWineRepository.addWines(wines)
    await Promise.all(attendees.map(attendee => attendeeRepository.addAttendee(attendee)))

    console.log("Added some wines, and 2 attendees to database.")
    process.exit(1)
}

add()