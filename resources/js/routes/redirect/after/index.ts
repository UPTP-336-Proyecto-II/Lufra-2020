import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\RedirectAfterLoginController::__invoke
 * @see app/Http/Controllers/RedirectAfterLoginController.php:11
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
 * @see app/Http/Controllers/RedirectAfterLoginController.php:11
 * @route '/redirect-after-login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RedirectAfterLoginController::__invoke
 * @see app/Http/Controllers/RedirectAfterLoginController.php:11
 * @route '/redirect-after-login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RedirectAfterLoginController::__invoke
 * @see app/Http/Controllers/RedirectAfterLoginController.php:11
 * @route '/redirect-after-login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RedirectAfterLoginController::__invoke
 * @see app/Http/Controllers/RedirectAfterLoginController.php:11
 * @route '/redirect-after-login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RedirectAfterLoginController::__invoke
 * @see app/Http/Controllers/RedirectAfterLoginController.php:11
 * @route '/redirect-after-login'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RedirectAfterLoginController::__invoke
 * @see app/Http/Controllers/RedirectAfterLoginController.php:11
 * @route '/redirect-after-login'
 */
        loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    login.form = loginForm
const after = {
    login: Object.assign(login, login),
}

export default after