import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
 * @see routes/modules.php:19
 * @route '/administrativo'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/administrativo',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/modules.php:19
 * @route '/administrativo'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
 * @see routes/modules.php:19
 * @route '/administrativo'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
 * @see routes/modules.php:19
 * @route '/administrativo'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})
const administrativo = {
    dashboard: Object.assign(dashboard, dashboard),
}

export default administrativo