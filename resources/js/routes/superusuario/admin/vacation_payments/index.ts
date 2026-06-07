import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::store
* @see app/Http/Controllers/AdminController.php:1253
* @route '/superusuario/admin/vacation-payments'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/superusuario/admin/vacation-payments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::store
* @see app/Http/Controllers/AdminController.php:1253
* @route '/superusuario/admin/vacation-payments'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::store
* @see app/Http/Controllers/AdminController.php:1253
* @route '/superusuario/admin/vacation-payments'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::store
* @see app/Http/Controllers/AdminController.php:1253
* @route '/superusuario/admin/vacation-payments'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::store
* @see app/Http/Controllers/AdminController.php:1253
* @route '/superusuario/admin/vacation-payments'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\AdminController::paid_years
* @see app/Http/Controllers/AdminController.php:1239
* @route '/superusuario/admin/vacation-payments/paid-years/{workerId}'
*/
export const paid_years = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paid_years.url(args, options),
    method: 'get',
})

paid_years.definition = {
    methods: ["get","head"],
    url: '/superusuario/admin/vacation-payments/paid-years/{workerId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::paid_years
* @see app/Http/Controllers/AdminController.php:1239
* @route '/superusuario/admin/vacation-payments/paid-years/{workerId}'
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
* @see app/Http/Controllers/AdminController.php:1239
* @route '/superusuario/admin/vacation-payments/paid-years/{workerId}'
*/
paid_years.get = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paid_years.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::paid_years
* @see app/Http/Controllers/AdminController.php:1239
* @route '/superusuario/admin/vacation-payments/paid-years/{workerId}'
*/
paid_years.head = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: paid_years.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::paid_years
* @see app/Http/Controllers/AdminController.php:1239
* @route '/superusuario/admin/vacation-payments/paid-years/{workerId}'
*/
const paid_yearsForm = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: paid_years.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::paid_years
* @see app/Http/Controllers/AdminController.php:1239
* @route '/superusuario/admin/vacation-payments/paid-years/{workerId}'
*/
paid_yearsForm.get = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: paid_years.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::paid_years
* @see app/Http/Controllers/AdminController.php:1239
* @route '/superusuario/admin/vacation-payments/paid-years/{workerId}'
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

/**
* @see \App\Http\Controllers\AdminController::payslip
* @see app/Http/Controllers/AdminController.php:1316
* @route '/superusuario/admin/vacation-payments/payslip/{id}'
*/
export const payslip = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payslip.url(args, options),
    method: 'get',
})

payslip.definition = {
    methods: ["get","head"],
    url: '/superusuario/admin/vacation-payments/payslip/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::payslip
* @see app/Http/Controllers/AdminController.php:1316
* @route '/superusuario/admin/vacation-payments/payslip/{id}'
*/
payslip.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return payslip.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::payslip
* @see app/Http/Controllers/AdminController.php:1316
* @route '/superusuario/admin/vacation-payments/payslip/{id}'
*/
payslip.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payslip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::payslip
* @see app/Http/Controllers/AdminController.php:1316
* @route '/superusuario/admin/vacation-payments/payslip/{id}'
*/
payslip.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payslip.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::payslip
* @see app/Http/Controllers/AdminController.php:1316
* @route '/superusuario/admin/vacation-payments/payslip/{id}'
*/
const payslipForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payslip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::payslip
* @see app/Http/Controllers/AdminController.php:1316
* @route '/superusuario/admin/vacation-payments/payslip/{id}'
*/
payslipForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payslip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::payslip
* @see app/Http/Controllers/AdminController.php:1316
* @route '/superusuario/admin/vacation-payments/payslip/{id}'
*/
payslipForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payslip.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

payslip.form = payslipForm

/**
* @see \App\Http\Controllers\AdminController::status
* @see app/Http/Controllers/AdminController.php:1419
* @route '/superusuario/admin/vacation-payments/{id}/status'
*/
export const status = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: status.url(args, options),
    method: 'post',
})

status.definition = {
    methods: ["post"],
    url: '/superusuario/admin/vacation-payments/{id}/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::status
* @see app/Http/Controllers/AdminController.php:1419
* @route '/superusuario/admin/vacation-payments/{id}/status'
*/
status.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return status.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::status
* @see app/Http/Controllers/AdminController.php:1419
* @route '/superusuario/admin/vacation-payments/{id}/status'
*/
status.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: status.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::status
* @see app/Http/Controllers/AdminController.php:1419
* @route '/superusuario/admin/vacation-payments/{id}/status'
*/
const statusForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: status.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::status
* @see app/Http/Controllers/AdminController.php:1419
* @route '/superusuario/admin/vacation-payments/{id}/status'
*/
statusForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: status.url(args, options),
    method: 'post',
})

status.form = statusForm

const vacation_payments = {
    store: Object.assign(store, store),
    paid_years: Object.assign(paid_years, paid_years),
    payslip: Object.assign(payslip, payslip),
    status: Object.assign(status, status),
}

export default vacation_payments