import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\UserListController::store
 * @see app/Http/Controllers/UserListController.php:45
 * @route '/superusuario/users/store'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/superusuario/users/store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserListController::store
 * @see app/Http/Controllers/UserListController.php:45
 * @route '/superusuario/users/store'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserListController::store
 * @see app/Http/Controllers/UserListController.php:45
 * @route '/superusuario/users/store'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserListController::update
 * @see app/Http/Controllers/UserListController.php:69
 * @route '/superusuario/users/{id}/update'
 */
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/superusuario/users/{id}/update',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserListController::update
 * @see app/Http/Controllers/UserListController.php:69
 * @route '/superusuario/users/{id}/update'
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
* @see \App\Http\Controllers\UserListController::update
 * @see app/Http/Controllers/UserListController.php:69
 * @route '/superusuario/users/{id}/update'
 */
update.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserListController::activate
 * @see app/Http/Controllers/UserListController.php:95
 * @route '/superusuario/users/{id}/activate'
 */
export const activate = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activate.url(args, options),
    method: 'post',
})

activate.definition = {
    methods: ["post"],
    url: '/superusuario/users/{id}/activate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserListController::activate
 * @see app/Http/Controllers/UserListController.php:95
 * @route '/superusuario/users/{id}/activate'
 */
activate.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return activate.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserListController::activate
 * @see app/Http/Controllers/UserListController.php:95
 * @route '/superusuario/users/{id}/activate'
 */
activate.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserListController::deactivate
 * @see app/Http/Controllers/UserListController.php:103
 * @route '/superusuario/users/{id}/deactivate'
 */
export const deactivate = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deactivate.url(args, options),
    method: 'post',
})

deactivate.definition = {
    methods: ["post"],
    url: '/superusuario/users/{id}/deactivate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserListController::deactivate
 * @see app/Http/Controllers/UserListController.php:103
 * @route '/superusuario/users/{id}/deactivate'
 */
deactivate.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return deactivate.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserListController::deactivate
 * @see app/Http/Controllers/UserListController.php:103
 * @route '/superusuario/users/{id}/deactivate'
 */
deactivate.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deactivate.url(args, options),
    method: 'post',
})
const users = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
activate: Object.assign(activate, activate),
deactivate: Object.assign(deactivate, deactivate),
}

export default users