<template>
  <div class="container-fluid">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h3 class="card-title mb-0"><i class="fas fa-percentage mr-1"></i> Impuestos</h3>
        <button class="btn btn-sm btn-primary" @click="abrirModalCrear">
          <i class="fas fa-plus"></i> Nuevo Impuesto
        </button>
      </div>
      <div class="card-body">
        <!-- Búsqueda -->
        <div class="mb-3">
          <div class="input-group">
            <input type="text" v-model="search" class="form-control" 
                   placeholder="Buscar por nombre o código..." 
                   @keyup.enter="buscar">
            <div class="input-group-append">
              <button class="btn btn-primary" @click="buscar">
                <i class="fas fa-search"></i> Buscar
              </button>
              <button v-if="search" class="btn btn-secondary" @click="limpiarBusqueda">
                <i class="fas fa-times"></i> Limpiar
              </button>
            </div>
          </div>
        </div>

        <!-- Tabla -->
        <div v-if="impuestos.length > 0" class="table-responsive">
          <table class="table table-sm table-hover">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Código</th>
                <th>Porcentaje</th>
                <th>Descripción</th>
                <th>Por Defecto</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="impuesto in impuestos" :key="impuesto.id">
                <td>{{ impuesto.nombre }}</td>
                <td><code>{{ impuesto.codigo }}</code></td>
                <td>{{ Number(impuesto.porcentaje).toFixed(2) }}%</td>
                <td>{{ impuesto.descripcion || '-' }}</td>
                <td>
                  <span v-if="impuesto.por_defecto" class="badge badge-success">
                    <i class="fas fa-check"></i> Sí
                  </span>
                  <span v-else class="badge badge-secondary">No</span>
                </td>
                <td>
                  <span :class="impuesto.activo ? 'badge badge-success' : 'badge badge-danger'">
                    {{ impuesto.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-xs btn-info" @click="abrirModalEditar(impuesto)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button :class="impuesto.activo ? 'btn btn-xs btn-warning' : 'btn btn-xs btn-success'" 
                          @click="toggleEstado(impuesto)">
                    <i :class="impuesto.activo ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                  <button class="btn btn-xs btn-danger" @click="eliminar(impuesto)">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Sin resultados -->
        <div v-else>
          <div v-if="search" class="alert alert-info">
            No se encontraron impuestos que coincidan con "{{ search }}".
            <a href="#" @click.prevent="limpiarBusqueda" class="alert-link">Ver todos</a>
          </div>
          <p v-else>No hay impuestos registrados.</p>
        </div>
      </div>
    </div>

    <!-- Modal Crear -->
    <div class="modal fade" id="crearModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Nuevo Impuesto</h5>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Nombre <span class="text-danger">*</span></label>
              <input type="text" v-model="nuevoImpuesto.nombre" class="form-control">
            </div>
            <div class="form-group">
              <label>Código <span class="text-danger">*</span></label>
              <input type="text" v-model="nuevoImpuesto.codigo" class="form-control" placeholder="ej: IVA, ISLR">
            </div>
            <div class="form-group">
              <label>Porcentaje <span class="text-danger">*</span></label>
              <input type="number" step="0.01" min="0" max="100" v-model="nuevoImpuesto.porcentaje" class="form-control">
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <textarea v-model="nuevoImpuesto.descripcion" class="form-control" rows="2"></textarea>
            </div>
            <div class="form-group">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="por_defecto" v-model="nuevoImpuesto.por_defecto">
                <label class="custom-control-label" for="por_defecto">Establecer como impuesto por defecto</label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="crear">Guardar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Editar -->
    <div class="modal fade" id="editarModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar Impuesto</h5>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Nombre <span class="text-danger">*</span></label>
              <input type="text" v-model="impuestoEditar.nombre" class="form-control">
            </div>
            <div class="form-group">
              <label>Código <span class="text-danger">*</span></label>
              <input type="text" v-model="impuestoEditar.codigo" class="form-control">
            </div>
            <div class="form-group">
              <label>Porcentaje <span class="text-danger">*</span></label>
              <input type="number" step="0.01" min="0" max="100" v-model="impuestoEditar.porcentaje" class="form-control">
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <textarea v-model="impuestoEditar.descripcion" class="form-control" rows="2"></textarea>
            </div>
            <div class="form-group">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="edit_por_defecto" v-model="impuestoEditar.por_defecto">
                <label class="custom-control-label" for="edit_por_defecto">Establecer como impuesto por defecto</label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="actualizar">Actualizar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Impuestos',
  data() {
    return {
      impuestos: [],
      search: '',
      nuevoImpuesto: {
        nombre: '',
        codigo: '',
        porcentaje: 0,
        descripcion: '',
        por_defecto: false
      },
      impuestoEditar: {
        id: null,
        nombre: '',
        codigo: '',
        porcentaje: 0,
        descripcion: '',
        por_defecto: false
      }
    };
  },
  mounted() {
    this.cargar();
  },
  methods: {
    async cargar() {
      try {
        const params = this.search ? `?search=${encodeURIComponent(this.search)}` : '';
        const response = await fetch(`/api/impuestos${params}`);
        const data = await response.json();
        this.impuestos = data;
      } catch (error) {
        console.error('Error al cargar impuestos:', error);
        this.$toast.fire({
          icon: 'error',
          title: 'Error al cargar impuestos'
        });
      }
    },
    buscar() {
      this.cargar();
    },
    limpiarBusqueda() {
      this.search = '';
      this.cargar();
    },
    abrirModalCrear() {
      this.nuevoImpuesto = {
        nombre: '',
        codigo: '',
        porcentaje: 0,
        descripcion: '',
        por_defecto: false
      };
      $('#crearModal').modal('show');
    },
    abrirModalEditar(impuesto) {
      this.impuestoEditar = {
        id: impuesto.id,
        nombre: impuesto.nombre,
        codigo: impuesto.codigo,
        porcentaje: impuesto.porcentaje,
        descripcion: impuesto.descripcion || '',
        por_defecto: Boolean(impuesto.por_defecto)
      };
      $('#editarModal').modal('show');
    },
    async crear() {
      try {
        const response = await fetch('/api/impuestos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
          },
          body: JSON.stringify(this.nuevoImpuesto)
        });

        if (response.ok) {
          $('#crearModal').modal('hide');
          this.$toast.fire({
            icon: 'success',
            title: 'Impuesto creado correctamente'
          });
          this.cargar();
        } else {
          const error = await response.json();
          this.$toast.fire({
            icon: 'error',
            title: error.message || 'Error al crear impuesto'
          });
        }
      } catch (error) {
        console.error('Error:', error);
        this.$toast.fire({
          icon: 'error',
          title: 'Error al crear impuesto'
        });
      }
    },
    async actualizar() {
      try {
        const response = await fetch(`/api/impuestos/${this.impuestoEditar.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
          },
          body: JSON.stringify(this.impuestoEditar)
        });

        if (response.ok) {
          $('#editarModal').modal('hide');
          this.$toast.fire({
            icon: 'success',
            title: 'Impuesto actualizado correctamente'
          });
          this.cargar();
        } else {
          const error = await response.json();
          this.$toast.fire({
            icon: 'error',
            title: error.message || 'Error al actualizar impuesto'
          });
        }
      } catch (error) {
        console.error('Error:', error);
        this.$toast.fire({
          icon: 'error',
          title: 'Error al actualizar impuesto'
        });
      }
    },
    async toggleEstado(impuesto) {
      if (!confirm('¿Cambiar estado?')) return;

      try {
        const response = await fetch(`/api/impuestos/${impuesto.id}/toggle`, {
          method: 'POST',
          headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
          }
        });

        if (response.ok) {
          this.$toast.fire({
            icon: 'success',
            title: 'Estado actualizado correctamente'
          });
          this.cargar();
        }
      } catch (error) {
        console.error('Error:', error);
        this.$toast.fire({
          icon: 'error',
          title: 'Error al cambiar estado'
        });
      }
    },
    async eliminar(impuesto) {
      if (!confirm('¿Eliminar este impuesto?')) return;

      try {
        const response = await fetch(`/api/impuestos/${impuesto.id}`, {
          method: 'DELETE',
          headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
          }
        });

        if (response.ok) {
          this.$toast.fire({
            icon: 'success',
            title: 'Impuesto eliminado correctamente'
          });
          this.cargar();
        }
      } catch (error) {
        console.error('Error:', error);
        this.$toast.fire({
          icon: 'error',
          title: 'Error al eliminar impuesto'
        });
      }
    }
  }
};
</script>

<style scoped>
.btn-xs {
  padding: 0.125rem 0.25rem;
  font-size: 0.75rem;
  line-height: 1.5;
  border-radius: 0.2rem;
}
</style>
