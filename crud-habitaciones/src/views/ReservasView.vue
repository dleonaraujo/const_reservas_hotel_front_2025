<template>
  <div>
    <h2>Reservas</h2>

    <!-- Crear nueva reserva -->
    <div style="margin-bottom: 1rem;">
      <input v-model="nuevaReserva.cliente_id" placeholder="Cliente ID" />

      <input v-model="nuevaReserva.fecha_inicio" type="date" />
      <input v-model="nuevaReserva.fecha_fin" type="date" />

      <input
        v-model="nuevaReserva.habitaciones_str"
        placeholder="IDs habitaciones: ej. 1,2,5"
      />

      <button @click="crearReserva">Crear Reserva</button>
    </div>

    <button @click="cargarReservas">Actualizar</button>

    <p v-if="error" style="color:red">{{ error }}</p>
    <p v-if="!reservas.length && !error">No hay reservas cargadas aún.</p>

    <table border="1" v-if="reservas.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Fechas</th>
          <th>Estado</th>
          <th>Total</th>
          <th>Habitaciones</th>
          <th>Editar</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="r in reservas" :key="r.id">
          <td>{{ r.id }}</td>

          <td>
            <input v-model="r.cliente_id" style="width:60px" />
          </td>

          <td>
            <input v-model="r.fecha_inicio" type="date" /> -
            <input v-model="r.fecha_fin" type="date" />
          </td>

          <td>
            <select v-model="r.estado">
              <option value="planificada">Planificada</option>
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </td>

          <td>{{ r.total }}</td>

          <td>
            <input
              v-model="r.habitaciones_str"
              placeholder="1,2,3"
              style="width:120px"
            />
          </td>

          <td>
            <button @click="actualizarReserva(r)">Guardar</button>

            <button @click="actualizarHabitaciones(r)">
              Guardar Habitaciones
            </button>

            <button @click="cancelarReserva(r)">Cancelar</button>

            <button @click="eliminarReserva(r)">Eliminar</button>
          </td>
        </tr>
      </tbody>

    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const reservas = ref([]);
const error = ref("");

const token = localStorage.getItem("token");

const nuevaReserva = ref({
  cliente_id: "",
  fecha_inicio: "",
  fecha_fin: "",
  habitaciones_str: "" // "1,2,3"
});

/* =========================================================
   CARGAR TODAS LAS RESERVAS
========================================================= */
const cargarReservas = async () => {
  error.value = "";

  try {
    const res = await axios.get("http://localhost:5000/api/reservas/", {
      headers: { Authorization: `Bearer ${token}` }
    });

    reservas.value = res.data.map(r => ({
      ...r,
      habitaciones_str: r.habitaciones.map(h => h.id).join(",")
    }));
  } catch (err) {
    error.value =
      err.response?.data.msg || "Error al cargar reservas";
  }
};

/* =========================================================
   CREAR RESERVA
========================================================= */
const crearReserva = async () => {
  if (
    !nuevaReserva.value.cliente_id ||
    !nuevaReserva.value.fecha_inicio ||
    !nuevaReserva.value.fecha_fin ||
    !nuevaReserva.value.habitaciones_str
  ) {
    alert("Completa todos los campos");
    return;
  }

  const habitaciones_ids = nuevaReserva.value.habitaciones_str
    .split(",")
    .map(Number);

  try {
    await axios.post(
      "http://localhost:5000/api/reservas/registrar",
      {
        cliente_id: nuevaReserva.value.cliente_id,
        fecha_inicio: nuevaReserva.value.fecha_inicio,
        fecha_fin: nuevaReserva.value.fecha_fin,
        habitaciones: habitaciones_ids
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    nuevaReserva.value = {
      cliente_id: "",
      fecha_inicio: "",
      fecha_fin: "",
      habitaciones_str: ""
    };

    cargarReservas();
  } catch (err) {
    error.value = err.response?.data.msg || "Error al crear reserva";
  }
};

/* =========================================================
   ACTUALIZAR RESERVA
========================================================= */
const actualizarReserva = async r => {
  try {
    await axios.put(
      `http://localhost:5000/api/reservas/${r.id}`,
      {
        cliente_id: r.cliente_id,
        fecha_inicio: r.fecha_inicio,
        fecha_fin: r.fecha_fin,
        estado: r.estado
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    cargarReservas();
  } catch (err) {
    error.value = err.response?.data.msg || "Error al actualizar";
  }
};

/* =========================================================
   ACTUALIZAR HABITACIONES DE LA RESERVA
========================================================= */
const actualizarHabitaciones = async r => {
  const ids = r.habitaciones_str.split(",").map(Number);

  try {
    await axios.put(
      `http://localhost:5000/api/reservas/${r.id}/habitaciones`,
      { habitaciones: ids },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    cargarReservas();
  } catch (err) {
    error.value =
      err.response?.data.msg ||
      "Error al actualizar habitaciones";
  }
};

/* =========================================================
   CANCELAR RESERVA (DELETE LÓGICO)
========================================================= */
const cancelarReserva = async r => {
  if (!confirm("¿Cancelar reserva?")) return;

  try {
    await axios.put(
      `http://localhost:5000/api/reservas/${r.id}/cancelar`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    cargarReservas();
  } catch (err) {
    error.value = err.response?.data.msg || "Error al cancelar";
  }
};

/* =========================================================
   ELIMINAR TOTALMENTE
========================================================= */
const eliminarReserva = async r => {
  if (!confirm("¿Eliminar definitivamente esta reserva?")) return;

  try {
    await axios.delete(
      `http://localhost:5000/api/reservas/${r.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    cargarReservas();
  } catch (err) {
    error.value = err.response?.data.msg || "Error al eliminar";
  }
};

onMounted(cargarReservas);
</script>
