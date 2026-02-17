<script setup>
import { onMounted, ref } from 'vue';

onMounted(async () => {
    getRoutes()
})

const rutas = ref([]);
async function getRoutes() {
    try {
        const peticion = await fetch('http://localhost:8000/api.php/rutas', {
            method: 'GET',
        });

        const respuesta = await peticion.json();
        rutas.value = respuesta;
        console.log(rutas.value);
    } catch {

    }
}

// función para borrar una ruta
async function deleteRuta(id) {
    try {
        const peticion = await fetch(`http://localhost/api.php/rutas?id=${id}`, {
            method: 'DELETE',
        })

        const respuesta = await peticion.json();
        // llamamos de nuevo al metodo getRoutes() para actualizar la tabla
        getRoutes();
        mensajeSuccess.value = respuesta.message + ` (ID: ${id})`;

    } catch {
        console.log("error")
    }
}

// función para obtener los guias disponibles para la fecha de la ruta
const guiasDisponibles = ref([]);
async function obtenerGuias(fechaRuta) {
    try {
        const peticion = await fetch(`http://localhost:8000/api.php/asignaciones?fecha=${fechaRuta}`, {
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

// variables y función para editar los guias asignados a las rutas
const editGuiaID = ref(null);
const guiaAsignado = ref(null);

// función para editar el guia asignado
function editGuiaAsignado(id, nombreGuia) {
    // activamos el modo edición al pulsar el botón
    editGuiaID.value = id;
    guiaAsignado.value = nombreGuia;
}

function cancelEdit() {
    editGuiaID.value = null;
}

// función para actualizar el rol del usuario
async function asignarGuia(id, rol) {

    const asignacionData = {
        ruta_id: id_ruta, // ID de la ruta
        guia_id: id_guia  // ID del guía
    };

    try {
        const peticion = await fetch('http://localhost/api.php/asignaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(asignacionData)
        })

        const respuesta = await peticion.json();
        // llamamos de nuevo al metodo getUsers() para actualizar la tabla
        getRoutes();
        mensajeSuccess.value = respuesta.message + ` (ID: ${id})`;
        editGuiaID.value = null;

    } catch {
        console.log("error")
    }
}

</script>

<template>
    <div class="container-fluid py-4">
        <div class="row justify-content-center">
            <div class="col-12 col-xl-10">

                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 class="h4 mb-0 text-secondary text-uppercase">Gestión de rutas</h2>
                </div>

                <div v-if="mensajeSuccess !== ''"
                    class="alert alert-success border-0 shadow-sm alert-dismissible fade show" role="alert">
                    <div class="d-flex align-items-center">
                        <i class="bi bi-check-circle-fill me-2 fs-5"></i>
                        <div>{{ mensajeSuccess }}</div>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"
                        @click="mensajeSuccessReset"></button>
                </div>

                <div class="card border-0 shadow-sm">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="bg-light">
                                <tr>
                                    <th class="ps-4 text-uppercase text-muted fw-bold" style="font-size: 0.85rem;">ID
                                    </th>
                                    <th class="text-uppercase text-muted fw-bold" style="font-size: 0.85rem;">Titulo
                                    </th>
                                    <th class="text-uppercase text-muted fw-bold" style="font-size: 0.85rem;">Localidad
                                    </th>
                                    <th class="text-uppercase text-muted fw-bold" style="font-size: 0.85rem;">Fecha</th>
                                    <th class="text-uppercase text-muted fw-bold" style="font-size: 0.85rem;">Hora</th>
                                    <th class="text-uppercase text-muted fw-bold" style="font-size: 0.85rem;">Guía</th>
                                    <th class="text-uppercase text-muted fw-bold" style="font-size: 0.85rem;">Asistentes
                                    </th>
                                    <th class="text-end pe-4 text-uppercase text-muted fw-bold"
                                        style="font-size: 0.85rem;">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="ruta in rutas" :key="ruta.id">
                                    <td class="ps-4 text-secondary fw-medium">{{ ruta.id }}</td>

                                    <td>
                                        <div class="fw-medium">{{ ruta.titulo }}</div>
                                    </td>

                                    <td>
                                        <div class="fw-medium">{{ ruta.localidad }}</div>
                                    </td>

                                    <td>
                                        <div class="fw-medium">{{ ruta.fecha }}</div>
                                    </td>

                                    <td>
                                        <div class="fw-medium">{{ ruta.hora }}</div>
                                    </td>

                                    <td v-if="editGuiaID == ruta.id">
                                        <div class="input-group input-group-sm">
                                            <select v-model="guiaAsignado" class="form-select border-primary"
                                                @click="obtenerGuias(ruta.fecha)">
                                                <option v-for="guia in guiasDisponibles">{{ guia.nombre }}</option>
                                            </select>
                                            <button @click="asignarGuia(ruta.id, ruta.guia_id)"
                                                class="btn btn-outline-success">
                                                <i class="bi bi-check-lg"></i>
                                            </button>
                                            <button @click="cancelEdit()" class="btn btn-outline-danger">
                                                <i class="bi bi-x-lg"></i>
                                            </button>
                                        </div>
                                    </td>

                                    <td v-else>
                                        <span>
                                            {{ ruta.guia_nombre }}
                                        </span>
                                    </td>

                                    <td>
                                        <div class="fw-medium">{{ ruta.asistentes }}</div>
                                    </td>

                                    <td class="text-end pe-4">
                                        <div class="btn-group shadow-sm">
                                            <button @click="editGuiaAsignado(ruta.id, ruta.guia_nombre)"
                                                class="btn btn-white btn-sm text-primary border"
                                                title="Asignar o modificar guía">
                                                <i class="bi bi-pencil-square"></i>
                                            </button>
                                            <button @click="deleteRuta(ruta.id)"
                                                class="btn btn-white btn-sm text-danger border" title="Eliminar ruta">
                                                <i class="bi bi-trash3"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<style></style>
