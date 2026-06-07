import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MenuConfigController::store
* @see app/Http/Controllers/MenuConfigController.php:36
* @route '/superusuario/admin/menu-config'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/superusuario/admin/menu-config',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MenuConfigController::store
* @see app/Http/Controllers/MenuConfigController.php:36
* @route '/superusuario/admin/menu-config'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MenuConfigController::store
* @see app/Http/Controllers/MenuConfigController.php:36
* @route '/superusuario/admin/menu-config'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MenuConfigController::store
* @see app/Http/Controllers/MenuConfigController.php:36
* @route '/superusuario/admin/menu-config'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MenuConfigController::store
* @see app/Http/Controllers/MenuConfigController.php:36
* @route '/superusuario/admin/menu-config'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\MenuConfigController::show
* @see app/Http/Controllers/MenuConfigController.php:25
* @route '/menu-config'
*/
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/menu-config',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MenuConfigController::show
* @see app/Http/Controllers/MenuConfigController.php:25
* @route '/menu-config'
*/
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MenuConfigController::show
* @see app/Http/Controllers/MenuConfigController.php:25
* @route '/menu-config'
*/
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MenuConfigController::show
* @see app/Http/Controllers/MenuConfigController.php:25
* @route '/menu-config'
*/
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MenuConfigController::show
* @see app/Http/Controllers/MenuConfigController.php:25
* @route '/menu-config'
*/
const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MenuConfigController::show
* @see app/Http/Controllers/MenuConfigController.php:25
* @route '/menu-config'
*/
showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MenuConfigController::show
* @see app/Http/Controllers/MenuConfigController.php:25
* @route '/menu-config'
*/
showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const MenuConfigController = { store, show }

export default MenuConfigController