<template>
  <div class="modal fade" id="modalEditarEmpleado" tabindex="-1" role="dialog" aria-labelledby="modalEditarEmpleadoLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header bg-warning text-dark">
          <h5 class="modal-title" id="modalEditarEmpleadoLabel">
            <i class="fas fa-user-edit mr-2"></i> Editar Empleado
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="actualizarEmpleado">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Nombre *</label>
                  <input v-model="formulario.nombre" type="text" class="form-control" required>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Apellido</label>
                  <input v-model="formulario.apellido" type="text" class="form-control">
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Email *</label>
                  <input v-model="formulario.email" type="email" class="form-control" required>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Cédula</label>
                  <input v-model="formulario.cedula" type="text" class="form-control">
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Teléfono</label>
                  <input v-model="formulario.telefono" type="tel" class="form-control">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Cargo</label>
                  <input v-model="formulario.cargo" type="text" class="form-control">
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Departamento</label>
                  <select v-model="formulario.departamento_id" class="form-control">
                    <option value="">Sin departamento</option>
                    <option v-for="dept in departamentos" :key="dept.id" :value="dept.id">
                      {{ dept.nombre }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Fecha de Ingreso</label>
                  <input v-model="formulario.fecha_ingreso" type="date" class="form-control">
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Salario Base</label>
                  <input v-model.number="formulario.salario_base" type="number" class="form-control" step="0.01">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Talla de Ropa</label>
                  <input v-model="formulario.talla_ropa" type="text" class="form-control">
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Banco</label>
                  <input v-model="formulario.banco" type="text" class="form-control">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Cuenta Bancaria</label>
                  <input v-model="formulario.cuenta_bancaria" type="text" class="form-control">
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Notas</label>
              <textarea v-model="formulario.notas" class="form-control" rows="3"></textarea>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-warning" :disabled="cargando">
                <i class="fas fa-save mr-2"></i> {{ cargando ? 'Actualizando...' : 'Actualizar Empleado' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalEditarEmpleado',
  data() {
    return {
      formulario: {
        id: null,
        user_id: null,
        nombre: '',
        apellido: '',
        email: '',
        cedula: '',
        telefono: '',
        cargo: '',
        departamento_id: '',
        fecha_ingreso: '',
        salario_base: '',
        talla_ropa: '',
        banco: '',
        cuenta_bancaria: '',
        notas: ''
      },
      departamentos: [],
      cargando: false
    };
  },
  mounted() {
    this.cargarDepartamentos();
    // Escuchar evento para abrir modal con datos
    window.addEventListener('abrir-modal-editar-empleado', this.abrirModal);
  },
  beforeUnmount() {
    window.removeEventListener('abrir-modal-editar-empleado', this.abrirModal);
  },
  methods: {
    async cargarDepartamentos() {
      try {
        const response = await axios.get('/api/departamentos');
        this.departamentos = response.data;
      } catch (error) {
        console.error('Error cargando departamentos:', error);
      }
    },
    abrirModal(event) {
      const empleado = event.detail;
      this.cargarDatosEmpleado(empleado);
      $('#modalEditarEmpleado').modal('show');
    },
    async cargarDatosEmpleado(empleado) {
      try {
        // Cargar datos completos del empleado
        const response = await axios.get(`/api/empleados/${empleado.id}`);
        const data = response.data;
        
        this.formulario = {
          id: data.id || empleado.id,
          user_id: data.user_id || empleado.user_id,
          nombre: data.nombre || empleado.nombre || empleado.name || '',
          apellido: data.apellido || '',
          email: data.email || empleado.email || '',
          cedula: data.cedula || '',
          telefono: data.telefono || '',
          cargo: data.puesto || data.cargo || '',
          departamento_id: data.department_id || '',
          fecha_ingreso: data.fecha_ingreso || '',
          salario_base: data.salario_base || '',
          talla_ropa: data.talla_ropa || '',
          banco: data.banco || '',
          cuenta_bancaria: data.cuenta_bancaria || '',
          notas: data.notas || ''
        };
      } catch (error) {
        // Si no existe endpoint, usar datos básicos
        this.formulario = {
          id: empleado.id,
          user_id: empleado.user_id,
          nombre: empleado.nombre || empleado.name || '',
          apellido: '',
          email: empleado.email || '',
          cedula: '',
          telefono: '',
          cargo: empleado.cargo || '',
          departamento_id: '',
          fecha_ingreso: '',
          salario_base: '',
          talla_ropa: '',
          banco: '',
          cuenta_bancaria: '',
          notas: ''
        };
      }
    },
    async actualizarEmpleado() {
      if (!this.validarFormulario()) return;

      this.cargando = true;
      try {
        const response = await axios.put(`/api/empleados/${this.formulario.id}`, this.formulario);
        
        this.$toast.fire({
          icon: 'success',
          title: 'Empleado actualizado correctamente'
        });
        
        this.$emit('empleado-actualizado', response.data);
        $('#modalEditarEmpleado').modal('hide');
        
      } catch (error) {
        const mensaje = error.response?.data?.message || 'Error al actualizar empleado';
        this.$toast.fire({
          icon: 'error',
          title: mensaje
        });
      } finally {
        this.cargando = false;
      }
    },
    validarFormulario() {
      if (!this.formulario.nombre || !this.formulario.email) {
        this.$toast.fire({
          icon: 'warning',
          title: 'El nombre y email son obligatorios'
        });
        return false;
      }
      return true;
    }
  }
};
</script>

<style scoped>
.modal-header {
  border-bottom: none;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 8px;
}

.form-control:focus {
  border-color: #ffc107;
  box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.25);
}
</style>
