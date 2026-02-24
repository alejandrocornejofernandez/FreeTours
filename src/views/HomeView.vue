<script setup>
import { computed, onMounted, ref } from 'vue';
import RouteCard from '@/components/RouteCard.vue';

// Recibimos la sesión para que las tarjetas tengan el ID del cliente si es necesario
const props = defineProps({
    sesion: Object
})

onMounted(async () => {
    getRoutes()
})

// necesito la fecha actual para no permitir elegir una fecha anterior al usuario
const fechaActual = new Date().toISOString().split('T')[0];

// array de rutas que se llena en la función getRoutes()
const rutas = ref([]);

// array de rutas cuya fecha es futura que vamos a mostrar en el Home
const rutasNoHechas = computed(() => {
    return rutas.value.filter(ruta => {
        // Comparamos la fecha de la ruta con la fecha actual
        return ruta.fecha >= fechaActual;
    });
});

// Función para obtener todas las rutas (Carga inicial)
async function getRoutes() {
    try {
        const peticion = await fetch('http://localhost:8000/api.php/rutas', {
            method: 'GET',
        });

        const respuesta = await peticion.json();
        rutas.value = respuesta;

    } catch {
        console.log("Error al cargar rutas");
    }
}

// viene mejor iniciar fecha como '', puesto que es un campo opcional en el GET
const fecha = ref('');
const localidad = ref('');

// Variable para el mensaje de error
const errorFecha = ref("");

async function getRoutesFechaLocalidad() {
    // antes de hacer la peticion a la API validamos que la fecha sea válida
    if (fecha.value && fecha.value < fechaActual) {
        errorFecha.value = "No puedes seleccionar fechas del pasado";
        fecha.value = '';

        // utilizo setTimeout para eliminar el mensaje de error automaticamente
        setTimeout(() => { errorFecha.value = ""; }, 3000);
        return;
    }

    // si la fecha es válida, limpiamos el error
    errorFecha.value = "";

    // si no hay ningún input, llamamos a todas las rutas
    if (!fecha.value && !localidad.value) {
        await getRoutes();
    } else {
        try {
            const peticion = await fetch(`http://localhost:8000/api.php/rutas?fecha=${fecha.value}&localidad=${localidad.value}`);
            const respuesta = await peticion.json();
            rutas.value = respuesta;
        } catch {
            console.log("Error en el filtrado");
        }
    }
}
</script>

<template>
    <div class="home-page">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12 principal-image d-flex flex-column justify-content-center align-items-center">
                    <p class="h1 fw-bolder text-light text-uppercase text-center px-3">
                        El lugar donde se fabrican experiencias
                    </p>
                </div>
            </div>
        </div>

        <div class="container search-overlay mb-5">
            <div class="row justify-content-center">
                <div class="col-11 col-lg-10 position-relative">

                    <div v-if="errorFecha" class="error-bubble shadow-sm">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorFecha }}
                    </div>

                    <div class="card border-0 shadow-lg p-3 bg-white buscador-pill"
                        :class="{ 'border-error': errorFecha }">
                        <div class="row g-3 align-items-center">

                            <div class="col-12 col-md-5">
                                <div class="input-group custom-input-group px-3">
                                    <span class="input-group-text bg-transparent border-0 text-forest">
                                        <i class="bi bi-calendar-event-fill"></i>
                                    </span>
                                    <input v-model="fecha" type="date" :min="fechaActual"
                                        class="form-control border-0 bg-transparent fw-bold text-forest"
                                        @change="getRoutesFechaLocalidad" />
                                </div>
                            </div>

                            <div class="col-md-auto d-none d-md-block">
                                <div class="vr h-100 mx-2 text-muted opacity-25"></div>
                            </div>

                            <div class="col-12 col-md-5">
                                <div class="input-group custom-input-group px-3">
                                    <span class="input-group-text bg-transparent border-0 text-forest">
                                        <i class="bi bi-geo-alt-fill"></i>
                                    </span>
                                    <input v-model="localidad" class="form-control border-0 bg-transparent fw-bold"
                                        type="text" placeholder="Buscar por localidad"
                                        @input="getRoutesFechaLocalidad" />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="container pb-5">
            <div class="text-center mb-5">
                <h2 class="fw-bold text-uppercase text-forest">Nuestras Rutas</h2>
                <div class="divider mx-auto"></div>
            </div>

            <div class="row g-4 justify-content-center">
                <div v-for="ruta in rutasNoHechas" :key="ruta.id"
                    class="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
                    <RouteCard :id="ruta.id" :titulo="ruta.titulo" :localidad="ruta.localidad"
                        :descripcion="ruta.descripcion" :foto="ruta.foto" :id_cliente="props.sesion?.id"
                        :reservasCliente="false">
                    </RouteCard>
                </div>

                <div v-if="rutasNoHechas.length === 0" class="text-center py-5 mt-4 w-100">
                    <div class="p-5 rounded-4 bg-white shadow-sm d-inline-block">
                        <i class="bi bi-search text-lime display-1"></i>
                        <h4 class="mt-3 text-forest fw-bold">No hay rutas disponibles</h4>
                        <p class="text-muted">Prueba con otra fecha o localidad.</p>
                        <button class="btn btn-outline-forest rounded-pill mt-2 btn-sm px-4"
                            @click="fecha = ''; localidad = ''; getRoutes()">
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="container-fluid py-5 bg-cream-light mt-4 mb-5">
        <div class="container">
            <div class="row align-items-center g-5">
                <div class="col-lg-6">
                    <div class="video-container shadow-lg rounded-4 overflow-hidden position-relative">
                        <div class="video-overlay"></div>
                        <video autoplay muted loop playsinline class="w-100 d-block">
                            <source src="/images/158220-816359501_small.mp4" type="video/mp4">
                            Tu navegador no soporta videos.
                        </video>
                    </div>
                </div>
                <div class="col-lg-6">
                    <h2 class="display-6 fw-bold text-forest mb-3 text-uppercase">Conecta con el entorno</h2>
                    <p class="lead text-secondary mb-4">
                        No solo caminamos, descubrimos historias. Mira cómo son nuestras rutas y prepárate para una
                        aventura inolvidable.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.principal-image {
    background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/home-primary-image.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 50vh;
}

/* Buscador */
.search-overlay {
    margin-top: -40px;
    position: relative;
    z-index: 10;
}

.buscador-pill {
    border-radius: 50px;
}

.text-forest {
    color: #386641;
}

.text-lime {
    color: #A7C957;
}

.error-bubble {
    position: absolute;
    top: -45px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #BC4749;
    color: white;
    padding: 6px 20px;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: bold;
    z-index: 100;
}

.border-error {
    border: 1px solid #BC4749 !important;
}

.btn-outline-forest {
    border: 1px solid #386641;
    color: #386641;
}

.btn-outline-forest:hover {
    background-color: #386641;
    color: white;
}

.divider {
    width: 60px;
    height: 4px;
    background-color: #A7C957;
    border-radius: 2px;
}

.custom-input-group .form-control:focus {
    box-shadow: none;
}

input[type="date"] {
    cursor: pointer;
    color: #386641 !important;
}
</style>