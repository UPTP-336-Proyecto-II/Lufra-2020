<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trabajador extends Model
{
    protected $table = 'trabajador';
    protected $primaryKey = 'Id_Trabajador';
    public $timestamps = false;

    protected $fillable = [
        'Id_Cargo',
        'Id_Nivel_Educativo',
        'Nombre_Completo',
        'Apellidos',
        'Fecha_Nacimiento',
        'Genero',
        'Documento_Identidad',
        'Correo',
        'Telefono_Movil',
        'Direccion',
        'Estado_Civil',
        'Fecha_de_Ingreso',
    ];

    public function user()
    {
        return $this->hasOne(User::class, 'Id_Trabajador', 'Id_Trabajador');
    }

    public function vacations()
    {
        return $this->hasMany(Vacacion::class, 'Id_Trabajador', 'Id_Trabajador');
    }
}
