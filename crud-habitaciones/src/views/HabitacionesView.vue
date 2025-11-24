<template>
  <div class="habitaciones-container">
    <div class="header">
      <h2>Gestión de Habitaciones</h2>
      <button @click="cargarHabitaciones" class="btn-refresh">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23 4 23 10 17 10"></polyline>
          <polyline points="1 20 1 14 7 14"></polyline>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
        Actualizar
      </button>
    </div>

    <!-- Crear nueva habitación -->
    <div class="create-card">
      <h3>Nueva Habitación</h3>
      <div class="form-grid">
        <div class="input-group">
          <label>Número</label>
          <input v-model="nuevaHabitacion.numero" placeholder="Ej: 101" />
        </div>
        <div class="input-group">
          <label>Tipo ID</label>
          <input v-model="nuevaHabitacion.tipo_id" placeholder="Ej: 1" type="number" />
        </div>
        <div class="input-group">
          <label>Precio</label>
          <input v-model="nuevaHabitacion.precio" placeholder="Ej: 150.00" type="number" step="0.01" />
        </div>
        <div class="button-group">
          <button @click="crearHabitacion" class="btn-create">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Crear Habitación
          </button>
        </div>
      </div>
    </div>

    <!-- Mensajes -->
    <div v-if="error" class="alert alert-error">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
      {{ error }}
    </div>

    <div v-if="!habitaciones.length && !error" class="alert alert-info">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      No hay habitaciones registradas. Crea una nueva para comenzar.
    </div>

    <!-- Tabla de habitaciones -->
    <div class="table-container" v-if="habitaciones.length">
      <table class="habitaciones-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Número</th>
            <th>Tipo ID</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="h in habitaciones" :key="h.id">
            <td>
              <span class="badge">{{ h.id }}</span>
            </td>
            <td>
              <input v-model="h.numero" class="table-input" />
            </td>
            <td>
              <input v-model="h.tipo_id" class="table-input" type="number" />
            </td>
            <td>
              <input v-model="h.precio" class="table-input" type="number" step="0.01" />
            </td>
            <td>
              <span :class="['status-badge', h.estado === 'disponible' ? 'status-disponible' : 'status-ocupado']">
                {{ h.estado }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button @click="actualizarHabitacion(h)" class="btn-save" title="Guardar cambios">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                </button>
                <button @click="eliminarHabitacion(h)" class="btn-delete" title="Eliminar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const habitaciones = ref([]);
const error = ref('');
const nuevaHabitacion = ref({ numero: '', tipo_id: '', precio: '' });

const token = localStorage.getItem('token');

const cargarHabitaciones = async () => {
  error.value = '';
  if (!token) { error.value = 'No hay token de autenticación.'; return; }

  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/habitaciones/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    habitaciones.value = res.data;
  } catch (err) {
    error.value = err.response?.data.msg || 'Error al cargar habitaciones';
  }
};

const crearHabitacion = async () => {
  if (!nuevaHabitacion.value.numero || !nuevaHabitacion.value.tipo_id || !nuevaHabitacion.value.precio) {
    alert('Completa todos los campos');
    return;
  }

  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/habitaciones/`, nuevaHabitacion.value, {
      headers: { Authorization: `Bearer ${token}` }
    });
    nuevaHabitacion.value = { numero: '', tipo_id: '', precio: '' };
    cargarHabitaciones();
  } catch (err) {
    error.value = err.response?.data.msg || 'Error al crear';
  }
};

const actualizarHabitacion = async (h) => {
  try {
    await axios.put(`${import.meta.env.VITE_API_URL}/habitaciones/${h.id}`, {
      numero: h.numero,
      tipo_id: h.tipo_id,
      precio: h.precio,
      estado: h.estado
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    cargarHabitaciones();
  } catch (err) {
    error.value = err.response?.data.msg || 'Error al actualizar';
  }
};

const eliminarHabitacion = async (h) => {
  if (!confirm('¿Eliminar habitación? Esto es lógico (inactivo).')) return;

  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/habitaciones/${h.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    cargarHabitaciones();
  } catch (err) {
    error.value = err.response?.data.msg || 'Error al eliminar';
  }
};

onMounted(cargarHabitaciones);
</script>

<style scoped>
.habitaciones-container {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h2 {
  font-size: 28px;
  color: #2c3e50;
  margin: 0;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-refresh svg {
  width: 18px;
  height: 18px;
}

.btn-refresh:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.create-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 25px;
}

.create-card h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 18px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  align-items: end;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 13px;
  font-weight: 600;
  color: #555;
}

.input-group input {
  padding: 10px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  outline: none;
}

.input-group input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.button-group {
  display: flex;
  align-items: flex-end;
}

.btn-create {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;
}

.btn-create svg {
  width: 18px;
  height: 18px;
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(39, 174, 96, 0.3);
}

.alert {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.alert svg {
  width: 20px;
  height: 20px;
  min-width: 20px;
}

.alert-error {
  background-color: #fee;
  color: #c0392b;
  border: 1px solid #fadbd8;
}

.alert-info {
  background-color: #e8f4f8;
  color: #2980b9;
  border: 1px solid #d6eaf8;
}

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.habitaciones-table {
  width: 100%;
  border-collapse: collapse;
}

.habitaciones-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.habitaciones-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.habitaciones-table tbody tr {
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.habitaciones-table tbody tr:hover {
  background-color: #f8f9fa;
}

.habitaciones-table td {
  padding: 16px;
  font-size: 14px;
  color: #555;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  background-color: #e8f4f8;
  color: #2980b9;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.table-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s ease;
  outline: none;
}

.table-input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
}

.status-badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-disponible {
  background-color: #d5f4e6;
  color: #27ae60;
}

.status-ocupado {
  background-color: #fadbd8;
  color: #e74c3c;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-buttons button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-buttons button svg {
  width: 18px;
  height: 18px;
}

.btn-save {
  background-color: #e8f4f8;
  color: #3498db;
}

.btn-save:hover {
  background-color: #3498db;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.btn-delete {
  background-color: #fee;
  color: #e74c3c;
}

.btn-delete:hover {
  background-color: #e74c3c;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

@media (max-width: 768px) {
  .habitaciones-container {
    padding: 15px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .table-container {
    overflow-x: auto;
  }

  .habitaciones-table {
    min-width: 800px;
  }
}
</style>