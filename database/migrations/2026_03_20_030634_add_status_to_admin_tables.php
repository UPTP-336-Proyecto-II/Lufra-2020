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
        if (Schema::hasTable('cargo')) {
            Schema::table('cargo', function (Blueprint $table) {
                if (!Schema::hasColumn('cargo', 'Estado')) {
                    $table->string('Estado')->default('Activo')->after('Area');
                }
            });
        }

        if (Schema::hasTable('tipo_nomina')) {
            Schema::table('tipo_nomina', function (Blueprint $table) {
                if (!Schema::hasColumn('tipo_nomina', 'Estado')) {
                    $table->string('Estado')->default('Activo')->after('Fecha_Fin');
                }
            });
        }

        if (Schema::hasTable('concepto')) {
            Schema::table('concepto', function (Blueprint $table) {
                if (!Schema::hasColumn('concepto', 'Estado')) {
                    $table->string('Estado')->default('Activo')->after('Descripción');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('cargo') && Schema::hasColumn('cargo', 'Estado')) {
            Schema::table('cargo', function (Blueprint $table) {
                $table->dropColumn('Estado');
            });
        }

        if (Schema::hasTable('tipo_nomina') && Schema::hasColumn('tipo_nomina', 'Estado')) {
            Schema::table('tipo_nomina', function (Blueprint $table) {
                $table->dropColumn('Estado');
            });
        }

        if (Schema::hasTable('concepto') && Schema::hasColumn('concepto', 'Estado')) {
            Schema::table('concepto', function (Blueprint $table) {
                $table->dropColumn('Estado');
            });
        }
    }
};
