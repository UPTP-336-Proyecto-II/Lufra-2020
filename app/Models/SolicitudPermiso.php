<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SolicitudPermiso extends Model
{
    protected $table = 'solicitudes_permisos';
    protected $primaryKey = 'Id_Solicitud';
    
    public $timestamps = false;

    protected $fillable = [
        'Id_Trabajador',
        'Fecha',
        'Fecha_Inicio',
        'Fecha_Fin',
        'Motivo',
        'Estado',
        'Remuneracion',
        'motivo_rechazo',
        'custom_id',
    ];

    public function trabajador()
    {
        return $this->belongsTo(Trabajador::class, 'Id_Trabajador', 'Id_Trabajador');
    }
}
