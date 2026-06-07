import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::pay
* @see app/Http/Controllers/AdminController.php:407
* @route '/superusuario/admin/payroll/pay'
*/
export const pay = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pay.url(options),
    method: 'post',
})

pay.definition = {
    methods: ["post"],
    url: '/superusuario/admin/payroll/pay',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::pay
* @see app/Http/Controllers/AdminController.php:407
* @route '/superusuario/admin/payroll/pay'
*/
pay.url = (options?: RouteQueryOptions) => {
    return pay.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::pay
* @see app/Http/Controllers/AdminController.php:407
* @route '/superusuario/admin/payroll/pay'
*/
pay.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pay.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::pay
* @see app/Http/Controllers/AdminController.php:407
* @route '/superusuario/admin/payroll/pay'
*/
const payForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pay.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::pay
* @see app/Http/Controllers/AdminController.php:407
* @route '/superusuario/admin/payroll/pay'
*/
payForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pay.url(options),
    method: 'post',
})

pay.form = payForm

/**
* @see \App\Http\Controllers\AdminController::history
* @see app/Http/Controllers/AdminController.php:893
* @route '/superusuario/admin/payroll/history'
*/
export const history = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})

history.definition = {
    methods: ["get","head"],
    url: '/superusuario/admin/payroll/history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::history
* @see app/Http/Controllers/AdminController.php:893
* @route '/superusuario/admin/payroll/history'
*/
history.url = (options?: RouteQueryOptions) => {
    return history.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::history
* @see app/Http/Controllers/AdminController.php:893
* @route '/superusuario/admin/payroll/history'
*/
history.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::history
* @see app/Http/Controllers/AdminController.php:893
* @route '/superusuario/admin/payroll/history'
*/
history.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: history.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::history
* @see app/Http/Controllers/AdminController.php:893
* @route '/superusuario/admin/payroll/history'
*/
const historyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: history.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::history
* @see app/Http/Controllers/AdminController.php:893
* @route '/superusuario/admin/payroll/history'
*/
historyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: history.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::history
* @see app/Http/Controllers/AdminController.php:893
* @route '/superusuario/admin/payroll/history'
*/
historyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: history.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

history.form = historyForm

/**
* @see \App\Http\Controllers\AdminController::status
* @see app/Http/Controllers/AdminController.php:787
* @route '/superusuario/admin/payroll/{id}/status'
*/
export const status = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: status.url(args, options),
    method: 'post',
})

status.definition = {
    methods: ["post"],
    url: '/superusuario/admin/payroll/{id}/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::status
* @see app/Http/Controllers/AdminController.php:787
* @route '/superusuario/admin/payroll/{id}/status'
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
* @see app/Http/Controllers/AdminController.php:787
* @route '/superusuario/admin/payroll/{id}/status'
*/
status.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: status.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::status
* @see app/Http/Controllers/AdminController.php:787
* @route '/superusuario/admin/payroll/{id}/status'
*/
const statusForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: status.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::status
* @see app/Http/Controllers/AdminController.php:787
* @route '/superusuario/admin/payroll/{id}/status'
*/
statusForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: status.url(args, options),
    method: 'post',
})

status.form = statusForm

/**
* @see \App\Http\Controllers\AdminController::payslip
* @see app/Http/Controllers/AdminController.php:943
* @route '/superusuario/admin/payroll/payslip/{id}'
*/
export const payslip = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payslip.url(args, options),
    method: 'get',
})

payslip.definition = {
    methods: ["get","head"],
    url: '/superusuario/admin/payroll/payslip/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::payslip
* @see app/Http/Controllers/AdminController.php:943
* @route '/superusuario/admin/payroll/payslip/{id}'
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
* @see app/Http/Controllers/AdminController.php:943
* @route '/superusuario/admin/payroll/payslip/{id}'
*/
payslip.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payslip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::payslip
* @see app/Http/Controllers/AdminController.php:943
* @route '/superusuario/admin/payroll/payslip/{id}'
*/
payslip.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payslip.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::payslip
* @see app/Http/Controllers/AdminController.php:943
* @route '/superusuario/admin/payroll/payslip/{id}'
*/
const payslipForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payslip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::payslip
* @see app/Http/Controllers/AdminController.php:943
* @route '/superusuario/admin/payroll/payslip/{id}'
*/
payslipForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payslip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::payslip
* @see app/Http/Controllers/AdminController.php:943
* @route '/superusuario/admin/payroll/payslip/{id}'
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

const payroll = {
    pay: Object.assign(pay, pay),
    history: Object.assign(history, history),
    status: Object.assign(status, status),
    payslip: Object.assign(payslip, payslip),
}

export default payroll