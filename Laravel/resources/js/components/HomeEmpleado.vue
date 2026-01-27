<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <h1 class="mb-4">
          <i class="fas fa-home mr-2"></i> Mi Dashboard
        </h1>
      </div>
    </div>

    <!-- Información Personal del Empleado -->
    <div class="row">
      <div class="col-md-4">
        <div class="card shadow-sm">
          <div class="card-body text-center">
            <div class="mb-3">
              <i class="fas fa-user-circle fa-5x text-primary"></i>
            </div>
            <h5>{{ empleado.nombre || 'Empleado' }}</h5>
            <p class="text-muted mb-2">{{ empleado.cargo || 'Sin cargo asignado' }}</p>
            <p class="text-muted small">{{ empleado.departamento || 'Sin departamento' }}</p>
          </div>
        </div>
      </div>

      <!-- Información de Contrato -->
      <div class="col-md-4">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0"><i class="fas fa-file-contract mr-2"></i> Mi Contrato</h5>
          </div>
          <div class="card-body">
            <p v-if="contrato">
              <strong>Tipo:</strong> {{ formatTipoContrato(contrato.tipo_contrato) }}<br>
              <strong>Estado:</strong> <span :class="getEstadoBadge(contrato.estado)">{{ contrato.estado }}</span><br>
              <strong>Desde:</strong> {{ formatFecha(contrato.fecha_inicio) }}<br>
              <strong>Hasta:</strong> {{ formatFecha(contrato.fecha_fin) || 'Vigente' }}
            </p>
            <p v-else class="text-muted">No hay contrato asignado</p>
          </div>
        </div>
      </div>

      <!-- Últimos Recibos -->
      <div class="col-md-4">
        <div class="card shadow-sm">
          <div class="card-header bg-success text-white">
            <h5 class="mb-0"><i class="fas fa-file-invoice-dollar mr-2"></i> Recibos</h5>
          </div>
          <div class="card-body">
            <p v-if="ultimoRecibo">
              <strong>Período:</strong> {{ ultimoRecibo.periodo }}<br>
              <strong>Salario:</strong> {{ formatMoneda(ultimoRecibo.salario_bruto) }}<br>
              <strong>Neto:</strong> {{ formatMoneda(ultimoRecibo.salario_neto) }}
            </p>
            <p v-else class="text-muted">No hay recibos disponibles</p>
            <router-link to="/perfil" class="btn btn-sm btn-success mt-2">
              <i class="fas fa-file-alt mr-1"></i> Ver Mis Recibos
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Acciones Rápidas -->
    <div class="row mt-4">
      <div class="col-12">
        <h5 class="mb-3">
          <i class="fas fa-lightning-bolt mr-2"></i> Acciones Rápidas
        </h5>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 col-lg-3 mb-3">
        <router-link to="/solicitar-vacaciones" class="btn btn-primary btn-block h-100 d-flex align-items-center justify-content-center" style="padding: 20px;">
          <div class="text-center">
            <i class="fas fa-calendar-alt fa-2x mb-2 d-block"></i>
            <span>Solicitar Vacaciones</span>
          </div>
        </router-link>
      </div>

      <div class="col-md-6 col-lg-3 mb-3">
        <router-link to="/solicitar-permisos" class="btn btn-info btn-block h-100 d-flex align-items-center justify-content-center" style="padding: 20px;">
          <div class="text-center">
            <i class="fas fa-clipboard-list fa-2x mb-2 d-block"></i>
            <span>Solicitar Permisos</span>
          </div>
        </router-link>
      </div>

      <div class="col-md-6 col-lg-3 mb-3">
        <a href="#" @click.prevent="irMisSolicitudes" class="btn btn-warning btn-block h-100 d-flex align-items-center justify-content-center" style="padding: 20px;">
          <div class="text-center">
            <i class="fas fa-list fa-2x mb-2 d-block"></i>
            <span>Mis Solicitudes</span>
          </div>
        </a>
      </div>

      <div class="col-md-6 col-lg-3 mb-3">
        <router-link to="/perfil" class="btn btn-secondary btn-block h-100 d-flex align-items-center justify-content-center" style="padding: 20px;">
          <div class="text-center">
            <i class="fas fa-user-circle fa-2x mb-2 d-block"></i>
            <span>Mi Perfil</span>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Notificaciones Recientes -->
    <div class="row mt-4" v-if="notificacionesRecientes.length > 0">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header bg-warning text-dark">
            <h5 class="mb-0"><i class="fas fa-bell mr-2"></i> Notificaciones Recientes</h5>
          </div>
          <div class="card-body">
            <div v-for="notif in notificacionesRecientes" :key="notif.id" class="mb-2 pb-2 border-bottom">
              <p class="mb-1">{{ notif.mensaje }}</p>
              <small class="text-muted">{{ formatFecha(notif.created_at) }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomeEmpleado',
  data() {
    return {
      empleado: {},
      contrato: null,
      ultimoRecibo: null,
      notificacionesRecientes: []
    };
  },
  mounted() {
    this.cargarDatos();
  },
  methods: {
    async cargarDatos() {
      try {
        // Cargar información del empleado
        const empleadoRes = await axios.get('/api/empleado-info');
        this.empleado = empleadoRes.data;

        // Cargar contrato
        const contratoRes = await axios.get('/api/mi-contrato');
        this.contrato = contratoRes.data;

        // Cargar último recibo
        const reciboRes = await axios.get('/api/ultimo-recibo');
        this.ultimoRecibo = reciboRes.data;

        // Cargar notificaciones
        const notifRes = await axios.get('/api/notificaciones-recientes');
        this.notificacionesRecientes = notifRes.data;
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    },
    formatTipoContrato(tipo) {
      const tipos = {
        'indefinido': 'Contrato Indefinido',
        'temporal': 'Contrato Temporal',
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
    },
    formatFecha(fecha) {
      if (!fecha) return '';
      return new Date(fecha).toLocaleDateString('es-ES');
    },
    formatMoneda(valor) {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
      }).format(valor || 0);
    },
    irMisSolicitudes() {
      this.$router.push({
        name: 'solicitar-vacaciones',
        params: { mostrarHistorial: true }
      });
    }
  }
};
</script>

<style scoped>
.btn-block {
  text-decoration: none;
  transition: transform 0.2s;
}

.btn-block:hover {
  transform: translateY(-5px);
  text-decoration: none;
}

.card {
  border: none;
  border-radius: 8px;
}

.card-header {
  border-radius: 8px 8px 0 0;
}
</style>
