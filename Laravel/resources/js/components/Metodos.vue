<template>
  <div class="container-fluid">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-calculator mr-2"></i>Métodos de Pago</h3>
        <div class="card-tools">
          <button @click="abrirModalCrear" class="btn btn-sm btn-primary">
            <i class="fas fa-plus"></i> Nuevo Método
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <input v-model="busqueda" @input="buscar" type="text" class="form-control" 
                 placeholder="Buscar método...">
        </div>

        <div v-if="cargando" class="text-center py-4">
          <div class="spinner-border text-primary"></div>
        </div>
        <div v-else-if="metodos.length === 0" class="text-center py-4">
          <p class="text-muted">No hay métodos de pago registrados</p>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-sm table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="metodo in metodosFiltrados" :key="metodo.id">
                <td>{{ metodo.id }}</td>
                <td>{{ metodo.nombre }}</td>
                <td>
                  <span :class="metodo.activo ? 'badge badge-success' : 'badge badge-secondary'">
                    {{ metodo.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td>
                  <button @click="editarMetodo(metodo)" class="btn btn-xs btn-warning">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="eliminarMetodo(metodo.id)" class="btn btn-xs btn-danger ml-1">
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
    <div class="modal fade" id="modalMetodo" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modoEdicion ? 'Editar Método' : 'Nuevo Método' }}</h5>
            <button type="button" class="close" @click="cerrarModal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarMetodo">
              <div class="form-group">
                <label>Nombre *</label>
                <input v-model="formulario.nombre" type="text" class="form-control" required>
              </div>
              <div class="form-group">
                <label>
                  <input v-model="formulario.activo" type="checkbox"> Activo
                </label>
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
  name: 'Metodos',
  data() {
    return {
      metodos: [],
      busqueda: '',
      cargando: false,
      modoEdicion: false,
      formulario: {
        id: null,
        nombre: '',
        activo: true
      }
    };
  },
  computed: {
    metodosFiltrados() {
      if (!this.busqueda) return this.metodos;
      return this.metodos.filter(m => 
        m.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    }
  },
  mounted() {
    this.cargarMetodos();
  },
  methods: {
    async cargarMetodos() {
      this.cargando = true;
      try {
        const response = await axios.get('/api/metodos');
        this.metodos = response.data;
      } catch (error) {
        this.$toast.fire({ icon: 'error', title: 'Error al cargar métodos' });
      } finally {
        this.cargando = false;
      }
    },
    buscar() {
      // La búsqueda es reactiva vía computed
    },
    abrirModalCrear() {
      this.modoEdicion = false;
      this.formulario = { id: null, nombre: '', activo: true };
      this.abrirModal();
    },
    editarMetodo(metodo) {
      this.modoEdicion = true;
      this.formulario = { ...metodo };
      this.abrirModal();
    },
    abrirModal() {
      this.$nextTick(() => {
        const modalEl = document.getElementById('modalMetodo');
        if (modalEl) {
          if (typeof $ !== 'undefined') {
            $(modalEl).modal('show');
          } else {
            modalEl.style.display = 'block';
            modalEl.classList.add('show');
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            backdrop.id = 'modalMetodoBackdrop';
            document.body.appendChild(backdrop);
            document.body.classList.add('modal-open');
          }
        }
      });
    },
    cerrarModal() {
      const modalEl = document.getElementById('modalMetodo');
      if (modalEl) {
        if (typeof $ !== 'undefined') {
          $(modalEl).modal('hide');
        } else {
          modalEl.style.display = 'none';
          modalEl.classList.remove('show');
          const backdrop = document.getElementById('modalMetodoBackdrop');
          if (backdrop) backdrop.remove();
          document.body.classList.remove('modal-open');
        }
      }
    },
    async guardarMetodo() {
      if (!this.formulario.nombre) {
        this.$toast.fire({ icon: 'warning', title: 'El nombre es obligatorio' });
        return;
      }

      try {
        if (this.modoEdicion) {
          await axios.put(`/api/metodos/${this.formulario.id}`, {
            nombre: this.formulario.nombre,
            activo: this.formulario.activo
          });
          this.$toast.fire({ icon: 'success', title: 'Método actualizado' });
        } else {
          await axios.post('/api/metodos', {
            nombre: this.formulario.nombre
          });
          this.$toast.fire({ icon: 'success', title: 'Método creado' });
        }
        
        this.cerrarModal();
        this.cargarMetodos();
      } catch (error) {
        this.$toast.fire({ 
          icon: 'error', 
          title: error.response?.data?.message || 'Error al guardar' 
        });
      }
    },
    async eliminarMetodo(id) {
      const result = await this.$swal.fire({
        title: '¿Eliminar método?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) return;

      try {
        await axios.delete(`/api/metodos/${id}`);
        this.$toast.fire({ icon: 'success', title: 'Método eliminado' });
        this.cargarMetodos();
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
