<script setup>
import { ref } from 'vue';
import router from '@/router';

import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'

const emits = defineEmits(["login"])

const email = ref("");
const password = ref("");
const errorMessage = ref("");

async function login() {
  const data = {
    email: email.value,
    contraseña: password.value
  }

  try {
    const peticion = await fetch("http://localhost:8000/api.php/usuarios?login",
      {
        method: "POST",
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(data)
      }
    )

    const respuesta = await peticion.json();

    if (respuesta.status == "success") {
      // creamos la sesión en localStorage
      const sesion = {
        nombre: respuesta.user.nombre,
        rol: respuesta.user.rol
      }
      localStorage.setItem('session', JSON.stringify(sesion));

      // mostramos la vista Home
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
  <div class="container mt-5">
    <!-- Utilizo la clase card que sirve para la estructura de la imagen y el formulario -->
    <div class="card shadow-lg border-0 rounded-4 overflow-hidden login-card">
      <div class="row g-0">
        <div class="col-lg-6 d-none d-lg-block">
          <img src="/images/register-image.jpg" class="img-fluid h-100 w-100 object-fit-cover" alt="Registro" />
        </div>

        <div class="col-lg-6 col-12 d-flex align-items-center bg-white">
          <div class="card-body p-4 p-lg-5">

            <div class="text-center mb-4">
              <h2 class="fw-bold text-uppercase">Iniciar sesión</h2>
              <div v-if="errorMessage != ''" class="alert alert-danger">{{ errorMessage }}</div>
            </div>

            <form>
              <div class="mb-3 input-group">
                <span class="input-group-text border-end-0 icon-bg">
                  <i class="bi bi-person-fill"></i>
                </span>
                <input class="form-control border-start-0" v-model.trim="email" type="text" placeholder="Email" />
              </div>

              <div class="mb-3 input-group">
                <span class="input-group-text border-end-0 icon-bg">
                  <i class="bi bi-key-fill"></i>
                </span>
                <input class="form-control border-start-0" v-model.trim="password" type="password"
                  placeholder="Contraseña" />
              </div>

              <div class="d-grid mb-4">
                <button class="btn btn-primary btn-lg rounded-pill fw-bold" type="submit" @click.prevent="login()">
                  Entrar
                </button>
              </div>

              <div class="text-center">
                <p class="mb-0 text-muted-custom small">¿Aún no tienes cuenta?</p>
                <RouterLink to="/register" class="register-link fw-bold text-decoration-none">Regístrate</RouterLink>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
