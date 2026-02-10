<script setup>
import NavBar from '@/components/NavBar.vue';
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
</script>

<template>
    <div class="container-fluid ">
        <div class="row">
            <div class="col-12 principal-image d-flex flex-column justify-content-center align-items-center ">
                <p class="h1 fw-bolder text-light text-uppercase">El lugar donde se fabrican experiencias</p>
            </div>
        </div>
    </div>
</template>

<style>
.principal-image {
    background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/home-primary-image.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 50vh;
}
</style>
