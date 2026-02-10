<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { ref } from 'vue';
import NavBar from './components/NavBar.vue';

// variables de sesión
const sesion = localStorage.getItem('session');
const user = ref('')

// si existe sesion en localStorage asignamos los datos a la variable user
if (sesion) user.value = JSON.parse(sesion);

</script>

<template>
  <Header :sesion="user.value"></Header>
  <NavBar></NavBar>
  <RouterView></RouterView>
</template>

<style scoped></style>
