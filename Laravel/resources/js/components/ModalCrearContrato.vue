<template>
  <div class="modal fade" id="modalCrearContrato" tabindex="-1" role="dialog" aria-labelledby="modalCrearContratoLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header bg-success text-white">
          <h5 class="modal-title" id="modalCrearContratoLabel">
            <i class="fas fa-file-signature mr-2"></i> Crear Nuevo Contrato
          </h5>
          <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="guardarContrato">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Empleado *</label>
                  <select v-model.number="formulario.empleado_id" class="form-control" required>
                    <option value="">Seleccionar empleado</option>
                    <option v-for="emp in empleados" :key="emp.id" :value="emp.id">
                      {{ emp.nombre }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Tipo de Contrato *</label>
                  <select v-model="formulario.tipo_contrato" class="form-control" required>
                    <option value="">Seleccionar tipo</option>
                    <option value="indefinido">Contrato Indefinido</option>
                    <option value="temporal">Contrato Temporal</option>
                    <option value="practicas">Prácticas</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Fecha de Inicio *</label>
                  <input v-model="formulario.fecha_inicio" type="date" class="form-control" required>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Fecha de Fin</label>
                  <input v-model="formulario.fecha_fin" type="date" class="form-control">
                  <small class="text-muted">(Solo para contratos temporales)</small>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Puesto *</label>
                  <input v-model="formulario.puesto" type="text" class="form-control" placeholder="Puesto del empleado" required>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Salario Base *</label>
                  <input v-model.number="formulario.salario_base" type="number" class="form-control" placeholder="0.00" step="0.01" required>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Departamento *</label>
                  <select v-model.number="formulario.departamento_id" class="form-control" required>
                    <option value="">Seleccionar departamento</option>
                    <option v-for="dept in departamentos" :key="dept.id" :value="dept.id">
                      {{ dept.nombre }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Estado *</label>
                  <select v-model="formulario.estado" class="form-control" required>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="suspendido">Suspendido</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Descripción</label>
              <textarea v-model="formulario.descripcion" class="form-control" rows="3" placeholder="Descripción del contrato"></textarea>
            </div>

            <div class="form-group">
              <label>Términos y Condiciones</label>
              <textarea v-model="formulario.terminos" class="form-control" rows="3" placeholder="Términos y condiciones"></textarea>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-success" :disabled="cargando">
                <i class="fas fa-save mr-2"></i> {{ cargando ? 'Guardando...' : 'Guardar Contrato' }}
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
  name: 'ModalCrearContrato',
  data() {
    return {
      formulario: {
        empleado_id: '',
        tipo_contrato: '',
        fecha_inicio: '',
        fecha_fin: '',
        puesto: '',
        salario_base: '',
        departamento_id: '',
        estado: 'activo',
        descripcion: '',
        terminos: ''
      },
      empleados: [],
      departamentos: [],
      cargando: false
    };
  },
  mounted() {
    this.cargarEmpleados();
    this.cargarDepartamentos();
    // Escuchar evento para abrir modal
    window.addEventListener('abrir-modal-crear-contrato', this.abrirModal);
    
    // Esperar a que jQuery esté disponible
    this.$nextTick(() => {
      if (typeof window.$ === 'undefined' && typeof jQuery !== 'undefined') {
        window.$ = jQuery;
      }
    });
  },
  beforeUnmount() {
    window.removeEventListener('abrir-modal-crear-contrato', this.abrirModal);
  },
  methods: {
    abrirModal() {
      this.$nextTick(() => {
        const modalEl = document.getElementById('modalCrearContrato');
        if (modalEl) {
          // Intentar con jQuery primero
          if (typeof $ !== 'undefined') {
            $(modalEl).modal('show');
          } 
          // Si no hay jQuery, intentar con Bootstrap nativo
          else if (typeof bootstrap !== 'undefined') {
            const modal = new bootstrap.Modal(modalEl);
            modal.show();
          }
          // Último recurso: cambiar display manualmente
          else {
            modalEl.style.display = 'block';
            modalEl.classList.add('show');
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            document.body.appendChild(backdrop);
            document.body.classList.add('modal-open');
          }
        }
      });
    },
    async cargarEmpleados() {
      try {
        const response = await axios.get('/api/empleados');
        // Mapear para asegurar que todos tengan el campo 'nombre'
        this.empleados = (response.data || []).map(emp => ({
          id: emp.id,
          nombre: emp.nombre || emp.name || emp.empleado_nombre || 'Sin nombre'
        }));
      } catch (error) {
        console.error('Error cargando empleados:', error);
        this.$toast.fire({
          icon: 'error',
          title: 'Error al cargar empleados'
        });
      }
    },
    async cargarDepartamentos() {
      try {
        const response = await axios.get('/api/departamentos');
        this.departamentos = response.data;
      } catch (error) {
        console.error('Error cargando departamentos:', error);
      }
    },
    async guardarContrato() {
      if (!this.validarFormulario()) return;

      this.cargando = true;
      try {
        const response = await axios.post('/api/contratos', this.formulario);
        this.$toast.fire({
          icon: 'success',
          title: 'Contrato creado correctamente'
        });
        
        // Emitir evento y cerrar modal
        this.$emit('contrato-creado', response.data);
        this.limpiarFormulario();
        
        // Cerrar modal
        this.$nextTick(() => {
          const modalEl = document.getElementById('modalCrearContrato');
          if (modalEl) {
            if (typeof $ !== 'undefined') {
              $(modalEl).modal('hide');
            } else {
              modalEl.style.display = 'none';
              modalEl.classList.remove('show');
              const backdrop = document.querySelector('.modal-backdrop');
              if (backdrop) backdrop.remove();
              document.body.classList.remove('modal-open');
            }
          }
        });
        
      } catch (error) {
        const mensaje = error.response?.data?.message || 'Error al crear contrato';
        this.$toast.fire({
          icon: 'error',
          title: mensaje
        });
      } finally {
        this.cargando = false;
      }
    },
    validarFormulario() {
      if (!this.formulario.empleado_id || !this.formulario.tipo_contrato || !this.formulario.fecha_inicio || !this.formulario.puesto || !this.formulario.salario_base) {
        this.$toast.fire({
          icon: 'warning',
          title: 'Por favor completa todos los campos obligatorios (empleado, tipo, fecha inicio, puesto y salario)'
        });
        return false;
      }
      return true;
    },
    limpiarFormulario() {
      this.formulario = {
        empleado_id: '',
        tipo_contrato: '',
        fecha_inicio: '',
        fecha_fin: '',
        puesto: '',
        salario_base: '',
        departamento_id: '',
        estado: 'activo',
        descripcion: '',
        terminos: ''
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
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}
</style>
