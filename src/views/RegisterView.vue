<script setup>
import { ref } from 'vue';

import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import router from '@/router';

const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");


// funcion para registrarse 
async function register() {

    const data = {
        nombre: username,
        email,
        constraseña: password
    }

    const peticion = await fetch("http://localhost:8000/api.php/usuarios",
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
    )

    const respuesta = await peticion.json();

    if (respuesta.status == "success") {
        router.push("/");
    }
}

// antes de enviar la petición al servidor, voy a crear una función que asegure que los datos que se mandan son válidos.
function validarRegistro() {
    let usernameValido = false;
    let emailValido = false;
    let contraseñaValida = false;

    // validamos con expresiones regulares los 3 campos del registro
    if (email.value.match()) {
        emailValido = true;
    }

    if (username.value.match()) {
        usernameValido = true;
    }

    // en el caso de la contraseña, como hacemos que se introduzca dos veces, comparamos ambos inputs. 
    if (password.value == confirmPassword.value && password.value.match()) {
        contraseñaValida = true;
    }

    if (usernameValido && emailValido && contraseñaValida) register();
}

</script>

<template>
    <div class="container border rounded form-container">
        <div class="row justify-content-between">
            <div class="col-7 border"><img src="/public/images/register-image.jpg"></div>
            <div class="col-5 align-self-center d-flex justify-content-center">

                <div class="h1">Registrate</div>
                <div class="form">
                    <form>
                        <div class="">
                            <i class="bi bi-person-fill"></i>
                            <input v-model.trim="username" type="text" placeholder="Nombre de usuario" />
                        </div>

                        <div class="">
                            <i class="bi bi-envelope-fill"></i>
                            <input v-model.trim="email" type="text" placeholder="Email" />
                        </div>

                        <div>
                            <i class="bi bi-key"></i>
                            <input v-model.trim="password" type="password" placeholder="Contraseña" />
                        </div>

                        <div>
                            <i class="bi bi-key"></i>
                            <input v-model.trim="confirmPassword" type="password" placeholder="Repite la contraseña" />
                        </div>

                        <div>
                            <input type="submit" value="Crea tu cuenta" @click.prevent="validarRegistro()" />
                        </div>

                        <div>
                            <!-- RouterLink para la vista de login -->
                            <RouterLink to="/login">¿Ya tienes cuenta? Inicia sesión</RouterLink>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
