<template>
  <div>
    <h2>Clientes</h2>

    <!-- Crear -->
    <div style="margin-bottom: 1rem;">
      <input v-model="nuevo.nombre" placeholder="Nombre" />
      <input v-model="nuevo.email" placeholder="Email" />
      <input v-model="nuevo.telefono" placeholder="Teléfono" />
      <button @click="crear">Crear</button>
    </div>

    <button @click="cargar">Actualizar</button>
    <p v-if="error" style="color:red">{{ error }}</p>

    <table border="1" v-if="clientes.length">
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
          <td>{{ c.id }}</td>
          <td><input v-model="c.nombre" /></td>
          <td><input v-model="c.email" /></td>
          <td><input v-model="c.telefono" /></td>

          <td>
            <button @click="actualizar(c)">Guardar</button>
            <button @click="desactivar(c)">Desactivar</button>
            <button @click="eliminar(c)" style="color:red">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="!clientes.length && !error">No hay clientes aún.</p>
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
    const res = await axios.get('http://localhost:5000/api/clientes/', {
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
    await axios.post('http://localhost:5000/api/clientes/', nuevo.value, {
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
      `http://localhost:5000/api/clientes/${c.id}`,
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
      `http://localhost:5000/api/clientes/${c.id}/desactivar`,
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
