@extends('layouts')

@section('content')
  <div class="container-fluid">
        @if($esEmpleado)
        {{-- VISTA EMPLEADO --}}
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h3 class="card-title mb-0"><i class="fas fa-file-invoice-dollar mr-1"></i> Mis pagos</h3>
          </div>
          <div class="card-body">
            <!-- Caja de búsqueda para empleados -->
            <form method="GET" action="{{ route('recibos_pagos') }}" class="mb-3">
              <div class="input-group">
                <input type="text" name="search_pagos" class="form-control" 
                       placeholder="Buscar por importe, método, estado o referencia..." 
                       value="{{ request('search_pagos') }}">
                <div class="input-group-append">
                  <button class="btn btn-primary" type="submit">
                    <i class="fas fa-search"></i> Buscar
                  </button>
                  @if(request('search_pagos'))
                    <a href="{{ route('recibos_pagos') }}" class="btn btn-secondary">
                      <i class="fas fa-times"></i> Limpiar
                    </a>
                  @endif
                </div>
              </div>
            </form>

            @if($pagos->count())
              <div class="table-responsive">
                <table class="table table-sm">
                  <thead><tr><th>Importe</th><th>Método</th><th>Descripción</th><th>Estado</th><th>Acciones</th></tr></thead>
                  <tbody>
                  @foreach($pagos as $p)
                    <tr>
                      <td>{{ number_format($p->importe,2) }}</td>
                      <td>{{ $p->metodo }}</td>
                      <td>{{ $p->referencia ?? '-' }}</td>
                      <td><span class="badge badge-{{ $p->estado === 'aceptado' ? 'success' : ($p->estado === 'rechazado' ? 'danger' : 'warning') }}">{{ $p->estado ?? 'pendiente' }}</span></td>
                      <td>
                        @if(($p->estado ?? 'pendiente') === 'pendiente')
                          <form method="POST" action="{{ route('pagos.aceptar', ['pago'=>$p->id]) }}" class="d-inline">@csrf<button class="btn btn-xs btn-success">Aceptar</button></form>
                          <form method="POST" action="{{ route('pagos.rechazar', ['pago'=>$p->id]) }}" class="d-inline" onsubmit="return confirm('¿Rechazar este pago?')">@csrf<button class="btn btn-xs btn-danger">Rechazar</button></form>
                        @else
                          <a class="btn btn-xs btn-outline-primary" target="_blank" href="{{ route('nomina.recibo.pdf', ['recibo'=>$p->recibo_id]) }}">Imprimir recibo</a>
                        @endif
                      </td>
                    </tr>
                  @endforeach
                  </tbody>
                </table>
              </div>
              <div class="mt-3">
                {{ $pagos->appends(['search_pagos' => request('search_pagos')])->links('pagination::bootstrap-4') }}
              </div>
            @else
              @if(request('search_pagos'))
                <div class="alert alert-info">
                  No se encontraron pagos que coincidan con "{{ request('search_pagos') }}".
                  <a href="{{ route('recibos_pagos') }}" class="alert-link">Ver todos</a>
                </div>
              @else
                <p>No hay pagos asignados.</p>
              @endif
            @endif
          </div>
        </div>
        @else
        {{-- VISTA ADMINISTRADOR --}}
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h3 class="card-title mb-0"><i class="fas fa-file-invoice-dollar mr-1"></i> Períodos de nómina</h3>
          </div>
          <div class="card-body">
            <!-- Caja de búsqueda de períodos -->
            <form method="GET" action="{{ route('recibos_pagos') }}" class="mb-3">
              <input type="hidden" name="q" value="{{ request('q') }}">
              <div class="input-group">
                <input type="text" name="search_periodos" class="form-control" 
                       placeholder="Buscar período por código, fecha o estado..." 
                       value="{{ request('search_periodos') }}">
                <div class="input-group-append">
                  <button class="btn btn-primary" type="submit">
                    <i class="fas fa-search"></i> Buscar
                  </button>
                  @if(request('search_periodos'))
                    <a href="{{ route('recibos_pagos') }}?q={{ request('q') }}" class="btn btn-secondary">
                      <i class="fas fa-times"></i> Limpiar
                    </a>
                  @endif
                </div>
              </div>
            </form>

            @if($periodos->count())
              <div class="table-responsive">
                <table class="table table-sm">
                  <thead><tr><th>Código</th><th>Inicio</th><th>Fin</th><th>Estado</th><th>Acciones</th></tr></thead>
                  <tbody>
                  @foreach($periodos as $p)
                    <tr>
                      <td>{{ $p->codigo }}</td>
                      <td>{{ $p->fecha_inicio }}</td>
                      <td>{{ $p->fecha_fin }}</td>
                      <td><span class="badge badge-{{ $p->estado === 'cerrado' ? 'success' : 'secondary' }}">{{ $p->estado }}</span></td>
                      <td>
                        <a class="btn btn-xs btn-outline-primary" href="{{ route('recibos_pagos.archivo_banco') }}">Archivo banco</a>
                        <a class="btn btn-xs btn-outline-secondary" href="{{ route('recibos_pagos.obligaciones') }}">Obligaciones</a>
                        <a class="btn btn-xs btn-outline-info" href="{{ route('recibos_pagos.reportes') }}">Reportes</a>
                      </td>
                    </tr>
                  @endforeach
                  </tbody>
                </table>
              </div>
              <div class="mt-3">
                {{ $periodos->appends(['q' => request('q'), 'search_periodos' => request('search_periodos')])->links('pagination::bootstrap-4') }}
              </div>
            @else
              @if(request('search_periodos'))
                <div class="alert alert-info">
                  No se encontraron períodos que coincidan con "{{ request('search_periodos') }}".
                  <a href="{{ route('recibos_pagos') }}" class="alert-link">Ver todos</a>
                </div>
              @else
                <p>No hay periodos de nómina.</p>
              @endif
            @endif
          </div>
        </div>

        <div class="card mt-3">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h3 class="card-title mb-0"><i class="fas fa-money-check-alt mr-1"></i> Pagos por asignar (recibos sin pago)</h3>
            <div class="d-flex align-items-center">
              <form method="GET" action="{{ route('recibos_pagos') }}" class="form-inline mr-2">
                <input type="hidden" name="search_periodos" value="{{ request('search_periodos') }}">
                <input type="text" name="q" value="{{ request('q','') }}" class="form-control form-control-sm mr-2" placeholder="Buscar empleado o #recibo">
                <button class="btn btn-sm btn-primary">
                  <i class="fas fa-search"></i> Buscar
                </button>
                @if(request('q'))
                  <a href="{{ route('recibos_pagos') }}?search_periodos={{ request('search_periodos') }}" class="btn btn-sm btn-secondary ml-2">
                    <i class="fas fa-times"></i>
                  </a>
                @endif
              </form>
              <a href="{{ route('conceptos.view') }}" class="btn btn-sm btn-outline-secondary mr-2">Conceptos</a>
              <a href="{{ route('metodos.view') }}" class="btn btn-sm btn-outline-secondary mr-2">Métodos</a>
              <a href="{{ route('monedas.view') }}" class="btn btn-sm btn-outline-secondary">Monedas</a>
            </div>
          </div>
          <div class="card-body">
            @if(count($recibosSinPago))
              <div class="table-responsive">
                <table class="table table-sm">
                  <thead><tr><th>Recibo</th><th>Período</th><th>Empleado</th><th>Neto</th><th>Importe</th><th>Moneda</th><th>Método</th><th>Concepto</th><th>Impuesto</th><th>Asignar</th></tr></thead>
                  <tbody>
                    @foreach($recibosSinPago as $r)
                      <tr>
                        <td>#{{ $r->id }}</td>
                        <td>
                          <span class="badge badge-{{ $r->periodo_estado === 'cerrado' ? 'success' : 'warning' }}">
                            {{ $r->periodo_codigo }}
                          </span>
                        </td>
                        <td>{{ $r->nombre }} {{ $r->apellido }}</td>
                        <td>{{ number_format($r->neto,2) }}</td>
                        <td>
                          <form method="POST" action="{{ route('pagos.asignar') }}" class="form-inline mb-0">
                            @csrf
                            <input type="hidden" name="recibo_id" value="{{ $r->id }}">
                            <input type="number" step="0.01" min="0" class="form-control form-control-sm mr-2" name="importe" value="{{ $r->neto }}" required style="width: 100px;">
                        </td>
                        <td>
                            <select name="moneda" class="form-control form-control-sm mr-2" required style="width: 100px;">
                              @foreach($monedas as $mon)
                                <option value="{{ $mon->codigo }}">{{ $mon->simbolo }} {{ $mon->codigo }}</option>
                              @endforeach
                            </select>
                        </td>
                        <td>
                            <select name="metodo" class="form-control form-control-sm mr-2" required style="width: 120px;">
                              @foreach($metodos as $m)
                                <option value="{{ $m->nombre }}">{{ $m->nombre }}</option>
                              @endforeach
                            </select>
                        </td>
                        <td>
                            <select name="concepto" class="form-control form-control-sm mr-2" style="width: 120px;">
                              <option value="">-- Seleccionar --</option>
                              @foreach($conceptos as $c)
                                <option value="{{ $c->nombre }}">{{ $c->nombre }}</option>
                              @endforeach
                            </select>
                        </td>
                        <td>
                            <select name="impuesto_id" class="form-control form-control-sm mr-2" style="width: 120px;">
                              <option value="">-- Sin impuesto --</option>
                              @foreach($impuestos as $imp)
                                <option value="{{ $imp->id }}" {{ $imp->por_defecto ? 'selected' : '' }}>
                                  {{ $imp->nombre }} ({{ number_format($imp->porcentaje, 2) }}%)
                                </option>
                              @endforeach
                            </select>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-primary">Asignar</button>
                          </form>
                        </td>
                      </tr>
                    @endforeach
                  </tbody>
                </table>
              </div>
              <div class="mt-3">
                {{ $recibosSinPago->appends(['q' => request('q'), 'search_periodos' => request('search_periodos')])->links('pagination::bootstrap-4') }}
              </div>
            @else
              @if(request('q'))
                <div class="alert alert-info">
                  No se encontraron recibos que coincidan con "{{ request('q') }}".
                  <a href="{{ route('recibos_pagos') }}?search_periodos={{ request('search_periodos') }}" class="alert-link">Ver todos</a>
                </div>
              @else
                <p>No hay recibos pendientes de pago.</p>
              @endif
            @endif
          </div>
        </div>

        <div class="card mt-3">
          <div class="card-header">
            <h3 class="card-title"><i class="fas fa-hand-holding-usd mr-1"></i> Pago manual (sin recibo)</h3>
          </div>
          <div class="card-body">
            <form method="POST" action="{{ route('pagos.manual') }}">
              @csrf
              <div class="row">
                <div class="col-md-3">
                  <div class="form-group">
                    <label class="small text-muted">Empleado</label>
                    <select name="empleado_id" class="form-control form-control-sm" required>
                      <option value="">-- Seleccionar --</option>
                      @foreach($empleados as $e)
                        <option value="{{ $e->id }}">{{ $e->nombre }} {{ $e->apellido }}</option>
                      @endforeach
                    </select>
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="form-group">
                    <label class="small text-muted">Importe</label>
                    <input type="number" step="0.01" min="0" name="importe" class="form-control form-control-sm" placeholder="0.00" required>
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="form-group">
                    <label class="small text-muted">Moneda</label>
                    <select name="moneda" class="form-control form-control-sm" required>
                      @foreach($monedas as $mon)
                        <option value="{{ $mon->codigo }}">{{ $mon->simbolo }} {{ $mon->codigo }}</option>
                      @endforeach
                    </select>
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="form-group">
                    <label class="small text-muted">Método</label>
                    <select name="metodo" class="form-control form-control-sm" required>
                      @foreach($metodos as $m)
                        <option value="{{ $m->nombre }}">{{ $m->nombre }}</option>
                      @endforeach
                    </select>
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="form-group">
                    <label class="small text-muted">Concepto</label>
                    <select name="descripcion" class="form-control form-control-sm">
                      <option value="">-- Opcional --</option>
                      @foreach($conceptos as $c)
                        <option value="{{ $c->nombre }}">{{ $c->nombre }}</option>
                      @endforeach
                    </select>
                  </div>
                </div>
                <div class="col-md-1">
                  <div class="form-group">
                    <label class="small text-muted d-block">&nbsp;</label>
                    <button type="submit" class="btn btn-sm btn-primary btn-block">
                      <i class="fas fa-save"></i> Crear
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        @endif
      </div>

@endsection
