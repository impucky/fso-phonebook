const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("First argument should be a password");
  process.exit(1);
}

if (process.argv.length > 5) {
  console.log(`Can only have at most 3 arguments: <password> <person name> <person number>`);
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://impucky:${password}@fso-phonebook.a2mqoch.mongodb.net/Phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  console.log(`Phonebook:`);
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} - ${person.number}`);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });
  person.save().then((result) => {
    console.log(`Saved new person: ${person.name} - ${person.number}`);
    mongoose.connection.close();
  });
}
