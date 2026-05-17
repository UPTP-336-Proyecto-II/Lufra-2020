<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $user = $request->user();
        if (!$user) {
            return $request->wantsJson()
                    ? response()->json(['message' => 'Unauthenticated.'], 401)
                    : redirect('/');
        }

        // Normalizamos el rol usando el Accessor que acabamos de crear en el modelo User
        $role = strtolower($user->role);

        if ($request->expectsJson() || $request->ajax() || $request->isXmlHttpRequest()) {
            return response()->json([
                'role' => $role,
                'name' => $user->Nombre_usuario, // Usamos el nombre real de la DB
            ]);
        }

        switch ($role) {
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
