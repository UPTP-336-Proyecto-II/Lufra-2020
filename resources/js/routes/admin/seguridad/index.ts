import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\SeguridadController::reset
 * @see app/Http/Controllers/Auth/SeguridadController.php:185
 * @route '/admin/seguridad/reset-password/{id}'
 */
export const reset = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reset.url(args, options),
    method: 'post',
})

reset.definition = {
    methods: ["post"],
    url: '/admin/seguridad/reset-password/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\SeguridadController::reset
 * @see app/Http/Controllers/Auth/SeguridadController.php:185
 * @route '/admin/seguridad/reset-password/{id}'
 */
reset.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return reset.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\SeguridadController::reset
 * @see app/Http/Controllers/Auth/SeguridadController.php:185
 * @route '/admin/seguridad/reset-password/{id}'
 */
reset.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reset.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\SeguridadController::reset
 * @see app/Http/Controllers/Auth/SeguridadController.php:185
 * @route '/admin/seguridad/reset-password/{id}'
 */
    const resetForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reset.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\SeguridadController::reset
 * @see app/Http/Controllers/Auth/SeguridadController.php:185
 * @route '/admin/seguridad/reset-password/{id}'
 */
        resetForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reset.url(args, options),
            method: 'post',
        })
    
    reset.form = resetForm
/**
* @see \App\Http\Controllers\Auth\SeguridadController::clear
 * @see app/Http/Controllers/Auth/SeguridadController.php:214
 * @route '/admin/seguridad/clear-questions/{id}'
 */
export const clear = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: clear.url(args, options),
    method: 'delete',
})

clear.definition = {
    methods: ["delete"],
    url: '/admin/seguridad/clear-questions/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Auth\SeguridadController::clear
 * @see app/Http/Controllers/Auth/SeguridadController.php:214
 * @route '/admin/seguridad/clear-questions/{id}'
 */
clear.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return clear.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\SeguridadController::clear
 * @see app/Http/Controllers/Auth/SeguridadController.php:214
 * @route '/admin/seguridad/clear-questions/{id}'
 */
clear.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: clear.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Auth\SeguridadController::clear
 * @see app/Http/Controllers/Auth/SeguridadController.php:214
 * @route '/admin/seguridad/clear-questions/{id}'
 */
    const clearForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: clear.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\SeguridadController::clear
 * @see app/Http/Controllers/Auth/SeguridadController.php:214
 * @route '/admin/seguridad/clear-questions/{id}'
 */
        clearForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: clear.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    clear.form = clearForm
const seguridad = {
    reset: Object.assign(reset, reset),
clear: Object.assign(clear, clear),
}

export default seguridad