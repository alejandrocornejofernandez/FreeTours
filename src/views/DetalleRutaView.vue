<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const route = useRoute();
const id = route.params.id;
const ruta = ref('');
let map; // Declaramos map aquí para que sea accesible

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
        console.log("Error al obtener la ruta")
    }
}

// dibujamos el mapa con las coordenadas de la ruta
onMounted(async () => {
    await getRoute();

    if (ruta.value) {
        // Inicializamos el mapa centrado en las coordenadas de la ruta
        map = L.map('map').setView([ruta.value.latitud, ruta.value.longitud], 14);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Añadimos el marcador
        L.marker([ruta.value.latitud, ruta.value.longitud]).addTo(map)
            .bindPopup(ruta.value.titulo)
            .openPopup();
    }
});
</script>

<template>
    <div>
        <div class="hero-ruta shadow-sm py-5 mb-5">
            <div class="container text-center">
                <h1 class="display-4 fw-bold text-uppercase mb-2 text-white">{{ ruta.titulo }}</h1>
                <div class="d-flex justify-content-center align-items-center">
                    <span class="badge bg-lime text-forest px-3 py-2 rounded-pill fs-6">
                        <i class="bi bi-geo-alt-fill me-2"></i>{{ ruta.localidad }}
                    </span>
                </div>
            </div>
        </div>

        <div class="container pb-5">
            <div class="row g-4">
                <div class="col-lg-6">
                    <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
                        <div class="card-header bg-forest text-white py-3">
                            <h5 class="m-0 fw-bold text-center text-uppercase"><i
                                    class="bi bi-map-fill me-2"></i>Ubicación
                            </h5>
                        </div>
                        <div class="card-body p-0">
                            <div id="map" style="height: 450px;"></div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="card border-0 shadow-lg rounded-4 h-100 p-4 info-card">
                        <h4 class="fw-bold text-forest text-center border-bottom pb-3 mb-4 text-uppercase">Información
                        </h4>

                        <div class="info-item mb-4">
                            <label class="text-muted small text-uppercase fw-bold d-block mb-1">Descripción</label>
                            <p class="text-secondary lead">
                                {{ ruta.descripcion }}
                            </p>
                        </div>

                        <div class="row g-3 mb-4">
                            <div class="col-6">
                                <div class="p-3 rounded-3 bg-cream-light border-start border-forest border-4">
                                    <label class="text-muted small d-block">Fecha</label>
                                    <span class="fw-bold text-forest"><i class="bi bi-calendar3 me-2"></i>{{ ruta.fecha
                                        }}</span>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="p-3 rounded-3 bg-cream-light border-start border-lime border-4">
                                    <label class="text-muted small d-block">Hora</label>
                                    <span class="fw-bold text-forest"><i class="bi bi-clock me-2"></i>{{ ruta.hora
                                    }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="mt-auto d-flex gap-2">
                            <RouterLink to="/" class="btn btn-outline-forest rounded-pill flex-grow-1 fw-bold">
                                <i class="bi bi-arrow-left me-2"></i>Volver
                            </RouterLink>
                            <button class="btn btn-brick rounded-pill px-4">
                                <i class="bi bi-share-fill text-white"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.hero-ruta {
    background-color: #386641;
    background-image: linear-gradient(rgba(56, 102, 65, 0.8), rgba(56, 102, 65, 0.9)), url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1500');
    background-size: cover;
    background-position: center;
}

.text-white {
    color: white;
}

.text-lime {
    color: #A7C957;
}

.text-forest {
    color: #386641;
}

.bg-forest {
    background-color: #386641;
}

.bg-lime {
    background-color: #A7C957;
}

.bg-cream-light {
    background-color: rgba(242, 232, 207, 0.5);
}

.info-card {
    background-color: #ffffff;
}

.btn-outline-forest {
    border: 2px solid #386641;
    color: #386641;
}

.btn-outline-forest:hover {
    background-color: #386641;
    color: #F2E8CF;
}

.btn-brick {
    background-color: #BC4749;
    border: none;
    transition: transform 0.2s;
}

.btn-brick:hover {
    background-color: #a33b3d;
    transform: scale(1.05);
}
</style>