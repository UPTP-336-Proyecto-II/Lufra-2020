<?php

namespace App\Http\Controllers;

use App\Models\SolicitudVacaciones;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SolicitudVacacionesController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('permission:vacaciones.solicitar')->only(['misSolicitudes', 'store', 'cancelar', 'vistaEmpleado']);
        $this->middleware('permission:vacaciones.solicitar|vacaciones.gestionar')->only(['index']);
        $this->middleware('permission:vacaciones.gestionar')->only(['pendientes', 'aprobar', 'rechazar']);
    }

    // Vista para empleado
    public function vistaEmpleado()
    {
        return view('solicitar_vacaciones');
    }

    // Empleado ve sus propias solicitudes
    public function misSolicitudes(Request $request)
    {
        $empleado = auth()->user()->empleado;

        if (!$empleado) {
            return response()->json(['error' => 'Empleado no encontrado'], 404);
        }

        $solicitudes = SolicitudVacaciones::where('empleado_id', $empleado->id)
            ->with('aprobador')
            ->orderBy('created_at', 'desc')
            ->get();

        if ($request->expectsJson()) {
            return response()->json($solicitudes);
        }

        return view('solicitudes_vacaciones.mis_solicitudes', ['solicitudes' => $solicitudes]);
    }

    // Crear solicitud (empleado)
    public function store(Request $request)
    {
        $request->validate([
            'fecha_inicio' => 'required|date|after_or_equal:today',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'motivo' => 'nullable|string|max:500',
        ], [
            'fecha_inicio.required' => 'La fecha de inicio es obligatoria.',
            'fecha_inicio.date' => 'La fecha de inicio debe ser una fecha válida.',
            'fecha_inicio.after_or_equal' => 'La fecha de inicio debe ser hoy o posterior.',
            'fecha_fin.required' => 'La fecha de fin es obligatoria.',
            'fecha_fin.date' => 'La fecha de fin debe ser una fecha válida.',
            'fecha_fin.after_or_equal' => 'La fecha de fin debe ser igual o posterior a la fecha de inicio.',
        ]);

        $empleado = auth()->user()->empleado;

        if (!$empleado) {
            return response()->json(['error' => 'Empleado no encontrado'], 404);
        }

        $fecha_inicio = \Carbon\Carbon::parse($request->fecha_inicio);
        $fecha_fin = \Carbon\Carbon::parse($request->fecha_fin);
        $dias = $fecha_fin->diffInDays($fecha_inicio) + 1; // Incluir ambos días

        $solicitud = SolicitudVacaciones::create([
            'empleado_id' => $empleado->id,
            'fecha_inicio' => $fecha_inicio,
            'fecha_fin' => $fecha_fin,
            'dias_solicitados' => $dias,
            'motivo' => $request->motivo,
            'estado' => 'pendiente',
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Solicitud de vacaciones creada correctamente',
                'solicitud' => $solicitud
            ], 201);
        }

        return back()->with('success', 'Solicitud de vacaciones creada correctamente');
    }

    // RR.HH. ve todas las solicitudes pendientes
    public function pendientes(Request $request)
    {
        $solicitudes = SolicitudVacaciones::where('estado', 'pendiente')
            ->with(['empleado.user', 'aprobador'])
            ->orderBy('created_at', 'asc')
            ->get();

        if ($request->expectsJson()) {
            return response()->json($solicitudes);
        }

        return view('solicitudes_vacaciones_pendientes', ['solicitudes' => $solicitudes]);
    }

    // RR.HH. ve todas las solicitudes (CRUD completo)
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // Si tiene permiso de gestionar, ve todas las solicitudes
        if ($user->can('vacaciones.gestionar')) {
            $solicitudes = SolicitudVacaciones::with(['empleado.user', 'aprobador'])
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            // Si solo puede solicitar, ve solo las suyas
            $empleado = $user->empleado;
            if (!$empleado) {
                return redirect()->route('home')->with('error', 'No tienes un perfil de empleado asociado');
            }
            $solicitudes = SolicitudVacaciones::where('empleado_id', $empleado->id)
                ->with(['empleado.user', 'aprobador'])
                ->orderBy('created_at', 'desc')
                ->get();
        }

        if ($request->expectsJson()) {
            return response()->json($solicitudes);
        }

        return view('solicitudes_vacaciones.pendientes', ['solicitudes' => $solicitudes]);
    }

    // Aprobar solicitud (RR.HH.)
    public function aprobar(Request $request, $id)
    {
        $solicitud = SolicitudVacaciones::findOrFail($id);

        $solicitud->update([
            'estado' => 'aprobada',
            'aprobado_por' => auth()->id(),
            'fecha_aprobacion' => now(),
            'observaciones' => $request->observaciones,
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Solicitud aprobada correctamente'
            ]);
        }

        return back()->with('success', 'Solicitud aprobada correctamente');
    }

    // Rechazar solicitud (RR.HH.)
    public function rechazar(Request $request, $id)
    {
        $request->validate([
            'observaciones' => 'required|string|max:500',
        ], [
            'observaciones.required' => 'Debe proporcionar una razón para rechazar la solicitud.',
        ]);

        $solicitud = SolicitudVacaciones::findOrFail($id);

        $solicitud->update([
            'estado' => 'rechazada',
            'aprobado_por' => auth()->id(),
            'fecha_aprobacion' => now(),
            'observaciones' => $request->observaciones,
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Solicitud rechazada correctamente'
            ]);
        }

        return back()->with('success', 'Solicitud rechazada correctamente');
    }

    // Empleado cancela su solicitud (si aún está pendiente)
    public function cancelar(Request $request, $id)
    {
        $solicitud = SolicitudVacaciones::findOrFail($id);
        $empleado = auth()->user()->empleado;

        // Validar que sea el empleado que hizo la solicitud y esté pendiente
        if ($solicitud->empleado_id !== $empleado->id || $solicitud->estado !== 'pendiente') {
            return response()->json(['error' => 'No puedes cancelar esta solicitud'], 403);
        }

        $solicitud->delete();

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Solicitud cancelada correctamente'
            ]);
        }

        return back()->with('success', 'Solicitud cancelada correctamente');
    }
}
