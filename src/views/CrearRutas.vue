<script setup>
import { onMounted, ref } from 'vue';
import router from '@/router';

import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import NavBar from '@/components/NavBar.vue';

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

function avanzar() {
    currentStep.value += 1;
}

function retroceder() {
    currentStep.value -= 1
}

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
    data = {
        titulo,
        localidad,
        descripcion,
        foto,
        fecha,
        hora,
        latitud,
        longitud,
        guia_id
    }

    try {
        const peticion = await fetch('http://localhost/api.php/rutas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rutaData)
        })

        respuesta = await peticion.json();

    } catch {

    }
}

</script>

<template>
    <div class="container">
        <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
            <div class="row">
                <div class="text-center mt-4 mb-4">
                    <h2 class="fw-bold text-primary text-uppercase">Crear ruta</h2>
                </div>

                <!-- Paso 1: Información sobre la ruta -->
                <div class="col" v-if="currentStep == 1">
                    <div class="m-4 input-group m">
                        <span class="input-group-text bg-light border-end-0">
                            <i class="bi bi-person-fill text-primary"></i>
                        </span>
                        <input class="form-control border-start-0 border-end-0" type="text" placeholder="Titulo"
                            v-model="titulo" />
                    </div>

                    <div class="mb-3 input-group">
                        <span class="input-group-text bg-light border-end-0">
                            <i class="bi bi-person-fill text-primary"></i>
                        </span>
                        <input class="form-control border-start-0 border-end-0" type="text" placeholder="Localidad"
                            v-model="localidad" />

                    </div>

                    <div class="mb-3 input-group">
                        <span class="input-group-text bg-light border-end-0">
                            <i class="bi bi-person-fill text-primary"></i>
                        </span>
                        <input class="form-control border-start-0 border-end-0" type="text" placeholder="Descripción"
                            v-model="descripcion" />
                    </div>

                </div>

                <!-- Paso 2: Fecha y hora de la ruta -->
                <div class="col" v-if="currentStep == 2">
                    <VDatePicker v-model="fecha" mode="date" :masks="{ input: 'DD/MM/YYYY' }">
                        <template #default="{ inputValue, inputEvents }">
                            <div class="input-group">
                                <span class="input-group-text" v-on="inputEvents">
                                    <i class="bi bi-calendar-event"></i>
                                </span>
                                <input class="form-control" :value="inputValue" v-on="inputEvents" readonly />
                            </div>
                        </template>
                    </VDatePicker>
                </div>

                <!-- Paso 3: Localización de la ruta -->
                <div class="col" v-if="currentStep == 3">
                    Asignar localización
                </div>

                <!-- Paso 4: Asignar guías -->
                <div class="col" v-if="currentStep == 4">
                    Asignar guias
                </div>

                <button v-if="currentStep > 1" class="btn btn-primary btn-lg rounded-pill fw-bold"
                    @click="retroceder">Atrás</button>

                <button v-if="currentStep < 4" class="btn btn-primary btn-lg rounded-pill fw-bold"
                    @click="avanzar">Siguiente</button>

                <button v-if="currentStep == 4" class="btn btn-primary btn-lg rounded-pill fw-bold"
                    @click="crearRuta">Crear
                    ruta</button>
            </div>
        </div>


    </div>






</template>

<style></style>
