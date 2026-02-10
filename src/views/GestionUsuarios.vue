<script setup>
import { onMounted, ref } from 'vue';
import router from '@/router';

import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import NavBar from '@/components/NavBar.vue';

const users = ref("");

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



</script>
<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col">
                <table class="table table-active table-striped">
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Contraseña</th>
                            <th>Rol</th>
                            <th>Opciones</th>
                        </tr>
                        <tr v-for="user in users">
                            <td>{{ user.id }}</td>
                            <td>{{ user.nombre }}</td>
                            <td>{{ user.email }}</td>
                            <td>{{ user.contraseña }}</td>
                            <td>{{ user.rol }}</td>
                            <td><button><i class="bi bi-trash-fill"></i></button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style></style>
