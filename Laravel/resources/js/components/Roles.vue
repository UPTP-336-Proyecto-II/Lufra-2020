<template>
  <div>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h3 class="card-title"><i class="fas fa-user-shield mr-1"></i> Roles de Usuarios</h3>
            <form @submit.prevent="crearRol" class="form-inline">
              <input v-model="nuevoRol" class="form-control form-control-sm mr-2" placeholder="Nuevo rol" required />
              <button type="submit" class="btn btn-sm btn-primary"><i class="fas fa-plus mr-1"></i> Agregar rol</button>
            </form>
          </div>
          <div class="card-body">
            <div class="mb-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="mb-0"><i class="fas fa-edit mr-1"></i> Editar / Eliminar Roles</h6>
                <div class="form-inline">
                  <input v-model="searchRoles" @input="cargarRoles" class="form-control form-control-sm mr-2" placeholder="Buscar rol">
                </div>
              </div>
              <div class="table-responsive">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="rol in roles" :key="rol.id">
                      <td>{{ rol.name }}</td>
                      <td>{{ rol.guard_name || 'web' }}</td>
                      <td>
                        <button class="btn btn-xs btn-secondary" @click="toggleEditRol(rol.id)">Editar</button>
                        <button class="btn btn-xs btn-danger" @click="eliminarRol(rol.id)">Eliminar</button>
                      </td>
                    </tr>
                    <tr v-if="editandoRolId === rol.id" v-for="rol in roles" :key="'edit-' + rol.id" v-show="editandoRolId === rol.id">
                      <td colspan="3">
                        <form @submit.prevent="guardarRol(rol.id)" class="form-inline">
                          <input v-model="editRolNombre" class="form-control form-control-sm mr-2" required>
                          <button type="submit" class="btn btn-sm btn-success">Guardar</button>
                        </form>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-if="rolesPagination.last_page > 1" class="mt-3">
                <nav>
                  <ul class="pagination pagination-sm">
                    <li class="page-item" :class="{ disabled: rolesPagination.current_page === 1 }">
                      <a class="page-link" href="#" @click.prevent="cargarRoles(rolesPagination.current_page - 1)">Anterior</a>
                    </li>
                    <li class="page-item" v-for="page in rolesPagination.last_page" :key="page" :class="{ active: page === rolesPagination.current_page }">
                      <a class="page-link" href="#" @click.prevent="cargarRoles(page)">{{ page }}</a>
                    </li>
                    <li class="page-item" :class="{ disabled: rolesPagination.current_page === rolesPagination.last_page }">
                      <a class="page-link" href="#" @click.prevent="cargarRoles(rolesPagination.current_page + 1)">Siguiente</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

            <hr class="my-4">

            <div>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="mb-0"><i class="fas fa-users mr-1"></i> Asignar Roles a Usuarios</h6>
                <div class="form-inline">
                  <input v-model="searchUsers" @input="cargarUsuarios" class="form-control form-control-sm mr-2" placeholder="Buscar usuario">
                </div>
              </div>
              <div class="table-responsive">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Email</th>
                      <th>Editar roles</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="usuario in usuarios" :key="usuario.id">
                      <td>{{ usuario.name }}</td>
                      <td>{{ usuario.email }}</td>
                      <td>
                        <form @submit.prevent="asignarRoles(usuario.id)">
                          <label v-for="rol in roles" :key="rol.id" class="mr-2 mb-1">
                            <input type="checkbox" :value="rol.id" v-model="usuario.selectedRoles"> {{ rol.name }}
                          </label>
                          <button type="submit" class="btn btn-xs btn-secondary ml-2">Guardar</button>
                        </form>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-if="usuariosPagination.last_page > 1" class="mt-3">
                <nav>
                  <ul class="pagination pagination-sm">
                    <li class="page-item" :class="{ disabled: usuariosPagination.current_page === 1 }">
                      <a class="page-link" href="#" @click.prevent="cargarUsuarios(usuariosPagination.current_page - 1)">Anterior</a>
                    </li>
                    <li class="page-item" v-for="page in usuariosPagination.last_page" :key="page" :class="{ active: page === usuariosPagination.current_page }">
                      <a class="page-link" href="#" @click.prevent="cargarUsuarios(page)">{{ page }}</a>
                    </li>
                    <li class="page-item" :class="{ disabled: usuariosPagination.current_page === usuariosPagination.last_page }">
                      <a class="page-link" href="#" @click.prevent="cargarUsuarios(usuariosPagination.current_page + 1)">Siguiente</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><i class="fas fa-key mr-1"></i> Permisos</h3>
          </div>
          <div class="card-body">
            <ul v-if="permisos.length" class="list-unstyled mb-0">
              <li v-for="permiso in permisos" :key="permiso.id">
                <i class="fas fa-check text-success mr-1"></i> {{ permiso.name }}{{ permiso.description ? ' - ' + permiso.description : '' }}
              </li>
            </ul>
            <p v-else>No hay permisos definidos.</p>
            <p class="text-muted mt-2">Nota: solo el administrador puede asignar roles a los usuarios.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      roles: [],
      usuarios: [],
      permisos: [],
      nuevoRol: '',
      searchRoles: '',
      searchUsers: '',
      editandoRolId: null,
      editRolNombre: '',
      rolesPagination: {},
      usuariosPagination: {}
    };
  },
  mounted() {
    this.cargarRoles();
    this.cargarUsuarios();
    this.cargarPermisos();
  },
  methods: {
    async cargarRoles(page = 1) {
      try {
        const response = await axios.get('/api/roles', {
          params: { search: this.searchRoles, page }
        });
        this.roles = response.data.data || response.data;
        this.rolesPagination = response.data.meta || response.data;
      } catch (error) {
        console.error('Error al cargar roles:', error);
      }
    },
    async cargarUsuarios(page = 1) {
      try {
        const response = await axios.get('/api/usuarios', {
          params: { search: this.searchUsers, page }
        });
        this.usuarios = (response.data.data || response.data).map(u => ({
          ...u,
          selectedRoles: u.roles ? u.roles.map(r => r.id) : []
        }));
        this.usuariosPagination = response.data.meta || response.data;
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      }
    },
    async cargarPermisos() {
      try {
        const response = await axios.get('/api/permisos');
        this.permisos = response.data.data || response.data;
      } catch (error) {
        console.error('Error al cargar permisos:', error);
      }
    },
    async crearRol() {
      try {
        await axios.post('/api/roles', { nombre: this.nuevoRol });
        this.nuevoRol = '';
        this.cargarRoles();
        alert('Rol creado exitosamente');
      } catch (error) {
        console.error('Error al crear rol:', error);
        alert('Error al crear el rol');
      }
    },
    toggleEditRol(rolId) {
      if (this.editandoRolId === rolId) {
        this.editandoRolId = null;
        this.editRolNombre = '';
      } else {
        const rol = this.roles.find(r => r.id === rolId);
        this.editandoRolId = rolId;
        this.editRolNombre = rol.name;
      }
    },
    async guardarRol(rolId) {
      try {
        await axios.put(`/api/roles/${rolId}`, { nombre: this.editRolNombre });
        this.editandoRolId = null;
        this.editRolNombre = '';
        this.cargarRoles();
        alert('Rol actualizado exitosamente');
      } catch (error) {
        console.error('Error al actualizar rol:', error);
        alert('Error al actualizar el rol');
      }
    },
    async eliminarRol(rolId) {
      if (!confirm('¿Eliminar rol?')) return;
      try {
        await axios.delete(`/api/roles/${rolId}`);
        this.cargarRoles();
        alert('Rol eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar rol:', error);
        alert('Error al eliminar el rol');
      }
    },
    async asignarRoles(usuarioId) {
      const usuario = this.usuarios.find(u => u.id === usuarioId);
      try {
        await axios.post('/api/roles/asignar', {
          user_id: usuarioId,
          roles: usuario.selectedRoles
        });
        alert('Roles asignados exitosamente');
      } catch (error) {
        console.error('Error al asignar roles:', error);
        alert('Error al asignar roles');
      }
    }
  }
};
</script>
