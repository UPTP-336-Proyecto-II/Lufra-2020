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
          <button type="button" class="btn" :class="filtroEstado === 'todas' ? 'btn-primary' : 'btn-outline-primary'" @click="filtroEstado = 'todas'">
            <i class="fas fa-list"></i> Todas
          </button>
          <button type="button" class="btn" :class="filtroEstado === 'pendiente' ? 'btn-warning' : 'btn-outline-warning'" @click="filtroEstado = 'pendiente'">
            <i class="fas fa-clock"></i> Pendientes
          </button>
          <button type="button" class="btn" :class="filtroEstado === 'aprobada' ? 'btn-success' : 'btn-outline-success'" @click="filtroEstado = 'aprobada'">
            <i class="fas fa-check-circle"></i> Aprobadas
          </button>
          <button type="button" class="btn" :class="filtroEstado === 'rechazada' ? 'btn-danger' : 'btn-outline-danger'" @click="filtroEstado = 'rechazada'">
            <i class="fas fa-times-circle"></i> Rechazadas
          </button>
        </div>
      </div>
      <div class="col-md-6 text-right">
        <button type="button" class="btn btn-success" @click="abrirModalCrear">
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
            <div v-if="mensaje" class="alert" :class="'alert-' + mensajeTipo" role="alert">
              <i class="fas" :class="mensajeTipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'"></i>
              {{ mensaje }}
            </div>

            <div v-if="cargando" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Cargando...</span>
              </div>
            </div>

            <div v-else class="table-responsive">
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
                      <strong v-if="solicitud.empleado && solicitud.empleado.user">
                        {{ solicitud.empleado.user.name }}
                      </strong>
                      <span v-else class="text-muted">Sin empleado</span>
                      <br>
                      <small class="text-muted" v-if="solicitud.empleado && solicitud.empleado.user">
                        {{ solicitud.empleado.user.email }}
                      </small>
                    </td>
                    <td>
                      <span class="badge" :class="solicitud.tipo === 'vacaciones' ? 'badge-info' : 'badge-warning'">
                        {{ solicitud.tipo ? solicitud.tipo.charAt(0).toUpperCase() + solicitud.tipo.slice(1) : 'Vacaciones' }}
                      </span>
                    </td>
                    <td>{{ formatearFecha(solicitud.fecha_inicio) }}</td>
                    <td>{{ formatearFecha(solicitud.fecha_fin) }}</td>
                    <td>
                      <span class="badge badge-secondary">
                        {{ solicitud.dias_solicitados || calcularDias(solicitud.fecha_inicio, solicitud.fecha_fin) }} días
                      </span>
                    </td>
                    <td>
                      <span class="badge" :class="getBadgeEstado(solicitud.estado)">
                        <i class="fas" :class="getIconoEstado(solicitud.estado)"></i>
                        {{ solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1) }}
                      </span>
                    </td>
                    <td>
                      <small>{{ formatearFechaHora(solicitud.created_at) }}</small>
                    </td>
                    <td>
                      <div v-if="solicitud.aprobador">
                        <small>{{ solicitud.aprobador.name }}</small>
                        <br>
                        <small class="text-muted" v-if="solicitud.fecha_aprobacion">
                          {{ formatearFecha(solicitud.fecha_aprobacion) }}
                        </small>
                      </div>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <div class="btn-group" role="group">
                        <button type="button" class="btn btn-sm btn-info" @click="verDetalle(solicitud)">
                          <i class="fas fa-eye"></i>
                        </button>
                        
                        <template v-if="solicitud.estado === 'pendiente'">
                          <button type="button" class="btn btn-sm btn-success" @click="aprobarSolicitud(solicitud.id)">
                            <i class="fas fa-check"></i>
                          </button>
                          <button type="button" class="btn btn-sm btn-danger" @click="rechazarSolicitud(solicitud.id)">
                            <i class="fas fa-times"></i>
                          </button>
                          <button type="button" class="btn btn-sm btn-warning" @click="cancelarSolicitud(solicitud.id)">
                            <i class="fas fa-ban"></i>
                          </button>
                        </template>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="solicitudesFiltradas.length === 0">
                    <td colspan="10" class="text-center">
                      <div class="alert alert-info mb-0">
                        <i class="fas fa-info-circle mr-2"></i> No hay solicitudes de vacaciones registradas.
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
    <div class="modal fade" id="modalCrear" tabindex="-1" ref="modalCrear">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title"><i class="fas fa-plus mr-2"></i> Nueva Solicitud de Vacaciones</h5>
            <button type="button" class="close text-white" data-dismiss="modal">&times;</button>
          </div>
          <form @submit.prevent="crearSolicitud">
            <div class="modal-body">
              <div class="form-group">
                <label for="fecha_inicio">Fecha Inicio <span class="text-danger">*</span></label>
                <input type="date" class="form-control" v-model="nuevaSolicitud.fecha_inicio" required :min="fechaHoy">
              </div>
              <div class="form-group">
                <label for="fecha_fin">Fecha Fin <span class="text-danger">*</span></label>
                <input type="date" class="form-control" v-model="nuevaSolicitud.fecha_fin" required :min="nuevaSolicitud.fecha_inicio || fechaHoy">
              </div>
              <div class="form-group">
                <label for="motivo">Motivo</label>
                <textarea class="form-control" v-model="nuevaSolicitud.motivo" rows="3" placeholder="Opcional: Describe el motivo de tu solicitud"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-success" :disabled="enviando">
                <i class="fas fa-save"></i> Crear Solicitud
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Detalle -->
    <div class="modal fade" id="modalDetalle" tabindex="-1" ref="modalDetalle">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title"><i class="fas fa-info-circle mr-2"></i> Detalle de Solicitud</h5>
            <button type="button" class="close text-white" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body" v-if="solicitudSeleccionada">
            <div class="form-group">
              <label><strong>Empleado:</strong></label>
              <p>{{ solicitudSeleccionada.empleado?.user?.name || 'Sin nombre' }}</p>
            </div>
            <div class="form-group">
              <label><strong>Período:</strong></label>
              <p>Del {{ formatearFecha(solicitudSeleccionada.fecha_inicio) }} al {{ formatearFecha(solicitudSeleccionada.fecha_fin) }}</p>
            </div>
            <div class="form-group">
              <label><strong>Motivo:</strong></label>
              <p>{{ solicitudSeleccionada.motivo || 'Sin motivo especificado' }}</p>
            </div>
            <div class="form-group">
              <label><strong>Estado:</strong></label>
              <p>
                <span class="badge" :class="getBadgeEstado(solicitudSeleccionada.estado)">
                  {{ solicitudSeleccionada.estado.charAt(0).toUpperCase() + solicitudSeleccionada.estado.slice(1) }}
                </span>
              </p>
            </div>
            <div class="form-group" v-if="solicitudSeleccionada.observaciones">
              <label><strong>Observaciones:</strong></label>
              <p>{{ solicitudSeleccionada.observaciones }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GestionVacaciones',
  data() {
    return {
      solicitudes: [],
      filtroEstado: 'todas',
      cargando: false,
      mensaje: '',
      mensajeTipo: 'success',
      nuevaSolicitud: {
        fecha_inicio: '',
        fecha_fin: '',
        motivo: ''
      },
      solicitudSeleccionada: null,
      enviando: false,
      fechaHoy: new Date().toISOString().split('T')[0]
    };
  },
  computed: {
    solicitudesFiltradas() {
      if (this.filtroEstado === 'todas') {
        return this.solicitudes;
      }
      return this.solicitudes.filter(s => s.estado === this.filtroEstado);
    }
  },
  mounted() {
    this.cargarSolicitudes();
  },
  methods: {
    async cargarSolicitudes() {
      this.cargando = true;
      try {
        const response = await fetch('/api/vacaciones', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) throw new Error('Error al cargar solicitudes');
        
        this.solicitudes = await response.json();
      } catch (error) {
        console.error('Error:', error);
        this.mostrarMensaje('Error al cargar las solicitudes', 'danger');
      } finally {
        this.cargando = false;
      }
    },
    
    abrirModalCrear() {
      this.nuevaSolicitud = {
        fecha_inicio: '',
        fecha_fin: '',
        motivo: ''
      };
      $(this.$refs.modalCrear).modal('show');
    },
    
    async crearSolicitud() {
      this.enviando = true;
      try {
        const response = await fetch('/api/vacaciones/crear', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
          },
          body: JSON.stringify(this.nuevaSolicitud)
        });
        
        const data = await response.json();
        
        if (data.success || data.message) {
          $(this.$refs.modalCrear).modal('hide');
          this.mostrarMensaje(data.message || 'Solicitud creada correctamente', 'success');
          await this.cargarSolicitudes();
        } else {
          throw new Error(data.error || 'Error al crear la solicitud');
        }
      } catch (error) {
        console.error('Error:', error);
        this.mostrarMensaje(error.message || 'Error al crear la solicitud', 'danger');
      } finally {
        this.enviando = false;
      }
    },
    
    async aprobarSolicitud(id) {
      const { value: observaciones } = await this.$swal({
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
      
      if (observaciones !== undefined) {
        try {
          const response = await fetch(`/api/vacaciones/${id}/aprobar`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({ observaciones: observaciones || '' })
          });
          
          const data = await response.json();
          
          if (data.success || data.message) {
            this.mostrarMensaje(data.message || 'Solicitud aprobada correctamente', 'success');
            await this.cargarSolicitudes();
          } else {
            throw new Error(data.error || 'Error al aprobar');
          }
        } catch (error) {
          console.error('Error:', error);
          this.mostrarMensaje(error.message || 'Error al aprobar la solicitud', 'danger');
        }
      }
    },
    
    async rechazarSolicitud(id) {
      const { value: observaciones } = await this.$swal({
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
      
      if (observaciones) {
        try {
          const response = await fetch(`/api/vacaciones/${id}/rechazar`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({ observaciones })
          });
          
          const data = await response.json();
          
          if (data.success || data.message) {
            this.mostrarMensaje(data.message || 'Solicitud rechazada correctamente', 'success');
            await this.cargarSolicitudes();
          } else {
            throw new Error(data.error || 'Error al rechazar');
          }
        } catch (error) {
          console.error('Error:', error);
          this.mostrarMensaje(error.message || 'Error al rechazar la solicitud', 'danger');
        }
      }
    },
    
    async cancelarSolicitud(id) {
      const result = await this.$swal({
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
          const response = await fetch(`/api/vacaciones/${id}/cancelar`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            }
          });
          
          const data = await response.json();
          
          if (data.success || data.message) {
            this.mostrarMensaje(data.message || 'Solicitud cancelada correctamente', 'success');
            await this.cargarSolicitudes();
          } else {
            throw new Error(data.error || 'Error al cancelar');
          }
        } catch (error) {
          console.error('Error:', error);
          this.mostrarMensaje(error.message || 'Error al cancelar la solicitud', 'danger');
        }
      }
    },
    
    verDetalle(solicitud) {
      this.solicitudSeleccionada = solicitud;
      $(this.$refs.modalDetalle).modal('show');
    },
    
    mostrarMensaje(texto, tipo) {
      this.mensaje = texto;
      this.mensajeTipo = tipo;
      setTimeout(() => {
        this.mensaje = '';
      }, 5000);
    },
    
    formatearFecha(fecha) {
      if (!fecha) return '';
      const d = new Date(fecha);
      const dia = String(d.getDate()).padStart(2, '0');
      const mes = String(d.getMonth() + 1).padStart(2, '0');
      const anio = d.getFullYear();
      return `${dia}/${mes}/${anio}`;
    },
    
    formatearFechaHora(fecha) {
      if (!fecha) return '';
      const d = new Date(fecha);
      const dia = String(d.getDate()).padStart(2, '0');
      const mes = String(d.getMonth() + 1).padStart(2, '0');
      const anio = d.getFullYear();
      const hora = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      return `${dia}/${mes}/${anio} ${hora}:${min}`;
    },
    
    calcularDias(inicio, fin) {
      if (!inicio || !fin) return 0;
      const d1 = new Date(inicio);
      const d2 = new Date(fin);
      const diff = Math.abs(d2 - d1);
      return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    },
    
    getBadgeEstado(estado) {
      const badges = {
        'pendiente': 'badge-warning',
        'aprobada': 'badge-success',
        'rechazada': 'badge-danger'
      };
      return badges[estado] || 'badge-secondary';
    },
    
    getIconoEstado(estado) {
      const iconos = {
        'pendiente': 'fa-clock',
        'aprobada': 'fa-check',
        'rechazada': 'fa-times'
      };
      return iconos[estado] || 'fa-question';
    }
  }
};
</script>
