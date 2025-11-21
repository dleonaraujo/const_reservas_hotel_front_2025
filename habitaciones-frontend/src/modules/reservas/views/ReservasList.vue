<template>
  <div class="container">
    <h1>Reservas</h1>

    <button @click="$router.push('/reservas/nueva')" class="btn btn-primary">
      Nueva Reserva
    </button>

    <div v-if="cargando">Cargando...</div>

    <table v-else class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Habitación</th>
          <th>Fecha ingreso</th>
          <th>Fecha salida</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="r in reservas" :key="r.id">
          <td>{{ r.id }}</td>
          <td>{{ r.cliente }}</td>
          <td>{{ r.habitacion }}</td>
          <td>{{ r.fecha_ingreso }}</td>
          <td>{{ r.fecha_salida }}</td>

          <td>
            <button @click="editar(r.id)" class="btn btn-warning btn-sm">Editar</button>
            <button @click="eliminar(r.id)" class="btn btn-danger btn-sm">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import reservasApi from "../../../api/reservas.js";

export default {
  data() {
    return {
      reservas: [],
      cargando: true,
    };
  },

  mounted() {
    this.cargarReservas();
  },

  methods: {
    async cargarReservas() {
      const res = await reservasApi.listar();
      this.reservas = res.data;
      this.cargando = false;
    },

    editar(id) {
      this.$router.push(`/reservas/editar/${id}`);
    },

    async eliminar(id) {
      if (confirm("¿Seguro de eliminar?")) {
        await reservasApi.eliminar(id);
        this.cargarReservas();
      }
    },
  },
};
</script>

<style>
.container {
  padding: 20px;
}
.table {
  margin-top: 20px;
}
</style>
