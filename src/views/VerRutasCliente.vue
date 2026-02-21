<script setup>
import { onMounted, ref, computed } from 'vue';
import RouteCard from '@/components/RouteCard.vue';

// necesitamos la sesión para obtener el email
const props = defineProps({
    sesion: Object
})

onMounted(async () => {
    getReservasCliente()
})

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
                <p class="text-muted">Visualiza las rutas que tienes reservadas y gestiona tus plazas</p>
                <div class="divider mx-auto"></div>
            </div>

            <div>
                <button @click="vistaActiva = 'pendientes'">Pendientes</button>
                <button @click="vistaActiva = 'yaHechas'">Ya hechas</button>
            </div>

            <div class="row g-4 justify-content-center">
                <div v-if="vistaActiva == 'pendientes'">
                    <div v-for="ruta in reservasPendientes" :key="ruta.id" class="col-12 col-md-6 col-lg-4 d-flex flex-column align-items-center">
                        <RouteCard :reservasCliente = "true" :id_reserva="ruta.reserva_id"
                            :id="ruta.ruta_id" 
                            :titulo="ruta.ruta_titulo" 
                            :localidad="ruta.ruta_localidad"
                            :descripcion="ruta.ruta_descripcion" 
                            :foto="ruta.ruta_foto">
                        </RouteCard>
                    </div>
                </div>

                <div v-if="vistaActiva == 'yaHechas'">
                    <div v-for="ruta in rutasHechas" :key="ruta.id" class="col-12 col-md-6 col-lg-4 d-flex flex-column align-items-center">
                        <RouteCard :reservasCliente = "true" :id_reserva="ruta.reserva_id"
                            :id="ruta.ruta_id" 
                            :titulo="ruta.ruta_titulo" 
                            :localidad="ruta.ruta_localidad"
                            :descripcion="ruta.ruta_descripcion" 
                            :foto="ruta.ruta_foto">
                        </RouteCard>
                    </div>
                </div>

            </div>

            <div v-if="reservas.length === 0" class="text-center py-5">
                <i class="bi bi-calendar-x text-muted display-1"></i>
                <p class="mt-3 fs-5 text-muted">No tienes ninguna reserva activa actualmente.</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.view-routes-page {
    background-color: #F2E8CF; /* Fondo crema para consistencia */
    min-height: 100vh;
}

.text-forest { color: #386641; }

.divider {
    width: 60px;
    height: 4px;
    background-color: #A7C957; /* Verde Lima */
    border-radius: 2px;
}



</style>