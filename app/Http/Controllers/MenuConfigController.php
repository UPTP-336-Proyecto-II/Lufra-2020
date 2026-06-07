<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Configuración dinámica del menú por rol.
 *
 * La configuración se guarda como JSON en la tabla `settings`
 * bajo la clave `menu_config` con la forma:
 * { "SuperUsuario": ["*"], "Administrativo": ["Pago de Nómina", ...], "Trabajador": [...] }
 *
 * Si un rol no aparece en la configuración (o ésta no existe),
 * el frontend muestra el menú completo por defecto.
 */
class MenuConfigController extends Controller
{
    private const SETTINGS_KEY = 'menu_config';

    /**
     * Devuelve la configuración del menú (disponible para cualquier usuario autenticado).
     */
    public function show()
    {
        $row = DB::table('settings')->where('skey', self::SETTINGS_KEY)->first();
        $config = $row ? json_decode($row->svalue, true) : null;

        return response()->json(['config' => $config]);
    }

    /**
     * Guarda la configuración del menú (solo SuperUsuario, protegido por ruta).
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'config' => 'required|array',
            'config.*' => 'array',
            'config.*.*' => 'string',
        ]);

        $config = $data['config'];

        // Salvaguarda anti-bloqueo: el SuperUsuario nunca puede perder
        // el acceso a "Gestión de Usuarios y Roles" ni a "Inicio".
        if (isset($config['SuperUsuario']) && !in_array('*', $config['SuperUsuario'], true)) {
            foreach (['Inicio', 'Gestión de Usuarios y Roles'] as $obligatorio) {
                if (!in_array($obligatorio, $config['SuperUsuario'], true)) {
                    $config['SuperUsuario'][] = $obligatorio;
                }
            }
        }

        DB::table('settings')->updateOrInsert(
            ['skey' => self::SETTINGS_KEY],
            ['svalue' => json_encode($config, JSON_UNESCAPED_UNICODE), 'updated_at' => now()]
        );

        \App\Models\SystemLog::write('Gestión de Usuarios', 'Se ha actualizado la configuración del menú por rol.');

        return response()->json(['success' => true, 'config' => $config]);
    }
}
