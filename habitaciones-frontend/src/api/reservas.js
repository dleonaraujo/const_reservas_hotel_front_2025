import axios from "axios";

const API_URL = "http://127.0.0.1:5000/reservas"; // AJUSTA SI TU BACKEND USA OTRO PUERTO

export default {
  listar() {
    return axios.get(API_URL);
  },

  obtener(id) {
    return axios.get(`${API_URL}/${id}`);
  },

  crear(data) {
    return axios.post(API_URL, data);
  },

  actualizar(id, data) {
    return axios.put(`${API_URL}/${id}`, data);
  },

  eliminar(id) {
    return axios.delete(`${API_URL}/${id}`);
  },
};
