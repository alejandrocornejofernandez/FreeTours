<script setup>
import { onMounted, ref } from 'vue';

const users = ref("");
const mensajeSuccess = ref("");

// función para obtener todos los usuarios
async function getUsers() {
    try {
        const peticion = await fetch("http://localhost:8000/api.php/usuarios",
            {
                method: "GET",
                headers: { 'Content-type': 'application/json; charset=UTF-8' }
            })

        const respuesta = await peticion.json();
        users.value = respuesta;

    } catch {
        console.log("error")
    }

}
onMounted(async () => {
    getUsers()
})

// función para borrar un usuario
async function deleteUser(id) {
    try {
        const peticion = await fetch(`http://localhost:8000/api.php/usuarios?id=${id}`,
            {
                method: "DELETE",
            })

        const respuesta = await peticion.json();
        // llamamos de nuevo al metodo getUsers() para actualizar la tabla
        getUsers();
        mensajeSuccess.value = respuesta.message + ` (ID: ${id})`;

    } catch {
        console.log("error")
    }
}

function mensajeSuccessReset() {
    mensajeSuccess.value = "";
}


// variables y función para editar los roles
const editUserID = ref(null);
const userRol = ref(null);

// función para editar el rol
function editUserRol(id, rol) {
    // activamos el modo edición al pulsar el botón
    editUserID.value = id;
    userRol.value = rol;
}

// función para actualizar el rol del usuario
async function saveUserRol(id, rol) {

    const updatedRole = {
        rol
    }

    try {
        const peticion = await fetch(`http://localhost:8000/api.php/usuarios?id=${id}`,
            {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedRole)
            })

        const respuesta = await peticion.json();
        // llamamos de nuevo al metodo getUsers() para actualizar la tabla
        getUsers();
        mensajeSuccess.value = respuesta.message + ` (ID: ${id})`;
        editUserID.value = null;

    } catch {
        console.log("error")
    }
}

function cancelEdit() {
    editUserID.value = null;
}
</script>

<template>
    <div class="py-5">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-xl-11">

                    <div class="text-center mb-5">
                        <h2 class="fw-bold text-uppercase text-forest">Gestión de Usuarios</h2>
                        <div class="divider mx-auto"></div>
                    </div>

                    <div v-if="mensajeSuccess !== ''"
                        class="alert alert-custom-success border-0 shadow-sm alert-dismissible fade show mb-4" role="alert">
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
                                        <th class="py-3 text-uppercase fw-bold small">Nombre de Usuario</th>
                                        <th class="py-3 text-uppercase fw-bold small">Contraseña</th>
                                        <th class="py-3 text-uppercase fw-bold small">Email</th>
                                        <th class="py-3 text-uppercase fw-bold small">Rol</th>
                                        <th class="text-end pe-4 py-3 text-uppercase fw-bold small">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="user in users" :key="user.id" class="user-row">
                                        <td class="ps-4 fw-bold text-forest">{{ user.id }}</td>
                                        <td>
                                            <div class="fw-bold text-dark">{{ user.nombre }}</div>
                                        </td>
                                        <td>
                                            <code class="text-muted small">{{ user.contraseña }}</code>
                                        </td>
                                        <td class="text-secondary">{{ user.email }}</td>

                                        <td v-if="editUserID == user.id">
                                            <div class="input-group input-group-sm edit-group shadow-sm">
                                                <select v-model="userRol" class="form-select border-lime">
                                                    <option>admin</option>
                                                    <option>guia</option>
                                                    <option>cliente</option>
                                                </select>
                                                <button @click="saveUserRol(user.id, userRol)"
                                                    class="btn btn-lime">
                                                    <i class="bi bi-check-lg text-white"></i>
                                                </button>
                                                <button @click="cancelEdit()" class="btn btn-brick">
                                                    <i class="bi bi-x-lg text-white"></i>
                                                </button>
                                            </div>
                                        </td>

                                        <td v-else>
                                            <span :class="['badge rounded-pill px-3 py-2', 
                                                user.rol === 'admin' ? 'bg-forest' : 
                                                user.rol === 'guia' ? 'bg-fern' : 'bg-lime']">
                                                {{ user.rol }}
                                            </span>
                                        </td>

                                        <td class="text-end pe-4">
                                            <div class="btn-group gap-2">
                                                <button @click="editUserRol(user.id, user.rol)"
                                                    class="btn btn-icon btn-outline-forest" title="Editar rol">
                                                    <i class="bi bi-pencil-square"></i>
                                                </button>
                                                <button @click="deleteUser(user.id)"
                                                    class="btn btn-icon btn-outline-brick"
                                                    title="Eliminar usuario">
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
/* Colores de Marca */
.text-forest { color: #386641; }
.bg-forest { background-color: #386641; }
.bg-fern { background-color: #6A994E; }
.bg-lime { background-color: #A7C957; }
.bg-brick { background-color: #BC4749; }
.text-cream { color: #F2E8CF; }

.divider {
    width: 60px;
    height: 4px;
    background-color: #A7C957;
    border-radius: 2px;
}

/* Estilos de la tabla */
.table thead {
    border-bottom: 2px solid #6A994E;
}

.user-row {
    transition: background-color 0.2s;
    background-color: white;
}

.user-row:hover {
    background-color: #fcfaf2 !important;
}

/* Alerta personalizada */
.alert-custom-success {
    background-color: #386641;
    color: #F2E8CF;
    border-left: 5px solid #A7C957 !important;
}

.alert-custom-success .btn-close {
    filter: invert(1) grayscale(100%) brightness(200%);
}

/* Inputs de edición */
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

/* Botones Icono */
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
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
</style>