import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
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

const menu_config = {
    store: Object.assign(store, store),
}

export default menu_config