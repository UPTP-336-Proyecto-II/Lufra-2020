<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserListController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('trabajador');

        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function($b) use ($q) {
                $b->where('Nombre_usuario', 'like', "%$q%")
                  ->orWhere('Correo', 'like', "%$q%")
                  ->orWhereHas('trabajador', function($t) use ($q) {
                      $t->where('Nombre_Completo', 'like', "%$q%")
                        ->orWhere('Apellidos', 'like', "%$q%");
                  });
            });
        }

        if ($request->filled('rol')) {
            // Mapeo inverso de nombre a ID
            $rolesMap = ['administrativo' => 1, 'trabajador' => 2, 'superusuario' => 3];
            $roleId = $rolesMap[strtolower($request->rol)] ?? null;
            if ($roleId) {
                $query->where('Id_rol', $roleId);
            }
        }

        if ($request->filled('estado')) {
            $query->where('Estado', $request->estado);
        }

        $users = $query->get();

        if ($request->ajax() || $request->wantsJson()) {
            return response()->json(['users' => $this->formatUsers($users)]);
        }

        if ($request->has('print')) {
            return view('superusuario.report', compact('users'));
        }

        return view('admin.users', compact('users'));
    }

    public function getUsers()
    {
        $users = User::with('trabajador')->get();
        return response()->json(['users' => $this->formatUsers($users)]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:usuario,Correo',
            'username' => 'required|string|unique:usuario,Nombre_usuario',
            'password' => 'required|string|min:8',
            'role' => 'required|string',
            'Id_Trabajador' => 'nullable|sometimes|exists:trabajador,Id_Trabajador',
        ], [
            'username.unique' => 'Este nombre de usuario ya está en uso.',
            'email.unique' => 'Esta dirección de correo ya está registrada.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'Id_Trabajador.exists' => 'El trabajador seleccionado no existe.'
        ]);

        $rolesMap = ['administrativo' => 1, 'trabajador' => 2, 'superusuario' => 3];
        $roleId = $rolesMap[strtolower($validated['role'])] ?? 2;

        $user = User::create([
            'Nombre_usuario' => $validated['username'],
            'Correo' => $validated['email'],
            'Contraseña' => $validated['password'], 
            'Id_rol' => $roleId,
            'Id_Trabajador' => ($request->filled('Id_Trabajador') && $request->Id_Trabajador !== '') ? $request->Id_Trabajador : null,
            'Estado' => 'Activo',
        ]);

        return response()->json(['message' => 'Usuario creado exitosamente', 'user' => $user]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:usuario,Correo,' . $user->Id_Usuario . ',Id_Usuario',
            'username' => 'required|string|unique:usuario,Nombre_usuario,' . $user->Id_Usuario . ',Id_Usuario',
            'password' => 'nullable|string|min:8',
            'role' => 'required|string',
            'Id_Trabajador' => 'nullable|exists:trabajador,Id_Trabajador',
        ]);

        $rolesMap = ['administrativo' => 1, 'trabajador' => 2, 'superusuario' => 3];
        $roleId = $rolesMap[strtolower($validated['role'])] ?? 2;

        $user->Nombre_usuario = $validated['username'];
        $user->Correo = $validated['email'];
        if ($request->filled('password')) {
            $user->Contraseña = $validated['password'];
        }
        $user->Id_rol = $roleId;
        $user->Id_Trabajador = ($request->filled('Id_Trabajador') && $request->Id_Trabajador !== '') ? $request->Id_Trabajador : null;
        $user->save();

        return response()->json(['message' => 'Usuario actualizado exitosamente']);
    }

    public function activate($id)
    {
        $user = User::findOrFail($id);
        $user->Estado = 'Activo';
        $user->save();
        return response()->json(['message' => 'Usuario activado']);
    }

    public function deactivate($id)
    {
        $user = User::findOrFail($id);
        $user->Estado = 'Inactivo';
        $user->save();
        return response()->json(['message' => 'Usuario desactivado']);
    }

    public function createDefault()
    {
        $hasSu = User::where('Id_rol', 3)->exists();
        if ($hasSu) {
            return response()->json(['message' => 'Ya existe un SuperUsuario', 'username' => User::where('Id_rol', 3)->first()->Nombre_usuario]);
        }

        $tempPass = 'Admin123*';
        $user = User::create([
            'Nombre_usuario' => 'superadmin',
            'Correo' => 'admin@lufra2020.com',
            'Contraseña' => $tempPass,
            'Id_rol' => 3,
            'Estado' => 'Activo',
        ]);

        return response()->json(['message' => 'SuperUsuario creado', 'username' => 'superadmin', 'password' => $tempPass]);
    }

    private function formatUsers($users)
    {
        return $users->map(function($user) {
            return [
                'Id_Usuario' => $user->Id_Usuario,
                'Nombre_usuario' => $user->Nombre_usuario,
                'raw_username' => $user->Nombre_usuario,
                'Nombre_completo' => $user->name, // Usa el accessor que creamos
                'Correo' => $user->Correo,
                'Nombre_rol' => [
                    'administrativo' => 'Administrativo',
                    'trabajador' => 'Trabajador',
                    'superusuario' => 'SuperUsuario'
                ][$user->role] ?? ucfirst($user->role),
                'Estado' => $user->Estado ?? 'Activo',
                'Id_Trabajador' => $user->Id_Trabajador,
                'Trabajador_Nombre' => $user->trabajador ? ($user->trabajador->Nombre_Completo . ' ' . $user->trabajador->Apellidos) : '—',
            ];
        });
    }
}
