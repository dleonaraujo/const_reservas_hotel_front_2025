<template>
  <div class="container">
    <h1>Reportes</h1>

    <ul>
      <li @click="$router.push('/reportes/ventas')" style="cursor:pointer;">
        Ventas por fecha
      </li>

      <li>
        (Otro reporte que quieras añadir)
      </li>
    </ul>
  </div>
</template>

<script>
export default {}
</script>
