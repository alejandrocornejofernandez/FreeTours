<script setup>
import { ref } from 'vue';

// variables de sesión
const sesion = localStorage.getItem('session');
const user = ref('')

// si existe sesion en localStorage asignamos los datos a la variable user
if (sesion) user.value = JSON.parse(sesion);

function cerrarSesion() {
  user.value = "";
  localStorage.removeItem("session");
}

</script>

<template>
  <header class="container-fluid">
    <div class="row justify-content-space-around">
      <div class="col-12">
        <p class="h1 text-center">FREETOURS</p>
         <div v-if="user">
          <p>{{ user.nombre }}</p>
          <i class="bi bi-box-arrow-right" @click="cerrarSesion"></i>
        </div>
        <div v-else>
          <RouterLink to="/login"><div class="col-2">Iniciar sesión</div></RouterLink>
        </div>
      </div>

      <div class="col-2">
       
      </div>
      
    </div>
  </header>
</template>

<style>
.container-fluid {
  background-color: var(--navy-dark);
}
</style>
