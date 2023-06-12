import Person from "./Person";

const PersonList = ({ persons, filtering, deletePerson }) => {
  return (
    <>
      <h2>Numbers</h2>
      {persons.length ? (
        <ul>
          {persons.map((person) => (
            <Person key={person.id} person={person} deletePerson={deletePerson} />
          ))}
        </ul>
      ) : filtering ? (
        <p>Couldn't find anyone with that name</p>
      ) : (
        ""
      )}
    </>
  );
};

export default PersonList;
