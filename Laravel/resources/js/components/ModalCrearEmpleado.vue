<template>
  <div class="modal fade" id="modalCrearEmpleado" tabindex="-1" role="dialog" aria-labelledby="modalCrearEmpleadoLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title" id="modalCrearEmpleadoLabel">
            <i class="fas fa-user-plus mr-2"></i> Crear Nuevo Empleado
          </h5>
          <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="guardarEmpleado">
            <div class="form-group">
              <label>Nombre Completo *</label>
              <input v-model="formulario.nombre" type="text" class="form-control" placeholder="Nombre completo del empleado" required>
            </div>

            <div class="form-group">
              <label>Email *</label>
              <input v-model="formulario.email" type="email" class="form-control" placeholder="correo@ejemplo.com" required>
            </div>

            <div class="form-group">
              <label>Contraseña *</label>
              <input v-model="formulario.password" type="password" class="form-control" placeholder="Mínimo 8 caracteres" minlength="8" required>
              <small class="form-text text-muted">El empleado podrá cambiarla después de iniciar sesión</small>
            </div>

            <div class="alert alert-info">
              <i class="fas fa-info-circle mr-2"></i>
              <small>Los datos adicionales (cédula, teléfono, departamento, salario, etc.) podrán agregarse después editando el empleado.</small>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="cargando">
                <i class="fas fa-save mr-2"></i> {{ cargando ? 'Guardando...' : 'Crear Empleado' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ModalCrearEmpleado',
  data() {
    return {
      formulario: {
        nombre: '',
        email: '',
        password: ''
      },
      cargando: false
    };
  },
  mounted() {
    // Ya no necesitamos cargar departamentos aquí
  },
  methods: {
    async guardarEmpleado() {
      if (!this.validarFormulario()) return;

      this.cargando = true;
      try {
        const response = await axios.post('/api/empleados', this.formulario);
        
        // Mostrar mensaje de éxito con la contraseña
        await this.$swal.fire({
          icon: 'success',
          title: 'Empleado creado correctamente',
          html: `<p><strong>Usuario:</strong> ${response.data.data.email}</p>
                 <p><strong>Contraseña:</strong> ${this.formulario.password}</p>
                 <p class="text-muted">Por favor, compártela con el empleado de forma segura.</p>`,
          confirmButtonText: 'Entendido'
        });
        
        // Cerrar modal y limpiar formulario
        this.$emit('empleado-creado', response.data);
        this.limpiarFormulario();
        $('#modalCrearEmpleado').modal('hide');
        
      } catch (error) {
        const mensaje = error.response?.data?.message || 'Error al crear empleado';
        this.$toast.fire({
          icon: 'error',
          title: mensaje
        });
      } finally {
        this.cargando = false;
      }
    },
    validarFormulario() {
      if (!this.formulario.nombre || !this.formulario.email || !this.formulario.password) {
        this.$toast.fire({
          icon: 'warning',
          title: 'Por favor completa los campos obligatorios'
        });
        return false;
      }
      if (this.formulario.password.length < 8) {
        this.$toast.fire({
          icon: 'warning',
          title: 'La contraseña debe tener al menos 8 caracteres'
        });
        return false;
      }
      return true;
    },
    limpiarFormulario() {
      this.formulario = {
        nombre: '',
        email: '',
        password: ''
      };
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
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
</style>
