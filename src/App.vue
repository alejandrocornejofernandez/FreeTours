<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { ref } from 'vue';

// variables de sesión
const sesion = localStorage.getItem('session');
const user = ref('')

// si existe sesion en localStorage asignamos los datos a la variable user
if (sesion) user.value = JSON.parse(sesion);

// función para cerrar sesión, emit del componente Header.vue
function logout() {
  user.value = null;
  localStorage.removeItem('session');
}

</script>

<template>
  <Header :sesion="user" @cerrar-sesion="logout"></Header>
  <RouterView></RouterView>
  <Footer></Footer>
</template>

<style scoped></style>
