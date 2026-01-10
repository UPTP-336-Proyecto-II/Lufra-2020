import './bootstrap';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import Swal from 'sweetalert2';

// Hacer SweetAlert disponible globalmente
window.Swal = Swal;

// Toast helper para notificaciones rápidas
window.Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

// Importar componentes
import App from './components/App.vue';
import Dashboard from './components/Dashboard.vue';
import Empleados from './components/Empleados.vue';
import Departamentos from './components/Departamentos.vue';
import Nominas from './components/Nominas.vue';

// Configurar rutas
const routes = [
    { path: '/', name: 'dashboard', component: Dashboard },
    { path: '/empleados', name: 'empleados', component: Empleados },
    { path: '/departamentos', name: 'departamentos', component: Departamentos },
    { path: '/nominas', name: 'nominas', component: Nominas },
];

const router = createRouter({
    history: createWebHistory('/spa'),
    routes
});

// Crear app Vue solo si existe el elemento #app
if (document.getElementById('app')) {
    const app = createApp(App);
    
    app.use(router);
    
    // Plugin global para SweetAlert
    app.config.globalProperties.$swal = Swal;
    app.config.globalProperties.$toast = window.Toast;
    
    app.mount('#app');
}
