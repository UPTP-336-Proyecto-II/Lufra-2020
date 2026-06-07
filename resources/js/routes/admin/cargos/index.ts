import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::areas
* @see app/Http/Controllers/AdminController.php:1165
* @route '/administrativo/cargos/areas'
*/
export const areas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: areas.url(options),
    method: 'get',
})

areas.definition = {
    methods: ["get","head"],
    url: '/administrativo/cargos/areas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::areas
* @see app/Http/Controllers/AdminController.php:1165
* @route '/administrativo/cargos/areas'
*/
areas.url = (options?: RouteQueryOptions) => {
    return areas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::areas
* @see app/Http/Controllers/AdminController.php:1165
* @route '/administrativo/cargos/areas'
*/
areas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: areas.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::areas
* @see app/Http/Controllers/AdminController.php:1165
* @route '/administrativo/cargos/areas'
*/
areas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: areas.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::areas
* @see app/Http/Controllers/AdminController.php:1165
* @route '/administrativo/cargos/areas'
*/
const areasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: areas.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::areas
* @see app/Http/Controllers/AdminController.php:1165
* @route '/administrativo/cargos/areas'
*/
areasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: areas.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::areas
* @see app/Http/Controllers/AdminController.php:1165
* @route '/administrativo/cargos/areas'
*/
areasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: areas.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

areas.form = areasForm

/**
* @see \App\Http\Controllers\AdminController::store
* @see app/Http/Controllers/AdminController.php:1178
* @route '/administrativo/cargos'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/administrativo/cargos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::store
* @see app/Http/Controllers/AdminController.php:1178
* @route '/administrativo/cargos'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::store
* @see app/Http/Controllers/AdminController.php:1178
* @route '/administrativo/cargos'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::store
* @see app/Http/Controllers/AdminController.php:1178
* @route '/administrativo/cargos'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::store
* @see app/Http/Controllers/AdminController.php:1178
* @route '/administrativo/cargos'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\AdminController::update
* @see app/Http/Controllers/AdminController.php:1189
* @route '/administrativo/cargos/{id}'
*/
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/administrativo/cargos/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::update
* @see app/Http/Controllers/AdminController.php:1189
* @route '/administrativo/cargos/{id}'
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
* @see app/Http/Controllers/AdminController.php:1189
* @route '/administrativo/cargos/{id}'
*/
update.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::update
* @see app/Http/Controllers/AdminController.php:1189
* @route '/administrativo/cargos/{id}'
*/
const updateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::update
* @see app/Http/Controllers/AdminController.php:1189
* @route '/administrativo/cargos/{id}'
*/
updateForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, options),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\AdminController::toggle
* @see app/Http/Controllers/AdminController.php:1201
* @route '/administrativo/cargos/{id}/toggle'
*/
export const toggle = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

toggle.definition = {
    methods: ["post"],
    url: '/administrativo/cargos/{id}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::toggle
* @see app/Http/Controllers/AdminController.php:1201
* @route '/administrativo/cargos/{id}/toggle'
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
* @see app/Http/Controllers/AdminController.php:1201
* @route '/administrativo/cargos/{id}/toggle'
*/
toggle.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::toggle
* @see app/Http/Controllers/AdminController.php:1201
* @route '/administrativo/cargos/{id}/toggle'
*/
const toggleForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::toggle
* @see app/Http/Controllers/AdminController.php:1201
* @route '/administrativo/cargos/{id}/toggle'
*/
toggleForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(args, options),
    method: 'post',
})

toggle.form = toggleForm

const cargos = {
    areas: Object.assign(areas, areas),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    toggle: Object.assign(toggle, toggle),
}

export default cargos