import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
    },
    {
      path: '/gestionUsuarios',
      name: 'gestionUsuarios',
      component: () => import('@/views/GestionUsuarios.vue'),
    },
    {
      path: '/gestionRutas',
      name: 'gestionRutas',
      component: () => import('@/views/GestionRutas.vue'),
    },
    {
      path: '/gestionRutas/crearRutas',
      name: 'crearRutas',
      component: () => import('@/views/CrearRutas.vue'),
    },
    {
      path: '/gestionRutas/verRutas',
      name: 'verRutas',
      component: () => import('@/views/VerRutas.vue'),
    },
    {
      path: '/gestionRutas/verRutasCliente',
      name: 'verRutasCliente',
      component: () => import('@/views/VerRutasCliente.vue'),
    },
    {
      path: '/gestionRutas/gestionarRutas',
      name: 'gestionarRutas',
      component: () => import('@/views/GestionarRutas.vue'),
    },
    {
      path: '/ruta/:id',
      name: 'DetalleRuta',
      component: () => import('@/views/DetalleRutaView.vue'),
    },
  ],
})

export default router
