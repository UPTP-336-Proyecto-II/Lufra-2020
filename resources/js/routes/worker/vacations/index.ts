import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\WorkerController::store
 * @see app/Http/Controllers/WorkerController.php:46
 * @route '/trabajador/vacations-request'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/trabajador/vacations-request',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkerController::store
 * @see app/Http/Controllers/WorkerController.php:46
 * @route '/trabajador/vacations-request'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkerController::store
 * @see app/Http/Controllers/WorkerController.php:46
 * @route '/trabajador/vacations-request'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})
const vacations = {
    store: Object.assign(store, store),
}

export default vacations