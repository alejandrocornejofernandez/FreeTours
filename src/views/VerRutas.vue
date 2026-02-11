<script setup>
import { onMounted, ref } from 'vue';
import router from '@/router';

import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import NavBar from '@/components/NavBar.vue';
import RouteCard from '@/components/RouteCard.vue';

onMounted(async () => {
    getRoutes()
})

const rutas = ref('');
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
</script>

<template>
    <input type="date">
    <div class="input-group">
        <span class="input-group-text icon-bg border-end">
            <i class="bi bi-geo-alt-fill text-primary"></i>
        </span>
        <input class="form-control border-start-0 rounded-pill fw-bold" type="text" placeholder="¿Dónde vas?" />
    </div>

    <div class="container-fluid">
        <div class="row">
            <div v-for="ruta in rutas">
                <RouteCard :titulo="ruta.titulo" :localidad="ruta.localidad" :descripcion="ruta.descripcion">
                </RouteCard>
            </div>
        </div>
    </div>
</template>

<style></style>
