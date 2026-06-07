<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\PreguntaSeguridad;
use App\Models\RespuestaSeguridadUsuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SeguridadController extends Controller
{
    /**
     * VISTA: Mostrar el formulario para registrar o editar las preguntas de seguridad.
     */
    public function mostrarConfigurarPreguntas()
    {
        // Obtenemos todas las preguntas maestras de la tabla 'preguntas_seguridad'
        $preguntas = DB::table('preguntas_seguridad')->get();

        // BÚSQUEDA CLAVE: Verificamos si el usuario actual ya posee una pregunta registrada
        $preguntaActual = DB::table('respuestas_seguridad_usuario')
                            ->where('user_id', Auth::user()->Id_Usuario)
                            ->first();

        return view('auth.configurar-preguntas', compact('preguntas', 'preguntaActual'));
    }

    /**
     * PROCESO: Guardar o actualizar la pregunta de seguridad del usuario en la base de datos.
     */
    public function guardarPreguntas(Request $request)
    {
        $request->validate([
            'pregunta_id' => 'required|exists:preguntas_seguridad,id',
            'respuesta' => 'required|string|max:255',
            'current_password' => 'required|string',
            'new_password' => 'nullable|string|min:8|confirmed',
        ], [
            'pregunta_id.required' => 'Debe seleccionar una pregunta de seguridad.',
            'respuesta.required' => 'Debe ingresar una respuesta.',
            'current_password.required' => 'La contraseña actual es obligatoria para verificar tu identidad.',
            'new_password.min' => 'La nueva contraseña debe tener al menos 8 caracteres.',
            'new_password.confirmed' => 'La confirmación de la nueva contraseña no coincide.'
        ]);

        $usuario = Auth::user();

        if (!$usuario) {
            return redirect()->route('login');
        }

        // Verificar la contraseña actual
        if (!Hash::check($request->current_password, $usuario->Contraseña)) {
            if ($request->expectsJson()) {
                return response()->json([
                    'errors' => ['current_password' => ['La contraseña ingresada es incorrecta.']]
                ], 422);
            }
            return redirect()->back()->withErrors(['current_password' => 'La contraseña ingresada es incorrecta.'])->withInput();
        }

        // Si desea cambiar la contraseña
        if ($request->filled('new_password')) {
            $newPassword = $request->new_password;

            // 1. Verificar si coincide con la contraseña actual
            if (Hash::check($newPassword, $usuario->Contraseña)) {
                $errorResponse = ['errors' => ['new_password' => ['No puedes establecer esta contraseña porque ya la utilizaste recientemente.']]];
                if ($request->expectsJson()) {
                    return response()->json($errorResponse, 422);
                }
                return redirect()->back()->withErrors($errorResponse['errors'])->withInput();
            }

            // 2. Verificar contra el historial de contraseñas
            $history = DB::table('password_history')
                ->where('user_id', $usuario->Id_Usuario)
                ->orderBy('id', 'desc')
                ->take(9)
                ->get();

            foreach ($history as $record) {
                if (Hash::check($newPassword, $record->password_hash)) {
                    $errorResponse = ['errors' => ['new_password' => ['No puedes establecer esta contraseña porque ya la utilizaste recientemente.']]];
                    if ($request->expectsJson()) {
                        return response()->json($errorResponse, 422);
                    }
                    return redirect()->back()->withErrors($errorResponse['errors'])->withInput();
                }
            }

            // 3. Guardar la contraseña actual en el historial
            // Asegurar que la tabla de historial exista
            if (!DB::getSchemaBuilder()->hasTable('password_history')) {
                \Illuminate\Support\Facades\Schema::create('password_history', function ($table) {
                    $table->increments('id');
                    $table->integer('user_id');
                    $table->string('password_hash');
                    $table->timestamp('created_at')->useCurrent();
                });
            }

            DB::table('password_history')->insert([
                'user_id' => $usuario->Id_Usuario,
                'password_hash' => $usuario->Contraseña,
                'created_at' => now(),
            ]);

            // 4. Actualizar la contraseña
            $usuario->Contraseña = Hash::make($newPassword);
            $usuario->save();

            \App\Models\SystemLog::write('Cambio de Contraseña', "El usuario '{$usuario->Nombre_usuario}' ha actualizado su contraseña desde el panel de seguridad.");
        }

        // Limpiamos y encriptamos la respuesta ya que el validador usa Hash::check
        $respuestaTexto = strtolower(trim($request->respuesta));
        $respuestaHash = Hash::make($respuestaTexto);

        // ARQUITECTURA CORREGIDA: Buscamos únicamente por 'user_id' para evitar duplicar registros.
        // Si ya existe una fila de este usuario, reemplaza la pregunta y la respuesta limpiamente.
        DB::table('respuestas_seguridad_usuario')->updateOrInsert(
            [
                'user_id' => $usuario->Id_Usuario
            ],
            [
                'pregunta_id' => $request->pregunta_id,
                'respuesta_hash' => $respuestaHash,
                'created_at' => now(),
                'updated_at' => now()
            ]
        );

        \App\Models\SystemLog::write('Preguntas de Seguridad', "El usuario '{$usuario->Nombre_usuario}' ha actualizado sus parámetros de seguridad (preguntas secretas).");

        // Redirigimos al panel principal del usuario tras guardar correctamente
        if ($request->expectsJson()) {
            $redirectUrl = route('trabajador.dashboard');
            if (strtolower($usuario->role) === 'superusuario') {
                $redirectUrl = route('superusuario.dashboard');
            } elseif (strtolower($usuario->role) === 'administrativo') {
                $redirectUrl = route('administrativo.dashboard');
            }
            return response()->json([
                'success' => true,
                'message' => '¡Configuración de seguridad guardada con éxito!',
                'redirect' => $redirectUrl
            ]);
        }

        return $this->redirectUserToPanel($usuario)->with('success', '¡Configuración de seguridad guardada con éxito!');
    }

    /**
     * Redirige al usuario al panel correcto según su rol.
     */
    private function redirectUserToPanel($usuario)
    {
        switch (strtolower($usuario->role)) {
            case 'superusuario':
                return redirect()->route('superusuario.dashboard');
            case 'administrativo':
                return redirect()->route('administrativo.dashboard');
            case 'trabajador':
            default:
                return redirect()->route('trabajador.dashboard');
        }
    }

    /**
     * Paso 1: Buscar al usuario por NOMBRE DE USUARIO y devolver sus preguntas.
     */
    public function obtenerPreguntas(Request $request)
    {
        $request->validate([
            'username' => 'required|string|exists:usuario,Nombre_usuario'
        ], [
            'username.required' => 'Por favor, introduce tu nombre de usuario.',
            'username.exists' => 'El nombre de usuario ingresado no existe en el sistema.'
        ]);

        // Buscamos por la columna 'Nombre_usuario'
        $usuario = User::where('Nombre_usuario', $request->username)->first();
        
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado.'], 404);
        }

        $preguntas = $usuario->respuestasSeguridad()->with('pregunta')->get();

        if ($preguntas->isEmpty()) {
            return response()->json(['message' => 'El usuario no tiene preguntas configuradas.'], 404);
        }

        return response()->json([
            'preguntas' => $preguntas->map(function ($item) {
                return [
                    'id' => $item->pregunta->id,
                    'pregunta' => $item->pregunta->pregunta
                ];
            })
        ]);
    }

    /**
     * Paso 2: Verificar si la respuesta es correcta buscando por usuario.
     */
    public function verificarRespuesta(Request $request)
    {
        $request->validate([
            'username' => 'required|string|exists:usuario,Nombre_usuario',
            'pregunta_id' => 'required|exists:preguntas_seguridad,id',
            'respuesta' => 'required|string'
        ], [
            'respuesta.required' => 'Debes escribir una respuesta.'
        ]);

        $usuario = User::where('Nombre_usuario', $request->username)->first();

        // Buscamos la respuesta vinculando con el Id_Usuario correcto de tu tabla
        $respuestaGuardada = RespuestaSeguridadUsuario::where('user_id', $usuario->Id_Usuario)
            ->where('pregunta_id', $request->pregunta_id)
            ->first();

        if (!$respuestaGuardada) {
            return response()->json(['message' => 'Pregunta no válida para este usuario.'], 422);
        }

        if (Hash::check(strtolower(trim($request->respuesta)), $respuestaGuardada->respuesta_hash)) {
            // Guardamos el correo en la sesión para el paso final de restablecer
            Session::put('reset_email', $usuario->Correo);
            return response()->json(['message' => 'Respuesta correcta. Puede proceder.']);
        }

        return response()->json(['message' => 'La respuesta es incorrecta.'], 401);
    }

    /**
     * Paso 3: Guardar la nueva contraseña en la base de datos (Recuperación Autónoma).
     */
    public function restablecerPassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $email = Session::get('reset_email');

        if (!$email) {
            return response()->json(['message' => 'Sesión expirada. Por favor, valide su identidad nuevamente.'], 403);
        }

        $usuario = User::where('Correo', $email)->first();

        if ($usuario) {
            // Asegurar que la tabla de historial exista
            if (!DB::getSchemaBuilder()->hasTable('password_history')) {
                \Illuminate\Support\Facades\Schema::create('password_history', function ($table) {
                    $table->increments('id');
                    $table->integer('user_id');
                    $table->string('password_hash');
                    $table->timestamp('created_at')->useCurrent();
                });
            }

            // 1. Verificar si coincide con la contraseña actual (la última usada)
            if (Hash::check($request->password, $usuario->Contraseña)) {
                return response()->json([
                    'message' => 'No puedes establecer esta contraseña porque ya la utilizaste recientemente'
                ], 422);
            }

            // 2. Verificar contra las últimas 9 contraseñas guardadas en el historial (en total suman 10)
            $history = DB::table('password_history')
                ->where('user_id', $usuario->Id_Usuario)
                ->orderBy('id', 'desc')
                ->take(9)
                ->get();

            foreach ($history as $record) {
                if (Hash::check($request->password, $record->password_hash)) {
                    return response()->json([
                        'message' => 'No puedes establecer esta contraseña porque ya la utilizaste recientemente'
                    ], 422);
                }
            }

            // Guardar la contraseña anterior en el historial antes de actualizarla
            DB::table('password_history')->insert([
                'user_id' => $usuario->Id_Usuario,
                'password_hash' => $usuario->Contraseña,
                'created_at' => now(),
            ]);

            $usuario->Contraseña = Hash::make($request->password);
            $usuario->save();

            \App\Models\SystemLog::write('Recuperación de Contraseña', "El usuario '{$usuario->Nombre_usuario}' ha restablecido su contraseña de forma autónoma.");

            Session::forget('reset_email');

            return response()->json(['message' => '¡Éxito! Tu contraseña ha sido actualizada.']);
        }

        return response()->json(['message' => 'Error al procesar la solicitud.'], 500);
    }

    /* =========================================================================
       SECCIÓN ADMINISTRATIVA: Métodos exclusivos para el SuperUsuario
       ========================================================================= */

    /**
     * ADMINISTRACIÓN: Forzar cambio de contraseña de un trabajador desde el panel.
     */
    public function adminResetearPassword(Request $request, $id)
    {
        // Seguridad preventiva: Verificamos si es SuperUsuario (rol 1)
        if (Auth::user()->Id_rol != 1) {
            return response()->json(['message' => 'Acción no autorizada.'], 403);
        }

        $request->validate([
            'password' => 'required|string|min:8'
        ], [
            'password.required' => 'La nueva contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.'
        ]);

        $usuario = User::where('Id_Usuario', $id)->first();

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado.'], 404);
        }

        $usuario->Contraseña = Hash::make($request->password);
        $usuario->save();

        \App\Models\SystemLog::write('Restablecer Clave (Admin)', "El administrador '" . Auth::user()->Nombre_usuario . "' restableció la contraseña del usuario '{$usuario->Nombre_usuario}' (ID: {$usuario->Id_Usuario}).");

        return response()->json(['message' => 'Contraseña restablecida con éxito por el Administrador.']);
    }

    /**
     * ADMINISTRACIÓN: Limpiar/Eliminar preguntas para obligar al usuario a reconfigurar.
     */
    public function adminEliminarPregunta($id)
    {
        if (Auth::user()->Id_rol != 1) {
            return response()->json(['message' => 'Acción no autorizada.'], 403);
        }

        $usuarioAfectado = User::find($id);
        $nombreAfectado = $usuarioAfectado ? $usuarioAfectado->Nombre_usuario : "ID $id";

        // Eliminamos el registro de preguntas para limpiar sus parámetros de seguridad
        DB::table('respuestas_seguridad_usuario')->where('user_id', $id)->delete();

        \App\Models\SystemLog::write('Limpiar Preguntas (Admin)', "El administrador '" . Auth::user()->Nombre_usuario . "' eliminó las preguntas de seguridad del usuario '{$nombreAfectado}' (ID: {$id}).");

        return response()->json(['message' => 'Parámetros de seguridad blanqueados correctamente.']);
    }
}