<script setup>
import { ref } from 'vue';
import router from '@/router';

import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'

const email = ref("");
const password = ref("");
const errorMessage = ref("");

// función para iniciar sesion
async function login() {

  // creamos objeto con los datos de inicio de sesión
  const data = {
    email: email.value,
    contraseña: password.value
  }

  // request al servidor
  try {
    const peticion = await fetch("http://localhost:8000/api.php/usuarios?login",
      {
        method: "POST",
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(data)
      }
    )

    const respuesta = await peticion.json();

    // si el login es exitoso, mostramos la vista del index, en caso contrario, se muestra una alerta en el login

    if (respuesta.status == "success") {
      router.push("/");
    } else {
      errorMessage.value = "El email o la contraseña son incorrectos";
    }

    console.log(respuesta);

  } catch {
    console.log("Error en la petición")
  }
}
</script>

<template>
  <div class="container border rounded">
    <div class="row">
      <div class="col-7"></div>
      <div class="col-5">
        <span>Iniciar sesión</span>
        <div v-if="errorMessage != ''" class="alert alert-danger">{{ errorMessage }}</div>
        <form>
          <div class="">
            <i class="bi bi-envelope-fill"></i>
            <input v-model.trim="email" type="text" placeholder="Email" />
          </div>

          <div>
            <i class="bi bi-key"></i>
            <input v-model.trim="password" type="password" placeholder="Contraseña" />
          </div>

          <div>
            <input type="submit" value="Iniciar sesión" @click.prevent="login()" />
          </div>

          <div>
            <!-- RouterLink para la vista de registro -->
            <RouterLink to="/register">¿Aún no tienes cuenta? Regístrate</RouterLink>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<style></style>
