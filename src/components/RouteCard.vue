<script setup>
import { ref } from 'vue';

const props = defineProps({
    titulo: String,
    localidad: String,
    descripcion: String
})

</script>

<template>
    <div class="col-4">
        <div class="card" style="width: 18rem;">
            <img class="card-img-top" :src="props.foto" alt="Card image cap">
            <div class="card-body d-flex justify-content-center flex-column">
                <h5 class="card-title text-uppercase text-center fw-bold">{{ props.titulo }}</h5>
                <p class="card-text text-center fw-ligth"><i class="bi bi-geo-alt-fill text-primary"></i>{{
                    props.localidad }}</p>
                <p class="card-text text-lg-center">{{ props.descripcion }}</p>
            </div>
        </div>
    </div>
</template>

<style></style>
