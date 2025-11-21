<template>
  <div class="container">
    <h1>Usuarios</h1>

    <button @click="$router.push('/usuarios/nuevo')" class="btn btn-primary">
      Nuevo Usuario
    </button>

    <div v-if="cargando">Cargando...</div>

    <table v-else class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Usuario</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="u in usuarios" :key="u.id">
          <td>{{ u.id }}</td>
          <td>{{ u.username }}</td>
          <td>{{ u.rol }}</td>

          <td>
            <button @click="editar(u.id)" class="btn btn-warning btn-sm">Editar</button>
            <button @click="eliminar(u.id)" class="btn btn-danger btn-sm">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import usuariosApi from "../../../api/usuarios.js";

export default {
  data() {
    return {
      usuarios: [],
      cargando: true,
    };
  },

  mounted() {
    this.cargarUsuarios();
  },

  methods: {
    async cargarUsuarios() {
      const res = await usuariosApi.listar();
      this.usuarios = res.data;
      this.cargando = false;
    },

    editar(id) {
      this.$router.push(`/usuarios/editar/${id}`);
    },

    async eliminar(id) {
      if (confirm("¿Seguro de eliminar?")) {
        await usuariosApi.eliminar(id);
        this.cargarUsuarios();
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
