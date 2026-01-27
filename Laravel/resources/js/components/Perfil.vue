<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><i class="fas fa-user mr-2"></i>Mi Perfil</h3>
          </div>
          <div class="card-body">
            <div v-if="cargando" class="text-center py-4">
              <div class="spinner-border text-primary"></div>
            </div>
            <div v-else>
              <!-- Tabs de perfil -->
              <ul class="nav nav-tabs" role="tablist">
                <li class="nav-item">
                  <a class="nav-link" :class="{ 'active': tabActivo === 'info' }" 
                     href="#" @click.prevent="tabActivo = 'info'">
                    <i class="fas fa-user-circle"></i> Información
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" :class="{ 'active': tabActivo === 'seguridad' }" 
                     href="#" @click.prevent="tabActivo = 'seguridad'">
                    <i class="fas fa-lock"></i> Seguridad
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" :class="{ 'active': tabActivo === 'preferencias' }" 
                     href="#" @click.prevent="tabActivo = 'preferencias'">
                    <i class="fas fa-sliders-h"></i> Preferencias
                  </a>
                </li>
              </ul>

              <!-- Tab: Información Personal -->
              <div v-show="tabActivo === 'info'" class="tab-pane active mt-4">
                
                <!-- Acciones Rápidas para Empleado -->
                <div class="alert alert-info mb-4" role="alert">
                  <h5 class="alert-heading mb-3">
                    <i class="fas fa-lightning-bolt"></i> Acciones Rápidas
                  </h5>
                  <div class="row">
                    <div class="col-md-6 mb-2">
                      <router-link to="/solicitar-vacaciones" class="btn btn-primary w-100">
                        <i class="fas fa-calendar-alt"></i> Solicitar Vacaciones
                      </router-link>
                    </div>
                    <div class="col-md-6 mb-2">
                      <router-link to="/mis-recibos" class="btn btn-success w-100">
                        <i class="fas fa-file-alt"></i> Ver Mis Recibos
                      </router-link>
                    </div>
                  </div>
                </div>

                <hr>

                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="nombre">Nombre Completo</label>
                      <input v-model="perfil.nombre" type="text" class="form-control" 
                             id="nombre" placeholder="Tu nombre completo">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="email">Email</label>
                      <input v-model="perfil.email" type="email" class="form-control" 
                             id="email" placeholder="tu@email.com">
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="telefono">Teléfono</label>
                      <input v-model="perfil.telefono" type="tel" class="form-control" 
                             id="telefono" placeholder="+1 234 567 8900">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="cedula">Cédula</label>
                      <input v-model="perfil.cedula" type="text" class="form-control" 
                             id="cedula" placeholder="Número de cédula">
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-12">
                    <div class="form-group">
                      <label for="departamento">Departamento</label>
                      <input v-model="perfil.departamento" type="text" class="form-control" 
                             id="departamento" placeholder="Tu departamento" disabled>
                    </div>
                  </div>
                </div>

                <button @click="guardarInfo" class="btn btn-primary">
                  <i class="fas fa-save"></i> Guardar Cambios
                </button>
              </div>

              <!-- Tab: Seguridad -->
              <div v-show="tabActivo === 'seguridad'" class="tab-pane active mt-4">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="passwordActual">Contraseña Actual</label>
                      <input v-model="seguridad.password_actual" type="password" class="form-control" 
                             id="passwordActual" placeholder="Ingresa tu contraseña actual">
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="passwordNueva">Contraseña Nueva</label>
                      <input v-model="seguridad.password_nueva" type="password" class="form-control" 
                             id="passwordNueva" placeholder="Ingresa la nueva contraseña">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="passwordConfirm">Confirmar Contraseña</label>
                      <input v-model="seguridad.password_confirm" type="password" class="form-control" 
                             id="passwordConfirm" placeholder="Confirma la nueva contraseña">
                    </div>
                  </div>
                </div>

                <button @click="cambiarPassword" class="btn btn-warning">
                  <i class="fas fa-key"></i> Cambiar Contraseña
                </button>
                
                <hr>
                <h5 class="mt-4">Sesiones Activas</h5>
                <button @click="cerrarSesionesOtras" class="btn btn-danger">
                  <i class="fas fa-sign-out-alt"></i> Cerrar Todas las Otras Sesiones
                </button>
              </div>

              <!-- Tab: Preferencias -->
              <div v-show="tabActivo === 'preferencias'" class="tab-pane active mt-4">
                <div class="form-group">
                  <div class="custom-control custom-checkbox">
                    <input v-model="preferencias.notificaciones_email" type="checkbox" class="custom-control-input" 
                           id="notificacionesEmail">
                    <label class="custom-control-label" for="notificacionesEmail">
                      Recibir notificaciones por email
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <div class="custom-control custom-checkbox">
                    <input v-model="preferencias.notificaciones_sms" type="checkbox" class="custom-control-input" 
                           id="notificacionesSMS">
                    <label class="custom-control-label" for="notificacionesSMS">
                      Recibir notificaciones por SMS
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <div class="custom-control custom-checkbox">
                    <input v-model="preferencias.modo_oscuro" type="checkbox" class="custom-control-input" 
                           id="modoOscuro">
                    <label class="custom-control-label" for="modoOscuro">
                      Modo oscuro
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label for="idioma">Idioma</label>
                  <select v-model="preferencias.idioma" class="form-control" id="idioma">
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="pt">Português</option>
                  </select>
                </div>

                <button @click="guardarPreferencias" class="btn btn-primary">
                  <i class="fas fa-save"></i> Guardar Preferencias
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
  name: 'Perfil',
  data() {
    return {
      tabActivo: 'info',
      cargando: false,
      perfil: {
        nombre: '',
        email: '',
        telefono: '',
        cedula: '',
        departamento: ''
      },
      seguridad: {
        password_actual: '',
        password_nueva: '',
        password_confirm: ''
      },
      preferencias: {
        notificaciones_email: true,
        notificaciones_sms: false,
        modo_oscuro: false,
        idioma: 'es'
      }
    };
  },
  mounted() {
    this.cargarPerfil();
  },
  methods: {
    async cargarPerfil() {
      this.cargando = true;
      try {
        const response = await axios.get('/perfil/datos');
        if (response.data) {
          this.perfil = { ...this.perfil, ...response.data.perfil };
          this.preferencias = { ...this.preferencias, ...response.data.preferencias };
        }
      } catch (error) {
        console.log('Usando datos por defecto');
      } finally {
        this.cargando = false;
      }
    },
    async guardarInfo() {
      try {
        await axios.post('/perfil/actualizar', { perfil: this.perfil });
        this.$toast.fire({
          icon: 'success',
          title: 'Información actualizada correctamente'
        });
      } catch (error) {
        this.$toast.fire({
          icon: 'error',
          title: 'Error al actualizar información'
        });
      }
    },
    async cambiarPassword() {
      if (this.seguridad.password_nueva !== this.seguridad.password_confirm) {
        this.$toast.fire({
          icon: 'error',
          title: 'Las contraseñas no coinciden'
        });
        return;
      }
      
      try {
        await axios.post('/perfil/cambiar-password', {
          password_actual: this.seguridad.password_actual,
          password_nueva: this.seguridad.password_nueva
        });
        this.$toast.fire({
          icon: 'success',
          title: 'Contraseña cambiada correctamente'
        });
        this.seguridad = {
          password_actual: '',
          password_nueva: '',
          password_confirm: ''
        };
      } catch (error) {
        this.$toast.fire({
          icon: 'error',
          title: error.response?.data?.message || 'Error al cambiar contraseña'
        });
      }
    },
    async cerrarSesionesOtras() {
      if (!confirm('¿Cerrar todas las otras sesiones?')) return;
      try {
        await axios.post('/perfil/logout-otros');
        this.$toast.fire({
          icon: 'success',
          title: 'Sesiones cerradas'
        });
      } catch (error) {
        this.$toast.fire({
          icon: 'error',
          title: 'Error al cerrar sesiones'
        });
      }
    },
    async guardarPreferencias() {
      try {
        await axios.post('/perfil/preferencias', { preferencias: this.preferencias });
        this.$toast.fire({
          icon: 'success',
          title: 'Preferencias guardadas'
        });
      } catch (error) {
        this.$toast.fire({
          icon: 'error',
          title: 'Error al guardar preferencias'
        });
      }
    }
  }
};
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
