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
        if (!Schema::hasTable('solicitudes_vacaciones')) {
            return;
        }

        Schema::table('solicitudes_vacaciones', function (Blueprint $table) {
            if (!Schema::hasColumn('solicitudes_vacaciones', 'motivo_rechazo')) {
                $table->text('motivo_rechazo')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasTable('solicitudes_vacaciones')) {
            return;
        }

        Schema::table('solicitudes_vacaciones', function (Blueprint $table) {
            if (Schema::hasColumn('solicitudes_vacaciones', 'motivo_rechazo')) {
                $table->dropColumn('motivo_rechazo');
            }
        });
    }
};
