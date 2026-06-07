<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
    <title>Reporte de Usuarios - LUFRA2020</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #1a1a2e;
            margin: 0;
            padding: 30px 40px;
            background: #f8f9fb;
        }

        /* ── Header ── */
        .report-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid #1e3a5f;
            padding-bottom: 16px;
            margin-bottom: 24px;
        }
        .report-header .logo h1 { margin: 0; color: #1e3a5f; font-size: 26px; letter-spacing: 1px; }
        .report-header .logo p  { margin: 4px 0 0; font-size: 12px; color: #6b7280; }
        .report-header .meta    { text-align: right; font-size: 12px; color: #6b7280; }
        .report-header .meta strong { color: #1e3a5f; }
        .report-title {
            text-align: center;
            font-size: 18px;
            font-weight: 700;
            color: #1e3a5f;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 22px;
        }

        /* ── Stats Row ── */
        .stats-row {
            display: flex;
            gap: 16px;
            margin-bottom: 22px;
        }
        .stat-card {
            flex: 1;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 14px 18px;
        }
        .stat-card .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; margin-bottom: 6px; }
        .stat-card .value { font-size: 28px; font-weight: 700; color: #1e3a5f; }
        .stat-card .sub   { font-size: 11px; color: #6b7280; margin-top: 4px; }
        .stat-bar { height: 8px; border-radius: 4px; background: #e2e8f0; overflow: hidden; margin-top: 8px; display: flex; }
        .stat-bar .bar-admin   { background: #1e3a5f; }
        .stat-bar .bar-worker  { background: #10b981; }

        /* ── Controls (no-print) ── */
        .controls {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-bottom: 18px;
        }
        .btn {
            padding: 9px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 13px;
            transition: opacity 0.2s;
        }
        .btn:hover { opacity: 0.85; }
        .btn-primary { background: #1e3a5f; color: white; }
        .btn-success { background: #10b981; color: white; }
        .btn-theme   { background: #374151; color: white; }

        /* ── Table ── */
        table { width: 100%; border-collapse: collapse; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
        thead tr { background: #1e3a5f; }
        th {
            color: white;
            padding: 12px 14px;
            text-align: left;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
            white-space: nowrap;
        }
        td { border-bottom: 1px solid #f1f5f9; padding: 11px 14px; font-size: 12px; color: #374151; vertical-align: middle; }
        tr:last-child td { border-bottom: none; }
        tr:nth-child(even) td { background: #f8fafc; }

        .badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            color: white;
        }
        .badge-super  { background: #1e3a5f; }
        .badge-admin  { background: #374151; }
        .badge-worker { background: #10b981; }

        .status-active   { color: #10b981; font-weight: 600; }
        .status-inactive { color: #ef4444; font-weight: 600; }

        /* ── Footer row (totals) ── */
        .table-footer td {
            background: #f0f4f9;
            font-weight: 700;
            font-size: 11px;
            color: #1e3a5f;
            border-top: 2px solid #1e3a5f;
        }

        /* ── Report Footer ── */
        .report-footer {
            margin-top: 36px;
            border-top: 1px solid #e2e8f0;
            padding-top: 14px;
            font-size: 10px;
            color: #9ca3af;
            display: flex;
            justify-content: space-between;
        }

        /* ── Dark Mode ── */
        body.dark-mode { background: #0d1117; color: #c9d1d9; }
        body.dark-mode .report-header { border-bottom-color: #30363d; }
        body.dark-mode .report-header .logo h1 { color: #58a6ff; }
        body.dark-mode .report-header .meta, body.dark-mode .report-header .meta strong { color: #8b949e; }
        body.dark-mode .report-title { color: #e6edf3; }
        body.dark-mode .stat-card { background: #161b22; border-color: #30363d; }
        body.dark-mode .stat-card .value { color: #e6edf3; }
        body.dark-mode .stat-bar { background: #21262d; }
        body.dark-mode table { background: #161b22; }
        body.dark-mode thead tr { background: #21262d; }
        body.dark-mode th { color: #8b949e; }
        body.dark-mode td { border-bottom-color: #21262d; color: #c9d1d9; }
        body.dark-mode tr:nth-child(even) td { background: #1a1f27; }
        body.dark-mode .table-footer td { background: #21262d; color: #58a6ff; border-top-color: #30363d; }
        body.dark-mode .report-footer { border-top-color: #30363d; color: #6e7681; }

        /* ── Print ── */
        @media print {
            .no-print { display: none !important; }
            body { margin: 15px 20px; background: white !important; color: black !important; padding: 0; }
            .report-header { border-bottom-color: #1e3a5f !important; }
            .report-header .logo h1 { color: #1e3a5f !important; }
            .stat-card { background: white !important; border: 1px solid #ddd !important; }
            .stat-card .value { color: #1e3a5f !important; }
            table { box-shadow: none !important; }
            thead tr { background: #1e3a5f !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            th { color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            td { border-bottom-color: #f0f0f0 !important; color: #333 !important; }
            .badge { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .table-footer td { background: #f5f5f5 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    @php
        $total    = $users->count();
        $activos  = $users->where('Estado', 'Activo')->count();
        $inactivos= $users->where('Estado', 'Inactivo')->count();
        $admins   = $users->filter(fn($u) => in_array($u->role, ['Administrativo','SuperUsuario']))->count();
        $workers  = $users->where('role','Trabajador')->count();
        $pctAdmin  = $total ? round($admins / $total * 100) : 0;
        $pctWorker = $total ? round($workers / $total * 100) : 0;
        
        $vinculados = $users->filter(fn($u) => !empty($u->Id_Trabajador))->count();
        $sinVincular = $total - $vinculados;
        $pctVinculados = $total ? round($vinculados / $total * 100) : 0;

        $conPreguntas = $users->filter(fn($u) => ($u->respuestas_seguridad_count ?? $u->respuestasSeguridad()->count()) > 0)->count();
        $sinPreguntas = $total - $conPreguntas;
        $pctSeguras = $total ? round($conPreguntas / $total * 100) : 0;
    @endphp

    <div class="no-print controls">
        <button onclick="exportCSV()" class="btn btn-success">⬇ Exportar CSV</button>
        <button onclick="toggleTheme()" class="btn btn-theme">🌙 Modo Claro/Oscuro</button>
        <button onclick="window.print()" class="btn btn-primary">🖨️ Imprimir / PDF</button>
    </div>

    <!-- Header -->
    <div class="report-header">
        <div class="logo">
            <h1>LUFRA2020</h1>
            <p>RIF: J-50032437-5 | Sistema de Gestión de Nómina</p>
        </div>
        <div class="meta">
            <p><strong>REPORTE DE USUARIOS</strong></p>
            <p>Fecha de Emisión: {{ now()->format('d/m/Y H:i') }}</p>
            <p>Generado por: {{ auth()->user()->Nombre_usuario ?? 'Sistema' }}</p>
        </div>
    </div>

    <div class="report-title">Reporte General de Usuarios del Sistema</div>

    <!-- Stats -->
    <div class="stats-row">
        <div class="stat-card">
            <div class="label">Total Usuarios</div>
            <div class="value">{{ $total }}</div>
            <div class="sub">Registrados en el sistema</div>
        </div>
        <div class="stat-card">
            <div class="label">Cuentas Activas</div>
            <div class="value" style="color:#10b981">{{ $activos }}</div>
            <div class="sub">{{ $inactivos }} inactiva(s)</div>
        </div>
        <div class="stat-card">
            <div class="label">Distribución de Personal</div>
            <div class="sub" style="margin-top:4px">Admins: <strong>{{ $admins }}</strong> | Trabajadores: <strong>{{ $workers }}</strong></div>
            <div class="stat-bar" style="margin-top:8px">
                <div class="bar-admin"  style="width:{{ $pctAdmin }}%"></div>
                <div class="bar-worker" style="width:{{ $pctWorker }}%"></div>
            </div>
            <div class="sub" style="margin-top:4px">Azul {{ $pctAdmin }}% | Verde {{ $pctWorker }}%</div>
        </div>
        <div class="stat-card">
            <div class="label">Cobertura de Vinculación</div>
            <div class="value" style="color:#0ea5e9">{{ $pctVinculados }}%</div>
            <div class="stat-bar" style="margin-top:8px">
                <div style="background:#0ea5e9; width:{{ $pctVinculados }}%; height:100%;"></div>
            </div>
            <div class="sub" style="margin-top:4px; display:flex; justify-content:space-between;">
                <span>{{ $vinculados }} vinculados</span>
                <span>{{ $sinVincular }} sin vincular</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="label">Seguridad de Cuentas</div>
            <div class="value" style="color:#f59e0b">{{ $pctSeguras }}%</div>
            <div class="stat-bar" style="margin-top:8px">
                <div style="background:#f59e0b; width:{{ $pctSeguras }}%; height:100%;"></div>
            </div>
            <div class="sub" style="margin-top:4px; display:flex; justify-content:space-between;">
                <span>{{ $conPreguntas }} seguras</span>
                <span style="color:#ef4444; font-weight:bold;">{{ $sinPreguntas }} en riesgo</span>
            </div>
        </div>
    </div>

    <!-- Table -->
    <table id="report-table">
        <thead>
            <tr>
                <th>#</th>
                <th>Usuario</th>
                <th>Nombre Completo</th>
                <th>Correo Electrónico</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Seguridad</th>
                <th>Trabajador Vinculado</th>
                <th>Último Acceso</th>
            </tr>
        </thead>
        <tbody>
            @foreach($users as $i => $user)
            @php
                $badgeClass = match(strtolower($user->role)) {
                    'superusuario'  => 'badge-super',
                    'administrativo'=> 'badge-admin',
                    default         => 'badge-worker',
                };
                $statusClass = ($user->Estado === 'Inactivo') ? 'status-inactive' : 'status-active';
                $tienePreguntas = ($user->respuestas_seguridad_count ?? $user->respuestasSeguridad()->count()) > 0;
            @endphp
            <tr>
                <td>{{ $i + 1 }}</td>
                <td><strong>{{ $user->Nombre_usuario }}</strong></td>
                <td>{{ $user->name ?? '—' }}</td>
                <td>{{ $user->Correo ?? '—' }}</td>
                <td><span class="badge {{ $badgeClass }}">{{ ucfirst($user->role) }}</span></td>
                <td><span class="{{ $statusClass }}">● {{ $user->Estado ?? 'Activo' }}</span></td>
                <td><span class="{{ $tienePreguntas ? 'status-active' : 'status-inactive' }}">{{ $tienePreguntas ? '🔒 Segura' : '⚠️ En riesgo' }}</span></td>
                <td>{{ $user->trabajador ? ($user->trabajador->Nombre_Completo . ' ' . $user->trabajador->Apellidos) : 'No vinculado' }}</td>
                <td>{{ $user->lastLoginAt ? $user->lastLoginAt->format('d/m/Y H:i') : '—' }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot class="table-footer">
            <tr>
                <td colspan="5">Total: {{ $total }} usuario(s)</td>
                <td>{{ $activos }} activo(s) / {{ $inactivos }} inactivo(s)</td>
                <td>{{ $conPreguntas }} segura(s) / {{ $sinPreguntas }} en riesgo</td>
                <td colspan="2">Reporte emitido: {{ now()->format('d/m/Y H:i') }}</td>
            </tr>
        </tfoot>
    </table>

    <div class="report-footer">
        <span>Este documento es un reporte oficial emitido por el sistema de gestión de nómina LUFRA2020.</span>
        <span>Documento generado el {{ now()->format('d/m/Y \a \l\a\s H:i') }}</span>
    </div>

    <script>
        // Theme
        function toggleTheme() {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('report-theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        }
        if (localStorage.getItem('theme') === 'dark' || localStorage.getItem('report-theme') === 'dark') {
            document.body.classList.add('dark-mode');
        }

        // CSV Export
        function exportCSV() {
            const rows = [['#','Usuario','Nombre Completo','Correo','Rol','Estado','Seguridad','Trabajador Vinculado','Último Acceso']];
            document.querySelectorAll('#report-table tbody tr').forEach(tr => {
                const cells = [...tr.querySelectorAll('td')].map(td => `"${td.innerText.replace(/"/g, '""').trim()}"`);
                rows.push(cells);
            });
            const csv = rows.map(r => r.join(',')).join('\n');
            const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `reporte_usuarios_${new Date().toISOString().slice(0,10)}.csv`;
            a.click();
        }
    </script>
</body>
</html>
