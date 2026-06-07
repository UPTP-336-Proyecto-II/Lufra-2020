import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\SeguridadController::mostrarConfigurarPreguntas
* @see app/Http/Controllers/Auth/SeguridadController.php:20
* @route '/seguridad/configurar-preguntas'
*/
export const mostrarConfigurarPreguntas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mostrarConfigurarPreguntas.url(options),
    method: 'get',
})

mostrarConfigurarPreguntas.definition = {
    methods: ["get","head"],
    url: '/seguridad/configurar-preguntas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\SeguridadController::mostrarConfigurarPreguntas
* @see app/Http/Controllers/Auth/SeguridadController.php:20
* @route '/seguridad/configurar-preguntas'
*/
mostrarConfigurarPreguntas.url = (options?: RouteQueryOptions) => {
    return mostrarConfigurarPreguntas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\SeguridadController::mostrarConfigurarPreguntas
* @see app/Http/Controllers/Auth/SeguridadController.php:20
* @route '/seguridad/configurar-preguntas'
*/
mostrarConfigurarPreguntas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mostrarConfigurarPreguntas.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::mostrarConfigurarPreguntas
* @see app/Http/Controllers/Auth/SeguridadController.php:20
* @route '/seguridad/configurar-preguntas'
*/
mostrarConfigurarPreguntas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: mostrarConfigurarPreguntas.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::mostrarConfigurarPreguntas
* @see app/Http/Controllers/Auth/SeguridadController.php:20
* @route '/seguridad/configurar-preguntas'
*/
const mostrarConfigurarPreguntasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: mostrarConfigurarPreguntas.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::mostrarConfigurarPreguntas
* @see app/Http/Controllers/Auth/SeguridadController.php:20
* @route '/seguridad/configurar-preguntas'
*/
mostrarConfigurarPreguntasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: mostrarConfigurarPreguntas.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::mostrarConfigurarPreguntas
* @see app/Http/Controllers/Auth/SeguridadController.php:20
* @route '/seguridad/configurar-preguntas'
*/
mostrarConfigurarPreguntasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: mostrarConfigurarPreguntas.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

mostrarConfigurarPreguntas.form = mostrarConfigurarPreguntasForm

/**
* @see \App\Http\Controllers\Auth\SeguridadController::guardarPreguntas
* @see app/Http/Controllers/Auth/SeguridadController.php:36
* @route '/seguridad/guardar-preguntas'
*/
export const guardarPreguntas = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: guardarPreguntas.url(options),
    method: 'post',
})

guardarPreguntas.definition = {
    methods: ["post"],
    url: '/seguridad/guardar-preguntas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\SeguridadController::guardarPreguntas
* @see app/Http/Controllers/Auth/SeguridadController.php:36
* @route '/seguridad/guardar-preguntas'
*/
guardarPreguntas.url = (options?: RouteQueryOptions) => {
    return guardarPreguntas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\SeguridadController::guardarPreguntas
* @see app/Http/Controllers/Auth/SeguridadController.php:36
* @route '/seguridad/guardar-preguntas'
*/
guardarPreguntas.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: guardarPreguntas.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::guardarPreguntas
* @see app/Http/Controllers/Auth/SeguridadController.php:36
* @route '/seguridad/guardar-preguntas'
*/
const guardarPreguntasForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: guardarPreguntas.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::guardarPreguntas
* @see app/Http/Controllers/Auth/SeguridadController.php:36
* @route '/seguridad/guardar-preguntas'
*/
guardarPreguntasForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: guardarPreguntas.url(options),
    method: 'post',
})

guardarPreguntas.form = guardarPreguntasForm

/**
* @see \App\Http\Controllers\Auth\SeguridadController::adminResetearPassword
* @see app/Http/Controllers/Auth/SeguridadController.php:320
* @route '/admin/seguridad/reset-password/{id}'
*/
export const adminResetearPassword = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: adminResetearPassword.url(args, options),
    method: 'post',
})

adminResetearPassword.definition = {
    methods: ["post"],
    url: '/admin/seguridad/reset-password/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\SeguridadController::adminResetearPassword
* @see app/Http/Controllers/Auth/SeguridadController.php:320
* @route '/admin/seguridad/reset-password/{id}'
*/
adminResetearPassword.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return adminResetearPassword.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\SeguridadController::adminResetearPassword
* @see app/Http/Controllers/Auth/SeguridadController.php:320
* @route '/admin/seguridad/reset-password/{id}'
*/
adminResetearPassword.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: adminResetearPassword.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::adminResetearPassword
* @see app/Http/Controllers/Auth/SeguridadController.php:320
* @route '/admin/seguridad/reset-password/{id}'
*/
const adminResetearPasswordForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: adminResetearPassword.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::adminResetearPassword
* @see app/Http/Controllers/Auth/SeguridadController.php:320
* @route '/admin/seguridad/reset-password/{id}'
*/
adminResetearPasswordForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: adminResetearPassword.url(args, options),
    method: 'post',
})

adminResetearPassword.form = adminResetearPasswordForm

/**
* @see \App\Http\Controllers\Auth\SeguridadController::adminEliminarPregunta
* @see app/Http/Controllers/Auth/SeguridadController.php:351
* @route '/admin/seguridad/clear-questions/{id}'
*/
export const adminEliminarPregunta = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: adminEliminarPregunta.url(args, options),
    method: 'delete',
})

adminEliminarPregunta.definition = {
    methods: ["delete"],
    url: '/admin/seguridad/clear-questions/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Auth\SeguridadController::adminEliminarPregunta
* @see app/Http/Controllers/Auth/SeguridadController.php:351
* @route '/admin/seguridad/clear-questions/{id}'
*/
adminEliminarPregunta.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return adminEliminarPregunta.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\SeguridadController::adminEliminarPregunta
* @see app/Http/Controllers/Auth/SeguridadController.php:351
* @route '/admin/seguridad/clear-questions/{id}'
*/
adminEliminarPregunta.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: adminEliminarPregunta.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::adminEliminarPregunta
* @see app/Http/Controllers/Auth/SeguridadController.php:351
* @route '/admin/seguridad/clear-questions/{id}'
*/
const adminEliminarPreguntaForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: adminEliminarPregunta.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::adminEliminarPregunta
* @see app/Http/Controllers/Auth/SeguridadController.php:351
* @route '/admin/seguridad/clear-questions/{id}'
*/
adminEliminarPreguntaForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: adminEliminarPregunta.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

adminEliminarPregunta.form = adminEliminarPreguntaForm

/**
* @see \App\Http\Controllers\Auth\SeguridadController::obtenerPreguntas
* @see app/Http/Controllers/Auth/SeguridadController.php:178
* @route '/seguridad/preguntas-desafio'
*/
export const obtenerPreguntas = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: obtenerPreguntas.url(options),
    method: 'post',
})

obtenerPreguntas.definition = {
    methods: ["post"],
    url: '/seguridad/preguntas-desafio',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\SeguridadController::obtenerPreguntas
* @see app/Http/Controllers/Auth/SeguridadController.php:178
* @route '/seguridad/preguntas-desafio'
*/
obtenerPreguntas.url = (options?: RouteQueryOptions) => {
    return obtenerPreguntas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\SeguridadController::obtenerPreguntas
* @see app/Http/Controllers/Auth/SeguridadController.php:178
* @route '/seguridad/preguntas-desafio'
*/
obtenerPreguntas.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: obtenerPreguntas.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::obtenerPreguntas
* @see app/Http/Controllers/Auth/SeguridadController.php:178
* @route '/seguridad/preguntas-desafio'
*/
const obtenerPreguntasForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: obtenerPreguntas.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::obtenerPreguntas
* @see app/Http/Controllers/Auth/SeguridadController.php:178
* @route '/seguridad/preguntas-desafio'
*/
obtenerPreguntasForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: obtenerPreguntas.url(options),
    method: 'post',
})

obtenerPreguntas.form = obtenerPreguntasForm

/**
* @see \App\Http\Controllers\Auth\SeguridadController::verificarRespuesta
* @see app/Http/Controllers/Auth/SeguridadController.php:213
* @route '/seguridad/verificar-respuesta'
*/
export const verificarRespuesta = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verificarRespuesta.url(options),
    method: 'post',
})

verificarRespuesta.definition = {
    methods: ["post"],
    url: '/seguridad/verificar-respuesta',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\SeguridadController::verificarRespuesta
* @see app/Http/Controllers/Auth/SeguridadController.php:213
* @route '/seguridad/verificar-respuesta'
*/
verificarRespuesta.url = (options?: RouteQueryOptions) => {
    return verificarRespuesta.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\SeguridadController::verificarRespuesta
* @see app/Http/Controllers/Auth/SeguridadController.php:213
* @route '/seguridad/verificar-respuesta'
*/
verificarRespuesta.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verificarRespuesta.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::verificarRespuesta
* @see app/Http/Controllers/Auth/SeguridadController.php:213
* @route '/seguridad/verificar-respuesta'
*/
const verificarRespuestaForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: verificarRespuesta.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::verificarRespuesta
* @see app/Http/Controllers/Auth/SeguridadController.php:213
* @route '/seguridad/verificar-respuesta'
*/
verificarRespuestaForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: verificarRespuesta.url(options),
    method: 'post',
})

verificarRespuesta.form = verificarRespuestaForm

/**
* @see \App\Http\Controllers\Auth\SeguridadController::restablecerPassword
* @see app/Http/Controllers/Auth/SeguridadController.php:246
* @route '/seguridad/actualizar-clave'
*/
export const restablecerPassword = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restablecerPassword.url(options),
    method: 'post',
})

restablecerPassword.definition = {
    methods: ["post"],
    url: '/seguridad/actualizar-clave',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\SeguridadController::restablecerPassword
* @see app/Http/Controllers/Auth/SeguridadController.php:246
* @route '/seguridad/actualizar-clave'
*/
restablecerPassword.url = (options?: RouteQueryOptions) => {
    return restablecerPassword.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\SeguridadController::restablecerPassword
* @see app/Http/Controllers/Auth/SeguridadController.php:246
* @route '/seguridad/actualizar-clave'
*/
restablecerPassword.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restablecerPassword.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::restablecerPassword
* @see app/Http/Controllers/Auth/SeguridadController.php:246
* @route '/seguridad/actualizar-clave'
*/
const restablecerPasswordForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: restablecerPassword.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::restablecerPassword
* @see app/Http/Controllers/Auth/SeguridadController.php:246
* @route '/seguridad/actualizar-clave'
*/
restablecerPasswordForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: restablecerPassword.url(options),
    method: 'post',
})

restablecerPassword.form = restablecerPasswordForm

const SeguridadController = { mostrarConfigurarPreguntas, guardarPreguntas, adminResetearPassword, adminEliminarPregunta, obtenerPreguntas, verificarRespuesta, restablecerPassword }

export default SeguridadController