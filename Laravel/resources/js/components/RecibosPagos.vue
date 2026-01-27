<template>
  <div class="container-fluid">
    <!-- VISTA EMPLEADO -->
    <div v-if="esEmpleado" class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h3 class="card-title mb-0"><i class="fas fa-file-invoice-dollar mr-1"></i> Mis pagos</h3>
      </div>
      <div class="card-body">
        <!-- Búsqueda -->
        <div class="mb-3">
          <div class="input-group">
            <input v-model="busquedaPagos" type="text" class="form-control" 
                   placeholder="Buscar por importe, método, estado o referencia...">
            <div class="input-group-append">
              <button @click="buscar" class="btn btn-primary">
                <i class="fas fa-search"></i> Buscar
              </button>
              <button v-if="busquedaPagos" @click="limpiarBusqueda" class="btn btn-secondary">
                <i class="fas fa-times"></i> Limpiar
              </button>
            </div>
          </div>
        </div>

        <div v-if="cargando" class="text-center py-4">
          <div class="spinner-border text-primary"></div>
        </div>
        <div v-else-if="pagosList.length === 0" class="text-center py-4">
          <p class="text-muted">No hay pagos asignados.</p>
        </div>
        <div v-else>
          <div class="table-responsive">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Importe</th>
                  <th>Método</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in pagosList" :key="p.id">
                  <td>{{ formatNumber(p.importe) }}</td>
                  <td>{{ p.metodo }}</td>
                  <td>{{ p.referencia || p.descripcion || '-' }}</td>
                  <td>
                    <span :class="getEstadoPagoBadge(p.estado || 'pendiente')">
                      {{ p.estado || 'pendiente' }}
                    </span>
                  </td>
                  <td>
                    <template v-if="(p.estado || 'pendiente') === 'pendiente'">
                      <button @click="aceptarPago(p.id)" class="btn btn-xs btn-success">Aceptar</button>
                      <button @click="rechazarPago(p.id)" class="btn btn-xs btn-danger ml-1">Rechazar</button>
                    </template>
                    <template v-else>
                      <a :href="`/nomina/recibo/${p.recibo_id}/pdf`" target="_blank" class="btn btn-xs btn-outline-primary">
                        Imprimir recibo
                      </a>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- VISTA ADMINISTRADOR -->
    <template v-else>
      <!-- Períodos de nómina -->
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h3 class="card-title mb-0"><i class="fas fa-file-invoice-dollar mr-1"></i> Períodos de nómina</h3>
        </div>
        <div class="card-body">
          <!-- Búsqueda -->
          <div class="mb-3">
            <div class="input-group">
              <input v-model="busquedaPeriodos" type="text" class="form-control" 
                     placeholder="Buscar período por código, fecha o estado...">
              <div class="input-group-append">
                <button @click="buscar" class="btn btn-primary">
                  <i class="fas fa-search"></i> Buscar
                </button>
                <button v-if="busquedaPeriodos" @click="limpiarBusquedaPeriodos" class="btn btn-secondary">
                  <i class="fas fa-times"></i> Limpiar
                </button>
              </div>
            </div>
          </div>

          <div v-if="cargando" class="text-center py-4">
            <div class="spinner-border text-primary"></div>
          </div>
          <div v-else-if="periodosList.length === 0" class="text-center py-4">
            <p class="text-muted">No hay periodos de nómina.</p>
          </div>
          <div v-else>
            <div class="table-responsive">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in periodosList" :key="p.id">
                    <td>{{ p.codigo }}</td>
                    <td>{{ p.fecha_inicio }}</td>
                    <td>{{ p.fecha_fin }}</td>
                    <td>
                      <span :class="p.estado === 'cerrado' ? 'badge badge-success' : 'badge badge-secondary'">
                        {{ p.estado }}
                      </span>
                    </td>
                    <td>
                      <router-link to="/recibos-pagos/archivo-banco" class="btn btn-xs btn-outline-primary">
                        Archivo banco
                      </router-link>
                      <router-link to="/recibos-pagos/obligaciones" class="btn btn-xs btn-outline-secondary ml-1">
                        Obligaciones
                      </router-link>
                      <router-link to="/recibos-pagos/reportes" class="btn btn-xs btn-outline-info ml-1">
                        Reportes
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagos por asignar -->
      <div class="card mt-3">
        <div class="card-header d-flex align-items-center justify-content-between">
          <h3 class="card-title mb-0"><i class="fas fa-money-check-alt mr-1"></i> Pagos por asignar (recibos sin pago)</h3>
          <div class="d-flex align-items-center">
            <div class="input-group input-group-sm mr-2" style="width: 300px;">
              <input v-model="busquedaRecibos" type="text" class="form-control" placeholder="Buscar empleado o #recibo">
              <div class="input-group-append">
                <button @click="buscarRecibos" class="btn btn-primary">
                  <i class="fas fa-search"></i>
                </button>
                <button v-if="busquedaRecibos" @click="limpiarBusquedaRecibos" class="btn btn-secondary">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
            <router-link to="/recibos-pagos/conceptos" class="btn btn-sm btn-outline-secondary mr-2">Conceptos</router-link>
            <router-link to="/recibos-pagos/metodos" class="btn btn-sm btn-outline-secondary mr-2">Métodos</router-link>
            <router-link to="/recibos-pagos/monedas" class="btn btn-sm btn-outline-secondary">Monedas</router-link>
          </div>
        </div>
        <div class="card-body">
          <div v-if="cargandoRecibos" class="text-center py-4">
            <div class="spinner-border text-primary"></div>
          </div>
          <div v-else-if="recibosSinPago.length === 0" class="text-center py-4">
            <p class="text-muted">No hay recibos pendientes de pago.</p>
          </div>
          <div v-else>
            <div class="table-responsive">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Recibo</th>
                    <th>Período</th>
                    <th>Empleado</th>
                    <th>Neto</th>
                    <th>Importe</th>
                    <th>Moneda</th>
                    <th>Método</th>
                    <th>Concepto</th>
                    <th>Impuesto</th>
                    <th>Asignar</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in recibosSinPago" :key="r.id">
                    <td>#{{ r.id }}</td>
                    <td>
                      <span :class="r.periodo_estado === 'cerrado' ? 'badge badge-success' : 'badge badge-warning'">
                        {{ r.periodo_codigo }}
                      </span>
                    </td>
                    <td>{{ r.nombre }} {{ r.apellido }}</td>
                    <td>{{ formatNumber(r.neto) }}</td>
                    <td>
                      <input v-model.number="r.form_importe" type="number" step="0.01" min="0" 
                             class="form-control form-control-sm" style="width: 100px;">
                    </td>
                    <td>
                      <select v-model="r.form_moneda" class="form-control form-control-sm" style="width: 100px;">
                        <option v-for="mon in monedas" :key="mon.codigo" :value="mon.codigo">
                          {{ mon.simbolo }} {{ mon.codigo }}
                        </option>
                      </select>
                    </td>
                    <td>
                      <select v-model="r.form_metodo" class="form-control form-control-sm" style="width: 120px;">
                        <option v-for="m in metodos" :key="m.nombre" :value="m.nombre">
                          {{ m.nombre }}
                        </option>
                      </select>
                    </td>
                    <td>
                      <select v-model="r.form_concepto" class="form-control form-control-sm" style="width: 120px;">
                        <option value="">-- Seleccionar --</option>
                        <option v-for="c in conceptos" :key="c.nombre" :value="c.nombre">
                          {{ c.nombre }}
                        </option>
                      </select>
                    </td>
                    <td>
                      <select v-model="r.form_impuesto_id" class="form-control form-control-sm" style="width: 120px;">
                        <option value="">-- Sin impuesto --</option>
                        <option v-for="imp in impuestos" :key="imp.id" :value="imp.id">
                          {{ imp.nombre }} ({{ formatNumber(imp.porcentaje) }}%)
                        </option>
                      </select>
                    </td>
                    <td>
                      <button @click="asignarPago(r)" class="btn btn-sm btn-primary">Asignar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Pago manual -->
      <div class="card mt-3">
        <div class="card-header">
          <h3 class="card-title"><i class="fas fa-hand-holding-usd mr-1"></i> Pago manual (sin recibo)</h3>
        </div>
        <div class="card-body">
          <form @submit.prevent="crearPagoManual">
            <div class="row">
              <div class="col-md-3">
                <div class="form-group">
                  <label class="small text-muted">Empleado</label>
                  <select v-model="pagoManual.empleado_id" class="form-control form-control-sm" required>
                    <option value="">-- Seleccionar --</option>
                    <option v-for="e in empleados" :key="e.id" :value="e.id">
                      {{ e.nombre }} {{ e.apellido }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-2">
                <div class="form-group">
                  <label class="small text-muted">Importe</label>
                  <input v-model.number="pagoManual.importe" type="number" step="0.01" min="0" 
                         class="form-control form-control-sm" placeholder="0.00" required>
                </div>
              </div>
              <div class="col-md-2">
                <div class="form-group">
                  <label class="small text-muted">Moneda</label>
                  <select v-model="pagoManual.moneda" class="form-control form-control-sm" required>
                    <option v-for="mon in monedas" :key="mon.codigo" :value="mon.codigo">
                      {{ mon.simbolo }} {{ mon.codigo }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-2">
                <div class="form-group">
                  <label class="small text-muted">Método</label>
                  <select v-model="pagoManual.metodo" class="form-control form-control-sm" required>
                    <option v-for="m in metodos" :key="m.nombre" :value="m.nombre">
                      {{ m.nombre }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-2">
                <div class="form-group">
                  <label class="small text-muted">Concepto</label>
                  <select v-model="pagoManual.descripcion" class="form-control form-control-sm">
                    <option value="">-- Opcional --</option>
                    <option v-for="c in conceptos" :key="c.nombre" :value="c.nombre">
                      {{ c.nombre }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-1">
                <div class="form-group">
                  <label class="small text-muted d-block">&nbsp;</label>
                  <button type="submit" class="btn btn-sm btn-primary btn-block">
                    <i class="fas fa-save"></i> Crear
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </template>

    <!-- Router view para rutas hijas -->
    <div v-if="$route.path !== '/recibos-pagos'" class="mt-3">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecibosPagos',
  data() {
    return {
      esEmpleado: false,
      periodosList: [],
      recibosSinPago: [],
      pagosList: [],
      empleados: [],
      monedas: [],
      metodos: [],
      conceptos: [],
      impuestos: [],
      busquedaPagos: '',
      busquedaPeriodos: '',
      busquedaRecibos: '',
      cargando: false,
      cargandoRecibos: false,
      pagoManual: {
        empleado_id: '',
        importe: '',
        moneda: '',
        metodo: '',
        descripcion: ''
      }
    }
  },
  mounted() {
    this.cargarDatos();
  },
  methods: {
    async cargarDatos() {
      this.cargando = true;
      try {
        // Cargar desde window.__INITIAL_DATA__
        if (window.__INITIAL_DATA__) {
          this.esEmpleado = window.__INITIAL_DATA__.esEmpleado || false;
          this.periodosList = window.__INITIAL_DATA__.periodosList?.data || window.__INITIAL_DATA__.periodosList || [];
          this.pagosList = window.__INITIAL_DATA__.pagosList?.data || window.__INITIAL_DATA__.pagosList || [];
          this.recibosSinPago = window.__INITIAL_DATA__.recibosSinPago || [];
          this.empleados = window.__INITIAL_DATA__.empleadosList || [];
          this.monedas = window.__INITIAL_DATA__.monedas || [];
          this.metodos = window.__INITIAL_DATA__.metodos || [];
          this.conceptos = window.__INITIAL_DATA__.conceptos || [];
          this.impuestos = window.__INITIAL_DATA__.impuestos || [];
          
          // Inicializar formularios para cada recibo
          this.recibosSinPago.forEach(r => {
            r.form_importe = r.neto;
            r.form_moneda = this.monedas[0]?.codigo || '';
            r.form_metodo = this.metodos[0]?.nombre || '';
            r.form_concepto = '';
            r.form_impuesto_id = this.impuestos.find(i => i.por_defecto)?.id || '';
          });
        }
      } catch (error) {
        this.$toast.fire({ icon: 'error', title: 'Error al cargar datos' });
      } finally {
        this.cargando = false;
      }
    },
    buscar() {
      // Implementar búsqueda
      this.cargarDatos();
    },
    limpiarBusqueda() {
      this.busquedaPagos = '';
      this.cargarDatos();
    },
    limpiarBusquedaPeriodos() {
      this.busquedaPeriodos = '';
      this.cargarDatos();
    },
    buscarRecibos() {
      this.cargarDatos();
    },
    limpiarBusquedaRecibos() {
      this.busquedaRecibos = '';
      this.cargarDatos();
    },
    async aceptarPago(id) {
      try {
        await axios.post(`/pagos/${id}/aceptar`);
        this.$toast.fire({ icon: 'success', title: 'Pago aceptado' });
        this.cargarDatos();
      } catch (error) {
        this.$toast.fire({ icon: 'error', title: 'Error al aceptar pago' });
      }
    },
    async rechazarPago(id) {
      const result = await this.$swal.fire({
        title: '¿Rechazar este pago?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, rechazar',
        cancelButtonText: 'Cancelar'
      });
      
      if (!result.isConfirmed) return;
      
      try {
        await axios.post(`/pagos/${id}/rechazar`);
        this.$toast.fire({ icon: 'success', title: 'Pago rechazado' });
        this.cargarDatos();
      } catch (error) {
        this.$toast.fire({ icon: 'error', title: 'Error al rechazar pago' });
      }
    },
    async asignarPago(recibo) {
      if (!recibo.form_importe || !recibo.form_moneda || !recibo.form_metodo) {
        this.$toast.fire({ icon: 'warning', title: 'Complete los campos obligatorios' });
        return;
      }
      
      try {
        await axios.post('/pagos/asignar', {
          recibo_id: recibo.id,
          importe: recibo.form_importe,
          moneda: recibo.form_moneda,
          metodo: recibo.form_metodo,
          concepto: recibo.form_concepto,
          impuesto_id: recibo.form_impuesto_id
        });
        
        this.$toast.fire({ icon: 'success', title: 'Pago asignado correctamente' });
        this.cargarDatos();
      } catch (error) {
        this.$toast.fire({ 
          icon: 'error', 
          title: error.response?.data?.message || 'Error al asignar pago' 
        });
      }
    },
    async crearPagoManual() {
      if (!this.pagoManual.empleado_id || !this.pagoManual.importe || !this.pagoManual.moneda || !this.pagoManual.metodo) {
        this.$toast.fire({ icon: 'warning', title: 'Complete los campos obligatorios' });
        return;
      }
      
      try {
        await axios.post('/pagos/manual', this.pagoManual);
        this.$toast.fire({ icon: 'success', title: 'Pago manual creado correctamente' });
        
        // Limpiar formulario
        this.pagoManual = {
          empleado_id: '',
          importe: '',
          moneda: this.monedas[0]?.codigo || '',
          metodo: this.metodos[0]?.nombre || '',
          descripcion: ''
        };
        
        this.cargarDatos();
      } catch (error) {
        this.$toast.fire({ 
          icon: 'error', 
          title: error.response?.data?.message || 'Error al crear pago manual' 
        });
      }
    },
    formatNumber(num) {
      return new Intl.NumberFormat('es-ES', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      }).format(num || 0);
    },
    getEstadoPagoBadge(estado) {
      if (estado === 'aceptado') return 'badge badge-success';
      if (estado === 'rechazado') return 'badge badge-danger';
      return 'badge badge-warning';
    }
  }
}
</script>
