<script setup>
import { onMounted, ref, computed } from 'vue';
import RouteCard from '@/components/RouteCard.vue';
import { useRouter } from 'vue-router';

let router = useRouter();

// necesitamos la sesión para obtener el email
const props = defineProps({
  sesion: Object
})

if (props.sesion.rol !== "cliente") router.push("/");

onMounted(async () => {
  console.log(props.sesion)
  getReservasCliente()
})

// mensaje que se muestra al eliminar la ruta
const mensajeSuccess = ref("");

// al cerrar la confirmación, se reinicia el mensaje.
function mensajeSuccessReset() {
  mensajeSuccess.value = "";
}

// funcion para obtener todas las reservas de un usuario
const reservas = ref([]);
async function getReservasCliente() {
  try {
    const peticion = await fetch(`http://localhost:8000/api.php/reservas?email=${props.sesion.email}`, {
      method: 'GET',
    });

    const respuesta = await peticion.json();
    reservas.value = respuesta;
    console.log(respuesta);

  } catch {
    console.log("Error al cargar reservas");
  }
}

// función para el emit rutaEliminada que nos manda el componente RouteCard
async function recargarRutas() {
  await getReservasCliente();
  mensajeSuccess.value = "Ruta eliminada correctamente."
}

// vamos a filtrar las reservas para mostrar las 'Ya hechas' y poder valorarlas... y mostrar las 'Pendientes' y poder cancelarlas.
const ahora = new Date();

// utilizamos computed para que se actualice cuando se rellene el array 'reservas' tras el fetch
const rutasHechas = computed(() => {
  return reservas.value.filter(ruta => new Date(ruta.ruta_fecha) < ahora);
});

const reservasPendientes = computed(() => {
  return reservas.value.filter(ruta => new Date(ruta.ruta_fecha) >= ahora);
});

// vamos a tener una flag para saber si queremos mostrar las 'Ya hechas' o las 'Pendientes'
const vistaActiva = ref('pendientes');

</script>

<template>
  <div class="view-routes-page py-5">
    <div class="container">
      <div class="text-center mb-5">
        <h2 class="fw-bold text-uppercase text-forest">Mis reservas</h2>
        <p class="text-muted">Gestiona tus próximas rutas o revisa tu historial</p>
        <div class="divider mx-auto"></div>
      </div>

      <div class="d-flex justify-content-center mb-5">
        <div class="btn-group shadow-sm rounded-pill overflow-hidden border-forest">
          <button @click="vistaActiva = 'pendientes'" class="btn px-4 py-2 fw-bold text-uppercase"
            :class="vistaActiva === 'pendientes' ? 'btn-forest' : 'btn-white text-forest'">
            Pendientes
          </button>
          <button @click="vistaActiva = 'yaHechas'" class="btn px-4 py-2 fw-bold text-uppercase"
            :class="vistaActiva === 'yaHechas' ? 'btn-forest' : 'btn-white text-forest'">
            Ya hechas
          </button>
        </div>
      </div>

      <div v-if="mensajeSuccess !== ''"
        class="alert alert-custom-success border-0 shadow-sm alert-dismissible fade show mb-5" role="alert">
        <div class="d-flex align-items-center">
          <i class="bi bi-check-circle-fill me-2 fs-5"></i>
          <div class="fw-medium">{{ mensajeSuccess }}</div>
        </div>
        <button type="button" class="btn-close" @click="mensajeSuccessReset"></button>
      </div>

      <div v-if="vistaActiva == 'pendientes'">
        <div class="row g-4 justify-content-center">
          <div v-for="ruta in reservasPendientes" :key="ruta.id"
            class="col-12 col-md-6 col-lg-4 d-flex flex-column align-items-center">
            <RouteCard :reservasCliente="true" :id_reserva="ruta.reserva_id" :id="ruta.ruta_id"
              :titulo="ruta.ruta_titulo" :localidad="ruta.ruta_localidad" :descripcion="ruta.ruta_descripcion"
              :foto="ruta.ruta_foto" @rutaEliminada="recargarRutas" />
          </div>
        </div>
      </div>

      <div v-if="vistaActiva == 'yaHechas'">
        <div class="row g-4 justify-content-center">
          <div v-for="ruta in rutasHechas" :key="ruta.id"
            class="col-12 col-md-6 col-lg-4 d-flex flex-column align-items-center">
            <RouteCard :reservasCliente="true" :id_reserva="ruta.reserva_id" :rutaYaHecha="true" :id="ruta.ruta_id"
              :titulo="ruta.ruta_titulo" :localidad="ruta.ruta_localidad" :descripcion="ruta.ruta_descripcion"
              :foto="ruta.ruta_foto" :id_cliente="props.sesion.id" />
          </div>
        </div>
      </div>

      <div
        v-if="(rutasHechas.length === 0 && vistaActiva == 'yaHechas') || (reservasPendientes.length === 0 && vistaActiva == 'pendientes')"
        class="text-center py-5">
        <i class="bi bi-calendar-x text-muted display-1"></i>
        <p class="mt-3 fs-5 text-muted">No tienes ninguna reserva actualmente.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-forest {
  color: #386641;
}

.divider {
  width: 60px;
  height: 4px;
  background-color: #A7C957;
  border-radius: 2px;
}

/* Estilos de los botones del selector */
.border-forest {
  border: 2px solid #386641;
}

.btn-forest {
  background-color: #386641;
  color: white;
  border: none;
}

.btn-white {
  background-color: white;
  color: #386641;
  border: none;
}

.btn-brick {
  background-color: #BC4749;
  color: white;
  border: none;
  font-size: 0.85rem;
}

.btn-lime {
  background-color: #A7C957;
  border: none;
  font-size: 0.85rem;
}

.btn {
  transition: all 0.3s ease;
}

.alert-custom-success {
  background-color: #386641;
  color: white;
  border-left: 5px solid #A7C957 !important;
}

.alert-custom-success .btn-close {
  color: white;
}
</style>