<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Sistema de Nóminas - Administrativo</title>
    <link rel="stylesheet" href="{{ asset('css/Sistema.css') }}">
</head>
<body>

    <div class="sidebar">
        <h3>Sistema de Nóminas</h3>
        <div id="user-info" style="text-align:center; padding:10px;">
            <p id="username-display" style="margin:0; font-weight:600;">{{ auth()->user()->name }}</p>
            <form action="{{ route('logout') }}" method="POST">
                @csrf
                <button type="submit" id="logout-btn" style="margin-top:8px; padding:6px 10px; border-radius:4px; border:none; background:#e74c3c; color:white; cursor:pointer;">Cerrar sesión</button>
            </form>
        </div>
        <div id="module-navigation"></div>
    </div>

    <div class="main-content">
        <h1>Panel Administrativo </h1>
        

        <div class="content-box">
            <div id="content-header"></div>
            <div id="content-details"></div>
        </div>
    </div>

    
    <script src="{{ asset('js/Sistema.js') }}"></script>
    <script src="{{ asset('js/Admin.js') }}"></script>
    <script>
        window.laravelUser = {
            name: "{{ auth()->user()->name }}",
            role: "{{ auth()->user()->role }}"
        };
        // Set user role for Sistema.js to dynamically load modules
        window.userRole = "{{ auth()->user()->role }}";
    </script>
</body>
</html>
