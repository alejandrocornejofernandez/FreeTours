<script setup>

</script>

<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid justify-content-between">
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <RouterLink to="/" class="nav-link active"><i class="bi bi-house-fill text-primary"></i><span
                                class="ml-1">Inicio</span></RouterLink>
                    </li>


                    <li class="nav-item">
                        <RouterLink to="/gestionUsuarios" class="nav-link"><i
                                class="bi bi-person-fill text-primary"></i><span class="ml-1">Gestión de usuarios</span>
                        </RouterLink>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" href="#">Pricing</a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link disabled" aria-disabled="true">Disabled</a>
                    </li>

                </ul>
            </div>
        </div>
    </nav>
</template>