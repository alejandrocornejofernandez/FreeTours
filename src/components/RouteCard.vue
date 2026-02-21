<script setup>
import router from '@/router';
import { ref } from 'vue';


const props = defineProps({
    id: Number,
    titulo: String,
    localidad: String,
    descripcion: String,
    foto: String,

    // recibe un prop desde verRutasCliente.vue para saber que estamos en la sección de reservas
    reservasCliente: Boolean,
    // tambien recibimos el id de la reserva, para poder eliminarla
    id_reserva: Number
})

function verDetalles() {
    router.push({ name: 'DetalleRuta', params: { id: props.id } });
}

</script>

<template>
    <div class="card shadow-sm border-0 h-100 route-card" style="width: 18rem;" role="button" @click="verDetalles">
        <div class="img-container">
            <img class="card-img-top object-fit-cover h-100" :src="`http://localhost:8000/images/${props.foto}`"
                alt="Imágen de la ruta">
        </div>

        <div class="card-body d-flex justify-content-center flex-column p-4">
            <h5 class="card-title text-uppercase text-center fw-bold text-forest mb-2">{{ props.titulo }}</h5>

            <p class="card-text text-center fw-light mb-3 text-lime fw-bold">
                <i class="bi bi-geo-alt-fill me-1"></i>{{ props.localidad }}
            </p>

            <p class="card-text text-center text-muted small description-text">
                {{ props.descripcion }}
            </p>
        </div>

        <div class="card-footer bg-white border-0 text-center pb-4">
            <span class="btn-detail-link">Ver detalles</span>

            <!-- este div solo se muestra si estamos viendo la card desde la parte de reservas del cliente -->
            <div v-if="props.reservasCliente">
                <div class="mt-3 w-100 d-flex justify-content-center">
                        <button 
                            type="button" 
                            class="btn btn-brick btn-sm rounded-pill px-4 fw-bold text-uppercase shadow-sm"
                            @click="eliminarReserva()"
                        >
                            <i class="bi bi-trash3 me-2"></i>Eliminar reserva
                        </button>
                    </div>
            </div>
        </div>


    </div>
</template>

<style scoped>
.text-forest {
    color: #386641;
}

.text-lime {
    color: #a7c957;
}

.route-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    border-radius: 1rem;
}

.route-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.img-container {
    height: 180px;
    overflow: hidden;
}

/* Evita que descripciones muy largas deformen la card */
.description-text {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.5;
}

.btn-detail-link {
    color: #BC4749;
    font-weight: bold;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 2px solid #A7C957;
    padding-bottom: 2px;
}

/* Estilo del botón eliminar (Rojo Ladrillo) */
.btn-brick {
    background-color: #BC4749;
    color: white;
    border: none;
    transition: all 0.3s ease;
}

.btn-brick:hover {
    background-color: #a33b3d;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(188, 71, 73, 0.3) !important;
}
</style>