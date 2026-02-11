<script setup>
import { onMounted, ref } from 'vue';
import router from '@/router';

import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import NavBar from '@/components/NavBar.vue';

const users = ref("");
const mensajeSuccess = ref("");

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

function editUserRol(id, rol) {
    // activamos el modo edición al pulsar el botón
    editUserID.value = id;
    userRol.value = rol;
}

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
    <div class="container-fluid py-4">
        <div class="row justify-content-center">
            <div class="col-12 col-xl-10">

                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 class="h4 mb-0 text-secondary">Gestión de Usuarios</h2>
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
                                    <th class="text-uppercase text-muted fw-bold" style="font-size: 0.85rem;">Usuario
                                    </th>
                                    <th class="text-uppercase text-muted fw-bold" style="font-size: 0.85rem;">Contraseña
                                    </th>
                                    <th class="text-uppercase text-muted fw-bold" style="font-size: 0.85rem;">Email</th>
                                    <th class="text-uppercase text-muted fw-bold" style="font-size: 0.85rem;">Rol</th>
                                    <th class="text-end pe-4 text-uppercase text-muted fw-bold"
                                        style="font-size: 0.85rem;">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="user in users" :key="user.id">
                                    <td class="ps-4 text-secondary fw-medium">{{ user.id }}</td>
                                    <td>
                                        <div class="fw-medium">{{ user.nombre }}</div>
                                    </td>
                                    <td>
                                        <div class="fw-medium">{{ user.contraseña }}</div>
                                    </td>
                                    <td class="text-muted">{{ user.email }}</td>

                                    <td v-if="editUserID == user.id">
                                        <div class="input-group input-group-sm">
                                            <select v-model="userRol" class="form-select border-primary">
                                                <option>admin</option>
                                                <option>guia</option>
                                                <option>cliente</option>
                                            </select>
                                            <button @click="saveUserRol(user.id, userRol)"
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
                                            {{ user.rol }}
                                        </span>
                                    </td>

                                    <td class="text-end pe-4">
                                        <div class="btn-group shadow-sm">
                                            <button @click="editUserRol(user.id, user.rol)"
                                                class="btn btn-white btn-sm text-primary border" title="Editar rol">
                                                <i class="bi bi-pencil-square"></i>
                                            </button>
                                            <button @click="deleteUser(user.id)"
                                                class="btn btn-white btn-sm text-danger border"
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
</template>

<style></style>
