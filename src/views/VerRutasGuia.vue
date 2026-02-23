<script setup>
import { onMounted, ref, computed } from 'vue';
import RouteCard from '@/components/RouteCard.vue';

const props = defineProps({
    sesion: Object
})

onMounted(async () => {
    getAsignacionesGuia()
})

const mensajeSuccess = ref("");
const reservas = ref([]);

function mensajeSuccessReset() {
    mensajeSuccess.value = "";
}

async function getAsignacionesGuia() {
    try {
        // Usamos el ID de la sesión del guía
        const peticion = await fetch(`http://localhost:8000/api.php/asignaciones?guia_id=${props.sesion.id}`);
        const respuesta = await peticion.json();
        reservas.value = respuesta;

    } catch {
        console.log("Error al cargar asignaciones");
    }
}

// Filtros por fecha
const ahora = new Date();
const rutasHechas = computed(() => {
    return reservas.value.filter(ruta => new Date(ruta.ruta_fecha) < ahora);
});
const reservasPendientes = computed(() => {
    return reservas.value.filter(ruta => new Date(ruta.ruta_fecha) >= ahora);
});

const vistaActiva = ref('pendientes');
</script>

<template>
  <div class="view-routes-page py-5">
    <div class="container">
      <div class="text-center mb-5">
        <h2 class="fw-bold text-uppercase text-forest">Mis rutas asignadas</h2>
        <p class="text-muted">Consulta tu calendario de rutas y el historial de tours realizados</p>
        <div class="divider mx-auto"></div>
      </div>

      <div class="d-flex justify-content-center mb-5">
        <div class="btn-group shadow-sm rounded-pill overflow-hidden border-forest">
          <button @click="vistaActiva = 'pendientes'" 
            class="btn px-4 py-2 fw-bold text-uppercase"
            :class="vistaActiva === 'pendientes' ? 'btn-forest' : 'btn-white text-forest'">
            Próximas rutas
          </button>
          <button @click="vistaActiva = 'yaHechas'" 
            class="btn px-4 py-2 fw-bold text-uppercase"
            :class="vistaActiva === 'yaHechas' ? 'btn-forest' : 'btn-white text-forest'">
            Historial
          </button>
        </div>
      </div>

      <div class="row g-4 justify-content-center">
        
        <div v-if="vistaActiva == 'pendientes'" class="row g-4 justify-content-center">
          <div v-for="ruta in reservasPendientes" :key="ruta.id" class="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
            <RouteCard 
              :id="ruta.ruta_id" 
              :titulo="ruta.ruta_titulo" 
              :localidad="ruta.ruta_localidad"
              :descripcion="ruta.ruta_descripcion" 
              :foto="ruta.ruta_foto"
              :reservasCliente="false" 
              :asignacionesGuia="true"
            />
            </div>
        </div>

        <div v-if="vistaActiva == 'yaHechas'" class="row g-4 justify-content-center">
          <div v-for="ruta in rutasHechas" :key="ruta.id" class="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
            <RouteCard 
              :id="ruta.ruta_id" 
              :titulo="ruta.ruta_titulo" 
              :localidad="ruta.ruta_localidad"
              :descripcion="ruta.ruta_descripcion" 
              :foto="ruta.ruta_foto"
              :rutaYaHecha="true"
              :reservasCliente="false"
            />
          </div>
        </div>

      </div>

      <div v-if="(vistaActiva === 'pendientes' && reservasPendientes.length === 0) || (vistaActiva === 'yaHechas' && rutasHechas.length === 0)" 
           class="text-center py-5">
        <i class="bi bi-calendar-check text-muted display-1"></i>
        <p class="mt-3 fs-5 text-muted">No tienes rutas en esta sección.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-forest { color: #386641; }
.divider { width: 60px; height: 4px; background-color: #A7C957; border-radius: 2px; }
.border-forest { border: 2px solid #386641; }
.btn-forest { background-color: #386641; color: white; border: none; }
.btn-white { background-color: white; color: #386641; border: none; }
.btn-brick { background-color: #BC4749; color: white; border: none; font-size: 0.85rem; }
.btn-lime { background-color: #A7C957; border: none; font-size: 0.85rem; }
.btn { transition: all 0.3s ease; }
.alert-custom-success { background-color: #386641; color: white; border-left: 5px solid #A7C957 !important; }
.alert-custom-success .btn-close { color: white; }
</style>