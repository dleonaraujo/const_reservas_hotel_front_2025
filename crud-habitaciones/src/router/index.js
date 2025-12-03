import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/LoginView.vue'
import AuthCallback from '../views/AuthCallback.vue'
import Home from '../views/HomeView.vue'
import Habitaciones from '../views/HabitacionesView.vue'
import Reservas from '../views/ReservasView.vue'
import Servicios from '../views/ServiciosView.vue'
import Clientes from '../views/ClientesView.vue'
import TiposHabitacion from '../views/TiposHabitacion.vue'

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/auth/callback', name: 'AuthCallback', component: AuthCallback },
  { 
    path: '/home', 
    component: Home,
    children: [
      { 
        path: '/habitaciones', 
        name: 'Habitaciones', 
        component: Habitaciones 
      },
      { 
        path: '/reservas', 
        name: 'Reservas', 
        component: Reservas 
      },
      { 
        path: '/servicios', 
        name: 'Servicios', 
        component: Servicios 
      },
      { 
        path: '/clientes', 
        name: 'Clientes', 
        component: Clientes 
      },
      {
        path: '/tipos-habitacion',
        name: 'Tipos de Habitacion',
        component: TiposHabitacion
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router