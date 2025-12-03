<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <h2>Hotel Manager</h2>
        </div>
        <p class="welcome-text">Sistema de gestión hotelera</p>
      </div>

      <nav class="menu">
        <h3 class="menu-title">Navegación</h3>
        <ul class="menu-list">
          <li 
            v-for="item in menuItems" 
            :key="item.value"
            :class="{ active: opcion === item.value }"
            @click="selectOption(item.value)"
          >
            <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="item.icon"></svg>
            <span class="menu-label">{{ item.label }}</span>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <button @click="logout" class="logout-button">
          <svg class="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const opcion = ref('')

const menuItems = [
  { 
    value: "habitaciones",
    label: "Habitaciones",
    icon: `
      <path d="M3 10h18"></path>
      <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"></path>
      <path d="M4 10v8h16v-8"></path>
    `
  },
  { 
    value: "reservas",
    label: "Reservas",
    icon: `
      <rect x="3" y="4" width="18" height="18" rx="2"></rect>
      <path d="M16 2v4"></path>
      <path d="M8 2v4"></path>
      <line x1="3" y1="10" x2="21" y2="10"></line>
      <circle cx="12" cy="16" r="3"></circle>
    `
  },
  { 
    value: "servicios",
    label: "Servicios",
    icon: `
      <path d="M12 2a5 5 0 0 1 5 5v3H7V7a5 5 0 0 1 5-5Z"></path>
      <path d="M5 14h14"></path>
      <path d="M9 18h6"></path>
    `
  },
  { 
    value: "clientes",
    label: "Clientes",
    icon: `
      <circle cx="12" cy="7" r="4"></circle>
      <path d="M6 21v-2a6 6 0 0 1 12 0v2"></path>
    `
  },
  {
    value: "tipos-habitacion",
    label: "Tipos de Habitaciones",
    icon: `
      <rect x="3" y="5" width="18" height="14" rx="2"></rect>
      <line x1="3" y1="12" x2="21" y2="12"></line>
    `
  },
  {
    value: "dashboard-reporte",
    label: "Dashboard de Reportes",
    icon: `
      <path d="M3 3v18h18"></path>
      <rect x="7" y="12" width="3" height="6"></rect>
      <rect x="12" y="8" width="3" height="10"></rect>
      <rect x="17" y="5" width="3" height="13"></rect>
    `
  }
]

const selectOption = (value) => {
  opcion.value = value
}

watch(opcion, (v) => {
  if (v) router.push(`/${v}`)
})

const logout = () => {
  localStorage.removeItem('token')
  router.push('/')
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.sidebar {
  width: 280px;
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
}

.sidebar-header {
  padding: 30px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  color: white;
}

.welcome-text {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  margin-left: 44px;
}

.menu {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
}

.menu-title {
  padding: 0 20px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 12px;
  font-weight: 600;
}

.menu-list {
  list-style: none;
}

.menu-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  margin: 4px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.8);
}

.menu-list li:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  transform: translateX(5px);
}

.menu-list li.active {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.menu-icon {
  width: 22px;
  height: 22px;
  min-width: 22px;
  stroke: currentColor;
}

.logo h2 {
  font-size: 22px;
  font-weight: 700;
  color: white;
}

.menu-label {
  font-size: 15px;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  background-color: rgba(231, 76, 60, 0.9);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-button:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
}

.logout-button:active {
  transform: translateY(0);
}

.logout-icon {
  width: 20px;
  height: 20px;
  stroke: currentColor;
}

.main-content {
  flex: 1;
  margin-left: 280px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .sidebar {
    width: 70px;
  }
  
  .menu-label,
  .welcome-text,
  .logo h2,
  .menu-title,
  .logout-button span:not(.logout-icon) {
    display: none;
  }
  
  .logo {
    justify-content: center;
  }
  
  .menu-list li {
    justify-content: center;
  }
  
  .main-content {
    margin-left: 70px;
  }
}
</style>