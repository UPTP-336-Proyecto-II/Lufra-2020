<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Recibo de Pago - {{ $trabajador }}</title>
    <style>
        @page {
            size: letter landscape;
            margin: 10mm;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 11px;
            color: #333;
            margin: 0;
            padding: 20px;
            background-color: #f7f9fc;
        }
        .container {
            width: 100%;
            max-width: 1000px;
            margin: auto;
            border: 2px solid #000;
            border-radius: 12px;
            padding: 30px;
            box-sizing: border-box;
            background-color: #fff;
            box-shadow: 0px 4px 15px rgba(0,0,0,0.05);
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }
        .box {
            border: 1.5px solid #000;
            border-radius: 8px;
            padding: 12px;
        }
        .company-info {
            width: 55%;
        }
        .logo-box {
            width: 160px;
            float: left;
            margin-right: 20px;
            margin-top: -2px;
            margin-left: -5px;
        }
        .company-text {
            float: left;
        }
        .company-text h2 {
            margin: 0;
            font-size: 18px;
            color: #1e3c96;
        }
        .company-text p {
            margin: 4px 0;
            font-size: 11px;
        }
        .receipt-info {
            width: 40%;
            text-align: right;
            vertical-align: top;
        }
        .receipt-info h1 {
            margin: 0 0 10px 0;
            font-size: 22px;
            text-transform: uppercase;
            color: #333;
        }
        .receipt-info p {
            margin: 3px 0;
            font-size: 11px;
        }
        .number-box {
            display: inline-block;
            border: 1.5px solid #000;
            padding: 6px 18px;
            border-radius: 6px;
            margin-top: 8px;
            font-weight: bold;
            background-color: #f9f9f9;
        }
        .worker-box {
            width: 100%;
            margin-bottom: 25px;
            box-sizing: border-box;
        }
        .worker-table {
            width: 100%;
            border-collapse: collapse;
        }
        .worker-table td {
            padding: 8px;
            vertical-align: middle;
        }
        .label {
            font-weight: bold;
            color: #555;
            width: 120px;
        }
        .concepts-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }
        .concepts-table th {
            border-top: 2px solid #000;
            border-bottom: 2px solid #000;
            padding: 12px 10px;
            font-size: 11px;
            background-color: #f4f4f4;
            text-transform: uppercase;
            color: #444;
            text-align: left;
        }
        .concepts-table td {
            padding: 10px;
            font-size: 12px;
            border-bottom: 1px solid #eee;
            vertical-align: middle;
        }
        .text-left {
            text-align: left !important;
        }
        .text-right {
            text-align: right !important;
        }
        .text-center {
            text-align: center !important;
        }
        .col-monto {
            width: 120px;
            font-weight: 500;
        }
        .totals-row td {
            border-top: 2.5px solid #000;
            font-weight: bold;
            padding: 15px 10px;
            font-size: 13px;
            background-color: #fafafa;
        }
        .net-pay-box {
            float: right;
            width: 350px;
            border: 2.5px solid #000;
            border-radius: 10px;
            padding: 15px;
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #fff;
        }
        .net-pay-label {
            font-size: 16px;
            font-weight: bold;
            color: #333;
        }
        .net-pay-amount {
            font-size: 20px;
            font-weight: bold;
            color: #000;
        }
        .no-print {
            margin-bottom: 20px;
            text-align: center;
            padding: 15px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            max-width: 1000px;
            margin-left: auto;
            margin-right: auto;
        }
        .btn-print {
            background-color: #27ae60;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: background 0.2s;
        }
        .btn-print:hover {
            background-color: #219653;
        }
        @media print {
            .no-print {
                display: none;
            }
            body {
                padding: 0;
                background-color: #fff;
            }
            .container {
                box-shadow: none;
                border: 2px solid #000;
                margin: 0;
            }
            .box {
                border-width: 1px;
            }
        }
        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }
    </style>
</head>
<body>

<div class="no-print">
    <button onclick="window.print()" class="btn-print">🖨️ Imprimir Recibo / Guardar PDF</button>
</div>

<div class="container">
    <table class="header-table">
        <tr>
            <td class="company-info" style="vertical-align: top;">
                <div class="box clearfix" style="display: inline-block; padding-right: 25px;">
                    <div class="logo-box">
                        <img src="{{ asset('img/logo-exacto.png') }}" alt="Logo Lufra" style="width: 100%; height: auto; border-radius: 4px; display: block;">
                    </div>
                    <div class="company-text">
                        <h2>LUFRA 2020</h2>
                        <p><strong>R.I.F.:</strong> J-50032437-5</p>
                        <p><strong>Dirección:</strong> Acarigua, Venezuela</p>
                        <p><strong>Teléfonos:</strong> +58 424-5114575</p>
                    </div>
                </div>
            </td>
            <td class="receipt-info">
                <h1>RECIBO DE PAGO</h1>
                <p><strong>Fecha Emisión:</strong> {{ $fechaPago }}</p>
                <div class="number-box">
                    Número: {{ $numeroRecibo }}
                </div>
            </td>
        </tr>
    </table>

    <div class="worker-box box">
        <table class="worker-table">
            <tr>
                <td width="12%" class="label">Empleado:</td>
                <td width="38%">{{ $trabajador }}</td>
                <td width="12%" class="label">Desde:</td>
                <td width="38%">{{ $fechaInicio }}</td>
            </tr>
            <tr>
                <td class="label">Cédula:</td>
                <td>{{ $cedula }}</td>
                <td class="label">Hasta:</td>
                <td>{{ $fechaFin }}</td>
            </tr>
            <tr>
                <td class="label">Sueldo Mensual:</td>
                <td>Bs. {{ $salarioBase }}</td>
                <td class="label">Período:</td>
                <td>{{ $periodo }}</td>
            </tr>
        </table>
    </div>

    <table class="concepts-table">
        <thead>
            <tr>
                <th width="8%" class="text-center">COD</th>
                <th width="47%">Descripción</th>
                <th width="15%" class="text-right">Auxiliar</th>
                <th width="15%" class="text-right">Asignación</th>
                <th width="15%" class="text-right">Deducción</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($conceptos as $c)
                <tr>
                    <td class="text-center">{{ $c['codigo'] }}</td>
                    <td>{{ $c['nombre'] }}</td>
                    <td class="text-right">{{ $c['aux'] }}</td>
                    <td class="text-right col-monto">{{ $c['asignacion'] ? 'Bs. ' . $c['asignacion'] : '' }}</td>
                    <td class="text-right col-monto">{{ $c['deduccion'] ? 'Bs. ' . $c['deduccion'] : '' }}</td>
                </tr>
            @endforeach
            
            @php
                $minRows = 10;
                $rowsNeeded = $minRows - count($conceptos);
            @endphp
            @for ($i = 0; $i < $rowsNeeded; $i++)
                <tr>
                    <td colspan="5">&nbsp;</td>
                </tr>
            @endfor

            <tr class="totals-row">
                <td colspan="3" class="text-right">TOTALES ACUMULADOS:</td>
                <td class="text-right col-monto">Bs. {{ $totalAsig }}</td>
                <td class="text-right col-monto">Bs. {{ $totalDeduc }}</td>
            </tr>
        </tbody>
    </table>

    <div class="clearfix">
        <div class="net-pay-box clearfix">
            <span class="net-pay-label">NETO A PAGAR:</span>
            <span class="net-pay-amount">Bs. {{ $netoPago }}</span>
        </div>
    </div>
</div>

</body>
</html>
