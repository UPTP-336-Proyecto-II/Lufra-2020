@extends('layouts')
@section('content')
<div class="container-fluid">
  <div class="row">
    <div class="col-12">
      <h1 class="mb-4">
        <i class="fas fa-clock mr-2"></i> Solicitudes de Vacaciones Pendientes
      </h1>
    </div>
  </div>

  <div class="row">
    <div class="col-12">
      <div class="card shadow-sm">
        <div class="card-header bg-warning text-dark">
          <h5 class="mb-0"><i class="fas fa-list mr-2"></i> Solicitudes Pendientes de Aprobación</h5>
        </div>
        <div class="card-body">
          @if($solicitudes->isEmpty())
            <div class="alert alert-info">
              <i class="fas fa-info-circle mr-2"></i> No hay solicitudes pendientes.
            </div>
          @else
            <div class="table-responsive">
              <table class="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Empleado</th>
                    <th>Tipo</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Fin</th>
                    <th>Días</th>
                    <th>Motivo</th>
                    <th>Fecha Solicitud</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @foreach($solicitudes as $solicitud)
                    <tr>
                      <td>{{ $solicitud->id }}</td>
                      <td>
                        @if($solicitud->empleado)
                          {{ $solicitud->empleado->user->name ?? 'Sin nombre' }}
                        @else
                          <span class="text-muted">Sin empleado</span>
                        @endif
                      </td>
                      <td>
                        <span class="badge badge-{{ $solicitud->tipo === 'vacaciones' ? 'info' : 'warning' }}">
                          {{ ucfirst($solicitud->tipo) }}
                        </span>
                      </td>
                      <td>{{ \Carbon\Carbon::parse($solicitud->fecha_inicio)->format('d/m/Y') }}</td>
                      <td>{{ \Carbon\Carbon::parse($solicitud->fecha_fin)->format('d/m/Y') }}</td>
                      <td>{{ $solicitud->dias_solicitados ?? \Carbon\Carbon::parse($solicitud->fecha_inicio)->diffInDays(\Carbon\Carbon::parse($solicitud->fecha_fin)) + 1 }}</td>
                      <td>{{ $solicitud->motivo ?: '-' }}</td>
                      <td>{{ $solicitud->created_at->format('d/m/Y H:i') }}</td>
                      <td>
                        <div class="btn-group" role="group">
                          <button type="button" class="btn btn-sm btn-success" onclick="aprobarSolicitud({{ $solicitud->id }})">
                            <i class="fas fa-check"></i> Aprobar
                          </button>
                          <button type="button" class="btn btn-sm btn-danger" onclick="rechazarSolicitud({{ $solicitud->id }})">
                            <i class="fas fa-times"></i> Rechazar
                          </button>
                        </div>
                      </td>
                    </tr>
                  @endforeach
                </tbody>
              </table>
            </div>
          @endif
        </div>
      </div>
    </div>
  </div>
</div>

<script>
function aprobarSolicitud(id) {
  Swal.fire({
    title: '¿Aprobar solicitud?',
    text: 'Se notificará al empleado sobre la aprobación',
    icon: 'question',
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
        }
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
    inputLabel: 'Motivo del rechazo (opcional)',
    inputPlaceholder: 'Escribe el motivo...',
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
          observaciones: result.value || ''
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
</script>
@endsection
