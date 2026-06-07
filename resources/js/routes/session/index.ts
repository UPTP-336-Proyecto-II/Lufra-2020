import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see routes/web.php:71
* @route '/session/alive'
*/
export const alive = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: alive.url(options),
    method: 'get',
})

alive.definition = {
    methods: ["get","head"],
    url: '/session/alive',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:71
* @route '/session/alive'
*/
alive.url = (options?: RouteQueryOptions) => {
    return alive.definition.url + queryParams(options)
}

/**
* @see routes/web.php:71
* @route '/session/alive'
*/
alive.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: alive.url(options),
    method: 'get',
})

/**
* @see routes/web.php:71
* @route '/session/alive'
*/
alive.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: alive.url(options),
    method: 'head',
})

/**
* @see routes/web.php:71
* @route '/session/alive'
*/
const aliveForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: alive.url(options),
    method: 'get',
})

/**
* @see routes/web.php:71
* @route '/session/alive'
*/
aliveForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: alive.url(options),
    method: 'get',
})

/**
* @see routes/web.php:71
* @route '/session/alive'
*/
aliveForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: alive.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

alive.form = aliveForm

const session = {
    alive: Object.assign(alive, alive),
}

export default session