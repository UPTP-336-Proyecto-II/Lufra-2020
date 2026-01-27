<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><i class="fas fa-users mr-2"></i>Empleados</h3>
            <div class="card-tools">
              <button @click="abrirModalCrearEmpleado" class="btn btn-sm btn-primary" data-toggle="modal" data-target="#modalCrearEmpleado">
                <i class="fas fa-plus"></i> Nuevo Empleado
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <input v-model="busqueda" @input="buscar" type="text" class="form-control" 
                     placeholder="Buscar por nombre, email o código...">
            </div>
            <div v-if="cargando" class="text-center py-4">
              <div class="spinner-border text-primary"></div>
            </div>
            <div v-else-if="empleados.length === 0" class="text-center py-4">
              <p class="text-muted">No hay empleados registrados</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Departamento</th>
                    <th>Cargo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="emp in empleados" :key="emp.id">
                    <td>{{ emp.id }}</td>
                    <td>{{ emp.nombre || emp.name }}</td>
                    <td>{{ emp.email }}</td>
                    <td>
                      <span v-if="emp.departamento" class="badge badge-info">{{ emp.departamento }}</span>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>{{ emp.cargo || '-' }}</td>
                    <td>
                      <button @click="editarEmpleado(emp)" class="btn btn-xs btn-warning">
                        <i class="fas fa-edit"></i> Editar
                      </button>
                      <button @click="eliminarEmpleado(emp.id)" class="btn btn-xs btn-danger ml-1">
                        <i class="fas fa-trash"></i> Eliminar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para crear empleado -->
    <modal-crear-empleado @empleado-creado="onEmpleadoCreado"></modal-crear-empleado>
    
    <!-- Modal para editar empleado -->
    <modal-editar-empleado @empleado-actualizado="onEmpleadoActualizado"></modal-editar-empleado>
  </div>
</template>

<script>
import ModalCrearEmpleado from './ModalCrearEmpleado.vue';
import ModalEditarEmpleado from './ModalEditarEmpleado.vue';

export default {
  name: 'Empleados',
  components: {
    ModalCrearEmpleado,
    ModalEditarEmpleado
  },
  data() {
    return {
      empleados: [],
      busqueda: '',
      cargando: false
    }
  },
  mounted() {
    this.cargarEmpleados();
  },
  methods: {
    async cargarEmpleados() {
      this.cargando = true;
      try {
        const response = await axios.get('/api/empleados');
        this.empleados = Array.isArray(response.data) ? response.data : response.data.data || [];
      } catch (error) {
        this.$toast.fire({ icon: 'error', title: 'Error al cargar empleados' });
      } finally {
        this.cargando = false;
      }
    },
    buscar() {
      // Implementar búsqueda
      this.cargarEmpleados();
    },
    abrirModalCrearEmpleado() {
      // El modal se abre automáticamente con data-toggle
    },
    onEmpleadoCreado(empleado) {
      // Recargar lista de empleados
      this.cargarEmpleados();
    },
    onEmpleadoActualizado(empleado) {
      // Recargar lista de empleados
      this.cargarEmpleados();
    },
    editarEmpleado(emp) {
      // Disparar evento para abrir modal de edición
      window.dispatchEvent(new CustomEvent('abrir-modal-editar-empleado', { detail: emp }));
    },
    async eliminarEmpleado(id) {
      const result = await this.$swal.fire({
        title: '¿Eliminar empleado?',
        text: 'Esta acción eliminará el usuario y todos sus datos asociados',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) return;

      try {
        await axios.delete(`/api/empleados/${id}`);
        this.$toast.fire({ icon: 'success', title: 'Empleado eliminado correctamente' });
        this.cargarEmpleados();
      } catch (error) {
        this.$toast.fire({ 
          icon: 'error', 
          title: error.response?.data?.message || 'Error al eliminar empleado' 
        });
      }
    }
  }
}
</script>

