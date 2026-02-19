<script setup>
import { computed, ref } from 'vue'
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
  <div class="py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-5">
          <div class="card shadow-lg border-0 rounded-4 overflow-hidden register-card">
            <div class="card-body p-4 p-lg-5 bg-white">

              <div class="text-center mb-4">
                <h2 class="fw-bold text-uppercase text-forest">Regístrate</h2>
                <p class="text-muted small">Crea tu cuenta en FreeTours</p>
              </div>

              <form @submit.prevent="validarRegistro()">
                <div class="mb-3 input-group custom-input-group">
                  <span class="input-group-text border-end-0 bg-cream">
                    <i class="bi bi-person-fill text-forest"></i>
                  </span>
                  <input class="form-control border-start-0 border-end-0" :class="nameInput" v-model.trim="name"
                    type="text" placeholder="Nombre" />
                  <span class="input-group-text bg-white border-start-0">
                    <i class="bi bi-check-circle-fill text-lime" v-if="nameInput == 'valid-input'"></i>
                  </span>
                </div>

                <div class="mb-3 input-group custom-input-group">
                  <span class="input-group-text bg-cream border-end-0">
                    <i class="bi bi-envelope-fill text-forest"></i>
                  </span>
                  <input class="form-control border-start-0 border-end-0" :class="emailInput" v-model.trim="email"
                    type="text" placeholder="Email" />
                  <span class="input-group-text bg-white border-start-0">
                    <i class="bi bi-check-circle-fill text-lime" v-if="emailInput == 'valid-input'"></i>
                  </span>
                </div>

                <div class="mb-3 input-group custom-input-group">
                  <span class="input-group-text bg-cream border-end-0">
                    <i class="bi bi-key-fill text-forest"></i>
                  </span>
                  <input class="form-control border-start-0 border-end-0" :class="passwordInput" v-model.trim="password"
                    type="password" placeholder="Contraseña" />
                  <span class="input-group-text bg-white border-start-0">
                    <i class="bi bi-check-circle-fill text-lime" v-if="passwordInput == 'valid-input'"></i>
                  </span>
                </div>

                <div class="mb-4 input-group custom-input-group">
                  <span class="input-group-text bg-cream border-end-0">
                    <i class="bi bi-shield-lock-fill text-forest"></i>
                  </span>
                  <input class="form-control border-start-0 border-end-0" :class="confirmPasswordInput"
                    v-model.trim="confirmPassword" type="password" placeholder="Repite la contraseña" />
                  <span class="input-group-text bg-white border-start-0">
                    <i class="bi bi-check-circle-fill text-lime" v-if="confirmPasswordInput == 'valid-input'"></i>
                  </span>
                </div>

                <div class="d-grid mb-3">
                  <button type="submit" class="btn btn-forest btn-lg rounded-pill fw-bold shadow-sm text-uppercase">
                    Crea tu cuenta
                  </button>
                </div>

                <div class="text-center">
                  <p class="mb-0 text-muted small">¿Ya tienes cuenta?</p>
                  <RouterLink to="/login" class="register-link fw-bold text-decoration-none">
                    Inicia sesión aquí
                  </RouterLink>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* color para el texto */
.text-forest {
  color: #386641;
}

/* color para el texto */
.text-lime {
  color: #6A994E;
}

/* card con color personalizado */
.register-card {
  border-top: 5px solid #386641;
}

/* inputs */
.bg-cream {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

/* color de los iconos */
.custom-input-group .form-control:focus {
  border-color: #A7C957;
  box-shadow: 0 0 0 0.25rem rgba(167, 201, 87, 0.15);
}

/* clases para validar si los campos son correctos o incorrectos */
.valid-input {
  background-color: rgba(167, 201, 87, 0.08) !important;
  border-color: #A7C957 !important;
}

.error-input {
  background-color: rgba(188, 71, 73, 0.08) !important;
  border-color: #BC4749 !important;
}

/* botón 'Crea tu cuenta' */
.btn-forest {
  background-color: #386641;
  color: white;
  border: none;
  transition: all 0.3s ease;
}

.btn-forest:hover {
  background-color: #6A994E;
  color: white;
  transform: translateY(-1px);
}

.register-link {
  color: #BC4749;
}

.register-link:hover {
  color: #386641;
}
</style>