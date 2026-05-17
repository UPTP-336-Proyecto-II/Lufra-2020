<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RedirectAfterLoginController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect('/');
        }

        /**
         * 1. FILTRO DE SEGURIDAD OBLIGATORIO:
         * Usamos Auth::id() que obtiene directamente el ID del usuario en sesión activa.
         * Busca en la tabla 'respuestas_seguridad_usuario' vinculando con 'user_id'.
         */
        $userId = Auth::id();
        
        $tienePreguntas = DB::table('respuestas_seguridad_usuario')
                            ->where('user_id', $userId)
                            ->exists();

        // Si NO tiene preguntas registradas, lo interceptamos y obligamos a ir al formulario
        if (!$tienePreguntas) {
            return redirect()->route('seguridad.configurar.vista')
                             ->with('info', 'Por medidas de seguridad de LUFRA2020, debes configurar tu pregunta de recuperación antes de ingresar al sistema.');
        }

        /**
         * 2. REDIRECCIÓN SINCRONIZADA CON LA BASE DE DATOS LUFRA200
         * Si ya tiene sus preguntas, continúa su camino normal según su rol.
         */
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