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
            <div id="user-actions-container" style="display: flex; gap: 8px; justify-content: center; margin-top: 8px;">
                <form action="{{ route('logout') }}" method="POST" style="margin: 0; flex: 1;">
                    @csrf
                    <button type="submit" id="logout-btn" style="width: 100%; padding: 8px; border-radius: 4px; border: none; background: #e74c3c; color: white; cursor: pointer; font-size: 0.8em; font-weight: 500;">Salir</button>
                </form>
            </div>
        </div>
        <div id="module-navigation"></div>
        <div style="padding: 20px; text-align: center; padding-bottom: 25px;">
            <img src="{{ asset('img/logo-exacto.png') }}" alt="Logo Lufra" style="width: 230px; max-width: 100%; height: auto; border-radius: 8px;" />
        </div>
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
