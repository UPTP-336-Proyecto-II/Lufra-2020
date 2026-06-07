<?php

namespace App\Http\Controllers;

use App\Models\Trabajador;
use App\Models\Vacacion;
use App\Models\SolicitudPermiso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class WorkerController extends Controller
{
    public function getProfile()
    {
        $user = Auth::user();
        if (!$user->Id_Trabajador) {
            return response()->json(['error' => 'No hay un trabajador vinculado a este usuario.'], 404);
        }

        $trabajador = DB::table('trabajador as w')
            ->leftJoin('cargo as c', 'w.Id_Cargo', '=', 'c.Id_Cargo')
            ->select('w.*', 'c.Nombre_profesión as Cargo')
            ->where('w.Id_Trabajador', $user->Id_Trabajador)
            ->first();

        if (!$trabajador) {
            return response()->json(['error' => 'No se encontró la información del trabajador.'], 404);
        }

        return response()->json($trabajador);
    }

    public function getVacations()
    {
        $user = Auth::user();
        if (!$user->Id_Trabajador) {
            return response()->json(['error' => 'Trabajador no identificado.'], 404);
        }

        $trabajador = Trabajador::find($user->Id_Trabajador);
        $lastRequest = Vacacion::where('Id_Trabajador', $user->Id_Trabajador)
            ->orderBy('Id_Solicitud', 'desc')
            ->first();
            
        $allRequests = Vacacion::where('Id_Trabajador', $user->Id_Trabajador)
            ->orderBy('Id_Solicitud', 'desc')
            ->get();

        return response()->json([
            'fechaIngreso' => $trabajador->Fecha_de_Ingreso,
            'lastRequest' => $lastRequest,
            'allRequests' => $allRequests
        ]);
    }

    public function storeVacationRequest(Request $request)
    {
        $user = Auth::user();
        if (!$user->Id_Trabajador) {
            return response()->json(['error' => 'Trabajador no identificado.'], 404);
        }

        $request->validate([
            'startDate' => 'required|date|after:today',
        ]);

        $vacacion = Vacacion::create([
            'Id_Trabajador' => $user->Id_Trabajador,
            'Fecha_Solicitud' => now()->toDateString(),
            'Fecha_Inicio_Vacaciones' => $request->startDate,
            'Estado' => 'Pendiente',
        ]);

        \App\Models\SystemLog::write('Solicitud de Vacaciones', "El trabajador '{$user->Nombre_usuario}' solicitó vacaciones a partir del {$request->startDate} (ID Solicitud: {$vacacion->Id_Solicitud}).");

        return response()->json(['success' => true, 'id' => $vacacion->Id_Solicitud]);
    }

    public function getPayslips()
    {
        $user = Auth::user();
        if (!$user->Id_Trabajador) {
            return response()->json(['error' => 'Trabajador no identificado.'], 404);
        }

        $trabajador = Trabajador::find($user->Id_Trabajador);
        $cedula = $trabajador->Documento_Identidad;

        $payslips = DB::table('payslips')
            ->where(function ($query) use ($user, $cedula) {
                $query->where('Id_Trabajador', $user->Id_Trabajador)
                      ->orWhere('Data', 'like', '%"cedula":"' . $cedula . '"%');
            })
            ->where('Data', 'like', '%"status":"Publicado"%')
            ->orderBy('Fecha_Pago', 'desc')
            ->get();

        // Parse JSON data
        $formattedPayslips = $payslips->map(function ($p) {
            $data = json_decode($p->Data);
            
            if (isset($data->isBatch) && $data->isBatch) {
                return null;
            }

            return [
                'id' => $p->Id_Payslip,
                'fechaPago' => $p->Fecha_Pago,
                'periodo' => $data->periodo ?? '-',
                'neto' => $p->Neto,
                'status' => $data->status ?? 'Pendiente',
            ];
        })->filter()->unique('id')->values();

        return response()->json($formattedPayslips);
    }

    public function showPayslip($id)
    {
        $user = Auth::user();
        if (!$user->Id_Trabajador) {
            abort(404, 'Trabajador no identificado.');
        }

        $payslip = DB::table('payslips')
            ->where('Id_Payslip', $id)
            ->first();

        if (!$payslip) {
            abort(404, 'Recibo no encontrado.');
        }

        // Decode JSON extended data
        $data = json_decode($payslip->Data, true);

        $status = $data['status'] ?? 'Pendiente';
        if ($status !== 'Publicado') {
            abort(404, 'Recibo no disponible.');
        }

        // Access checks (Ensure worker only views their own by validating DB id or JSON cedula)
        $trabajador = Trabajador::find($user->Id_Trabajador);
        if ($payslip->Id_Trabajador != $user->Id_Trabajador && (!isset($data['cedula']) || $data['cedula'] !== $trabajador->Documento_Identidad)) {
            abort(403, 'Acceso denegado a este recibo.');
        }

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
            ->where('w.Id_Trabajador', $user->Id_Trabajador)
            ->first();
            
        $cargo = $trabajadorData->Cargo ?? 'N/A';
        $tipoNomina = $trabajadorData->Tipo_Nomina ?? 'N/A';

        $totalAsig = 0;
        $totalDeduc = 0;

        $hasSueldo = false;
        foreach($conceptos as $c) {
            $desc = $c['Nombre_Concepto'] ?? ($c['descripcion'] ?? '');
            if (stripos($desc, 'Sueldo') !== false || stripos($desc, 'Salario') !== false || stripos($desc, 'Dias Laborables') !== false) {
                $hasSueldo = true; break;
            }
        }

        $computedConceptos = $conceptos;

        if (!$hasSueldo && $salarioBase > 0) {
            $computedConceptos[] = [
                'codigo' => '001',
                'Nombre_Concepto' => 'Sueldo Mensual',
                'Tipo' => 'Asignación',
                'Monto' => $salarioBase,
                'aux' => '30 Días'
            ];
        }

        $hasSSO = false; $hasRPE = false; $hasFAOV = false;
        foreach($conceptos as $c) {
            $desc = $c['Nombre_Concepto'] ?? ($c['descripcion'] ?? '');
            $codigoC = $c['Codigo'] ?? ($c['codigo'] ?? '');
            
            if (stripos($desc, 'SSO') !== false || stripos($desc, 'Seguro Social') !== false || $codigoC === 'IVSS') $hasSSO = true;
            if (stripos($desc, 'RPE') !== false || stripos($desc, 'Desempleo') !== false || $codigoC === 'SPF') $hasRPE = true;
            if (stripos($desc, 'FAOV') !== false || stripos($desc, 'Vivienda') !== false || $codigoC === 'FAOV') $hasFAOV = true;
        }

        $totalIngresos = 0;
        foreach($computedConceptos as $c) {
            $nombreC = $c['Nombre_Concepto'] ?? ($c['nombre'] ?? '');
            $tipoC = $c['Tipo'] ?? '';
            $auxC = $c['aux'] ?? '';
            $unidC = $this->extractNumeric($auxC);
            $montoC = ($c['Monto'] ?? ($c['asignacion'] ?? ($c['monto'] ?? 0)));

            // Basic check for daily concepts if Monto is 0 but it's a known daily type
            if ($montoC <= 0) {
                $kwD = ['dias laborables', 'días laborables', 'dias no laborados', 'días no laborados', 'sueldo', 'salario', 'descanso', 'vacaciones'];
                foreach($kwD as $kw) {
                    if (stripos($nombreC, $kw) !== false) {
                        $montoC = $salarioBase / 30;
                        break;
                    }
                }
            }

            if ($tipoC === 'Asignación' || $tipoC === 'Bonificación' || stripos($nombreC, 'Sueldo') !== false || stripos($nombreC, 'Asignación') !== false) {
                $totalIngresos += ($montoC * $unidC);
            }
        }

        // Per user request, base for retentions should be total income (assignments)
        // If it's a quincena (standard), we multiply by 2 for the monthly cap check.
        // We set it to 0 if no assignments are present to avoid auto-calculating on base salary.
        $baseCalculo = ($totalIngresos > 0) ? ($totalIngresos * 2) : 0; 


        if ($baseCalculo > 0) {
            $topeMensual = 130.00 * 5; // SALARIO_MINIMO_LEGAL = 130
            $baseDeduccion = min($baseCalculo, $topeMensual); 
            $sueldoSemanal = ($baseDeduccion * 12) / 52;

            // countMondays logic
            $lunesMes = 4;
            if ($fechaInicio && $fechaFin) {
                try {
                    $start = new \DateTime($fechaInicio);
                    $end = new \DateTime($fechaFin);
                    $lunesMes = 0;
                    while ($start <= $end) {
                        if ($start->format('N') == 1) $lunesMes++;
                        $start->modify('+1 day');
                    }
                    if ($lunesMes == 0) $lunesMes = 2;
                } catch (\Exception $e) {}
            }

            if (!$hasSSO) {
                $montoSSO = $sueldoSemanal * 0.04 * $lunesMes;
                $computedConceptos[] = ['Codigo' => 'IVSS', 'Nombre_Concepto' => 'Seguro Social Obligatorio (4%)', 'Tipo' => 'Deducción', 'Monto' => $montoSSO, 'aux' => $lunesMes . ' Lunes'];
            }
            if (!$hasRPE) {
                $montoRPE = $sueldoSemanal * 0.005 * $lunesMes;
                $computedConceptos[] = ['Codigo' => 'SPF', 'Nombre_Concepto' => 'Régimen Prest. de Empleo (0.5%)', 'Tipo' => 'Deducción', 'Monto' => $montoRPE, 'aux' => $lunesMes . ' Lunes'];
            }
            if (!$hasFAOV) {
                $montoFAOV = $totalIngresos * 0.01;
                $computedConceptos[] = ['Codigo' => 'FAOV', 'Nombre_Concepto' => 'Ahorro Habitacional (1%)', 'Tipo' => 'Deducción', 'Monto' => $montoFAOV, 'aux' => '1%'];
            }
        }

        $finalConceptos = [];
        $totalAsig = 0;
        $totalDeduc = 0;

        foreach ($computedConceptos as $c) {
            $nombre = $c['Nombre_Concepto'] ?? ($c['descripcion'] ?? '---');
            $codigo = $c['Codigo'] ?? ($c['codigo'] ?? ($c['Id_Concepto'] ?? '---'));
            $tipo = $c['Tipo'] ?? '';
            $aux = $c['aux'] ?? '';
            $unidades = $this->extractNumeric($aux);
            $montoUnitario = $c['Monto'] ?? ($c['asignacion'] ?? ($c['deduccion'] ?? 0));

            $isDailyBased = false;
            $keywordsDiarios = ['dias laborables', 'días laborables', 'dias no laborados', 'días no laborados', 'faltas', 'inasistencias', 'vacaciones', 'bono vacacional', 'permiso no remunerado', 'utilidades', 'bono de produccion', 'bono de asistencia', 'sueldo', 'salario', 'dias de descanso', 'días de descanso', 'dia de descanso', 'día de descanso', 'descanso', 'descansos'];
            
            foreach($keywordsDiarios as $kw) {
                if (stripos($nombre, $kw) !== false) {
                    $isDailyBased = true;
                    break;
                }
            }
            if ($isDailyBased) {
                $montoUnitario = $salarioBase / 30;
            }

            $monto = floatval($montoUnitario) * $unidades;

            $asig = ($tipo === 'Asignación' || $tipo === 'Bonificación') ? $monto : 0;
            $deduc = ($tipo === 'Deducción') ? $monto : 0;

            if (!$tipo) {
                $asig = ($c['asignacion'] ?? 0) * $unidades;
                $deduc = ($c['deduccion'] ?? 0) * $unidades;
            }

            $totalAsig += $asig;
            $totalDeduc += $deduc;

            $finalConceptos[] = [
                'codigo' => $codigo,
                'nombre' => $nombre,
                'aux' => $aux,
                'asignacion' => $asig > 0 ? $this->formatCurrency($asig) : '',
                'deduccion' => $deduc > 0 ? $this->formatCurrency($deduc) : ''
            ];
        }

        return view('trabajador.payslip', [
            'fechaPago' => $this->formatDate($fechaPago),
            'numeroRecibo' => $numeroRecibo,
            'trabajador' => $trabajadorInfo,
            'fechaInicio' => $this->formatDate($fechaInicio),
            'cedula' => $cedula,
            'fechaFin' => $this->formatDate($fechaFin),
            'salarioBase' => $this->formatCurrency($salarioBase),
            'cargo' => $cargo,
            'tipoNomina' => $tipoNomina,
            'periodo' => is_numeric($periodo) ? "Quincena " . $periodo : $periodo,
            'conceptos' => $finalConceptos,
            'totalAsig' => $this->formatCurrency($totalAsig),
            'totalDeduc' => $this->formatCurrency($totalDeduc),
            'netoPago' => $this->formatCurrency($totalAsig - $totalDeduc)
        ]);
    }

    private function formatCurrency($amount) {
        return number_format($amount, 2, ',', '.');
    }

    private function formatDate($date) {
        if (!$date) return 'N/A';
        return date('d/m/Y', strtotime($date));
    }

    private function extractNumeric($str) {
        if (!$str) return 1.0;
        if (preg_match('/(\d+(\.\d+)?)/', $str, $matches)) {
            return floatval($matches[0]);
        }
        return 1.0;
    }

    public function getVacationPayments()
    {
        $user = Auth::user();
        if (!$user->Id_Trabajador) {
            return response()->json(['error' => 'Trabajador no identificado.'], 404);
        }

        if (!DB::getSchemaBuilder()->hasTable('vacation_payments')) {
            return response()->json([]);
        }

        $payments = DB::table('vacation_payments')
            ->where('Id_Trabajador', $user->Id_Trabajador)
            ->where('status', 'Publicado')
            ->orderBy('created_at', 'desc')
            ->get();

        $formatted = $payments->map(function ($p) {
            return [
                'id' => $p->id,
                'fechaPago' => date('Y-m-d', strtotime($p->created_at)),
                'periodo' => 'Período ' . $p->payment_year . ' → ' . ($p->payment_year + 1),
                'neto' => $p->total,
                'status' => $p->status,
            ];
        });

        return response()->json($formatted);
    }

    public function showVacationPayslip($id)
    {
        $user = Auth::user();
        if (!$user->Id_Trabajador) {
            abort(404, 'Trabajador no identificado.');
        }

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

        // Enforce worker check
        if ($vp->Id_Trabajador != $user->Id_Trabajador) {
            abort(403, 'Acceso denegado a este recibo.');
        }

        if ($vp->status !== 'Publicado') {
            abort(404, 'Recibo no disponible/publicado.');
        }

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

    public function getPermissionRequests()
    {
        $user = Auth::user();
        if (!$user->Id_Trabajador) {
            return response()->json(['error' => 'Trabajador no identificado.'], 404);
        }

        $requests = SolicitudPermiso::where('Id_Trabajador', $user->Id_Trabajador)
            ->orderBy('Fecha', 'desc')
            ->orderBy('Id_Solicitud', 'desc')
            ->get();

        $formatted = $requests->map(function ($r) use ($user) {
            $worker = $user->trabajador;
            $nombreCompleto = $worker ? ($worker->Nombre_Completo . ' ' . $worker->Apellidos) : '';
            return [
                'id' => $r->custom_id ?? (string)$r->Id_Solicitud,
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

    public function storePermissionRequest(Request $request)
    {
        $user = Auth::user();
        if (!$user->Id_Trabajador) {
            return response()->json(['error' => 'Trabajador no identificado.'], 404);
        }

        $validated = $request->validate([
            'FechaInicio' => 'required',
            'FechaFin' => 'required',
            'Motivo' => 'required|string',
            'id' => 'nullable|string'
        ]);

        $fechaInicio = str_replace('T', ' ', $validated['FechaInicio']);
        $fechaFin = str_replace('T', ' ', $validated['FechaFin']);

        $permiso = SolicitudPermiso::create([
            'Id_Trabajador' => $user->Id_Trabajador,
            'Fecha' => now()->toDateString(),
            'Fecha_Inicio' => $fechaInicio,
            'Fecha_Fin' => $fechaFin,
            'Motivo' => $validated['Motivo'],
            'Estado' => 'Pendiente',
            'Remuneracion' => 'Pendiente',
            'custom_id' => $validated['id'] ?? null
        ]);

        \App\Models\SystemLog::write('Solicitud de Permiso', "El trabajador '{$user->Nombre_usuario}' solicitó un permiso por motivo: '{$validated['Motivo']}' desde el {$fechaInicio} hasta el {$fechaFin} (ID: {$permiso->Id_Solicitud}).");

        return response()->json(['success' => true, 'id' => $permiso->Id_Solicitud]);
    }
}
