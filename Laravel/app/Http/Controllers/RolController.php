<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RolController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        // Búsqueda de usuarios
        $searchUsers = $request->input('search_users');
        $queryUsers = DB::table('users')
            ->select('id', 'name', 'email')
            ->orderBy('name');
        
        if ($searchUsers) {
            $queryUsers->where(function($q) use ($searchUsers) {
                $q->where('name', 'like', "%{$searchUsers}%")
                  ->orWhere('email', 'like', "%{$searchUsers}%");
            });
        }
        
        $usuarios = $queryUsers->paginate(20, ['*'], 'users_page');
        
        // Búsqueda de roles (Spatie usa 'name' y guarda 'description' como JSON)
        $searchRoles = $request->input('search_roles');
        $queryRoles = DB::table('roles')
            ->select('id', 'name', 'guard_name')
            ->orderBy('name');
        
        if ($searchRoles) {
            $queryRoles->where('name', 'like', "%{$searchRoles}%");
        }
        
        $roles = $queryRoles->paginate(10, ['*'], 'roles_page');
        
        return view('roles', compact('usuarios', 'roles'));
    }

    public function store(Request $request)
    {
        $request->validate(['nombre' => ['required','string','max:100']], [
            'nombre.required' => 'El nombre del rol es obligatorio.',
            'nombre.string' => 'El nombre del rol debe ser texto.',
            'nombre.max' => 'El nombre del rol no debe superar 100 caracteres.',
        ]);
        
        // Spatie: name, guard_name
        DB::table('roles')->updateOrInsert(
            ['name' => $request->nombre, 'guard_name' => 'web'], 
            ['created_at'=>now(),'updated_at'=>now()]
        );
        
        return redirect()->route('roles.index');
    }

    public function asignar(Request $request)
    {
        $data = $request->validate([
            'user_id' => ['required','integer'],
            'roles' => ['array']
        ], [
            'user_id.required' => 'El usuario es obligatorio.',
            'user_id.integer' => 'El identificador de usuario debe ser un número.',
            'roles.array' => 'Los roles deben enviarse como lista.',
        ]);
        
        $uid = (int)$data['user_id'];
        // Spatie usa model_has_roles con model_type, model_id, role_id
        DB::table('model_has_roles')->where('model_id',$uid)->where('model_type', 'App\\Models\\User')->delete();
        $roles = $data['roles'] ?? [];
        foreach($roles as $rid){
            DB::table('model_has_roles')->insert([
                'role_id' => $rid,
                'model_type' => 'App\\Models\\User',
                'model_id' => $uid
            ]);
        }
        
        return redirect()->route('roles.index');
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'rol_id' => ['required','integer'],
            'nombre' => ['required','string','max:100'],
            'descripcion' => ['nullable','string','max:255']
        ], [
            'rol_id.required' => 'El ID del rol es obligatorio.',
            'rol_id.integer' => 'El ID del rol debe ser un número.',
            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.string' => 'El nombre debe ser texto.',
            'nombre.max' => 'El nombre no debe superar 100 caracteres.',
            'descripcion.string' => 'La descripción debe ser texto.',
            'descripcion.max' => 'La descripción no debe superar 255 caracteres.',
        ]);
        
        DB::table('roles')->where('id',$data['rol_id'])->update([
            'name'=>$data['nombre'],
            'updated_at'=>now()
        ]);
        
        return redirect()->route('roles.index');
    }

    public function destroy(Request $request)
    {
        $data = $request->validate([
            'rol_id' => ['required','integer'],
        ], [
            'rol_id.required' => 'El ID del rol es obligatorio.',
            'rol_id.integer' => 'El ID del rol debe ser un número.',
        ]);
        
        $rid = (int)$data['rol_id'];
        // Limpiar tablas Spatie
        DB::table('model_has_roles')->where('role_id',$rid)->delete();
        DB::table('role_has_permissions')->where('role_id',$rid)->delete();
        DB::table('roles')->where('id',$rid)->delete();
        
        return redirect()->route('roles.index');
    }

    // API Methods
    public function apiIndex(Request $request)
    {
        $search = $request->input('search');
        $query = DB::table('roles')
            ->select('id', 'name', 'guard_name')
            ->orderBy('name');
        
        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }
        
        $roles = $query->get();
        return response()->json($roles);
    }

    public function apiUsuarios(Request $request)
    {
        $search = $request->input('search');
        $query = DB::table('users')
            ->select('id', 'name', 'email')
            ->orderBy('name');
        
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        $usuarios = $query->get();
        
        // Obtener roles de cada usuario
        foreach ($usuarios as $usuario) {
            $roles = DB::table('model_has_roles')
                ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
                ->where('model_has_roles.model_id', $usuario->id)
                ->where('model_has_roles.model_type', 'App\\Models\\User')
                ->select('roles.id', 'roles.name')
                ->get();
            $usuario->roles = $roles;
        }
        
        return response()->json($usuarios);
    }

    public function apiPermisos()
    {
        $permisos = DB::table('permissions')
            ->select('id', 'name', 'description')
            ->orderBy('name')
            ->get();
        return response()->json($permisos);
    }

    public function apiStore(Request $request)
    {
        $request->validate(['nombre' => ['required','string','max:100']]);
        
        DB::table('roles')->updateOrInsert(
            ['name' => $request->nombre, 'guard_name' => 'web'], 
            ['created_at'=>now(),'updated_at'=>now()]
        );
        
        return response()->json(['success' => true, 'message' => 'Rol creado exitosamente']);
    }

    public function apiUpdate(Request $request, $id)
    {
        $request->validate(['nombre' => ['required','string','max:100']]);
        
        DB::table('roles')->where('id', $id)->update([
            'name' => $request->nombre,
            'updated_at' => now()
        ]);
        
        return response()->json(['success' => true, 'message' => 'Rol actualizado exitosamente']);
    }

    public function apiDestroy($id)
    {
        DB::table('model_has_roles')->where('role_id', $id)->delete();
        DB::table('role_has_permissions')->where('role_id', $id)->delete();
        DB::table('roles')->where('id', $id)->delete();
        
        return response()->json(['success' => true, 'message' => 'Rol eliminado exitosamente']);
    }

    public function apiAsignar(Request $request)
    {
        $data = $request->validate([
            'user_id' => ['required','integer'],
            'roles' => ['array']
        ]);
        
        $uid = (int)$data['user_id'];
        DB::table('model_has_roles')->where('model_id', $uid)->where('model_type', 'App\\Models\\User')->delete();
        
        $roles = $data['roles'] ?? [];
        foreach($roles as $rid){
            DB::table('model_has_roles')->insert([
                'role_id' => $rid,
                'model_type' => 'App\\Models\\User',
                'model_id' => $uid
            ]);
        }
        
        return response()->json(['success' => true, 'message' => 'Roles asignados exitosamente']);
    }
}
