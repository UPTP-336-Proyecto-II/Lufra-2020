<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><i class="fas fa-cog mr-2"></i>Configuración del Sistema</h3>
          </div>
          <div class="card-body">
            <div v-if="cargando" class="text-center py-4">
              <div class="spinner-border text-primary"></div>
            </div>
            <div v-else>
              <!-- Tabs de configuración -->
              <ul class="nav nav-tabs" role="tablist">
                <li class="nav-item">
                  <a class="nav-link" :class="{ 'active': tabActivo === 'empresa' }" 
                     href="#" @click.prevent="tabActivo = 'empresa'">
                    <i class="fas fa-building"></i> Empresa
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" :class="{ 'active': tabActivo === 'sistema' }" 
                     href="#" @click.prevent="tabActivo = 'sistema'">
                    <i class="fas fa-sliders-h"></i> Sistema
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" :class="{ 'active': tabActivo === 'correo' }" 
                     href="#" @click.prevent="tabActivo = 'correo'">
                    <i class="fas fa-envelope"></i> Correo
                  </a>
                </li>
              </ul>

              <!-- Tab: Configuración de Empresa -->
              <div v-show="tabActivo === 'empresa'" class="tab-pane active mt-4">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="nombreEmpresa">Nombre de la Empresa</label>
                      <input v-model="formulario.nombre_empresa" type="text" class="form-control" 
                             id="nombreEmpresa" placeholder="Nombre de la empresa">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="ruc">RUC</label>
                      <input v-model="formulario.ruc" type="text" class="form-control" 
                             id="ruc" placeholder="RUC de la empresa">
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="direccion">Dirección</label>
                      <input v-model="formulario.direccion" type="text" class="form-control" 
                             id="direccion" placeholder="Dirección de la empresa">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="telefono">Teléfono</label>
                      <input v-model="formulario.telefono" type="tel" class="form-control" 
                             id="telefono" placeholder="Teléfono de contacto">
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="email">Email</label>
                      <input v-model="formulario.email" type="email" class="form-control" 
                             id="email" placeholder="Email de la empresa">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="moneda">Moneda por Defecto</label>
                      <select v-model="formulario.moneda" class="form-control" id="moneda">
                        <option value="USD">USD ($)</option>
                        <option value="DOP">DOP (RD$)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tab: Configuración del Sistema -->
              <div v-show="tabActivo === 'sistema'" class="tab-pane active mt-4">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="diasPrueba">Período de Prueba (días)</label>
                      <input v-model.number="formulario.dias_prueba" type="number" class="form-control" 
                             id="diasPrueba" placeholder="Días de prueba">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="maxUsuarios">Máximo de Usuarios</label>
                      <input v-model.number="formulario.max_usuarios" type="number" class="form-control" 
                             id="maxUsuarios" placeholder="Máximo de usuarios permitidos">
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <div class="custom-control custom-checkbox">
                        <input v-model="formulario.mantenimiento" type="checkbox" class="custom-control-input" 
                               id="mantenimiento">
                        <label class="custom-control-label" for="mantenimiento">
                          Modo Mantenimiento
                        </label>
                      </div>
                      <small class="form-text text-muted">
                        Activa el modo mantenimiento para todos los usuarios excepto administradores
                      </small>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <div class="custom-control custom-checkbox">
                        <input v-model="formulario.logs_activos" type="checkbox" class="custom-control-input" 
                               id="logsActivos">
                        <label class="custom-control-label" for="logsActivos">
                          Logs Activos
                        </label>
                      </div>
                      <small class="form-text text-muted">
                        Registra todas las acciones de usuario en el sistema
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tab: Configuración de Correo -->
              <div v-show="tabActivo === 'correo'" class="tab-pane active mt-4">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="mailerDriver">Controlador de Correo</label>
                      <select v-model="formulario.mail_driver" class="form-control" id="mailerDriver">
                        <option value="smtp">SMTP</option>
                        <option value="sendmail">Sendmail</option>
                        <option value="mailgun">Mailgun</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="mailHost">Host SMTP</label>
                      <input v-model="formulario.mail_host" type="text" class="form-control" 
                             id="mailHost" placeholder="smtp.mailtrap.io">
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="mailPort">Puerto SMTP</label>
                      <input v-model.number="formulario.mail_port" type="number" class="form-control" 
                             id="mailPort" placeholder="587">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="mailUsername">Usuario SMTP</label>
                      <input v-model="formulario.mail_username" type="text" class="form-control" 
                             id="mailUsername" placeholder="tu_usuario@ejemplo.com">
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="mailPassword">Contraseña SMTP</label>
                      <input v-model="formulario.mail_password" type="password" class="form-control" 
                             id="mailPassword" placeholder="••••••••">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="mailFrom">Email de Origen</label>
                      <input v-model="formulario.mail_from" type="email" class="form-control" 
                             id="mailFrom" placeholder="noreply@empresa.com">
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botones de acción -->
              <div class="mt-4">
                <button @click="guardarConfiguracion" class="btn btn-primary">
                  <i class="fas fa-save"></i> Guardar Cambios
                </button>
                <button @click="cancelar" class="btn btn-secondary ml-2">
                  <i class="fas fa-times"></i> Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Configuracion',
  data() {
    return {
      tabActivo: 'empresa',
      cargando: false,
      formulario: {
        nombre_empresa: '',
        ruc: '',
        direccion: '',
        telefono: '',
        email: '',
        moneda: 'DOP',
        dias_prueba: 30,
        max_usuarios: 100,
        mantenimiento: false,
        logs_activos: true,
        mail_driver: 'smtp',
        mail_host: '',
        mail_port: 587,
        mail_username: '',
        mail_password: '',
        mail_from: ''
      }
    }
  },
  mounted() {
    this.cargarConfiguracion();
  },
  methods: {
    async cargarConfiguracion() {
      this.cargando = true;
      try {
        const response = await axios.get('/configuracion/datos');
        if (response.data) {
          this.formulario = { ...this.formulario, ...response.data };
        }
      } catch (error) {
        // Si no está la ruta, usa datos por defecto
        console.log('Usando valores por defecto');
      } finally {
        this.cargando = false;
      }
    },
    async guardarConfiguracion() {
      try {
        const response = await axios.post('/configuracion', this.formulario);
        this.$toast.fire({
          icon: 'success',
          title: 'Configuración guardada correctamente'
        });
      } catch (error) {
        this.$toast.fire({
          icon: 'error',
          title: 'Error al guardar configuración',
          text: error.response?.data?.message || 'Intenta de nuevo'
        });
      }
    },
    cancelar() {
      this.tabActivo = 'empresa';
      this.cargarConfiguracion();
    }
  }
}
</script>

<style scoped>
.nav-tabs .nav-link {
  color: #6c757d;
  border: none;
  border-bottom: 2px solid transparent;
}

.nav-tabs .nav-link:hover {
  color: #495057;
  border-color: transparent;
}

.nav-tabs .nav-link.active {
  color: #0056b3;
  background-color: transparent;
  border-color: #0056b3;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.tab-pane {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
