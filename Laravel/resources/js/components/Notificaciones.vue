<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><i class="fas fa-bell mr-1"></i> Notificaciones</h3>
          </div>
          <div class="card-body">
            <div v-if="cargando" class="text-center">
              <div class="spinner-border" role="status">
                <span class="sr-only">Cargando...</span>
              </div>
            </div>
            <div v-else-if="notificaciones && notificaciones.length">
              <div v-for="notif in notificaciones" :key="notif.id" class="alert alert-info" role="alert">
                <strong>{{ notif.title }}</strong>
                <p>{{ notif.message }}</p>
                <small class="text-muted">{{ formatFecha(notif.created_at) }}</small>
              </div>
            </div>
            <div v-else class="alert alert-secondary">
              No hay notificaciones
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Notificaciones',
  data() {
    return {
      notificaciones: [],
      cargando: false
    }
  },
  mounted() {
    this.cargarNotificaciones();
  },
  methods: {
    async cargarNotificaciones() {
      this.cargando = true;
      try {
        const response = await axios.get('/notifications/all');
        this.notificaciones = response.data;
      } catch (error) {
        this.$toast.fire({ icon: 'error', title: 'Error al cargar notificaciones' });
      } finally {
        this.cargando = false;
      }
    },
    formatFecha(fecha) {
      if (!fecha) return '-';
      const d = new Date(fecha);
      return d.toLocaleDateString('es-ES');
    }
  }
}
</script>
