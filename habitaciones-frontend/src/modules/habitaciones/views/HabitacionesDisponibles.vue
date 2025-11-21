<template>
  <div>
    <h1>Habitaciones Disponibles</h1>

    <form @submit.prevent="buscar">
      <label>Fecha inicio</label>
      <input v-model="start" type="date" required />

      <label>Fecha fin</label>
      <input v-model="end" type="date" required />

      <button type="submit">Buscar</button>
    </form>

    <div v-if="loading">Buscando...</div>

    <ul v-else>
      <li v-for="h in disponibles" :key="h.id">
        {{ h.numero }} - {{ h.tipo }} - S/ {{ h.precio }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
import HabitacionesAPI from "../../../api/habitaciones";

const start = ref("");
const end = ref("");
const loading = ref(false);

const disponibles = ref([]);

const token = localStorage.getItem("token");

async function buscar() {
  loading.value = true;
  disponibles.value = await HabitacionesAPI.disponibles(start.value, end.value, token);
  loading.value = false;
}
</script>