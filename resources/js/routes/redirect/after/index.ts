import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\RedirectAfterLoginController::__invoke
 * @see app/Http/Controllers/RedirectAfterLoginController.php:10
 * @route '/redirect-after-login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/redirect-after-login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RedirectAfterLoginController::__invoke
 * @see app/Http/Controllers/RedirectAfterLoginController.php:10
 * @route '/redirect-after-login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RedirectAfterLoginController::__invoke
 * @see app/Http/Controllers/RedirectAfterLoginController.php:10
 * @route '/redirect-after-login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RedirectAfterLoginController::__invoke
 * @see app/Http/Controllers/RedirectAfterLoginController.php:10
 * @route '/redirect-after-login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})
const after = {
    login: Object.assign(login, login),
}

export default after