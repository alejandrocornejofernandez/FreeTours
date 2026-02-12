<script setup>
import { onMounted, ref } from 'vue';
import router from '@/router';

import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import NavBar from '@/components/NavBar.vue';

</script>

<template>
    <div class="container-fluid">
        <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
            <div class="row">
                <div class="col">
                    <div class="text-center mt-4 mb-4">
                        <h2 class="fw-bold text-primary text-uppercase">Regístrate</h2>
                    </div>

                    <div class="">
                        <div class="mb-3 input-group">
                            <span class="input-group-text bg-light border-end-0">
                                <i class="bi bi-person-fill text-primary"></i>
                            </span>
                            <input class="form-control border-start-0 border-end-0" type="text" placeholder="Titulo" />
                            <span class="input-group-text bg-white border-start-0">
                                <i class="bi bi-check text-success" v-if="nameInput == 'valid-input'"></i>
                            </span>
                        </div>

                        <div class="mb-3 input-group">
                            <span class="input-group-text bg-light border-end-0">
                                <i class="bi bi-person-fill text-primary"></i>
                            </span>
                            <input class="form-control border-start-0 border-end-0" type="text"
                                placeholder="Localidad" />
                            <span class="input-group-text bg-white border-start-0">
                                <i class="bi bi-check text-success" v-if="nameInput == 'valid-input'"></i>
                            </span>
                        </div>

                        <div class="mb-3 input-group">
                            <span class="input-group-text bg-light border-end-0">
                                <i class="bi bi-person-fill text-primary"></i>
                            </span>
                            <input class="form-control border-start-0 border-end-0" type="text"
                                placeholder="Descripción" />
                            <span class="input-group-text bg-white border-start-0">
                                <i class="bi bi-check text-success" v-if="nameInput == 'valid-input'"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
