<script setup>
import router from '@/router';
import { ref } from 'vue';


const props = defineProps({
    id: String,
    titulo: String,
    localidad: String,
    descripcion: String,
    foto: String,

    // recibe un prop desde verRutasCliente.vue para saber que estamos en la sección de reservas y para saber si la ruta ya está realizada o aún sigue en reserva
    reservasCliente: Boolean,
    rutaYaHecha: Boolean,

    // tambien recibimos el id de la reserva, para poder eliminarla
    id_reserva: Number,

    // para la valoración recibimos el id del cliente
    id_cliente: Number,

    // recibe un prop desde VerRutasGuia.vue para saber que estamos en la sección de asignaciones del guía.
    asignacionesGuia: Boolean
})

const emits = defineEmits(['rutaEliminada', 'valoracionCreada']);

function verDetalles() {
    router.push({ name: 'DetalleRuta', params: { id: props.id } });
}

/* función para eliminar la reserva, como se elimina un componente, voy a hacer un emit para avisar a la 
vista VerRutasCliente */
async function eliminarReserva() {
    try {
        const peticion = await fetch(`http://localhost:8000/api.php/reservas?id=${props.id_reserva}`, {
            method: 'DELETE',
        })

        const respuesta = await peticion.json();

        if (respuesta.status == "success") {
            // mandamos el emit y cerramos el modal
            emits('rutaEliminada');
            modalEliminarReserva.value = false;
        }

    } catch (error) {
        console.error(error);
    }
}

let modalEliminarReserva = ref(false);
function mostrarModalEliminarReserva() {
    modalEliminarReserva.value = true;
}

/* función para hacer las valoraciones de la ruta */
let puntuacion = ref(0);
let comentario = ref("");

async function crearValoracion() {
    const nuevaValoracion = {
        user_id: props.id_cliente, // ID del usuario que realiza la valoración
        ruta_id: props.id, // ID de la ruta valorada
        estrellas: puntuacion.value, // Puntuación de 1 a 5
        comentario: comentario.value
    };

    console.log(props.id_cliente);

    try {
        const peticion = await fetch('http://localhost:8000/api.php/valoraciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaValoracion)
        });

        const resultado = await peticion.json();

        emits('valoracionCreada');
        modalValorarRuta.value = false;


    } catch (error) {
        console.error(error)
    }

}

let modalValorarRuta = ref(false);
function mostrarModalValorarRuta() {
    modalValorarRuta.value = true;
}

// funcion para pasar lista
let modalPasarLista = ref(false);
function mostrarModalPasarLista() {
    modalPasarLista.value = true;
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

            <!-- este div solo se muestra si estamos viendo la card desde la parte de reservas del cliente.
    importante usar .stop en el click para que el boton de eliminar no me rediriga a los detalles de
    la ruta -->

            <div v-if="props.reservasCliente">
                <div class="mt-3 w-100 d-flex justify-content-center">

                    <button v-if="!props.rutaYaHecha" type="button"
                        class="btn btn-brick btn-sm rounded-pill px-4 fw-bold text-uppercase shadow-sm"
                        @click.stop="mostrarModalEliminarReserva">
                        <i class="bi bi-trash3 me-2"></i>Eliminar reserva
                    </button>

                    <button v-else type="button"
                        class="btn btn-lime btn-sm rounded-pill px-4 fw-bold text-uppercase shadow-sm"
                        @click.stop="mostrarModalValorarRuta">
                        <i class="bi bi-star-fill me-2"></i>Valorar ruta
                    </button>

                </div>
            </div>

            <div v-if="props.asignacionesGuia">
                <div class="mt-3 w-100 d-flex justify-content-center">
                    <button v-if="!props.rutaYaHecha" type="button"
                        class="btn btn-lime btn-sm rounded-pill px-4 fw-bold text-uppercase shadow-sm"
                        @click.stop="mostrarModalPasarLista">
                        <i class="bi bi-trash3 me-2"></i>Pasar lista
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- modal para eliminar la reserva -->
    <div class="modal fade" v-if="modalEliminarReserva" :class="{ show: modalEliminarReserva }" style="display: block;"
        tabindex="-1" aria-labelledby="modalEliminarReservaLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="btn-close" @click="modalEliminarReserva = false"></button>
                </div>
                <div class="modal-body p-4 text-center">
                    <p class="mb-1 text-muted small text-uppercase fw-bold">Vas a cancelar la reserva en:</p>
                    <h5 class="text-forest fw-bold mb-3 text-uppercase">{{ props.titulo }}</h5>
                    <p class="text-secondary mb-0">¿Estás seguro? Esta acción no se puede deshacer y perderás tu plaza.
                    </p>
                </div>

                <div class="modal-footer border-0 d-flex justify-content-center pb-4 gap-2">
                    <button type="button" class="btn btn-brick rounded-pill px-4 fw-bold text-uppercase shadow-sm"
                        @click="eliminarReserva">
                        Eliminar definitivamente
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal-backdrop fade show" v-if="modalEliminarReserva"></div>

    <!-- modal para valorar la ruta -->
    <div class="modal fade" v-if="modalValorarRuta" :class="{ show: modalValorarRuta }" style="display: block;"
        tabindex="-1" aria-labelledby="modalValorarRutaLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">

                <div class="modal-header">
                    <button type="button" class="btn-close" @click="modalValorarRuta = false"></button>
                </div>

                <div class="modal-body p-4 text-center">
                    <p class="mb-1 text-muted small text-uppercase fw-bold">Danos tu opinión sobre:</p>
                    <h5 class="text-forest fw-bold mb-3 text-uppercase">{{ props.titulo }}</h5>

                    <div class="mb-4 fs-2">
                        <i v-for="i in 5" :key="i" class="bi px-1 cursor-pointer"
                            :class="i <= puntuacion ? 'bi-star-fill text-lime' : 'bi-star text-muted'"
                            @click="puntuacion = i">
                        </i>
                    </div>

                    <div class="text-start">
                        <label class="form-label text-forest fw-bold small text-uppercase">Tu reseña:</label>
                        <textarea v-model="comentario" class="form-control border-2 shadow-none" rows="3"
                            placeholder="¿Qué tal fue la ruta?"></textarea>
                    </div>
                </div>

                <div class="modal-footer border-0 d-flex justify-content-center pb-4 gap-2">
                    <button type="button" class="btn btn-lime rounded-pill px-5 fw-bold text-uppercase shadow-sm"
                        @click="crearValoracion" :disabled="puntuacion === 0">
                        Enviar valoración
                    </button>
                </div>

            </div>
        </div>
    </div>

    <div class="modal-backdrop fade show" v-if="modalValorarRuta"></div>

    <!-- modal para pasar lista-->
    <div class="modal fade" v-if="modalPasarLista" :class="{ show: modalPasarLista }" style="display: block;"
        tabindex="-1" aria-labelledby="modalPasarListaLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">

                <div class="modal-header">
                    <button type="button" class="btn-close" @click="modalPasarLista = false"></button>
                </div>

                <div class="modal-body p-4 text-center">

                </div>

            </div>
        </div>
    </div>

    <div class="modal-backdrop fade show" v-if="modalPasarLista"></div>
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

.btn-lime {
    background-color: #A7C957;
    color: #386641;
    border: none;
    transition: all 0.3s ease;
}

.btn-lime:hover {
    background-color: #8da946;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(167, 201, 87, 0.3) !important;
}

.cursor-pointer {
    cursor: pointer;
}
</style>