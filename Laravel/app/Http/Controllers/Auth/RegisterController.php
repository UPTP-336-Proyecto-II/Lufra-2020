<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Employee;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\DB;

class RegisterController extends Controller
{
    public function show()
    {
        return view('auth.register');
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => ['required','confirmed', Password::min(8)],
        ], [
            'name.required' => 'El nombre es obligatorio.',
            'name.string' => 'El nombre debe ser texto.',
            'name.max' => 'El nombre no debe superar 255 caracteres.',
            'email.required' => 'El correo es obligatorio.',
            'email.email' => 'Debe proporcionar un correo válido.',
            'email.max' => 'El correo no debe superar 255 caracteres.',
            'email.unique' => 'Este correo ya está registrado.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.confirmed' => 'La confirmación de contraseña no coincide.',
        ]);

        DB::beginTransaction();
        
        try {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
            ]);

            // Asignar rol 'empleado' por defecto usando Spatie
            $user->assignRole('empleado');

            // Crear empleado automáticamente con los datos básicos del usuario
            $nameParts = explode(' ', $data['name'], 2);
            $nombre = $nameParts[0] ?? $data['name'];
            $apellido = $nameParts[1] ?? '';

            Employee::create([
                'user_id' => $user->id,
                'nombre' => $nombre,
                'apellido' => $apellido,
                'correo' => $data['email'],
                'fecha_ingreso' => now()->toDateString(),
                'estado' => 'activo',
            ]);

            DB::commit();

            Auth::login($user);
            $request->session()->regenerate();

            return redirect()->route('home')->with('status', 'Registro exitoso: rol empleado asignado y perfil creado.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al crear el empleado: ' . $e->getMessage()])->withInput();
        }
    }
}
