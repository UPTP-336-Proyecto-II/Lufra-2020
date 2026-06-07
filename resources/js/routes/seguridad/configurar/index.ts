import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\SeguridadController::vista
* @see app/Http/Controllers/Auth/SeguridadController.php:20
* @route '/seguridad/configurar-preguntas'
*/
export const vista = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vista.url(options),
    method: 'get',
})

vista.definition = {
    methods: ["get","head"],
    url: '/seguridad/configurar-preguntas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\SeguridadController::vista
* @see app/Http/Controllers/Auth/SeguridadController.php:20
* @route '/seguridad/configurar-preguntas'
*/
vista.url = (options?: RouteQueryOptions) => {
    return vista.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\SeguridadController::vista
* @see app/Http/Controllers/Auth/SeguridadController.php:20
* @route '/seguridad/configurar-preguntas'
*/
vista.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vista.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::vista
* @see app/Http/Controllers/Auth/SeguridadController.php:20
* @route '/seguridad/configurar-preguntas'
*/
vista.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: vista.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::vista
* @see app/Http/Controllers/Auth/SeguridadController.php:20
* @route '/seguridad/configurar-preguntas'
*/
const vistaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: vista.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::vista
* @see app/Http/Controllers/Auth/SeguridadController.php:20
* @route '/seguridad/configurar-preguntas'
*/
vistaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: vista.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Auth\SeguridadController::vista
* @see app/Http/Controllers/Auth/SeguridadController.php:20
* @route '/seguridad/configurar-preguntas'
*/
vistaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: vista.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

vista.form = vistaForm

const configurar = {
    vista: Object.assign(vista, vista),
}

export default configurar