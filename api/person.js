const path = require("path");
const Highscore = require(path.join(__dirname, "/schemas/Highscore"));

async function findSavePerson(foundWinner, wonWine, date) {
  let person = await Highscore.findOne({
    name: foundWinner.name
  });

  if (person == undefined) {
    let newPerson = new Highscore({
      name: foundWinner.name,
      wins: [
        {
          color: foundWinner.color,
          date: date,
          wine: wonWine
        }
      ]
    });

    await newPerson.save();
  } else {
    person.wins.push({
      color: foundWinner.color,
      date: date,
      wine: wonWine
    });
    person.markModified("wins");
    await person.save();
  }

  return person;
}

module.exports.findSavePerson = findSavePerson;
