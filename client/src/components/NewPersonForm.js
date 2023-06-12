const NewPersonForm = ({ submit, name, number, nameChange, numberChange }) => {
  return (
    <>
      <h2>Add a new person</h2>
      <form onSubmit={submit}>
        <div className="formline">
          <span>Name</span>
          <input value={name} onChange={nameChange} required />
        </div>
        <div className="formline">
          <span>Number</span>
          <input value={number} onChange={numberChange} required />
        </div>
        <button type="submit">ADD</button>
      </form>
    </>
  );
};

export default NewPersonForm;
