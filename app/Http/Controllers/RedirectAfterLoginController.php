<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectAfterLoginController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return redirect('/');
        }
        switch (strtolower($user->role)) {
            case 'superusuario':
                return redirect()->route('superusuario.dashboard');
            case 'administrativo':
                return redirect()->route('administrativo.dashboard');
            case 'trabajador':
            default:
                return redirect()->route('trabajador.dashboard');
        }
    }
}
