const API_URL = "http://localhost:5000/api/habitaciones";

async function handleRequest(url, options = {}) {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      const errMsg = await res.text();
      throw new Error(`HTTP ${res.status}: ${errMsg}`);
    }

    return await res.json();
  } catch (error) {
    console.error("ERROR FETCH:", error);
    throw error;
  }
}

export default {
  getAll(token) {
    return handleRequest(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  getOne(id, token) {
    return handleRequest(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  create(data, token) {
    return handleRequest(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
  },

  update(id, data, token) {
    return handleRequest(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
  },

  delete(id, token) {
    return handleRequest(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  disponibles(start, end, token) {
    const url = `${API_URL}/disponibles?start=${start}&end=${end}`;
    return handleRequest(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};