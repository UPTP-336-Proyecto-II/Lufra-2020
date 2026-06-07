<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class SystemLog extends Model
{
    protected $table = 'system_logs';
    protected $primaryKey = 'Id_Log';
    public $timestamps = false;
    protected $guarded = [];

    /**
     * Escribe un registro en la bitácora del sistema de forma rápida.
     *
     * @param string $action
     * @param string $details
     * @return void
     */
    public static function write(string $action, string $details): void
    {
        try {
            $user = Auth::user();
            self::create([
                'user_id' => $user ? $user->Id_Usuario : null,
                'username' => $user ? $user->Nombre_usuario : 'Sistema/Invitado',
                'action' => $action,
                'details' => $details,
                'ip_address' => request()->ip(),
                'created_at' => now(),
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error al guardar log de sistema: ' . $e->getMessage());
        }
    }
}
