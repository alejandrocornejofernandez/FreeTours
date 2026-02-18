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

    }
}

// viene mejor iniciar localidad como '', puesto que es un campo opcional en el GET
const fecha = ref(null);
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

        }
    }
}
</script>

<template>

    <!-- Fragemento de codigo de VCalendar que hace que se muestre un input de tipo date mucho más estilizado -->
    <VDatePicker v-model="fecha" mode="date" :masks="{ input: 'DD/MM/YYYY' }"
        @update:model-value="getRoutesFechaLocalidad">
        <template #default="{ inputValue, inputEvents }">
            <div class="input-group">
                <span class="input-group-text" v-on="inputEvents">
                    <i class="bi bi-calendar-event"></i>
                </span>
                <input class="form-control" :value="inputValue" v-on="inputEvents" readonly />
            </div>
        </template>
    </VDatePicker>

    <div class="input-group">
        <span class="input-group-text icon-bg border-end">
            <i class="bi bi-geo-alt-fill text-primary"></i>
        </span>
        <input v-model="localidad" class="form-control border-start-0 rounded-pill fw-bold" type="text"
            placeholder="¿Dónde vas?" @change="getRoutesFechaLocalidad()" />
    </div>

    <div class="container-fluid">
        <div class="row">
            <div v-for="ruta in rutas">
                <RouteCard :id="ruta.id" :titulo="ruta.titulo" :localidad="ruta.localidad"
                    :descripcion="ruta.descripcion">
                </RouteCard>
            </div>
        </div>
    </div>
</template>

<style></style>
