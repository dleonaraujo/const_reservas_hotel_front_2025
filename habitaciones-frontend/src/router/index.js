import { createRouter, createWebHistory } from 'vue-router'
import HabitacionesList from '../modules/habitaciones/views/HabitacionesList.vue'
import HabitacionesForm from '../modules/habitaciones/views/HabitacionesForm.vue'
import HabitacionesDisponibles from '../modules/habitaciones/views/HabitacionesDisponibles.vue'

import ReservasList from '../modules/reservas/views/ReservasList.vue'
import ReservasForm from '../modules/reservas/views/ReservasForm.vue'

import UsuariosList from '../modules/usuarios/views/UsuariosList.vue';
import UsuariosForm from '../modules/usuarios/views/UsuariosForm.vue';

import ReportesList from '../modules/reportes/views/ReportesList.vue'
import ReportesVentas from '../modules/reportes/views/ReportesVentas.vue'


import LoginView from '../modules/auth/views/LoginView.vue'
import AuthAPI from '../api/auth.js'

const routes = [
  { path: '/login', component: LoginView },

  { path: '/', redirect: '/habitaciones' },

  // HABITACIONES
  { 
    path: '/habitaciones',
    component: HabitacionesList,
    meta: { requiresAuth: true }
  },
  { 
    path: '/habitaciones/nuevo',
    component: HabitacionesForm,
    meta: { requiresAuth: true }
  },
  { 
    path: '/habitaciones/editar/:id',
    component: HabitacionesForm,
    props: true,
    meta: { requiresAuth: true }
  },
  { 
    path: '/habitaciones/disponibles',
    component: HabitacionesDisponibles,
    meta: { requiresAuth: true }
  },

  // RESERVAS
  { 
    path: "/reservas",
    component: ReservasList,
    meta: { requiresAuth: true }
  },
  { 
    path: "/reservas/nueva",
    component: ReservasForm,
    meta: { requiresAuth: true }
  },
  { 
    path: "/reservas/editar/:id",
    component: ReservasForm,
    props: true,
    meta: { requiresAuth: true }
  },

  // USUARIOS
{
  path: "/usuarios",
  component: UsuariosList,
  meta: { requiresAuth: true }
},
{
  path: "/usuarios/nuevo",
  component: UsuariosForm,
  meta: { requiresAuth: true }
},
{
  path: "/usuarios/editar/:id",
  component: UsuariosForm,
  props: true,
  meta: { requiresAuth: true }
},

{
  path: '/reportes',
  component: ReportesList,
  meta: { requiresAuth: true }
},
{
  path: '/reportes/ventas',
  component: ReportesVentas,
  meta: { requiresAuth: true }
}


]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const logged = AuthAPI.isAuthenticated();

  if (to.meta.requiresAuth && !logged) {
    return next('/login');
  }

  if (to.path === '/login' && logged) {
    return next('/habitaciones');
  }

  next();
})

export default router
