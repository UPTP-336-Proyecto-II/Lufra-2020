import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\WorkerController::store
* @see app/Http/Controllers/WorkerController.php:533
* @route '/trabajador/permission-requests'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/trabajador/permission-requests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkerController::store
* @see app/Http/Controllers/WorkerController.php:533
* @route '/trabajador/permission-requests'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkerController::store
* @see app/Http/Controllers/WorkerController.php:533
* @route '/trabajador/permission-requests'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkerController::store
* @see app/Http/Controllers/WorkerController.php:533
* @route '/trabajador/permission-requests'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkerController::store
* @see app/Http/Controllers/WorkerController.php:533
* @route '/trabajador/permission-requests'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const permission_requests = {
    store: Object.assign(store, store),
}

export default permission_requests