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
    
    // Vista Vue.js
    Route::get('/empleados-vue', function() {
        return view('empleados-vue');
    })->name('empleados.vue');
    
    // API para Vue.js
    Route::get('/api/empleados/vue', [EmpleadoController::class, 'apiEmpleados'])->name('api.empleados.vue');
    
    // SPA - Single Page Application
    Route::get('/spa/{any?}', function() {
        return view('spa');
    })->where('any', '.*')->name('spa');
    
    // API Stats para Dashboard
    Route::get('/api/stats', function() {
        return response()->json([
            'empleados' => User::role('empleado')->count(),
            'departamentos' => DB::table('departamentos')->count(),
            'nominas' => DB::table('periodos_nomina')->where('estado', 'abierto')->count(),
            'totalPagado' => DB::table('recibos')->sum('neto') ?? 0
        ]);
    })->name('api.stats');


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
