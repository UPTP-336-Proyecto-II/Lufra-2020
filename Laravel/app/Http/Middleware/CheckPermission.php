<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckPermission
{
    /**
     * Verificar si el usuario tiene el permiso requerido (usando Spatie)
     */
    public function handle(Request $request, Closure $next, string $permiso)
    {
        if (!auth()->check()) {
            return redirect()->route('login')->with('error', 'Debes iniciar sesión');
        }

        $user = auth()->user();

        // Super Admin tiene todos los permisos
        if ($user->email === 'admin@example.com') {
            return $next($request);
        }

        // Verificar permiso usando Spatie
        if (!$user->hasPermissionTo($permiso)) {
            abort(403, 'No tienes permiso para acceder a esta sección: ' . $permiso);
        }

        return $next($request);
    }
}
