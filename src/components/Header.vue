<script setup>
import { RouterLink } from 'vue-router';

const props = defineProps({
  sesion: Object,
  default: null
})

const emits = defineEmits(["cerrarSesion"]);

// función para cerrar la sesión
function cerrarSesion() {
  emits('cerrarSesion')
}

</script>

<template>
  <header class="main-header shadow">
    <div class="container-fluid py-2">
      <div class="row align-items-center">

        <!-- COLUMNA DEL NOMBRE DE LA WEB-->
        <div class="col-4">
          <RouterLink to="/" class="navbar-brand d-flex align-items-center text-decoration-none">
            <span class="fs-4 fw-bold logo-text">FreeTours</span>
          </RouterLink>
        </div>

        <!-- COLUMNA NAVBAR-->
        <div class="col-4 d-flex justify-content-center">
          <nav class="d-none d-md-flex gap-3">

            <RouterLink to="/" class="header-link">
              <i class="bi bi-house-door me-1"></i> Inicio
            </RouterLink>

            <RouterLink to="/gestionUsuarios" class="header-link" v-if="props.sesion && props.sesion.rol == 'admin'">
              <i class="bi bi-people me-1"></i>Gestión de usuarios
            </RouterLink>

            <RouterLink to="/gestionRutas" class="header-link" v-if="props.sesion">
              <i class="bi bi-map me-1"></i>Gestión de rutas
            </RouterLink>

          </nav>
        </div>

        <!-- COLUMNA INICIO SESIÓN-->
        <div class="col-4 d-flex justify-content-end">
          <RouterLink to="/login" class="header-link" v-if="!props.sesion">Iniciar sesión</RouterLink>
          <div v-else>
            <span class="user">Bienvenido, {{ props.sesion.nombre }}</span>
            <button class="logout-button" @click="cerrarSesion"><i class="bi bi-box-arrow-right"></i></button>
          </div>
        </div>

      </div>
    </div>
  </header>
</template>

<style scoped>
.main-header {
  background-color: #386641;
  border-bottom: 3px solid #6A994E;
}

.logo-text {
  color: white;
  letter-spacing: 1px;
}

.header-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 15px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.header-link:hover {
  background-color: #6A994E;
  color: white;
}

.user {
  color: white;
  font-weight: 500;
  padding: 8px 15px;
  border-radius: 6px;
}

.header-link i {
  color: #A7C957;
}

.logout-button {
  color: #386641;
  background-color: #A7C957;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  margin-left: 10px;
  text-decoration: none;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.logout-button:hover {
  transform: translateY(-3px);
  background-color: #F2E8CF;
  color: #386641;
}
</style>