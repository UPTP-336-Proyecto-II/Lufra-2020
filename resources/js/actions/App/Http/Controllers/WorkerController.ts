import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\WorkerController::getProfile
 * @see app/Http/Controllers/WorkerController.php:13
 * @route '/trabajador/profile-data'
 */
    const getProfileForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getProfile.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WorkerController::getProfile
 * @see app/Http/Controllers/WorkerController.php:13
 * @route '/trabajador/profile-data'
 */
        getProfileForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getProfile.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WorkerController::getProfile
 * @see app/Http/Controllers/WorkerController.php:13
 * @route '/trabajador/profile-data'
 */
        getProfileForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getProfile.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getProfile.form = getProfileForm
/**
* @see \App\Http\Controllers\WorkerController::getVacations
 * @see app/Http/Controllers/WorkerController.php:33
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
 * @see app/Http/Controllers/WorkerController.php:33
 * @route '/trabajador/vacations-data'
 */
getVacations.url = (options?: RouteQueryOptions) => {
    return getVacations.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkerController::getVacations
 * @see app/Http/Controllers/WorkerController.php:33
 * @route '/trabajador/vacations-data'
 */
getVacations.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getVacations.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkerController::getVacations
 * @see app/Http/Controllers/WorkerController.php:33
 * @route '/trabajador/vacations-data'
 */
getVacations.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getVacations.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WorkerController::getVacations
 * @see app/Http/Controllers/WorkerController.php:33
 * @route '/trabajador/vacations-data'
 */
    const getVacationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getVacations.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WorkerController::getVacations
 * @see app/Http/Controllers/WorkerController.php:33
 * @route '/trabajador/vacations-data'
 */
        getVacationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getVacations.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WorkerController::getVacations
 * @see app/Http/Controllers/WorkerController.php:33
 * @route '/trabajador/vacations-data'
 */
        getVacationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getVacations.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getVacations.form = getVacationsForm
/**
* @see \App\Http\Controllers\WorkerController::storeVacationRequest
 * @see app/Http/Controllers/WorkerController.php:56
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
 * @see app/Http/Controllers/WorkerController.php:56
 * @route '/trabajador/vacations-request'
 */
storeVacationRequest.url = (options?: RouteQueryOptions) => {
    return storeVacationRequest.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkerController::storeVacationRequest
 * @see app/Http/Controllers/WorkerController.php:56
 * @route '/trabajador/vacations-request'
 */
storeVacationRequest.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeVacationRequest.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WorkerController::storeVacationRequest
 * @see app/Http/Controllers/WorkerController.php:56
 * @route '/trabajador/vacations-request'
 */
    const storeVacationRequestForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeVacationRequest.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WorkerController::storeVacationRequest
 * @see app/Http/Controllers/WorkerController.php:56
 * @route '/trabajador/vacations-request'
 */
        storeVacationRequestForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeVacationRequest.url(options),
            method: 'post',
        })
    
    storeVacationRequest.form = storeVacationRequestForm
/**
* @see \App\Http\Controllers\WorkerController::getPayslips
 * @see app/Http/Controllers/WorkerController.php:77
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
 * @see app/Http/Controllers/WorkerController.php:77
 * @route '/trabajador/payslips-data'
 */
getPayslips.url = (options?: RouteQueryOptions) => {
    return getPayslips.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkerController::getPayslips
 * @see app/Http/Controllers/WorkerController.php:77
 * @route '/trabajador/payslips-data'
 */
getPayslips.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPayslips.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkerController::getPayslips
 * @see app/Http/Controllers/WorkerController.php:77
 * @route '/trabajador/payslips-data'
 */
getPayslips.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getPayslips.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WorkerController::getPayslips
 * @see app/Http/Controllers/WorkerController.php:77
 * @route '/trabajador/payslips-data'
 */
    const getPayslipsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getPayslips.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WorkerController::getPayslips
 * @see app/Http/Controllers/WorkerController.php:77
 * @route '/trabajador/payslips-data'
 */
        getPayslipsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPayslips.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WorkerController::getPayslips
 * @see app/Http/Controllers/WorkerController.php:77
 * @route '/trabajador/payslips-data'
 */
        getPayslipsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPayslips.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getPayslips.form = getPayslipsForm
/**
* @see \App\Http\Controllers\WorkerController::showPayslip
 * @see app/Http/Controllers/WorkerController.php:107
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
 * @see app/Http/Controllers/WorkerController.php:107
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
 * @see app/Http/Controllers/WorkerController.php:107
 * @route '/trabajador/payslip/{id}'
 */
showPayslip.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showPayslip.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkerController::showPayslip
 * @see app/Http/Controllers/WorkerController.php:107
 * @route '/trabajador/payslip/{id}'
 */
showPayslip.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showPayslip.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WorkerController::showPayslip
 * @see app/Http/Controllers/WorkerController.php:107
 * @route '/trabajador/payslip/{id}'
 */
    const showPayslipForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showPayslip.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WorkerController::showPayslip
 * @see app/Http/Controllers/WorkerController.php:107
 * @route '/trabajador/payslip/{id}'
 */
        showPayslipForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showPayslip.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WorkerController::showPayslip
 * @see app/Http/Controllers/WorkerController.php:107
 * @route '/trabajador/payslip/{id}'
 */
        showPayslipForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showPayslip.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showPayslip.form = showPayslipForm
const WorkerController = { getProfile, getVacations, storeVacationRequest, getPayslips, showPayslip }

export default WorkerController