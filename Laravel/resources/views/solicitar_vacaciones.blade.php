@extends('layouts')
@section('content')
<div class="container-fluid">
  <div class="row">
    <div class="col-12">
      <h1 class="mb-4">
        <i class="fas fa-umbrella-beach mr-2"></i> Solicitar Vacaciones y Permisos
      </h1>
    </div>
  </div>

  <div class="row">
    <div class="col-md-8">
      <div class="card shadow-sm mb-4">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0"><i class="fas fa-calendar-plus mr-2"></i> Nueva Solicitud</h5>
        </div>
        <div class="card-body">
          <form id="formSolicitud" method="POST" action="{{ route('vacaciones.crear') }}">
            @csrf
            <div class="form-group mb-3">
              <label for="fechaInicio" class="form-label">Fecha de Inicio</label>
              <input type="date" id="fechaInicio" name="fecha_inicio" class="form-control" required>
            </div>

            <div class="form-group mb-3">
              <label for="fechaFin" class="form-label">Fecha de Fin</label>
              <input type="date" id="fechaFin" name="fecha_fin" class="form-control" required>
            </div>

            <div class="form-group mb-3">
              <label for="tipo" class="form-label">Tipo</label>
              <select id="tipo" name="tipo" class="form-control" required>
                <option value="vacaciones">Vacaciones</option>
                <option value="permiso">Permiso</option>
              </select>
            </div>

            <div class="form-group mb-3">
              <label for="motivo" class="form-label">Motivo (Opcional)</label>
              <textarea id="motivo" name="motivo" class="form-control" rows="3"></textarea>
            </div>

            <button type="submit" class="btn btn-primary">
              <i class="fas fa-paper-plane mr-1"></i> Enviar Solicitud
            </button>
          </form>
        </div>
      </div>
    </div>

    <div class="col-md-4">
      <div class="card shadow-sm">
        <div class="card-header bg-info text-white">
          <h5 class="mb-0"><i class="fas fa-info-circle mr-2"></i> Información</h5>
        </div>
        <div class="card-body">
          <p><strong>Días de vacaciones disponibles:</strong> <span id="diasDisponibles">--</span></p>
          <p><strong>Días solicitados pendientes:</strong> <span id="diasPendientes">--</span></p>
          <hr>
          <small class="text-muted">
            Las solicitudes deben ser aprobadas por Recursos Humanos antes de ser efectivas.
          </small>
        </div>
      </div>
    </div>
  </div>

  <!-- Historial de Solicitudes -->
  <div class="row mt-4">
    <div class="col-12">
      <div class="card shadow-sm">
        <div class="card-header bg-secondary text-white">
          <h5 class="mb-0"><i class="fas fa-history mr-2"></i> Mis Solicitudes</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Días</th>
                  <th>Estado</th>
                  <th>Fecha Solicitud</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody id="tablaSolicitudes">
                <tr>
                  <td colspan="7" class="text-center text-muted">Cargando...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  cargarSolicitudes();
  cargarInfo();

  document.getElementById('formSolicitud').addEventListener('submit', function(e) {
    e.preventDefault();
    enviarSolicitud();
  });
});

function cargarSolicitudes() {
  fetch('/vacaciones/mis-solicitudes', {
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    const tbody = document.getElementById('tablaSolicitudes');
    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No hay solicitudes</td></tr>';
      return;
    }

    tbody.innerHTML = data.map(sol => `
      <tr>
        <td><span class="badge badge-${sol.tipo === 'vacaciones' ? 'info' : 'warning'}">${sol.tipo}</span></td>
        <td>${formatFecha(sol.fecha_inicio)}</td>
        <td>${formatFecha(sol.fecha_fin)}</td>
        <td>${sol.dias_solicitados || calcularDias(sol.fecha_inicio, sol.fecha_fin)}</td>
        <td><span class="badge badge-${getEstadoBadge(sol.estado)}">${sol.estado}</span></td>
        <td>${formatFecha(sol.created_at)}</td>
        <td>
          ${sol.estado === 'pendiente' ? `
            <button class="btn btn-sm btn-danger" onclick="cancelarSolicitud(${sol.id})">
              <i class="fas fa-times"></i> Cancelar
            </button>
          ` : '-'}
        </td>
      </tr>
    `).join('');
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('tablaSolicitudes').innerHTML = 
      '<tr><td colspan="7" class="text-center text-danger">Error al cargar solicitudes</td></tr>';
  });
}

function cargarInfo() {
  document.getElementById('diasDisponibles').textContent = '15';
  document.getElementById('diasPendientes').textContent = '0';
}

function enviarSolicitud() {
  const form = document.getElementById('formSolicitud');
  const formData = new FormData(form);

  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success || data.message) {
      Swal.fire({
        icon: 'success',
        title: 'Solicitud enviada',
        text: data.message || 'Tu solicitud ha sido enviada correctamente',
        timer: 2000
      });
      form.reset();
      cargarSolicitudes();
    } else {
      throw new Error(data.error || 'Error al enviar solicitud');
    }
  })
  .catch(error => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Ocurrió un error al enviar la solicitud'
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
    cancelButtonText: 'No'
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
          Swal.fire('Cancelada', 'La solicitud ha sido cancelada', 'success');
          cargarSolicitudes();
        } else {
          throw new Error(data.error || 'Error al cancelar');
        }
      })
      .catch(error => {
        Swal.fire('Error', error.message, 'error');
      });
    }
  });
}

function formatFecha(fecha) {
  if (!fecha) return '';
  return new Date(fecha).toLocaleDateString('es-ES');
}

function calcularDias(inicio, fin) {
  const start = new Date(inicio);
  const end = new Date(fin);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return diff + 1;
}

function getEstadoBadge(estado) {
  const badges = {
    'pendiente': 'warning',
    'aprobado': 'success',
    'rechazado': 'danger',
    'cancelado': 'secondary'
  };
  return badges[estado] || 'secondary';
}
</script>
@endsection
