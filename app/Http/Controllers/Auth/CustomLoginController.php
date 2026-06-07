<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User; // Asumiendo que el modelo de usuario es App\Models\User

class CustomLoginController extends Controller
{
    /**
     * Maneja una solicitud de autenticación entrante.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('Nombre_usuario', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->Contraseña)) {
            return response()->json(['message' => 'Credenciales incorrectas.'], 401);
        }

        if ($user->Estado === 'Inactivo') {
            return response()->json(['message' => 'Este usuario se encuentra desactivado.'], 401);
        }

        Auth::login($user, $request->boolean('remember'));

        \App\Models\SystemLog::write('Inicio de Sesión', "El usuario '{$user->Nombre_usuario}' ha iniciado sesión correctamente.");

        return response()->json(['message' => 'Autenticación exitosa.']);
    }
}