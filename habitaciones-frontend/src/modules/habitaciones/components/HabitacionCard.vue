<template>
  <div class="card">
    <p><strong>Número:</strong> {{ habitacion.numero }}</p>
    <p><strong>Tipo:</strong> {{ habitacion.tipo }}</p>
    <p><strong>Precio:</strong> S/ {{ habitacion.precio }}</p>
    <p><strong>Estado:</strong> {{ habitacion.estado }}</p>

    <button @click="$emit('edit', habitacion.id)">Editar</button>
    <button @click="$emit('delete', habitacion.id)">Eliminar</button>
  </div>
</template>

<script setup>
defineProps({
  habitacion: Object
});
</script>