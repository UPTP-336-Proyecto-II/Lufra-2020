import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import vacations72464b from './vacations'
import payslip from './payslip'
/**
* @see \App\Http\Controllers\WorkerController::profile
 * @see app/Http/Controllers/WorkerController.php:13
 * @route '/trabajador/profile-data'
 */
export const profile = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(options),
    method: 'get',
})

profile.definition = {
    methods: ["get","head"],
    url: '/trabajador/profile-data',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkerController::profile
 * @see app/Http/Controllers/WorkerController.php:13
 * @route '/trabajador/profile-data'
 */
profile.url = (options?: RouteQueryOptions) => {
    return profile.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkerController::profile
 * @see app/Http/Controllers/WorkerController.php:13
 * @route '/trabajador/profile-data'
 */
profile.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkerController::profile
 * @see app/Http/Controllers/WorkerController.php:13
 * @route '/trabajador/profile-data'
 */
profile.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: profile.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WorkerController::profile
 * @see app/Http/Controllers/WorkerController.php:13
 * @route '/trabajador/profile-data'
 */
    const profileForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: profile.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WorkerController::profile
 * @see app/Http/Controllers/WorkerController.php:13
 * @route '/trabajador/profile-data'
 */
        profileForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: profile.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WorkerController::profile
 * @see app/Http/Controllers/WorkerController.php:13
 * @route '/trabajador/profile-data'
 */
        profileForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: profile.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    profile.form = profileForm
/**
* @see \App\Http\Controllers\WorkerController::vacations
 * @see app/Http/Controllers/WorkerController.php:33
 * @route '/trabajador/vacations-data'
 */
export const vacations = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vacations.url(options),
    method: 'get',
})

vacations.definition = {
    methods: ["get","head"],
    url: '/trabajador/vacations-data',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkerController::vacations
 * @see app/Http/Controllers/WorkerController.php:33
 * @route '/trabajador/vacations-data'
 */
vacations.url = (options?: RouteQueryOptions) => {
    return vacations.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkerController::vacations
 * @see app/Http/Controllers/WorkerController.php:33
 * @route '/trabajador/vacations-data'
 */
vacations.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vacations.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkerController::vacations
 * @see app/Http/Controllers/WorkerController.php:33
 * @route '/trabajador/vacations-data'
 */
vacations.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: vacations.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WorkerController::vacations
 * @see app/Http/Controllers/WorkerController.php:33
 * @route '/trabajador/vacations-data'
 */
    const vacationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: vacations.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WorkerController::vacations
 * @see app/Http/Controllers/WorkerController.php:33
 * @route '/trabajador/vacations-data'
 */
        vacationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: vacations.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WorkerController::vacations
 * @see app/Http/Controllers/WorkerController.php:33
 * @route '/trabajador/vacations-data'
 */
        vacationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: vacations.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    vacations.form = vacationsForm
/**
* @see \App\Http\Controllers\WorkerController::payslips
 * @see app/Http/Controllers/WorkerController.php:77
 * @route '/trabajador/payslips-data'
 */
export const payslips = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payslips.url(options),
    method: 'get',
})

payslips.definition = {
    methods: ["get","head"],
    url: '/trabajador/payslips-data',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkerController::payslips
 * @see app/Http/Controllers/WorkerController.php:77
 * @route '/trabajador/payslips-data'
 */
payslips.url = (options?: RouteQueryOptions) => {
    return payslips.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkerController::payslips
 * @see app/Http/Controllers/WorkerController.php:77
 * @route '/trabajador/payslips-data'
 */
payslips.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payslips.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkerController::payslips
 * @see app/Http/Controllers/WorkerController.php:77
 * @route '/trabajador/payslips-data'
 */
payslips.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payslips.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WorkerController::payslips
 * @see app/Http/Controllers/WorkerController.php:77
 * @route '/trabajador/payslips-data'
 */
    const payslipsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: payslips.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WorkerController::payslips
 * @see app/Http/Controllers/WorkerController.php:77
 * @route '/trabajador/payslips-data'
 */
        payslipsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: payslips.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WorkerController::payslips
 * @see app/Http/Controllers/WorkerController.php:77
 * @route '/trabajador/payslips-data'
 */
        payslipsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: payslips.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    payslips.form = payslipsForm
const worker = {
    profile: Object.assign(profile, profile),
vacations: Object.assign(vacations, vacations72464b),
payslips: Object.assign(payslips, payslips),
payslip: Object.assign(payslip, payslip),
}

export default worker