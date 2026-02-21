<script setup>
import { onMounted, ref } from 'vue';
import router from '@/router';

import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import RouteCard from '@/components/RouteCard.vue';

onMounted(async () => {
    getRoutes()
})

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

// viene mejor iniciar fecha como '', puesto que es un campo opcional en el GET
const fecha = ref('');
const localidad = ref('');
async function getRoutesFechaLocalidad() {
    console.log(fecha.value);

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
                <h2 class="fw-bold text-uppercase text-forest">Explorar Recorridos</h2>
                <p class="text-muted">Busca y visualiza todas las rutas disponibles</p>
                <div class="divider mx-auto"></div>
            </div>

            <div class="row justify-content-center mb-5">
                <div class="col-12 col-lg-10">
                    <div class="card border-0 shadow-sm p-3 bg-white rounded-pill-md">
                        <div class="row g-3 align-items-center">
                            
                            <div class="col-12 col-md-5">
                                <VDatePicker v-model="fecha" mode="date" :masks="{ input: 'DD/MM/YYYY' }"
                                    @update:model-value="getRoutesFechaLocalidad">
                                    <template #default="{ inputValue, inputEvents }">
                                        <div class="input-group custom-input-group">
                                            <span class="input-group-text bg-transparent border-0 text-forest" v-on="inputEvents">
                                                <i class="bi bi-calendar-event-fill"></i>
                                            </span>
                                            <input class="form-control border-0 bg-transparent fw-bold" 
                                                   :value="inputValue" 
                                                   v-on="inputEvents" 
                                                   readonly 
                                                   placeholder="Filtrar por fecha" />
                                        </div>
                                    </template>
                                </VDatePicker>
                            </div>

                            <div class="col-md-auto d-none d-md-block">
                                <div class="vr h-100 mx-2 text-muted"></div>
                            </div>

                            <div class="col-12 col-md-5">
                                <div class="input-group custom-input-group">
                                    <span class="input-group-text bg-transparent border-0 text-forest">
                                        <i class="bi bi-geo-alt-fill"></i>
                                    </span>
                                    <input v-model="localidad" 
                                           class="form-control border-0 bg-transparent fw-bold" 
                                           type="text"
                                           placeholder="Buscar por localidad" 
                                           @change="getRoutesFechaLocalidad()" />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-4 justify-content-center">
                <div v-for="ruta in rutas" :key="ruta.id" class="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
                    <RouteCard 
                        :id="ruta.id" 
                        :titulo="ruta.titulo" 
                        :localidad="ruta.localidad"
                        :descripcion="ruta.descripcion" 
                        :foto="ruta.foto">
                    </RouteCard>
                </div>

                <div v-if="rutas.length === 0" class="text-center py-5">
                    <div class="empty-state p-5 rounded-4 bg-white shadow-sm d-inline-block">
                        <i class="bi bi-search text-lime display-1"></i>
                        <h4 class="mt-3 text-forest fw-bold">No hay resultados</h4>
                        <p class="text-muted">Prueba con otros filtros o una localidad distinta.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.view-routes-page {
    background-color: #F2E8CF; /* Fondo Crema */
    min-height: 100vh;
}

.text-forest { color: #386641; }

.divider {
    width: 60px;
    height: 4px;
    background-color: #A7C957; /* Verde Lima */
    border-radius: 2px;
}

/* Contenedor de filtros */
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

.custom-input-group .input-group-text {
    font-size: 1.2rem;
}

/* Estilo para los resultados vacíos */
.empty-state {
    border-top: 5px solid #A7C957;
}

.text-lime {
    color: #A7C957;
}
</style>