<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <h1 class="mb-4">
          <i class="fas fa-umbrella-beach mr-2"></i> Gestión de Solicitudes de Vacaciones
        </h1>
      </div>
    </div>

    <div class="row mb-3">
      <div class="col-md-6">
        <div class="btn-group" role="group">
          <button type="button" class="btn btn-primary" :class="{'active': filtroEstado === 'todas'}" @click="filtrarEstado('todas')">
            <i class="fas fa-list"></i> Todas
          </button>
          <button type="button" class="btn btn-warning" :class="{'active': filtroEstado === 'pendiente'}" @click="filtrarEstado('pendiente')">
            <i class="fas fa-clock"></i> Pendientes
          </button>
          <button type="button" class="btn btn-success" :class="{'active': filtroEstado === 'aprobada'}" @click="filtrarEstado('aprobada')">
            <i class="fas fa-check-circle"></i> Aprobadas
          </button>
          <button type="button" class="btn btn-danger" :class="{'active': filtroEstado === 'rechazada'}" @click="filtrarEstado('rechazada')">
            <i class="fas fa-times-circle"></i> Rechazadas
          </button>
        </div>
      </div>
      <div class="col-md-6 text-right">
        <button type="button" class="btn btn-success" @click="mostrarModalCrear = true" v-if="puedeCrear">
          <i class="fas fa-plus"></i> Nueva Solicitud
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0"><i class="fas fa-table mr-2"></i> Solicitudes de Vacaciones</h5>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Empleado</th>
                    <th>Tipo</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Fin</th>
                    <th>Días</th>
                    <th>Estado</th>
                    <th>Solicitado</th>
                    <th>Aprobado Por</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="solicitud in solicitudesFiltradas" :key="solicitud.id">
                    <td>{{ solicitud.id }}</td>
                    <td>
                      <strong>{{ solicitud.empleado?.user?.name || 'Sin nombre' }}</strong><br>
                      <small class="text-muted">{{ solicitud.empleado?.user?.email || '' }}</small>
                    </td>
                    <td>
                      <span class="badge" :class="solicitud.tipo === 'vacaciones' ? 'badge-info' : 'badge-warning'">
                        {{ (solicitud.tipo || 'vacaciones').toUpperCase() }}
                      </span>
                    </td>
                    <td>{{ formatDate(solicitud.fecha_inicio) }}</td>
                    <td>{{ formatDate(solicitud.fecha_fin) }}</td>
                    <td>
                      <span class="badge badge-secondary">{{ solicitud.dias_solicitados }} días</span>
                    </td>
                    <td>
                      <span class="badge" :class="estadoBadgeClass(solicitud.estado)">
                        <i :class="estadoIcon(solicitud.estado)"></i> {{ estadoLabel(solicitud.estado) }}
                      </span>
                    </td>
                    <td>
                      <small>{{ formatDateTime(solicitud.created_at) }}</small>
                    </td>
                    <td>
                      <span v-if="solicitud.aprobador">
                        <small>{{ solicitud.aprobador.name }}</small><br>
                        <small class="text-muted">{{ solicitud.fecha_aprobacion ? formatDate(solicitud.fecha_aprobacion) : '' }}</small>
                      </span>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <div class="btn-group" role="group">
                        <button type="button" class="btn btn-sm btn-info" @click="verDetalle(solicitud)" title="Ver detalles">
                          <i class="fas fa-eye"></i>
                        </button>
                        
                        <!-- Botones de Aprobar/Rechazar solo para usuarios con permiso vacaciones.gestionar -->
                        <template v-if="puedeGestionar && solicitud.estado === 'pendiente'">
                          <button type="button" class="btn btn-sm btn-success" @click="aprobarSolicitud(solicitud.id)" title="Aprobar">
                            <i class="fas fa-check"></i>
                          </button>
                          <button type="button" class="btn btn-sm btn-danger" @click="rechazarSolicitud(solicitud.id)" title="Rechazar">
                            <i class="fas fa-times"></i>
                          </button>
                        </template>
                        
                        <!-- Botón de Cancelar solo para empleados en sus propias solicitudes pendientes -->
                        <button 
                          v-if="puedeCrear && solicitud.estado === 'pendiente' && esMiSolicitud(solicitud)" 
                          type="button" 
                          class="btn btn-sm btn-warning" 
                          @click="cancelarSolicitud(solicitud.id)"
                          title="Cancelar"
                        >
                          <i class="fas fa-ban"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="solicitudesFiltradas.length === 0">
                    <td colspan="10" class="text-center">
                      <div class="alert alert-info mb-0">
                        <i class="fas fa-info-circle mr-2"></i> No hay solicitudes de vacaciones.
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Crear Solicitud -->
    <div v-if="mostrarModalCrear" class="modal d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title"><i class="fas fa-plus mr-2"></i> Nueva Solicitud de Vacaciones</h5>
            <button type="button" class="close text-white" @click="cerrarModalCrear">
              <span>&times;</span>
            </button>
          </div>
          <form @submit.prevent="crearSolicitud">
            <div class="modal-body">
              <div class="form-group">
                <label for="fecha_inicio">Fecha Inicio <span class="text-danger">*</span></label>
                <input type="date" class="form-control" id="fecha_inicio" v-model="formulario.fecha_inicio" required>
              </div>
              <div class="form-group">
                <label for="fecha_fin">Fecha Fin <span class="text-danger">*</span></label>
                <input type="date" class="form-control" id="fecha_fin" v-model="formulario.fecha_fin" required>
              </div>
              <div class="form-group">
                <label for="motivo">Motivo</label>
                <textarea class="form-control" id="motivo" v-model="formulario.motivo" rows="3" placeholder="Opcional: Describe el motivo de tu solicitud"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="cerrarModalCrear">Cancelar</button>
              <button type="submit" class="btn btn-success">
                <i class="fas fa-save"></i> Crear Solicitud
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Detalle -->
    <div v-if="detalleModal" class="modal d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title"><i class="fas fa-info-circle mr-2"></i> Detalle de Solicitud</h5>
            <button type="button" class="close text-white" @click="detalleModal = null">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label><strong>Empleado:</strong></label>
              <p>{{ detalleModal.empleado?.user?.name || 'Sin nombre' }}</p>
            </div>
            <div class="form-group">
              <label><strong>Período:</strong></label>
              <p>Del {{ formatDate(detalleModal.fecha_inicio) }} al {{ formatDate(detalleModal.fecha_fin) }}</p>
            </div>
            <div class="form-group">
              <label><strong>Motivo:</strong></label>
              <p>{{ detalleModal.motivo || 'Sin motivo especificado' }}</p>
            </div>
            <div class="form-group">
              <label><strong>Estado:</strong></label>
              <p>
                <span class="badge" :class="estadoBadgeClass(detalleModal.estado)">
                  {{ estadoLabel(detalleModal.estado) }}
                </span>
              </p>
            </div>
            <div class="form-group" v-if="detalleModal.observaciones">
              <label><strong>Observaciones:</strong></label>
              <p>{{ detalleModal.observaciones }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="detalleModal = null">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Vacaciones',
  data() {
    return {
      formulario: {
        fecha_inicio: '',
        fecha_fin: '',
        motivo: ''
      },
      solicitudes: [],
      filtroEstado: 'todas',
      mostrarModalCrear: false,
      detalleModal: null,
      userPermissions: []
    };
  },
  computed: {
    solicitudesFiltradas() {
      if (this.filtroEstado === 'todas') {
        return this.solicitudes;
      }
      return this.solicitudes.filter(s => s.estado === this.filtroEstado);
    },
    puedeCrear() {
      return this.userPermissions.includes('vacaciones.solicitar');
    },
    puedeGestionar() {
      return this.userPermissions.includes('vacaciones.gestionar');
    }
  },
  methods: {
    async cargarPermisos() {
      try {
        const response = await axios.get('/api/user/permissions');
        this.userPermissions = response.data.permissions || [];
      } catch (error) {
        console.error('Error cargando permisos:', error);
        this.userPermissions = [];
      }
    },

    async cargarSolicitudes() {
      try {
        const response = await axios.get('/api/vacaciones');
        this.solicitudes = response.data;
      } catch (error) {
        console.error('Error cargando solicitudes:', error);
      }
    },

    filtrarEstado(estado) {
      this.filtroEstado = estado;
    },

    async crearSolicitud() {
      try {
        const response = await axios.post('/vacaciones/crear', this.formulario);
        
        this.$swal.fire({
          icon: 'success',
          title: 'Creada',
          text: response.data.message || 'La solicitud ha sido creada correctamente',
          timer: 2000
        });

        this.cerrarModalCrear();
        await this.cargarSolicitudes();
      } catch (error) {
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Ocurrió un error al crear la solicitud'
        });
      }
    },

    async aprobarSolicitud(id) {
      const result = await this.$swal.fire({
        title: '¿Aprobar solicitud?',
        text: 'Se notificará al empleado sobre la aprobación',
        icon: 'question',
        input: 'textarea',
        inputPlaceholder: 'Observaciones (opcional)',
        showCancelButton: true,
        confirmButtonText: 'Sí, aprobar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#28a745'
      });

      if (result.isConfirmed) {
        try {
          const response = await axios.post(`/vacaciones/${id}/aprobar`, {
            observaciones: result.value || ''
          });

          this.$swal.fire({
            icon: 'success',
            title: 'Aprobada',
            text: response.data.message || 'La solicitud ha sido aprobada',
            timer: 2000
          });

          await this.cargarSolicitudes();
        } catch (error) {
          this.$swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Ocurrió un error al aprobar la solicitud'
          });
        }
      }
    },

    async rechazarSolicitud(id) {
      const result = await this.$swal.fire({
        title: '¿Rechazar solicitud?',
        input: 'textarea',
        inputLabel: 'Motivo del rechazo',
        inputPlaceholder: 'Escribe el motivo del rechazo...',
        inputValidator: (value) => {
          if (!value) {
            return 'Debe proporcionar un motivo para rechazar la solicitud';
          }
        },
        showCancelButton: true,
        confirmButtonText: 'Rechazar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545'
      });

      if (result.isConfirmed) {
        try {
          const response = await axios.post(`/vacaciones/${id}/rechazar`, {
            observaciones: result.value
          });

          this.$swal.fire({
            icon: 'success',
            title: 'Rechazada',
            text: response.data.message || 'La solicitud ha sido rechazada',
            timer: 2000
          });

          await this.cargarSolicitudes();
        } catch (error) {
          this.$swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Ocurrió un error al rechazar la solicitud'
          });
        }
      }
    },

    async cancelarSolicitud(id) {
      const result = await this.$swal.fire({
        title: '¿Cancelar solicitud?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No',
        confirmButtonColor: '#ffc107'
      });

      if (result.isConfirmed) {
        try {
          const response = await axios.post(`/vacaciones/${id}/cancelar`);

          this.$swal.fire({
            icon: 'success',
            title: 'Cancelada',
            text: response.data.message || 'La solicitud ha sido cancelada',
            timer: 2000
          });

          await this.cargarSolicitudes();
        } catch (error) {
          this.$swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Ocurrió un error al cancelar la solicitud'
          });
        }
      }
    },

    verDetalle(solicitud) {
      this.detalleModal = solicitud;
    },

    cerrarModalCrear() {
      this.mostrarModalCrear = false;
      this.formulario = { fecha_inicio: '', fecha_fin: '', motivo: '' };
    },

    esMiSolicitud(solicitud) {
      // Verificar si la solicitud pertenece al usuario actual
      // Esto requiere tener el empleado_id del usuario actual
      return solicitud.empleado?.user?.id === window.Laravel?.user?.id;
    },

    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      });
    },

    formatDateTime(datetime) {
      if (!datetime) return '';
      return new Date(datetime).toLocaleString('es-ES', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    estadoBadgeClass(estado) {
      const classes = {
        'pendiente': 'badge-warning',
        'aprobada': 'badge-success',
        'rechazada': 'badge-danger'
      };
      return classes[estado] || 'badge-secondary';
    },

    estadoIcon(estado) {
      const icons = {
        'pendiente': 'fas fa-clock',
        'aprobada': 'fas fa-check',
        'rechazada': 'fas fa-times'
      };
      return icons[estado] || 'fas fa-question';
    },

    estadoLabel(estado) {
      const labels = {
        'pendiente': 'Pendiente',
        'aprobada': 'Aprobada',
        'rechazada': 'Rechazada'
      };
      return labels[estado] || estado;
    }
  },
  async mounted() {
    await this.cargarPermisos();
    await this.cargarSolicitudes();
  }
};
</script>

<style scoped>
.modal.d-block {
  z-index: 1050;
}
.btn-group .btn {
  margin: 0;
}
</style>
