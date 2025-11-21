<template>
  <div class="container">

    <h1>Reporte de Ventas</h1>

    <div class="filters">
      <label>Desde</label>
      <input type="date" v-model="desde" />

      <label>Hasta</label>
      <input type="date" v-model="hasta" />

      <button @click="buscar">Buscar</button>
    </div>

    <table v-if="ventas.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Habitación</th>
          <th>Fecha</th>
          <th>Monto</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="v in ventas" :key="v.id">
          <td>{{ v.id }}</td>
          <td>{{ v.cliente }}</td>
          <td>{{ v.habitacion }}</td>
          <td>{{ v.fecha }}</td>
          <td>{{ v.monto }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else>No hay datos</p>

  </div>
</template>

<script>
import ReportesAPI from '../api/reportes.js'

export default {
  data() {
    return {
      desde: "",
      hasta: "",
      ventas: []
    }
  },

  methods: {
    async buscar() {
      const res = await ReportesAPI.ventasPorFecha(this.desde, this.hasta);
      this.ventas = res.data;
    }
  }
}
</script>
