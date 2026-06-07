<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Session\TokenMismatchException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $e)
    {
        // Si la excepción es por token CSRF, evitar la página 419 y redirigir al login
        if ($e instanceof TokenMismatchException) {
            // Si la petición espera JSON, devolver un payload ligero
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Sesión expirada.'], 401);
            }

            // Redirigir al login sin mostrar la página 419
            return redirect()->guest(route('login'));
        }

        return parent::render($request, $e);
    }
}
