<template>
  <div class="dashboard-container">
    <div class="header">
      <h2>Dashboard de Reportes</h2>
      <button @click="cargarTodosReportes" class="btn-refresh">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23 4 23 10 17 10"></polyline>
          <polyline points="1 20 1 14 7 14"></polyline>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
        Actualizar
      </button>
    </div>

    <!-- Mensajes de error -->
    <div v-if="error" class="alert alert-error">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
      {{ error }}
    </div>

    <!-- Tarjetas de resumen -->
    <div class="stats-grid">
      <div class="stat-card stat-blue">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalReservas }}</div>
          <div class="stat-label">Total Reservas</div>
        </div>
      </div>

      <div class="stat-card stat-green">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">S/ {{ ingresosTotal.toFixed(2) }}</div>
          <div class="stat-label">Ingresos Totales</div>
        </div>
      </div>

      <div class="stat-card stat-purple">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ habitacionesActivas }}</div>
          <div class="stat-label">Habitaciones Activas</div>
        </div>
      </div>

      <div class="stat-card stat-orange">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalClientes }}</div>
          <div class="stat-label">Total Clientes</div>
        </div>
      </div>
    </div>

    <!-- Gráficos y reportes -->
    <div class="reports-grid">
      <!-- Reservas por estado -->
      <div class="report-card">
        <h3>Reservas por Estado</h3>
        <div v-if="reservasPorEstado.length" class="chart-container">
          <div v-for="item in reservasPorEstado" :key="item.estado" class="bar-chart-item">
            <div class="bar-label">{{ item.estado }}</div>
            <div class="bar-wrapper">
              <div 
                class="bar-fill" 
                :style="{ width: calcularPorcentaje(item.cantidad, maxReservas) + '%' }"
              >
                <span class="bar-value">{{ item.cantidad }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-chart">No hay datos disponibles</div>
      </div>

      <!-- Ingresos por fecha -->
      <div class="report-card">
        <h3>Ingresos Recientes</h3>
        <div v-if="ingresosPorFecha.length" class="table-scroll">
          <table class="mini-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Ingresos</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in ingresosPorFecha.slice(-10)" :key="item.fecha">
                <td>{{ formatearFecha(item.fecha) }}</td>
                <td class="amount">S/ {{ item.ingresos.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="empty-chart">No hay datos disponibles</div>
      </div>

      <!-- Habitaciones más populares -->
      <div class="report-card full-width">
        <h3>Top 10 Habitaciones Más Reservadas</h3>
        <div v-if="habitacionesPopulares.length" class="popular-rooms">
          <div v-for="(item, index) in habitacionesPopulares" :key="item.habitacion" class="room-item">
            <div class="room-rank">{{ index + 1 }}</div>
            <div class="room-info">
              <div class="room-number">Habitación {{ item.habitacion }}</div>
              <div class="room-bar-wrapper">
                <div 
                  class="room-bar" 
                  :style="{ width: calcularPorcentaje(item.reservas, maxHabitaciones) + '%' }"
                ></div>
              </div>
            </div>
            <div class="room-count">{{ item.reservas }} reservas</div>
          </div>
        </div>
        <div v-else class="empty-chart">No hay datos disponibles</div>
      </div>

      <!-- Clientes frecuentes -->
      <div class="report-card">
        <h3>Clientes Frecuentes</h3>
        <div v-if="clientesFrecuentes.length" class="clients-list">
          <div v-for="cliente in clientesFrecuentes" :key="cliente.id" class="client-item">
            <div class="client-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="client-info">
              <div class="client-name">{{ cliente.nombre }}</div>
              <div class="client-email">{{ cliente.email }}</div>
            </div>
            <div class="client-badge">{{ cliente.reservas }} reservas</div>
          </div>
        </div>
        <div v-else class="empty-chart">No hay datos disponibles</div>
      </div>

      <!-- Estado de habitaciones -->
      <div class="report-card">
        <h3>Estado de Habitaciones</h3>
        <div v-if="estadoHabitaciones.disponibles !== undefined" class="status-summary">
          <div class="status-item status-disponible">
            <div class="status-number">{{ estadoHabitaciones.disponibles }}</div>
            <div class="status-text">Disponibles</div>
          </div>
          <div class="status-item status-ocupado">
            <div class="status-number">{{ estadoHabitaciones.ocupadas }}</div>
            <div class="status-text">Ocupadas</div>
          </div>
        </div>
        <div v-else class="empty-chart">No hay datos disponibles</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const error = ref('');
const token = localStorage.getItem('token');

// Datos de reportes
const reservasPorEstado = ref([]);
const ingresosPorFecha = ref([]);
const habitacionesPopulares = ref([]);
const todasReservas = ref([]);
const todosClientes = ref([]);
const todasHabitaciones = ref([]);

// Estadísticas computadas
const totalReservas = computed(() => {
  return reservasPorEstado.value.reduce((sum, item) => sum + item.cantidad, 0);
});

const ingresosTotal = computed(() => {
  return ingresosPorFecha.value.reduce((sum, item) => sum + item.ingresos, 0);
});

const habitacionesActivas = computed(() => {
  return todasHabitaciones.value.filter(h => h.estado !== 'inactivo').length;
});

const totalClientes = computed(() => todosClientes.value.length);

const maxReservas = computed(() => {
  return Math.max(...reservasPorEstado.value.map(item => item.cantidad), 1);
});

const maxHabitaciones = computed(() => {
  return Math.max(...habitacionesPopulares.value.map(item => item.reservas), 1);
});

const estadoHabitaciones = computed(() => {
  const disponibles = todasHabitaciones.value.filter(h => h.estado === 'disponible').length;
  const ocupadas = todasHabitaciones.value.filter(h => h.estado === 'ocupado').length;
  return { disponibles, ocupadas };
});

const clientesFrecuentes = computed(() => {
  const clientesConReservas = todosClientes.value.map(cliente => {
    const reservasCliente = todasReservas.value.filter(r => r.cliente_id === cliente.id).length;
    return { ...cliente, reservas: reservasCliente };
  });
  
  return clientesConReservas
    .filter(c => c.reservas > 0)
    .sort((a, b) => b.reservas - a.reservas)
    .slice(0, 5);
});

// Funciones de carga
const cargarReservasPorEstado = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/reportes/reservas-por-estado`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    reservasPorEstado.value = res.data;
  } catch (err) {
    console.log('Error al cargar reservas por estado');
  }
};

const cargarIngresos = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/reportes/ingresos`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    ingresosPorFecha.value = res.data;
  } catch (err) {
    console.log('Error al cargar ingresos');
  }
};

const cargarHabitacionesPopulares = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/reportes/habitaciones-populares`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    habitacionesPopulares.value = res.data;
  } catch (err) {
    console.log('Error al cargar habitaciones populares');
  }
};

const cargarReservas = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/reservas/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    todasReservas.value = res.data;
  } catch (err) {
    console.log('Error al cargar reservas');
  }
};

const cargarClientes = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/clientes/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    todosClientes.value = res.data;
  } catch (err) {
    console.log('Error al cargar clientes');
  }
};

const cargarHabitaciones = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/habitaciones/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    todasHabitaciones.value = res.data;
  } catch (err) {
    console.log('Error al cargar habitaciones');
  }
};

const cargarTodosReportes = async () => {
  error.value = '';
  if (!token) {
    error.value = 'No hay token de autenticación.';
    return;
  }

  await Promise.all([
    cargarReservasPorEstado(),
    cargarIngresos(),
    cargarHabitacionesPopulares(),
    cargarReservas(),
    cargarClientes(),
    cargarHabitaciones()
  ]);
};

// Funciones de utilidad
const calcularPorcentaje = (valor, max) => {
  return max === 0 ? 0 : (valor / max) * 100;
};

const formatearFecha = (fecha) => {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

onMounted(() => {
  cargarTodosReportes();
});
</script>

<style scoped>
.dashboard-container {
  padding: 30px;
  max-width: 1600px;
  margin: 0 auto;
  background: #f5f7fa;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h2 {
  font-size: 32px;
  color: #2c3e50;
  margin: 0;
  font-weight: 700;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-refresh svg {
  width: 18px;
  height: 18px;
}

.btn-refresh:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.alert {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 25px;
  font-size: 14px;
  animation: slideIn 0.3s ease;
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

/* Tarjetas de estadísticas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: currentColor;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.stat-blue { color: #3498db; }
.stat-green { color: #27ae60; }
.stat-purple { color: #9b59b6; }
.stat-orange { color: #e67e22; }

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  background: currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.15;
}

.stat-icon svg {
  width: 32px;
  height: 32px;
  stroke: currentColor;
  opacity: 1;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 13px;
  color: #7f8c8d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Grid de reportes */
.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 25px;
}

.report-card {
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.report-card.full-width {
  grid-column: 1 / -1;
}

.report-card h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 700;
}

/* Gráfico de barras */
.chart-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.bar-chart-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.bar-label {
  min-width: 100px;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  text-transform: capitalize;
}

.bar-wrapper {
  flex: 1;
  height: 35px;
  background: #f0f2f5;
  border-radius: 8px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  padding: 0 12px;
  transition: width 0.8s ease;
  min-width: 40px;
}

.bar-value {
  color: white;
  font-size: 13px;
  font-weight: 700;
}

/* Tabla mini */
.table-scroll {
  max-height: 400px;
  overflow-y: auto;
}

.mini-table {
  width: 100%;
  border-collapse: collapse;
}

.mini-table thead {
  position: sticky;
  top: 0;
  background: #f8f9fa;
  z-index: 1;
}

.mini-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  color: #7f8c8d;
  border-bottom: 2px solid #e0e0e0;
}

.mini-table td {
  padding: 12px;
  font-size: 14px;
  color: #555;
  border-bottom: 1px solid #f0f0f0;
}

.mini-table .amount {
  font-weight: 700;
  color: #27ae60;
}

/* Habitaciones populares */
.popular-rooms {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.room-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.room-item:hover {
  background: #e8f4f8;
  transform: translateX(5px);
}

.room-rank {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.room-info {
  flex: 1;
}

.room-number {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 5px;
}

.room-bar-wrapper {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.room-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.8s ease;
}

.room-count {
  font-size: 13px;
  font-weight: 700;
  color: #7f8c8d;
  min-width: 80px;
  text-align: right;
}

/* Lista de clientes */
.clients-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.client-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.client-item:hover {
  background: #e8f4f8;
}

.client-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.client-avatar svg {
  width: 24px;
  height: 24px;
}

.client-info {
  flex: 1;
}

.client-name {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 3px;
}

.client-email {
  font-size: 12px;
  color: #7f8c8d;
}

.client-badge {
  padding: 6px 12px;
  background: #e8f4f8;
  color: #3498db;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

/* Estado de habitaciones */
.status-summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.status-item {
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
}

.status-item:hover {
  transform: scale(1.05);
}

.status-disponible {
  background: linear-gradient(135deg, #d5f4e6 0%, #b8e6cc 100%);
}

.status-ocupado {
  background: linear-gradient(135deg, #fadbd8 0%, #f5c6cb 100%);
}

.status-number {
  font-size: 48px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10px;
}

.status-text {
  font-size: 14px;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.empty-chart {
  padding: 40px;
  text-align: center;
  color: #7f8c8d;
  font-size: 14px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 15px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .reports-grid {
    grid-template-columns: 1fr;
  }

  .status-summary {
    grid-template-columns: 1fr;
  }
}
</style>