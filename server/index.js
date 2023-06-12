const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());

morgan.token("entry", (req, res) => Object.keys(req.body).length && JSON.stringify(req.body));

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :entry"));

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

const generateId = () => {
  const max = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return max + 1;
};

app.get("/api/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people.</p><p>${Date()}</p>`);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  persons = persons.filter((p) => p.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "entry must include a name and number",
    });
  }

  const isExistingEntry = persons.find((p) => p.name.toLowerCase() === body.name.toLowerCase());

  if (isExistingEntry) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  res.json(person);
});

const PORT = 3001;
app.listen(3001, () => {
  console.log(`Server running on port ${PORT}`);
});
