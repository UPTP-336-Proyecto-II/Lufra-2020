<template>
  <div class="row">
    <div class="col-md-5">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="fas fa-plus mr-1"></i> Crear periodo</h3>
        </div>
        <div class="card-body">
          <form @submit.prevent="crearPeriodo" class="form">
            <div class="form-group">
              <label>Frecuencia</label>
              <select v-model="nuevoPeriodo.frecuencia" class="form-control" required>
                <option value="semanal">Semanal</option>
                <option value="quincenal">Quincenal</option>
                <option value="mensual">Mensual</option>
              </select>
            </div>
            <div class="form-group">
              <label>Fecha inicio</label>
              <input v-model="nuevoPeriodo.fecha_inicio" type="date" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary" :disabled="cargandoCrear">
              <span v-if="cargandoCrear"><i class="fas fa-spinner fa-spin"></i> Creando...</span>
              <span v-else>Crear</span>
            </button>
          </form>
        </div>
      </div>
    </div>
    <div class="col-md-7">
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h3 class="card-title mb-0"><i class="fas fa-list mr-1"></i> Periodos existentes</h3>
        </div>
        <div class="card-body">
          <!-- Caja de búsqueda -->
          <div class="mb-3">
            <div class="input-group">
              <input v-model="busqueda" type="text" class="form-control" 
                     placeholder="Buscar por código, fecha o estado...">
              <div class="input-group-append">
                <button @click="buscar" class="btn btn-primary" type="button">
                  <i class="fas fa-search"></i> Buscar
                </button>
                <button v-if="busqueda" @click="limpiarBusqueda" class="btn btn-secondary" type="button">
                  <i class="fas fa-times"></i> Limpiar
                </button>
              </div>
            </div>
          </div>

          <div v-if="cargando" class="text-center py-4">
            <div class="spinner-border text-primary"></div>
          </div>
          
          <div v-else-if="periodos.length === 0">
            <div v-if="busqueda" class="alert alert-info">
              No se encontraron períodos que coincidan con "{{ busqueda }}".
              <a href="#" @click.prevent="limpiarBusqueda" class="alert-link">Ver todos</a>
            </div>
            <p v-else>No hay periodos.</p>
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
                  <tr v-for="p in periodos" :key="p.id">
                    <td>{{ p.codigo }}</td>
                    <td>{{ p.fecha_inicio }}</td>
                    <td>{{ p.fecha_fin }}</td>
                    <td>{{ p.estado }}</td>
                    <td>
                      <button v-if="p.estado === 'abierto'" @click="cerrarPeriodo(p.id, p.codigo)" class="btn btn-sm btn-warning">
                        Cerrar período
                      </button>
                      <button v-else @click="reabrirPeriodo(p.id, p.codigo)" class="btn btn-sm btn-success">
                        Reabrir período
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <hr>
          
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="mb-0">Historial de períodos cerrados</h5>
          </div>
          
          <!-- Búsqueda para historial -->
          <div class="mb-3">
            <div class="input-group input-group-sm">
              <input v-model="busquedaCerrados" type="text" class="form-control" 
                     placeholder="Buscar en historial...">
              <div class="input-group-append">
                <button @click="buscarCerrados" class="btn btn-primary btn-sm" type="button">
                  <i class="fas fa-search"></i>
                </button>
                <button v-if="busquedaCerrados" @click="limpiarBusquedaCerrados" class="btn btn-secondary btn-sm" type="button">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>

          <div v-if="cargandoCerrados" class="text-center py-4">
            <div class="spinner-border text-primary spinner-border-sm"></div>
          </div>
          
          <div v-else-if="cerrados.length === 0">
            <div v-if="busquedaCerrados" class="alert alert-info">
              No se encontraron períodos cerrados que coincidan con "{{ busquedaCerrados }}".
              <a href="#" @click.prevent="limpiarBusquedaCerrados" class="alert-link">Ver todos</a>
            </div>
            <p v-else>No hay períodos cerrados.</p>
          </div>
          
          <div v-else class="table-responsive">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th>Código</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in cerrados" :key="c.codigo">
                  <td>{{ c.fecha_inicio }}</td>
                  <td>{{ c.fecha_fin }}</td>
                  <td>{{ c.codigo }}</td>
                  <td>{{ c.estado }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Nominas',
  data() {
    return {
      periodos: [],
      cerrados: [],
      busqueda: '',
      busquedaCerrados: '',
      cargando: false,
      cargandoCerrados: false,
      cargandoCrear: false,
      nuevoPeriodo: {
        frecuencia: 'semanal',
        fecha_inicio: ''
      }
    }
  },
  mounted() {
    this.cargarPeriodos();
    this.cargarCerrados();
  },
  methods: {
    async cargarPeriodos() {
      this.cargando = true;
      try {
        const params = {};
        if (this.busqueda) {
          params.search = this.busqueda;
        }
        const response = await axios.get('/api/periodos-nomina', { params });
        const data = response.data.data || response.data;
        this.periodos = Array.isArray(data) ? data.filter(p => p.estado !== 'cerrado') : [];
      } catch (error) {
        console.error('Error al cargar períodos:', error);
        this.$toast.fire({ icon: 'error', title: 'Error al cargar períodos' });
      } finally {
        this.cargando = false;
      }
    },
    async cargarCerrados() {
      this.cargandoCerrados = true;
      try {
        const params = { estado: 'cerrado' };
        if (this.busquedaCerrados) {
          params.search = this.busquedaCerrados;
        }
        const response = await axios.get('/api/periodos-nomina', { params });
        const data = response.data.data || response.data;
        this.cerrados = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error al cargar cerrados:', error);
      } finally {
        this.cargandoCerrados = false;
      }
    },
    async crearPeriodo() {
      if (!this.nuevoPeriodo.fecha_inicio) {
        this.$toast.fire({ icon: 'warning', title: 'Ingrese la fecha de inicio' });
        return;
      }
      this.cargandoCrear = true;
      try {
        await axios.post('/nominas/periodo/crear', this.nuevoPeriodo);
        this.$toast.fire({ icon: 'success', title: 'Período creado exitosamente' });
        this.nuevoPeriodo.fecha_inicio = '';
        this.cargarPeriodos();
        this.cargarCerrados();
      } catch (error) {
        this.$toast.fire({ icon: 'error', title: 'Error al crear período' });
      } finally {
        this.cargandoCrear = false;
      }
    },
    buscar() {
      this.cargarPeriodos();
    },
    limpiarBusqueda() {
      this.busqueda = '';
      this.cargarPeriodos();
    },
    buscarCerrados() {
      this.cargarCerrados();
    },
    limpiarBusquedaCerrados() {
      this.busquedaCerrados = '';
      this.cargarCerrados();
    },
    async cerrarPeriodo(id, codigo) {
      if (!confirm(`¿Cerrar período ${codigo}?`)) return;
      try {
        await axios.post('/nominas/periodo/cerrar', { periodo_id: id });
        this.$toast.fire({ icon: 'success', title: 'Período cerrado' });
        this.cargarPeriodos();
        this.cargarCerrados();
      } catch (error) {
        this.$toast.fire({ icon: 'error', title: 'Error al cerrar período' });
      }
    },
    async reabrirPeriodo(id, codigo) {
      if (!confirm(`¿Reabrir período ${codigo}?`)) return;
      try {
        await axios.post('/nominas/periodo/reabrir', { periodo_id: id });
        this.$toast.fire({ icon: 'success', title: 'Período reabierto' });
        this.cargarPeriodos();
        this.cargarCerrados();
      } catch (error) {
        this.$toast.fire({ icon: 'error', title: 'Error al reabrir período' });
      }
    }
  }
}
</script>

