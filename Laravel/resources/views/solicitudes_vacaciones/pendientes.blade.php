@extends('layouts')
@section('content')
<div class="container-fluid">
  <div class="row">
    <div class="col-12">
      <h1 class="mb-4">
        <i class="fas fa-umbrella-beach mr-2"></i> Gestión de Solicitudes de Vacaciones
      </h1>
    </div>
  </div>

  <div class="row mb-3">
    <div class="col-md-6">
      <div class="btn-group" role="group">
        <button type="button" class="btn btn-primary active" onclick="filtrarEstado('todas')">
          <i class="fas fa-list"></i> Todas
        </button>
        <button type="button" class="btn btn-warning" onclick="filtrarEstado('pendiente')">
          <i class="fas fa-clock"></i> Pendientes
        </button>
        <button type="button" class="btn btn-success" onclick="filtrarEstado('aprobada')">
          <i class="fas fa-check-circle"></i> Aprobadas
        </button>
        <button type="button" class="btn btn-danger" onclick="filtrarEstado('rechazada')">
          <i class="fas fa-times-circle"></i> Rechazadas
        </button>
      </div>
    </div>
    <div class="col-md-6 text-right">
      @can('vacaciones.solicitar')
      <button type="button" class="btn btn-success" onclick="abrirModalCrear()">
        <i class="fas fa-plus"></i> Nueva Solicitud
      </button>
      @endcan
    </div>
  </div>

  <div class="row">
    <div class="col-12">
      <div class="card shadow-sm">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0"><i class="fas fa-table mr-2"></i> Solicitudes de Vacaciones</h5>
        </div>
        <div class="card-body">
          @if(session('success'))
            <div class="alert alert-success alert-dismissible fade show">
              <i class="fas fa-check-circle mr-2"></i> {{ session('success') }}
              <button type="button" class="close" data-dismiss="alert">&times;</button>
            </div>
          @endif

          @if(session('error'))
            <div class="alert alert-danger alert-dismissible fade show">
              <i class="fas fa-exclamation-circle mr-2"></i> {{ session('error') }}
              <button type="button" class="close" data-dismiss="alert">&times;</button>
            </div>
          @endif

          <div class="table-responsive">
            <table class="table table-striped table-hover" id="tablaSolicitudes">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Empleado</th>
                  <th>Tipo</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Días</th>
                  <th>Estado</th>
                  <th>Solicitado</th>
                  <th>Aprobado Por</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @forelse($solicitudes as $solicitud)
                  <tr data-estado="{{ $solicitud->estado }}">
                    <td>{{ $solicitud->id }}</td>
                    <td>
                      @if($solicitud->empleado && $solicitud->empleado->user)
                        <strong>{{ $solicitud->empleado->user->name }}</strong>
                        <br>
                        <small class="text-muted">{{ $solicitud->empleado->user->email }}</small>
                      @else
                        <span class="text-muted">Sin empleado</span>
                      @endif
                    </td>
                    <td>
                      <span class="badge badge-{{ $solicitud->tipo === 'vacaciones' ? 'info' : 'warning' }}">
                        {{ ucfirst($solicitud->tipo ?? 'vacaciones') }}
                      </span>
                    </td>
                    <td>{{ \Carbon\Carbon::parse($solicitud->fecha_inicio)->format('d/m/Y') }}</td>
                    <td>{{ \Carbon\Carbon::parse($solicitud->fecha_fin)->format('d/m/Y') }}</td>
                    <td>
                      <span class="badge badge-secondary">
                        {{ $solicitud->dias_solicitados ?? \Carbon\Carbon::parse($solicitud->fecha_inicio)->diffInDays(\Carbon\Carbon::parse($solicitud->fecha_fin)) + 1 }} días
                      </span>
                    </td>
                    <td>
                      @if($solicitud->estado === 'pendiente')
                        <span class="badge badge-warning">
                          <i class="fas fa-clock"></i> Pendiente
                        </span>
                      @elseif($solicitud->estado === 'aprobada')
                        <span class="badge badge-success">
                          <i class="fas fa-check"></i> Aprobada
                        </span>
                      @elseif($solicitud->estado === 'rechazada')
                        <span class="badge badge-danger">
                          <i class="fas fa-times"></i> Rechazada
                        </span>
                      @endif
                    </td>
                    <td>
                      <small>{{ $solicitud->created_at->format('d/m/Y H:i') }}</small>
                    </td>
                    <td>
                      @if($solicitud->aprobador)
                        <small>{{ $solicitud->aprobador->name }}</small>
                        <br>
                        <small class="text-muted">{{ $solicitud->fecha_aprobacion ? \Carbon\Carbon::parse($solicitud->fecha_aprobacion)->format('d/m/Y') : '' }}</small>
                      @else
                        <span class="text-muted">-</span>
                      @endif
                    </td>
                    <td>
                      <div class="btn-group" role="group">
                        <button type="button" class="btn btn-sm btn-info" onclick="verDetalle({{ $solicitud->id }}, '{{ addslashes($solicitud->empleado->user->name ?? 'Sin nombre') }}', '{{ $solicitud->fecha_inicio }}', '{{ $solicitud->fecha_fin }}', '{{ $solicitud->motivo ?? '' }}', '{{ $solicitud->observaciones ?? '' }}', '{{ $solicitud->estado }}')">
                          <i class="fas fa-eye"></i>
                        </button>
                        
                        @can('vacaciones.gestionar')
                          @if($solicitud->estado === 'pendiente')
                            <button type="button" class="btn btn-sm btn-success" onclick="aprobarSolicitud({{ $solicitud->id }})">
                              <i class="fas fa-check"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-danger" onclick="rechazarSolicitud({{ $solicitud->id }})">
                              <i class="fas fa-times"></i>
                            </button>
                          @endif
                        @endcan
                        
                        @can('vacaciones.solicitar')
                          @if($solicitud->estado === 'pendiente' && auth()->user()->empleado && $solicitud->empleado_id === auth()->user()->empleado->id)
                            <button type="button" class="btn btn-sm btn-warning" onclick="cancelarSolicitud({{ $solicitud->id }})">
                              <i class="fas fa-ban"></i>
                            </button>
                          @endif
                        @endcan
                      </div>
                    </td>
                  </tr>
                @empty
                  <tr>
                    <td colspan="10" class="text-center">
                      <div class="alert alert-info mb-0">
                        <i class="fas fa-info-circle mr-2"></i> No hay solicitudes de vacaciones registradas.
                      </div>
                    </td>
                  </tr>
                @endforelse
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Modal Crear Solicitud -->
<div class="modal fade" id="modalCrear" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header bg-success text-white">
        <h5 class="modal-title"><i class="fas fa-plus mr-2"></i> Nueva Solicitud de Vacaciones</h5>
        <button type="button" class="close text-white" data-dismiss="modal">&times;</button>
      </div>
      <form id="formCrear" onsubmit="crearSolicitud(event)">
        <div class="modal-body">
          <div class="form-group">
            <label for="fecha_inicio">Fecha Inicio <span class="text-danger">*</span></label>
            <input type="date" class="form-control" id="fecha_inicio" name="fecha_inicio" required min="{{ date('Y-m-d') }}">
          </div>
          <div class="form-group">
            <label for="fecha_fin">Fecha Fin <span class="text-danger">*</span></label>
            <input type="date" class="form-control" id="fecha_fin" name="fecha_fin" required min="{{ date('Y-m-d') }}">
          </div>
          <div class="form-group">
            <label for="motivo">Motivo</label>
            <textarea class="form-control" id="motivo" name="motivo" rows="3" placeholder="Opcional: Describe el motivo de tu solicitud"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
          <button type="submit" class="btn btn-success">
            <i class="fas fa-save"></i> Crear Solicitud
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

<!-- Modal Detalle -->
<div class="modal fade" id="modalDetalle" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header bg-info text-white">
        <h5 class="modal-title"><i class="fas fa-info-circle mr-2"></i> Detalle de Solicitud</h5>
        <button type="button" class="close text-white" data-dismiss="modal">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label><strong>Empleado:</strong></label>
          <p id="detalle-empleado"></p>
        </div>
        <div class="form-group">
          <label><strong>Período:</strong></label>
          <p id="detalle-periodo"></p>
        </div>
        <div class="form-group">
          <label><strong>Motivo:</strong></label>
          <p id="detalle-motivo"></p>
        </div>
        <div class="form-group">
          <label><strong>Estado:</strong></label>
          <p id="detalle-estado"></p>
        </div>
        <div class="form-group" id="detalle-observaciones-container" style="display:none;">
          <label><strong>Observaciones:</strong></label>
          <p id="detalle-observaciones"></p>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>

<script>
function filtrarEstado(estado) {
  const filas = document.querySelectorAll('#tablaSolicitudes tbody tr');
  const botones = document.querySelectorAll('.btn-group button');
  
  botones.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  filas.forEach(fila => {
    const estadoFila = fila.getAttribute('data-estado');
    if (estado === 'todas' || estadoFila === estado) {
      fila.style.display = '';
    } else {
      fila.style.display = 'none';
    }
  });
}

function verDetalle(id, empleado, inicio, fin, motivo, observaciones, estado) {
  document.getElementById('detalle-empleado').textContent = empleado;
  document.getElementById('detalle-periodo').textContent = `Del ${inicio} al ${fin}`;
  document.getElementById('detalle-motivo').textContent = motivo || 'Sin motivo especificado';
  
  let estadoBadge = '';
  if (estado === 'pendiente') {
    estadoBadge = '<span class="badge badge-warning">Pendiente</span>';
  } else if (estado === 'aprobada') {
    estadoBadge = '<span class="badge badge-success">Aprobada</span>';
  } else if (estado === 'rechazada') {
    estadoBadge = '<span class="badge badge-danger">Rechazada</span>';
  }
  document.getElementById('detalle-estado').innerHTML = estadoBadge;
  
  if (observaciones) {
    document.getElementById('detalle-observaciones').textContent = observaciones;
    document.getElementById('detalle-observaciones-container').style.display = 'block';
  } else {
    document.getElementById('detalle-observaciones-container').style.display = 'none';
  }
  
  $('#modalDetalle').modal('show');
}

function aprobarSolicitud(id) {
  Swal.fire({
    title: '¿Aprobar solicitud?',
    text: 'Se notificará al empleado sobre la aprobación',
    icon: 'question',
    input: 'textarea',
    inputPlaceholder: 'Observaciones (opcional)',
    showCancelButton: true,
    confirmButtonText: 'Sí, aprobar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#28a745'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/vacaciones/${id}/aprobar`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({
          observaciones: result.value || ''
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success || data.message) {
          Swal.fire({
            icon: 'success',
            title: 'Aprobada',
            text: data.message || 'La solicitud ha sido aprobada',
            timer: 2000
          }).then(() => {
            window.location.reload();
          });
        } else {
          throw new Error(data.error || 'Error al aprobar');
        }
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Ocurrió un error al aprobar la solicitud'
        });
      });
    }
  });
}

function rechazarSolicitud(id) {
  Swal.fire({
    title: '¿Rechazar solicitud?',
    input: 'textarea',
    inputLabel: 'Motivo del rechazo',
    inputPlaceholder: 'Escribe el motivo del rechazo...',
    inputValidator: (value) => {
      if (!value) {
        return 'Debe proporcionar un motivo para rechazar la solicitud';
      }
    },
    showCancelButton: true,
    confirmButtonText: 'Rechazar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc3545'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/vacaciones/${id}/rechazar`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({
          observaciones: result.value
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success || data.message) {
          Swal.fire({
            icon: 'success',
            title: 'Rechazada',
            text: data.message || 'La solicitud ha sido rechazada',
            timer: 2000
          }).then(() => {
            window.location.reload();
          });
        } else {
          throw new Error(data.error || 'Error al rechazar');
        }
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Ocurrió un error al rechazar la solicitud'
        });
      });
    }
  });
}

function abrirModalCrear() {
  document.getElementById('formCrear').reset();
  $('#modalCrear').modal('show');
}

function crearSolicitud(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const data = {
    fecha_inicio: formData.get('fecha_inicio'),
    fecha_fin: formData.get('fecha_fin'),
    motivo: formData.get('motivo')
  };
  
  fetch('/vacaciones/crear', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success || data.message) {
      $('#modalCrear').modal('hide');
      Swal.fire({
        icon: 'success',
        title: 'Creada',
        text: data.message || 'La solicitud ha sido creada correctamente',
        timer: 2000
      }).then(() => {
        window.location.reload();
      });
    } else {
      throw new Error(data.error || 'Error al crear la solicitud');
    }
  })
  .catch(error => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Ocurrió un error al crear la solicitud'
    });
  });
}

function cancelarSolicitud(id) {
  Swal.fire({
    title: '¿Cancelar solicitud?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cancelar',
    cancelButtonText: 'No',
    confirmButtonColor: '#ffc107'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/vacaciones/${id}/cancelar`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.success || data.message) {
          Swal.fire({
            icon: 'success',
            title: 'Cancelada',
            text: data.message || 'La solicitud ha sido cancelada',
            timer: 2000
          }).then(() => {
            window.location.reload();
          });
        } else {
          throw new Error(data.error || 'Error al cancelar');
        }
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Ocurrió un error al cancelar la solicitud'
        });
      });
    }
  });
}
</script>
@endsection
