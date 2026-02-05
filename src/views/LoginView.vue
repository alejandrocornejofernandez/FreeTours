<script setup>
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
</script>

<template>
  <div class="container border rounded">
    <div class="row">
      <div class="col-7"></div>
      <div class="col-5">
        <span>Iniciar sesión</span>
        <form>
          <div class="">
            <i class="bi bi-person-fill"></i>
            <input type="text" placeholder="Nombre de usuario" />
          </div>

          <div>
            <i class="bi bi-key"></i>
            <input type="password" placeholder="Contraseña" />
          </div>

          <div>
            <input type="submit" value="Iniciar sesión" />
          </div>

          <div>
            <!-- RouterLink para la vista de registro -->
            <RouterLink to="/register">¿Aún no tienes cuenta? Regístrate</RouterLink>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<style></style>
