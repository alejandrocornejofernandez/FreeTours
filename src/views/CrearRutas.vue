<script setup>

import { computed, onMounted, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

/*const isDragging = ref(false); // Estado para saber si hay un archivo encima
const uploadedFiles = ref([]); // Lista donde guardaremos los archivos

// 1. Cuando sueltan los archivos en la zona
const handleDrop = (event) => {
    isDragging.value = false;
    const files = event.dataTransfer.files; // Captura los archivos del evento "drop"
    processFiles(files);
};

// 2. Cuando seleccionan archivos haciendo clic
const handleFileSelect = (event) => {
    const files = event.target.files; // Captura los archivos del input
    processFiles(files);
};

// 3. Función común para guardar los archivos en nuestro array
const processFiles = (fileList) => {
    // Convertimos el objeto FileList a un Array real de JS
    const newFiles = Array.from(fileList);
    uploadedFiles.value.push(...newFiles);
};*/

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

    // if para el paso 2, comprueba que se haya seleccionado una fecha
    if (currentStep.value === 2) {
        return fecha.value !== '' && fecha.value !== null;
    }

    // if para el paso 3, comprueba que haya unas coordenadas seleccionadas
    if (currentStep.value === 3) {
        // Valida que existan coordenadas
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

async function crearRuta() {
    const rutaData = {
        titulo: titulo.value,
        localidad: localidad.value,
        descripcion: descripcion.value,
        foto: foto.value,
        fecha: fecha.value,
        hora: hora.value,
        latitud: latitud.value,
        longitud: longitud.value,
        guia_id: guia_id.value
    }

    try {
        const peticion = await fetch('http://localhost:8000/api.php/rutas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rutaData)
        })

        const respuesta = await peticion.json();

    } catch {
        console.log("Error catch")
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
    <div class="container mt-5">
        <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
            <div class="row">
                <div class="text-center mt-4 mb-4">
                    <h2 class="fw-bold text-primary text-uppercase">Crear ruta</h2>
                </div>

                <!-- Paso 1: Información sobre la ruta -->
                <div class="col" v-if="currentStep == 1">
                    <div class="m-4 input-group">
                        <span class="input-group-text bg-light border-end-0">
                            <i class="bi bi-person-fill text-primary"></i>
                        </span>
                        <input class="form-control border-start-0 border-end-0" type="text" placeholder="Titulo"
                            v-model="titulo" />
                    </div>

                    <div class="m-4 input-group">
                        <span class="input-group-text bg-light border-end-0">
                            <i class="bi bi-geo-fill"></i>
                        </span>
                        <input class="form-control border-start-0 border-end-0" type="text" placeholder="Localidad"
                            v-model="localidad" />

                    </div>

                    <div class="m-4 input-group">
                        <span class="input-group-text bg-light border-end-0">
                            <i class="bi bi-blockquote-left"></i>
                        </span>
                        <input class="form-control border-start-0 border-end-0" type="text" placeholder="Descripción"
                            v-model="descripcion" />
                    </div>

                </div>

                <!-- Paso 2: Fecha y hora de la ruta -->
                <div class="col" v-if="currentStep == 2">
                    <input type="date" v-model="fecha">
                </div>

                <!-- Paso 3: Localización de la ruta -->
                <div class="col" v-show="currentStep == 3">

                    <div class="m-4 input-group">
                        <span class="input-group-text bg-light border-end-0">
                            <i class="bi bi-person-fill text-primary"></i>
                        </span>

                        <input v-model="address" @keyup.enter="searchLocation" placeholder="Buscar dirección"
                            class="form-control border-start-0 border-end-0" />
                    </div>

                    <div class="m-4 input-group">
                        <span class="input-group-text bg-light border-end-0">
                            <i class="bi bi-person-fill text-primary"></i>
                        </span>
                        <input class="form-control border-start-0 border-end-0" type="text" placeholder="Latitud"
                            v-model="latitud" disabled />
                    </div>

                    <div class="m-4 input-group">
                        <span class="input-group-text bg-light border-end-0">
                            <i class="bi bi-person-fill text-primary"></i>
                        </span>
                        <input class="form-control border-start-0 border-end-0" type="text" placeholder="Longitud"
                            v-model="longitud" disabled />
                    </div>

                    <div id="map" style="height: 400px;" class="m-5"></div>

                </div>

                <!-- Paso 4: Asignar guías -->
                <div class="col" v-if="currentStep == 4">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="bg-light">
                                <tr>
                                    <th class="ps-4 text-uppercase text-muted fw-bold" style="font-size: 0.85rem;">ID
                                    </th>
                                    <th class="text-uppercase text-muted fw-bold" style="font-size: 0.85rem;">Nombre
                                    </th>
                                    <th class="text-uppercase text-muted fw-bold" style="font-size: 0.85rem;">Email</th>
                                    <th class="text-uppercase text-muted fw-bold" style="font-size: 0.85rem;">
                                        Seleccionar guía</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="guia in guiasDisponibles" :key="guia.id" @dblclick="seleccionarGuia(guia.id)"
                                    :class="{ 'selected': guiaSeleccionadoID == guia.id }">
                                    <td class="ps-4 text-secondary fw-medium">{{ guia.id }}</td>
                                    <td>
                                        <div class="fw-medium">{{ guia.nombre }}</div>
                                    </td>
                                    <td class="text-muted">{{ guia.email }}</td>
                                    <td><input type="radio" class="form-check-input" :value="guia.id"
                                            v-model="guiaSeleccionadoID" @change="guia_id = guia.id"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <button v-if="currentStep > 1" class="btn btn-primary btn-lg rounded-pill fw-bold"
                    @click="retroceder">Atrás</button>

                <button v-if="currentStep < 4" class="btn btn-primary btn-lg rounded-pill fw-bold"
                    :class="{ 'opacity-50': !pasoValido }" :disabled="!pasoValido" @click="avanzar">Siguiente</button>

                <button v-if="currentStep == 4" class="btn btn-primary btn-lg rounded-pill fw-bold"
                    @click="crearRuta">Crear
                    ruta</button>
            </div>
        </div>


    </div>






</template>

<style></style>
