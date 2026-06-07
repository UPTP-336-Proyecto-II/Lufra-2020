import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::datos
* @see app/Http/Controllers/AdminController.php:51
* @route '/superusuario/workers/{id}/datos'
*/
export const datos = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: datos.url(args, options),
    method: 'get',
})

datos.definition = {
    methods: ["get","head"],
    url: '/superusuario/workers/{id}/datos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::datos
* @see app/Http/Controllers/AdminController.php:51
* @route '/superusuario/workers/{id}/datos'
*/
datos.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return datos.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::datos
* @see app/Http/Controllers/AdminController.php:51
* @route '/superusuario/workers/{id}/datos'
*/
datos.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: datos.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::datos
* @see app/Http/Controllers/AdminController.php:51
* @route '/superusuario/workers/{id}/datos'
*/
datos.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: datos.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::datos
* @see app/Http/Controllers/AdminController.php:51
* @route '/superusuario/workers/{id}/datos'
*/
const datosForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: datos.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::datos
* @see app/Http/Controllers/AdminController.php:51
* @route '/superusuario/workers/{id}/datos'
*/
datosForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: datos.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::datos
* @see app/Http/Controllers/AdminController.php:51
* @route '/superusuario/workers/{id}/datos'
*/
datosForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: datos.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

datos.form = datosForm

const worker = {
    datos: Object.assign(datos, datos),
}

export default worker