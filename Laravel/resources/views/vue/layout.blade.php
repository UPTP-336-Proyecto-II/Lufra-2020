@extends('layouts')

@php
    $vueMode = true; // Indicar que estamos en modo Vue
@endphp

@section('content')
<!-- El div #app donde Vue se montará -->
<div id="app">
    <!-- Vue renderizará aquí el componente Dashboard -->
</div>

<script>
    // Datos del servidor disponibles para Vue ANTES de que Vite cargue
    window.__INITIAL_DATA__ = {
        empleados: {{ $empleados ?? 0 }},
        departamentos: {{ $departamentos ?? 0 }},
        contratos: {{ $contratos ?? 0 }},
        periodos: {{ $periodos ?? 0 }},
        recibos: {{ $recibos ?? 0 }},
        pagos: {{ $pagos ?? 0 }},
        esEmpleado: {{ $esEmpleado ? 'true' : 'false' }},
        ultimoPeriodo: @json($ultimoPeriodo ?? null),
        deps: @json($deps ?? []),
        contratosList: @json($contratosList ?? []),
        periodosList: @json($periodosList ?? []),
        recibosList: @json($recibosList ?? []),
        pagosList: @json($pagosList ?? []),
        metodosPago: @json($metodosPago ?? []),
        contratoInfo: @json($contratoInfo ?? null),
        recibosSinPago: @json($recibosSinPago ?? []),
        empleadosList: @json($empleadosList ?? []),
        monedas: @json($monedas ?? []),
        metodos: @json($metodos ?? []),
        conceptos: @json($conceptos ?? []),
        impuestos: @json($impuestos ?? []),
        userRoles: @json(auth()->user()->roles->pluck('name') ?? []),
        userPermissions: @json(auth()->user()->getAllPermissions()->pluck('name') ?? [])
    };
</script>

@vite(['resources/css/app.css', 'resources/js/app.js'])
@endsection

