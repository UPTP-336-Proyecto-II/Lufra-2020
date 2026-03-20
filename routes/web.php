<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;


Route::get('/', function () {
    return view('homepage');
})->name('home');


Route::get('/login', function () {
    return view('auth.login');
})->middleware('guest')->name('login');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/redirect-after-login', \App\Http\Controllers\RedirectAfterLoginController::class)->name('redirect.after.login');
});

require __DIR__.'/modules.php';
