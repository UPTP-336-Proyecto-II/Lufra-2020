<template>
  <div class="container-fluid">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-coins mr-2"></i>Monedas</h3>
        <div class="card-tools">
          <button @click="abrirModalCrear" class="btn btn-sm btn-primary">
            <i class="fas fa-plus"></i> Nueva Moneda
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <input v-model="busqueda" @input="buscar" type="text" class="form-control" 
                 placeholder="Buscar moneda...">
        </div>

        <div v-if="cargando" class="text-center py-4">
          <div class="spinner-border text-primary"></div>
        </div>
        <div v-else-if="monedas.length === 0" class="text-center py-4">
          <p class="text-muted">No hay monedas registradas</p>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-sm table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Código</th>
                <th>Nombre</th>
                <th>Símbolo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="moneda in monedasFiltradas" :key="moneda.id">
                <td>{{ moneda.id }}</td>
                <td><strong>{{ moneda.codigo }}</strong></td>
                <td>{{ moneda.nombre }}</td>
                <td><span class="badge badge-light">{{ moneda.simbolo }}</span></td>
                <td>
                  <button @click="editarMoneda(moneda)" class="btn btn-xs btn-warning">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="eliminarMoneda(moneda.id)" class="btn btn-xs btn-danger ml-1">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Crear/Editar -->
    <div class="modal fade" id="modalMoneda" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modoEdicion ? 'Editar Moneda' : 'Nueva Moneda' }}</h5>
            <button type="button" class="close" @click="cerrarModal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarMoneda">
              <div class="form-group">
                <label>Código *</label>
                <input v-model="formulario.codigo" type="text" class="form-control" 
                       maxlength="10" required placeholder="USD, EUR, DOP...">
              </div>
              <div class="form-group">
                <label>Nombre *</label>
                <input v-model="formulario.nombre" type="text" class="form-control" 
                       maxlength="100" required placeholder="Dólar, Euro...">
              </div>
              <div class="form-group">
                <label>Símbolo *</label>
                <input v-model="formulario.simbolo" type="text" class="form-control" 
                       maxlength="10" required placeholder="$, €, RD$...">
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="cerrarModal">Cancelar</button>
                <button type="submit" class="btn btn-primary">{{ modoEdicion ? 'Actualizar' : 'Crear' }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Monedas',
  data() {
    return {
      monedas: [],
      busqueda: '',
      cargando: false,
      modoEdicion: false,
      formulario: {
        id: null,
        codigo: '',
        nombre: '',
        simbolo: ''
      }
    };
  },
  computed: {
    monedasFiltradas() {
      if (!this.busqueda) return this.monedas;
      return this.monedas.filter(m => 
        m.codigo.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        m.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    }
  },
  mounted() {
    this.cargarMonedas();
  },
  methods: {
    async cargarMonedas() {
      this.cargando = true;
      try {
        const response = await axios.get('/api/monedas');
        this.monedas = response.data;
      } catch (error) {
        this.$toast.fire({ icon: 'error', title: 'Error al cargar monedas' });
      } finally {
        this.cargando = false;
      }
    },
    buscar() {
      // La búsqueda es reactiva vía computed
    },
    abrirModalCrear() {
      this.modoEdicion = false;
      this.formulario = { id: null, codigo: '', nombre: '', simbolo: '' };
      this.abrirModal();
    },
    editarMoneda(moneda) {
      this.modoEdicion = true;
      this.formulario = { ...moneda };
      this.abrirModal();
    },
    abrirModal() {
      this.$nextTick(() => {
        const modalEl = document.getElementById('modalMoneda');
        if (modalEl) {
          if (typeof $ !== 'undefined') {
            $(modalEl).modal('show');
          } else {
            modalEl.style.display = 'block';
            modalEl.classList.add('show');
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            backdrop.id = 'modalMonedaBackdrop';
            document.body.appendChild(backdrop);
            document.body.classList.add('modal-open');
          }
        }
      });
    },
    cerrarModal() {
      const modalEl = document.getElementById('modalMoneda');
      if (modalEl) {
        if (typeof $ !== 'undefined') {
          $(modalEl).modal('hide');
        } else {
          modalEl.style.display = 'none';
          modalEl.classList.remove('show');
          const backdrop = document.getElementById('modalMonedaBackdrop');
          if (backdrop) backdrop.remove();
          document.body.classList.remove('modal-open');
        }
      }
    },
    async guardarMoneda() {
      if (!this.formulario.codigo || !this.formulario.nombre || !this.formulario.simbolo) {
        this.$toast.fire({ icon: 'warning', title: 'Todos los campos son obligatorios' });
        return;
      }

      try {
        if (this.modoEdicion) {
          await axios.put(`/api/monedas/${this.formulario.id}`, {
            codigo: this.formulario.codigo,
            nombre: this.formulario.nombre,
            simbolo: this.formulario.simbolo
          });
          this.$toast.fire({ icon: 'success', title: 'Moneda actualizada' });
        } else {
          await axios.post('/api/monedas', {
            codigo: this.formulario.codigo,
            nombre: this.formulario.nombre,
            simbolo: this.formulario.simbolo
          });
          this.$toast.fire({ icon: 'success', title: 'Moneda creada' });
        }
        
        this.cerrarModal();
        this.cargarMonedas();
      } catch (error) {
        this.$toast.fire({ 
          icon: 'error', 
          title: error.response?.data?.message || 'Error al guardar' 
        });
      }
    },
    async eliminarMoneda(id) {
      const result = await this.$swal.fire({
        title: '¿Eliminar moneda?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) return;

      try {
        await axios.delete(`/api/monedas/${id}`);
        this.$toast.fire({ icon: 'success', title: 'Moneda eliminada' });
        this.cargarMonedas();
      } catch (error) {
        this.$toast.fire({ 
          icon: 'error', 
          title: error.response?.data?.message || 'Error al eliminar' 
        });
      }
    }
  }
};
</script>
