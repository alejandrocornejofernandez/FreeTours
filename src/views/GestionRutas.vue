<script setup>
import { onMounted, ref } from 'vue';
import router from '@/router';

import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import NavBar from '@/components/NavBar.vue';

</script>

<template>
    <div class="container my-5">
        <div class="row g-4 justify-content-center">
            <div class="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
                <div class="card h-100 shadow-sm" style="width: 18rem;">
                    <img class="card-img-top" src="/images/create-routes-image.jpg" alt="Crear rutas">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-uppercase text-center fw-bold">Crear rutas</h5>
                        <p class="card-text text-center flex-grow-1">Crea tus rutas fácilmente y planifica tus
                            recorridos en un par de clics.</p>
                        <RouterLink to="/gestionRutas/crearRutas" class="btn btn-primary w-100">Crear rutas
                        </RouterLink>
                    </div>
                </div>
            </div>

            <div class="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
                <div class="card h-100 shadow-sm" style="width: 18rem;">
                    <img class="card-img-top" src="/images/create-routes-image.jpg" alt="Gestionar rutas">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-uppercase text-center fw-bold">Gestionar rutas</h5>
                        <p class="card-text text-center flex-grow-1">Gestiona las rutas como administrador.</p>
                        <RouterLink to="/gestionRutas/gestionarRutas" class="btn btn-primary w-100">Gestionar rutas
                        </RouterLink>
                    </div>
                </div>
            </div>

            <div class="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
                <div class="card h-100 shadow-sm" style="width: 18rem;">
                    <img class="card-img-top" src="/images/show-routes-image.jpg" alt="Ver rutas">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-uppercase text-center fw-bold">Ver rutas</h5>
                        <p class="card-text text-center flex-grow-1">Visualiza tus recorridos y planifica mejor tus
                            viajes.</p>
                        <RouterLink to="/gestionRutas/verRutas" class="btn btn-primary w-100">Ver rutas</RouterLink>
                    </div>
                </div>
            </div>

        </div>
    </div>

</template>

<style></style>
