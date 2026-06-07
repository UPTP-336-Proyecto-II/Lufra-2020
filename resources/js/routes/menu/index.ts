import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\MenuConfigController::config
* @see app/Http/Controllers/MenuConfigController.php:25
* @route '/menu-config'
*/
export const config = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: config.url(options),
    method: 'get',
})

config.definition = {
    methods: ["get","head"],
    url: '/menu-config',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MenuConfigController::config
* @see app/Http/Controllers/MenuConfigController.php:25
* @route '/menu-config'
*/
config.url = (options?: RouteQueryOptions) => {
    return config.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MenuConfigController::config
* @see app/Http/Controllers/MenuConfigController.php:25
* @route '/menu-config'
*/
config.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: config.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MenuConfigController::config
* @see app/Http/Controllers/MenuConfigController.php:25
* @route '/menu-config'
*/
config.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: config.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MenuConfigController::config
* @see app/Http/Controllers/MenuConfigController.php:25
* @route '/menu-config'
*/
const configForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: config.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MenuConfigController::config
* @see app/Http/Controllers/MenuConfigController.php:25
* @route '/menu-config'
*/
configForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: config.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MenuConfigController::config
* @see app/Http/Controllers/MenuConfigController.php:25
* @route '/menu-config'
*/
configForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: config.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

config.form = configForm

const menu = {
    config: Object.assign(config, config),
}

export default menu