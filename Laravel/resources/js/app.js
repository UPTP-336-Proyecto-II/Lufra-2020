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
import HomeAdmin from './components/HomeAdmin.vue';
import HomeEmpleado from './components/HomeEmpleado.vue';
import Empleados from './components/Empleados.vue';
import Departamentos from './components/Departamentos.vue';
import Nominas from './components/Nominas.vue';
import Notificaciones from './components/Notificaciones.vue';
import Contratos from './components/Contratos.vue';
import RecibosPagos from './components/RecibosPagos.vue';
import Configuracion from './components/Configuracion.vue';
import Perfil from './components/Perfil.vue';
import ArchivoBanco from './components/ArchivoBanco.vue';
import Obligaciones from './components/Obligaciones.vue';
import Reportes from './components/Reportes.vue';
import Conceptos from './components/Conceptos.vue';
import Metodos from './components/Metodos.vue';
import Monedas from './components/Monedas.vue';
import Impuestos from './components/Impuestos.vue';
import Vacaciones from './components/Vacaciones.vue';
import GestionVacaciones from './components/GestionVacaciones.vue';
import SolicitudesVacaciones from './components/SolicitudesVacaciones.vue';
import SolicitudVacaciones from './components/SolicitudVacaciones.vue';
import SolicitudVacacionesAdmin from './components/SolicitudVacacionesAdmin.vue';
import Roles from './components/Roles.vue';
import ModalCrearEmpleado from './components/ModalCrearEmpleado.vue';
import ModalEditarEmpleado from './components/ModalEditarEmpleado.vue';
import ModalCrearContrato from './components/ModalCrearContrato.vue';

// Configurar rutas con meta para control de acceso
const routes = [
    { path: '/', name: 'dashboard', component: Dashboard },
    { path: '/home_vue', name: 'home_vue', component: Dashboard },
    { path: '/home-admin', name: 'home-admin', component: HomeAdmin },
    { path: '/home-empleado', name: 'home-empleado', component: HomeEmpleado },
    { path: '/empleados', name: 'empleados', component: Empleados, meta: { roles: ['administrador', 'admin_rrhh', 'admin_nominas', 'contador', 'supervisor'] } },
    { path: '/departamentos', name: 'departamentos', component: Departamentos, meta: { roles: ['administrador', 'admin_rrhh'] } },
    { path: '/nominas', name: 'nominas', component: Nominas, meta: { roles: ['administrador', 'admin_nominas', 'contador', 'supervisor'] } },
    { path: '/notificaciones', name: 'notificaciones', component: Notificaciones },
    { path: '/contratos', name: 'contratos', component: Contratos, meta: { roles: ['administrador', 'admin_rrhh'] } },
    { 
        path: '/recibos-pagos', 
        name: 'recibos-pagos', 
        component: RecibosPagos,
        meta: { roles: ['empleado', 'administrador', 'admin_nominas', 'contador', 'supervisor'] },
        children: [
            { path: 'archivo-banco', name: 'archivo-banco', component: ArchivoBanco, meta: { roles: ['administrador', 'admin_nominas', 'contador', 'supervisor'] } },
            { path: 'obligaciones', name: 'obligaciones', component: Obligaciones, meta: { roles: ['administrador', 'admin_nominas', 'contador', 'supervisor'] } },
            { path: 'reportes', name: 'reportes', component: Reportes, meta: { roles: ['administrador', 'admin_nominas', 'contador', 'supervisor'] } },
            { path: 'conceptos', name: 'conceptos', component: Conceptos, meta: { roles: ['administrador', 'admin_nominas'] } },
            { path: 'metodos', name: 'metodos', component: Metodos, meta: { roles: ['administrador', 'admin_nominas'] } },
            { path: 'monedas', name: 'monedas', component: Monedas, meta: { roles: ['administrador', 'admin_nominas'] } }
        ]
    },
    { path: '/configuracion', name: 'configuracion', component: Configuracion, meta: { roles: ['administrador'] } },
    { path: '/perfil', name: 'perfil', component: Perfil },
    { path: '/impuestos', name: 'impuestos', component: Impuestos, meta: { roles: ['administrador', 'admin_nominas', 'contador'] } },
    { path: '/vacaciones', name: 'vacaciones', component: Vacaciones, meta: { roles: ['empleado', 'administrador', 'admin_rrhh'] } },
    { path: '/vacaciones/gestionar', name: 'vacaciones-gestionar', component: GestionVacaciones, meta: { roles: ['empleado', 'administrador', 'admin_rrhh'] } },
    { path: '/solicitudes-vacaciones', name: 'solicitudes-vacaciones', component: SolicitudesVacaciones, meta: { roles: ['empleado', 'administrador', 'admin_rrhh'] } },
    { path: '/solicitar-vacaciones', name: 'solicitar-vacaciones', component: SolicitudVacaciones, meta: { roles: ['empleado', 'administrador', 'admin_rrhh'] } },
    { path: '/gestionar-vacaciones', name: 'gestionar-vacaciones', component: SolicitudVacacionesAdmin, meta: { roles: ['administrador', 'admin_rrhh'] } },
    { path: '/roles', name: 'roles', component: Roles, meta: { roles: ['administrador'] } },
];

const router = createRouter({
    history: createWebHistory('/spa'),
    routes
});

// Guard de navegación para verificar roles
router.beforeEach((to, from, next) => {
    const userRoles = window.__INITIAL_DATA__?.userRoles || [];
    const requiredRoles = to.meta?.roles;
    
    // Si la ruta no requiere roles específicos, permitir acceso
    if (!requiredRoles || requiredRoles.length === 0) {
        next();
        return;
    }
    
    // Verificar si el usuario tiene al menos uno de los roles requeridos
    const hasAccess = userRoles.some(role => requiredRoles.includes(role));
    
    if (hasAccess) {
        next();
    } else {
        // Mostrar mensaje de error y redirigir al home
        window.Toast.fire({
            icon: 'error',
            title: 'No tienes permiso para acceder a esta sección'
        });
        next('/');
    }
});

// Crear app Vue solo si existe el elemento #app
if (document.getElementById('app')) {
    const app = createApp(App);
    
    app.use(router);
    
    // Plugin global para SweetAlert
    app.config.globalProperties.$swal = Swal;
    app.config.globalProperties.$toast = window.Toast;
    
    // Mount la app en el elemento #app
    app.mount('#app');
} else {
    // Si no existe #app, crear uno dinámicamente (para debugging)
    console.warn('Elemento #app no encontrado en el DOM');
}
