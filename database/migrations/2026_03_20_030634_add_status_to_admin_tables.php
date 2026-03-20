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
        Schema::table('cargo', function (Blueprint $table) {
            $table->string('Estado')->default('Activo')->after('Area');
        });
        Schema::table('tipo_nomina', function (Blueprint $table) {
            $table->string('Estado')->default('Activo')->after('Fecha_Fin');
        });
        Schema::table('concepto', function (Blueprint $table) {
            $table->string('Estado')->default('Activo')->after('Descripción');
        });
    }

    public function down(): void
    {
        Schema::table('cargo', function (Blueprint $table) {
            $table->dropColumn('Estado');
        });
        Schema::table('tipo_nomina', function (Blueprint $table) {
            $table->dropColumn('Estado');
        });
        Schema::table('concepto', function (Blueprint $table) {
            $table->dropColumn('Estado');
        });
    }
};
