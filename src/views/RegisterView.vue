<script setup>
import { computed, ref } from 'vue'

import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import router from '@/router'

// variables del registro
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

// variables computed para las clases de los inputs, se añade reactividad al formulario
const nameInput = computed(() => name.value.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]{2,50}$/) ? 'valid-input' : '');
const emailInput = computed(() => email.value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/) ? 'valid-input' : '');
const passwordInput = computed(() => password.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_-])([A-Za-z\d$@$!%*?&]|[^ ]){8,}$/) ? 'valid-input' : '');
const confirmPasswordInput = computed(() => (password.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_-])([A-Za-z\d$@$!%*?&]|[^ ]){8,}$/,) && password.value == confirmPassword.value ? 'valid-input' : ''))

// funcion para registrarse
async function register() {
  const data = {
    nombre: name.value,
    email: email.value,
    contraseña: password.value,
  }

  const peticion = await fetch('http://localhost:8000/api.php/usuarios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const respuesta = await peticion.json()

  if (respuesta.status == 'success') {
    router.push('/')
  } else {
    console.log(respuesta.message)
  }
}

// antes de enviar la petición al servidor, voy a crear una función que asegure que los datos que se mandan son válidos.
function validarRegistro() {
  let nameValido = false
  let emailValido = false
  let contraseñaValida = false

  // validamos con expresiones regulares los 3 campos del registro
  if (email.value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)) {
    console.log('Email válido')
    emailValido = true
  } else {
    emailInput.value = 'error-input'
  }

  if (name.value.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]{2,50}$/)) {
    console.log('Nombre válido')
    nameValido = true
  } else {
    nameInput.value = 'error-input'
  }

  /* en el caso de la contraseña, como hacemos que se introduzca dos veces, comparamos ambos inputs. 
    / la expresión regular asegura que la contraseña contenga al menos: 
    / - Minimo 8 caracteres
    / - Al menos una letra mayúscula
    / - Al menos una letra minucula
    / - Al menos un dígito
    / - No espacios en blanco
    / - Al menos 1 caracter especial
    */

  if (
    password.value.match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_-])([A-Za-z\d$@$!%*?&]|[^ ]){8,}$/,
    ) &&
    password.value == confirmPassword.value
  ) {
    console.log('Contraseña válida')
    contraseñaValida = true
  } else {
    passwordInput.value = 'error-input'
    confirmPasswordInput.value = 'error-input'
  }

  if (nameValido && emailValido && contraseñaValida) register()
}

</script>

<template>
  <div class="container mt-5">
    <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
      <div class="row g-0">
        <div class="col-lg-6 d-none d-lg-block">
          <img src="/images/register-image.jpg" class="img-fluid h-100 w-100 object-fit-cover" alt="Registro" />
        </div>

        <div class="col-lg-6 col-12 d-flex align-items-center bg-white">
          <div class="card-body p-4 p-lg-5 text-black">

            <div class="text-center mb-4">
              <h2 class="fw-bold text-primary text-uppercase">Regístrate</h2>
            </div>

            <form>
              <div class="mb-3 input-group">
                <span class="input-group-text bg-light border-end-0">
                  <i class="bi bi-person-fill text-primary"></i>
                </span>
                <input class="form-control border-start-0 border-end-0" :class="nameInput" v-model.trim="name"
                  type="text" placeholder="Nombre" />
                <span class="input-group-text bg-white border-start-0">
                  <i class="bi bi-check text-success" v-if="nameInput == 'valid-input'"></i>
                </span>
              </div>

              <div class="mb-3 input-group">
                <span class="input-group-text bg-light border-end-0">
                  <i class="bi bi-envelope-fill text-primary"></i>
                </span>
                <input class="form-control border-start-0 border-end-0" :class="emailInput" v-model.trim="email"
                  type="text" placeholder="Email" />
                <span class="input-group-text bg-white border-start-0">
                  <i class="bi bi-check text-success" v-if="emailInput == 'valid-input'"></i>
                </span>
              </div>

              <div class="mb-3 input-group">
                <span class="input-group-text bg-light border-end-0">
                  <i class="bi bi-key-fill text-primary"></i>
                </span>
                <input class="form-control border-start-0 border-end-0" :class="passwordInput" v-model.trim="password"
                  type="password" placeholder="Contraseña" />
                <span class="input-group-text bg-white border-start-0">
                  <i class="bi bi-check text-success" v-if="passwordInput == 'valid-input'"></i>
                </span>
              </div>

              <div class="mb-4 input-group">
                <span class="input-group-text bg-light border-end-0">
                  <i class="bi bi-key-fill text-primary"></i>
                </span>
                <input class="form-control border-start-0 border-end-0" :class="confirmPasswordInput"
                  v-model.trim="confirmPassword" type="password" placeholder="Repite la contraseña" />
                <span class="input-group-text bg-white border-start-0">
                  <i class="bi bi-check text-success" v-if="confirmPasswordInput == 'valid-input'"></i>
                </span>
              </div>

              <div class="d-grid mb-3">
                <input type="submit" class="btn btn-primary btn-lg rounded-pill fw-bold" value="Crea tu cuenta"
                  @click.prevent="validarRegistro()" />
              </div>

              <div class="text-center">
                <p class="mb-0 text-muted">¿Ya tienes cuenta?</p>
                <RouterLink to="/login" class="text-primary fw-bold text-decoration-none">
                  Inicia sesión aquí
                </RouterLink>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.valid-input {
  background-color: #d4edda;
}

.error-input {
  background-color: #f8d7da;
}
</style>
