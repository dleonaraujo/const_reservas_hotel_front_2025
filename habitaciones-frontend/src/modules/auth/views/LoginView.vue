<template>
  <div class="login-container">
    <h2>Iniciar Sesión</h2>

    <form @submit.prevent="submitLogin">
      <input v-model="email" type="text" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Contraseña" />

      <button type="submit">Ingresar</button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AuthAPI from "../../../api/auth.js";

const router = useRouter();

const email = ref("");
const password = ref("");
const error = ref("");

async function submitLogin() {
  const body = {
    email: email.value,
    password: password.value
  };

  console.log("ENVIANDO LOGIN:", body);

  const resp = await AuthAPI.login(body);

  console.log("RESPUESTA LOGIN:", resp);

  if (!resp.ok) {
    error.value = resp.msg;
    return;
  }

  localStorage.setItem("token", resp.token);

  router.push("/habitaciones");
}
</script>

<style scoped>
.login-container {
  width: 300px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.error {
  color: red;
}
</style>