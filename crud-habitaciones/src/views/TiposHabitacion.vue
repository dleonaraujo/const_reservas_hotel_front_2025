<template>
  <div class="tipos-container">
    <div class="header">
      <h2>Gestión de Tipos de Habitación</h2>
      <button @click="cargarTipos" class="btn-refresh">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23 4 23 10 17 10"></polyline>
          <polyline points="1 20 1 14 7 14"></polyline>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
        Actualizar
      </button>
    </div>

    <!-- Crear nuevo tipo -->
    <div class="create-card">
      <h3>Nuevo Tipo de Habitación</h3>
      <div class="form-grid">
        <div class="input-group">
          <label>Nombre</label>
          <input v-model="nuevoTipo.nombre" placeholder="Ej: Suite Ejecutiva" />
        </div>
        <div class="input-group full-width">
          <label>Descripción</label>
          <textarea 
            v-model="nuevoTipo.descripcion" 
            placeholder="Describe las características de este tipo de habitación..."
            rows="3"
          ></textarea>
        </div>
        <div class="button-group">
          <button @click="crearTipo" class="btn-create">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Crear Tipo
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

    <div v-if="mensaje" class="alert alert-success">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      {{ mensaje }}
    </div>

    <div v-if="!tipos.length && !error" class="alert alert-info">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      No hay tipos de habitación registrados. Crea uno nuevo para comenzar.
    </div>

    <!-- Tabla de tipos -->
    <div class="table-container" v-if="tipos.length">
      <table class="tipos-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tipo in tipos" :key="tipo.id">
            <td>
              <span class="badge">{{ tipo.id }}</span>
            </td>
            <td>
              <input v-model="tipo.nombre" class="table-input" />
            </td>
            <td>
              <textarea 
                v-model="tipo.descripcion" 
                class="table-textarea"
                rows="2"
              ></textarea>
            </td>
            <td>
              <div class="action-buttons">
                <button @click="actualizarTipo(tipo)" class="btn-save" title="Guardar cambios">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                </button>
                <button @click="eliminarTipo(tipo)" class="btn-delete" title="Eliminar">
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

const tipos = ref([]);
const error = ref('');
const mensaje = ref('');
const nuevoTipo = ref({ nombre: '', descripcion: '' });

const token = localStorage.getItem('token');

const cargarTipos = async () => {
  error.value = '';
  mensaje.value = '';
  
  if (!token) { 
    error.value = 'No hay token de autenticación.'; 
    return; 
  }

  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/tipos-habitacion/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    tipos.value = res.data;
  } catch (err) {
    error.value = err.response?.data.msg || 'Error al cargar tipos de habitación';
  }
};

const crearTipo = async () => {
  error.value = '';
  mensaje.value = '';
  
  if (!nuevoTipo.value.nombre || !nuevoTipo.value.descripcion) {
    error.value = 'Completa todos los campos';
    return;
  }

  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/tipos-habitacion/`, nuevoTipo.value, {
      headers: { Authorization: `Bearer ${token}` }
    });
    mensaje.value = 'Tipo de habitación creado exitosamente';
    nuevoTipo.value = { nombre: '', descripcion: '' };
    cargarTipos();
    
    setTimeout(() => { mensaje.value = ''; }, 3000);
  } catch (err) {
    error.value = err.response?.data.msg || 'Error al crear tipo';
  }
};

const actualizarTipo = async (tipo) => {
  error.value = '';
  mensaje.value = '';
  
  try {
    await axios.put(`${import.meta.env.VITE_API_URL}/tipos-habitacion/${tipo.id}`, {
      nombre: tipo.nombre,
      descripcion: tipo.descripcion
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    mensaje.value = 'Tipo actualizado exitosamente';
    cargarTipos();
    
    setTimeout(() => { mensaje.value = ''; }, 3000);
  } catch (err) {
    error.value = err.response?.data.msg || 'Error al actualizar tipo';
  }
};

const eliminarTipo = async (tipo) => {
  if (!confirm(`¿Eliminar el tipo "${tipo.nombre}"? Esta acción es lógica (se marcará como inactivo).`)) return;

  error.value = '';
  mensaje.value = '';
  
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/tipos-habitacion/${tipo.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    mensaje.value = 'Tipo eliminado exitosamente';
    cargarTipos();
    
    setTimeout(() => { mensaje.value = ''; }, 3000);
  } catch (err) {
    error.value = err.response?.data.msg || 'Error al eliminar tipo';
  }
};

onMounted(() => {
  cargarTipos();
});
</script>

<style scoped>
.tipos-container {
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
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  align-items: start;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group.full-width {
  grid-column: 1 / -1;
}

.input-group label {
  font-size: 13px;
  font-weight: 600;
  color: #555;
}

.input-group input,
.input-group textarea {
  padding: 10px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.3s ease;
  outline: none;
  resize: vertical;
}

.input-group input:focus,
.input-group textarea:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.button-group {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
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

.alert-success {
  background-color: #d5f4e6;
  color: #27ae60;
  border: 1px solid #a9dfbf;
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

.tipos-table {
  width: 100%;
  border-collapse: collapse;
}

.tipos-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.tipos-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tipos-table tbody tr {
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.tipos-table tbody tr:hover {
  background-color: #f8f9fa;
}

.tipos-table td {
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

.table-input,
.table-textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s ease;
  outline: none;
  resize: vertical;
}

.table-input:focus,
.table-textarea:focus {
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
  .tipos-container {
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

  .tipos-table {
    min-width: 800px;
  }
}
</style>