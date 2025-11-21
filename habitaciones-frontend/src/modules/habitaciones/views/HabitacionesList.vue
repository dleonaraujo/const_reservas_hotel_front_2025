<template>
  <div class="max-w-5xl mx-auto py-10">
    <h1 class="text-4xl font-bold mb-6 text-gray-800">Habitaciones</h1>

    <div class="flex justify-between items-center mb-6">
      <router-link
        to="/habitaciones/nueva"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        ➕ Nueva Habitación
      </router-link>
    </div>

    <!-- Cargando -->
    <div v-if="cargando" class="text-gray-600 text-lg">
      Cargando habitaciones...
    </div>

    <!-- Tabla -->
    <table
      v-else
      class="w-full bg-white shadow-xl rounded-lg overflow-hidden border"
    >
      <thead class="bg-gray-100 border-b">
        <tr>
          <th class="p-3 text-left font-semibold">Número</th>
          <th class="p-3 text-left font-semibold">Tipo</th>
          <th class="p-3 text-left font-semibold">Precio</th>
          <th class="p-3 text-left font-semibold">Estado</th>
          <th class="p-3 text-center font-semibold">Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="h in habitaciones"
          :key="h.id"
          class="border-b hover:bg-gray-50"
        >
          <td class="p-3">{{ h.numero }}</td>
          <td class="p-3">{{ h.tipo }}</td>
          <td class="p-3">S/ {{ h.precio }}</td>
          <td class="p-3">
            <span
              :class="{
                'px-2 py-1 rounded text-white text-sm':
                  true,
                'bg-green-600': h.estado === 'disponible',
                'bg-red-600': h.estado === 'ocupado',
                'bg-gray-500': h.estado === 'mantenimiento'
              }"
            >
              {{ h.estado }}
            </span>
          </td>

          <td class="p-3 text-center">
            <div class="flex gap-2 justify-center">
              <router-link
                :to="`/habitaciones/editar/${h.id}`"
                class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                ✏ Editar
              </router-link>

              <button
                @click="eliminar(h.id)"
                class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                🗑 Eliminar
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Si no hay habitaciones -->
    <div
      v-if="!cargando && habitaciones.length === 0"
      class="text-center text-gray-500 mt-6"
    >
      No hay habitaciones registradas.
    </div>
  </div>
</template>

<script>
import habitacionesApi from "../../../api/habitaciones.js";

export default {
  data() {
    return {
      habitaciones: [],
      cargando: true,
    };
  },
  methods: {
    cargar() {
      this.cargando = true;
      habitacionesApi
        .listar()
        .then((r) => {
          this.habitaciones = r.data;
        })
        .finally(() => (this.cargando = false));
    },

    eliminar(id) {
      if (confirm("¿Estás seguro de eliminar esta habitación?")) {
        habitacionesApi.eliminar(id).then(() => this.cargar());
      }
    },
  },

  mounted() {
    this.cargar();
  },
};
</script>

<style>
body {
  background: #f7f7f7;
}
</style>
