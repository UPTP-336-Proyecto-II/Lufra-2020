<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:trabajador'])->prefix('trabajador')->group(function () {
    Route::get('/', function () {
        return view('trabajador.dashboard');
    })->name('trabajador.dashboard');

    // Rutas de datos para el trabajador
    Route::get('/profile-data', [\App\Http\Controllers\WorkerController::class, 'getProfile'])->name('worker.profile');
    Route::get('/vacations-data', [\App\Http\Controllers\WorkerController::class, 'getVacations'])->name('worker.vacations');
    Route::post('/vacations-request', [\App\Http\Controllers\WorkerController::class, 'storeVacationRequest'])->name('worker.vacations.store');
    Route::get('/payslips-data', [\App\Http\Controllers\WorkerController::class, 'getPayslips'])->name('worker.payslips');
    Route::get('/payslip/{id}', [\App\Http\Controllers\WorkerController::class, 'showPayslip'])->name('worker.payslip.show');
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
    
    // Cargos & Misc
    Route::get('/cargos', [\App\Http\Controllers\AdminController::class, 'listCargos'])->name('admin.cargos');
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
    Route::get('/workers-list', [\App\Http\Controllers\AdminController::class, 'listWorkers'])->name('superusuario.workers_list');
    Route::get('/reports/users', [\App\Http\Controllers\UserListController::class, 'getUsers'])->name('superusuario.reports_users');
    // Otras rutas de superusuario
});
