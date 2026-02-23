<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
    sesion: Object
})
</script>

<template>
    <div class="py-5">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="fw-bold text-uppercase text-forest">Gestión de Rutas</h2>
                <div class="divider mx-auto"></div>
            </div>

            <div class="row g-4 justify-content-center">
                <div class="col-12 col-md-6 col-lg-4 d-flex justify-content-center" v-if="props.sesion && props.sesion.rol == 'admin'">
                    <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden admin-card" style="width: 18rem;">
                        <div class="img-wrapper">
                            <img class="card-img-top" src="/images/create-routes-image.jpg" alt="Crear rutas">
                        </div>
                        <div class="card-body d-flex flex-column p-4">
                            <h5 class="card-title text-uppercase text-center fw-bold text-forest">Crear rutas</h5>
                            <p class="card-text text-center text-muted small flex-grow-1">Crea tus rutas fácilmente y planifica tus recorridos en un par de clics.</p>
                            <RouterLink to="/gestionRutas/crearRutas" class="btn btn-forest w-100 rounded-pill fw-bold text-uppercase shadow-sm mt-3">
                                Crear ahora
                            </RouterLink>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-6 col-lg-4 d-flex justify-content-center" v-if="props.sesion && props.sesion.rol == 'admin'">
                    <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden admin-card" style="width: 18rem;">
                        <div class="img-wrapper">
                            <img class="card-img-top" src="/images/create-routes-image.jpg" alt="Gestionar rutas">
                        </div>
                        <div class="card-body d-flex flex-column p-4">
                            <h5 class="card-title text-uppercase text-center fw-bold text-forest">Gestionar rutas</h5>
                            <p class="card-text text-center text-muted small flex-grow-1">Gestiona las rutas existentes, edita información y controla el catálogo como administrador.</p>
                            <RouterLink to="/gestionRutas/gestionarRutas" class="btn btn-forest w-100 rounded-pill fw-bold text-uppercase shadow-sm mt-3">
                                Gestionar
                            </RouterLink>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
                    <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden admin-card" style="width: 18rem;">
                        <div class="img-wrapper">
                            <img class="card-img-top" src="/images/show-routes-image.jpg" alt="Ver rutas">
                        </div>
                        <div class="card-body d-flex flex-column p-4">
                            <h5 class="card-title text-uppercase text-center fw-bold text-forest">Ver rutas</h5>
                            <p class="card-text text-center text-muted small flex-grow-1">Visualiza tus recorridos y planifica mejor tus viajes en el mapa interactivo.</p>
                            <RouterLink to="/gestionRutas/verRutas" class="btn btn-forest w-100 rounded-pill fw-bold text-uppercase shadow-sm mt-3" v-if="props.sesion && props.sesion.rol == 'admin'">
                                Ver listado
                            </RouterLink>
                            <RouterLink to="/gestionRutas/verRutasCliente" class="btn btn-forest w-100 rounded-pill fw-bold text-uppercase shadow-sm mt-3" v-if="props.sesion && props.sesion.rol == 'cliente'">
                                Ver listado
                            </RouterLink>
                            <RouterLink to="/gestionRutas/verRutasGuia" class="btn btn-forest w-100 rounded-pill fw-bold text-uppercase shadow-sm mt-3" v-if="props.sesion && props.sesion.rol == 'guia'">
                                Ver listado
                            </RouterLink>
                        </div>
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

.divider {
    width: 60px;
    height: 4px;
    background-color: #A7C957;
    border-radius: 2px;
}

.admin-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border-top: 5px solid #386641 !important;
}

.admin-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(56, 102, 65, 0.15) !important;
}

.img-wrapper {
    height: 160px;
    overflow: hidden;
}

.img-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.admin-card:hover .img-wrapper img {
    transform: scale(1.1);
}

.btn-forest {
    background-color: #386641;
    color: white;
    border: none;
    padding: 10px;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.btn-forest:hover {
    background-color: #6A994E;
    color: white;
}
</style>