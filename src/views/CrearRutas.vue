<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// router para mostrar otra vista tras la creación
let router = useRouter();

// Parte del script que permite ejecutar el mapa
const address = ref('');
let map, marker;

onMounted(() => {
    setTimeout(() => {
        map = L.map('map').setView([40.4168, -3.7038], 13); // Madrid por defecto
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
    }, 3000)
});

const searchLocation = async () => {
    if (!address.value) return;
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address.
            value)}`
    );
    const data = await response.json();
    if (data.length > 0) {
        let lat = data[0].lat;
        let lon = data[0].lon;

        // asignamos el valor a las variables latitud, longitud
        latitud.value = data[0].lat;
        longitud.value = data[0].lon;

        if (marker) marker.remove();
        marker = L.marker([lat, lon]).addTo(map)
            .bindPopup(address.value)
            .openPopup();
        map.setView([lat, lon], 13);
    } else {
        alert('Dirección no encontrada');
    }
};

// La idea es realizar un formulario 'multistep' que hace que tenga más usabilidad al reducir la carga visual de los campos.
const currentStep = ref(1);

// variable computada que hace que el botón siguiente funcione o no, dependiendo de si los campos del formulario son correctos
const pasoValido = computed(() => {
    // if para el paso 1, comprueba que los campos de texto no estén vacios.
    if (currentStep.value === 1) {
        return titulo.value.trim() !== '' &&
            localidad.value.trim() !== '' &&
            descripcion.value.trim() !== '';
    }

    // if para el paso 2, comprueba que se haya seleccionado una fecha y una hora
    if (currentStep.value === 2) {
        return fecha.value !== '' && fecha.value !== null && hora.value !== null && hora.value !== '';
    }

    // if para el paso 3, comprueba que haya unas coordenadas seleccionadas
    if (currentStep.value === 3) {
        return latitud.value !== '' && longitud.value !== '';
    }

    // el paso 4 no tiene validación puesto que asignar un guia no es obligatorio en la creación de la ruta.
});

function avanzar() {
    currentStep.value += 1

    // si el paso es el número 4, llamamos a la función que nos dice que guías están disponibles
    if (currentStep.value == 4) {
        obtenerGuias();
    }
}

function retroceder() {
    currentStep.value -= 1
}


// Código para POST creación de ruta
const titulo = ref('');
const localidad = ref('');
const descripcion = ref('');
const foto = ref('');
const fecha = ref('');
const hora = ref('');
const latitud = ref('');
const longitud = ref('');
const guia_id = ref('');

function clickImagen(e) {
    foto.value = e.target.files[0];
    console.log(foto.value);
}

async function crearRuta() {

    // para enviar la imagen tengo que usar FormData en lugar de un objeto JSON normal
    let formData = new FormData();

    formData.append('titulo', titulo.value);
    formData.append('localidad', localidad.value);
    formData.append('descripcion', descripcion.value);
    formData.append('fecha', fecha.value);
    formData.append('hora', hora.value);
    formData.append('latitud', latitud.value);
    formData.append('longitud', longitud.value);
    formData.append('guia_id', guia_id.value);

    // para añadir la foto
    formData.append('foto', foto.value);

    try {
        const peticion = await fetch('http://localhost:8000/api.php/rutas', {
            method: 'POST',
            // enviamos el formData
            body: formData
        })

        const respuesta = await peticion.json();

        if (respuesta.status == 'success') {
            router.push("/gestionRutas");
        }

    } catch (error) {
        console.error(error)
    }
}

// Código para obtener guías disponibles
const guiasDisponibles = ref([]);

async function obtenerGuias() {
    try {
        const peticion = await fetch(`http://localhost:8000/api.php/asignaciones?fecha=${fecha.value}`, {
            method: 'GET',
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
        })

        const respuesta = await peticion.json();
        guiasDisponibles.value = respuesta;
        console.log(guiasDisponibles.value);
        console.log(fecha.value);

    } catch {
        console.log("Fecha no válida")
    }
}

// Seleccionar guía
const guiaSeleccionadoID = ref(null)

function seleccionarGuia(id) {
    // si el guia esta seleccionado al hacer doble click se deselecciona
    if (guiaSeleccionadoID.value === id) {
        guiaSeleccionadoID.value = null;
        guia_id.value = '';

        // si no hay ninguno seleccionado, se asignan el id
    } else {
        guiaSeleccionadoID.value = id;
        guia_id.value = id;
    }
}

</script>
<template>
    <div class="container mt-5 mb-5">
        <div class="card shadow-lg border-0 rounded-4 overflow-hidden">

            <div class="form-header p-4 text-center">
                <h2 class="fw-bold text-uppercase m-0">Crear nueva ruta</h2>
                <p class="small mb-0">Rellena los pasos del formulario para crear una ruta</p>
            </div>

            <!-- Contenedor que muestra el paso del formulario por el que vamos. -->
            <div class="stepper-container px-4 mt-4">
                <div class="d-flex justify-content-between position-relative">
                    <!-- Se crean 4 divs, uno para cada paso, si la variable 'currentStep' coincide con la variable step del v-for, la clase es active
                    (nos encontramos en ese paso), si 'currentStep' es mayor que step, en ese caso la clase es completed (paso ya completado). -->
                    <div v-for="step in 4" :key="step" class="step-circle"
                        :class="{ 'active': currentStep >= step, 'completed': currentStep > step }">
                        {{ step }}
                    </div>
                    <div class="step-line"></div>
                </div>
            </div>

            <div class="card-body p-4 p-lg-5">
                <div class="row">

                    <!-- Paso 1: Información general de la ruta (Titulo, localidad, descripción e imagen) -->
                    <form @submit.prevent="crearRuta" enctype="multipart/form-data">
                        <div class="col-12" v-if="currentStep == 1">
                            <h5 class="section-title mb-4 text-uppercase"><i
                                    class="bi bi-info-circle-fill me-2"></i>Información general</h5>
                            <div class="mb-4 input-group custom-group">
                                <span class="input-group-text"><i class="bi bi-pencil-square"></i></span>
                                <input class="form-control" type="text" placeholder="Título de la ruta"
                                    v-model="titulo" />
                            </div>

                            <div class="mb-4 input-group custom-group">
                                <span class="input-group-text"><i class="bi bi-geo-alt-fill"></i></span>
                                <input class="form-control" type="text" placeholder="Localidad" v-model="localidad" />
                            </div>

                            <div class="mb-4 input-group custom-group">
                                <span class="input-group-text"><i class="bi bi-card-text"></i></span>
                                <textarea class="form-control" rows="3" placeholder="Descripción de la ruta"
                                    v-model="descripcion"></textarea>
                            </div>

                            <!-- este div va a contener la parte del 'drag and drop' para subir la imagen de la ruta -->
                            <div>
                                <input type="file" @change="clickImagen" name="foto"
                                    accept="image/x-png, image/jpeg, image/jpg">
                            </div>
                        </div>

                        <!-- Paso 2: Fecha y hora -->
                        <div class="col-12" v-if="currentStep == 2">
                            <h5 class="section-title mb-4 text-uppercase"><i
                                    class="bi bi-calendar-event-fill me-2"></i>¿Cuándo será?</h5>
                            <div class="date-picker-wrapper mx-auto">
                                <input type="date" class="form-control form-control-lg custom-date-input"
                                    v-model="fecha">
                            </div>
                            <p class="mt-3 text-muted text-center">Selecciona la fecha prevista para el inicio de la
                                ruta.
                            </p>

                            <div class="date-picker-wrapper mx-auto">
                                <input type="time" class="form-control form-control-lg custom-date-input"
                                    v-model="hora">
                            </div>
                            <p class="mt-3 text-muted text-center">Selecciona la hora prevista para el inicio de la
                                ruta.
                            </p>
                        </div>

                        <!-- Paso 3: Ubicación -->
                        <div class="col-12" v-show="currentStep == 3">
                            <h5 class="section-title mb-4 text-uppercase"><i class="bi bi-map-fill me-2"></i>Ubicación
                            </h5>
                            <div class="input-group custom-group mb-3">
                                <input v-model="address" @keyup.enter="searchLocation"
                                    placeholder="Introduce una dirección" class="form-control" />
                                <button type="button" class="btn btn-lime-accent" @click="searchLocation"><i
                                        class="bi bi-search"></i></button>
                            </div>

                            <div id="map" class="rounded-3 shadow-sm mb-3 border"></div>

                            <div class="row g-2">
                                <div class="col-6">
                                    <div class="small-label">Latitud</div>
                                    <input class="form-control form-control-sm bg-light" v-model="latitud" disabled />
                                </div>
                                <div class="col-6">
                                    <div class="small-label">Longitud</div>
                                    <input class="form-control form-control-sm bg-light" v-model="longitud" disabled />
                                </div>
                            </div>
                        </div>

                        <!-- Paso 4: Asignar guía -->
                        <div class="col-12" v-if="currentStep == 4">
                            <h5 class="section-title mb-4 text-uppercase"><i
                                    class="bi bi-person-badge-fill me-2"></i>Asignar guía</h5>
                            <p class="small mb-0">Este paso es opcional. Puedes dejarlo vacío.</p>
                            <div class="table-responsive rounded-3 border">
                                <table class="table table-hover align-middle mb-0 custom-table">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Email</th>
                                            <th class="text-center">Selección</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="guia in guiasDisponibles" :key="guia.id"
                                            @click="seleccionarGuia(guia.id)"
                                            :class="{ 'table-selected': guiaSeleccionadoID == guia.id }">
                                            <td class="fw-bold text-forest">{{ guia.nombre }}</td>
                                            <td class="text-muted">{{ guia.email }}</td>
                                            <td class="text-center">
                                                <div class="custom-radio"
                                                    :class="{ 'checked': guiaSeleccionadoID == guia.id }"></div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>



                        <div class="col-12 d-flex justify-content-between mt-5">
                            <!-- Botón atrás-->
                            <button v-if="currentStep > 1" type="button"
                                class="btn btn-outline-forest rounded-pill px-4 fw-bold text-uppercase"
                                @click="retroceder">
                                <i class="bi bi-arrow-left me-2"></i>Atrás
                            </button>


                            <!-- Botón siguiente, en este botón estoy usando :disabled con la variable computed para habilitar el botón solo cuando
                            los campos del formulario esten rellenos. -->
                            <button v-if="currentStep < 4" type="button"
                                class="btn btn-forest rounded-pill px-5 fw-bold text-uppercase" :disabled="!pasoValido"
                                @click="avanzar">
                                Siguiente<i class="bi bi-arrow-right ms-2"></i>
                            </button>

                            <!-- Botón para crear la ruta -->
                            <button type="submit" v-if="currentStep == 4"
                                class="btn btn-brick rounded-pill px-5 fw-bold shadow text-uppercase">
                                Crear ruta
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.form-header {
    background-color: #386641;
    color: white;
}

.section-title {
    color: #386641;
    font-weight: 700;
    border-bottom: 2px solid #A7C957;
    display: inline-block;
    padding-bottom: 5px;
}

/* contenedor para los pasos del formulario */
.stepper-container {
    max-width: 400px;
    margin: 0 auto;
}

/* div del circulo del paso */
.step-circle {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #e9ecef;
    color: #adb5bd;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    z-index: 2;
    transition: all 0.3s ease;
}

.step-circle.active {
    background-color: #A7C957;
    color: #386641;
    box-shadow: 0 0 0 4px rgba(167, 201, 87, 0.2);
}

.step-circle.completed {
    background-color: #386641;
    color: white;
}

.step-line {
    position: absolute;
    top: 17px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #e9ecef;
    z-index: 1;
}

/* Inputs Personalizados */
.custom-group .input-group-text {
    background-color: #F2E8CF;
    color: #386641;
    border: 1px solid #ced4da;
    border-right: none;
}

.custom-group .form-control {
    border-left: none;
    padding: 12px;
}

.form-control:focus {
    box-shadow: none;
    border-color: #6A994E;
}

.custom-date-input {
    border: 2px solid #A7C957;
    color: #386641;
    font-weight: bold;
}

/* Mapa */
#map {
    height: 350px;
    width: 100%;
    z-index: 0;
}

.small-label {
    font-size: 0.75rem;
    color: #6A994E;
    font-weight: bold;
    text-transform: uppercase;
}

/* Tabla de Guías */
.custom-table thead {
    background-color: #F2E8CF;
    color: #386641;
}

.table-selected {
    background-color: rgba(167, 201, 87, 0.15) !important;
}

.text-forest {
    color: #386641;
}

.custom-radio {
    width: 20px;
    height: 20px;
    border: 2px solid #6A994E;
    border-radius: 50%;
    display: inline-block;
    position: relative;
}

.custom-radio.checked::after {
    content: '';
    width: 10px;
    height: 10px;
    background-color: #386641;
    border-radius: 50%;
    position: absolute;
    top: 3px;
    left: 3px;
}

/* Botones */
.btn-forest {
    background-color: #386641;
    color: white;
    border: none;
}

.btn-forest:hover:not(:disabled) {
    background-color: #6A994E;
    color: white;
}

.btn-outline-forest {
    border: 2px solid #386641;
    color: #386641;
}

.btn-lime-accent {
    background-color: #A7C957;
    color: #386641;
    border: 1px solid #ced4da;
}

.btn-brick {
    background-color: #BC4749;
    color: white;
    border: none;
}

.btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}
</style>
