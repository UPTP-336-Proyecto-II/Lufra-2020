import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::pay
 * @see app/Http/Controllers/AdminController.php:293
 * @route '/administrativo/payroll/pay'
 */
export const pay = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pay.url(options),
    method: 'post',
})

pay.definition = {
    methods: ["post"],
    url: '/administrativo/payroll/pay',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::pay
 * @see app/Http/Controllers/AdminController.php:293
 * @route '/administrativo/payroll/pay'
 */
pay.url = (options?: RouteQueryOptions) => {
    return pay.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::pay
 * @see app/Http/Controllers/AdminController.php:293
 * @route '/administrativo/payroll/pay'
 */
pay.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pay.url(options),
    method: 'post',
})
const payroll = {
    pay: Object.assign(pay, pay),
}

export default payroll