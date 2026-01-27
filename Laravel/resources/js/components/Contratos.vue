<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><i class="fas fa-file-signature mr-2"></i>Contratos</h3>
            <div class="card-tools">
              <button @click="abrirModalCrearContrato" class="btn btn-sm btn-success">
                <i class="fas fa-plus"></i> Nuevo Contrato
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <input v-model="busqueda" @input="buscar" type="text" class="form-control" 
                     placeholder="Buscar por empleado o tipo...">
            </div>
            <div v-if="cargando" class="text-center py-4">
              <div class="spinner-border text-primary"></div>
            </div>
            <div v-else-if="contratos.length === 0" class="text-center py-4">
              <p class="text-muted">No hay contratos registrados</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Empleado</th>
                    <th>Tipo</th>
                    <th>Puesto</th>
                    <th>Salario</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="cont in contratos" :key="cont.id">
                    <td>{{ cont.empleado_nombre || cont.empleado?.nombre || '-' }}</td>
                    <td><span class="badge badge-primary">{{ formatTipo(cont.tipo_contrato || cont.tipo) }}</span></td>
                    <td>{{ cont.puesto }}</td>
                    <td>${{ formatNumber(cont.salario_base || cont.salario_mensual) }}</td>
                    <td><span :class="getEstadoBadge(cont.estado)">{{ cont.estado }}</span></td>
                    <td>
                      <button @click="verContrato(cont.id)" class="btn btn-xs btn-info">
                        <i class="fas fa-eye"></i> Ver
                      </button>
                      <button @click="editarContrato(cont.id)" class="btn btn-xs btn-warning ml-1">
                        <i class="fas fa-edit"></i> Editar
                      </button>
                      <button @click="eliminarContrato(cont.id)" class="btn btn-xs btn-danger ml-1">
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

    <!-- Modal para crear contrato -->
    <modal-crear-contrato @contrato-creado="onContratoCreado"></modal-crear-contrato>
  </div>
</template>

<script>
import ModalCrearContrato from './ModalCrearContrato.vue';

export default {
  name: 'Contratos',
  components: {
    ModalCrearContrato
  },
  data() {
    return {
      contratos: [],
      busqueda: '',
      cargando: false
    }
  },
  mounted() {
    this.cargarContratos();
  },
  methods: {
    async cargarContratos() {
      this.cargando = true;
      try {
        const response = await axios.get('/api/contratos');
        this.contratos = Array.isArray(response.data) ? response.data : response.data.data || [];
      } catch (error) {
        console.error('Error cargando contratos:', error);
        this.$toast.fire({ icon: 'error', title: 'Error al cargar contratos' });
      } finally {
        this.cargando = false;
      }
    },
    buscar() {
      this.cargarContratos();
    },
    abrirModalCrearContrato() {
      // Disparar evento para abrir el modal
      window.dispatchEvent(new CustomEvent('abrir-modal-crear-contrato'));
    },
    onContratoCreado(contrato) {
      // Recargar lista de contratos
      this.cargarContratos();
    },
    verContrato(id) {
      alert('Ver contrato: ' + id);
      // Implementar vista de detalles
    },
    editarContrato(id) {
      alert('Editar contrato: ' + id);
      // Implementar edición
    },
    async eliminarContrato(id) {
      const result = await this.$swal.fire({
        title: '¿Eliminar este contrato?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) return;

      try {
        await axios.post(`/contratos/${id}/delete`);
        this.contratos = this.contratos.filter(c => c.id !== id);
        this.$toast.fire({ icon: 'success', title: 'Contrato eliminado' });
      } catch (error) {
        const mensaje = error.response?.data?.message || 'Error al eliminar contrato';
        this.$toast.fire({ icon: 'error', title: mensaje });
      }
    },
    formatNumber(num) {
      return new Intl.NumberFormat('es-ES', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      }).format(num || 0);
    },
    formatTipo(tipo) {
      const tipos = {
        'indefinido': 'Indefinido',
        'temporal': 'Temporal',
        'practicas': 'Prácticas',
        'freelance': 'Freelance'
      };
      return tipos[tipo] || tipo;
    },
    getEstadoBadge(estado) {
      const badges = {
        'activo': 'badge badge-success',
        'inactivo': 'badge badge-danger',
        'suspendido': 'badge badge-warning'
      };
      return badges[estado] || 'badge badge-secondary';
    }
  }
}
</script>
