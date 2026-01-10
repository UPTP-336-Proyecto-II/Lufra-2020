<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EmpleadoController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $query = User::role('empleado')
            ->select('users.id', 'users.name', 'users.email');
        
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('users.name', 'like', "%{$search}%")
                  ->orWhere('users.email', 'like', "%{$search}%");
                if (is_numeric($search)) {
                    $q->orWhere('users.id', '=', $search);
                }
            });
        }
        
        $usuarios = $query->orderBy('users.id', 'desc')->paginate(15);
        $detalle = $request->input('detalle');
        // Si se pasó un id en 'detalle', cargar el usuario correspondiente (evitar que sea solo un string)
        if ($detalle) {
            try {
                $detalle = User::find($detalle);
            } catch (\Throwable $e) {
                $detalle = null;
            }
        }

        return view('empleados', compact('usuarios', 'detalle'));
    }

    public function detalle($userId)
    {
        return redirect()->route('empleados.index', ['detalle' => $userId]);
    }

    public function crear(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ], [
            'name.required' => 'El nombre es obligatorio.',
            'name.string' => 'El nombre debe ser texto.',
            'name.max' => 'El nombre no debe superar 255 caracteres.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'El correo electrónico debe ser válido.',
            'email.max' => 'El correo electrónico no debe superar 255 caracteres.',
            'email.unique' => 'El correo electrónico ya existe.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.string' => 'La contraseña debe ser texto.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
        ]);

        $userId = DB::table('users')->insertGetId([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Asignar rol de empleado vía Spatie (evita tablas legacy)
        if ($user = User::find($userId)) {
            $user->assignRole('empleado');
        }

        return redirect()->route('empleados.index')->with('success', 'Empleado creado correctamente');
    }

    public function editar(Request $request)
    {
        $data = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
        ], [
            'user_id.required' => 'El ID de usuario es obligatorio.',
            'user_id.integer' => 'El ID de usuario debe ser un número.',
            'user_id.exists' => 'El usuario no existe.',
            'name.required' => 'El nombre es obligatorio.',
            'name.string' => 'El nombre debe ser texto.',
            'name.max' => 'El nombre no debe superar 255 caracteres.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'El correo electrónico debe ser válido.',
            'email.max' => 'El correo electrónico no debe superar 255 caracteres.',
        ]);

        // Verificar que el email no esté duplicado
        $exists = DB::table('users')
            ->where('email', $data['email'])
            ->where('id', '!=', $data['user_id'])
            ->exists();

        if ($exists) {
            return back()->withErrors(['email' => 'El email ya existe'])->withInput();
        }

        DB::table('users')->where('id', $data['user_id'])->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'updated_at' => now(),
        ]);

        return redirect()->route('empleados.index')->with('success', 'Empleado actualizado correctamente');
    }

    public function eliminar(Request $request)
    {
        $data = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
        ], [
            'user_id.required' => 'El ID de usuario es obligatorio.',
            'user_id.integer' => 'El ID de usuario debe ser un número.',
            'user_id.exists' => 'El usuario no existe.',
        ]);

        DB::table('users')->where('id', $data['user_id'])->delete();

        return redirect()->route('empleados.index')->with('success', 'Empleado eliminado correctamente');
    }

    public function cambiarPassword(Request $request)
    {
        $data = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'user_id.required' => 'El ID de usuario es obligatorio.',
            'user_id.integer' => 'El ID de usuario debe ser un número.',
            'user_id.exists' => 'El usuario no existe.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.string' => 'La contraseña debe ser texto.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'password.confirmed' => 'La confirmación de contraseña no coincide.',
        ]);

        DB::table('users')->where('id', $data['user_id'])->update([
            'password' => \Illuminate\Support\Facades\Hash::make($data['password']),
            'updated_at' => now(),
        ]);

        return redirect()->route('empleados.index')->with('success', 'Contraseña actualizada correctamente');
    }

    public function asignarDepartamento(Request $request)
    {
        $data = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'department_id' => ['nullable', 'integer', 'exists:departamentos,id'],
        ], [
            'user_id.required' => 'El ID de usuario es obligatorio.',
            'user_id.integer' => 'El ID de usuario debe ser un número.',
            'user_id.exists' => 'El usuario no existe.',
            'department_id.integer' => 'El departamento debe ser un número.',
            'department_id.exists' => 'El departamento no existe.',
        ]);

        // Verificar si el departamento existe antes de asignar
        if (!empty($data['department_id'])) {
            $departmentExists = DB::table('departamentos')->where('id', $data['department_id'])->exists();
            if (!$departmentExists) {
                return back()->withErrors(['department_id' => 'El departamento seleccionado no existe.'])->withInput();
            }
        }

        try {
            // Deshabilitar foreign keys temporalmente para evitar problemas con SQLite
            DB::statement('PRAGMA foreign_keys = OFF');
            
            DB::beginTransaction();

            // Verificar si el empleado existe
            $empleado = DB::table('empleados')->where('user_id', $data['user_id'])->first();

            if ($empleado) {
                // Actualizar departamento
                DB::table('empleados')->where('user_id', $data['user_id'])->update([
                    'department_id' => $data['department_id'] ?? null,
                    'updated_at' => now(),
                ]);
            } else {
                // Crear registro de empleado
                $user = DB::table('users')->find($data['user_id']);
                $nombres = explode(' ', $user->name);
                
                DB::table('empleados')->insert([
                    'user_id' => $data['user_id'],
                    'numero_empleado' => 'EMP' . str_pad($data['user_id'], 4, '0', STR_PAD_LEFT),
                    'nombre' => $nombres[0] ?? '',
                    'apellido' => $nombres[1] ?? '',
                    'correo' => $user->email,
                    'department_id' => $data['department_id'] ?? null,
                    'fecha_ingreso' => now()->toDateString(),
                    'estado' => 'activo',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::commit();
            
            // Reactivar foreign keys
            DB::statement('PRAGMA foreign_keys = ON');

            return redirect()->route('empleados.index')->with('success', 'Departamento asignado correctamente');
            
        } catch (\Exception $e) {
            DB::rollBack();
            DB::statement('PRAGMA foreign_keys = ON');
            
            \Log::error('Error asignando departamento: ' . $e->getMessage());
            
            return back()->withErrors([
                'error' => 'Error al asignar departamento: ' . $e->getMessage()
            ])->withInput();
        }
    }

    public function apiEmpleados(Request $request)
    {
        $empleados = User::role('empleado')
            ->leftJoin('empleados as e', 'e.user_id', '=', 'users.id')
            ->leftJoin('departamentos as d', 'd.id', '=', 'e.department_id')
            ->select('users.id', 'users.name', 'users.email', 'd.nombre as department')
            ->orderBy('users.id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $empleados
        ]);
    }
}
