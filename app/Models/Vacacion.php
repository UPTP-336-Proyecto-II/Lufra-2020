<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vacacion extends Model
{
    protected $table = 'solicitudes_vacaciones';
    protected $primaryKey = 'Id_Solicitud';
    public $timestamps = false;

    protected $fillable = [
        'Id_Trabajador',
        'Fecha_Solicitud',
        'Fecha_Inicio_Vacaciones',
        'Estado',
        'Fecha_Respuesta',
        'Observaciones',
    ];

    public function trabajador()
    {
        return $this->belongsTo(Trabajador::class, 'Id_Trabajador', 'Id_Trabajador');
    }
}
