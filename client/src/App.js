import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import NewPersonForm from "./components/NewPersonForm";
import PersonList from "./components/PersonList";
import Message from "./components/Message";
import api from "./api";
import "./index.css";

const App = () => {
  const [persons, setPersons] = useState(null);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState({
    content: "",
    type: "",
  });

  useEffect(() => {
    api
      .getAll()
      .then((initialPersons) => setPersons(initialPersons))
      .catch((err) => showMessage("Couldn't retrieve contacts", "error"));
  }, []);

  const handleNameChange = (e) => setNewName(e.target.value);
  const handleNumberChange = (e) => setNewNumber(e.target.value);
  const handleFilterChange = (e) => setFilter(e.target.value);

  const addPerson = (e) => {
    e.preventDefault();

    const isExistingPerson = persons.some((person) => {
      return person.name.toLowerCase() === newName.toLowerCase();
    });

    if (isExistingPerson) {
      if (window.confirm(`${newName} is already in the phonebook, update their number ?`)) {
        return updatePerson(newName, newNumber);
      } else return resetForm();
    }

    const newPerson = { name: newName, number: newNumber };

    api
      .create(newPerson)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        showMessage(`Added ${newPerson.name}`, "success");
      })
      .catch((e) => {
        showMessage("Something went wrong", "error");
      });
    resetForm();
  };

  const updatePerson = (name, number) => {
    const existing = persons.find((p) => p.name.toLowerCase() === name.toLowerCase());
    const updated = { ...existing, number };
    api
      .update(updated.id, updated)
      .then((returnedPerson) => {
        setPersons(
          persons.map((person) => {
            return person.id === returnedPerson.id ? returnedPerson : person;
          })
        );
        showMessage(`Updated ${returnedPerson?.name}`, "success");
      })
      .catch((e, returnedPerson) => {
        showMessage(`Couldn't update ${returnedPerson?.name}`, "error");
      });
    resetForm();
  };

  const deletePerson = (name, id) => {
    if (window.confirm(`Remove ${name} from the phonebook?`)) {
      api
        .remove(id)
        .then(() => {
          const removedIndex = persons.findIndex((p) => p.id === id);
          const updatedPersons = [...persons];
          updatedPersons.splice(removedIndex, 1);
          setPersons(updatedPersons);
          showMessage(`Removed ${persons[removedIndex].name}`, "success");
        })
        .catch((e) => {
          showMessage(`Couldn't delete contact`, "error");
        });
    } else return;
  };

  const resetForm = () => {
    setNewName("");
    setNewNumber("");
  };

  const showMessage = (content, type) => {
    setMessage({ content, type });
    setTimeout(() => {
      setMessage({ content, type: "" });
    }, 2000);
  };

  let personsToShow = filter
    ? persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons;

  return (
    <main>
      <Message {...message} />
      <h1>Phonebook</h1>
      <Filter filter={filter} filterChange={handleFilterChange} />
      <NewPersonForm
        submit={addPerson}
        name={newName}
        number={newNumber}
        nameChange={handleNameChange}
        numberChange={handleNumberChange}
      />
      {persons && (
        <PersonList persons={personsToShow} filtering={filter.length} deletePerson={deletePerson} />
      )}
    </main>
  );
};

export default App;
