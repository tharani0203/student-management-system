import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/students/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getStudents = async (params = {}) => {
  const response = await api.get('', { params });
  return response.data;
};

export const getStudentById = async (id) => {
  const response = await api.get(`${id}/`);
  return response.data;
};

export const createStudent = async (student) => {
  const response = await api.post('', student);
  return response.data;
};

export const updateStudent = async (id, student) => {
  const response = await api.put(`${id}/`, student);
  return response.data;
};

export const deleteStudent = async (id) => {
  const response = await api.delete(`${id}/`);
  return response.data;
};
