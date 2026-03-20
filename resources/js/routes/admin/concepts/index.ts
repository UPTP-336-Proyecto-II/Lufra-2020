import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::store
 * @see app/Http/Controllers/AdminController.php:250
 * @route '/administrativo/concepts'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/administrativo/concepts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::store
 * @see app/Http/Controllers/AdminController.php:250
 * @route '/administrativo/concepts'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::store
 * @see app/Http/Controllers/AdminController.php:250
 * @route '/administrativo/concepts'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::update
 * @see app/Http/Controllers/AdminController.php:264
 * @route '/administrativo/concepts/{id}'
 */
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/administrativo/concepts/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::update
 * @see app/Http/Controllers/AdminController.php:264
 * @route '/administrativo/concepts/{id}'
 */
update.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::update
 * @see app/Http/Controllers/AdminController.php:264
 * @route '/administrativo/concepts/{id}'
 */
update.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::toggle
 * @see app/Http/Controllers/AdminController.php:279
 * @route '/administrativo/concepts/{id}/toggle'
 */
export const toggle = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

toggle.definition = {
    methods: ["post"],
    url: '/administrativo/concepts/{id}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::toggle
 * @see app/Http/Controllers/AdminController.php:279
 * @route '/administrativo/concepts/{id}/toggle'
 */
toggle.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggle.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::toggle
 * @see app/Http/Controllers/AdminController.php:279
 * @route '/administrativo/concepts/{id}/toggle'
 */
toggle.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})
const concepts = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
toggle: Object.assign(toggle, toggle),
}

export default concepts