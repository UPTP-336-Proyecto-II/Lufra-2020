<?php

namespace App\Http\Controllers;

use App\Models\Cargo;
use App\Models\Concepto;
use App\Models\TipoNomina;
use App\Models\Trabajador;
use App\Models\Vacacion;
use App\Models\SolicitudPermiso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    // --- Trabajadores ---

    public function listWorkers()
    {
        // En un sistema real, usaríamos relaciones de Eloquent configuradas
        // Para esta migración, usaremos un join simple para replicar la vista legacy
        $workers = DB::table('trabajador as w')
            ->leftJoin('cargo as c', 'w.Id_Cargo', '=', 'c.Id_Cargo')
            ->leftJoin('nivel_educativo as n', 'w.Id_Nivel_Educativo', '=', 'n.Id_Nivel_Educativo')
            ->leftJoin('contrato_trabajadores as ct', 'w.Id_Trabajador', '=', 'ct.Id_Trabajador')
            ->leftJoin('tipo_nomina as tn', 'ct.Id_Tipo_Nomina', '=', 'tn.Id_Tipo_Nomina')
            ->select(
                'w.*',
                'c.Nombre_profesión as Cargo',
                'n.Nombre_Nivel as Nivel_Educativo',
                'ct.Id_Tipo_Nomina as Id_Tipo_Nomina',
                'ct.Observaciones as Observaciones',
                'ct.Sueldo_Mensual as Sueldo_Mensual',
                'tn.Frecuencia',
                'ct.Estado as Contrato_Estado'
            )
            ->get();

        return response()->json(['workers' => $workers]);
    }

    /**
     * Devuelve el Nombre Completo y Correo de un trabajador por su ID.
     * Usado por el formulario de Gestión de Usuarios para el autocompletado
     * al vincular un trabajador a una cuenta nueva.
     *
     * @param  int|string  $id  Id_Trabajador
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDatosTrabajador($id)
    {
        $trabajador = DB::table('trabajador')
            ->where('Id_Trabajador', $id)
            ->select('Id_Trabajador', 'Nombre_Completo', 'Apellidos', 'Correo')
            ->first();

        if (!$trabajador) {
            return response()->json(['error' => 'Trabajador no encontrado'], 404);
        }

        return response()->json([
            'id'              => $trabajador->Id_Trabajador,
            'nombre_completo' => trim($trabajador->Nombre_Completo . ' ' . $trabajador->Apellidos),
            'correo'          => $trabajador->Correo ?? '',
        ]);
    }



    public function storeWorker(Request $request)
    {
        $data = $request->validate([
            'Nombre_Completo' => 'required|string|max:100',
            'Apellidos' => 'required|string|max:100',
            'Fecha_de_Ingreso' => 'required|date|before_or_equal:today',
            'Documento_Identidad' => ['required', 'string', 'unique:trabajador,Documento_Identidad', 'regex:/^([VPG]-[0-9]{7,8}|E-[0-9]{9,10})$/'],
            'Id_Cargo' => 'required|integer',
            'Id_Nivel_Educativo' => 'required|integer',
            'Id_Tipo_Nomina' => 'required|integer',
            'Genero' => 'required|string|in:M,F,O',
            'Fecha_Nacimiento' => 'nullable|date|before:-18 years',
            'Correo' => ['nullable', 'string', 'email:rfc', 'regex:/^.+@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com|icloud\.com|live\.com)$/i'],
            'Telefono_Movil' => ['nullable', 'string', 'regex:/^([0-9]{4}-)?[0-9]{7}$/'],
            'Direccion' => 'nullable|string|max:255',
            'Estado_Civil' => 'required|string',
            'Observaciones' => 'nullable|string',
            'Estado' => 'required|string|in:Activo,Inactivo',
            'Sueldo_Mensual' => 'nullable|numeric|min:0'
        ], [
            'Documento_Identidad.regex' => 'La cédula debe tener el formato V-12345678 o E-1234567890.',
            'Documento_Identidad.unique' => 'Ya existe un trabajador registrado con este documento de identidad.',
            'Telefono_Movil.regex' => 'El teléfono debe tener 7 dígitos después del prefijo.',
            'Fecha_Nacimiento.before' => 'El trabajador debe ser mayor de 18 años.',
            'Fecha_de_Ingreso.before_or_equal' => 'La fecha de ingreso no puede ser futura.',
            'Correo.regex' => 'Solo se permiten correos de dominios comunes (Gmail, Hotmail, Outlook, Yahoo, iCloud).',
            'Correo.email' => 'El formato del correo no es válido.',
            'Estado_Civil.required' => 'El estado civil es obligatorio.'
        ]);

        return DB::transaction(function () use ($data, $request) {
            // 1. Crear trabajador
            $worker = Trabajador::create([
                'Id_Cargo' => $data['Id_Cargo'],
                'Id_Nivel_Educativo' => $data['Id_Nivel_Educativo'],
                'Nombre_Completo' => $data['Nombre_Completo'],
                'Apellidos' => $data['Apellidos'],
                'Fecha_Nacimiento' => $data['Fecha_Nacimiento'],
                'Genero' => $data['Genero'],
                'Documento_Identidad' => $data['Documento_Identidad'],
                'Correo' => $data['Correo'],
                'Telefono_Movil' => $data['Telefono_Movil'],
                'Direccion' => $data['Direccion'],
                'Estado_Civil' => $data['Estado_Civil'],
                'Fecha_de_Ingreso' => $data['Fecha_de_Ingreso'],
            ]);

            // 2. Crear contrato
            DB::table('contrato_trabajadores')->insert([
                'Id_Trabajador' => $worker->Id_Trabajador,
                'Id_Tipo_Nomina' => $data['Id_Tipo_Nomina'],
                'Fecha_registro' => now()->toDateString(),
                'Observaciones' => $data['Observaciones'] ?? '',
                'Estado' => $data['Estado'] ?? 'Activo',
                'Sueldo_Mensual' => $request->input('Sueldo_Mensual') ?? 130.00
            ]);

            \App\Models\SystemLog::write('Gestión de Trabajadores', "Se ha registrado un nuevo trabajador: '{$worker->Nombre_Completo} {$worker->Apellidos}' (C.I. {$worker->Documento_Identidad}).");

            return response()->json(['success' => true, 'id' => $worker->Id_Trabajador]);
        });
    }

    public function updateWorker(Request $request, $id)
    {
        $worker = Trabajador::findOrFail($id);
        
        $data = $request->validate([
            'Nombre_Completo' => 'required|string|max:100',
            'Apellidos' => 'required|string|max:100',
            'Documento_Identidad' => ['required', 'string', 'regex:/^([VPG]-[0-9]{7,8}|E-[0-9]{9,10})$/', 'unique:trabajador,Documento_Identidad,'.$id.',Id_Trabajador'],
            'Id_Cargo' => 'required|integer',
            'Id_Nivel_Educativo' => 'required|integer',
            'Id_Tipo_Nomina' => 'required|integer',
            'Fecha_de_Ingreso' => 'required|date|before_or_equal:today',
            'Genero' => 'required|string|in:M,F,O',
            'Fecha_Nacimiento' => 'nullable|date|before:-18 years',
            'Correo' => ['nullable', 'string', 'email:rfc', 'regex:/^.+@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com|icloud\.com|live\.com)$/i'],
            'Telefono_Movil' => ['nullable', 'string', 'regex:/^([0-9]{4}-)?[0-9]{7}$/'],
            'Direccion' => 'nullable|string|max:255',
            'Estado_Civil' => 'required|string',
            'Observaciones' => 'nullable|string',
            'Estado' => 'required|string|in:Activo,Inactivo',
            'Sueldo_Mensual' => 'nullable|numeric|min:0'
        ], [
            'Documento_Identidad.regex' => 'La cédula debe tener el formato V-12345678 o E-1234567890.',
            'Documento_Identidad.unique' => 'Ya existe un trabajador registrado con este documento de identidad.',
            'Telefono_Movil.regex' => 'El teléfono debe tener 7 dígitos después del prefijo.',
            'Fecha_Nacimiento.before' => 'El trabajador debe ser mayor de 18 años.',
            'Fecha_de_Ingreso.before_or_equal' => 'La fecha de ingreso no puede ser futura.',
            'Correo.regex' => 'Solo se permiten correos de dominios comunes (Gmail, Hotmail, Outlook, Yahoo, iCloud).',
            'Correo.email' => 'El formato del correo no es válido.',
            'Estado_Civil.required' => 'El estado civil es obligatorio.'
        ]);

        return DB::transaction(function () use ($worker, $data, $id, $request) {
            // 1. Actualizar trabajador
            $worker->update([
                'Id_Cargo' => $data['Id_Cargo'],
                'Id_Nivel_Educativo' => $data['Id_Nivel_Educativo'],
                'Nombre_Completo' => $data['Nombre_Completo'],
                'Apellidos' => $data['Apellidos'],
                'Fecha_Nacimiento' => $data['Fecha_Nacimiento'],
                'Genero' => $data['Genero'],
                'Documento_Identidad' => $data['Documento_Identidad'],
                'Correo' => $data['Correo'],
                'Telefono_Movil' => $data['Telefono_Movil'],
                'Direccion' => $data['Direccion'],
                'Estado_Civil' => $data['Estado_Civil'],
                'Fecha_de_Ingreso' => $data['Fecha_de_Ingreso'],
            ]);

            // 2. Actualizar o crear contrato
            DB::table('contrato_trabajadores')
                ->updateOrInsert(
                    ['Id_Trabajador' => $id],
                    [
                        'Id_Tipo_Nomina' => $data['Id_Tipo_Nomina'],
                        'Observaciones' => $data['Observaciones'] ?? '',
                        'Estado' => $data['Estado'] ?? 'Activo',
                        'Sueldo_Mensual' => $request->input('Sueldo_Mensual') ?? 130.00
                    ]
                );

            \App\Models\SystemLog::write('Gestión de Trabajadores', "Se ha actualizado la información del trabajador '{$worker->Nombre_Completo} {$worker->Apellidos}'.");

            return response()->json(['success' => true]);
        });
    }

    public function deactivateWorker($id)
    {
        $worker = Trabajador::findOrFail($id);
        // Actualizamos el estado en contrato_trabajadores que es el que se usa en el listado
        DB::table('contrato_trabajadores')
            ->where('Id_Trabajador', $id)
            ->update(['Estado' => 'Inactivo']);
            
        \App\Models\SystemLog::write('Gestión de Trabajadores', "Se ha desactivado al trabajador '{$worker->Nombre_Completo} {$worker->Apellidos}'.");
        return response()->json(['success' => true]);
    }

    public function activateWorker($id)
    {
        $worker = Trabajador::findOrFail($id);
        DB::table('contrato_trabajadores')
            ->where('Id_Trabajador', $id)
            ->update(['Estado' => 'Activo']);
            
        \App\Models\SystemLog::write('Gestión de Trabajadores', "Se ha activado al trabajador '{$worker->Nombre_Completo} {$worker->Apellidos}'.");
        return response()->json(['success' => true]);
    }

    // --- Vacaciones ---

    public function listVacations()
    {
        $requests = DB::table('solicitudes_vacaciones as sv')
            ->join('trabajador as w', 'sv.Id_Trabajador', '=', 'w.Id_Trabajador')
            ->select('sv.*', 'w.Nombre_Completo', 'w.Apellidos', 'w.Documento_Identidad', 'w.Fecha_de_Ingreso')
            ->orderBy('sv.Fecha_Solicitud', 'desc')
            ->orderBy('sv.Id_Solicitud', 'desc')
            ->get();

        return response()->json(['requests' => $requests]);
    }

    public function updateVacationStatus(Request $request, $id)
    {
        $status = $request->input('status');
        if (!in_array($status, ['Aceptada', 'Rechazada', 'Pendiente'])) {
            return response()->json(['error' => 'Estado inválido'], 400);
        }

        $vacation = DB::table('solicitudes_vacaciones')->where('Id_Solicitud', $id)->first();
        if (!$vacation) {
            return response()->json(['error' => 'Solicitud no encontrada'], 404);
        }

        if ($status == 'Pendiente') {
            if (!in_array($vacation->Estado, ['Aceptada', 'Rechazada'])) {
                return response()->json(['error' => 'No se puede revertir una solicitud pendiente'], 400);
            }
            if ($vacation->Fecha_Inicio_Vacaciones <= now()->toDateString()) {
                return response()->json(['error' => 'No se puede revertir una solicitud con fecha de inicio pasada'], 400);
            }
        }

        $reason = $request->input('reason', '');

        DB::table('solicitudes_vacaciones')
            ->where('Id_Solicitud', $id)
            ->update([
                'Estado' => $status,
                'Fecha_Respuesta' => $status != 'Pendiente' ? now()->toDateString() : null,
                'motivo_rechazo' => $status === 'Rechazada' ? $reason : null
            ]);

        $adminUser = auth()->user();
        $trabajadorInfo = DB::table('trabajador')->where('Id_Trabajador', $vacation->Id_Trabajador)->first();
        $nombreTrabajador = $trabajadorInfo ? ($trabajadorInfo->Nombre_Completo . ' ' . $trabajadorInfo->Apellidos) : "ID {$vacation->Id_Trabajador}";
        \App\Models\SystemLog::write('Gestión de Vacaciones', "El administrador '{$adminUser->Nombre_usuario}' actualizó el estado de la solicitud de vacaciones #{$id} de '{$nombreTrabajador}' a: '{$status}'" . ($status === 'Rechazada' ? " (Motivo: '{$reason}')" : "") . ".");

        return response()->json(['success' => true]);
    }

    // --- Nómina y Conceptos ---

    private function blockedNominaFrecuencias()
    {
        return ['mensual', 'mixta'];
    }

    private function isBlockedNominaFrecuencia($frecuencia)
    {
        return in_array(strtolower(trim($frecuencia)), $this->blockedNominaFrecuencias(), true);
    }

    private function filterAllowedNominaTipos($tipos)
    {
        return collect($tipos)->reject(function ($tipo) {
            return $this->isBlockedNominaFrecuencia($tipo->Frecuencia ?? $tipo['Frecuencia'] ?? '');
        })->values();
    }

    public function listTypesNomina()
    {
        return response()->json(['tipos' => $this->filterAllowedNominaTipos(TipoNomina::all())]);
    }

    public function storeTypeNomina(Request $request)
    {
        $data = $request->validate([
            'Frecuencia' => 'required|string|unique:tipo_nomina,Frecuencia'
        ], [
            'Frecuencia.unique' => 'Ya existe un tipo de nómina con este nombre.'
        ]);

        if ($this->isBlockedNominaFrecuencia($data['Frecuencia'])) {
            return response()->json(['error' => 'El tipo de nómina solicitado no está permitido.'], 422);
        }

        // Proveer valores por defecto para campos obligatorios en DB tras eliminar vigencia en UI
        $data['Fecha_Inicio'] = '1900-01-01';
        $data['Fecha_Fin'] = '2099-12-31';

        $tipo = TipoNomina::create($data);
        \App\Models\SystemLog::write('Gestión de Conceptos', "Se ha creado el tipo de nómina '{$data['Frecuencia']}'.");
        return response()->json(['success' => true, 'id' => $tipo->Id_Tipo_Nomina]);
    }

    public function updateTypeNomina(Request $request, $id)
    {
        $tipo = TipoNomina::findOrFail($id);
        $data = $request->validate([
            'Frecuencia' => 'required|string|unique:tipo_nomina,Frecuencia,' . $id . ',Id_Tipo_Nomina'
        ], [
            'Frecuencia.unique' => 'Ya existe un tipo de nómina con este nombre.'
        ]);

        if ($this->isBlockedNominaFrecuencia($data['Frecuencia'])) {
            return response()->json(['error' => 'El tipo de nómina solicitado no está permitido.'], 422);
        }

        $tipo->update($data);
        \App\Models\SystemLog::write('Gestión de Conceptos', "Se ha actualizado el tipo de nómina '{$data['Frecuencia']}'.");
        return response()->json(['success' => true]);
    }

    public function toggleTypeNominaStatus($id)
    {
        $tipo = TipoNomina::findOrFail($id);
        $tipo->Estado = ($tipo->Estado === 'Activo') ? 'Inactivo' : 'Activo';
        $tipo->save();
        $accion = $tipo->Estado === 'Activo' ? 'activado' : 'desactivado';
        \App\Models\SystemLog::write('Gestión de Conceptos', "Se ha {$accion} el tipo de nómina '{$tipo->Frecuencia}'.");
        return response()->json(['success' => true, 'new_status' => $tipo->Estado]);
    }

    public function deleteTypeNomina($id)
    {
        $tipo = TipoNomina::findOrFail($id);
        $tipo->delete();
        return response()->json(['success' => true]);
    }

    public function listConcepts()
    {
        return response()->json(['conceptos' => Concepto::all()]);
    }

    public function storeConcept(Request $request)
    {
        $data = $request->validate([
            'Nombre_Concepto' => 'required|string',
            'Codigo' => 'nullable|string',
            'Descripción' => 'nullable|string',
            'Tipo' => 'nullable|string',
            'Monto' => 'nullable|numeric'
        ]);

        $concepto = Concepto::create($data);
        \App\Models\SystemLog::write('Gestión de Conceptos', "Se ha creado el concepto de pago '{$data['Nombre_Concepto']}'.");
        return response()->json(['success' => true, 'id' => $concepto->Id_Concepto]);
    }

    public function updateConcept(Request $request, $id)
    {
        $concepto = Concepto::findOrFail($id);
        $data = $request->validate([
            'Nombre_Concepto' => 'required|string',
            'Codigo' => 'nullable|string',
            'Tipo' => 'nullable|string',
            'Monto' => 'nullable|numeric',
            'Descripción' => 'nullable|string'
        ]);

        $concepto->update($data);
        \App\Models\SystemLog::write('Gestión de Conceptos', "Se ha actualizado el concepto de pago '{$data['Nombre_Concepto']}'.");
        return response()->json(['success' => true]);
    }

    public function toggleConceptStatus($id)
    {
        $concepto = Concepto::findOrFail($id);
        $concepto->Estado = ($concepto->Estado === 'Activo') ? 'Inactivo' : 'Activo';
        $concepto->save();
        return response()->json(['success' => true, 'new_status' => $concepto->Estado]);
    }

    public function deleteConcept($id)
    {
        Concepto::destroy($id);
        return response()->json(['success' => true]);
    }

    public function processPayment(Request $request)
    {
        $data = $request->input('data');
        if (!$data) return response()->json(['error' => 'No data provided'], 400);

        // Validaciones de Backend
        $fechaPago = \Carbon\Carbon::parse($data['fechaPago']);
        if ($fechaPago->isFuture()) {
            return response()->json(['error' => 'La fecha de pago no puede ser futura.'], 422);
        }

        $data['status'] = $data['status'] ?? 'Pendiente';

        // Check if this is a compact batch payload
        if (isset($data['isBatch']) && $data['isBatch']) {
            $totalNetoBatch = 0;
            if (isset($data['recibos']) && is_array($data['recibos'])) {
                foreach ($data['recibos'] as $key => $reciboForm) {
                    $trabajadorId = intval($reciboForm['trabajadorId']);
                    if (!$trabajadorId) continue;

                    $payrollInfo = $this->calculateWorkerPayroll(
                        $trabajadorId,
                        $data['salarioBase'],
                        $reciboForm['conceptos'] ?? [],
                        $data['fechaInicio'] ?? null,
                        $data['fechaFin'] ?? null
                    );

                    $data['recibos'][$key]['salarioBase'] = $payrollInfo['salarioBase'];
                    $data['recibos'][$key]['neto'] = $payrollInfo['neto'];
                    $data['recibos'][$key]['conceptos'] = $payrollInfo['conceptos'];

                    $totalNetoBatch += $payrollInfo['neto'];
                }
                $data['neto'] = $totalNetoBatch;
            }

            $id = DB::table('payslips')->insertGetId([
                'Id_Trabajador' => 0, // 0 represents the whole batch
                'Fecha_Pago' => $data['fechaPago'],
                'Salario_Base' => $data['salarioBase'],
                'Neto' => $data['neto'], // Consolidation of all net values of the batch
                'Data' => json_encode($data)
            ]);

            $adminUser = auth()->user();
            \App\Models\SystemLog::write('Pago de Nómina', "El administrador '{$adminUser->Nombre_usuario}' procesó el pago de nómina por lote '{$data['tipoNomina']} - {$data['periodo']}' por un neto total de {$data['neto']} (Recibo ID: {$id}).");

            return response()->json(['success' => true, 'id' => $id]);
        }

        // Inserción de pagos por lote para los trabajadores seleccionados en la nómina (legacy fallback)
        $trabajadores = $data['trabajadores'] ?? null;
        $insertedIds = [];

        if (is_array($trabajadores) && count($trabajadores)) {
            foreach ($trabajadores as $trabajadorId) {
                $trabajadorId = intval($trabajadorId);
                if (!$trabajadorId) {
                    continue;
                }

                $trabajadorInfo = DB::table('trabajador')->where('Id_Trabajador', $trabajadorId)->first();
                $nombreTrabajador = $trabajadorInfo ? ($trabajadorInfo->Nombre_Completo . ' ' . $trabajadorInfo->Apellidos) : "ID {$trabajadorId}";

                $payrollInfo = $this->calculateWorkerPayroll(
                    $trabajadorId,
                    $data['salarioBase'],
                    $data['conceptos'] ?? [],
                    $data['fechaInicio'] ?? null,
                    $data['fechaFin'] ?? null
                );

                $rowData = $data;
                $rowData['trabajadorId'] = $trabajadorId;
                $rowData['trabajador'] = $nombreTrabajador;
                $rowData['cedula'] = $trabajadorInfo ? $trabajadorInfo->Documento_Identidad : null;
                $rowData['salarioBase'] = $payrollInfo['salarioBase'];
                $rowData['neto'] = $payrollInfo['neto'];
                $rowData['conceptos'] = $payrollInfo['conceptos'];

                $id = DB::table('payslips')->insertGetId([
                    'Id_Trabajador' => $trabajadorId,
                    'Fecha_Pago' => $data['fechaPago'],
                    'Salario_Base' => $payrollInfo['salarioBase'],
                    'Neto' => $payrollInfo['neto'],
                    'Data' => json_encode($rowData)
                ]);

                $adminUser = auth()->user();
                \App\Models\SystemLog::write('Pago de Nómina', "El administrador '{$adminUser->Nombre_usuario}' procesó el pago de nómina para '{$nombreTrabajador}' por un neto de {$payrollInfo['neto']} (Período: {$data['periodo']}, Recibo ID: {$id}).");
                $insertedIds[] = $id;
            }

            return response()->json(['success' => true, 'ids' => $insertedIds, 'inserted' => count($insertedIds), 'id' => end($insertedIds)]);
        }

        $trabajadorId = $data['trabajadorId'] ?? null;
        if (!$trabajadorId) {
            return response()->json(['error' => 'Debe indicar el trabajador o la nómina a procesar.'], 422);
        }

        $trabajadorInfo = DB::table('trabajador')->where('Id_Trabajador', $trabajadorId)->first();
        $nombreTrabajador = $trabajadorInfo ? ($trabajadorInfo->Nombre_Completo . ' ' . $trabajadorInfo->Apellidos) : "ID {$trabajadorId}";

        $payrollInfo = $this->calculateWorkerPayroll(
            $trabajadorId,
            $data['salarioBase'],
            $data['conceptos'] ?? [],
            $data['fechaInicio'] ?? null,
            $data['fechaFin'] ?? null
        );

        $data['salarioBase'] = $payrollInfo['salarioBase'];
        $data['neto'] = $payrollInfo['neto'];
        $data['conceptos'] = $payrollInfo['conceptos'];

        $id = DB::table('payslips')->insertGetId([
            'Id_Trabajador' => $trabajadorId,
            'Fecha_Pago' => $data['fechaPago'],
            'Salario_Base' => $payrollInfo['salarioBase'],
            'Neto' => $payrollInfo['neto'],
            'Data' => json_encode($data)
        ]);

        $adminUser = auth()->user();
        \App\Models\SystemLog::write('Pago de Nómina', "El administrador '{$adminUser->Nombre_usuario}' procesó el pago de nómina para '{$nombreTrabajador}' por un neto de {$payrollInfo['neto']} (Período: {$data['periodo']}, Recibo ID: {$id}).");

        return response()->json(['success' => true, 'id' => $id]);
    }

    private function calculateWorkerPayroll($trabajadorId, $defaultSalarioBase, $globalConceptos, $fechaInicio = null, $fechaFin = null)
    {
        // 1. Consultar el contrato del trabajador para obtener su Sueldo_Mensual si existe y está definido
        $contrato = DB::table('contrato_trabajadores')
            ->where('Id_Trabajador', $trabajadorId)
            ->first();
        
        $salarioBase = ($contrato && isset($contrato->Sueldo_Mensual) && $contrato->Sueldo_Mensual > 0) ? floatval($contrato->Sueldo_Mensual) : floatval($defaultSalarioBase);

        // 2. Intentar buscar el recibo de pago anterior o plantilla del trabajador en recibo_pago
        $recibo = DB::table('recibo_pago')
            ->where('Id_Trabajador', $trabajadorId)
            ->orderBy('Fecha_Pago', 'desc')
            ->orderBy('Id_Recibo_Pago', 'desc')
            ->first();

        $individualConcepts = [];

        if ($recibo) {
            // Si hay un recibo previo y no hay un salario definido en el contrato, usamos el del recibo previo
            if (!($contrato && isset($contrato->Sueldo_Mensual) && $contrato->Sueldo_Mensual > 0)) {
                $salarioBase = floatval($recibo->Salario_Base);
            }

            // Cargar sus asignaciones
            $dbAsignaciones = DB::table('detalle_recibo_asignacion as dra')
                ->join('asignaciones as a', 'dra.Id_Asignacion', '=', 'a.Id_Asignacion')
                ->join('concepto as c', 'a.Id_Concepto', '=', 'c.Id_Concepto')
                ->where('dra.Id_Recibo_Pago', $recibo->Id_Recibo_Pago)
                ->select('c.Codigo', 'c.Nombre_Concepto', 'c.Tipo', 'c.Monto as Monto_Concepto', 'dra.Monto_Aplicado')
                ->get();

            foreach ($dbAsignaciones as $asig) {
                $individualConcepts[] = [
                    'Codigo' => $asig->Codigo,
                    'Nombre_Concepto' => $asig->Nombre_Concepto,
                    'Tipo' => 'Asignación',
                    'Monto' => floatval($asig->Monto_Aplicado ?: $asig->Monto_Concepto),
                    'aux' => '30 Días'
                ];
            }

            // Cargar sus deducciones
            $dbDeducciones = DB::table('detalle_recibo_deduccion as drd')
                ->join('deducciones as d', 'drd.Id_Deduccion', '=', 'd.Id_Deduccion')
                ->join('concepto as c', 'd.Id_Concepto', '=', 'c.Id_Concepto')
                ->where('drd.Id_Recibo_Pago', $recibo->Id_Recibo_Pago)
                ->select('c.Codigo', 'c.Nombre_Concepto', 'c.Tipo', 'c.Monto as Monto_Concepto', 'drd.Monto_Aplicado')
                ->get();

            foreach ($dbDeducciones as $dedu) {
                $individualConcepts[] = [
                    'Codigo' => $dedu->Codigo,
                    'Nombre_Concepto' => $dedu->Nombre_Concepto,
                    'Tipo' => 'Deducción',
                    'Monto' => floatval($dedu->Monto_Aplicado ?: $dedu->Monto_Concepto),
                    'aux' => ''
                ];
            }

            // Cargar sus bonificaciones
            $dbBonificaciones = DB::table('detalle_recibo_bonificacion as drb')
                ->join('bonificaciones as b', 'drb.Id_Bonificacion', '=', 'b.Id_Bonificacion')
                ->join('concepto as c', 'b.Id_Concepto', '=', 'c.Id_Concepto')
                ->where('drb.Id_Recibo_Pago', $recibo->Id_Recibo_Pago)
                ->select('c.Codigo', 'c.Nombre_Concepto', 'c.Tipo', 'c.Monto as Monto_Concepto', 'drb.Monto_Aplicado', 'drb.Cantidad')
                ->get();

            foreach ($dbBonificaciones as $bono) {
                $individualConcepts[] = [
                    'Codigo' => $bono->Codigo,
                    'Nombre_Concepto' => $bono->Nombre_Concepto,
                    'Tipo' => 'Bonificación',
                    'Monto' => floatval($bono->Monto_Aplicado ?: $bono->Monto_Concepto),
                    'aux' => ($bono->Cantidad ?: 1) . ' Unidad(es)'
                ];
            }
        }

        if ($recibo) {
            // Mezclar con los conceptos globales/enviados desde el formulario que no estén en la BD
            // (por ejemplo, incidencias temporales o conceptos nuevos agregados en este lote)
            $existingCodes = [];
            foreach ($individualConcepts as $c) {
                $existingCodes[] = strtoupper($c['Codigo'] ?? $c['codigo'] ?? '');
            }

            foreach ($globalConceptos as $gc) {
                $gcCode = strtoupper($gc['Codigo'] ?? $gc['codigo'] ?? '');
                if ($gcCode && !in_array($gcCode, $existingCodes)) {
                    $individualConcepts[] = [
                        'Codigo' => $gc['Codigo'] ?? $gc['codigo'] ?? '',
                        'Nombre_Concepto' => $gc['Nombre_Concepto'] ?? $gc['nombre'] ?? '',
                        'Tipo' => $gc['Tipo'] ?? $gc['tipo'] ?? '',
                        'Monto' => floatval($gc['Monto'] ?? $gc['monto'] ?? 0),
                        'aux' => $gc['aux'] ?? $gc['Auxiliar'] ?? $gc['aux_qty'] ?? ''
                    ];
                }
            }
        } else {
            $individualConcepts = $globalConceptos;
        }

        // 3. Calcular asignaciones (primer pase) y deducciones (segundo pase)
        $totalAsig = 0;
        $totalDedu = 0;
        $calculatedConcepts = [];

        // Definimos las keywords para conceptos diarios (alineadas con el frontend)
        $keywordsDiarios = [
            'dias laborables', 'días laborables', 'dias no laborados', 'días no laborados', 
            'faltas', 'inasistencias', 'vacaciones', 'bono vacacional', 'permiso no remunerado', 
            'utilidades', 'bono de produccion', 'bono de asistencia', 'sueldo', 'salario', 
            'dias de descanso', 'días de descanso', 'dia de descanso', 'día de descanso'
        ];

        // Función para extraer cantidad numérica de la propiedad 'aux'
        $extractQty = function ($aux) {
            if (!$aux) return 1.0;
            if (preg_match('/(\d+(\.\d+)?)/', strval($aux), $matches)) {
                return floatval($matches[1]);
            }
            return 1.0;
        };

        // Función auxiliar para obtener el monto de un concepto
        $getConceptAmountPHP = function ($c, $salario, $totAsig) use ($keywordsDiarios, $fechaInicio, $fechaFin) {
            $nombre = strtolower($c['Nombre_Concepto'] ?? $c['nombre'] ?? '');
            $codigo = strtoupper($c['Codigo'] ?? $c['codigo'] ?? '');

            // 1. Verificar si es un concepto diario
            $isDaily = false;
            foreach ($keywordsDiarios as $kw) {
                if (strpos($nombre, $kw) !== false) {
                    $isDaily = true;
                    break;
                }
            }

            if ($isDaily && $salario > 0) {
                return $salario / 30;
            }

            // 2. Retenciones legales
            $baseMensualCalculo = $totAsig * 2;

            if ($codigo === 'IVSS' || strpos($nombre, 'seguro social') !== false) {
                // Calcular lunes del mes (por defecto 4, o contar si hay fechas)
                $lunesMes = 4;
                if ($fechaInicio && $fechaFin) {
                    try {
                        $start = new \DateTime($fechaInicio);
                        $end = new \DateTime($fechaFin);
                        $lunes = 0;
                        while ($start <= $end) {
                            if ($start->format('N') == 1) $lunes++;
                            $start->modify('+1 day');
                        }
                        if ($lunes > 0) $lunesMes = $lunes;
                    } catch (\Exception $e) {}
                }
                $sueldoSemanal = (min($baseMensualCalculo, 650) * 12) / 52;
                $tasaSSO = $sueldoSemanal * 0.04;

                // Evitar doble multiplicación si el aux de la solicitud ya contiene "Lunes" y se multiplicará por la cantidad (lunes) en el bucle principal.
                $auxStr = strtolower(strval($c['aux'] ?? $c['Auxiliar'] ?? $c['aux_qty'] ?? ''));
                if (strpos($auxStr, 'lunes') !== false) {
                    return $tasaSSO;
                }
                return $tasaSSO * $lunesMes;
            }

            if ($codigo === 'SPF' || strpos($nombre, 'prest. de empleo') !== false) {
                // Calcular lunes del mes
                $lunesMes = 4;
                if ($fechaInicio && $fechaFin) {
                    try {
                        $start = new \DateTime($fechaInicio);
                        $end = new \DateTime($fechaFin);
                        $lunes = 0;
                        while ($start <= $end) {
                            if ($start->format('N') == 1) $lunes++;
                            $start->modify('+1 day');
                        }
                        if ($lunes > 0) $lunesMes = $lunes;
                    } catch (\Exception $e) {}
                }
                $sueldoSemanal = (min($baseMensualCalculo, 650) * 12) / 52;
                $tasaSPF = $sueldoSemanal * 0.005;

                // Evitar doble multiplicación si el aux de la solicitud ya contiene "Lunes" y se multiplicará por la cantidad (lunes) en el bucle principal.
                $auxStr = strtolower(strval($c['aux'] ?? $c['Auxiliar'] ?? $c['aux_qty'] ?? ''));
                if (strpos($auxStr, 'lunes') !== false) {
                    return $tasaSPF;
                }
                return $tasaSPF * $lunesMes;
            }

            if ($codigo === 'FAOV' || strpos($nombre, 'ahorro habitacional') !== false) {
                return $totAsig * 0.01;
            }

            return floatval($c['Monto'] ?? $c['monto'] ?? 0);
        };

        // Primer Pase: Asignaciones y Bonificaciones
        foreach ($individualConcepts as $c) {
            $tipo = $c['Tipo'] ?? $c['tipo'] ?? '';
            if ($tipo !== 'Deducción') {
                $mu = $getConceptAmountPHP($c, $salarioBase, 0);
                $q = $extractQty($c['aux'] ?? $c['Auxiliar'] ?? $c['aux_qty'] ?? '');
                $total = $mu * $q;
                $totalAsig += $total;

                $calculatedConcepts[] = array_merge($c, [
                    'Monto_Unitario' => $mu,
                    'Cantidad' => $q,
                    'Monto' => $total
                ]);
            }
        }

        // Segundo Pase: Deducciones
        foreach ($individualConcepts as $c) {
            $tipo = $c['Tipo'] ?? $c['tipo'] ?? '';
            if ($tipo === 'Deducción') {
                $mu = $getConceptAmountPHP($c, $salarioBase, $totalAsig);
                $q = $extractQty($c['aux'] ?? $c['Auxiliar'] ?? $c['aux_qty'] ?? '');
                $total = $mu * $q;
                $totalDedu += $total;

                $calculatedConcepts[] = array_merge($c, [
                    'Monto_Unitario' => $mu,
                    'Cantidad' => $q,
                    'Monto' => $total
                ]);
            }
        }

        $neto = $totalAsig - $totalDedu;

        return [
            'salarioBase' => $salarioBase,
            'neto' => $neto,
            'conceptos' => $calculatedConcepts
        ];
    }

    public function updatePayslipStatus(Request $request, $id)
    {
        $action = $request->input('action');
        if (!in_array($action, ['publish', 'annul', 'revert'])) {
            return response()->json(['error' => 'Acción inválida.'], 422);
        }

        $payslip = DB::table('payslips')->where('Id_Payslip', $id)->first();
        if (!$payslip) {
            return response()->json(['error' => 'Recibo no encontrado.'], 404);
        }

        $data = json_decode($payslip->Data, true) ?: [];
        $currentStatus = $data['status'] ?? 'Pendiente';
        $isBatch = isset($data['isBatch']) && $data['isBatch'];

        if ($action === 'revert') {
            if (!in_array($currentStatus, ['Publicado', 'Anulado'])) {
                return response()->json(['error' => 'No se puede revertir este recibo.'], 422);
            }

            $referenceTime = $data['published_at'] ?? $data['annulled_at'] ?? null;
            if (!$referenceTime || now()->diffInHours(
                
                \Carbon\Carbon::parse($referenceTime)
            ) >= 24) {
                return response()->json(['error' => 'El período de reversión expiró.'], 422);
            }

            $data['status'] = 'Pendiente';
            unset($data['published_at'], $data['annulled_at']);
            $status = 'Pendiente';

            if ($isBatch && $currentStatus === 'Publicado') {
                $allPayslips = DB::table('payslips')->get();
                foreach ($allPayslips as $p) {
                    $pData = json_decode($p->Data, true);
                    if (isset($pData['batch_id']) && strval($pData['batch_id']) === strval($id)) {
                        DB::table('payslips')->where('Id_Payslip', $p->Id_Payslip)->delete();
                    }
                }
            }
        } else {
            $status = $action === 'publish' ? 'Publicado' : 'Anulado';
            $data['status'] = $status;

            if ($action === 'publish') {
                $data['published_at'] = now()->toDateTimeString();
                unset($data['annulled_at']);

                if ($isBatch && $currentStatus !== 'Publicado') {
                    if (isset($data['recibos'])) {
                        foreach ($data['recibos'] as $recibo) {
                            $individualData = [
                                'fechaPago' => $data['fechaPago'] ?? now()->toDateString(),
                                'periodo' => $data['periodo'] ?? '',
                                'fechaInicio' => $data['fechaInicio'] ?? '',
                                'fechaFin' => $data['fechaFin'] ?? '',
                                'salarioBase' => $recibo['salarioBase'] ?? 0,
                                'neto' => $recibo['neto'] ?? 0,
                                'isIndividualFromBatch' => true,
                                'batch_id' => $id,
                                'trabajadorId' => $recibo['trabajadorId'],
                                'trabajador' => $recibo['trabajador'],
                                'cedula' => $recibo['cedula'],
                                'conceptos' => $recibo['conceptos'] ?? [],
                                'tipoNomina' => $data['tipoNomina'] ?? '',
                                'status' => 'Publicado',
                                'published_at' => $data['published_at']
                            ];
                            
                            DB::table('payslips')->insert([
                                'Id_Trabajador' => $recibo['trabajadorId'],
                                'Fecha_Pago' => $data['fechaPago'] ?? now()->toDateString(),
                                'Salario_Base' => $recibo['salarioBase'] ?? 0,
                                'Neto' => $recibo['neto'] ?? 0,
                                'Data' => json_encode($individualData)
                            ]);
                        }
                    }
                }
            }
            if ($action === 'annul') {
                $data['annulled_at'] = now()->toDateTimeString();
                unset($data['published_at']);

                if ($isBatch && $currentStatus === 'Publicado') {
                    $allPayslips = DB::table('payslips')->get();
                    foreach ($allPayslips as $p) {
                        $pData = json_decode($p->Data, true);
                        if (isset($pData['batch_id']) && strval($pData['batch_id']) === strval($id)) {
                            DB::table('payslips')->where('Id_Payslip', $p->Id_Payslip)->delete();
                        }
                    }
                }
            }
        }

        DB::table('payslips')
            ->where('Id_Payslip', $id)
            ->update(['Data' => json_encode($data)]);

        return response()->json(['success' => true, 'status' => $status]);
    }

    // Admin: Obtener historial de recibos (por ahora filtrado a hoy)
    public function getAllPayslips()
    {
        $rows = DB::table('payslips as p')
            ->leftJoin('trabajador as w', 'p.Id_Trabajador', '=', 'w.Id_Trabajador')
            ->leftJoin('contrato_trabajadores as ct', 'w.Id_Trabajador', '=', 'ct.Id_Trabajador')
            ->leftJoin('tipo_nomina as tn', 'ct.Id_Tipo_Nomina', '=', 'tn.Id_Tipo_Nomina')
            ->select('p.Id_Payslip', 'p.Fecha_Pago', 'p.Neto', 'p.Data', 'w.Nombre_Completo', 'w.Apellidos', 'w.Documento_Identidad as Cedula', 'tn.Frecuencia as TipoNomina')
            ->orderBy('p.Fecha_Pago', 'desc')
            ->get();

        $result = $rows->map(function ($r) {
            $data = json_decode($r->Data, true) ?: [];
            
            if (isset($data['isIndividualFromBatch']) && $data['isIndividualFromBatch']) {
                return null;
            }

            $isBatch = isset($data['isBatch']) && $data['isBatch'];

            $recibos = [];
            if ($isBatch && isset($data['recibos'])) {
                foreach ($data['recibos'] as $rec) {
                    $recibos[] = [
                        'trabajadorId' => $rec['trabajadorId'] ?? null,
                        'trabajador' => $rec['trabajador'] ?? 'N/A',
                        'cedula' => $rec['cedula'] ?? '-'
                    ];
                }
            }

            return [
                'id' => $r->Id_Payslip,
                'trabajador' => trim(($r->Nombre_Completo ?? '') . ' ' . ($r->Apellidos ?? '')) ?: ($data['trabajador'] ?? 'N/A'),
                'cedula' => $r->Cedula ?? ($data['cedula'] ?? '-'),
                'fechaPago' => $r->Fecha_Pago,
                'tipoNomina' => $r->TipoNomina ?? ($data['tipoNomina'] ?? 'Todos'),
                'periodo' => $data['periodo'] ?? ($data['periodo'] ?? '-'),
                'status' => $data['status'] ?? 'Pendiente',
                'neto' => $r->Neto,
                'published_at' => $data['published_at'] ?? null,
                'annulled_at' => $data['annulled_at'] ?? null,
                'isBatch' => $isBatch,
                'recibos' => $recibos
            ];
        })->filter()->values();

        return response()->json($result);
    }

    // Admin: Mostrar/Previsualizar recibo (renderiza la misma vista que trabajador pero sin restricciones)
    public function showPayslipAdmin(Request $request, $id)
    {
        $payslip = DB::table('payslips')
            ->where('Id_Payslip', $id)
            ->first();

        if (!$payslip) abort(404, 'Recibo no encontrado.');

        $data = json_decode($payslip->Data, true) ?: [];
        $isBatch = isset($data['isBatch']) && $data['isBatch'];
        $workerIdParam = $request->query('worker_id');

        $formatCurrency = function($amount) { return number_format($amount, 2, ',', '.'); };
        $formatDate = function($date) { return $date ? date('d/m/Y', strtotime($date)) : 'N/A'; };

        if ($isBatch) {
            $recibos = $data['recibos'] ?? [];

            // If a specific worker is selected from the batch
            if ($workerIdParam) {
                $found = null;
                foreach ($recibos as $rec) {
                    if (strval($rec['trabajadorId']) === strval($workerIdParam)) {
                        $found = $rec;
                        break;
                    }
                }
                if (!$found) abort(404, 'Trabajador no encontrado en este lote de recibos.');

                $trabajadorData = DB::table('trabajador as w')
                    ->leftJoin('cargo as c', 'w.Id_Cargo', '=', 'c.Id_Cargo')
                    ->leftJoin('contrato_trabajadores as ct', 'w.Id_Trabajador', '=', 'ct.Id_Trabajador')
                    ->leftJoin('tipo_nomina as tn', 'ct.Id_Tipo_Nomina', '=', 'tn.Id_Tipo_Nomina')
                    ->select('tn.Frecuencia as Tipo_Nomina', 'c.Nombre_profesión as Cargo')
                    ->where('w.Id_Trabajador', $found['trabajadorId'])
                    ->first();

                $cargo = $trabajadorData->Cargo ?? 'N/A';
                $tipoNomina = $trabajadorData->Tipo_Nomina ?? 'N/A';

                $finalConceptos = [];
                $totalAsig = 0; $totalDeduc = 0;
                foreach (($found['conceptos'] ?? []) as $c) {
                    $nombre = $c['Nombre_Concepto'] ?? ($c['descripcion'] ?? '---');
                    $codigo = $c['Codigo'] ?? ($c['codigo'] ?? ($c['Id_Concepto'] ?? '---'));
                    $tipo = $c['Tipo'] ?? '';
                    $aux = $c['aux'] ?? $c['Auxiliar'] ?? $c['aux_qty'] ?? '';
                    $unidades = 1;
                    if (preg_match('/(\d+(\.\d+)?)/', $aux, $m)) $unidades = floatval($m[0]);
                    $montoUnitario = $c['Monto_Unitario'] ?? $c['Monto'] ?? 0;
                    $monto = floatval($montoUnitario) * $unidades;
                    $asig = ($tipo === 'Asignación' || $tipo === 'Bonificación') ? $monto : 0;
                    $deduc = ($tipo === 'Deducción') ? $monto : 0;
                    $totalAsig += $asig; $totalDeduc += $deduc;
                    $finalConceptos[] = [
                        'codigo' => $codigo,
                        'nombre' => $nombre,
                        'aux' => $aux,
                        'asignacion' => $asig > 0 ? $formatCurrency($asig) : '',
                        'deduccion' => $deduc > 0 ? $formatCurrency($deduc) : ''
                    ];
                }

                $numeroRecibo = str_pad($id, 7, '0', STR_PAD_LEFT) . '-' . str_pad($found['trabajadorId'], 3, '0', STR_PAD_LEFT);

                return view('trabajador.payslip', [
                    'isMultiple' => false,
                    'fechaPago' => $formatDate($payslip->Fecha_Pago),
                    'numeroRecibo' => $numeroRecibo,
                    'trabajador' => $found['trabajador'],
                    'fechaInicio' => $formatDate($data['fechaInicio'] ?? ''),
                    'cedula' => $found['cedula'],
                    'fechaFin' => $formatDate($data['fechaFin'] ?? ''),
                    'salarioBase' => $formatCurrency($found['salarioBase'] ?? 0),
                    'cargo' => $cargo,
                    'tipoNomina' => $tipoNomina,
                    'periodo' => $data['periodo'] ?? '',
                    'conceptos' => $finalConceptos,
                    'totalAsig' => $formatCurrency($totalAsig),
                    'totalDeduc' => $formatCurrency($totalDeduc),
                    'netoPago' => $formatCurrency($totalAsig - $totalDeduc)
                ]);
            } else {
                // View all workers in the batch
                $payslipsList = [];
                foreach ($recibos as $rec) {
                    $trabajadorData = DB::table('trabajador as w')
                        ->leftJoin('cargo as c', 'w.Id_Cargo', '=', 'c.Id_Cargo')
                        ->leftJoin('contrato_trabajadores as ct', 'w.Id_Trabajador', '=', 'ct.Id_Trabajador')
                        ->leftJoin('tipo_nomina as tn', 'ct.Id_Tipo_Nomina', '=', 'tn.Id_Tipo_Nomina')
                        ->select('tn.Frecuencia as Tipo_Nomina', 'c.Nombre_profesión as Cargo')
                        ->where('w.Id_Trabajador', $rec['trabajadorId'])
                        ->first();

                    $cargo = $trabajadorData->Cargo ?? 'N/A';
                    $tipoNomina = $trabajadorData->Tipo_Nomina ?? 'N/A';

                    $finalConceptos = [];
                    $totalAsig = 0; $totalDeduc = 0;
                    foreach (($rec['conceptos'] ?? []) as $c) {
                        $nombre = $c['Nombre_Concepto'] ?? ($c['descripcion'] ?? '---');
                        $codigo = $c['Codigo'] ?? ($c['codigo'] ?? ($c['Id_Concepto'] ?? '---'));
                        $tipo = $c['Tipo'] ?? '';
                        $aux = $c['aux'] ?? $c['Auxiliar'] ?? $c['aux_qty'] ?? '';
                        $unidades = 1;
                        if (preg_match('/(\d+(\.\d+)?)/', $aux, $m)) $unidades = floatval($m[0]);
                        $montoUnitario = $c['Monto_Unitario'] ?? $c['Monto'] ?? 0;
                        $monto = floatval($montoUnitario) * $unidades;
                        $asig = ($tipo === 'Asignación' || $tipo === 'Bonificación') ? $monto : 0;
                        $deduc = ($tipo === 'Deducción') ? $monto : 0;
                        $totalAsig += $asig; $totalDeduc += $deduc;
                        $finalConceptos[] = [
                            'codigo' => $codigo,
                            'nombre' => $nombre,
                            'aux' => $aux,
                            'asignacion' => $asig > 0 ? $formatCurrency($asig) : '',
                            'deduccion' => $deduc > 0 ? $formatCurrency($deduc) : ''
                        ];
                    }

                    $numeroRecibo = str_pad($id, 7, '0', STR_PAD_LEFT) . '-' . str_pad($rec['trabajadorId'], 3, '0', STR_PAD_LEFT);

                    $payslipsList[] = [
                        'fechaPago' => $formatDate($payslip->Fecha_Pago),
                        'numeroRecibo' => $numeroRecibo,
                        'trabajador' => $rec['trabajador'],
                        'fechaInicio' => $formatDate($data['fechaInicio'] ?? ''),
                        'cedula' => $rec['cedula'],
                        'fechaFin' => $formatDate($data['fechaFin'] ?? ''),
                        'salarioBase' => $formatCurrency($rec['salarioBase'] ?? 0),
                        'cargo' => $cargo,
                        'tipoNomina' => $tipoNomina,
                        'periodo' => $data['periodo'] ?? '',
                        'conceptos' => $finalConceptos,
                        'totalAsig' => $formatCurrency($totalAsig),
                        'totalDeduc' => $formatCurrency($totalDeduc),
                        'netoPago' => $formatCurrency($totalAsig - $totalDeduc)
                    ];
                }

                return view('trabajador.payslip', [
                    'isMultiple' => true,
                    'payslips' => $payslipsList,
                    'trabajador' => $data['tipoNomina'] . ' - ' . $data['periodo']
                ]);
            }
        } else {
            // Legacy single payslip format fallback
            $fechaPago = $payslip->Fecha_Pago;
            $salarioBase = $payslip->Salario_Base ?? 0;
            $neto = $payslip->Neto;

            $trabajadorInfo = $data['trabajador'] ?? 'N/A';
            $cedula = $data['cedula'] ?? 'N/A';
            $periodo = $data['periodo'] ?? 'N/A';
            $fechaInicio = $data['fechaInicio'] ?? '';
            $fechaFin = $data['fechaFin'] ?? '';
            $conceptos = $data['conceptos'] ?? [];
            $numeroRecibo = $data['numeroRecibo'] ?? str_pad($id, 10, '0', STR_PAD_LEFT);

            $trabajadorData = DB::table('trabajador as w')
                ->leftJoin('cargo as c', 'w.Id_Cargo', '=', 'c.Id_Cargo')
                ->leftJoin('contrato_trabajadores as ct', 'w.Id_Trabajador', '=', 'ct.Id_Trabajador')
                ->leftJoin('tipo_nomina as tn', 'ct.Id_Tipo_Nomina', '=', 'tn.Id_Tipo_Nomina')
                ->select('tn.Frecuencia as Tipo_Nomina', 'c.Nombre_profesión as Cargo')
                ->where('w.Id_Trabajador', $payslip->Id_Trabajador)
                ->first();

            $cargo = $trabajadorData->Cargo ?? 'N/A';
            $tipoNomina = $trabajadorData->Tipo_Nomina ?? 'N/A';

            $finalConceptos = [];
            $totalAsig = 0; $totalDeduc = 0;
            foreach ($conceptos as $c) {
                $nombre = $c['Nombre_Concepto'] ?? ($c['descripcion'] ?? '---');
                $codigo = $c['Codigo'] ?? ($c['codigo'] ?? ($c['Id_Concepto'] ?? '---'));
                $tipo = $c['Tipo'] ?? '';
                $aux = $c['aux'] ?? '';
                $unidades = 1;
                if (preg_match('/(\d+(\.\d+)?)/', $aux, $m)) $unidades = floatval($m[0]);
                $montoUnitario = $c['Monto'] ?? 0;
                $monto = floatval($montoUnitario) * $unidades;
                $asig = ($tipo === 'Asignación' || $tipo === 'Bonificación') ? $monto : 0;
                $deduc = ($tipo === 'Deducción') ? $monto : 0;
                $totalAsig += $asig; $totalDeduc += $deduc;
                $finalConceptos[] = [ 'codigo' => $codigo, 'nombre' => $nombre, 'aux' => $aux, 'asignacion' => $asig > 0 ? $formatCurrency($asig) : '', 'deduccion' => $deduc > 0 ? $formatCurrency($deduc) : '' ];
            }

            return view('trabajador.payslip', [
                'isMultiple' => false,
                'fechaPago' => $formatDate($fechaPago),
                'numeroRecibo' => $numeroRecibo,
                'trabajador' => $trabajadorInfo,
                'fechaInicio' => $formatDate($fechaInicio),
                'cedula' => $cedula,
                'fechaFin' => $formatDate($fechaFin),
                'salarioBase' => $formatCurrency($salarioBase),
                'cargo' => $cargo,
                'tipoNomina' => $tipoNomina,
                'periodo' => is_numeric($periodo) ? "Quincena " . $periodo : $periodo,
                'conceptos' => $finalConceptos,
                'totalAsig' => $formatCurrency($totalAsig),
                'totalDeduc' => $formatCurrency($totalDeduc),
                'netoPago' => $formatCurrency($totalAsig - $totalDeduc)
            ]);
        }
    }

    // --- Cargos y Otros ---

    public function listCargos(Request $request)
    {
        $area = $request->query('area');
        if ($area) {
            $cargos = Cargo::where('Area', $area)->get();
        } else {
            $cargos = Cargo::all();
        }

        return response()->json(['cargos' => $cargos]);
    }

    public function listAreas()
    {
        $areas = Cargo::select('Area')
            ->whereNotNull('Area')
            ->where('Area', '!=', '')
            ->distinct()
            ->orderBy('Area')
            ->pluck('Area')
            ->toArray();

        return response()->json(['areas' => $areas]);
    }

    public function storeCargo(Request $request)
    {
        $data = $request->validate([
            'Nombre_profesión' => 'required|string',
            'Area' => 'nullable|string'
        ]);

        $cargo = Cargo::create($data);
        \App\Models\SystemLog::write('Gestión de Cargos', "Se ha creado el cargo '{$data['Nombre_profesión']}'.");
        return response()->json(['success' => true, 'id' => $cargo->Id_Cargo]);
    }
    public function updateCargo(Request $request, $id)
    {
        $cargo = Cargo::findOrFail($id);
        $data = $request->validate([
            'Nombre_profesión' => 'required|string',
            'Area' => 'nullable|string'
        ]);
        $cargo->update($data);
        \App\Models\SystemLog::write('Gestión de Cargos', "Se ha actualizado el cargo '{$data['Nombre_profesión']}'.");
        return response()->json(['success' => true]);
    }

    public function toggleCargoStatus($id)
    {
        $cargo = Cargo::findOrFail($id);
        $cargo->Estado = ($cargo->Estado === 'Activo') ? 'Inactivo' : 'Activo';
        $cargo->save();
        $accion = $cargo->Estado === 'Activo' ? 'activado' : 'desactivado';
        \App\Models\SystemLog::write('Gestión de Cargos', "Se ha {$accion} el cargo '{$cargo->Nombre_profesión}'.");
        return response()->json(['success' => true, 'new_status' => $cargo->Estado]);
    }

    public function listEducationLevels()
    {
        $niveles = DB::table('nivel_educativo')->get();
        return response()->json(['niveles' => $niveles]);
    }

    // --- Pagos de Vacaciones ---

    public function listVacationPayments()
    {
        if (!DB::getSchemaBuilder()->hasTable('vacation_payments')) {
            return response()->json(['payments' => []]);
        }

        $payments = DB::table('vacation_payments as vp')
            ->join('trabajador as w', 'vp.Id_Trabajador', '=', 'w.Id_Trabajador')
            ->select(
                'vp.*',
                'w.Nombre_Completo',
                'w.Apellidos',
                'w.Documento_Identidad'
            )
            ->orderBy('vp.created_at', 'desc')
            ->get();

        return response()->json(['payments' => $payments]);
    }

    public function getPaidYears($workerId)
    {
        if (!DB::getSchemaBuilder()->hasTable('vacation_payments')) {
            return response()->json(['paid_years' => []]);
        }
        $years = DB::table('vacation_payments')
            ->where('Id_Trabajador', $workerId)
            ->where('status', '!=', 'Anulado')
            ->pluck('payment_year')
            ->toArray();

        return response()->json(['paid_years' => $years]);
    }

    public function storeVacationPayment(Request $request)
    {
        $data = $request->validate([
            'Id_Trabajador'    => 'required|integer|exists:trabajador,Id_Trabajador',
            'payment_year'     => 'required|integer|min:2000|max:2099',
            'salario_mensual'  => 'required|numeric|min:130',
            'dias_vacaciones'  => 'required|integer|min:1|max:30',
            'dias_bono'        => 'required|integer|min:1|max:30',
            'monto_vacaciones' => 'required|numeric|min:0',
            'monto_bono'       => 'required|numeric|min:0',
            'total'            => 'required|numeric|min:0',
        ]);

        // Verificar que el año no haya sido pagado ya
        if (DB::getSchemaBuilder()->hasTable('vacation_payments')) {
            $alreadyPaid = DB::table('vacation_payments')
                ->where('Id_Trabajador', $data['Id_Trabajador'])
                ->where('payment_year', $data['payment_year'])
                ->where('status', '!=', 'Anulado')
                ->exists();

            if ($alreadyPaid) {
                return response()->json(['error' => 'Este año vacacional ya fue pagado para este trabajador.'], 422);
            }
        }

        // Crear tabla si no existe (migración perezosa usando Schema Builder para compatibilidad)
        if (!DB::getSchemaBuilder()->hasTable('vacation_payments')) {
            \Illuminate\Support\Facades\Schema::create('vacation_payments', function ($table) {
                $table->increments('id');
                $table->integer('Id_Trabajador');
                $table->integer('payment_year');
                $table->decimal('salario_mensual', 10, 2);
                $table->integer('dias_vacaciones');
                $table->integer('dias_bono');
                $table->decimal('monto_vacaciones', 10, 2);
                $table->decimal('monto_bono', 10, 2);
                $table->decimal('total', 10, 2);
                $table->timestamps();
            });
        }

        $id = DB::table('vacation_payments')->insertGetId([
            'Id_Trabajador'    => $data['Id_Trabajador'],
            'payment_year'     => $data['payment_year'],
            'salario_mensual'  => $data['salario_mensual'],
            'dias_vacaciones'  => $data['dias_vacaciones'],
            'dias_bono'        => $data['dias_bono'],
            'monto_vacaciones' => $data['monto_vacaciones'],
            'monto_bono'       => $data['monto_bono'],
            'total'            => $data['total'],
            'created_at'       => now(),
            'updated_at'       => now(),
        ]);

        $trabajadorInfo = DB::table('trabajador')->where('Id_Trabajador', $data['Id_Trabajador'])->first();
        $nombreTrabajador = $trabajadorInfo ? ($trabajadorInfo->Nombre_Completo . ' ' . $trabajadorInfo->Apellidos) : "ID {$data['Id_Trabajador']}";
        $adminUser = auth()->user();
        \App\Models\SystemLog::write('Pago de Vacaciones', "El administrador '{$adminUser->Nombre_usuario}' procesó el pago de vacaciones del año {$data['payment_year']} para '{$nombreTrabajador}' por un total de {$data['total']} (Recibo ID: {$id}).");

        return response()->json(['success' => true, 'id' => $id]);
    }

    public function showVacationPayslip($id)
    {
        if (!DB::getSchemaBuilder()->hasTable('vacation_payments')) {
            abort(404, 'Pago no encontrado.');
        }

        $vp = DB::table('vacation_payments as vp')
            ->join('trabajador as w', 'vp.Id_Trabajador', '=', 'w.Id_Trabajador')
            ->leftJoin('cargo as c', 'w.Id_Cargo', '=', 'c.Id_Cargo')
            ->leftJoin('contrato_trabajadores as ct', 'w.Id_Trabajador', '=', 'ct.Id_Trabajador')
            ->leftJoin('tipo_nomina as tn', 'ct.Id_Tipo_Nomina', '=', 'tn.Id_Tipo_Nomina')
            ->select(
                'vp.*',
                'w.Nombre_Completo',
                'w.Apellidos',
                'w.Documento_Identidad',
                'w.Fecha_de_Ingreso',
                'c.Nombre_profesión as Cargo',
                'tn.Frecuencia as TipoNomina'
            )
            ->where('vp.id', $id)
            ->first();

        if (!$vp) abort(404, 'Pago de vacaciones no encontrado.');

        $formatCurrency = function($amount) { return number_format($amount, 2, ',', '.'); };
        $formatDate     = function($date)   { return $date ? date('d/m/Y', strtotime($date)) : 'N/A'; };

        $salarioDiario   = $vp->salario_mensual / 30;
        $montoVacaciones = round($salarioDiario * $vp->dias_vacaciones, 2);
        $montoBono       = round($salarioDiario * $vp->dias_bono, 2);
        $totalAsig       = $montoVacaciones + $montoBono;

        $conceptos = [
            [
                'codigo'     => 'VAC',
                'nombre'     => 'Días de vacaciones',
                'aux'        => $vp->dias_vacaciones . ' días',
                'asignacion' => $formatCurrency($montoVacaciones),
                'deduccion'  => '',
            ],
            [
                'codigo'     => 'BVAC',
                'nombre'     => 'Bono vacacional',
                'aux'        => $vp->dias_bono . ' días',
                'asignacion' => $formatCurrency($montoBono),
                'deduccion'  => '',
            ],
        ];

        $numeroRecibo = 'VAC-' . str_pad($id, 8, '0', STR_PAD_LEFT);
        $fechaEmision = $formatDate($vp->created_at ?? now()->toDateString());

        // Período: Año vacacional pagado (e.g. "Período 2022 → 2023")
        $periodoLabel = 'Período ' . $vp->payment_year . ' → ' . ($vp->payment_year + 1);

        // Calcular Desde (un día después de emisión, saltando fin de semana a lunes)
        $emissionTime = strtotime($vp->created_at ?? now());
        $dayOfWeek = (int)date('N', $emissionTime);

        if ($dayOfWeek == 6 || $dayOfWeek == 7) {
            $desdeTime = strtotime('next Monday', $emissionTime);
        } else {
            $desdeTime = strtotime('+1 day', $emissionTime);
        }

        // Calcular Hasta sin fines de semana (contando Desde como Día 1)
        $currentDate = $desdeTime;
        $daysCounted = 0;
        $targetDays = (int)$vp->dias_vacaciones;

        while ($daysCounted < $targetDays) {
            $currentW = (int)date('N', $currentDate);
            if ($currentW < 6) {
                $daysCounted++;
            }
            if ($daysCounted < $targetDays) {
                $currentDate = strtotime('+1 day', $currentDate);
            }
        }
        $hastaTime = $currentDate;

        $fechaDesde = $formatDate(date('Y-m-d', $desdeTime));
        $fechaHasta = $formatDate(date('Y-m-d', $hastaTime));

        return view('trabajador.vacation_payslip', [
            'fechaPago'    => $fechaEmision,
            'numeroRecibo' => $numeroRecibo,
            'trabajador'   => trim($vp->Nombre_Completo . ' ' . $vp->Apellidos),
            'cedula'       => $vp->Documento_Identidad,
            'cargo'        => $vp->Cargo ?? 'N/A',
            'tipoNomina'   => $vp->TipoNomina ?? 'Vacaciones',
            'salarioBase'  => $formatCurrency($vp->salario_mensual),
            'periodo'      => $periodoLabel,
            'fechaDesde'   => $fechaDesde,
            'fechaHasta'   => $fechaHasta,
            'conceptos'    => $conceptos,
            'totalAsig'    => $formatCurrency($totalAsig),
            'totalDeduc'   => '0,00',
            'netoPago'     => $formatCurrency($totalAsig),
        ]);
    }

    public function updateVacationPaymentStatus(Request $request, $id)
    {
        $action = $request->input('action');
        if (!in_array($action, ['publish', 'annul', 'revert'])) {
            return response()->json(['error' => 'Acción inválida.'], 422);
        }

        $payment = DB::table('vacation_payments')->where('id', $id)->first();
        if (!$payment) {
            return response()->json(['error' => 'Recibo no encontrado.'], 404);
        }

        $currentStatus = $payment->status ?? 'Pendiente';

        if ($action === 'revert') {
            if (!in_array($currentStatus, ['Publicado', 'Anulado'])) {
                return response()->json(['error' => 'No se puede revertir este recibo.'], 422);
            }

            $referenceTime = $payment->published_at ?? $payment->annulled_at ?? null;
            if (!$referenceTime || now()->diffInHours(
                \Carbon\Carbon::parse($referenceTime)
            ) >= 24) {
                return response()->json(['error' => 'El período de reversión expiró o es inválido.'], 422);
            }

            $status = 'Pendiente';
            DB::table('vacation_payments')
                ->where('id', $id)
                ->update([
                    'status' => 'Pendiente',
                    'published_at' => null,
                    'annulled_at' => null,
                    'updated_at' => now(),
                ]);
        } else {
            $status = $action === 'publish' ? 'Publicado' : 'Anulado';
            $updateData = [
                'status' => $status,
                'updated_at' => now(),
            ];

            if ($action === 'publish') {
                $updateData['published_at'] = now()->toDateTimeString();
                $updateData['annulled_at'] = null;
            }
            if ($action === 'annul') {
                $updateData['annulled_at'] = now()->toDateTimeString();
                $updateData['published_at'] = null;
            }

            DB::table('vacation_payments')
                ->where('id', $id)
                ->update($updateData);
        }

        return response()->json(['success' => true, 'status' => $status]);
    }

    public function listPermissionRequests()
    {
        $requests = SolicitudPermiso::with('trabajador')
            ->orderBy('Fecha', 'desc')
            ->orderBy('Id_Solicitud', 'desc')
            ->get();

        $formatted = $requests->map(function ($r) {
            $worker = $r->trabajador;
            $nombreCompleto = $worker ? ($worker->Nombre_Completo . ' ' . $worker->Apellidos) : '';
            return [
                'id' => $r->custom_id ?? (string)$r->Id_Solicitud,
                'Id_Solicitud' => $r->Id_Solicitud,
                'Fecha' => $r->Fecha,
                'FechaInicio' => str_replace(' ', 'T', substr($r->Fecha_Inicio, 0, 16)),
                'FechaFin' => str_replace(' ', 'T', substr($r->Fecha_Fin, 0, 16)),
                'Motivo' => $r->Motivo,
                'Estatus' => $r->Estado,
                'Remuneracion' => $r->Remuneracion,
                'Estado' => $r->Estado,
                'Trabajador' => $nombreCompleto,
                'Nombre_Completo' => $nombreCompleto,
                'Nombre' => $worker->Nombre_Completo ?? '',
                'Apellidos' => $worker->Apellidos ?? '',
                'Cedula' => $worker->Documento_Identidad ?? '',
                'Motivo_Rechazo' => $r->motivo_rechazo
            ];
        });

        return response()->json(['requests' => $formatted]);
    }

    public function updatePermissionRequestStatus(Request $request, $id)
    {
        $permiso = SolicitudPermiso::where('custom_id', $id)
            ->orWhere('Id_Solicitud', $id)
            ->firstOrFail();

        $validated = $request->validate([
            'status' => 'required|string|in:Aprobado,Rechazado,Pendiente',
            'remuneracion' => 'nullable|string',
            'reason' => 'nullable|string'
        ]);

        $permiso->Estado = $validated['status'];
        if ($validated['status'] === 'Aprobado') {
            $permiso->Remuneracion = $validated['remuneracion'] ?? 'Sí';
            $permiso->motivo_rechazo = null;
        } elseif ($validated['status'] === 'Rechazado') {
            $permiso->Remuneracion = 'No';
            $permiso->motivo_rechazo = $validated['reason'] ?? null;
        } else {
            $permiso->Remuneracion = 'Pendiente';
            $permiso->motivo_rechazo = null;
        }
        
        $permiso->save();

        $adminUser = auth()->user();
        $trabajadorInfo = DB::table('trabajador')->where('Id_Trabajador', $permiso->Id_Trabajador)->first();
        $nombreTrabajador = $trabajadorInfo ? ($trabajadorInfo->Nombre_Completo . ' ' . $trabajadorInfo->Apellidos) : "ID {$permiso->Id_Trabajador}";
        
        $detalles = "El administrador '{$adminUser->Nombre_usuario}' actualizó el estado de la solicitud de permiso #{$permiso->Id_Solicitud} de '{$nombreTrabajador}' a: '{$permiso->Estado}'";
        if ($permiso->Estado === 'Aprobado') {
            $detalles .= " (Remuneración: '{$permiso->Remuneracion}')";
        } elseif ($permiso->Estado === 'Rechazado') {
            $detalles .= " (Motivo: '{$permiso->motivo_rechazo}')";
        }
        $detalles .= ".";

        \App\Models\SystemLog::write('Gestión de Permisos', $detalles);

        return response()->json(['success' => true]);
    }

    /**
     * Bitácora del Sistema: lista todos los registros de auditoría.
     */
    public function listSystemLogs(Request $request)
    {
        $query = \App\Models\SystemLog::orderBy('created_at', 'desc');

        // Filtro opcional por búsqueda
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('username', 'like', "%{$search}%")
                  ->orWhere('action', 'like', "%{$search}%")
                  ->orWhere('details', 'like', "%{$search}%");
            });
        }

        // Filtro opcional por acción
        if ($action = $request->input('action_filter')) {
            $query->where('action', $action);
        }

        $logs = $query->limit(500)->get();

        return response()->json(['logs' => $logs]);
    }

    /**
     * ─────────────────────────────────────────────────────────────────────────
     *  SUPER-DASHBOARD  —  Endpoint centralizado de métricas del gerente/SU
     *  GET /superusuario/dashboard-metrics
     * ─────────────────────────────────────────────────────────────────────────
     *
     * Devuelve en una sola llamada HTTP cuatro bloques de datos:
     *
     *   1. sistema   → Usuarios, actividad de hoy, activos últimos 15 min
     *   2. personal  → Vacaciones hoy, permisos hoy, personal operativo
     *   3. nomina    → Último lote cerrado: neto total, asignaciones, retenciones
     *   4. auditoria → Últimos 5 logs críticos + alertas de permisos sin soporte
     */
    public function superDashboardMetrics()
    {
        $hoy        = now()->toDateString();          // 'YYYY-MM-DD'
        $inicioHoy  = now()->startOfDay();            // '2026-06-05 00:00:00'
        $hace15min  = now()->subMinutes(15);          // timestamp hace 15 minutos

        // ══════════════════════════════════════════════════════════════════════
        // BLOQUE 1 — MÉTRICAS DE SISTEMA
        // ══════════════════════════════════════════════════════════════════════

        // 1a. Total de usuarios registrados en el sistema
        $totalUsuarios = DB::table('usuario')->count();

        // 1b. Actividad del día: registros de la bitácora generados hoy
        $actividadHoy = DB::table('system_logs')
            ->whereDate('created_at', $hoy)
            ->count();

        // 1c. Usuarios "activos" = al menos un log en los últimos 15 min
        $activosUltimos15 = DB::table('system_logs')
            ->where('created_at', '>=', $hace15min)
            ->whereNotNull('user_id')
            ->distinct('user_id')
            ->count('user_id');

        // ══════════════════════════════════════════════════════════════════════
        // BLOQUE 2 — OPERATIVA DE PERSONAL
        // Criterio: solicitud con Estado = 'Aceptada' y hoy dentro del rango
        // ══════════════════════════════════════════════════════════════════════

        // 2a. Trabajadores en vacaciones HOY (calculando dinámicamente según días hábiles en PHP porque no existe Fecha_Fin_Vacaciones)
        $solicitudesVac = DB::table('solicitudes_vacaciones as sv')
            ->join('trabajador as w', 'sv.Id_Trabajador', '=', 'w.Id_Trabajador')
            ->select('sv.Fecha_Inicio_Vacaciones', 'w.Fecha_de_Ingreso', 'sv.Id_Trabajador')
            ->where('sv.Estado', 'Aceptada')
            ->get();

        $trabajadoresEnVacaciones = [];
        $hoyObj = new \DateTime($hoy);
        foreach ($solicitudesVac as $s) {
            if (!$s->Fecha_Inicio_Vacaciones) {
                continue;
            }
            $inicio = new \DateTime($s->Fecha_Inicio_Vacaciones);
            if ($inicio > $hoyObj) {
                continue;
            }

            // Calcular días de vacaciones (base 15 más 1 por cada año adicional de antigüedad)
            $dias = 15;
            if ($s->Fecha_de_Ingreso) {
                $ingreso = new \DateTime($s->Fecha_de_Ingreso);
                $diffYears = $ingreso->diff($inicio)->y;
                $dias = min(30, 15 + max(0, $diffYears - 1));
            }

            // Calcular fecha fin omitiendo fines de semana (contando Fecha_Inicio_Vacaciones como día 1)
            $curr = clone $inicio;
            $daysAdded = 0;
            while ($daysAdded < $dias) {
                $w = (int)$curr->format('N');
                if ($w < 6) { // Lunes a Viernes
                    $daysAdded++;
                }
                if ($daysAdded < $dias) {
                    $curr->modify('+1 day');
                }
            }

            if ($hoyObj >= $inicio && $hoyObj <= $curr) {
                $trabajadoresEnVacaciones[] = $s->Id_Trabajador;
            }
        }
        $vacacionesHoy = count(array_unique($trabajadoresEnVacaciones));

        // 2b. Trabajadores con permiso activo HOY
        $permisosHoy = DB::table('solicitudes_permisos')
            ->where('Estado', 'Aceptada')
            ->whereDate('Fecha_Inicio', '<=', $hoy)
            ->whereDate('Fecha_Fin',    '>=', $hoy)
            ->distinct('Id_Trabajador')
            ->count('Id_Trabajador');

        // 2c. Total de trabajadores activos (contrato Activo)
        $totalTrabajadores = DB::table('trabajador as w')
            ->join('contrato_trabajadores as ct', 'w.Id_Trabajador', '=', 'ct.Id_Trabajador')
            ->where('ct.Estado', 'Activo')
            ->count();

        $personalOperativo = max(0, $totalTrabajadores - $vacacionesHoy - $permisosHoy);

        // ══════════════════════════════════════════════════════════════════════
        // BLOQUE 3 — FINANZAS DEL ÚLTIMO LOTE DE NÓMINA CERRADO (Publicado)
        // La columna Data es JSON; filtramos por status = 'Publicado'
        // ══════════════════════════════════════════════════════════════════════

        $ultimoLote = null;
        $netoUltimoLote        = 0;
        $asignacionesUltimoLote = 0;
        $retencionesUltimoLote  = 0;
        $periodoUltimoLote      = null;
        $fechaUltimoLote        = null;
        $tipoUltimoLote         = null;

        // Traemos los últimos 50 payslips para buscar el más reciente 'Publicado'
        // (evitamos JSON_EXTRACT para mantener compatibilidad con SQLite/MySQL)
        $payslipsRecientes = DB::table('payslips')
            ->orderByDesc('Id_Payslip')
            ->limit(50)
            ->pluck('Data', 'Id_Payslip');

        foreach ($payslipsRecientes as $payslipId => $rawData) {
            $data = json_decode($rawData, true);
            if (!$data || ($data['status'] ?? '') !== 'Publicado') {
                continue;
            }
            // Ignorar los recibos individuales derivados de un lote
            if (!empty($data['isIndividualFromBatch'])) {
                continue;
            }

            // Encontramos el lote publicado más reciente
            $periodoUltimoLote = $data['periodo'] ?? null;
            $fechaUltimoLote   = $data['fechaPago'] ?? null;
            $tipoUltimoLote    = $data['tipoNomina'] ?? null;

            if (!empty($data['isBatch']) && !empty($data['recibos'])) {
                // Lote compacto: sumar neto, asignaciones y retenciones por recibo
                foreach ($data['recibos'] as $recibo) {
                    $netoUltimoLote += floatval($recibo['neto'] ?? 0);
                    foreach ($recibo['conceptos'] ?? [] as $concepto) {
                        $tipo   = strtolower($concepto['tipo'] ?? '');
                        $monto  = floatval($concepto['monto'] ?? 0);
                        if ($tipo === 'asignacion' || $tipo === 'bonificacion' || $tipo === 'bono') {
                            $asignacionesUltimoLote += $monto;
                        } elseif ($tipo === 'deduccion' || $tipo === 'retencion') {
                            $retencionesUltimoLote += $monto;
                        }
                    }
                }
            } else {
                // Recibo individual
                $netoUltimoLote = floatval($data['neto'] ?? 0);
                foreach ($data['conceptos'] ?? [] as $concepto) {
                    $tipo  = strtolower($concepto['tipo'] ?? '');
                    $monto = floatval($concepto['monto'] ?? 0);
                    if ($tipo === 'asignacion' || $tipo === 'bonificacion' || $tipo === 'bono') {
                        $asignacionesUltimoLote += $monto;
                    } elseif ($tipo === 'deduccion' || $tipo === 'retencion') {
                        $retencionesUltimoLote += $monto;
                    }
                }
            }
            break; // Solo el más reciente
        }

        // ══════════════════════════════════════════════════════════════════════
        // BLOQUE 4 — AUDITORÍA Y ALERTAS
        // ══════════════════════════════════════════════════════════════════════

        // 4a. Últimos 5 registros de la bitácora (todos los niveles)
        $ultimosLogs = DB::table('system_logs')
            ->select('Id_Log', 'username', 'action', 'details', 'created_at', 'ip_address')
            ->orderByDesc('created_at')
            ->orderByDesc('Id_Log')
            ->limit(5)
            ->get()
            ->map(function ($log) {
                return [
                    'id'         => $log->Id_Log,
                    'usuario'    => $log->username ?? 'Sistema',
                    'accion'     => $log->action,
                    'detalles'   => $log->details,
                    'hora'       => $log->created_at,
                    'ip'         => $log->ip_address,
                ];
            });

        // 4b. Alerta: permisos aceptados HOY que no tienen soporte adjunto
        //     El campo 'Remuneracion' se reutiliza para indicar si hay soporte:
        //     si sigue en 'Pendiente' se interpreta como "sin gestionar/sin soporte".
        //     (Adaptar este criterio si en el futuro se añade un campo dedicado)
        $permisosSinSoporte = DB::table('solicitudes_permisos')
            ->where('Estado', 'Aceptada')
            ->whereDate('Fecha_Inicio', '<=', $hoy)
            ->whereDate('Fecha_Fin',    '>=', $hoy)
            ->where(function ($q) {
                $q->where('Remuneracion', 'Pendiente')
                  ->orWhereNull('Remuneracion');
            })
            ->count();

        // ══════════════════════════════════════════════════════════════════════
        // RESPUESTA FINAL — JSON limpio y estructurado
        // ══════════════════════════════════════════════════════════════════════
        return response()->json([
            'sistema' => [
                'total_usuarios'      => $totalUsuarios,
                'actividad_hoy'       => $actividadHoy,
                'activos_15min'       => $activosUltimos15,
            ],
            'personal' => [
                'total_trabajadores'  => $totalTrabajadores,
                'vacaciones_hoy'      => $vacacionesHoy,
                'permisos_hoy'        => $permisosHoy,
                'personal_operativo'  => $personalOperativo,
            ],
            'nomina' => [
                'tiene_datos'         => $periodoUltimoLote !== null,
                'periodo'             => $periodoUltimoLote,
                'fecha_pago'          => $fechaUltimoLote,
                'tipo_nomina'         => $tipoUltimoLote,
                'neto_total'          => round($netoUltimoLote, 2),
                'total_asignaciones'  => round($asignacionesUltimoLote, 2),
                'total_retenciones'   => round($retencionesUltimoLote, 2),
            ],
            'auditoria' => [
                'ultimos_logs'           => $ultimosLogs,
                'permisos_sin_soporte'   => $permisosSinSoporte,
            ],
            'generado_en' => now()->toIso8601String(),
        ]);
    }
}

