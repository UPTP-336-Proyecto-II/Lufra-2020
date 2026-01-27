<template>
  <div class="container-fluid">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-book mr-2"></i>Conceptos de Pago</h3>
        <div class="card-tools">
          <button @click="abrirModalCrear" class="btn btn-sm btn-primary">
            <i class="fas fa-plus"></i> Nuevo Concepto
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <input v-model="busqueda" @input="buscar" type="text" class="form-control" 
                 placeholder="Buscar concepto...">
        </div>

        <div v-if="cargando" class="text-center py-4">
          <div class="spinner-border text-primary"></div>
        </div>
        <div v-else-if="conceptos.length === 0" class="text-center py-4">
          <p class="text-muted">No hay conceptos registrados</p>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-sm table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="concepto in conceptosFiltrados" :key="concepto.id">
                <td>{{ concepto.id }}</td>
                <td>{{ concepto.nombre }}</td>
                <td>
                  <button @click="editarConcepto(concepto)" class="btn btn-xs btn-warning">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="eliminarConcepto(concepto.id)" class="btn btn-xs btn-danger ml-1">
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
    <div class="modal fade" id="modalConcepto" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modoEdicion ? 'Editar Concepto' : 'Nuevo Concepto' }}</h5>
            <button type="button" class="close" @click="cerrarModal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarConcepto">
              <div class="form-group">
                <label>Nombre *</label>
                <input v-model="formulario.nombre" type="text" class="form-control" required>
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
  name: 'Conceptos',
  data() {
    return {
      conceptos: [],
      busqueda: '',
      cargando: false,
      modoEdicion: false,
      formulario: {
        id: null,
        nombre: ''
      }
    };
  },
  computed: {
    conceptosFiltrados() {
      if (!this.busqueda) return this.conceptos;
      return this.conceptos.filter(c => 
        c.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    }
  },
  mounted() {
    this.cargarConceptos();
  },
  methods: {
    async cargarConceptos() {
      this.cargando = true;
      try {
        const response = await axios.get('/api/conceptos');
        this.conceptos = response.data;
      } catch (error) {
        this.$toast.fire({ icon: 'error', title: 'Error al cargar conceptos' });
      } finally {
        this.cargando = false;
      }
    },
    buscar() {
      // La búsqueda es reactiva vía computed
    },
    abrirModalCrear() {
      this.modoEdicion = false;
      this.formulario = { id: null, nombre: '' };
      this.abrirModal();
    },
    editarConcepto(concepto) {
      this.modoEdicion = true;
      this.formulario = { ...concepto };
      this.abrirModal();
    },
    abrirModal() {
      this.$nextTick(() => {
        const modalEl = document.getElementById('modalConcepto');
        if (modalEl) {
          if (typeof $ !== 'undefined') {
            $(modalEl).modal('show');
          } else {
            modalEl.style.display = 'block';
            modalEl.classList.add('show');
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            backdrop.id = 'modalConceptoBackdrop';
            document.body.appendChild(backdrop);
            document.body.classList.add('modal-open');
          }
        }
      });
    },
    cerrarModal() {
      const modalEl = document.getElementById('modalConcepto');
      if (modalEl) {
        if (typeof $ !== 'undefined') {
          $(modalEl).modal('hide');
        } else {
          modalEl.style.display = 'none';
          modalEl.classList.remove('show');
          const backdrop = document.getElementById('modalConceptoBackdrop');
          if (backdrop) backdrop.remove();
          document.body.classList.remove('modal-open');
        }
      }
    },
    async guardarConcepto() {
      if (!this.formulario.nombre) {
        this.$toast.fire({ icon: 'warning', title: 'El nombre es obligatorio' });
        return;
      }

      try {
        if (this.modoEdicion) {
          await axios.put(`/api/conceptos/${this.formulario.id}`, {
            nombre: this.formulario.nombre
          });
          this.$toast.fire({ icon: 'success', title: 'Concepto actualizado' });
        } else {
          await axios.post('/api/conceptos', {
            nombre: this.formulario.nombre
          });
          this.$toast.fire({ icon: 'success', title: 'Concepto creado' });
        }
        
        this.cerrarModal();
        this.cargarConceptos();
      } catch (error) {
        this.$toast.fire({ 
          icon: 'error', 
          title: error.response?.data?.message || 'Error al guardar' 
        });
      }
    },
    async eliminarConcepto(id) {
      const result = await this.$swal.fire({
        title: '¿Eliminar concepto?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) return;

      try {
        await axios.delete(`/api/conceptos/${id}`);
        this.$toast.fire({ icon: 'success', title: 'Concepto eliminado' });
        this.cargarConceptos();
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
