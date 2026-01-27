<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\PerfilController;
use App\Http\Controllers\NominaController;
use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\ContratoController;
use App\Http\Controllers\RecibosPagosController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\RolController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PageController;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Página de inicio
Route::get('/', fn() => view('welcome'));
Route::get('/inicio', [HomeController::class, 'index'])->name('inicio');

// Ruta temporal pública para probar el listado de themes (quita en producción)
Route::get('/themes-test', [\App\Http\Controllers\ThemeController::class, 'index'])->name('themes.test');

// Ruta de diagnóstico: devuelve JSON con los registros en la tabla `themes`
Route::get('/themes-debug', function () {
    try {
        $themes = \App\Models\Theme::all();
        return response()->json([
            'count' => $themes->count(),
            'items' => $themes,
        ]);
    } catch (\Throwable $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

// Authentication
Route::get('/registro', [RegisterController::class, 'show'])->name('register');
Route::post('/registro', [RegisterController::class, 'register'])->name('register.post');
Route::get('/login', [LoginController::class, 'show'])->name('login');
Route::post('/login', [LoginController::class, 'login'])->name('login.post');
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// Password Reset
Route::get('/forgot-password', [ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.request');
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
Route::get('/reset-password/{token}', [ResetPasswordController::class, 'showResetForm'])->name('password.reset');
Route::post('/reset-password', [ResetPasswordController::class, 'reset'])->name('password.update');

// Dashboard
Route::get('/home', [DashboardController::class, 'index'])->middleware('auth')->name('home');

/*
|--------------------------------------------------------------------------
| Rutas Protegidas
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    
    // Roles y Permisos - Solo Administrador
    Route::middleware('role:administrador')->group(function () {
        Route::get('/roles', [RolController::class, 'index'])->name('roles.index');
        Route::post('/roles/nuevo', [RolController::class, 'store'])->name('roles.nuevo');
        Route::post('/roles/asignar', [RolController::class, 'asignar'])->name('roles.asignar');
        Route::post('/roles/editar', [RolController::class, 'update'])->name('roles.editar');
        Route::post('/roles/eliminar', [RolController::class, 'destroy'])->name('roles.eliminar');
        Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.index');
        Route::post('/permissions/store', [PermissionController::class, 'store'])->name('permissions.store');
        Route::post('/permissions/asignar', [PermissionController::class, 'asignar'])->name('permissions.asignar');
        Route::post('/permissions/update', [PermissionController::class, 'update'])->name('permissions.update');
        Route::post('/permissions/destroy', [PermissionController::class, 'destroy'])->name('permissions.destroy');
    });

    // Perfil de Usuario
    Route::get('/perfil', [PerfilController::class, 'index'])->name('perfil');
    Route::post('/perfil', [PerfilController::class, 'update'])->name('perfil.update');
    Route::post('/perfil/desactivar', [PerfilController::class, 'desactivar'])->name('perfil.desactivar');

    // Nóminas y Períodos - Admin Nóminas y Contador
    // Nóminas
    Route::get('/nominas', [NominaController::class, 'index'])
        ->middleware('role:administrador|admin_nominas|contador|supervisor')
        ->name('nominas.index');

    Route::post('/nominas/periodo/crear', [PayrollController::class, 'createPeriod'])
        ->middleware('role:administrador|admin_nominas')
        ->name('nominas.periodo.crear');

    Route::post('/nominas/periodo/cerrar', [PayrollController::class, 'closePeriod'])
        ->middleware('role:administrador|admin_nominas|contador')
        ->name('nominas.periodo.cerrar');

    Route::post('/nominas/periodo/reabrir', [PayrollController::class, 'reopenPeriod'])
        ->middleware('role:administrador|admin_nominas')
        ->name('nominas.periodo.reabrir');

    // Recibos y Pagos - Admin Nóminas y Contador
    Route::get('/recibos-pagos', [RecibosPagosController::class, 'index'])
        ->middleware('role:empleado|administrador|admin_nominas|contador|supervisor')
        ->name('recibos_pagos');
    Route::get('/recibos-pagos/reportes', [RecibosPagosController::class, 'reportes'])
        ->middleware('role:administrador|admin_nominas|contador|supervisor')
        ->name('recibos_pagos.reportes');
    Route::get('/recibos-pagos/reportes/detalle', [RecibosPagosController::class, 'reportesDetalle'])
        ->middleware('role:administrador|admin_nominas|contador|supervisor')
        ->name('recibos_pagos.reportes_detalle');
    Route::get('/recibos-pagos/archivo-banco', [RecibosPagosController::class, 'archivoBanco'])
        ->middleware('role:administrador|admin_nominas|contador|supervisor')
        ->name('recibos_pagos.archivo_banco');
    Route::get('/recibos-pagos/obligaciones', [RecibosPagosController::class, 'obligaciones'])
        ->middleware('role:administrador|admin_nominas|contador|supervisor')
        ->name('recibos_pagos.obligaciones');
    Route::post('/pagos/asignar', [RecibosPagosController::class, 'asignarPago'])
        ->middleware('role:administrador|admin_nominas|contador|supervisor')
        ->name('pagos.asignar');
    Route::post('/pagos/manual', [RecibosPagosController::class, 'pagoManual'])
        ->middleware('role:administrador|admin_nominas|contador|supervisor')
        ->name('pagos.manual');
    Route::post('/pagos/{pago}/aceptar', [RecibosPagosController::class, 'aceptar'])
        ->middleware('role:empleado|administrador|admin_nominas|contador|supervisor')
        ->name('pagos.aceptar');
    Route::post('/pagos/{pago}/rechazar', [RecibosPagosController::class, 'rechazar'])
        ->middleware('role:empleado|administrador|admin_nominas|contador|supervisor')
        ->name('pagos.rechazar');

    // Empleados - Solo Admin RRHH puede crear/editar/eliminar
    // Empleados
    Route::get('/empleados', [EmpleadoController::class, 'index'])
        ->middleware('role:administrador|admin_rrhh|admin_nominas|contador|supervisor')
        ->name('empleados.index');

    Route::get('/empleados/detalle/{userId}', [EmpleadoController::class, 'detalle'])
        ->middleware('role:administrador|admin_rrhh|admin_nominas|contador|supervisor')
        ->name('empleados.detalle');

    Route::post('/empleados/crear', [EmpleadoController::class, 'crear'])
        ->middleware('role:administrador|admin_rrhh')
        ->name('empleados.crear');

    Route::post('/empleados/editar', [EmpleadoController::class, 'editar'])
        ->middleware('role:administrador|admin_rrhh')
        ->name('empleados.editar');

    Route::post('/empleados/eliminar', [EmpleadoController::class, 'eliminar'])
        ->middleware('role:administrador|admin_rrhh')
        ->name('empleados.eliminar');

    Route::post('/empleados/password', [EmpleadoController::class, 'cambiarPassword'])
        ->middleware('role:administrador|admin_rrhh')
        ->name('empleados.password');

    Route::post('/empleados/asignar-departamento', [EmpleadoController::class, 'asignarDepartamento'])
        ->middleware('role:administrador|admin_rrhh')
        ->name('empleados.asignar_departamento');
    
    // Solicitudes de Vacaciones - Redirección a gestionar
    Route::get('/solicitar-vacaciones', function() {
        return redirect()->route('vacaciones.gestionar');
    })->middleware('role:empleado|administrador|admin_rrhh');
    
    // Gestión de Vacaciones - Vista principal CRUD (todos pueden ver)
    Route::get('/vacaciones/gestionar', [App\Http\Controllers\SolicitudVacacionesController::class, 'index'])
        ->middleware('role:empleado|administrador|admin_rrhh')
        ->name('vacaciones.gestionar');
    
    Route::get('/vacaciones/mis-solicitudes', [App\Http\Controllers\SolicitudVacacionesController::class, 'misSolicitudes'])
        ->middleware('role:empleado|administrador|admin_rrhh')
        ->name('vacaciones.mis_solicitudes');

    Route::post('/vacaciones/crear', [App\Http\Controllers\SolicitudVacacionesController::class, 'store'])
        ->middleware('role:empleado|administrador|admin_rrhh')
        ->name('vacaciones.crear');

    Route::post('/vacaciones/{id}/cancelar', [App\Http\Controllers\SolicitudVacacionesController::class, 'cancelar'])
        ->middleware('role:empleado|administrador|admin_rrhh')
        ->name('vacaciones.cancelar');

    // Solicitudes de Vacaciones - RR.HH. aprueba/rechaza
    Route::get('/vacaciones/pendientes', [App\Http\Controllers\SolicitudVacacionesController::class, 'pendientes'])
        ->middleware('role:administrador|admin_rrhh')
        ->name('vacaciones.pendientes');

    Route::post('/vacaciones/{id}/aprobar', [App\Http\Controllers\SolicitudVacacionesController::class, 'aprobar'])
        ->middleware('role:administrador|admin_rrhh')
        ->name('vacaciones.aprobar');

    Route::post('/vacaciones/{id}/rechazar', [App\Http\Controllers\SolicitudVacacionesController::class, 'rechazar'])
        ->middleware('role:administrador|admin_rrhh')
        ->name('vacaciones.rechazar');
    
    // Vista Vue.js
    Route::get('/app-vue', function() {
        return view('vue.app');
    })->name('app.vue');


    // API para Vue.js
    Route::get('/api/empleados/vue', [EmpleadoController::class, 'apiEmpleados'])
        ->middleware('role:administrador|admin_rrhh|admin_nominas|contador|supervisor')
        ->name('api.empleados.vue');
    Route::get('/api/empleados', [EmpleadoController::class, 'apiEmpleados'])
        ->middleware('role:administrador|admin_rrhh|admin_nominas|contador|supervisor')
        ->name('api.empleados');
    Route::post('/api/empleados', [EmpleadoController::class, 'apiCrearEmpleado'])
        ->middleware('role:administrador|admin_rrhh')
        ->name('api.empleados.crear');
    Route::get('/api/empleados/{id}', [EmpleadoController::class, 'apiObtenerEmpleado'])
        ->middleware('role:administrador|admin_rrhh|admin_nominas|contador|supervisor')
        ->name('api.empleados.obtener');
    Route::put('/api/empleados/{id}', [EmpleadoController::class, 'apiActualizarEmpleado'])
        ->middleware('role:administrador|admin_rrhh')
        ->name('api.empleados.actualizar');
    Route::delete('/api/empleados/{id}', [EmpleadoController::class, 'apiEliminarEmpleado'])
        ->middleware('role:administrador|admin_rrhh')
        ->name('api.empleados.eliminar');
    Route::get('/api/departamentos', [\App\Http\Controllers\DepartamentoController::class, 'apiDepartamentos'])
        ->middleware('role:administrador|admin_rrhh')
        ->name('api.departamentos');
    Route::get('/api/contratos', [\App\Http\Controllers\ContratoController::class, 'apiContratos'])
        ->middleware('role:administrador|admin_rrhh|admin_nominas|contador|supervisor')
        ->name('api.contratos');
    Route::post('/api/contratos', [\App\Http\Controllers\ContratoController::class, 'crear'])
        ->middleware('role:administrador|admin_rrhh')
        ->name('api.contratos.crear');
    
    // API para Conceptos, Métodos y Monedas
    Route::get('/api/conceptos', [\App\Http\Controllers\ConceptoPagoController::class, 'apiIndex'])
        ->middleware('role:administrador|admin_nominas|contador|supervisor')
        ->name('api.conceptos');
    Route::post('/api/conceptos', [\App\Http\Controllers\ConceptoPagoController::class, 'apiStore'])
        ->middleware('role:administrador|admin_nominas')
        ->name('api.conceptos.crear');
    Route::put('/api/conceptos/{id}', [\App\Http\Controllers\ConceptoPagoController::class, 'apiUpdate'])
        ->middleware('role:administrador|admin_nominas')
        ->name('api.conceptos.actualizar');
    Route::delete('/api/conceptos/{id}', [\App\Http\Controllers\ConceptoPagoController::class, 'apiDestroy'])
        ->middleware('role:administrador|admin_nominas')
        ->name('api.conceptos.eliminar');
    
    Route::get('/api/metodos', [\App\Http\Controllers\MetodoPagoController::class, 'apiIndex'])
        ->middleware('role:administrador|admin_nominas|contador|supervisor')
        ->name('api.metodos');
    Route::post('/api/metodos', [\App\Http\Controllers\MetodoPagoController::class, 'apiStore'])
        ->middleware('role:administrador|admin_nominas')
        ->name('api.metodos.crear');
    Route::put('/api/metodos/{id}', [\App\Http\Controllers\MetodoPagoController::class, 'apiUpdate'])
        ->middleware('role:administrador|admin_nominas')
        ->name('api.metodos.actualizar');
    Route::delete('/api/metodos/{id}', [\App\Http\Controllers\MetodoPagoController::class, 'apiDestroy'])
        ->middleware('role:administrador|admin_nominas')
        ->name('api.metodos.eliminar');
    
    Route::get('/api/monedas', [\App\Http\Controllers\MonedaController::class, 'apiIndex'])
        ->middleware('role:administrador|admin_nominas|contador|supervisor')
        ->name('api.monedas');
    Route::post('/api/monedas', [\App\Http\Controllers\MonedaController::class, 'apiStore'])
        ->middleware('role:administrador|admin_nominas')
        ->name('api.monedas.crear');
    Route::put('/api/monedas/{id}', [\App\Http\Controllers\MonedaController::class, 'apiUpdate'])
        ->middleware('role:administrador|admin_nominas')
        ->name('api.monedas.actualizar');
    Route::delete('/api/monedas/{id}', [\App\Http\Controllers\MonedaController::class, 'apiDestroy'])
        ->middleware('role:administrador|admin_nominas')
        ->name('api.monedas.eliminar');
    
    // API Impuestos
    Route::get('/api/impuestos', [\App\Http\Controllers\ImpuestosController::class, 'apiIndex'])
        ->middleware('role:administrador|admin_nominas|contador')
        ->name('api.impuestos');
    Route::post('/api/impuestos', [\App\Http\Controllers\ImpuestosController::class, 'apiStore'])
        ->middleware('role:administrador|admin_nominas')
        ->name('api.impuestos.crear');
    Route::put('/api/impuestos/{id}', [\App\Http\Controllers\ImpuestosController::class, 'apiUpdate'])
        ->middleware('role:administrador|admin_nominas')
        ->name('api.impuestos.actualizar');
    Route::delete('/api/impuestos/{id}', [\App\Http\Controllers\ImpuestosController::class, 'apiDestroy'])
        ->middleware('role:administrador|admin_nominas')
        ->name('api.impuestos.eliminar');
    Route::post('/api/impuestos/{id}/toggle', [\App\Http\Controllers\ImpuestosController::class, 'apiToggle'])
        ->middleware('role:administrador|admin_nominas')
        ->name('api.impuestos.toggle');
    
    // API Archivo Banco
    Route::get('/api/archivo-banco', [RecibosPagosController::class, 'apiArchivoBanco'])
        ->middleware('role:administrador|admin_nominas|contador|supervisor')
        ->name('api.archivo_banco');
    
    // API Obligaciones
    Route::get('/api/obligaciones', [RecibosPagosController::class, 'apiObligaciones'])
        ->middleware('role:administrador|admin_nominas|contador|supervisor')
        ->name('api.obligaciones');
    
    // API Períodos Nómina
    Route::get('/api/periodos-nomina', [PayrollController::class, 'apiPeriodos'])
        ->middleware('role:administrador|admin_nominas|contador|supervisor')
        ->name('api.periodos_nomina');
    
    // API Roles y Permisos
    Route::get('/api/roles', [RolController::class, 'apiIndex'])
        ->middleware('role:administrador')
        ->name('api.roles');
    Route::post('/api/roles', [RolController::class, 'apiStore'])
        ->middleware('role:administrador')
        ->name('api.roles.crear');
    Route::put('/api/roles/{id}', [RolController::class, 'apiUpdate'])
        ->middleware('role:administrador')
        ->name('api.roles.actualizar');
    Route::delete('/api/roles/{id}', [RolController::class, 'apiDestroy'])
        ->middleware('role:administrador')
        ->name('api.roles.eliminar');
    Route::post('/api/roles/asignar', [RolController::class, 'apiAsignar'])
        ->middleware('role:administrador')
        ->name('api.roles.asignar');
    Route::get('/api/usuarios', [RolController::class, 'apiUsuarios'])
        ->middleware('role:administrador')
        ->name('api.usuarios');
    Route::get('/api/permisos', [RolController::class, 'apiPermisos'])
        ->middleware('role:administrador')
        ->name('api.permisos');
    
    // API User Permissions
    Route::get('/api/user/permissions', function() {
        $user = auth()->user();
        $permissions = $user->getAllPermissions()->pluck('name')->toArray();
        return response()->json(['permissions' => $permissions]);
    })->name('api.user.permissions');
    
    // API Vacaciones
    Route::get('/api/vacaciones', [App\Http\Controllers\SolicitudVacacionesController::class, 'index'])
        ->middleware('role:empleado|administrador|admin_rrhh')
        ->name('api.vacaciones');
    Route::post('/api/vacaciones/crear', [App\Http\Controllers\SolicitudVacacionesController::class, 'store'])
        ->middleware('role:empleado|administrador|admin_rrhh')
        ->name('api.vacaciones.crear');
    Route::post('/api/vacaciones/{id}/aprobar', [App\Http\Controllers\SolicitudVacacionesController::class, 'aprobar'])
        ->middleware('role:administrador|admin_rrhh')
        ->name('api.vacaciones.aprobar');
    Route::post('/api/vacaciones/{id}/rechazar', [App\Http\Controllers\SolicitudVacacionesController::class, 'rechazar'])
        ->middleware('role:administrador|admin_rrhh')
        ->name('api.vacaciones.rechazar');
    Route::post('/api/vacaciones/{id}/cancelar', [App\Http\Controllers\SolicitudVacacionesController::class, 'cancelar'])
        ->middleware('role:empleado|administrador|admin_rrhh')
        ->name('api.vacaciones.cancelar');
    
    // SPA - Single Page Application con Vue Router
    // Catch-all: todas las rutas /spa/* son manejadas por Vue Router en el frontend
    Route::get('/spa/{any?}', [PageController::class, 'index'])->where('any', '.*')->name('spa.catch');
    
    // API Stats para Dashboard
    Route::get('/api/stats', function() {
        return response()->json([
            'empleados' => User::role('empleado')->count(),
            'departamentos' => DB::table('departamentos')->count(),
            'nominas' => DB::table('periodos_nomina')->where('estado', 'abierto')->count(),
            'totalPagado' => DB::table('recibos')->sum('neto') ?? 0
        ]);
    })->middleware('role:administrador|admin_nominas|admin_rrhh|contador|supervisor')
    ->name('api.stats');

    // API Dashboard completo
    Route::get('/api/dashboard', function() {
        $empleados = DB::table('empleados')->count();
        $departamentos = DB::table('departamentos')->count();
        $contratos = DB::table('contratos')->count();
        $periodos = DB::table('periodos_nomina')->count();
        $recibos = DB::table('recibos')->count();
        $pagos = DB::table('pagos')->count();
        
        $esEmpleado = auth()->check() && auth()->user()->hasRole('empleado');
        $ultimoPeriodo = DB::table('periodos_nomina')->orderByDesc('fecha_fin')->first();
        
        $deps = DB::table('departamentos')->select('codigo','nombre')->paginate(10);
        
        $contratosList = DB::table('contratos as c')
            ->leftJoin('users as u', 'u.id', '=', 'c.empleado_id')
            ->leftJoin('empleados as emp', 'emp.user_id', '=', 'u.id')
            ->select('c.id','c.tipo_contrato','c.frecuencia_pago','c.salario_base','u.id as empleado_user_id','u.name as empleado_name','emp.numero_empleado as empleado_codigo','emp.cedula as empleado_cedula')
            ->paginate(10);
        
        $periodosList = DB::table('periodos_nomina')
            ->select('codigo','fecha_inicio','fecha_fin','estado')
            ->orderByDesc('fecha_inicio')
            ->paginate(10);
        
        if ($esEmpleado) {
            $recibosList = DB::table('recibos as r')
                ->join('empleados as emp','emp.id','=','r.empleado_id')
                ->join('users as u','u.id','=','emp.user_id')
                ->where('emp.user_id', auth()->id())
                ->select('r.id','r.neto','r.estado','emp.numero_empleado as empleado_codigo','emp.cedula as empleado_cedula','u.name as empleado_name','u.id as empleado_user_id')
                ->orderByDesc('r.id')
                ->paginate(10);
            
            $pagosList = DB::table('pagos as p')
                ->join('recibos as r','r.id','=','p.recibo_id')
                ->join('empleados as emp','emp.id','=','r.empleado_id')
                ->join('users as u','u.id','=','emp.user_id')
                ->where('emp.user_id', auth()->id())
                ->whereIn('p.estado', ['aceptado','rechazado','pendiente'])
                ->select('p.id','p.recibo_id','p.importe','p.metodo','p.referencia as descripcion','p.estado','p.respondido_en','p.updated_at','p.created_at','p.pagado_en','emp.numero_empleado as empleado_codigo','emp.cedula as empleado_cedula','u.name as empleado_name','u.id as empleado_user_id')
                ->orderByDesc('p.id')
                ->paginate(10);
        } else {
            $recibosList = DB::table('recibos as r')
                ->leftJoin('empleados as emp','emp.id','=','r.empleado_id')
                ->leftJoin('users as u','u.id','=','emp.user_id')
                ->select('r.id','r.empleado_id','r.neto','r.estado','emp.numero_empleado as empleado_codigo','emp.cedula as empleado_cedula','u.name as empleado_name','u.id as empleado_user_id')
                ->orderByDesc('r.id')
                ->paginate(10);
            
            $pagosList = DB::table('pagos as p')
                ->leftJoin('recibos as r','r.id','=','p.recibo_id')
                ->leftJoin('empleados as emp','emp.id','=','r.empleado_id')
                ->leftJoin('users as u','u.id','=','emp.user_id')
                ->select('p.id','p.recibo_id','p.importe','p.metodo','p.created_at','p.updated_at','p.pagado_en','p.estado','emp.numero_empleado as empleado_codigo','emp.cedula as empleado_cedula','u.name as empleado_name','u.id as empleado_user_id')
                ->orderByDesc('p.id')
                ->paginate(10);
        }
        
        $metodosPago = DB::table('metodos_pago')->where('activo', true)->orderBy('nombre')->pluck('nombre')->toArray();
        if (empty($metodosPago)) {
            $metodosPago = ['Transferencia', 'Efectivo', 'Cheque', 'Pago móvil', 'Zelle'];
        }

        $contratoInfo = null;
        if ($esEmpleado && auth()->check()) {
            $contrato = DB::table('contratos')
                ->where('empleado_id', auth()->id())
                ->where(function($q) {
                    $q->where('estado', 'activo')->orWhereNull('fecha_fin')->orWhereDate('fecha_fin', '>=', now());
                })
                ->orderByDesc('id')
                ->first();

            if ($contrato) {
                $fechaFin = $contrato->fecha_fin ? \Carbon\Carbon::parse($contrato->fecha_fin) : null;
                $hoy = \Carbon\Carbon::today();
                $contratoInfo = [
                    'id' => $contrato->id,
                    'tipo_contrato' => $contrato->tipo_contrato ?? null,
                    'puesto' => $contrato->puesto ?? null,
                    'fecha_inicio' => $contrato->fecha_inicio ?? null,
                    'fecha_fin' => $contrato->fecha_fin ?? null,
                    'days_remaining' => $fechaFin ? ($fechaFin->lt($hoy) ? 0 : $hoy->diffInDays($fechaFin)) : null,
                    'expired' => $fechaFin ? $fechaFin->lt($hoy) : false,
                    'salario_base' => $contrato->salario_base ?? null,
                    'estado' => $contrato->estado ?? null,
                ];
            }
        }

        return response()->json([
            'empleados' => $empleados,
            'departamentos' => $departamentos,
            'contratos' => $contratos,
            'periodos' => $periodos,
            'recibos' => $recibos,
            'pagos' => $pagos,
            'esEmpleado' => $esEmpleado,
            'ultimoPeriodo' => $ultimoPeriodo,
            'deps' => $deps,
            'contratosList' => $contratosList,
            'periodosList' => $periodosList,
            'recibosList' => $recibosList,
            'pagosList' => $pagosList,
            'metodosPago' => $metodosPago,
            'contratoInfo' => $contratoInfo
        ]);
    })->middleware('auth')->name('api.dashboard');


    // Contratos - Admin RRHH
    // Contratos
    Route::get('/contratos', [ContratoController::class, 'index'])
        ->middleware('role:administrador|admin_rrhh')
        ->name('contratos.index');

    Route::get('/contratos/{id}', [ContratoController::class, 'show'])
        ->name('contratos.show');

    Route::get('/contratos/empleado/{userId}', [ContratoController::class, 'byEmployee'])
        ->name('contratos.by_employee');

    Route::get('/contratos/{id}/edit', [ContratoController::class, 'edit'])
        ->middleware('role:administrador|admin_rrhh')
        ->name('contratos.edit');

    Route::post('/contratos', [ContratoController::class, 'store'])
        ->middleware('role:administrador|admin_rrhh')
        ->name('contratos.store');

    Route::post('/contratos/{id}', [ContratoController::class, 'update'])
        ->middleware('role:administrador|admin_rrhh')
        ->name('contratos.update');

    Route::post('/contratos/{id}/delete', [ContratoController::class, 'destroy'])
        ->middleware('role:administrador|admin_rrhh')
        ->name('contratos.destroy');

    // Notificaciones
    Route::get('/notificaciones', fn() => view('notificaciones'))->name('notificaciones.view');
    Route::get('/notifications/all', [NotificationController::class, 'index'])->name('notifications.all');
    Route::get('/notifications/unread', [NotificationController::class, 'unread'])->name('notifications.unread');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark_all_read');
    Route::post('/notifications/delete-read', [NotificationController::class, 'deleteRead'])->name('notifications.delete_read');
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');

    //Configuración del perfil de la empresa
    Route::middleware('role:administrador')->group(function () {
        Route::get('/configuracion', [SettingController::class, 'index'])->name('settings.index');
        Route::post('/configuracion', [SettingController::class, 'store'])->name('settings.store');
        Route::get('/templates/preview/{name}', [SettingController::class, 'previewTemplate'])->name('templates.preview');
        Route::post('/templates/{name}/delete', [SettingController::class, 'deleteTemplate'])->name('templates.delete');
        
        // Theme management (upload/install/activate) - admin UI
        Route::get('/themes', [\App\Http\Controllers\ThemeController::class, 'index'])->name('themes.index');
        Route::get('/theme-test', [\App\Http\Controllers\ThemeController::class, 'index'])->name('themes.test');
        Route::post('/themes/upload', [\App\Http\Controllers\ThemeController::class, 'store'])->name('themes.upload');
        Route::post('/themes/{theme}/activate', [\App\Http\Controllers\ThemeController::class, 'activate'])->name('themes.activate');
        Route::post('/themes/{theme}/deactivate', [\App\Http\Controllers\ThemeController::class, 'deactivate'])->name('themes.deactivate');
        Route::post('/themes/{theme}/delete', [\App\Http\Controllers\ThemeController::class, 'destroy'])->name('themes.delete');
        Route::post('/themes/{slug}/remove', [\App\Http\Controllers\ThemeController::class, 'removeFolder'])->name('themes.remove');
        Route::get('/themes-sync', [\App\Http\Controllers\ThemeController::class, 'sync'])->name('themes.sync');
        Route::post('/themes/{slug}/register', [\App\Http\Controllers\ThemeController::class, 'register'])->name('themes.register');
    });

    // Departamentos
    // Departamentos - Solo Admin RRHH y Super Admin
    // Departamentos - Solo Admin RRHH y Administrador
    Route::get('/departamentos', [App\Http\Controllers\DepartamentoController::class, 'index'])
        ->middleware('role:administrador|admin_rrhh')
        ->name('departamentos.view');

    Route::post('/departamentos', [App\Http\Controllers\DepartamentoController::class, 'store'])
        ->middleware('role:administrador|admin_rrhh')
        ->name('departamentos.crear');

    Route::post('/departamentos/editar', [App\Http\Controllers\DepartamentoController::class, 'update'])
        ->middleware('role:administrador|admin_rrhh')
        ->name('departamentos.editar');

    Route::post('/departamentos/eliminar', [App\Http\Controllers\DepartamentoController::class, 'destroy'])
        ->middleware('role:administrador|admin_rrhh')
        ->name('departamentos.eliminar');

    // Conceptos de Pago - Solo Admin Nóminas y Super Admin
    Route::get('/conceptos', [App\Http\Controllers\ConceptoPagoController::class, 'index'])
        ->middleware('role:administrador')
        ->name('conceptos.view');
    Route::post('/conceptos', [App\Http\Controllers\ConceptoPagoController::class, 'store'])
        ->middleware('role:administrador')
        ->name('conceptos.crear');
    Route::post('/conceptos/editar', [App\Http\Controllers\ConceptoPagoController::class, 'update'])
        ->middleware('role:administrador')
        ->name('conceptos.editar');
    Route::post('/conceptos/eliminar', [App\Http\Controllers\ConceptoPagoController::class, 'destroy'])
        ->middleware('role:administrador')
        ->name('conceptos.eliminar');

    // Métodos de Pago - Solo Admin Nóminas y Super Admin
    Route::get('/metodos', [App\Http\Controllers\MetodoPagoController::class, 'index'])
        ->middleware('role:administrador')
        ->name('metodos.view');
    Route::post('/metodos', [App\Http\Controllers\MetodoPagoController::class, 'store'])
        ->middleware('role:administrador')
        ->name('metodos.crear');
    Route::post('/metodos/editar', [App\Http\Controllers\MetodoPagoController::class, 'update'])
        ->middleware('role:administrador')
        ->name('metodos.editar');
    Route::post('/metodos/eliminar', [App\Http\Controllers\MetodoPagoController::class, 'destroy'])
        ->middleware('role:administrador')
        ->name('metodos.eliminar');

    // Monedas - Solo Admin Nóminas y Super Admin
    Route::get('/monedas', [App\Http\Controllers\MonedaController::class, 'index'])
        ->middleware('role:administrador')
        ->name('monedas.view');
    Route::post('/monedas', [App\Http\Controllers\MonedaController::class, 'store'])
        ->middleware('role:administrador')
        ->name('monedas.crear');
    Route::post('/monedas/editar', [App\Http\Controllers\MonedaController::class, 'update'])
        ->middleware('role:administrador')
        ->name('monedas.editar');
    Route::post('/monedas/eliminar', [App\Http\Controllers\MonedaController::class, 'destroy'])
        ->middleware('role:administrador')
        ->name('monedas.eliminar');

    // Impuestos
    Route::get('/impuestos', [App\Http\Controllers\ImpuestosController::class, 'index'])->name('impuestos.view');
    Route::post('/impuestos', [App\Http\Controllers\ImpuestosController::class, 'store'])->name('impuestos.store');
    Route::put('/impuestos/{id}', [App\Http\Controllers\ImpuestosController::class, 'update'])->name('impuestos.update');
    Route::delete('/impuestos/{id}', [App\Http\Controllers\ImpuestosController::class, 'destroy'])->name('impuestos.destroy');
    Route::post('/impuestos/{id}/toggle', [App\Http\Controllers\ImpuestosController::class, 'toggle'])->name('impuestos.toggle');

    // Tabuladores Salariales
    Route::get('/tabuladores', [App\Http\Controllers\TabuladoresController::class, 'index'])->name('tabuladores.view');
    Route::post('/tabuladores', [App\Http\Controllers\TabuladoresController::class, 'store'])->name('tabuladores.store');
    Route::put('/tabuladores/{id}', [App\Http\Controllers\TabuladoresController::class, 'update'])->name('tabuladores.update');
    Route::delete('/tabuladores/{id}', [App\Http\Controllers\TabuladoresController::class, 'destroy'])->name('tabuladores.destroy');
    Route::post('/tabuladores/{id}/toggle', [App\Http\Controllers\TabuladoresController::class, 'toggle'])->name('tabuladores.toggle');
    Route::get('/tabuladores/sueldo', [App\Http\Controllers\TabuladoresController::class, 'getSueldoByFrecuencia'])->name('tabuladores.sueldo');

    // Nómina - Reportes y Archivos
    Route::get('/nomina/banco/{periodo}', [PayrollController::class, 'bankFile'])->name('nomina.banco');
    Route::get('/nomina/obligaciones', [PayrollController::class, 'obligations'])->name('nomina.obligaciones');
    Route::get('/nomina/recibo/{recibo}/pdf', [PayrollController::class, 'receiptPdf'])->name('nomina.recibo.pdf');
});
