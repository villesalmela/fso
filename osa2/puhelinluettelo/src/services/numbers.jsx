import axios from 'axios';
const baseUrl = 'http://localhost:3001/persons'
const create = (newObject) => axios.post(baseUrl, newObject).then(response => response.data)
const update = (id, newObject) => axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data)
const remove = (id) => axios.delete(`${baseUrl}/${id}`).then(response => response.data)
const getAll = () => axios.get(baseUrl).then(response => response.data)
const numbersService = { create, update, remove, getAll }
export default numbersService