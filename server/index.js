require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const Person = require("./models/person");

app.use(express.json());
app.use(cors());

morgan.token("entry", (req, res) => Object.keys(req.body).length && JSON.stringify(req.body));
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :entry"));

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  next(err);
};

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  const person = {
    name,
    number,
  };

  const options = { new: true, runValidators: true, context: "query" };

  Person.findByIdAndUpdate(req.params.id, person, options)
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((err) => next(err));
});

app.get("/api/info", (req, res) => {
  Person.find({}).then((persons) => {
    res.send(`<p>Phonebook has info for ${persons.length} people.</p><p>${Date()}</p>`);
  });
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
