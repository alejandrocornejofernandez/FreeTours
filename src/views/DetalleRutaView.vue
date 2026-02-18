<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const route = useRoute();
const id = route.params.id;
const ruta = ref('');

// función para obtener la ruta mediante el id de la misma
async function getRoute() {
    try {
        const peticion = await fetch(`http://localhost:8000/api.php/rutas?id=${id}`, {
            method: 'GET',
        });

        const respuesta = await peticion.json();
        ruta.value = respuesta;


        console.log(ruta.value.longitud)
    } catch {

    }
}

onMounted(async () => {
    await getRoute();

    let marker;
    map = L.map('map').setView([ruta.value.latitud, ruta.value.longitud], 14);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    marker.value = L.marker([ruta.value.latitud, ruta.value.longitud]).addTo(map);
});




console.log(ruta.value.longitud)



</script>

<template>
    <div class="container-fluid mt-5">
        <div class="row">
            <div class="col">
                <div class="text-center text-uppercase h2">{{ ruta.titulo }}</div>
                <div class="text-center h6">{{ ruta.localidad }}</div>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <div id="map" style="height: 400px;" class="m-5"></div>
            </div>
            <div class="col"></div>
        </div>
    </div>

</template>

<style></style>
