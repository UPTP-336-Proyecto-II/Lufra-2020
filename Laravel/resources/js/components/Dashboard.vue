<template>
  <div class="container-fluid">
    <!-- Contadores principales (solo para administradores) -->
    <div v-if="!esEmpleado" class="row">
      <div class="col-lg-2 col-6">
        <div class="small-box bg-info">
          <div class="inner">
            <h3>{{ empleados }}</h3>
            <p>Empleados</p>
          </div>
          <div class="icon"><i class="fas fa-users"></i></div>
        </div>
      </div>
      <div class="col-lg-2 col-6">
        <div class="small-box bg-success">
          <div class="inner">
            <h3>{{ departamentos }}</h3>
            <p>Departamentos</p>
          </div>
          <div class="icon"><i class="fas fa-sitemap"></i></div>
        </div>
      </div>
      <div class="col-lg-2 col-6">
        <div class="small-box bg-warning">
          <div class="inner text-dark">
            <h3>{{ contratos }}</h3>
            <p>Contratos</p>
          </div>
          <div class="icon"><i class="fas fa-file-signature"></i></div>
        </div>
      </div>
      <div class="col-lg-2 col-6">
        <div class="small-box bg-primary">
          <div class="inner">
            <h3>{{ periodos }}</h3>
            <p>Periodos de nómina</p>
          </div>
          <div class="icon"><i class="fas fa-calendar-alt"></i></div>
        </div>
      </div>
      <div class="col-lg-2 col-6">
        <div class="small-box bg-danger">
          <div class="inner">
            <h3>{{ recibos }}</h3>
            <p>Recibos</p>
          </div>
          <div class="icon"><i class="fas fa-file-invoice-dollar"></i></div>
        </div>
      </div>
      <div class="col-lg-2 col-6">
        <div class="small-box bg-secondary">
          <div class="inner">
            <h3>{{ pagos }}</h3>
            <p>Pagos</p>
          </div>
          <div class="icon"><i class="fas fa-money-check-alt"></i></div>
        </div>
      </div>
    </div>

    <!-- Resumen del último período (solo para administradores) -->
    <div v-if="!esEmpleado" class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><i class="fas fa-tachometer-alt mr-1"></i> Resumen</h3>
          </div>
          <div class="card-body">
            <p class="mb-2">Último periodo de nómina:</p>
            <p v-if="ultimoPeriodo">
              <strong>{{ ultimoPeriodo.codigo }}</strong> ({{ ultimoPeriodo.fecha_inicio }} a {{ ultimoPeriodo.fecha_fin }}) - Estado: {{ ultimoPeriodo.estado }}
            </p>
            <p v-else>No hay periodos registrados.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Información de contrato (solo para empleados) -->
    <div v-if="esEmpleado && contratoInfo" class="row mt-3">
      <div class="col-12">
        <div class="card shadow-sm border-left-primary">
          <div class="card-header bg-white d-flex align-items-center justify-content-between">
            <div>
              <h5 class="mb-0"><i class="fas fa-user-check mr-2 text-primary"></i>Mi contrato</h5>
              <small class="text-muted">Información rápida sobre tu contrato</small>
            </div>
            <div>
              <span v-if="contratoInfo.estado" :class="getEstadoBadgeClass(contratoInfo.estado)">
                {{ contratoInfo.estado }}
              </span>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-8">
                <h6 class="mb-1">{{ contratoInfo.puesto || '-' }}</h6>
                <p class="mb-1 text-muted">
                  Tipo: <strong>{{ formatTipoContrato(contratoInfo.tipo_contrato) }}</strong>
                </p>
                <p class="mb-1 text-muted">
                  Periodo: <strong>{{ formatFecha(contratoInfo.fecha_inicio) }}</strong> — 
                  <strong>{{ contratoInfo.fecha_fin ? formatFecha(contratoInfo.fecha_fin) : 'Indefinida' }}</strong>
                </p>
                <p v-if="contratoInfo.salario_base !== null" class="mb-0 text-muted">
                  Salario base: <strong>{{ formatNumber(contratoInfo.salario_base) }}</strong>
                </p>
              </div>
              <div class="col-md-4 d-flex align-items-center justify-content-end">
                <div class="text-right">
                  <span v-if="contratoInfo.days_remaining === null" class="badge bg-info">Vigencia indefinida</span>
                  <template v-else>
                    <span v-if="contratoInfo.expired" class="badge bg-danger">Vencido</span>
                    <span v-else class="badge bg-primary">{{ contratoInfo.days_remaining }} días restantes</span>
                    <div class="text-muted small">
                      {{ contratoInfo.expired ? 'Finalizó el' : 'Hasta' }} {{ formatFecha(contratoInfo.fecha_fin) }}
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recibos y Pagos -->
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><i class="fas fa-file-invoice-dollar mr-1"></i> Recibos y Pagos</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h6>Recibos recientes</h6>
                <div v-if="recibosList && recibosList.data && recibosList.data.length" class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Cédula</th>
                        <th>Empleado</th>
                        <th>Neto</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="r in recibosList.data" :key="r.id">
                        <td>{{ r.empleado_codigo || '-' }}</td>
                        <td>{{ r.empleado_cedula || '-' }}</td>
                        <td>{{ r.empleado_name || '-' }}</td>
                        <td>{{ formatNumber(r.neto) }}</td>
                        <td>{{ r.estado }}</td>
                        <td>
                          <a class="btn btn-xs btn-outline-primary" target="_blank" :href="`/nomina/recibo/${r.id}/pdf`">Ver recibo</a>
                          <a class="btn btn-xs btn-outline-secondary" :href="`/contratos/empleado/${r.empleado_user_id || r.empleado_id || 0}`">Ver contrato</a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p v-else>No hay recibos.</p>
              </div>
              
              <div class="col-md-6">
                <h6>Historial de pagos</h6>
                <div v-if="pagosList && pagosList.data && pagosList.data.length" class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Importe</th>
                        <th>Método</th>
                        <th>Estado</th>
                        <th v-if="esEmpleado">Descripción</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="pg in pagosList.data" :key="pg.id">
                        <td>{{ formatFechaPago(pg) }}</td>
                        <td>{{ formatNumber(pg.importe) }}</td>
                        <td>{{ pg.metodo }}</td>
                        <td><span :class="getEstadoPagoBadge(pg.estado)">{{ pg.estado || 'pendiente' }}</span></td>
                        <td v-if="esEmpleado">{{ pg.descripcion || '-' }}</td>
                        <td>
                          <template v-if="esEmpleado && (pg.estado === 'pendiente' || !pg.estado)">
                            <button @click="aceptarPago(pg.id)" class="btn btn-xs btn-success">Aceptar</button>
                            <button @click="rechazarPago(pg.id)" class="btn btn-xs btn-danger">Rechazar</button>
                          </template>
                          <a v-else class="btn btn-xs btn-outline-primary" target="_blank" :href="`/nomina/recibo/${pg.recibo_id || 0}/pdf`">Ver recibo</a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p v-else>No hay pagos.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      empleados: 0,
      departamentos: 0,
      contratos: 0,
      periodos: 0,
      recibos: 0,
      pagos: 0,
      esEmpleado: false,
      ultimoPeriodo: null,
      deps: [],
      contratosList: [],
      periodosList: [],
      recibosList: [],
      pagosList: [],
      metodosPago: [],
      contratoInfo: null
    }
  },
  async mounted() {
    await this.loadDashboardData();
  },
  methods: {
    async loadDashboardData() {
      try {
        const response = await axios.get('/api/dashboard');
        const data = response.data;
        this.empleados = data.empleados || 0;
        this.departamentos = data.departamentos || 0;
        this.contratos = data.contratos || 0;
        this.periodos = data.periodos || 0;
        this.recibos = data.recibos || 0;
        this.pagos = data.pagos || 0;
        this.esEmpleado = data.esEmpleado || false;
        this.ultimoPeriodo = data.ultimoPeriodo || null;
        this.deps = data.deps || { data: [] };
        this.contratosList = data.contratosList || { data: [] };
        this.periodosList = data.periodosList || { data: [] };
        this.recibosList = data.recibosList || { data: [] };
        this.pagosList = data.pagosList || { data: [] };
        this.metodosPago = data.metodosPago || [];
        this.contratoInfo = data.contratoInfo || null;
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
        this.$toast.fire({ icon: 'error', title: 'Error al cargar datos del dashboard' });
      }
    },
    formatNumber(num) {
      if (num === null || num === undefined) return '-';
      return parseFloat(num).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    formatFecha(fecha) {
      if (!fecha) return '-';
      const d = new Date(fecha);
      return d.toLocaleDateString('es-ES');
    },
    formatFechaPago(pg) {
      const fecha = pg.pagado_en || pg.updated_at || pg.created_at;
      return this.formatFecha(fecha);
    },
    formatTipoContrato(tipo) {
      if (!tipo) return '-';
      return tipo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    },
    getEstadoBadgeClass(estado) {
      if (!estado) return 'badge bg-secondary';
      const e = estado.toLowerCase();
      if (e === 'activo') return 'badge bg-success';
      if (e === 'inactivo' || e === 'vencido') return 'badge bg-danger';
      return 'badge bg-secondary';
    },
    getEstadoPagoBadge(estado) {
      const e = estado || 'pendiente';
      if (e === 'aceptado') return 'badge bg-success';
      if (e === 'rechazado') return 'badge bg-danger';
      return 'badge bg-warning';
    },
    async aceptarPago(id) {
      try {
        const response = await axios.post(`/pagos/${id}/aceptar`);
        this.$toast.fire({ icon: 'success', title: 'Pago aceptado' });
        // Recargar datos
        window.location.reload();
      } catch (error) {
        this.$toast.fire({ icon: 'error', title: 'Error al aceptar pago' });
      }
    },
    async rechazarPago(id) {
      if (!confirm('¿Rechazar este pago?')) return;
      try {
        const response = await axios.post(`/pagos/${id}/rechazar`);
        this.$toast.fire({ icon: 'success', title: 'Pago rechazado' });
        // Recargar datos
        window.location.reload();
      } catch (error) {
        this.$toast.fire({ icon: 'error', title: 'Error al rechazar pago' });
      }
    }
  }
}
</script>
