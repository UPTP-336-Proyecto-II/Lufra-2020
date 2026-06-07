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
        if (Schema::hasTable('solicitudes_permisos')) {
            return;
        }

        Schema::create('solicitudes_permisos', function (Blueprint $table) {
            $table->increments('Id_Solicitud');
            $table->integer('Id_Trabajador');
            $table->date('Fecha_Solicitud');
            $table->dateTime('Fecha_Inicio');
            $table->dateTime('Fecha_Fin');
            $table->text('Motivo');
            $table->string('Estado', 50)->default('Pendiente');
            $table->string('Remuneracion', 20)->default('Pendiente');
            $table->text('motivo_rechazo')->nullable();
            $table->string('custom_id', 100)->nullable();
            $table->timestamps();

            // Foreign key to trabajador
            $table->foreign('Id_Trabajador', 'fk_permisos_trabajador')
                  ->references('Id_Trabajador')
                  ->on('trabajador')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solicitudes_permisos');
    }
};
