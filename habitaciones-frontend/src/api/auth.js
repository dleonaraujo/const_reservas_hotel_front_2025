// src/api/auth.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export default {
  async login(credentials) {
    try {
      const res = await axios.post(`${API_URL}/login`, credentials);
      return res.data;
    } catch (err) {
      return { ok: false, msg: err.response?.data?.msg || "Error en login" };
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  }
};