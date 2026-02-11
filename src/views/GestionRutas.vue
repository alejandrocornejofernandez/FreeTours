<script setup>
import { onMounted, ref } from 'vue';
import router from '@/router';

import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import NavBar from '@/components/NavBar.vue';

</script>

<template>
    <div class="container-fluid">
        <div class="row justify-content-between align-content-center">
            <div class="col-6">
                <div class="card" style="width: 18rem;">
                    <img class="card-img-top" src="/images/create-routes-image.jpg" alt="Card image cap">
                    <div class="card-body d-flex justify-content-center flex-column">
                        <h5 class="card-title text-uppercase text-center fw-bold">Crear rutas</h5>
                        <p class="card-text text-lg-center">Crea tus rutas fácilmente y planifica tus recorridos en un
                            par de clics.</p>
                        <RouterLink to="/gestionRutas/crearRutas" class="btn btn-primary">Crear rutas</RouterLink>
                    </div>
                </div>
            </div>

            <div class="col-6">
                <div class="card" style="width: 18rem;">
                    <img class="card-img-top" src="/images/show-routes-image.jpg" alt="Card image cap">
                    <div class="card-body d-flex justify-content-center flex-column">
                        <h5 class="card-title text-uppercase text-center fw-bold">Ver rutas</h5>
                        <p class="card-text text-lg-center">Visualiza tus recorridos y planifica mejor tus viajes.</p>
                        <RouterLink to="/gestionRutas/verRutas" class="btn btn-primary">Ver rutas</RouterLink>
                    </div>
                </div>
            </div>

        </div>
    </div>

</template>

<style></style>
