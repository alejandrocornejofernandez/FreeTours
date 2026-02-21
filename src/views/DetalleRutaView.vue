<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import LoginView from './LoginView.vue'

// necesitamos recibir la sesión para saber si el usuario puede reservar o no
const props = defineProps({
  sesion: Object
})

// AÑADIMOS los emits para poder avisar al padre (App.vue)
const emits = defineEmits(['login']);

const route = useRoute()
const id = route.params.id
const ruta = ref('')
let map

// función para obtener la ruta mediante el id de la misma
async function getRoute() {
  try {
    const peticion = await fetch(`http://localhost:8000/api.php/rutas?id=${id}`, {
      method: 'GET',
    })

    const respuesta = await peticion.json()
    ruta.value = respuesta

    console.log(ruta.value.longitud)
  } catch {
    console.log('Error al obtener la ruta')
  }
}

// dibujamos el mapa con las coordenadas de la ruta
onMounted(async () => {
  await getRoute()

  if (ruta.value) {
    map = L.map('map').setView([ruta.value.latitud, ruta.value.longitud], 14)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    // Añadimos el marcador
    L.marker([ruta.value.latitud, ruta.value.longitud])
      .addTo(map)
  }
})

// función para abrir un modal u otro dependiendo de si tenemos la sesión iniciada o no.
const mostrarModalLogin = ref(false);
const mostrarModalReserva = ref(false);

function abrirModal() {
  if (props.sesion) {
    mostrarModalReserva.value = true;
  } else {
    mostrarModalLogin.value = true;
  }
}

// esta función esta escuchando el login del LoginView, una vez que me logueo en el modal, cierro ese modal y muestro el de reserva
function cerrarModalLogin() {
  mostrarModalLogin.value = false;
  mostrarModalReserva.value = true;
  emits('login');
}

// función para realizar la reserva
const numeroAsistentes = ref('');
async function crearReserva() {

  const dataReserva = {
    email: props.sesion.email,
    ruta_id: ruta.value.id,
    num_personas: numeroAsistentes.value
  }
  try {
  const peticion = await fetch("http://localhost:8000/api.php/reservas", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataReserva)
  })

  const respuesta = await peticion.json()
  
  if(respuesta.status == "success") {

  }

  } catch (error) {
    console.error(error);
  }

}
 
</script>

<template>
  <div class="page-bg">
    <div class="hero-ruta shadow-sm py-5 mb-5" :style="{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('http://localhost:8000/images/${ruta.foto}')`
    }">
      <div class="container text-center">
        <h1 class="display-4 fw-bold text-uppercase mb-2 text-white">{{ ruta.titulo }}</h1>
        <div class="d-flex justify-content-center align-items-center">
          <span class="badge bg-lime text-forest px-3 py-2 rounded-pill fs-6">
            <i class="bi bi-geo-alt-fill me-2"></i>{{ ruta.localidad }}
          </span>
        </div>
      </div>
    </div>

    <div class="container pb-5">
      <div class="row g-4">
        <div class="col-lg-6">
          <div class="card border-0 shadow-lg rounded-4 overflow-hidden h-100">
            <div class="card-header bg-forest text-white py-3 border-0">
              <h5 class="m-0 fw-bold text-center text-uppercase">
                <i class="bi bi-map-fill me-2"></i>Ubicación
              </h5>
            </div>
            <div class="card-body p-0">
              <div id="map" style="height: 100%; min-height: 450px"></div>
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card border-0 shadow-lg rounded-4 overflow-hidden h-100">

            <div class="card-header bg-forest text-white py-3 border-0">
              <h5 class="m-0 fw-bold text-center text-uppercase">
                <i class="bi bi-info-circle me-2"></i>Información
              </h5>
            </div>

            <div class="card-body p-4">
              <div class="info-item mb-4 text-center">
                <label class="text-muted small text-uppercase fw-bold d-block mb-2">Descripción</label>
                <p class="text-secondary lead-custom">{{ ruta.descripcion }}</p>
              </div>

              <div class="row g-3 mb-2">
                <div class="col-6">
                  <div class="p-3 rounded-3 bg-cream-light text-center">
                    <label class="text-muted small d-block text-uppercase">Fecha</label>
                    <span class="fw-bold text-forest"><i class="bi bi-calendar3 me-2"></i>{{ ruta.fecha }}</span>
                  </div>
                </div>

                <div class="col-6">
                  <div class="p-3 rounded-3 bg-cream-light text-center">
                    <label class="text-muted small d-block text-uppercase">Hora</label>
                    <span class="fw-bold text-forest"><i class="bi bi-clock me-2"></i>{{ ruta.hora }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-header bg-forest text-white py-3 border-0">
              <h5 class="m-0 fw-bold text-center text-uppercase">
                <i class="bi bi-bookmark-fill me-2"></i>Reserva tu plaza
              </h5>
            </div>

            <div class="card-body p-4 bg-light-subtle">
              <div class="d-flex flex-column align-items-center">
                <p class="text-muted small mb-4 text-center">
                  Asegura tu lugar en esta ruta. Las plazas son limitadas.
                </p>
                <button type="submit"
                  class="btn btn-brick btn-lg rounded-pill fw-bold shadow-sm text-uppercase px-5 py-3 w-75"
                  @click="abrirModal">
                  Reservar ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal usuario no logueado -->
  <div class="modal fade" v-if="mostrarModalLogin" :class="{ show: mostrarModalLogin }" style="display: block;"
    tabindex="-1" aria-labelledby="modalLoginLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="btn-close" @click="mostrarModalLogin = false"></button>
        </div>
        <div class="modal-body">
          <LoginView :modalReserva="mostrarModalLogin" @login="cerrarModalLogin"></LoginView>
        </div>
      </div>
    </div>
  </div>

  <div class="modal-backdrop fade show" v-if="mostrarModalLogin"></div>

  <div class="modal fade" v-if="mostrarModalReserva" :class="{ show: mostrarModalReserva }" style="display: block;"
  tabindex="-1" aria-labelledby="modalReservaLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
      
      <div class="modal-header bg-forest text-white border-0 py-3">
        <div class="w-100 text-center position-relative">
          <h5 class="modal-title text-uppercase fw-bold m-0" id="modalReservaLabel">
            <i class="bi bi-calendar-check me-2"></i>Finalizar Reserva
          </h5>
          <button type="button" class="btn-close btn-close-white position-absolute end-0 top-50 translate-middle-y" 
            @click="mostrarModalReserva = false"></button>
        </div>
      </div>

      <div class="modal-body p-4 p-lg-5">
        <div class="text-center mb-4">
          <p class="text-muted small mb-1">Estás reservando plaza para:</p>
          <h5 class="text-forest fw-bold text-uppercase">{{ ruta.titulo }}</h5>
        </div>

        <div class="row justify-content-center">
          <div class="col-md-8">
            <label class="form-label small fw-bold text-uppercase text-muted">Número de asistentes</label>
            <div class="mb-4 input-group custom-input-group">
              <span class="input-group-text border-end-0 bg-cream text-forest">
                <i class="bi bi-person-plus-fill"></i>
              </span>
              <input class="form-control border-start-0" type="number" min="1" 
                placeholder="¿Cuántos vendréis?" v-model="numeroAsistentes" />
            </div>

            <div class="p-3 rounded-3 bg-light border-start border-forest border-4">
              <p class="mb-0 small text-muted">
                <i class="bi bi-envelope-fill me-2 text-forest"></i>
                La reserva se está llevando a cabo para: <span class="fw-bold text-dark">{{ props.sesion.email }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer border-0 d-flex justify-content-center pb-4 gap-3">
        <button type="button" class="btn btn-outline-forest rounded-pill px-4 fw-bold text-uppercase" 
          @click="mostrarModalReserva = false">
          Cancelar
        </button>
        <button type="button" @click="crearReserva" class="btn btn-brick btn-lg rounded-pill px-5 fw-bold text-uppercase shadow-sm">
          Confirmar reserva
        </button>
      </div>
      
    </div>
  </div>
</div>

<div class="modal-backdrop fade show" v-if="mostrarModalReserva"></div>

</template>

<style scoped>
.hero-ruta {
  background-color: #386641;
  background-size: cover;
  background-position: center;
  border-bottom: 5px solid #a7c957;
}

.text-white {
  color: white;
}

.text-forest {
  color: #386641;
}

.bg-forest {
  background-color: #386641;
}

.bg-lime {
  background-color: #a7c957;
}

.lead-custom {
  font-size: 1.1rem;
  line-height: 1.6;
}

.btn-brick {
  background-color: #BC4749;
  color: white;
  border: none;
  transition: all 0.3s ease;
}

.btn-brick:hover {
  background-color: #a33b3d;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(188, 71, 73, 0.4) !important;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(155, 109, 110, 0.4) !important;
}

.bg-cream-light {
  background-color: rgba(167, 201, 87, 0.15);
  border: 1px solid rgba(106, 153, 78, 0.2);
}

.custom-group .input-group-text {
    background-color: #F2E8CF;
    color: #386641;
    border: 1px solid #ced4da;
    border-right: none;
}

.custom-group .form-control {
    border-left: none;
    padding: 12px;
}

.form-control:focus {
    box-shadow: none;
    border-color: #6A994E;
}
</style>