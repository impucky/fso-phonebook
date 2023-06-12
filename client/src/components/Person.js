const Person = ({ person, deletePerson }) => (
  <li>
    {person.name} - {person.number}{" "}
    <button onClick={() => deletePerson(person.name, person.id)}>DELETE</button>
  </li>
);

export default Person;
