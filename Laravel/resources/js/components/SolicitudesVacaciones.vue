<template>
  <div class="container-fluid mt-4">
    <div class="card shadow-sm border-0">
      <div class="card-header bg-danger text-white">
        <h5 class="mb-0">
          <i class="fas fa-inbox me-2"></i>Solicitudes de Vacaciones Pendientes
        </h5>
      </div>
      <div class="card-body">
        <div v-if="cargando" class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>

        <div v-else-if="solicitudes.length === 0" class="alert alert-info">
          <i class="fas fa-check-circle me-2"></i>No hay solicitudes pendientes de aprobación.
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead class="table-light">
              <tr>
                <th>Empleado</th>
                <th>Período</th>
                <th>Días</th>
                <th>Motivo</th>
                <th>Solicitado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="solicitud in solicitudes" :key="solicitud.id">
                <td><strong>{{ solicitud.empleado?.numero_empleado }} - {{ solicitud.empleado?.nombre }}</strong></td>
                <td>
                  {{ formatDate(solicitud.fecha_inicio) }} a 
                  {{ formatDate(solicitud.fecha_fin) }}
                </td>
                <td><span class="badge bg-primary">{{ solicitud.dias_solicitados }}</span></td>
                <td>{{ solicitud.motivo || '-' }}</td>
                <td>{{ formatDate(solicitud.created_at) }}</td>
                <td>
                  <button 
                    @click="abrirAprobacion(solicitud)"
                    class="btn btn-sm btn-outline-success me-2"
                    title="Aprobar"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  <button 
                    @click="abrirRechazo(solicitud)"
                    class="btn btn-sm btn-outline-danger"
                    title="Rechazar"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal para aprobar -->
    <div v-if="modalAprobacion" class="modal d-block" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">Aprobar Solicitud de Vacaciones</h5>
            <button type="button" class="btn-close btn-close-white" @click="modalAprobacion = null"></button>
          </div>
          <div class="modal-body">
            <div v-if="solicitudSeleccionada">
              <p><strong>Empleado:</strong> {{ solicitudSeleccionada.empleado?.nombre }}</p>
              <p><strong>Período:</strong> {{ formatDate(solicitudSeleccionada.fecha_inicio) }} a {{ formatDate(solicitudSeleccionada.fecha_fin) }}</p>
              <p><strong>Días:</strong> {{ solicitudSeleccionada.dias_solicitados }}</p>
              <div class="mb-3">
                <label class="form-label">Observaciones (opcional)</label>
                <textarea 
                  class="form-control" 
                  rows="2"
                  v-model="observaciones"
                  placeholder="Ej: Aprobado hasta el 20/01/2026"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="modalAprobacion = null">Cancelar</button>
            <button 
              type="button" 
              class="btn btn-success"
              @click="confirmarAprobacion"
              :disabled="procesando"
            >
              <span v-if="procesando">
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Aprobando...
              </span>
              <span v-else>Aprobar</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para rechazar -->
    <div v-if="modalRechazo" class="modal d-block" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">Rechazar Solicitud de Vacaciones</h5>
            <button type="button" class="btn-close btn-close-white" @click="modalRechazo = null"></button>
          </div>
          <div class="modal-body">
            <div v-if="solicitudSeleccionada">
              <p><strong>Empleado:</strong> {{ solicitudSeleccionada.empleado?.nombre }}</p>
              <p><strong>Período:</strong> {{ formatDate(solicitudSeleccionada.fecha_inicio) }} a {{ formatDate(solicitudSeleccionada.fecha_fin) }}</p>
              <p><strong>Días:</strong> {{ solicitudSeleccionada.dias_solicitados }}</p>
              <div class="mb-3">
                <label class="form-label">Razón del Rechazo <span class="text-danger">*</span></label>
                <textarea 
                  class="form-control" 
                  rows="3"
                  v-model="observaciones"
                  placeholder="Explica brevemente por qué se rechaza la solicitud"
                  required
                ></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="modalRechazo = null">Cancelar</button>
            <button 
              type="button" 
              class="btn btn-danger"
              @click="confirmarRechazo"
              :disabled="procesando || !observaciones"
            >
              <span v-if="procesando">
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Rechazando...
              </span>
              <span v-else>Rechazar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SolicitudesVacaciones',
  data() {
    return {
      solicitudes: [],
      cargando: false,
      procesando: false,
      modalAprobacion: false,
      modalRechazo: false,
      solicitudSeleccionada: null,
      observaciones: ''
    };
  },
  methods: {
    async cargarSolicitudes() {
      this.cargando = true;
      try {
        const response = await axios.get('/vacaciones/pendientes');
        this.solicitudes = response.data;
      } catch (error) {
        this.$toast.fire({
          icon: 'error',
          title: 'Error al cargar solicitudes'
        });
      } finally {
        this.cargando = false;
      }
    },

    abrirAprobacion(solicitud) {
      this.solicitudSeleccionada = solicitud;
      this.observaciones = '';
      this.modalAprobacion = true;
    },

    abrirRechazo(solicitud) {
      this.solicitudSeleccionada = solicitud;
      this.observaciones = '';
      this.modalRechazo = true;
    },

    async confirmarAprobacion() {
      if (!this.solicitudSeleccionada) return;

      this.procesando = true;
      try {
        await axios.post(`/vacaciones/${this.solicitudSeleccionada.id}/aprobar`, {
          observaciones: this.observaciones
        }, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });

        this.$toast.fire({
          icon: 'success',
          title: 'Solicitud aprobada'
        });

        // Remover de la lista
        this.solicitudes = this.solicitudes.filter(s => s.id !== this.solicitudSeleccionada.id);
        this.modalAprobacion = false;
        this.solicitudSeleccionada = null;
      } catch (error) {
        this.$toast.fire({
          icon: 'error',
          title: 'Error al aprobar solicitud'
        });
      } finally {
        this.procesando = false;
      }
    },

    async confirmarRechazo() {
      if (!this.solicitudSeleccionada || !this.observaciones) return;

      this.procesando = true;
      try {
        await axios.post(`/vacaciones/${this.solicitudSeleccionada.id}/rechazar`, {
          observaciones: this.observaciones
        }, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });

        this.$toast.fire({
          icon: 'success',
          title: 'Solicitud rechazada'
        });

        // Remover de la lista
        this.solicitudes = this.solicitudes.filter(s => s.id !== this.solicitudSeleccionada.id);
        this.modalRechazo = false;
        this.solicitudSeleccionada = null;
      } catch (error) {
        this.$toast.fire({
          icon: 'error',
          title: 'Error al rechazar solicitud'
        });
      } finally {
        this.procesando = false;
      }
    },

    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
    }
  },
  mounted() {
    this.cargarSolicitudes();
  }
};
</script>

<style scoped>
.modal.d-block {
  z-index: 1050;
}
</style>
