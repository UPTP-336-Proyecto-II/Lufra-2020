<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PermissionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        // Búsqueda de permisos usando Spatie
        $searchPermisos = $request->input('search_permisos');
        $queryPermisos = \Spatie\Permission\Models\Permission::query()
            ->select('id', 'name', 'description')
            ->orderBy('name');
        
        if ($searchPermisos) {
            $queryPermisos->where(function($q) use ($searchPermisos) {
                $q->where('name', 'like', "%{$searchPermisos}%")
                  ->orWhere('description', 'like', "%{$searchPermisos}%");
            });
        }
        
        $lista = $queryPermisos->paginate(15, ['*'], 'permisos_page');
        
        // Obtener todos los roles para asignación usando Spatie
        $roles = \Spatie\Permission\Models\Role::query()
            ->select('id', 'name')
            ->orderBy('name')
            ->get();
        
        // Obtener todos los permisos para el formulario de asignación
        $todosPermisos = \Spatie\Permission\Models\Permission::query()
            ->select('id', 'name', 'description')
            ->orderBy('name')
            ->get();
        
        return view('permissions', compact('lista', 'roles', 'todosPermisos'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre' => ['required','string','max:100'],
            'descripcion' => ['nullable','string','max:255']
        ], [
            'nombre.required' => 'El nombre del permiso es obligatorio.',
            'nombre.string' => 'El nombre del permiso debe ser texto.',
            'nombre.max' => 'El nombre del permiso no debe superar 100 caracteres.',
            'descripcion.max' => 'La descripción es demasiado larga.'
        ]);
        
        \Spatie\Permission\Models\Permission::updateOrCreate(
            ['name' => $data['nombre']],
            ['description' => $data['descripcion'] ?? null]
        );
        
        return redirect()->route('permissions.index');
    }

    public function asignar(Request $request)
    {
        $data = $request->validate([
            'rol_id' => ['required','integer'],
            'permisos' => ['array']
        ], [
            'rol_id.required' => 'El rol es obligatorio.',
            'rol_id.integer' => 'El identificador de rol debe ser numérico.',
            'permisos.array' => 'Los permisos deben enviarse como lista.'
        ]);
        
        $role = \Spatie\Permission\Models\Role::find($data['rol_id']);
        if (!$role) {
            return redirect()->route('permissions.index')->with('error', 'Rol no encontrado');
        }
        
        // Sincronizar permisos (elimina los antiguos y agrega los nuevos)
        $permissions = \Spatie\Permission\Models\Permission::whereIn('id', $data['permisos'] ?? [])->get();
        $role->syncPermissions($permissions);
        
        return redirect()->route('permissions.index');
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'permiso_id' => ['required','integer'],
            'nombre' => ['required','string','max:100'],
            'descripcion' => ['nullable','string','max:255']
        ], [
            'permiso_id.required' => 'El ID del permiso es obligatorio.',
            'permiso_id.integer' => 'El ID del permiso debe ser un número.',
            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.string' => 'El nombre debe ser texto.',
            'nombre.max' => 'El nombre no debe superar 100 caracteres.',
            'descripcion.string' => 'La descripción debe ser texto.',
            'descripcion.max' => 'La descripción no debe superar 255 caracteres.',
        ]);
        
        $permission = \Spatie\Permission\Models\Permission::find($data['permiso_id']);
        if ($permission) {
            $permission->update([
                'name' => $data['nombre'],
                'description' => $data['descripcion'] ?? null
            ]);
        }
        
        return redirect()->route('permissions.index');
    }

    public function destroy(Request $request)
    {
        $data = $request->validate([
            'permiso_id' => ['required','integer'],
        ], [
            'permiso_id.required' => 'El ID del permiso es obligatorio.',
            'permiso_id.integer' => 'El ID del permiso debe ser un número.',
        ]);
        
        $permission = \Spatie\Permission\Models\Permission::find($data['permiso_id']);
        if ($permission) {
            $permission->delete();
        }
        
        return redirect()->route('permissions.index');
    }
}
