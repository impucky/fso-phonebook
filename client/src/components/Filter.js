const Filter = ({ filter, filterChange }) => {
  return (
    <div>
      <div className="formline">
        <span>Search</span>
        <input value={filter} onChange={filterChange} />
      </div>
    </div>
  );
};

export default Filter;
