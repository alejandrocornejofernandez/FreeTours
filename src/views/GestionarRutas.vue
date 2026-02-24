<script setup>
import { onMounted, ref } from 'vue';


// para que no pueda entrar nadie que no sea usuario
const props = defineProps({
    sesion: Object
})

if (props.sesion.rol !== "admin") router.push("/");

// variable y función para la retroalimentación
const mensajeSuccess = ref('');
function mensajeSuccessReset() {
    mensajeSuccess.value = "";
}

onMounted(async () => {
    getRoutes()
})

// función para cargar todas las rutas
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
        console.log("Error al cargar rutas");
    }
}

// función para borrar una ruta
async function deleteRuta(id) {
    try {
        const peticion = await fetch(`http://localhost:8000/api.php/rutas?id=${id}`, {
            method: 'DELETE',
        })

        const respuesta = await peticion.json();
        getRoutes();
        mensajeSuccess.value = respuesta.message + ` (ID: ${id})`;

    } catch {
        console.log("error")
    }
}

// variables y función para editar los guias asignados a las rutas
const editGuiaID = ref(null);
const guiaAsignado = ref(null);

// función para editar el guia asignado
function editGuiaAsignado(id, idGuiaAsignado) {
    editGuiaID.value = id;
    guiaAsignado.value = idGuiaAsignado;
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

    } catch {
        console.log("Fecha no válida")
    }
}

// función para actualizar el guia de la ruta.
async function asignarGuia(id_ruta, id_guia) {
    const asignacionData = {
        ruta_id: id_ruta,
        guia_id: id_guia
    };

    try {
        const peticion = await fetch('http://localhost:8000/api.php/asignaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(asignacionData)
        })

        const respuesta = await peticion.json();
        getRoutes();
        mensajeSuccess.value = `El guia (ID: ${id_guia}) ha sido asignado correctamente en la ruta (ID : ${id_ruta})`;
        editGuiaID.value = null;

    } catch {
        console.log("error")
    }
}

function cancelEdit() {
    editGuiaID.value = null;
}
</script>

<template>
    <div class="py-5">
        <div class="container-fluid px-lg-5">
            <div class="row justify-content-center">
                <div class="col-12 col-xl-11">

                    <div class="text-center mb-5">
                        <h2 class="fw-bold text-uppercase text-forest">Gestión de rutas</h2>
                        <div class="divider mx-auto"></div>
                    </div>

                    <div v-if="mensajeSuccess !== ''"
                        class="alert alert-custom-success border-0 shadow-sm alert-dismissible fade show mb-4"
                        role="alert">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-check-circle-fill me-2 fs-5"></i>
                            <div class="fw-medium">{{ mensajeSuccess }}</div>
                        </div>
                        <button type="button" class="btn-close" @click="mensajeSuccessReset"></button>
                    </div>

                    <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="bg-forest text-cream">
                                    <tr>
                                        <th class="ps-4 py-3 text-uppercase fw-bold small">ID</th>
                                        <th class="py-3 text-uppercase fw-bold small">Título</th>
                                        <th class="py-3 text-uppercase fw-bold small">Localidad</th>
                                        <th class="py-3 text-uppercase fw-bold small text-center">Fecha y Hora</th>
                                        <th class="py-3 text-uppercase fw-bold small">Guía Asignado</th>
                                        <th class="py-3 text-uppercase fw-bold small text-center">Asistentes</th>
                                        <th class="text-end pe-4 py-3 text-uppercase fw-bold small">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="ruta in rutas" :key="ruta.id" class="route-row">
                                        <td class="ps-4 fw-bold text-forest">{{ ruta.id }}</td>

                                        <td>
                                            <div class="fw-bold text-dark">{{ ruta.titulo }}</div>
                                        </td>

                                        <td>
                                            <span class="badge bg-light text-forest border rounded-pill px-3">
                                                <i class="bi bi-geo-alt-fill me-1"></i>{{ ruta.localidad }}
                                            </span>
                                        </td>

                                        <td class="text-center">
                                            <div class="small fw-bold text-dark">{{ ruta.fecha }}</div>
                                            <div class="small text-muted"><i class="bi bi-clock me-1"></i>{{ ruta.hora
                                                }}</div>
                                        </td>

                                        <td v-if="editGuiaID == ruta.id" style="min-width: 200px;">
                                            <div class="input-group input-group-sm edit-group shadow-sm">
                                                <select class="form-select border-lime" v-model="guiaAsignado"
                                                    @focus="obtenerGuias(ruta.fecha)">
                                                    <option v-if="ruta.guia_nombre != null" :value="guiaAsignado">
                                                        {{ ruta.guia_nombre }}
                                                    </option>
                                                    <option v-for="guia in guiasDisponibles" :key="guia.id"
                                                        :value="guia.id">
                                                        {{ guia.nombre }} (ID: {{ guia.id }})
                                                    </option>
                                                </select>
                                                <button @click="asignarGuia(ruta.id, guiaAsignado)"
                                                    class="btn btn-lime">
                                                    <i class="bi bi-check-lg text-white"></i>
                                                </button>
                                                <button @click="cancelEdit()" class="btn btn-brick">
                                                    <i class="bi bi-x-lg text-white"></i>
                                                </button>
                                            </div>
                                        </td>

                                        <td v-else>
                                            <div class="d-flex align-items-center">
                                                <i class="bi bi-person-badge me-2"
                                                    :class="ruta.guia_nombre ? 'text-forest' : 'text-muted'"></i>
                                                <span
                                                    :class="ruta.guia_nombre ? 'fw-medium text-dark' : 'text-muted small italic'">
                                                    {{ ruta.guia_nombre || 'Sin asignar' }}
                                                </span>
                                            </div>
                                        </td>

                                        <td class="text-center">
                                            <span :class="['badge rounded-pill px-3 py-2',
                                                ruta.asistentes < 10 ? 'bg-warning-custom' : 'bg-lime']">
                                                <i v-if="ruta.asistentes < 10"
                                                    class="bi bi-exclamation-triangle-fill me-1"></i>
                                                {{ ruta.asistentes }}
                                            </span>
                                        </td>

                                        <td class="text-end pe-4">
                                            <div class="btn-group gap-2">
                                                <button @click="editGuiaAsignado(ruta.id, ruta.guia_id)"
                                                    class="btn btn-icon btn-outline-forest" title="Asignar Guía">
                                                    <i class="bi bi-person-gear"></i>
                                                </button>
                                                <button @click="deleteRuta(ruta.id)"
                                                    class="btn btn-icon btn-outline-brick" title="Eliminar ruta">
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
    </div>
</template>

<style scoped>
.text-forest {
    color: #386641;
}

.bg-forest {
    background-color: #386641;
}

.bg-lime {
    background-color: #A7C957;
}

.bg-brick {
    background-color: #BC4749;
}

.text-cream {
    color: white;
}

.bg-warning-custom {
    background-color: #BC4749;
    color: white;
}

.divider {
    width: 60px;
    height: 4px;
    background-color: #A7C957;
    border-radius: 2px;
}

.route-row {
    transition: background-color 0.2s;
    background-color: white;
}

.route-row:hover {
    background-color: #fcfaf2 !important;
}

.alert-custom-success {
    background-color: #386641;
    color: white;
    border-left: 5px solid #A7C957 !important;
}

.alert-custom-success .btn-close {
    filter: invert(1) grayscale(100%) brightness(200%);
}

.edit-group .btn {
    padding: 0.25rem 0.75rem;
}

.btn-lime {
    background-color: #A7C957;
    border: none;
}

.btn-brick {
    background-color: #BC4749;
    border: none;
}

.border-lime {
    border-color: #A7C957 !important;
}

.btn-icon {
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    transition: all 0.2s;
}

.btn-outline-forest {
    color: #386641;
    border: 1px solid #386641;
}

.btn-outline-forest:hover {
    background-color: #386641;
    color: white;
}

.btn-outline-brick {
    color: #BC4749;
    border: 1px solid #BC4749;
}

.btn-outline-brick:hover {
    background-color: #BC4749;
    color: white;
}

.badge {
    font-size: 0.75rem;
    letter-spacing: 0.5px;
}

.italic {
    font-style: italic;
}
</style>