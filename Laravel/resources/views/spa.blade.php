<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Sistema de Nóminas - SPA</title>
    @vite(['resources/css/app.css', 'resources/js/app-spa.js'])
    <style>
        .nav-link {
            border-bottom: 2px solid transparent;
            padding: 1rem 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.2s;
        }
        .nav-link:hover {
            border-color: #d1d5db;
            color: #374151;
        }
        .nav-link.active {
            border-color: #6366f1;
            color: #111827;
        }
        .fade-enter-active, .fade-leave-active {
            transition: opacity 0.2s ease;
        }
        .fade-enter-from, .fade-leave-to {
            opacity: 0;
        }
    </style>
</head>
<body class="bg-gray-100">
    <div id="app"></div>
</body>
</html>
