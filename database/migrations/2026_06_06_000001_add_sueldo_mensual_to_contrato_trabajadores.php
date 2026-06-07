<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Agrega el campo Sueldo_Mensual a la tabla contrato_trabajadores.
     * Esto permite almacenar el salario base individual de cada trabajador,
     * necesario para calcular correctamente el neto en nóminas por lote.
     */
    public function up(): void
    {
        Schema::table('contrato_trabajadores', function (Blueprint $table) {
            // 130.00 = salario mínimo nacional de referencia por defecto
            $table->decimal('Sueldo_Mensual', 12, 2)->nullable()->default(130.00)->after('Id_Tipo_Nomina');
        });
    }

    public function down(): void
    {
        Schema::table('contrato_trabajadores', function (Blueprint $table) {
            $table->dropColumn('Sueldo_Mensual');
        });
    }
};
