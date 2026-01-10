<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        if (!auth()->check()) {
            return redirect('/login')->with('error', 'Debes iniciar sesión');
        }

        $user = auth()->user();
        
        // Check Spatie roles
        $userRoles = $user->getRoleNames()->toArray();

        // El administrador tiene acceso a todo
        foreach ($userRoles as $userRole) {
            if (str_contains(strtolower($userRole), 'admin')) {
                return $next($request);
            }
        }

        // Verificar si algún rol del usuario está en la lista de roles permitidos
        foreach ($roles as $allowedRole) {
            if ($user->hasRole($allowedRole)) {
                return $next($request);
            }
        }

        // Sin permiso
        abort(403, 'No tienes permisos para acceder a esta sección.');
    }
}
