import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RedirectAfterLoginController::__invoke
 * @see app/Http/Controllers/RedirectAfterLoginController.php:11
 * @route '/redirect-after-login'
 */
const RedirectAfterLoginController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RedirectAfterLoginController.url(options),
    method: 'get',
})

RedirectAfterLoginController.definition = {
    methods: ["get","head"],
    url: '/redirect-after-login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RedirectAfterLoginController::__invoke
 * @see app/Http/Controllers/RedirectAfterLoginController.php:11
 * @route '/redirect-after-login'
 */
RedirectAfterLoginController.url = (options?: RouteQueryOptions) => {
    return RedirectAfterLoginController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RedirectAfterLoginController::__invoke
 * @see app/Http/Controllers/RedirectAfterLoginController.php:11
 * @route '/redirect-after-login'
 */
RedirectAfterLoginController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RedirectAfterLoginController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RedirectAfterLoginController::__invoke
 * @see app/Http/Controllers/RedirectAfterLoginController.php:11
 * @route '/redirect-after-login'
 */
RedirectAfterLoginController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: RedirectAfterLoginController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RedirectAfterLoginController::__invoke
 * @see app/Http/Controllers/RedirectAfterLoginController.php:11
 * @route '/redirect-after-login'
 */
    const RedirectAfterLoginControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: RedirectAfterLoginController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RedirectAfterLoginController::__invoke
 * @see app/Http/Controllers/RedirectAfterLoginController.php:11
 * @route '/redirect-after-login'
 */
        RedirectAfterLoginControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectAfterLoginController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RedirectAfterLoginController::__invoke
 * @see app/Http/Controllers/RedirectAfterLoginController.php:11
 * @route '/redirect-after-login'
 */
        RedirectAfterLoginControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectAfterLoginController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    RedirectAfterLoginController.form = RedirectAfterLoginControllerForm
export default RedirectAfterLoginController