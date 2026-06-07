import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see routes/web.php:57
* @route '/seguridad/restablecer-clave'
*/
export const vista = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vista.url(options),
    method: 'get',
})

vista.definition = {
    methods: ["get","head"],
    url: '/seguridad/restablecer-clave',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:57
* @route '/seguridad/restablecer-clave'
*/
vista.url = (options?: RouteQueryOptions) => {
    return vista.definition.url + queryParams(options)
}

/**
* @see routes/web.php:57
* @route '/seguridad/restablecer-clave'
*/
vista.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vista.url(options),
    method: 'get',
})

/**
* @see routes/web.php:57
* @route '/seguridad/restablecer-clave'
*/
vista.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: vista.url(options),
    method: 'head',
})

/**
* @see routes/web.php:57
* @route '/seguridad/restablecer-clave'
*/
const vistaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: vista.url(options),
    method: 'get',
})

/**
* @see routes/web.php:57
* @route '/seguridad/restablecer-clave'
*/
vistaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: vista.url(options),
    method: 'get',
})

/**
* @see routes/web.php:57
* @route '/seguridad/restablecer-clave'
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

const reset = {
    vista: Object.assign(vista, vista),
}

export default reset