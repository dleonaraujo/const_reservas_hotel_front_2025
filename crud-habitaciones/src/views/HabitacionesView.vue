<template>
  <div>
    <h2>Habitaciones</h2>

    <!-- Crear nueva habitación -->
    <div style="margin-bottom: 1rem;">
      <input v-model="nuevaHabitacion.numero" placeholder="Número" />
      <input v-model="nuevaHabitacion.tipo_id" placeholder="Tipo ID" />
      <input v-model="nuevaHabitacion.precio" placeholder="Precio" />
      <button @click="crearHabitacion">Crear</button>
    </div>

    <button @click="cargarHabitaciones">Actualizar</button>

    <p v-if="error" style="color:red">{{ error }}</p>
    <p v-if="!habitaciones.length && !error">No hay habitaciones cargadas aún.</p>

    <table border="1" v-if="habitaciones.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Número</th>
          <th>Tipo</th>
          <th>Precio</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="h in habitaciones" :key="h.id">
          <td>{{ h.id }}</td>
          <td>
            <input v-model="h.numero" />
          </td>
          <td>
            <input v-model="h.tipo_id" />
          </td>
          <td>
            <input v-model="h.precio" />
          </td>
          <td>{{ h.estado }}</td>
          <td>
            <button @click="actualizarHabitacion(h)">Guardar</button>
            <button @click="eliminarHabitacion(h)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
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
    const res = await axios.get('http://localhost:5000/api/habitaciones/', {
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
    await axios.post('http://localhost:5000/api/habitaciones/', nuevaHabitacion.value, {
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
    await axios.put(`http://localhost:5000/api/habitaciones/${h.id}`, {
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
    await axios.delete(`http://localhost:5000/api/habitaciones/${h.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    cargarHabitaciones();
  } catch (err) {
    error.value = err.response?.data.msg || 'Error al eliminar';
  }
};

onMounted(cargarHabitaciones);
</script>
