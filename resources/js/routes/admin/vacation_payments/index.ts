import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::store
 * @see app/Http/Controllers/AdminController.php:427
 * @route '/administrativo/vacation-payments'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/administrativo/vacation-payments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::store
 * @see app/Http/Controllers/AdminController.php:427
 * @route '/administrativo/vacation-payments'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::store
 * @see app/Http/Controllers/AdminController.php:427
 * @route '/administrativo/vacation-payments'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::store
 * @see app/Http/Controllers/AdminController.php:427
 * @route '/administrativo/vacation-payments'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::store
 * @see app/Http/Controllers/AdminController.php:427
 * @route '/administrativo/vacation-payments'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\AdminController::paid_years
 * @see app/Http/Controllers/AdminController.php:414
 * @route '/administrativo/vacation-payments/paid-years/{workerId}'
 */
export const paid_years = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paid_years.url(args, options),
    method: 'get',
})

paid_years.definition = {
    methods: ["get","head"],
    url: '/administrativo/vacation-payments/paid-years/{workerId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::paid_years
 * @see app/Http/Controllers/AdminController.php:414
 * @route '/administrativo/vacation-payments/paid-years/{workerId}'
 */
paid_years.url = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workerId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    workerId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        workerId: args.workerId,
                }

    return paid_years.definition.url
            .replace('{workerId}', parsedArgs.workerId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::paid_years
 * @see app/Http/Controllers/AdminController.php:414
 * @route '/administrativo/vacation-payments/paid-years/{workerId}'
 */
paid_years.get = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paid_years.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::paid_years
 * @see app/Http/Controllers/AdminController.php:414
 * @route '/administrativo/vacation-payments/paid-years/{workerId}'
 */
paid_years.head = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: paid_years.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::paid_years
 * @see app/Http/Controllers/AdminController.php:414
 * @route '/administrativo/vacation-payments/paid-years/{workerId}'
 */
    const paid_yearsForm = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: paid_years.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::paid_years
 * @see app/Http/Controllers/AdminController.php:414
 * @route '/administrativo/vacation-payments/paid-years/{workerId}'
 */
        paid_yearsForm.get = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: paid_years.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::paid_years
 * @see app/Http/Controllers/AdminController.php:414
 * @route '/administrativo/vacation-payments/paid-years/{workerId}'
 */
        paid_yearsForm.head = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: paid_years.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    paid_years.form = paid_yearsForm
const vacation_payments = {
    store: Object.assign(store, store),
paid_years: Object.assign(paid_years, paid_years),
}

export default vacation_payments