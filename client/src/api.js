import axios from "axios";
const personsUrl = "http://localhost:3001/persons";

const getAll = () => {
  return axios.get(personsUrl).then((res) => res.data);
};

const create = (newPerson) => {
  return axios.post(personsUrl, newPerson).then((res) => res.data);
};

const update = (id, newPerson) => {
  return axios.put(`${personsUrl}/${id}`, newPerson).then((res) => res.data);
};

const remove = (id) => {
  return axios.delete(`${personsUrl}/${id}`);
};

export default {
  getAll,
  create,
  update,
  remove,
};
