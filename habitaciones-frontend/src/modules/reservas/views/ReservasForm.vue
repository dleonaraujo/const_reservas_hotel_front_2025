<template>
  <div class="container">
    <h1>{{ modo === 'crear' ? 'Nueva Reserva' : 'Editar Reserva' }}</h1>

    <form @submit.prevent="guardar">

      <label>Cliente:</label>
      <input v-model="form.cliente" class="input" required>

      <label>Habitación:</label>
      <input v-model="form.habitacion" class="input" required>

      <label>Fecha ingreso:</label>
      <input type="date" v-model="form.fecha_ingreso" class="input" required>

      <label>Fecha salida:</label>
      <input type="date" v-model="form.fecha_salida" class="input" required>

      <button type="submit" class="btn btn-success">
        Guardar
      </button>
    </form>
  </div>
</template>

<script>
import reservasApi from "../../../api/reservas.js";

export default {
  data() {
    return {
      modo: "crear",
      form: {
        cliente: "",
        habitacion: "",
        fecha_ingreso: "",
        fecha_salida: "",
      },
    };
  },

  async mounted() {
    if (this.$route.params.id) {
      this.modo = "editar";
      const res = await reservasApi.obtener(this.$route.params.id);
      this.form = res.data;
    }
  },

  methods: {
    async guardar() {
      if (this.modo === "crear") {
        await reservasApi.crear(this.form);
      } else {
        await reservasApi.actualizar(this.$route.params.id, this.form);
      }

      this.$router.push("/reservas");
    },
  },
};
</script>

<style>
.container {
  padding: 20px;
}
.input {
  display: block;
  margin-bottom: 10px;
  padding: 6px;
  width: 100%;
}
</style>
