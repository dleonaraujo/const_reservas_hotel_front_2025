<template>
  <div class="clientes-container">
    <div class="header">
      <h2>Gestión de Clientes</h2>
      <button @click="cargar" class="btn-refresh">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23 4 23 10 17 10"></polyline>
          <polyline points="1 20 1 14 7 14"></polyline>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
        Actualizar
      </button>
    </div>

    <!-- Crear nuevo cliente -->
    <div class="create-card">
      <h3>Nuevo Cliente</h3>
      <div class="form-grid">
        <div class="input-group">
          <label>Nombre Completo</label>
          <input v-model="nuevo.nombre" placeholder="Ej: Juan Pérez" />
        </div>
        <div class="input-group">
          <label>Email</label>
          <input v-model="nuevo.email" placeholder="Ej: juan@email.com" type="email" />
        </div>
        <div class="input-group">
          <label>Teléfono</label>
          <input v-model="nuevo.telefono" placeholder="Ej: +51 999 999 999" />
        </div>
        <div class="button-group">
          <button @click="crear" class="btn-create">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Crear Cliente
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

    <div v-if="!clientes.length && !error" class="alert alert-info">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      No hay clientes registrados. Crea uno nuevo para comenzar.
    </div>

    <!-- Tabla de clientes -->
    <div class="table-container" v-if="clientes.length">
      <table class="clientes-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in clientes" :key="c.id">
            <td>
              <span class="badge">{{ c.id }}</span>
            </td>
            <td>
              <input v-model="c.nombre" class="table-input" />
            </td>
            <td>
              <input v-model="c.email" class="table-input" type="email" />
            </td>
            <td>
              <input v-model="c.telefono" class="table-input" />
            </td>
            <td>
              <div class="action-buttons">
                <button @click="actualizar(c)" class="btn-save" title="Guardar cambios">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                </button>
                <button @click="desactivar(c)" class="btn-deactivate" title="Desactivar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                  </svg>
                </button>
                <button @click="eliminar(c)" class="btn-delete" title="Eliminar permanentemente">
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
import { ref, onMounted } from 'vue'
import axios from 'axios'

const clientes = ref([])
const error = ref('')
const nuevo = ref({ nombre: '', email: '', telefono: '' })
const token = localStorage.getItem('token')

const cargar = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/clientes/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    clientes.value = res.data
  } catch (err) {
    error.value = 'Error al cargar clientes'
  }
}

const crear = async () => {
  if (!nuevo.value.nombre || !nuevo.value.email) {
    alert('Nombre y email son obligatorios')
    return
  }

  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/clientes/`, nuevo.value, {
      headers: { Authorization: `Bearer ${token}` },
    })
    nuevo.value = { nombre: '', email: '', telefono: '' }
    cargar()
  } catch (err) {
    error.value = 'Error al crear'
  }
}

const actualizar = async (c) => {
  try {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/clientes/${c.id}`,
      {
        nombre: c.nombre,
        email: c.email,
        telefono: c.telefono,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    cargar()
  } catch (err) {
    error.value = 'Error al actualizar'
  }
}

const desactivar = async (c) => {
  if (!confirm('Desactivar cliente lógicamente?')) return

  try {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/clientes/${c.id}/desactivar`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    cargar()
  } catch (err) {
    error.value = 'Error al desactivar'
  }
}

const eliminar = async (c) => {
  if (!confirm('Eliminar PERMANENTEMENTE?')) return

  try {
    await axios.delete(`http://localhost:5000/api/clientes/${c.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    cargar()
  } catch (err) {
    error.value = 'Error al eliminar'
  }
}

onMounted(cargar)
</script>

<style scoped>
.clientes-container {
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

.clientes-table {
  width: 100%;
  border-collapse: collapse;
}

.clientes-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.clientes-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.clientes-table tbody tr {
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.clientes-table tbody tr:hover {
  background-color: #f8f9fa;
}

.clientes-table td {
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

.btn-deactivate {
  background-color: #fff3cd;
  color: #f39c12;
}

.btn-deactivate:hover {
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
  .clientes-container {
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

  .clientes-table {
    min-width: 800px;
  }
}
</style>