<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:trabajador,pasante'])->prefix('trabajador')->group(function () {
    Route::get('/', function () {
        return view('trabajador.dashboard');
    })->name('trabajador.dashboard');

    // Rutas de datos para el trabajador
    Route::get('/profile-data', [\App\Http\Controllers\WorkerController::class, 'getProfile'])->name('worker.profile');
    Route::get('/vacations-data', [\App\Http\Controllers\WorkerController::class, 'getVacations'])->name('worker.vacations');
    Route::post('/vacations-request', [\App\Http\Controllers\WorkerController::class, 'storeVacationRequest'])->name('worker.vacations.store');
    Route::get('/payslips-data', [\App\Http\Controllers\WorkerController::class, 'getPayslips'])->name('worker.payslips');
    Route::get('/payslip/{id}', [\App\Http\Controllers\WorkerController::class, 'showPayslip'])->name('worker.payslip.show');
    Route::get('/vacation-payments-data', [\App\Http\Controllers\WorkerController::class, 'getVacationPayments'])->name('worker.vacation_payments');
    Route::get('/vacation-payments/payslip/{id}', [\App\Http\Controllers\WorkerController::class, 'showVacationPayslip'])->name('worker.vacation_payments.payslip');
    
    // Rutas de permisos
    Route::get('/permission-requests', [\App\Http\Controllers\WorkerController::class, 'getPermissionRequests'])->name('worker.permission_requests');
    Route::post('/permission-requests', [\App\Http\Controllers\WorkerController::class, 'storePermissionRequest'])->name('worker.permission_requests.store');
});

Route::middleware(['auth', 'role:administrativo'])->prefix('administrativo')->group(function () {
    Route::get('/', function () {
        return view('administrativo.dashboard');
    })->name('administrativo.dashboard');
    
    // Workers
    Route::get('/workers', [\App\Http\Controllers\AdminController::class, 'listWorkers'])->name('admin.workers');
    Route::post('/workers', [\App\Http\Controllers\AdminController::class, 'storeWorker'])->name('admin.workers.store');
    Route::post('/workers/{id}', [\App\Http\Controllers\AdminController::class, 'updateWorker'])->name('admin.workers.update');
    Route::post('/workers/{id}/activate', [\App\Http\Controllers\AdminController::class, 'activateWorker'])->name('admin.workers.activate');
    Route::post('/workers/{id}/deactivate', [\App\Http\Controllers\AdminController::class, 'deactivateWorker'])->name('admin.workers.deactivate');
    
    // Vacations
    Route::get('/vacations', [\App\Http\Controllers\AdminController::class, 'listVacations'])->name('admin.vacations');
    Route::post('/vacations/{id}/status', [\App\Http\Controllers\AdminController::class, 'updateVacationStatus'])->name('admin.vacations.status');
    Route::get('/vacation-payments', [\App\Http\Controllers\AdminController::class, 'listVacationPayments'])->name('admin.vacation_payments');
    Route::post('/vacation-payments', [\App\Http\Controllers\AdminController::class, 'storeVacationPayment'])->name('admin.vacation_payments.store');
    Route::get('/vacation-payments/paid-years/{workerId}', [\App\Http\Controllers\AdminController::class, 'getPaidYears'])->name('admin.vacation_payments.paid_years');
    Route::get('/vacation-payments/payslip/{id}', [\App\Http\Controllers\AdminController::class, 'showVacationPayslip'])->name('admin.vacation_payments.payslip');
    Route::post('/vacation-payments/{id}/status', [\App\Http\Controllers\AdminController::class, 'updateVacationPaymentStatus'])->name('admin.vacation_payments.status');
    
    // Permits
    Route::get('/permission-requests', [\App\Http\Controllers\AdminController::class, 'listPermissionRequests'])->name('admin.permission_requests');
    Route::post('/permission-requests/{id}/status', [\App\Http\Controllers\AdminController::class, 'updatePermissionRequestStatus'])->name('admin.permission_requests.status');
    
    // Payroll & Concepts
    Route::get('/types-nomina', [\App\Http\Controllers\AdminController::class, 'listTypesNomina'])->name('admin.types_nomina');
    Route::post('/types-nomina', [\App\Http\Controllers\AdminController::class, 'storeTypeNomina'])->name('admin.types_nomina.store');
    Route::post('/types-nomina/{id}', [\App\Http\Controllers\AdminController::class, 'updateTypeNomina'])->name('admin.types_nomina.update');
    Route::post('/types-nomina/{id}/toggle', [\App\Http\Controllers\AdminController::class, 'toggleTypeNominaStatus'])->name('admin.types_nomina.toggle');
    
    Route::get('/concepts', [\App\Http\Controllers\AdminController::class, 'listConcepts'])->name('admin.concepts');
    Route::post('/concepts', [\App\Http\Controllers\AdminController::class, 'storeConcept'])->name('admin.concepts.store');
    Route::post('/concepts/{id}', [\App\Http\Controllers\AdminController::class, 'updateConcept'])->name('admin.concepts.update');
    Route::post('/concepts/{id}/toggle', [\App\Http\Controllers\AdminController::class, 'toggleConceptStatus'])->name('admin.concepts.toggle');
    
    Route::post('/payroll/pay', [\App\Http\Controllers\AdminController::class, 'processPayment'])->name('admin.payroll.pay');
    Route::get('/payroll/history', [\App\Http\Controllers\AdminController::class, 'getAllPayslips'])->name('admin.payroll.history');
    Route::post('/payroll/{id}/status', [\App\Http\Controllers\AdminController::class, 'updatePayslipStatus'])->name('admin.payroll.status');
    Route::get('/payroll/payslip/{id}', [\App\Http\Controllers\AdminController::class, 'showPayslipAdmin'])->name('admin.payroll.payslip');
    
    // Cargos & Misc
    Route::get('/cargos', [\App\Http\Controllers\AdminController::class, 'listCargos'])->name('admin.cargos');
    Route::get('/cargos/areas', [\App\Http\Controllers\AdminController::class, 'listAreas'])->name('admin.cargos.areas');
    Route::post('/cargos', [\App\Http\Controllers\AdminController::class, 'storeCargo'])->name('admin.cargos.store');
    Route::post('/cargos/{id}', [\App\Http\Controllers\AdminController::class, 'updateCargo'])->name('admin.cargos.update');
    Route::post('/cargos/{id}/toggle', [\App\Http\Controllers\AdminController::class, 'toggleCargoStatus'])->name('admin.cargos.toggle');
    Route::get('/education-levels', [\App\Http\Controllers\AdminController::class, 'listEducationLevels'])->name('admin.education_levels');
});

Route::middleware(['auth', 'role:superusuario'])->prefix('superusuario')->group(function () {
    Route::get('/', function () {
        return view('superusuario.dashboard');
    })->name('superusuario.dashboard');
    Route::middleware(['auth', 'role:superusuario'])->get('/admin/users', [\App\Http\Controllers\UserListController::class, 'index'])->name('admin.users');
    Route::get('/users-data', [\App\Http\Controllers\UserListController::class, 'getUsers'])->name('superusuario.users_data');
    Route::post('/users/store', [\App\Http\Controllers\UserListController::class, 'store'])->name('superusuario.users.store');
    Route::post('/users/{id}/update', [\App\Http\Controllers\UserListController::class, 'update'])->name('superusuario.users.update');
    Route::post('/users/{id}/activate', [\App\Http\Controllers\UserListController::class, 'activate'])->name('superusuario.users.activate');
    Route::post('/users/{id}/deactivate', [\App\Http\Controllers\UserListController::class, 'deactivate'])->name('superusuario.users.deactivate');
    Route::post('/create-superuser', [\App\Http\Controllers\UserListController::class, 'createDefault'])->name('superusuario.create_default');
    Route::post('/admin/menu-config', [\App\Http\Controllers\MenuConfigController::class, 'store'])->name('superusuario.menu_config.store');
    Route::get('/workers-list', [\App\Http\Controllers\AdminController::class, 'listWorkers'])->name('superusuario.workers_list');
    Route::get('/reports/users', [\App\Http\Controllers\UserListController::class, 'getUsers'])->name('superusuario.reports_users');

    // --- Datos de Trabajador para autocompletado del formulario de Usuarios ---
    Route::get('/workers/{id}/datos', [\App\Http\Controllers\AdminController::class, 'getDatosTrabajador'])->name('superusuario.worker.datos');


    // --- Bitácora del Sistema ---
    Route::get('/system-logs', [\App\Http\Controllers\AdminController::class, 'listSystemLogs'])->name('superusuario.system_logs');

    // --- Dashboard Centralizado de Métricas (Gerente / SuperUsuario) ---
    Route::get('/dashboard-metrics', [\App\Http\Controllers\AdminController::class, 'superDashboardMetrics'])->name('superusuario.dashboard_metrics');

    // --- Proxy de módulos administrativos accesibles al superusuario ---
    // Workers
    Route::get('/admin/workers', [\App\Http\Controllers\AdminController::class, 'listWorkers'])->name('superusuario.admin.workers');
    Route::post('/admin/workers', [\App\Http\Controllers\AdminController::class, 'storeWorker'])->name('superusuario.admin.workers.store');
    Route::post('/admin/workers/{id}', [\App\Http\Controllers\AdminController::class, 'updateWorker'])->name('superusuario.admin.workers.update');
    Route::post('/admin/workers/{id}/activate', [\App\Http\Controllers\AdminController::class, 'activateWorker'])->name('superusuario.admin.workers.activate');
    Route::post('/admin/workers/{id}/deactivate', [\App\Http\Controllers\AdminController::class, 'deactivateWorker'])->name('superusuario.admin.workers.deactivate');
    // Vacations
    Route::get('/admin/vacations', [\App\Http\Controllers\AdminController::class, 'listVacations'])->name('superusuario.admin.vacations');
    Route::post('/admin/vacations/{id}/status', [\App\Http\Controllers\AdminController::class, 'updateVacationStatus'])->name('superusuario.admin.vacations.status');
    Route::get('/admin/vacation-payments', [\App\Http\Controllers\AdminController::class, 'listVacationPayments'])->name('superusuario.admin.vacation_payments');
    Route::post('/admin/vacation-payments', [\App\Http\Controllers\AdminController::class, 'storeVacationPayment'])->name('superusuario.admin.vacation_payments.store');
    Route::get('/admin/vacation-payments/paid-years/{workerId}', [\App\Http\Controllers\AdminController::class, 'getPaidYears'])->name('superusuario.admin.vacation_payments.paid_years');
    Route::get('/admin/vacation-payments/payslip/{id}', [\App\Http\Controllers\AdminController::class, 'showVacationPayslip'])->name('superusuario.admin.vacation_payments.payslip');
    Route::post('/admin/vacation-payments/{id}/status', [\App\Http\Controllers\AdminController::class, 'updateVacationPaymentStatus'])->name('superusuario.admin.vacation_payments.status');
    // Permits
    Route::get('/admin/permission-requests', [\App\Http\Controllers\AdminController::class, 'listPermissionRequests'])->name('superusuario.admin.permission_requests');
    Route::post('/admin/permission-requests/{id}/status', [\App\Http\Controllers\AdminController::class, 'updatePermissionRequestStatus'])->name('superusuario.admin.permission_requests.status');
    // Payroll & Concepts
    Route::get('/admin/types-nomina', [\App\Http\Controllers\AdminController::class, 'listTypesNomina'])->name('superusuario.admin.types_nomina');
    Route::post('/admin/types-nomina', [\App\Http\Controllers\AdminController::class, 'storeTypeNomina'])->name('superusuario.admin.types_nomina.store');
    Route::post('/admin/types-nomina/{id}', [\App\Http\Controllers\AdminController::class, 'updateTypeNomina'])->name('superusuario.admin.types_nomina.update');
    Route::post('/admin/types-nomina/{id}/toggle', [\App\Http\Controllers\AdminController::class, 'toggleTypeNominaStatus'])->name('superusuario.admin.types_nomina.toggle');
    Route::get('/admin/concepts', [\App\Http\Controllers\AdminController::class, 'listConcepts'])->name('superusuario.admin.concepts');
    Route::post('/admin/concepts', [\App\Http\Controllers\AdminController::class, 'storeConcept'])->name('superusuario.admin.concepts.store');
    Route::post('/admin/concepts/{id}', [\App\Http\Controllers\AdminController::class, 'updateConcept'])->name('superusuario.admin.concepts.update');
    Route::post('/admin/concepts/{id}/toggle', [\App\Http\Controllers\AdminController::class, 'toggleConceptStatus'])->name('superusuario.admin.concepts.toggle');
    Route::post('/admin/payroll/pay', [\App\Http\Controllers\AdminController::class, 'processPayment'])->name('superusuario.admin.payroll.pay');
    Route::get('/admin/payroll/history', [\App\Http\Controllers\AdminController::class, 'getAllPayslips'])->name('superusuario.admin.payroll.history');
    Route::post('/admin/payroll/{id}/status', [\App\Http\Controllers\AdminController::class, 'updatePayslipStatus'])->name('superusuario.admin.payroll.status');
    Route::get('/admin/payroll/payslip/{id}', [\App\Http\Controllers\AdminController::class, 'showPayslipAdmin'])->name('superusuario.admin.payroll.payslip');
    // Cargos & Misc
    Route::get('/admin/cargos', [\App\Http\Controllers\AdminController::class, 'listCargos'])->name('superusuario.admin.cargos');
    Route::get('/admin/cargos/areas', [\App\Http\Controllers\AdminController::class, 'listAreas'])->name('superusuario.admin.cargos.areas');
    Route::post('/admin/cargos', [\App\Http\Controllers\AdminController::class, 'storeCargo'])->name('superusuario.admin.cargos.store');
    Route::post('/admin/cargos/{id}', [\App\Http\Controllers\AdminController::class, 'updateCargo'])->name('superusuario.admin.cargos.update');
    Route::post('/admin/cargos/{id}/toggle', [\App\Http\Controllers\AdminController::class, 'toggleCargoStatus'])->name('superusuario.admin.cargos.toggle');
    Route::get('/admin/education-levels', [\App\Http\Controllers\AdminController::class, 'listEducationLevels'])->name('superusuario.admin.education_levels');
});
