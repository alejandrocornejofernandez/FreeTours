<script setup>
import { ref } from 'vue';

const props = defineProps({
  sesion: String
})

</script>

<template>
  <header class="container-fluid">
    <div class="row justify-content-space-around">
      <div class="col align-self-center">
        <p class="h1 text-center text-ligth">FREETOURS</p>
        <div v-if="sesion">
          <p>{{ props.sesion.nombre }}</p>
          <i class="bi bi-box-arrow-right" @click="cerrarSesion"></i>
        </div>
        <div v-else>
          <RouterLink to="/login">
            <div>Iniciar sesión</div>
          </RouterLink>
        </div>
      </div>


    </div>
  </header>
</template>

<style>
.container-fluid {
  background-color: var(--color-dark);
}
</style>
