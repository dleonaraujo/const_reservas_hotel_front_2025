<template>
  <div>
    <h2>Menú Principal</h2>

    <p>Bienvenido al sistema de gestión hotelera</p>

    <select v-model="opcion">
      <option value="">--Selecciona una opción--</option>
      <option value="habitaciones">Habitaciones</option>
      <option value="reservas">Reservas</option>
      <option value="servicios">Servicios</option>
      <option value="clientes">Clientes</option>
    </select>

    <br /><br />
    <button @click="logout">Cerrar sesión</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const opcion = ref('')

watch(opcion, (v) => {
  if (v) router.push(`/${v}`)
})

const logout = () => {
  localStorage.removeItem('token')
  router.push('/')
}
</script>

<style scoped>
h2 {
  color: #2c3e50;
}

select {
  padding: 0.5rem;
  font-size: 1rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #2980b9;
}
</style>
