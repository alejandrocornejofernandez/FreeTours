<script setup>
const currentYear = new Date().getFullYear();
</script>

<template>
    <footer class="custom-footer mt-auto">
        <div class="container py-4">
            <div class="row align-items-center">

                <div class="col-md-4 text-center text-md-start mb-3 mb-md-0">
                    <div class="d-flex align-items-center justify-content-center justify-content-md-start">
                        <span class="fs-5 fw-bold footer-brand-text">FreeTours</span>
                    </div>
                </div>

                <div class="col-md-4 text-center mb-3 mb-md-0">
                    <ul class="list-inline mb-0">
                        <li class="list-inline-item mx-2">
                            <a href="#" class="footer-link">Privacidad</a>
                        </li>
                        <li class="list-inline-item mx-2">
                            <a href="#" class="footer-link">Términos</a>
                        </li>
                        <li class="list-inline-item mx-2">
                            <a href="#" class="footer-link">Soporte</a>
                        </li>
                    </ul>
                </div>

                <div class="col-md-4 text-center text-md-end">
                    <div class="social-icons">
                        <a href="https://www.facebook.com" class="social-link"><i class="bi bi-facebook"></i></a>
                        <a href="https://www.instagram.com" class="social-link"><i class="bi bi-instagram"></i></a>
                        <a href="https://www.x.com" class="social-link"><i class="bi bi-twitter-x"></i></a>
                        <a href="https://www.youtube.com" class="social-link"><i class="bi bi-youtube"></i></a>
                    </div>
                </div>

            </div>

            <hr class="footer-divider my-3">

            <div class="row">
                <div class="col-12 text-center">
                    <p class="copyright-text mb-0">
                        &copy; {{ currentYear }} FreeTours
                    </p>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped>
/* colores de fondo para el footer y color del nombre de la web */
.custom-footer {
    background-color: #386641;
    color: white;
    border-top: 4px solid #6A994E;
}

/* nombre de la web */
.footer-brand-text {
    color: white;
    letter-spacing: 0.5px;
}


/* enlaces */
.footer-link {
    color: white;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.3s ease;
}

/* hover para los enlaces */
.footer-link:hover {
    color: #A7C957;
}

/* iconos de las redes sociales */
.social-link {
    color: #386641;
    background-color: #A7C957;
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-left: 10px;
    text-decoration: none;
    transition: transform 0.3s ease, background-color 0.3s ease;
}

/* hover de los iconos de redes sociales */
.social-link:hover {
    transform: translateY(-3px);
    background-color: #F2E8CF;
    color: #386641;
}

/* linea divisoria del footer */
.footer-divider {
    border-top: 1px solid rgba(167, 201, 87, 0.2);
    opacity: 1;
}

/* texto copyrigth */
.copyright-text {
    font-size: 0.8rem;
    color: white
}
</style>