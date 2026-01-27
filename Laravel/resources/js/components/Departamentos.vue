<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><i class="fas fa-sitemap mr-2"></i>Departamentos</h3>
            <div class="card-tools">
              <button @click="mostrarFormulario(null)" class="btn btn-sm btn-primary">
                <i class="fas fa-plus"></i> Nuevo Departamento
              </button>
            </div>
          </div>
          <div class="card-body">
            <!-- Formulario de Crear/Editar -->
            <div v-if="mostrandoFormulario" class="card mb-3 border-primary">
              <div class="card-header bg-primary text-white">
                <h5 class="mb-0">{{ editando ? 'Editar' : 'Nuevo' }} Departamento</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Código</label>
                      <input v-model="formulario.codigo" type="text" class="form-control" 
                             placeholder="Ej: RRHH">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Nombre</label>
                      <input v-model="formulario.nombre" type="text" class="form-control" 
                             placeholder="Ej: Recursos Humanos">
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label>Descripción (Opcional)</label>
                  <textarea v-model="formulario.descripcion" class="form-control" rows="2"
                            placeholder="Descripción del departamento"></textarea>
                </div>
                <div class="text-right">
                  <button @click="cancelarFormulario" class="btn btn-secondary">
                    <i class="fas fa-times"></i> Cancelar
                  </button>
                  <button @click="guardarDepartamento" class="btn btn-primary ml-2">
                    <i class="fas fa-save"></i> Guardar
                  </button>
                </div>
              </div>
            </div>

            <div class="mb-3">
              <input v-model="busqueda" @input="buscar" type="text" class="form-control" 
                     placeholder="Buscar por código o nombre...">
            </div>
            <div v-if="cargando" class="text-center py-4">
              <div class="spinner-border text-primary"></div>
            </div>
            <div v-else-if="departamentos.length === 0" class="text-center py-4">
              <p class="text-muted">No hay departamentos registrados</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="dept in departamentos" :key="dept.id">
                    <td><strong>{{ dept.codigo }}</strong></td>
                    <td>{{ dept.nombre }}</td>
                    <td>
                      <button @click="editarDepartamento(dept)" class="btn btn-xs btn-warning">
                        <i class="fas fa-edit"></i> Editar
                      </button>
                      <button @click="eliminarDepartamento(dept.id)" class="btn btn-xs btn-danger ml-1">
                        <i class="fas fa-trash"></i> Eliminar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Departamentos',
  data() {
    return {
      departamentos: [],
      busqueda: '',
      cargando: false,
      mostrandoFormulario: false,
      editando: false,
      formulario: {
        id: null,
        codigo: '',
        nombre: '',
        descripcion: ''
      }
    }
  },
  mounted() {
    this.cargarDepartamentos();
  },
  methods: {
    async cargarDepartamentos() {
      this.cargando = true;
      try {
        // Cargar desde window.__INITIAL_DATA__ si está disponible
        if (window.__INITIAL_DATA__ && window.__INITIAL_DATA__.deps) {
          this.departamentos = window.__INITIAL_DATA__.deps.data || window.__INITIAL_DATA__.deps;
        } else {
          const response = await axios.get('/departamentos');
          this.departamentos = response.data;
        }
      } catch (error) {
        this.$toast.fire({ icon: 'error', title: 'Error al cargar departamentos' });
      } finally {
        this.cargando = false;
      }
    },
    buscar() {
      this.cargarDepartamentos();
    },
    mostrarFormulario(dept) {
      this.mostrandoFormulario = true;
      if (dept) {
        this.editando = true;
        this.formulario = {
          id: dept.id,
          codigo: dept.codigo,
          nombre: dept.nombre,
          descripcion: dept.descripcion || ''
        };
      } else {
        this.editando = false;
        this.formulario = {
          id: null,
          codigo: '',
          nombre: '',
          descripcion: ''
        };
      }
    },
    cancelarFormulario() {
      this.mostrandoFormulario = false;
      this.editando = false;
      this.formulario = {
        id: null,
        codigo: '',
        nombre: '',
        descripcion: ''
      };
    },
    async guardarDepartamento() {
      if (!this.formulario.codigo || !this.formulario.nombre) {
        this.$toast.fire({ icon: 'warning', title: 'Código y nombre son requeridos' });
        return;
      }

      try {
        if (this.editando) {
          // Editar departamento existente
          const response = await axios.post('/departamentos/editar', {
            id: this.formulario.id,
            codigo: this.formulario.codigo,
            nombre: this.formulario.nombre,
            descripcion: this.formulario.descripcion
          });
          // Actualizar en la lista
          const index = this.departamentos.findIndex(d => d.id === this.formulario.id);
          if (index !== -1) {
            this.departamentos[index] = {
              id: this.formulario.id,
              codigo: this.formulario.codigo,
              nombre: this.formulario.nombre,
              descripcion: this.formulario.descripcion
            };
          }
          this.$toast.fire({ icon: 'success', title: 'Departamento actualizado' });
        } else {
          // Crear nuevo departamento
          const response = await axios.post('/departamentos', {
            codigo: this.formulario.codigo,
            nombre: this.formulario.nombre,
            descripcion: this.formulario.descripcion
          });
          // Agregar a la lista sin recargar
          if (response.data && response.data.id) {
            this.departamentos.push({
              id: response.data.id,
              codigo: this.formulario.codigo,
              nombre: this.formulario.nombre,
              descripcion: this.formulario.descripcion
            });
          }
          this.$toast.fire({ icon: 'success', title: 'Departamento creado' });
        }
        this.cancelarFormulario();
      } catch (error) {
        this.$toast.fire({ 
          icon: 'error', 
          title: error.response?.data?.message || 'Error al guardar departamento' 
        });
      }
    },
    editarDepartamento(dept) {
      this.mostrarFormulario(dept);
    },
    async eliminarDepartamento(id) {
      const result = await this.$swal.fire({
        title: '¿Eliminar departamento?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) return;

      try {
        const response = await axios.post('/departamentos/eliminar', { id: id }, {
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        // Eliminar de la lista sin recargar
        this.departamentos = this.departamentos.filter(d => d.id !== id);
        this.$toast.fire({ icon: 'success', title: 'Departamento eliminado' });
      } catch (error) {
        console.error('Error al eliminar:', error.response?.data);
        const mensaje = error.response?.data?.message || 
                       error.response?.data?.errors?.id?.[0] || 
                       'Error al eliminar departamento';
        this.$toast.fire({ 
          icon: 'error', 
          title: mensaje
        });
      }
    }
  }
}
</script>

