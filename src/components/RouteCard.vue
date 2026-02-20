<script setup>
import router from '@/router';
import { ref } from 'vue';


const props = defineProps({
    id: String,
    titulo: String,
    localidad: String,
    descripcion: String,
    foto: String,
})

function verDetalles() {
    router.push({ name: 'DetalleRuta', params: { id: props.id } });
}



</script>

<template>
    <div class="card" style="width: 18rem;" role="button" @click="verDetalles">
        <img class="card-img-top" :src="`http://localhost:8000/images/${props.foto}`" alt="Imágen de la ruta">
        <div class="card-body d-flex justify-content-center flex-column">
            <h5 class="card-title text-uppercase text-center fw-bold">{{ props.titulo }}</h5>
            <p class="card-text text-center fw-ligth"><i class="bi bi-geo-alt-fill text-primary"></i>{{
                props.localidad }}</p>
            <p class="card-text text-lg-center">{{ props.descripcion }}</p>
        </div>
    </div>
</template>

<style></style>
