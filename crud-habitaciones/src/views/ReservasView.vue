<template>
  <div class="reservas-container">
    <div class="header">
      <h2>Gestión de Reservas</h2>
      <button @click="cargarReservas" class="btn-refresh">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23 4 23 10 17 10"></polyline>
          <polyline points="1 20 1 14 7 14"></polyline>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
        Actualizar
      </button>
    </div>

    <!-- Crear nueva reserva -->
    <div class="create-card">
      <h3>Nueva Reserva</h3>
      <div class="form-grid">
        <div class="input-group">
          <label>Cliente ID</label>
          <input v-model="nuevaReserva.cliente_id" placeholder="ID del cliente" type="number" />
        </div>
        <div class="input-group">
          <label>Fecha Inicio</label>
          <input v-model="nuevaReserva.fecha_inicio" type="date" />
        </div>
        <div class="input-group">
          <label>Fecha Fin</label>
          <input v-model="nuevaReserva.fecha_fin" type="date" />
        </div>
        <div class="input-group">
          <label>Habitaciones (IDs separados por coma)</label>
          <input v-model="nuevaReserva.habitaciones_str" placeholder="Ej: 1,2,5" />
        </div>
        <div class="button-group">
          <button @click="crearReserva" class="btn-create">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Crear Reserva
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

    <div v-if="!reservas.length && !error" class="alert alert-info">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      No hay reservas registradas. Crea una nueva para comenzar.
    </div>

    <!-- Tabla de reservas -->
    <div class="table-container" v-if="reservas.length">
      <table class="reservas-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente ID</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Estado</th>
            <th>Total</th>
            <th>Habitaciones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in reservas" :key="r.id">
            <td>
              <span class="badge">{{ r.id }}</span>
            </td>
            <td>
              <input v-model="r.cliente_id" class="table-input small" type="number" />
            </td>
            <td>
              <input v-model="r.fecha_inicio" class="table-input" type="date" />
            </td>
            <td>
              <input v-model="r.fecha_fin" class="table-input" type="date" />
            </td>
            <td>
              <select v-model="r.estado" class="table-select">
                <option value="planificada">Planificada</option>
                <option value="confirmada">Confirmada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </td>
            <td>
              <span class="total-amount">${{ r.total }}</span>
            </td>
            <td>
              <input v-model="r.habitaciones_str" class="table-input" placeholder="1,2,3" />
            </td>
            <td>
              <div class="action-buttons">
                <button @click="actualizarReserva(r)" class="btn-save" title="Guardar cambios">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                </button>
                <button @click="actualizarHabitaciones(r)" class="btn-rooms" title="Actualizar habitaciones">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </button>
                <button @click="cancelarReserva(r)" class="btn-cancel" title="Cancelar reserva">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                </button>
                <button @click="eliminarReserva(r)" class="btn-delete" title="Eliminar">
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
import { ref, onMounted } from "vue";
import axios from "axios";

const reservas = ref([]);
const error = ref("");

const token = localStorage.getItem("token");

const nuevaReserva = ref({
  cliente_id: "",
  fecha_inicio: "",
  fecha_fin: "",
  habitaciones_str: ""
});

const cargarReservas = async () => {
  error.value = "";

  try {
    const res = await axios.get("http://localhost:5000/api/reservas/", {
      headers: { Authorization: `Bearer ${token}` }
    });

    reservas.value = res.data.map(r => ({
      ...r,
      habitaciones_str: r.habitaciones.map(h => h.id).join(",")
    }));
  } catch (err) {
    error.value = err.response?.data.msg || "Error al cargar reservas";
  }
};

const crearReserva = async () => {
  if (
    !nuevaReserva.value.cliente_id ||
    !nuevaReserva.value.fecha_inicio ||
    !nuevaReserva.value.fecha_fin ||
    !nuevaReserva.value.habitaciones_str
  ) {
    alert("Completa todos los campos");
    return;
  }

  const habitaciones_ids = nuevaReserva.value.habitaciones_str
    .split(",")
    .map(Number);

  try {
    await axios.post(
      "http://localhost:5000/api/reservas/registrar",
      {
        cliente_id: nuevaReserva.value.cliente_id,
        fecha_inicio: nuevaReserva.value.fecha_inicio,
        fecha_fin: nuevaReserva.value.fecha_fin,
        habitaciones: habitaciones_ids
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    nuevaReserva.value = {
      cliente_id: "",
      fecha_inicio: "",
      fecha_fin: "",
      habitaciones_str: ""
    };

    cargarReservas();
  } catch (err) {
    error.value = err.response?.data.msg || "Error al crear reserva";
  }
};

const actualizarReserva = async r => {
  try {
    await axios.put(
      `http://localhost:5000/api/reservas/${r.id}`,
      {
        cliente_id: r.cliente_id,
        fecha_inicio: r.fecha_inicio,
        fecha_fin: r.fecha_fin,
        estado: r.estado
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    cargarReservas();
  } catch (err) {
    error.value = err.response?.data.msg || "Error al actualizar";
  }
};

const actualizarHabitaciones = async r => {
  const ids = r.habitaciones_str.split(",").map(Number);

  try {
    await axios.put(
      `http://localhost:5000/api/reservas/${r.id}/habitaciones`,
      { habitaciones: ids },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    cargarReservas();
  } catch (err) {
    error.value = err.response?.data.msg || "Error al actualizar habitaciones";
  }
};

const cancelarReserva = async r => {
  if (!confirm("¿Cancelar reserva?")) return;

  try {
    await axios.put(
      `http://localhost:5000/api/reservas/${r.id}/cancelar`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    cargarReservas();
  } catch (err) {
    error.value = err.response?.data.msg || "Error al cancelar";
  }
};

const eliminarReserva = async r => {
  if (!confirm("¿Eliminar definitivamente esta reserva?")) return;

  try {
    await axios.delete(
      `http://localhost:5000/api/reservas/${r.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    cargarReservas();
  } catch (err) {
    error.value = err.response?.data.msg || "Error al eliminar";
  }
};

onMounted(cargarReservas);
</script>

<style scoped>
.reservas-container {
  padding: 30px;
  max-width: 1600px;
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
  overflow-x: auto;
}

.reservas-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
}

.reservas-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.reservas-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.reservas-table tbody tr {
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.reservas-table tbody tr:hover {
  background-color: #f8f9fa;
}

.reservas-table td {
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

.table-input.small {
  width: 70px;
}

.table-input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
}

.table-select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s ease;
  outline: none;
  background-color: white;
  cursor: pointer;
}

.table-select:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
}

.total-amount {
  font-weight: 700;
  color: #27ae60;
  font-size: 15px;
}

.action-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
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
  width: 16px;
  height: 16px;
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

.btn-rooms {
  background-color: #f0e8ff;
  color: #9b59b6;
}

.btn-rooms:hover {
  background-color: #9b59b6;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(155, 89, 182, 0.3);
}

.btn-cancel {
  background-color: #fff3cd;
  color: #f39c12;
}

.btn-cancel:hover {
  background-color: #f39c12;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
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
  .reservas-container {
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
}
</style>