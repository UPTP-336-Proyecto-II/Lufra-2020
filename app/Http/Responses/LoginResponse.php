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

        if ($request->expectsJson() || $request->ajax() || $request->isXmlHttpRequest()) {
            return response()->json([
                'role' => strtolower($user->role),
                'name' => $user->name,
            ]);
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
