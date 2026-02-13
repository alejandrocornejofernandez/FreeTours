<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = route.params.id;
const ruta = ref('');

async function getRoute() {
    try {
        const peticion = await fetch(`http://localhost:8000/api.php/rutas?id=${id}`, {
            method: 'GET',
        });

        const respuesta = await peticion.json();
        ruta.value = respuesta;


    } catch {

    }
}
onMounted(async () => {
    getRoute()
})

</script>

<template>
    <div class="container-fluid mt-5">
        <div class="row">
            <div class="col">
                <h4 class="text-center text-uppercase">{{ ruta.titulo }}</h4>
            </div>
        </div>

        <div class="row">
            <div class="col">
                hola
            </div>
            <div class="col"></div>
        </div>
    </div>

</template>

<style></style>
