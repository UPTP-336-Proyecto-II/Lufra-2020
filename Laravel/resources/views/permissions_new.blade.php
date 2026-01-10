@extends('layouts')

@section('content')
<div class="container-fluid">
    {{-- PERMISOS --}}
    <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h3 class="card-title mb-0"><i class="fas fa-shield-alt mr-1"></i> Gestión de Permisos</h3>
            <button class="btn btn-sm btn-primary" data-toggle="modal" data-target="#modalCrearPermiso">
                <i class="fas fa-plus"></i> Nuevo Permiso
            </button>
        </div>
        <div class="card-body">
            <!-- Búsqueda de permisos -->
            <form method="GET" action="{{ route('permissions.index') }}" class="mb-3">
                <div class="input-group">
                    <input type="text" name="search_permisos" class="form-control" 
                           placeholder="Buscar permiso por nombre o descripción..." 
                           value="{{ request('search_permisos') }}">
                    <div class="input-group-append">
                        <button class="btn btn-primary" type="submit">
                            <i class="fas fa-search"></i> Buscar
                        </button>
                        @if(request('search_permisos'))
                            <a href="{{ route('permissions.index') }}" class="btn btn-secondary">
                                <i class="fas fa-times"></i> Limpiar
                            </a>
                        @endif
                    </div>
                </div>
            </form>

            @if($lista->count())
                <div class="table-responsive">
                    <table class="table table-sm table-hover">
                        <thead class="thead-light">
                            <tr>
                                <th width="30%">Nombre</th>
                                <th width="50%">Descripción</th>
                                <th width="20%" class="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($lista as $permiso)
                                <tr>
                                    <td><code>{{ $permiso->name }}</code></td>
                                    <td>{{ $permiso->description ?? '-' }}</td>
                                    <td class="text-center">
                                        <button class="btn btn-xs btn-info" 
                                                data-toggle="modal" 
                                                data-target="#modalEditarPermiso"
                                                data-id="{{ $permiso->id }}"
                                                data-nombre="{{ $permiso->name }}"
                                                data-descripcion="{{ $permiso->description }}">
                                            <i class="fas fa-edit"></i> Editar
                                        </button>
                                        <button class="btn btn-xs btn-danger" 
                                                data-toggle="modal" 
                                                data-target="#modalEliminarPermiso"
                                                data-id="{{ $permiso->id }}"
                                                data-nombre="{{ $permiso->name }}">
                                            <i class="fas fa-trash"></i> Eliminar
                                        </button>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
                <div class="mt-3">
                    {{ $lista->appends(['search_permisos' => request('search_permisos')])->links('pagination::bootstrap-4') }}
                </div>
            @else
                @if(request('search_permisos'))
                    <div class="alert alert-info">
                        No se encontraron permisos que coincidan con "{{ request('search_permisos') }}".
                        <a href="{{ route('permissions.index') }}" class="alert-link">Ver todos</a>
                    </div>
                @else
                    <div class="alert alert-warning">
                        No hay permisos registrados. Crea el primero usando el botón "Nuevo Permiso".
                    </div>
                @endif
            @endif
        </div>
    </div>

    {{-- ASIGNAR PERMISOS A ROLES --}}
    <div class="card mt-3">
        <div class="card-header">
            <h3 class="card-title mb-0"><i class="fas fa-user-shield mr-1"></i> Asignar Permisos a Roles</h3>
        </div>
        <div class="card-body">
            @if($roles->count() && $lista->total() > 0)
                <form method="POST" action="{{ route('permissions.asignar') }}">
                    @csrf
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label class="font-weight-bold">Seleccionar Rol</label>
                                <select name="rol_id" class="form-control" required id="selectRol">
                                    <option value="">-- Seleccionar Rol --</option>
                                    @foreach($roles as $rol)
                                        <option value="{{ $rol->id }}">{{ $rol->name }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="form-group">
                                <label class="font-weight-bold">Permisos a Asignar</label>
                                <div class="border rounded p-3" style="max-height: 300px; overflow-y: auto;">
                                    @foreach($todosPermisos as $p)
                                        <div class="custom-control custom-checkbox">
                                            <input type="checkbox" 
                                                   class="custom-control-input permission-checkbox" 
                                                   id="perm_{{ $p->id }}" 
                                                   name="permisos[]" 
                                                   value="{{ $p->id }}">
                                            <label class="custom-control-label" for="perm_{{ $p->id }}">
                                                <code>{{ $p->name }}</code>
                                                @if($p->description)
                                                    <small class="text-muted">- {{ $p->description }}</small>
                                                @endif
                                            </label>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <button type="button" class="btn btn-sm btn-secondary" id="btnSeleccionarTodos">
                            <i class="fas fa-check-double"></i> Seleccionar Todos
                        </button>
                        <button type="button" class="btn btn-sm btn-secondary" id="btnDeseleccionarTodos">
                            <i class="fas fa-times"></i> Deseleccionar Todos
                        </button>
                        <button type="submit" class="btn btn-sm btn-primary">
                            <i class="fas fa-save"></i> Asignar Permisos al Rol
                        </button>
                    </div>
                </form>
            @else
                <div class="alert alert-info">
                    @if($roles->count() == 0)
                        No hay roles disponibles. Crea roles primero en la sección de Roles.
                    @else
                        No hay permisos disponibles. Crea permisos primero usando el botón "Nuevo Permiso".
                    @endif
                </div>
            @endif
        </div>
    </div>
</div>

{{-- MODAL: Crear Permiso --}}
<div class="modal fade" id="modalCrearPermiso" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <form method="POST" action="{{ route('permissions.store') }}">
                @csrf
                <div class="modal-header">
                    <h5 class="modal-title">Crear Nuevo Permiso</h5>
                    <button type="button" class="close" data-dismiss="modal">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="font-weight-bold">Nombre del Permiso <span class="text-danger">*</span></label>
                        <input type="text" name="nombre" class="form-control" 
                               placeholder="Ej: usuarios.crear" required>
                        <small class="form-text text-muted">
                            Formato recomendado: recurso.accion (ej: posts.edit, users.delete)
                        </small>
                    </div>
                    <div class="form-group">
                        <label class="font-weight-bold">Descripción</label>
                        <textarea name="descripcion" class="form-control" rows="3" 
                                  placeholder="Descripción del permiso (opcional)"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Crear Permiso
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

{{-- MODAL: Editar Permiso --}}
<div class="modal fade" id="modalEditarPermiso" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <form method="POST" action="{{ route('permissions.update') }}">
                @csrf
                <input type="hidden" name="permiso_id" id="edit_permiso_id">
                <div class="modal-header">
                    <h5 class="modal-title">Editar Permiso</h5>
                    <button type="button" class="close" data-dismiss="modal">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="font-weight-bold">Nombre del Permiso <span class="text-danger">*</span></label>
                        <input type="text" name="nombre" id="edit_nombre" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label class="font-weight-bold">Descripción</label>
                        <textarea name="descripcion" id="edit_descripcion" class="form-control" rows="3"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Actualizar
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

{{-- MODAL: Eliminar Permiso --}}
<div class="modal fade" id="modalEliminarPermiso" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <form method="POST" action="{{ route('permissions.destroy') }}">
                @csrf
                <input type="hidden" name="permiso_id" id="delete_permiso_id">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title">Eliminar Permiso</h5>
                    <button type="button" class="close text-white" data-dismiss="modal">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>¿Estás seguro de que deseas eliminar el permiso?</p>
                    <p class="font-weight-bold" id="delete_permiso_nombre"></p>
                    <div class="alert alert-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>Advertencia:</strong> Esta acción no se puede deshacer y eliminará el permiso de todos los roles que lo tengan asignado.
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-danger">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

@push('scripts')
<script>
$(document).ready(function() {
    // Modal Editar
    $('#modalEditarPermiso').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        $('#edit_permiso_id').val(button.data('id'));
        $('#edit_nombre').val(button.data('nombre'));
        $('#edit_descripcion').val(button.data('descripcion'));
    });

    // Modal Eliminar
    $('#modalEliminarPermiso').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        $('#delete_permiso_id').val(button.data('id'));
        $('#delete_permiso_nombre').text(button.data('nombre'));
    });

    // Seleccionar/Deseleccionar todos los permisos
    $('#btnSeleccionarTodos').click(function() {
        $('.permission-checkbox').prop('checked', true);
    });

    $('#btnDeseleccionarTodos').click(function() {
        $('.permission-checkbox').prop('checked', false);
    });

    // Cargar permisos del rol seleccionado
    $('#selectRol').change(function() {
        var rolId = $(this).val();
        if (!rolId) {
            $('.permission-checkbox').prop('checked', false);
            return;
        }

        // Aquí puedes hacer una petición AJAX para obtener los permisos del rol
        // Por ahora, simplemente deseleccionamos todos
        $('.permission-checkbox').prop('checked', false);
    });
});
</script>
@endpush

@endsection
