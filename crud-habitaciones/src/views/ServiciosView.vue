<template>
  <div>
    <h2>Servicios</h2>

    <!-- Crear nuevo -->
    <div style="margin-bottom: 1rem;">
      <input v-model="nuevo.nombre" placeholder="Nombre" />
      <input v-model="nuevo.precio" placeholder="Precio" />
      <button @click="crear">Crear</button>
    </div>

    <button @click="cargar">Actualizar</button>

    <p v-if="error" style="color:red">{{ error }}</p>

    <table border="1" v-if="servicios.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in servicios" :key="s.id">
          <td>{{ s.id }}</td>
          <td>
            <input v-model="s.nombre" />
          </td>
          <td>
            <input v-model="s.precio" />
          </td>
          <td>
            <button @click="actualizar(s)">Guardar</button>
            <button @click="desactivar(s)">Desactivar</button>
            <button @click="eliminar(s)" style="color:red">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="!servicios.length && !error">No hay servicios aún.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const servicios = ref([])
const error = ref('')
const nuevo = ref({ nombre: '', precio: '' })

const token = localStorage.getItem('token')

const cargar = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/servicios/', {
      headers: { Authorization: `Bearer ${token}` },
    })
    servicios.value = res.data
  } catch (err) {
    error.value = 'Error al cargar servicios'
  }
}

const crear = async () => {
  if (!nuevo.value.nombre || !nuevo.value.precio) {
    alert('Completa todos los campos')
    return
  }

  try {
    await axios.post('http://localhost:5000/api/servicios/', nuevo.value, {
      headers: { Authorization: `Bearer ${token}` },
    })
    nuevo.value = { nombre: '', precio: '' }
    cargar()
  } catch (err) {
    error.value = 'Error al crear servicio'
  }
}

const actualizar = async (s) => {
  try {
    await axios.put(
      `http://localhost:5000/api/servicios/${s.id}`,
      {
        nombre: s.nombre,
        precio: s.precio,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    cargar()
  } catch (err) {
    error.value = 'Error al actualizar'
  }
}

const desactivar = async (s) => {
  if (!confirm('Desactivar servicio lógicamente?')) return

  try {
    await axios.put(
      `http://localhost:5000/api/servicios/${s.id}/desactivar`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    cargar()
  } catch (err) {
    error.value = 'Error al desactivar'
  }
}

const eliminar = async (s) => {
  if (!confirm('Eliminar permanentemente?')) return

  try {
    await axios.delete(`http://localhost:5000/api/servicios/${s.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    cargar()
  } catch (err) {
    error.value = 'Error al eliminar'
  }
}

onMounted(cargar)
</script>
