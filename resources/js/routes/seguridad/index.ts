import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import configurar from './configurar'
import reset from './reset'
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
* @see \App\Http\Controllers\Auth\SeguridadController::preguntas
* @see app/Http/Controllers/Auth/SeguridadController.php:178
* @route '/seguridad/preguntas-desafio'
*/
export const preguntas = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: preguntas.url(options),
    method: 'post',
})

preguntas.definition = {
    methods: ["post"],
    url: '/seguridad/preguntas-desafio',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\SeguridadController::preguntas
* @see app/Http/Controllers/Auth/SeguridadController.php:178
* @route '/seguridad/preguntas-desafio'
*/
preguntas.url = (options?: RouteQueryOptions) => {
    return preguntas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\SeguridadController::preguntas
* @see app/Http/Controllers/Auth/SeguridadController.php:178
* @route '/seguridad/preguntas-desafio'
*/
preguntas.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: preguntas.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::preguntas
* @see app/Http/Controllers/Auth/SeguridadController.php:178
* @route '/seguridad/preguntas-desafio'
*/
const preguntasForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: preguntas.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::preguntas
* @see app/Http/Controllers/Auth/SeguridadController.php:178
* @route '/seguridad/preguntas-desafio'
*/
preguntasForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: preguntas.url(options),
    method: 'post',
})

preguntas.form = preguntasForm

/**
* @see \App\Http\Controllers\Auth\SeguridadController::verificar
* @see app/Http/Controllers/Auth/SeguridadController.php:213
* @route '/seguridad/verificar-respuesta'
*/
export const verificar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verificar.url(options),
    method: 'post',
})

verificar.definition = {
    methods: ["post"],
    url: '/seguridad/verificar-respuesta',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\SeguridadController::verificar
* @see app/Http/Controllers/Auth/SeguridadController.php:213
* @route '/seguridad/verificar-respuesta'
*/
verificar.url = (options?: RouteQueryOptions) => {
    return verificar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\SeguridadController::verificar
* @see app/Http/Controllers/Auth/SeguridadController.php:213
* @route '/seguridad/verificar-respuesta'
*/
verificar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verificar.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::verificar
* @see app/Http/Controllers/Auth/SeguridadController.php:213
* @route '/seguridad/verificar-respuesta'
*/
const verificarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: verificar.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::verificar
* @see app/Http/Controllers/Auth/SeguridadController.php:213
* @route '/seguridad/verificar-respuesta'
*/
verificarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: verificar.url(options),
    method: 'post',
})

verificar.form = verificarForm

/**
* @see \App\Http\Controllers\Auth\SeguridadController::update
* @see app/Http/Controllers/Auth/SeguridadController.php:246
* @route '/seguridad/actualizar-clave'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/seguridad/actualizar-clave',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\SeguridadController::update
* @see app/Http/Controllers/Auth/SeguridadController.php:246
* @route '/seguridad/actualizar-clave'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\SeguridadController::update
* @see app/Http/Controllers/Auth/SeguridadController.php:246
* @route '/seguridad/actualizar-clave'
*/
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::update
* @see app/Http/Controllers/Auth/SeguridadController.php:246
* @route '/seguridad/actualizar-clave'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::update
* @see app/Http/Controllers/Auth/SeguridadController.php:246
* @route '/seguridad/actualizar-clave'
*/
updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(options),
    method: 'post',
})

update.form = updateForm

const seguridad = {
    configurar: Object.assign(configurar, configurar),
    guardarPreguntas: Object.assign(guardarPreguntas, guardarPreguntas),
    preguntas: Object.assign(preguntas, preguntas),
    verificar: Object.assign(verificar, verificar),
    reset: Object.assign(reset, reset),
    update: Object.assign(update, update),
}

export default seguridad