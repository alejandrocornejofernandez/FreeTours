<script setup>
import { onMounted, ref } from 'vue';
import router from '@/router';
import RouteCard from '@/components/RouteCard.vue';
import { useRouter } from 'vue-router';

// router para mostrar otra vista tras la creación
let routerPush = useRouter();

// para que no pueda entrar nadie que no sea usuario
const props = defineProps({
    sesion: Object
})

if (props.sesion.rol !== "admin") routerPush.push("/");

onMounted(async () => {
    getRoutes()
})

// Fecha actual para el atributo 'min' y validación
const fechaActual = new Date().toISOString().split('T')[0];
const errorFecha = ref("");

const rutas = ref([]);
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

const fecha = ref('');
const localidad = ref('');

async function getRoutesFechaLocalidad() {
    // condicion para comprobar que la fecha que se está introduciendo en el input es mayor que la fecha actual
    if (fecha.value && fecha.value < fechaActual) {
        errorFecha.value = "No puedes seleccionar fechas pasadas";
        fecha.value = '';
        // setTimeout para eliminar el mensaje de forma automatica
        setTimeout(() => { errorFecha.value = ""; }, 3000);
        return;
    }

    errorFecha.value = "";

    if ((fecha.value == null || fecha.value == "") && (localidad.value == null || localidad.value == "")) {
        await getRoutes();
    } else {
        try {
            const peticion = await fetch(`http://localhost:8000/api.php/rutas?fecha=${fecha.value}&localidad=${localidad.value}`, {
                method: 'GET',
            });
            const respuesta = await peticion.json();
            rutas.value = respuesta;
        } catch {
            console.log("Error en el filtrado");
        }
    }
}
</script>

<template>
    <div class="view-routes-page py-5">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="fw-bold text-uppercase text-forest">Explorar recorridos</h2>
                <p class="text-muted">Busca y visualiza todas las rutas disponibles</p>
                <div class="divider mx-auto"></div>
            </div>

            <div class="row justify-content-center mb-5">
                <div class="col-12 col-lg-10 position-relative">

                    <div v-if="errorFecha" class="error-bubble shadow-sm">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorFecha }}
                    </div>

                    <div class="card border-0 shadow-sm p-3 bg-white rounded-pill-md"
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

            <div class="row g-4 justify-content-center">
                <div v-for="ruta in rutas" :key="ruta.id"
                    class="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
                    <RouteCard :id="ruta.id" :titulo="ruta.titulo" :localidad="ruta.localidad"
                        :descripcion="ruta.descripcion" :foto="ruta.foto">
                    </RouteCard>
                </div>

                <div v-if="rutas.length === 0" class="text-center py-5">
                    <div class="empty-state p-5 rounded-4 bg-white shadow-sm d-inline-block">
                        <i class="bi bi-search text-lime display-1"></i>
                        <h4 class="mt-3 text-forest fw-bold">No hay resultados</h4>
                        <p class="text-muted">Prueba con otros filtros o una localidad distinta.</p>
                        <button class="btn btn-outline-forest rounded-pill mt-3 btn-sm px-4"
                            @click="fecha = ''; localidad = ''; getRoutes()">
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.text-forest {
    color: #386641;
}

.text-lime {
    color: #A7C957;
}

.divider {
    width: 60px;
    height: 4px;
    background-color: #A7C957;
    border-radius: 2px;
}

.rounded-pill-md {
    border-radius: 50px;
}

@media (max-width: 768px) {
    .rounded-pill-md {
        border-radius: 20px;
    }
}

.custom-input-group .form-control:focus {
    box-shadow: none;
}

/* Burbuja de error */
.error-bubble {
    position: absolute;
    top: -45px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #BC4749;
    color: white;
    padding: 6px 18px;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: bold;
    z-index: 100;
    white-space: nowrap;
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

/* Estilo para que el input date no desentone */
input[type="date"] {
    cursor: pointer;
    color: #386641 !important;
}

.empty-state {
    border-top: 5px solid #A7C957;
}
</style>