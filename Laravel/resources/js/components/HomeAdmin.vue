<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <h1 class="mb-4">
          <i class="fas fa-dashboard mr-2"></i> Dashboard Administrativo
        </h1>
      </div>
    </div>

    <!-- Tarjetas de Estadísticas -->
    <div class="row">
      <div class="col-lg-2 col-6">
        <div class="small-box bg-info">
          <div class="inner">
            <h3>{{ empleados }}</h3>
            <p>Empleados Activos</p>
          </div>
          <div class="icon"><i class="fas fa-users"></i></div>
          <router-link to="/empleados" class="small-box-footer">Más info <i class="fas fa-arrow-circle-right"></i></router-link>
        </div>
      </div>

      <div class="col-lg-2 col-6">
        <div class="small-box bg-success">
          <div class="inner">
            <h3>{{ departamentos }}</h3>
            <p>Departamentos</p>
          </div>
          <div class="icon"><i class="fas fa-sitemap"></i></div>
          <router-link to="/departamentos" class="small-box-footer">Más info <i class="fas fa-arrow-circle-right"></i></router-link>
        </div>
      </div>

      <div class="col-lg-2 col-6">
        <div class="small-box bg-warning">
          <div class="inner text-dark">
            <h3>{{ contratos }}</h3>
            <p>Contratos</p>
          </div>
          <div class="icon"><i class="fas fa-file-signature"></i></div>
          <router-link to="/contratos" class="small-box-footer">Más info <i class="fas fa-arrow-circle-right"></i></router-link>
        </div>
      </div>

      <div class="col-lg-2 col-6">
        <div class="small-box bg-primary">
          <div class="inner">
            <h3>{{ periodos }}</h3>
            <p>Periodos de Nómina</p>
          </div>
          <div class="icon"><i class="fas fa-calendar-alt"></i></div>
          <router-link to="/nominas" class="small-box-footer">Más info <i class="fas fa-arrow-circle-right"></i></router-link>
        </div>
      </div>

      <div class="col-lg-2 col-6">
        <div class="small-box bg-danger">
          <div class="inner">
            <h3>{{ recibos }}</h3>
            <p>Recibos Emitidos</p>
          </div>
          <div class="icon"><i class="fas fa-file-invoice-dollar"></i></div>
          <router-link to="/perfil" class="small-box-footer">Más info <i class="fas fa-arrow-circle-right"></i></router-link>
        </div>
      </div>

      <div class="col-lg-2 col-6">
        <div class="small-box bg-secondary">
          <div class="inner">
            <h3>{{ pagos }}</h3>
            <p>Pagos Procesados</p>
          </div>
          <div class="icon"><i class="fas fa-money-check-alt"></i></div>
          <a href="#" class="small-box-footer">Más info <i class="fas fa-arrow-circle-right"></i></a>
        </div>
      </div>
    </div>

    <!-- Resumen del último período -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h3 class="card-title mb-0"><i class="fas fa-tachometer-alt mr-2"></i> Resumen del Último Período</h3>
          </div>
          <div class="card-body">
            <div v-if="ultimoPeriodo">
              <div class="row">
                <div class="col-md-4">
                  <p><strong>Código:</strong> {{ ultimoPeriodo.codigo }}</p>
                  <p><strong>Período:</strong> {{ formatFecha(ultimoPeriodo.fecha_inicio) }} a {{ formatFecha(ultimoPeriodo.fecha_fin) }}</p>
                </div>
                <div class="col-md-4">
                  <p><strong>Estado:</strong> <span :class="getEstadoBadge(ultimoPeriodo.estado)">{{ ultimoPeriodo.estado }}</span></p>
                  <p><strong>Total Nómina:</strong> {{ formatMoneda(ultimoPeriodo.total_neto || 0) }}</p>
                </div>
                <div class="col-md-4">
                  <button @click="verDetalles(ultimoPeriodo.id)" class="btn btn-primary">
                    <i class="fas fa-eye mr-2"></i> Ver Detalles
                  </button>
                </div>
              </div>
            </div>
            <p v-else class="text-muted">No hay períodos de nómina registrados</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Actividades Recientes -->
    <div class="row mt-4">
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-header bg-info text-white">
            <h5 class="card-title mb-0"><i class="fas fa-history mr-2"></i> Actividades Recientes</h5>
          </div>
          <div class="card-body">
            <div v-for="actividad in actividadesRecientes" :key="actividad.id" class="mb-3 pb-3 border-bottom">
              <p class="mb-1">
                <strong>{{ actividad.tipo }}</strong>: {{ actividad.descripcion }}
              </p>
              <small class="text-muted">{{ formatFecha(actividad.created_at) }}</small>
            </div>
            <p v-if="actividadesRecientes.length === 0" class="text-muted">No hay actividades recientes</p>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-header bg-warning text-dark">
            <h5 class="card-title mb-0"><i class="fas fa-bell mr-2"></i> Notificaciones</h5>
          </div>
          <div class="card-body">
            <div v-for="notif in notificaciones" :key="notif.id" class="mb-3 pb-3 border-bottom">
              <p class="mb-1">{{ notif.mensaje }}</p>
              <small class="text-muted">{{ formatFecha(notif.created_at) }}</small>
            </div>
            <p v-if="notificaciones.length === 0" class="text-muted">No hay notificaciones</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Acciones Rápidas -->
    <div class="row mt-4">
      <div class="col-12">
        <h5 class="mb-3"><i class="fas fa-lightning-bolt mr-2"></i> Acciones Rápidas</h5>
      </div>
    </div>

    <div class="row">
      <div class="col-md-3 mb-3">
        <router-link to="/empleados" class="btn btn-primary btn-block" style="padding: 15px;">
          <i class="fas fa-user-plus mr-2"></i> Nuevo Empleado
        </router-link>
      </div>
      <div class="col-md-3 mb-3">
        <router-link to="/contratos" class="btn btn-success btn-block" style="padding: 15px;">
          <i class="fas fa-file-signature mr-2"></i> Nuevo Contrato
        </router-link>
      </div>
      <div class="col-md-3 mb-3">
        <router-link to="/nominas" class="btn btn-info btn-block" style="padding: 15px;">
          <i class="fas fa-calculator mr-2"></i> Nueva Nómina
        </router-link>
      </div>
      <div class="col-md-3 mb-3">
        <router-link to="/departamentos" class="btn btn-warning btn-block" style="padding: 15px;">
          <i class="fas fa-sitemap mr-2"></i> Nuevo Departamento
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomeAdmin',
  data() {
    return {
      empleados: 0,
      departamentos: 0,
      contratos: 0,
      periodos: 0,
      recibos: 0,
      pagos: 0,
      ultimoPeriodo: null,
      actividadesRecientes: [],
      notificaciones: []
    };
  },
  mounted() {
    this.cargarEstadisticas();
  },
  methods: {
    async cargarEstadisticas() {
      try {
        const response = await axios.get('/api/estadisticas-admin');
        this.empleados = response.data.empleados || 0;
        this.departamentos = response.data.departamentos || 0;
        this.contratos = response.data.contratos || 0;
        this.periodos = response.data.periodos || 0;
        this.recibos = response.data.recibos || 0;
        this.pagos = response.data.pagos || 0;
        this.ultimoPeriodo = response.data.ultimo_periodo || null;
        this.actividadesRecientes = response.data.actividades_recientes || [];
        this.notificaciones = response.data.notificaciones || [];
      } catch (error) {
        console.error('Error cargando estadísticas:', error);
        this.$toast.fire({
          icon: 'error',
          title: 'Error al cargar estadísticas'
        });
      }
    },
    getEstadoBadge(estado) {
      const badges = {
        'activo': 'badge badge-success',
        'inactivo': 'badge badge-danger',
        'pendiente': 'badge badge-warning'
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
    verDetalles(id) {
      this.$router.push({
        name: 'nominas'
      });
    }
  }
};
</script>

<style scoped>
.small-box-footer {
  display: block;
  padding: 10px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.3s;
}

.small-box-footer:hover {
  background-color: rgba(0, 0, 0, 0.15);
  text-decoration: none;
}

.card {
  border: none;
  border-radius: 8px;
}

.btn-block {
  text-decoration: none;
  transition: transform 0.2s;
  display: block !important;
}

.btn-block:hover {
  transform: translateY(-2px);
  text-decoration: none;
}
</style>
