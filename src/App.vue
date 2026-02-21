<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const router = useRoute();

// variables de sesión
const user = ref('')

// si existe sesion en localStorage asignamos los datos a la variable user
function login() {
  const sesion = localStorage.getItem('session');
  if (sesion) user.value = JSON.parse(sesion);
}

// llamo a la función para que vaya comprobando el localStorage constantemente, si no, no carga bien la sesión
login();

// función para cerrar sesión, emit del componente Header.vue
function logout() {
  user.value = null;
  localStorage.removeItem('session');
  router.push("/");
}

</script>

<template>
  <Header :sesion="user" @cerrar-sesion="logout"></Header>
  <RouterView @login="login" :sesion="user"></RouterView>
  <Footer></Footer>
</template>

<style scoped></style>
