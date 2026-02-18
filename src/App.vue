<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { ref } from 'vue';

// variables de sesión
const sesion = localStorage.getItem('session');
const user = ref('')

// si existe sesion en localStorage asignamos los datos a la variable user
if (sesion) user.value = JSON.parse(sesion);

</script>

<template>
  <Header :sesion="user"></Header>
  <RouterView></RouterView>
  <Footer></Footer>
</template>

<style scoped></style>
