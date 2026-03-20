import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\WorkerController::getProfile
 * @see app/Http/Controllers/WorkerController.php:13
 * @route '/trabajador/profile-data'
 */
export const getProfile = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getProfile.url(options),
    method: 'get',
})

getProfile.definition = {
    methods: ["get","head"],
    url: '/trabajador/profile-data',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkerController::getProfile
 * @see app/Http/Controllers/WorkerController.php:13
 * @route '/trabajador/profile-data'
 */
getProfile.url = (options?: RouteQueryOptions) => {
    return getProfile.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkerController::getProfile
 * @see app/Http/Controllers/WorkerController.php:13
 * @route '/trabajador/profile-data'
 */
getProfile.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getProfile.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkerController::getProfile
 * @see app/Http/Controllers/WorkerController.php:13
 * @route '/trabajador/profile-data'
 */
getProfile.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getProfile.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkerController::getVacations
 * @see app/Http/Controllers/WorkerController.php:28
 * @route '/trabajador/vacations-data'
 */
export const getVacations = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getVacations.url(options),
    method: 'get',
})

getVacations.definition = {
    methods: ["get","head"],
    url: '/trabajador/vacations-data',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkerController::getVacations
 * @see app/Http/Controllers/WorkerController.php:28
 * @route '/trabajador/vacations-data'
 */
getVacations.url = (options?: RouteQueryOptions) => {
    return getVacations.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkerController::getVacations
 * @see app/Http/Controllers/WorkerController.php:28
 * @route '/trabajador/vacations-data'
 */
getVacations.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getVacations.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkerController::getVacations
 * @see app/Http/Controllers/WorkerController.php:28
 * @route '/trabajador/vacations-data'
 */
getVacations.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getVacations.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkerController::storeVacationRequest
 * @see app/Http/Controllers/WorkerController.php:46
 * @route '/trabajador/vacations-request'
 */
export const storeVacationRequest = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeVacationRequest.url(options),
    method: 'post',
})

storeVacationRequest.definition = {
    methods: ["post"],
    url: '/trabajador/vacations-request',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkerController::storeVacationRequest
 * @see app/Http/Controllers/WorkerController.php:46
 * @route '/trabajador/vacations-request'
 */
storeVacationRequest.url = (options?: RouteQueryOptions) => {
    return storeVacationRequest.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkerController::storeVacationRequest
 * @see app/Http/Controllers/WorkerController.php:46
 * @route '/trabajador/vacations-request'
 */
storeVacationRequest.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeVacationRequest.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkerController::getPayslips
 * @see app/Http/Controllers/WorkerController.php:67
 * @route '/trabajador/payslips-data'
 */
export const getPayslips = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPayslips.url(options),
    method: 'get',
})

getPayslips.definition = {
    methods: ["get","head"],
    url: '/trabajador/payslips-data',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkerController::getPayslips
 * @see app/Http/Controllers/WorkerController.php:67
 * @route '/trabajador/payslips-data'
 */
getPayslips.url = (options?: RouteQueryOptions) => {
    return getPayslips.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkerController::getPayslips
 * @see app/Http/Controllers/WorkerController.php:67
 * @route '/trabajador/payslips-data'
 */
getPayslips.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPayslips.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkerController::getPayslips
 * @see app/Http/Controllers/WorkerController.php:67
 * @route '/trabajador/payslips-data'
 */
getPayslips.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getPayslips.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkerController::showPayslip
 * @see app/Http/Controllers/WorkerController.php:97
 * @route '/trabajador/payslip/{id}'
 */
export const showPayslip = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showPayslip.url(args, options),
    method: 'get',
})

showPayslip.definition = {
    methods: ["get","head"],
    url: '/trabajador/payslip/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkerController::showPayslip
 * @see app/Http/Controllers/WorkerController.php:97
 * @route '/trabajador/payslip/{id}'
 */
showPayslip.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return showPayslip.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkerController::showPayslip
 * @see app/Http/Controllers/WorkerController.php:97
 * @route '/trabajador/payslip/{id}'
 */
showPayslip.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showPayslip.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkerController::showPayslip
 * @see app/Http/Controllers/WorkerController.php:97
 * @route '/trabajador/payslip/{id}'
 */
showPayslip.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showPayslip.url(args, options),
    method: 'head',
})
const WorkerController = { getProfile, getVacations, storeVacationRequest, getPayslips, showPayslip }

export default WorkerController