<template>
  <div class="container">
    <h1>{{ modo === 'crear' ? 'Nuevo Usuario' : 'Editar Usuario' }}</h1>

    <form @submit.prevent="guardar">

      <label>Usuario:</label>
      <input v-model="form.username" class="input" required>

      <label>Contraseña:</label>
      <input type="password" v-model="form.password" class="input" :required="modo === 'crear'">

      <label>Rol:</label>
      <select v-model="form.rol" class="input" required>
        <option value="admin">Admin</option>
        <option value="empleado">Empleado</option>
      </select>

      <button type="submit" class="btn btn-success">Guardar</button>
    </form>
  </div>
</template>

<script>
import usuariosApi from "../../../api/usuarios.js";

export default {
  data() {
    return {
      modo: "crear",
      form: {
        username: "",
        password: "",
        rol: "empleado",
      },
    };
  },

  async mounted() {
    if (this.$route.params.id) {
      this.modo = "editar";
      const res = await usuariosApi.obtener(this.$route.params.id);
      this.form.username = res.data.username;
      this.form.rol = res.data.rol;
    }
  },

  methods: {
    async guardar() {
      if (this.modo === "crear") {
        await usuariosApi.crear(this.form);
      } else {
        await usuariosApi.actualizar(this.$route.params.id, this.form);
      }

      this.$router.push("/usuarios");
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
