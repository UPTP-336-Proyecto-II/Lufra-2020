<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Sistema de Nóminas - Vue SPA</title>
    
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="antialiased">
    <div id="app"></div>
    
    <script>
        // Datos del servidor disponibles para Vue
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
            contratoInfo: @json($contratoInfo ?? null)
        };
    </script>
</body>
</html>
    