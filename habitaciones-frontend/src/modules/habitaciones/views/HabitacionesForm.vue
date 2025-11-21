<template>
  <div>
    <h1>{{ isEdit ? "Editar Habitación" : "Nueva Habitación" }}</h1>

    <form @submit.prevent="save">
      <label>Número</label>
      <input v-model="form.numero" required />

      <label>Tipo ID</label>
      <input v-model="form.tipo_id" type="number" required />

      <label>Precio</label>
      <input v-model="form.precio" type="number" required />

      <label>Estado</label>
      <select v-model="form.estado">
        <option value="disponible">Disponible</option>
        <option value="ocupada">Ocupada</option>
        <option value="mantenimiento">Mantenimiento</option>
      </select>

      <button type="submit">Guardar</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import HabitacionesAPI from "../../../api/habitaciones";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const isEdit = route.params.id !== undefined;
const token = localStorage.getItem("token");

const form = ref({
  numero: "",
  tipo_id: "",
  precio: "",
  estado: "disponible",
});

async function loadData() {
  if (isEdit) {
    const data = await HabitacionesAPI.getOne(route.params.id, token);
    form.value = data;
  }
}

async function save() {
  if (isEdit) {
    await HabitacionesAPI.update(route.params.id, form.value, token);
  } else {
    await HabitacionesAPI.create(form.value, token);
  }

  router.push("/habitaciones");
}

onMounted(loadData);
</script>