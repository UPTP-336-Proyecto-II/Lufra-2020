<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureAdmin
{
    /**
     * Handle an incoming request.
     * Allow if user has any admin role (using Spatie)
     */
    public function handle(Request $request, Closure $next)
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $user = auth()->user();
        
        // Check if user has admin role via Spatie
        $adminRoles = ['administrador', 'admin_nominas', 'admin_rrhh'];
        foreach ($adminRoles as $role) {
            if ($user->hasRole($role)) {
                return $next($request);
            }
        }
        
        // Check if any of user's roles contain 'admin'
        $userRoles = $user->getRoleNames();
        foreach ($userRoles as $role) {
            if (str_contains(strtolower($role), 'admin')) {
                return $next($request);
            }
        }

        abort(403, 'Acceso denegado. Se requieren privilegios de administrador.');
    }
}
