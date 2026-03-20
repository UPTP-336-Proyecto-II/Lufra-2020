<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Usuarios - LUFRA2020</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; margin: 40px; transition: background 0.3s, color 0.3s; }
        body.dark-mode { background-color: #0d1117; color: #c9d1d9; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0070c0; padding-bottom: 10px; margin-bottom: 30px; }
        body.dark-mode .header { border-bottom-color: #30363d; }
        .logo h1 { color: #0070c0; margin: 0; }
        body.dark-mode .logo h1 { color: #10a87a; }
        .info { text-align: right; }
        h2 { text-align: center; color: #2c3e50; text-transform: uppercase; margin-bottom: 20px; }
        body.dark-mode h2 { color: #e6edf3; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #2c3e50; color: white; padding: 12px; text-align: left; font-size: 12px; }
        body.dark-mode th { background-color: #21262d; color: #8b949e; }
        td { border-bottom: 1px solid #eee; padding: 12px; font-size: 13px; }
        body.dark-mode td { border-bottom-color: #30363d; }
        .status-active { color: #27ae60; font-weight: bold; }
        .status-inactive { color: #e74c3c; font-weight: bold; }
        .footer { margin-top: 50px; font-size: 11px; text-align: center; color: #7f8c8d; }
        
        .controls { margin-bottom: 20px; text-align: right; display: flex; justify-content: flex-end; gap: 10px; }
        .btn { padding: 10px 20px; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 600; }
        .btn-print { background: #0070c0; }
        .btn-theme { background: #2c3e50; }
        body.dark-mode .btn-theme { background: #30363d; }

        @media print {
            .no-print { display: none; }
            body { margin: 20px; background: white !important; color: black !important; }
            .header { border-bottom-color: #0070c0 !important; }
            .logo h1 { color: #0070c0 !important; }
            h2 { color: #2c3e50 !important; }
            th { background-color: #2c3e50 !important; color: white !important; }
            td { border-bottom-color: #eee !important; }
        }
    </style>
</head>
<body class="">
    <div class="no-print controls">
        <button onclick="toggleTheme()" class="btn btn-theme">Modo Claro/Oscuro</button>
        <button onclick="window.print()" class="btn btn-print">Imprimir PDF</button>
    </div>

    <script>
        function toggleTheme() {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('report-theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        }
        if (localStorage.getItem('theme') === 'dark' || localStorage.getItem('report-theme') === 'dark') {
            document.body.classList.add('dark-mode');
        }
    </script>

    <div class="header">
        <div class="logo">
            <h1>LUFRA2020</h1>
            <p>J-50032437-5 | Gestión de Nómina</p>
        </div>
        <div class="info">
            <p><strong>Fecha de Emisión:</strong> {{ now()->format('d/m/Y H:i') }}</p>
            <p><strong>Generado por:</strong> {{ auth()->user()->name }}</p>
        </div>
    </div>

    <h2>Reporte General de Usuarios</h2>

    <table>
        <thead>
            <tr>
                <th>USUARIO</th>
                <th>CORREO ELECTRÓNICO</th>
                <th>ROL</th>
                <th>ESTADO</th>
                <th>TRABAJADOR ASOCIADO</th>
            </tr>
        </thead>
        <tbody>
            @foreach($users as $user)
            <tr>
                <td><strong>{{ $user->username ?? $user->name }}</strong></td>
                <td>{{ $user->email }}</td>
                <td>{{ $user->role }}</td>
                <td>
                    <span class="{{ $user->Estado === 'Inactivo' ? 'status-inactive' : 'status-active' }}">
                        ● {{ $user->Estado ?? 'Activo' }}
                    </span>
                </td>
                <td>{{ $user->trabajador ? ($user->trabajador->Nombres . ' ' . $user->trabajador->Apellidos) : 'No vinculado' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Este documento es un reporte oficial emitido por el sistema de gestión de nómina LUFRA2020.</p>
    </div>
</body>
</html>
