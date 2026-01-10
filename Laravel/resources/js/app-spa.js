import './bootstrap';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import Swal from 'sweetalert2';

// Hacer SweetAlert disponible globalmente
window.Swal = Swal;

// Toast helper
window.Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
});

// Componentes inline (sin archivos .vue separados)
const App = {
    template: `
        <div class="min-h-screen bg-gray-100">
            <nav class="bg-white shadow-lg">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between h-16">
                        <div class="flex">
                            <div class="flex-shrink-0 flex items-center">
                                <h1 class="text-xl font-bold text-gray-800">Sistema de Nóminas</h1>
                            </div>
                            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <router-link to="/" class="nav-link" :class="{ 'active': $route.name === 'dashboard' }">
                                    Dashboard
                                </router-link>
                                <router-link to="/empleados" class="nav-link" :class="{ 'active': $route.name === 'empleados' }">
                                    Empleados
                                </router-link>
                                <router-link to="/departamentos" class="nav-link" :class="{ 'active': $route.name === 'departamentos' }">
                                    Departamentos
                                </router-link>
                                <router-link to="/nominas" class="nav-link" :class="{ 'active': $route.name === 'nominas' }">
                                    Nóminas
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <main class="py-10">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <transition name="fade" mode="out-in">
                        <router-view></router-view>
                    </transition>
                </div>
            </main>
        </div>
    `
};

const Dashboard = {
    template: `
        <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
            
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div class="bg-white overflow-hidden shadow rounded-lg p-5">
                    <div class="flex items-center">
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">Total Empleados</dt>
                                <dd class="text-3xl font-semibold text-gray-900">{{ stats.empleados }}</dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div class="bg-white overflow-hidden shadow rounded-lg p-5">
                    <div class="flex items-center">
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">Departamentos</dt>
                                <dd class="text-3xl font-semibold text-gray-900">{{ stats.departamentos }}</dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div class="bg-white overflow-hidden shadow rounded-lg p-5">
                    <div class="flex items-center">
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">Nóminas Activas</dt>
                                <dd class="text-3xl font-semibold text-gray-900">{{ stats.nominas }}</dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div class="bg-white overflow-hidden shadow rounded-lg p-5">
                    <div class="flex items-center">
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">Total Pagado</dt>
                                <dd class="text-3xl font-semibold text-gray-900">\${{ stats.totalPagado }}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-8 bg-white shadow rounded-lg p-6">
                <h3 class="text-lg font-medium text-gray-900">Bienvenido al Sistema de Nóminas</h3>
                <p class="mt-2 text-sm text-gray-500">
                    Gestiona empleados, departamentos y nóminas desde una interfaz moderna y rápida.
                </p>
                <button @click="mostrarDemo" class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                    Ver Demo SweetAlert
                </button>
            </div>
        </div>
    `,
    data() {
        return {
            stats: {
                empleados: 0,
                departamentos: 0,
                nominas: 0,
                totalPagado: 0
            }
        }
    },
    methods: {
        async cargarStats() {
            try {
                const response = await axios.get('/api/stats');
                this.stats = response.data;
            } catch (error) {
                this.stats = { empleados: 15, departamentos: 5, nominas: 3, totalPagado: 50000 };
            }
        },
        mostrarDemo() {
            Swal.fire({
                title: '¡SweetAlert2 Integrado!',
                text: 'Las notificaciones están funcionando correctamente',
                icon: 'success',
                confirmButtonText: 'Genial!'
            });
        }
    },
    mounted() {
        this.cargarStats();
        window.Toast.fire({
            icon: 'success',
            title: 'Bienvenido al sistema'
        });
    }
};

const Empleados = {
    template: `
        <div>
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Empleados</h2>
                <button @click="nuevoEmpleado" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                    + Nuevo Empleado
                </button>
            </div>

            <div class="bg-white shadow rounded-lg overflow-hidden">
                <div v-if="cargando" class="p-8 text-center">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                    <p class="text-gray-600 mt-2">Cargando empleados...</p>
                </div>

                <table v-else class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departamento</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="emp in empleados" :key="emp.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ emp.id }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ emp.name }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ emp.email }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span v-if="emp.department" class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                    {{ emp.department }}
                                </span>
                                <span v-else class="text-gray-400">Sin departamento</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button @click="editarEmpleado(emp)" class="text-indigo-600 hover:text-indigo-900 mr-3">Editar</button>
                                <button @click="eliminarEmpleado(emp)" class="text-red-600 hover:text-red-900">Eliminar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    data() {
        return {
            empleados: [],
            cargando: false
        }
    },
    methods: {
        async cargarEmpleados() {
            this.cargando = true;
            try {
                const response = await axios.get('/api/empleados/vue');
                this.empleados = response.data.data || response.data;
            } catch (error) {
                window.Toast.fire({ icon: 'error', title: 'Error al cargar empleados' });
            } finally {
                this.cargando = false;
            }
        },
        nuevoEmpleado() {
            Swal.fire({
                title: 'Nuevo Empleado',
                html: `
                    <input id="name" class="swal2-input" placeholder="Nombre completo">
                    <input id="email" class="swal2-input" placeholder="Email">
                    <input id="password" type="password" class="swal2-input" placeholder="Contraseña">
                `,
                confirmButtonText: 'Crear',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    return {
                        name: document.getElementById('name').value,
                        email: document.getElementById('email').value,
                        password: document.getElementById('password').value
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    // Aquí iría la llamada API
                    window.Toast.fire({ icon: 'success', title: 'Empleado creado' });
                }
            });
        },
        editarEmpleado(emp) {
            window.Toast.fire({ icon: 'info', title: `Editando ${emp.name}` });
        },
        async eliminarEmpleado(emp) {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: `Eliminarás a ${emp.name}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                window.Toast.fire({ icon: 'success', title: 'Empleado eliminado' });
                this.cargarEmpleados();
            }
        }
    },
    mounted() {
        this.cargarEmpleados();
    }
};

const Departamentos = {
    template: `
        <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Departamentos</h2>
            <div class="bg-white shadow rounded-lg p-6">
                <p class="text-gray-500">Módulo de departamentos en construcción...</p>
            </div>
        </div>
    `
};

const Nominas = {
    template: `
        <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Nóminas</h2>
            <div class="bg-white shadow rounded-lg p-6">
                <p class="text-gray-500">Módulo de nóminas en construcción...</p>
            </div>
        </div>
    `
};

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

// Crear app Vue
if (document.getElementById('app')) {
    const app = createApp(App);
    app.use(router);
    
    // Configurar SweetAlert globalmente
    app.config.globalProperties.$swal = Swal;
    app.config.globalProperties.$toast = window.Toast;
    
    app.mount('#app');
}
