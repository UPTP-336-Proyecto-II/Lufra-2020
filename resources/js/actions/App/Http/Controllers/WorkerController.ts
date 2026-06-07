import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\WorkerController::getProfile
* @see app/Http/Controllers/WorkerController.php:14
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
* @see app/Http/Controllers/WorkerController.php:14
* @route '/trabajador/profile-data'
*/
getProfile.url = (options?: RouteQueryOptions) => {
    return getProfile.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkerController::getProfile
* @see app/Http/Controllers/WorkerController.php:14
* @route '/trabajador/profile-data'
*/
getProfile.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getProfile.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkerController::getProfile
* @see app/Http/Controllers/WorkerController.php:14
* @route '/trabajador/profile-data'
*/
getProfile.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getProfile.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkerController::getProfile
* @see app/Http/Controllers/WorkerController.php:14
* @route '/trabajador/profile-data'
*/
const getProfileForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getProfile.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkerController::getProfile
* @see app/Http/Controllers/WorkerController.php:14
* @route '/trabajador/profile-data'
*/
getProfileForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getProfile.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkerController::getProfile
* @see app/Http/Controllers/WorkerController.php:14
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
* @see app/Http/Controllers/WorkerController.php:34
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
* @see app/Http/Controllers/WorkerController.php:34
* @route '/trabajador/vacations-data'
*/
getVacations.url = (options?: RouteQueryOptions) => {
    return getVacations.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkerController::getVacations
* @see app/Http/Controllers/WorkerController.php:34
* @route '/trabajador/vacations-data'
*/
getVacations.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getVacations.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkerController::getVacations
* @see app/Http/Controllers/WorkerController.php:34
* @route '/trabajador/vacations-data'
*/
getVacations.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getVacations.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkerController::getVacations
* @see app/Http/Controllers/WorkerController.php:34
* @route '/trabajador/vacations-data'
*/
const getVacationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getVacations.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkerController::getVacations
* @see app/Http/Controllers/WorkerController.php:34
* @route '/trabajador/vacations-data'
*/
getVacationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getVacations.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkerController::getVacations
* @see app/Http/Controllers/WorkerController.php:34
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
* @see app/Http/Controllers/WorkerController.php:57
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
* @see app/Http/Controllers/WorkerController.php:57
* @route '/trabajador/vacations-request'
*/
storeVacationRequest.url = (options?: RouteQueryOptions) => {
    return storeVacationRequest.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkerController::storeVacationRequest
* @see app/Http/Controllers/WorkerController.php:57
* @route '/trabajador/vacations-request'
*/
storeVacationRequest.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeVacationRequest.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkerController::storeVacationRequest
* @see app/Http/Controllers/WorkerController.php:57
* @route '/trabajador/vacations-request'
*/
const storeVacationRequestForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeVacationRequest.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkerController::storeVacationRequest
* @see app/Http/Controllers/WorkerController.php:57
* @route '/trabajador/vacations-request'
*/
storeVacationRequestForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeVacationRequest.url(options),
    method: 'post',
})

storeVacationRequest.form = storeVacationRequestForm

/**
* @see \App\Http\Controllers\WorkerController::getPayslips
* @see app/Http/Controllers/WorkerController.php:80
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
* @see app/Http/Controllers/WorkerController.php:80
* @route '/trabajador/payslips-data'
*/
getPayslips.url = (options?: RouteQueryOptions) => {
    return getPayslips.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkerController::getPayslips
* @see app/Http/Controllers/WorkerController.php:80
* @route '/trabajador/payslips-data'
*/
getPayslips.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPayslips.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkerController::getPayslips
* @see app/Http/Controllers/WorkerController.php:80
* @route '/trabajador/payslips-data'
*/
getPayslips.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getPayslips.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkerController::getPayslips
* @see app/Http/Controllers/WorkerController.php:80
* @route '/trabajador/payslips-data'
*/
const getPayslipsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getPayslips.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkerController::getPayslips
* @see app/Http/Controllers/WorkerController.php:80
* @route '/trabajador/payslips-data'
*/
getPayslipsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getPayslips.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkerController::getPayslips
* @see app/Http/Controllers/WorkerController.php:80
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
* @see app/Http/Controllers/WorkerController.php:119
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
* @see app/Http/Controllers/WorkerController.php:119
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
* @see app/Http/Controllers/WorkerController.php:119
* @route '/trabajador/payslip/{id}'
*/
showPayslip.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showPayslip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkerController::showPayslip
* @see app/Http/Controllers/WorkerController.php:119
* @route '/trabajador/payslip/{id}'
*/
showPayslip.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showPayslip.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkerController::showPayslip
* @see app/Http/Controllers/WorkerController.php:119
* @route '/trabajador/payslip/{id}'
*/
const showPayslipForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showPayslip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkerController::showPayslip
* @see app/Http/Controllers/WorkerController.php:119
* @route '/trabajador/payslip/{id}'
*/
showPayslipForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showPayslip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkerController::showPayslip
* @see app/Http/Controllers/WorkerController.php:119
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

/**
* @see \App\Http\Controllers\WorkerController::getVacationPayments
* @see app/Http/Controllers/WorkerController.php:350
* @route '/trabajador/vacation-payments-data'
*/
export const getVacationPayments = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getVacationPayments.url(options),
    method: 'get',
})

getVacationPayments.definition = {
    methods: ["get","head"],
    url: '/trabajador/vacation-payments-data',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkerController::getVacationPayments
* @see app/Http/Controllers/WorkerController.php:350
* @route '/trabajador/vacation-payments-data'
*/
getVacationPayments.url = (options?: RouteQueryOptions) => {
    return getVacationPayments.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkerController::getVacationPayments
* @see app/Http/Controllers/WorkerController.php:350
* @route '/trabajador/vacation-payments-data'
*/
getVacationPayments.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getVacationPayments.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkerController::getVacationPayments
* @see app/Http/Controllers/WorkerController.php:350
* @route '/trabajador/vacation-payments-data'
*/
getVacationPayments.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getVacationPayments.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkerController::getVacationPayments
* @see app/Http/Controllers/WorkerController.php:350
* @route '/trabajador/vacation-payments-data'
*/
const getVacationPaymentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getVacationPayments.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkerController::getVacationPayments
* @see app/Http/Controllers/WorkerController.php:350
* @route '/trabajador/vacation-payments-data'
*/
getVacationPaymentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getVacationPayments.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkerController::getVacationPayments
* @see app/Http/Controllers/WorkerController.php:350
* @route '/trabajador/vacation-payments-data'
*/
getVacationPaymentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getVacationPayments.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getVacationPayments.form = getVacationPaymentsForm

/**
* @see \App\Http\Controllers\WorkerController::showVacationPayslip
* @see app/Http/Controllers/WorkerController.php:380
* @route '/trabajador/vacation-payments/payslip/{id}'
*/
export const showVacationPayslip = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showVacationPayslip.url(args, options),
    method: 'get',
})

showVacationPayslip.definition = {
    methods: ["get","head"],
    url: '/trabajador/vacation-payments/payslip/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkerController::showVacationPayslip
* @see app/Http/Controllers/WorkerController.php:380
* @route '/trabajador/vacation-payments/payslip/{id}'
*/
showVacationPayslip.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return showVacationPayslip.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkerController::showVacationPayslip
* @see app/Http/Controllers/WorkerController.php:380
* @route '/trabajador/vacation-payments/payslip/{id}'
*/
showVacationPayslip.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showVacationPayslip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkerController::showVacationPayslip
* @see app/Http/Controllers/WorkerController.php:380
* @route '/trabajador/vacation-payments/payslip/{id}'
*/
showVacationPayslip.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showVacationPayslip.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkerController::showVacationPayslip
* @see app/Http/Controllers/WorkerController.php:380
* @route '/trabajador/vacation-payments/payslip/{id}'
*/
const showVacationPayslipForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showVacationPayslip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkerController::showVacationPayslip
* @see app/Http/Controllers/WorkerController.php:380
* @route '/trabajador/vacation-payments/payslip/{id}'
*/
showVacationPayslipForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showVacationPayslip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkerController::showVacationPayslip
* @see app/Http/Controllers/WorkerController.php:380
* @route '/trabajador/vacation-payments/payslip/{id}'
*/
showVacationPayslipForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showVacationPayslip.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showVacationPayslip.form = showVacationPayslipForm

/**
* @see \App\Http\Controllers\WorkerController::getPermissionRequests
* @see app/Http/Controllers/WorkerController.php:497
* @route '/trabajador/permission-requests'
*/
export const getPermissionRequests = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPermissionRequests.url(options),
    method: 'get',
})

getPermissionRequests.definition = {
    methods: ["get","head"],
    url: '/trabajador/permission-requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkerController::getPermissionRequests
* @see app/Http/Controllers/WorkerController.php:497
* @route '/trabajador/permission-requests'
*/
getPermissionRequests.url = (options?: RouteQueryOptions) => {
    return getPermissionRequests.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkerController::getPermissionRequests
* @see app/Http/Controllers/WorkerController.php:497
* @route '/trabajador/permission-requests'
*/
getPermissionRequests.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPermissionRequests.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkerController::getPermissionRequests
* @see app/Http/Controllers/WorkerController.php:497
* @route '/trabajador/permission-requests'
*/
getPermissionRequests.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getPermissionRequests.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkerController::getPermissionRequests
* @see app/Http/Controllers/WorkerController.php:497
* @route '/trabajador/permission-requests'
*/
const getPermissionRequestsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getPermissionRequests.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkerController::getPermissionRequests
* @see app/Http/Controllers/WorkerController.php:497
* @route '/trabajador/permission-requests'
*/
getPermissionRequestsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getPermissionRequests.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkerController::getPermissionRequests
* @see app/Http/Controllers/WorkerController.php:497
* @route '/trabajador/permission-requests'
*/
getPermissionRequestsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getPermissionRequests.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getPermissionRequests.form = getPermissionRequestsForm

/**
* @see \App\Http\Controllers\WorkerController::storePermissionRequest
* @see app/Http/Controllers/WorkerController.php:533
* @route '/trabajador/permission-requests'
*/
export const storePermissionRequest = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePermissionRequest.url(options),
    method: 'post',
})

storePermissionRequest.definition = {
    methods: ["post"],
    url: '/trabajador/permission-requests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkerController::storePermissionRequest
* @see app/Http/Controllers/WorkerController.php:533
* @route '/trabajador/permission-requests'
*/
storePermissionRequest.url = (options?: RouteQueryOptions) => {
    return storePermissionRequest.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkerController::storePermissionRequest
* @see app/Http/Controllers/WorkerController.php:533
* @route '/trabajador/permission-requests'
*/
storePermissionRequest.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePermissionRequest.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkerController::storePermissionRequest
* @see app/Http/Controllers/WorkerController.php:533
* @route '/trabajador/permission-requests'
*/
const storePermissionRequestForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storePermissionRequest.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkerController::storePermissionRequest
* @see app/Http/Controllers/WorkerController.php:533
* @route '/trabajador/permission-requests'
*/
storePermissionRequestForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storePermissionRequest.url(options),
    method: 'post',
})

storePermissionRequest.form = storePermissionRequestForm

const WorkerController = { getProfile, getVacations, storeVacationRequest, getPayslips, showPayslip, getVacationPayments, showVacationPayslip, getPermissionRequests, storePermissionRequest }

export default WorkerController