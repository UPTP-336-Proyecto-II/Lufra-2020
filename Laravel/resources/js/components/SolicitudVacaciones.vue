<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-8">
        <h2>Solicitar Vacaciones</h2>
        
        <!-- Formulario de solicitud -->
        <div class="card mb-4">
          <div class="card-body">
            <form @submit.prevent="crearSolicitud">
              <div class="form-group mb-3">
                <label for="fechaInicio" class="form-label">Fecha de Inicio</label>
                <input 
                  type="date" 
                  id="fechaInicio" 
                  v-model="form.fecha_inicio"
                  class="form-control"
                  :min="today"
                  required
                />
              </div>

              <div class="form-group mb-3">
                <label for="fechaFin" class="form-label">Fecha de Fin</label>
                <input 
                  type="date" 
                  id="fechaFin" 
                  v-model="form.fecha_fin"
                  class="form-control"
                  :min="form.fecha_inicio || today"
                  required
                />
              </div>

              <div class="form-group mb-3">
                <label for="diasSolicitados" class="form-label">Días Solicitados</label>
                <input 
                  type="number" 
                  id="diasSolicitados" 
                  v-model="diasCalculados"
                  class="form-control"
                  disabled
                />
                <small class="text-muted">Se calcula automáticamente</small>
              </div>

              <div class="form-group mb-3">
                <label for="motivo" class="form-label">Motivo (Opcional)</label>
                <textarea 
                  id="motivo" 
                  v-model="form.motivo"
                  class="form-control"
                  rows="3"
                  placeholder="Describe el motivo de tu solicitud..."
                  maxlength="500"
                ></textarea>
                <small class="text-muted">{{ form.motivo.length }}/500 caracteres</small>
              </div>

              <button type="submit" class="btn btn-primary" :disabled="cargando">
                <span v-if="cargando" class="spinner-border spinner-border-sm me-2"></span>
                {{ cargando ? 'Creando solicitud...' : 'Solicitar Vacaciones' }}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <h5>Información</h5>
        <div class="alert alert-info">
          <small>
            <strong>Nota:</strong> Las solicitudes deben ser para fechas futuras. 
            Recibirás una notificación cuando RR.HH. apruebe o rechace tu solicitud.
          </small>
        </div>
      </div>
    </div>

    <!-- Mis solicitudes -->
    <div class="card mt-4">
      <div class="card-header bg-light">
        <h5 class="mb-0">Mis Solicitudes de Vacaciones</h5>
      </div>
      <div class="card-body">
        <div v-if="solicitudes.length === 0" class="alert alert-secondary">
          No tienes solicitudes registradas.
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead class="table-light">
              <tr>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Días</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="solicitud in solicitudes" :key="solicitud.id">
                <td>{{ formatDate(solicitud.fecha_inicio) }}</td>
                <td>{{ formatDate(solicitud.fecha_fin) }}</td>
                <td>{{ solicitud.dias_solicitados }}</td>
                <td>
                  <span 
                    :class="[
                      'badge',
                      solicitud.estado === 'aprobada' ? 'bg-success' :
                      solicitud.estado === 'rechazada' ? 'bg-danger' :
                      'bg-warning'
                    ]"
                  >
                    {{ solicitud.estado }}
                  </span>
                </td>
                <td>
                  <button 
                    v-if="solicitud.estado === 'pendiente'"
                    @click="cancelarSolicitud(solicitud.id)"
                    class="btn btn-sm btn-outline-danger"
                  >
                    Cancelar
                  </button>
                  <button
                    v-else
                    @click="verDetalles(solicitud)"
                    class="btn btn-sm btn-outline-info"
                  >
                    Detalles
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SolicitudVacaciones',
  data() {
    return {
      form: {
        fecha_inicio: '',
        fecha_fin: '',
        motivo: ''
      },
      solicitudes: [],
      cargando: false,
      today: new Date().toISOString().split('T')[0]
    };
  },
  computed: {
    diasCalculados() {
      if (!this.form.fecha_inicio || !this.form.fecha_fin) return 0;
      const inicio = new Date(this.form.fecha_inicio);
      const fin = new Date(this.form.fecha_fin);
      const diferencia = fin - inicio;
      return Math.floor(diferencia / (1000 * 60 * 60 * 24)) + 1;
    }
  },
  methods: {
    async crearSolicitud() {
      if (this.diasCalculados <= 0) {
        this.$toast.fire({ icon: 'error', title: 'Las fechas no son válidas' });
        return;
      }

      this.cargando = true;
      try {
        const response = await axios.post('/vacaciones/crear', {
          fecha_inicio: this.form.fecha_inicio,
          fecha_fin: this.form.fecha_fin,
          motivo: this.form.motivo || null
        }, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          }
        });

        this.$toast.fire({
          icon: 'success',
          title: response.data.message
        });

        // Limpiar formulario
        this.form = {
          fecha_inicio: '',
          fecha_fin: '',
          motivo: ''
        };

        // Recargar solicitudes
        await this.cargarSolicitudes();
      } catch (error) {
        const mensaje = error.response?.data?.message || 'Error al crear solicitud';
        this.$toast.fire({ icon: 'error', title: mensaje });
      } finally {
        this.cargando = false;
      }
    },

    async cargarSolicitudes() {
      try {
        const response = await axios.get('/vacaciones/mis-solicitudes', {
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });
        this.solicitudes = response.data;
      } catch (error) {
        console.error('Error al cargar solicitudes:', error);
      }
    },

    async cancelarSolicitud(id) {
      const result = await this.$swal.fire({
        title: '¿Cancelar solicitud?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No'
      });

      if (!result.isConfirmed) return;

      try {
        const response = await axios.post(`/vacaciones/${id}/cancelar`, {}, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });

        this.$toast.fire({ icon: 'success', title: response.data.message });
        this.solicitudes = this.solicitudes.filter(s => s.id !== id);
      } catch (error) {
        const mensaje = error.response?.data?.message || 'Error al cancelar solicitud';
        this.$toast.fire({ icon: 'error', title: mensaje });
      }
    },

    verDetalles(solicitud) {
      this.$swal.fire({
        title: 'Detalles de la Solicitud',
        html: `
          <div class="text-start">
            <p><strong>Inicio:</strong> ${this.formatDate(solicitud.fecha_inicio)}</p>
            <p><strong>Fin:</strong> ${this.formatDate(solicitud.fecha_fin)}</p>
            <p><strong>Días:</strong> ${solicitud.dias_solicitados}</p>
            <p><strong>Estado:</strong> ${solicitud.estado}</p>
            ${solicitud.motivo ? `<p><strong>Motivo:</strong> ${solicitud.motivo}</p>` : ''}
            ${solicitud.observaciones ? `<p><strong>Observaciones:</strong> ${solicitud.observaciones}</p>` : ''}
          </div>
        `,
        icon: 'info'
      });
    },

    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  },
  mounted() {
    this.cargarSolicitudes();
  }
};
</script>

<style scoped>
.badge {
  font-size: 0.9rem;
  padding: 0.5rem 0.75rem;
}

.table-hover tbody tr:hover {
  background-color: #f5f5f5;
}
</style>
