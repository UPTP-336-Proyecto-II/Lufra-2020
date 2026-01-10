<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Empleados - Vue.js</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-100">
    <div id="app">
        <div class="container mx-auto py-8 px-4">
            <div class="mb-6">
                <a href="{{ route('home') }}" class="text-blue-600 hover:text-blue-800">
                    ← Volver al inicio
                </a>
            </div>
            
            <h1 class="text-3xl font-bold text-gray-800 mb-8">Sistema de Nóminas - Vue.js</h1>
            
            <empleados-vue></empleados-vue>
        </div>
    </div>
</body>
</html>
