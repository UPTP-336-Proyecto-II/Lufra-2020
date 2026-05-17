<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    // --- CONFIGURACIÓN DE BASE DE DATOS PERSONALIZADA ---
    protected $table = 'usuario'; 
    protected $primaryKey = 'Id_Usuario'; 

    /**
     * DESACTIVAR TIMESTAMPS
     * Se desactiva porque la tabla 'usuario' no tiene las columnas 
     * created_at y updated_at, lo que causaba el error SQL 1054.
     */
    public $timestamps = false; 
    // ----------------------------------------------------

    protected $fillable = [
        'Nombre_usuario', 
        'Correo',         
        'Contraseña',     
        'Id_rol',
        'Id_Trabajador',
        'Estado',
        'name',
        'email',
        'password',
    ];

    protected $casts = [
        'Contraseña' => 'hashed',
        'two_factor_confirmed_at' => 'datetime',
    ];

    public function trabajador()
    {
        return $this->belongsTo(Trabajador::class, 'Id_Trabajador', 'Id_Trabajador');
    }

    protected $hidden = [
        'Contraseña',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    public function getAuthPassword()
    {
        return $this->Contraseña;
    }

    public function roleModel()
    {
        return $this->belongsTo(Role::class, 'Id_rol', 'Id_rol');
    }

    /**
     * RELACIÓN DEL MÓDULO DE SEGURIDAD
     */
    public function respuestasSeguridad()
    {
        return $this->hasMany(RespuestaSeguridadUsuario::class, 'user_id', 'Id_Usuario');
    }

    public function getIdAttribute()
    {
        return $this->Id_Usuario;
    }
    
    public function getNameAttribute()
    {
        return $this->trabajador ? ($this->trabajador->Nombre_Completo . ' ' . $this->trabajador->Apellidos) : $this->Nombre_usuario;
    }


    public function getUsernameAttribute()
    {
        return $this->Nombre_usuario;
    }

    public function setUsernameAttribute($value)
    {
        $this->Nombre_usuario = $value;
    }

    public function getEmailAttribute()
    {
        return $this->Correo;
    }

    public function setEmailAttribute($value)
    {
        $this->Correo = $value;
    }

    public function setNameAttribute($value)
    {
        $this->Nombre_usuario = $value;
    }

    public function setPasswordAttribute($value)
    {
        $this->Contraseña = $value;
    }

    public function getPasswordAttribute()
    {
        return $this->Contraseña;
    }

    public function getAuthIdentifierName()
    {
        return 'Id_Usuario';
    }

    public function getAuthIdentifier()
    {
        return $this->Id_Usuario;
    }

    /**
     * ACCESSOR PARA EL ROL (Sincronizado con RoleMiddleware)
     */
    public function getRoleAttribute()
    {
        $rolesMap = [
            1 => 'administrativo',
            2 => 'trabajador',
            3 => 'superusuario',
        ];

        return $rolesMap[$this->Id_rol] ?? 'invitado';
    }
}