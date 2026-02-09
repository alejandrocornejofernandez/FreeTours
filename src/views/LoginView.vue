<script setup>
import { ref } from 'vue';
import router from '@/router';

import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'

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
  <Header></Header>
  <div class="container mt-5">
    <div class="card shadow-lg border-0 rounded-4 overflow-hidden login-card">
      <div class="row g-0"> 
        <div class="col-lg-6 d-none d-lg-block">
          <img 
            src="/public/images/register-image.jpg" 
            class="img-fluid h-100 w-100 object-fit-cover" 
            alt="Registro"
          />
        </div>

        <div class="col-lg-6 col-12 d-flex align-items-center bg-white">
          <div class="card-body p-4 p-lg-5 text-black">

            <div class="text-center mb-4">
              <h2 class="fw-bold text-primary text-uppercase">Iniciar sesión</h2>
              <div v-if="errorMessage != ''" class="alert alert-danger">{{ errorMessage }}</div>
            </div>

            <form>
              <div class="mb-3 input-group">
                <span class="input-group-text bg-light border-end-0 icon-bg">
                  <i class="bi bi-person-fill text-primary"></i>
                </span>
                <input class="form-control border-start-0 border-end-0" v-model.trim="email" type="text" placeholder="Email" />
              </div>

              <div class="mb-3 input-group">
                <span class="input-group-text bg-light border-end-0 icon-bg">
                  <i class="bi bi-key-fill text-primary"></i>
                </span>
                <input class="form-control border-start-0 border-end-0" v-model.trim="password" type="password" placeholder="Contraseña" />
              </div>

              <div class="d-grid mb-3">
                <input class="btn btn-primary btn-lg rounded-pill fw-bold" type="submit" value="Iniciar sesión" @click.prevent="login()" />
              </div>

              <div class="text-center">
                <p class="mb-0 text-muted">¿Aún no tienes cuenta?</p>
                <RouterLink to="/register" class="text-primary fw-bold text-decoration-none register-link">Regístrate</RouterLink>
              </div>

            </form>

          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer></Footer>
</template>

<style>
/* =========================
   VARIABLES DE COLOR
   ========================= */
:root {
  --green-darkest: #132A13;
  --green-dark: #31572C;
  --green-main: #4F772D;
  --green-light: #90A955;
  --green-cream: #ECF39E;
}

/* =========================
   ESTILOS GENERALES
   ========================= */
body {
  background-color: var(--green-cream);
  color: var(--green-darkest);
  font-family: 'Roboto', sans-serif;
}
header a:hover {
  color: var(--green-light);
}

/* =========================
   TEXTOS
   ========================= */
.text-primary {
  color: var(--green-main) !important;
}

.text-muted {
  color: var(--green-dark) !important;
}

/* =========================
   CARDS
   ========================= */
.card {
  background-color: #ffffff;
  border-radius: 1rem;
}

.login-card {
  border-left: 6px solid var(--green-main);
}

/* =========================
   BOTONES
   ========================= */
.btn-primary {
  background-color: var(--green-main);
  border-color: var(--green-dark);
  color: #ffffff;
}

.btn-primary:hover {
  background-color: var(--green-dark);
  border-color: var(--green-darkest);
}

.btn-primary:focus {
  box-shadow: 0 0 0 0.2rem rgba(79, 119, 45, 0.4);
}

/* =========================
   INPUTS
   ========================= */
.form-control {
  border-color: var(--green-light);
}

.form-control:focus {
  border-color: var(--green-main);
  box-shadow: 0 0 0 0.2rem rgba(79, 119, 45, 0.25);
}

/* =========================
   INPUT GROUP ICONS
   ========================= */
.input-group-text {
  background-color: var(--green-light);
  color: var(--green-darkest);
  border: none;
}

/* =========================
   ALERTAS
   ========================= */
.alert-danger {
  background-color: var(--green-dark);
  color: var(--green-cream);
  border: none;
}

/* =========================
   LINKS
   ========================= */
a {
  color: var(--green-main);
}

a:hover {
  color: var(--green-dark);
  text-decoration: underline;
}
</style>
