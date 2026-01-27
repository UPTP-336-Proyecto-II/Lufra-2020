<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DepartamentoController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        // Verificar rol de administrador (Spatie)
        if (!auth()->user()->hasRole('administrador')) {
            abort(403);
        }

        // Búsqueda y paginación
        $q = $request->input('q');
        $query = DB::table('departamentos as d')
            ->select('d.id', 'd.nombre', 'd.codigo', 'd.descripcion')
            ->orderBy('d.nombre');
        
        if ($q) {
            $query->where(function($x) use($q) {
                $x->where('d.nombre', 'like', "%$q%")
                  ->orWhere('d.codigo', 'like', "%$q%");
            });
        }
        
        $departamentos = $query->paginate(20);

        return view('departamentos', compact('departamentos'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'codigo' => ['required', 'string', 'max:10', 'unique:departamentos,codigo'],
            'nombre' => ['required', 'string', 'max:100'],
            'descripcion' => ['nullable', 'string'],
        ], [
            'codigo.required' => 'El código es obligatorio.',
            'codigo.string' => 'El código debe ser texto.',
            'codigo.max' => 'El código no debe superar 10 caracteres.',
            'codigo.unique' => 'El código ya existe.',
            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.string' => 'El nombre debe ser texto.',
            'nombre.max' => 'El nombre no debe superar 100 caracteres.',
            'descripcion.string' => 'La descripción debe ser texto.',
        ]);

        $id = DB::table('departamentos')->insertGetId([
            'codigo' => $data['codigo'],
            'nombre' => $data['nombre'],
            'descripcion' => $data['descripcion'] ?? null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Notificar a otros administradores
        \App\Http\Controllers\NotificationHelper::notifyDepartamentoCreado($id, $data['nombre'], auth()->id());

        // Responder con JSON si es AJAX, sino redirigir
        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Departamento creado correctamente', 'id' => $id]);
        }

        return redirect()->route('departamentos.view')->with('success', 'Departamento creado correctamente');
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'id' => ['required', 'integer', 'exists:departamentos,id'],
            'codigo' => ['required', 'string', 'max:10'],
            'nombre' => ['required', 'string', 'max:100'],
            'descripcion' => ['nullable', 'string'],
        ], [
            'id.required' => 'El ID es obligatorio.',
            'id.integer' => 'El ID debe ser un número.',
            'id.exists' => 'El departamento no existe.',
            'codigo.required' => 'El código es obligatorio.',
            'codigo.string' => 'El código debe ser texto.',
            'codigo.max' => 'El código no debe superar 10 caracteres.',
            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.string' => 'El nombre debe ser texto.',
            'nombre.max' => 'El nombre no debe superar 100 caracteres.',
            'descripcion.string' => 'La descripción debe ser texto.',
        ]);

        // Verificar que el código no esté duplicado
        $exists = DB::table('departamentos')
            ->where('codigo', $data['codigo'])
            ->where('id', '!=', $data['id'])
            ->exists();

        if ($exists) {
            return back()->withErrors(['codigo' => 'El código ya existe'])->withInput();
        }

        DB::table('departamentos')->where('id', $data['id'])->update([
            'codigo' => $data['codigo'],
            'nombre' => $data['nombre'],
            'descripcion' => $data['descripcion'] ?? null,
            'updated_at' => now(),
        ]);

        // Notificar a otros administradores
        \App\Http\Controllers\NotificationHelper::notifyDepartamentoEditado($data['id'], $data['nombre'], auth()->id());

        // Responder con JSON si es AJAX, sino redirigir
        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Departamento actualizado correctamente', 'id' => $data['id']]);
        }

        return redirect()->route('departamentos.view')->with('success', 'Departamento actualizado correctamente');
    }

    public function destroy(Request $request)
    {
        $data = $request->validate([
            'id' => ['required', 'integer', 'exists:departamentos,id'],
        ], [
            'id.required' => 'El ID es obligatorio.',
            'id.integer' => 'El ID debe ser un número.',
            'id.exists' => 'El departamento no existe.',
        ]);

        // Obtener nombre antes de eliminar
        $departamento = DB::table('departamentos')->where('id', $data['id'])->first();
        $nombre = $departamento ? $departamento->nombre : 'Departamento';

        DB::table('departamentos')->where('id', $data['id'])->delete();

        // Notificar a otros administradores
        \App\Http\Controllers\NotificationHelper::notifyDepartamentoEliminado($nombre, auth()->id());

        // Responder con JSON si es AJAX, sino redirigir
        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Departamento eliminado correctamente']);
        }

        return redirect()->route('departamentos.view')->with('success', 'Departamento eliminado correctamente');
    }

    /**
     * API: Obtener lista de departamentos para Vue
     */
    public function apiDepartamentos(Request $request)
    {
        try {
            $query = DB::table('departamentos')
                ->select('id', 'codigo', 'nombre', 'descripcion')
                ->orderBy('nombre');

            // Aplicar búsqueda si existe
            if ($busqueda = $request->input('q')) {
                $query->where(function($q) use ($busqueda) {
                    $q->where('nombre', 'like', "%{$busqueda}%")
                      ->orWhere('codigo', 'like', "%{$busqueda}%");
                });
            }

            $departamentos = $query->get();

            return response()->json($departamentos);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar departamentos: ' . $e->getMessage()
            ], 500);
        }
    }
}
