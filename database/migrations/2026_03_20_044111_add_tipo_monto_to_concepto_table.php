<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('concepto', function (Blueprint $table) {
            if (!Schema::hasColumn('concepto', 'Tipo')) {
                $table->string('Tipo', 50)->nullable()->after('Nombre_Concepto');
            }
            if (!Schema::hasColumn('concepto', 'Monto')) {
                $table->decimal('Monto', 10, 2)->default(0)->after('Tipo');
            }
        });

        // Actualizar datos existentes basados en el código
        DB::table('concepto')->where('Codigo', 'like', 'A%')->update(['Tipo' => 'Asignación']);
        DB::table('concepto')->where('Codigo', 'like', 'D%')->update(['Tipo' => 'Deducción']);
        DB::table('concepto')->where('Codigo', 'like', 'B%')->update(['Tipo' => 'Bonificación']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('concepto', function (Blueprint $table) {
            $table->dropColumn(['Tipo', 'Monto']);
        });
    }
};
