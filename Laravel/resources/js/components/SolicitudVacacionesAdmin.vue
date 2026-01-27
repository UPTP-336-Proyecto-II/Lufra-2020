<template>
  <div class="container mt-4">
    <h2>Solicitudes de Vacaciones Pendientes</h2>

    <div v-if="solicitudes.length === 0" class="alert alert-info mt-4">
      No hay solicitudes pendientes.
    </div>

    <div v-else class="row mt-4">
      <div v-for="solicitud in solicitudes" :key="solicitud.id" class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header bg-light">
            <h5 class="mb-0">{{ solicitud.empleado?.nombre || 'Empleado desconocido' }}</h5>
            <small class="text-muted">{{ solicitud.empleado?.codigo || '' }}</small>
          </div>
          <div class="card-body">
            <p class="mb-2">
              <strong>Período:</strong> 
              {{ formatDate(solicitud.fecha_inicio) }} - {{ formatDate(solicitud.fecha_fin) }}
            </p>
            <p class="mb-2">
              <strong>Días solicitados:</strong> {{ solicitud.dias_solicitados }}
            </p>
            <p class="mb-2">
              <strong>Solicitado:</strong> {{ formatDateTime(solicitud.created_at) }}
            </p>
            <p v-if="solicitud.motivo" class="mb-3">
              <strong>Motivo:</strong>
              <br />
              <em>{{ solicitud.motivo }}</em>
            </p>

            <div class="form-group mb-3">
              <label for="observaciones" class="form-label">Observaciones</label>
              <textarea 
                :id="'obs-' + solicitud.id"
                v-model="solicitud.observaciones"
                class="form-control"
                rows="3"
                placeholder="Opcional: agrega observaciones"
                maxlength="500"
              ></textarea>
              <small class="text-muted">{{ (solicitud.observaciones || '').length }}/500</small>
            </div>

            <div class="d-grid gap-2 d-md-flex">
              <button
                @click="aprobarSolicitud(solicitud.id, solicitud)"
                class="btn btn-success"
                :disabled="cargando"
              >
                <span v-if="cargando && cargandoId === solicitud.id" class="spinner-border spinner-border-sm me-2"></span>
                Aprobar
              </button>
              <button
                @click="rechazarSolicitud(solicitud.id, solicitud)"
                class="btn btn-danger"
                :disabled="cargando"
              >
                <span v-if="cargando && cargandoId === solicitud.id" class="spinner-border spinner-border-sm me-2"></span>
                Rechazar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SolicitudVacacionesAdmin',
  data() {
    return {
      solicitudes: [],
      cargando: false,
      cargandoId: null
    };
  },
  methods: {
    async cargarSolicitudes() {
      try {
        const response = await axios.get('/vacaciones/pendientes', {
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });
        this.solicitudes = response.data;
      } catch (error) {
        console.error('Error al cargar solicitudes:', error);
        this.$toast.fire({ icon: 'error', title: 'Error al cargar solicitudes' });
      }
    },

    async aprobarSolicitud(id, solicitud) {
      const result = await this.$swal.fire({
        title: '¿Aprobar solicitud?',
        html: `<p>Empleado: <strong>${solicitud.empleado?.nombre}</strong></p>
               <p>Período: ${this.formatDate(solicitud.fecha_inicio)} - ${this.formatDate(solicitud.fecha_fin)}</p>
               <p>Días: ${solicitud.dias_solicitados}</p>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, aprobar',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) return;

      this.cargando = true;
      this.cargandoId = id;

      try {
        const response = await axios.post(`/vacaciones/${id}/aprobar`, {
          observaciones: solicitud.observaciones || null
        }, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });

        this.$toast.fire({ icon: 'success', title: response.data.message });
        this.solicitudes = this.solicitudes.filter(s => s.id !== id);
      } catch (error) {
        const mensaje = error.response?.data?.message || 'Error al aprobar solicitud';
        this.$toast.fire({ icon: 'error', title: mensaje });
      } finally {
        this.cargando = false;
        this.cargandoId = null;
      }
    },

    async rechazarSolicitud(id, solicitud) {
      const result = await this.$swal.fire({
        title: '¿Rechazar solicitud?',
        html: `<p>Empleado: <strong>${solicitud.empleado?.nombre}</strong></p>
               <p>Las observaciones son obligatorias para rechazar.</p>`,
        input: 'textarea',
        inputValue: solicitud.observaciones || '',
        inputPlaceholder: 'Motivo del rechazo...',
        inputAttributes: {
          maxlength: '500'
        },
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, rechazar',
        cancelButtonText: 'Cancelar',
        didOpen: () => {
          const textarea = result.getInput();
          if (textarea) {
            textarea.focus();
          }
        }
      });

      if (!result.isConfirmed || !result.value?.trim()) {
        if (result.isConfirmed) {
          this.$toast.fire({ icon: 'warning', title: 'Debe proporcionar un motivo' });
        }
        return;
      }

      this.cargando = true;
      this.cargandoId = id;

      try {
        const response = await axios.post(`/vacaciones/${id}/rechazar`, {
          observaciones: result.value
        }, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });

        this.$toast.fire({ icon: 'success', title: response.data.message });
        this.solicitudes = this.solicitudes.filter(s => s.id !== id);
      } catch (error) {
        const mensaje = error.response?.data?.message || 'Error al rechazar solicitud';
        this.$toast.fire({ icon: 'error', title: mensaje });
      } finally {
        this.cargando = false;
        this.cargandoId = null;
      }
    },

    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    formatDateTime(datetime) {
      if (!datetime) return '';
      return new Date(datetime).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },
  mounted() {
    this.cargarSolicitudes();
  }
};
</script>

<style scoped>
.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
