<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const props = defineProps({
  modalReserva: Boolean,
})

const emits = defineEmits(["login"]);

async function login() {
  const data = {
    email: email.value,
    contraseña: password.value
  }

  try {
    const peticion = await fetch("http://localhost:8000/api.php/usuarios?login", {
      method: "POST",
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(data)
    });

    const respuesta = await peticion.json();

    if (respuesta.status == "success") {
      const sesion = {
        nombre: respuesta.user.nombre,
        rol: respuesta.user.rol,
        email: respuesta.user.email
      }

      // si el login es correcto, creamos la sesion en el localStorage
      localStorage.setItem('session', JSON.stringify(sesion));
      emits('login')

      // mostramos la vista Home
      if (!props.modalReserva) router.push("/");


    } else {
      errorMessage.value = "El email o la contraseña son incorrectos";
    }

  } catch {
    errorMessage.value = "Error en la conexión con el servidor";
  }
}
</script>

<template>
  <div class="py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-5">
          <div class="card shadow-lg border-0 rounded-4 overflow-hidden login-card">
            <div class="card-body p-4 p-lg-5 bg-white">

              <div class="text-center mb-4">
                <h2 class="fw-bold text-uppercase text-forest">Iniciar sesión</h2>
                <p class="text-muted small">Inicia sesión en FreeTours</p>

                <div v-if="errorMessage != ''" class="alert alert-custom-danger mt-3">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  {{ errorMessage }}
                </div>
              </div>

              <form @submit.prevent="login()">
                <div class="mb-3 input-group custom-input-group">
                  <span class="input-group-text border-end-0 bg-cream">
                    <i class="bi bi-person-fill text-forest"></i>
                  </span>
                  <input class="form-control border-start-0 border-end-0" v-model.trim="email" type="email"
                    placeholder="Email" required />
                </div>

                <div class="mb-3 input-group custom-input-group">
                  <span class="input-group-text bg-cream border-end-0">
                    <i class="bi bi-key-fill text-forest"></i>
                  </span>
                  <input class="form-control border-start-0 border-end-0" v-model.trim="password" type="password"
                    placeholder="Contraseña" />
                  <span class="input-group-text bg-white border-start-0">
                    <i class="bi bi-check-circle-fill text-lime" v-if="passwordInput == 'valid-input'"></i>
                  </span>
                </div>

                <div class="d-grid mb-3">
                  <button type="submit" class="btn btn-forest btn-lg rounded-pill fw-bold shadow-sm text-uppercase">
                    Entrar
                  </button>
                </div>

                <div class="text-center">
                  <p class="mb-0 text-muted small">¿Aún no tienes cuenta?</p>
                  <RouterLink to="/register" class="register-link fw-bold text-decoration-none">
                    Registrate aquí
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
.login-card {
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

/* botón 'Entrar' */
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