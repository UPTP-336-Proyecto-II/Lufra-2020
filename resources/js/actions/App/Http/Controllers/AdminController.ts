import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::listWorkers
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/administrativo/workers'
 */
const listWorkers103990ad9019aea90cd328d659bb8d11 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listWorkers103990ad9019aea90cd328d659bb8d11.url(options),
    method: 'get',
})

listWorkers103990ad9019aea90cd328d659bb8d11.definition = {
    methods: ["get","head"],
    url: '/administrativo/workers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listWorkers
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/administrativo/workers'
 */
listWorkers103990ad9019aea90cd328d659bb8d11.url = (options?: RouteQueryOptions) => {
    return listWorkers103990ad9019aea90cd328d659bb8d11.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listWorkers
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/administrativo/workers'
 */
listWorkers103990ad9019aea90cd328d659bb8d11.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listWorkers103990ad9019aea90cd328d659bb8d11.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::listWorkers
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/administrativo/workers'
 */
listWorkers103990ad9019aea90cd328d659bb8d11.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listWorkers103990ad9019aea90cd328d659bb8d11.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::listWorkers
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/administrativo/workers'
 */
    const listWorkers103990ad9019aea90cd328d659bb8d11Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: listWorkers103990ad9019aea90cd328d659bb8d11.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::listWorkers
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/administrativo/workers'
 */
        listWorkers103990ad9019aea90cd328d659bb8d11Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listWorkers103990ad9019aea90cd328d659bb8d11.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::listWorkers
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/administrativo/workers'
 */
        listWorkers103990ad9019aea90cd328d659bb8d11Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listWorkers103990ad9019aea90cd328d659bb8d11.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    listWorkers103990ad9019aea90cd328d659bb8d11.form = listWorkers103990ad9019aea90cd328d659bb8d11Form
    /**
* @see \App\Http\Controllers\AdminController::listWorkers
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/superusuario/workers-list'
 */
const listWorkers44fb511f151905f56c316d7da27997c1 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listWorkers44fb511f151905f56c316d7da27997c1.url(options),
    method: 'get',
})

listWorkers44fb511f151905f56c316d7da27997c1.definition = {
    methods: ["get","head"],
    url: '/superusuario/workers-list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listWorkers
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/superusuario/workers-list'
 */
listWorkers44fb511f151905f56c316d7da27997c1.url = (options?: RouteQueryOptions) => {
    return listWorkers44fb511f151905f56c316d7da27997c1.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listWorkers
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/superusuario/workers-list'
 */
listWorkers44fb511f151905f56c316d7da27997c1.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listWorkers44fb511f151905f56c316d7da27997c1.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::listWorkers
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/superusuario/workers-list'
 */
listWorkers44fb511f151905f56c316d7da27997c1.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listWorkers44fb511f151905f56c316d7da27997c1.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::listWorkers
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/superusuario/workers-list'
 */
    const listWorkers44fb511f151905f56c316d7da27997c1Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: listWorkers44fb511f151905f56c316d7da27997c1.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::listWorkers
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/superusuario/workers-list'
 */
        listWorkers44fb511f151905f56c316d7da27997c1Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listWorkers44fb511f151905f56c316d7da27997c1.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::listWorkers
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/superusuario/workers-list'
 */
        listWorkers44fb511f151905f56c316d7da27997c1Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listWorkers44fb511f151905f56c316d7da27997c1.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    listWorkers44fb511f151905f56c316d7da27997c1.form = listWorkers44fb511f151905f56c316d7da27997c1Form

export const listWorkers = {
    '/administrativo/workers': listWorkers103990ad9019aea90cd328d659bb8d11,
    '/superusuario/workers-list': listWorkers44fb511f151905f56c316d7da27997c1,
}

/**
* @see \App\Http\Controllers\AdminController::storeWorker
 * @see app/Http/Controllers/AdminController.php:41
 * @route '/administrativo/workers'
 */
export const storeWorker = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeWorker.url(options),
    method: 'post',
})

storeWorker.definition = {
    methods: ["post"],
    url: '/administrativo/workers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storeWorker
 * @see app/Http/Controllers/AdminController.php:41
 * @route '/administrativo/workers'
 */
storeWorker.url = (options?: RouteQueryOptions) => {
    return storeWorker.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeWorker
 * @see app/Http/Controllers/AdminController.php:41
 * @route '/administrativo/workers'
 */
storeWorker.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeWorker.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::storeWorker
 * @see app/Http/Controllers/AdminController.php:41
 * @route '/administrativo/workers'
 */
    const storeWorkerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeWorker.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::storeWorker
 * @see app/Http/Controllers/AdminController.php:41
 * @route '/administrativo/workers'
 */
        storeWorkerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeWorker.url(options),
            method: 'post',
        })
    
    storeWorker.form = storeWorkerForm
/**
* @see \App\Http\Controllers\AdminController::updateWorker
 * @see app/Http/Controllers/AdminController.php:100
 * @route '/administrativo/workers/{id}'
 */
export const updateWorker = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateWorker.url(args, options),
    method: 'post',
})

updateWorker.definition = {
    methods: ["post"],
    url: '/administrativo/workers/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updateWorker
 * @see app/Http/Controllers/AdminController.php:100
 * @route '/administrativo/workers/{id}'
 */
updateWorker.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateWorker.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateWorker
 * @see app/Http/Controllers/AdminController.php:100
 * @route '/administrativo/workers/{id}'
 */
updateWorker.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateWorker.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::updateWorker
 * @see app/Http/Controllers/AdminController.php:100
 * @route '/administrativo/workers/{id}'
 */
    const updateWorkerForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateWorker.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::updateWorker
 * @see app/Http/Controllers/AdminController.php:100
 * @route '/administrativo/workers/{id}'
 */
        updateWorkerForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateWorker.url(args, options),
            method: 'post',
        })
    
    updateWorker.form = updateWorkerForm
/**
* @see \App\Http\Controllers\AdminController::activateWorker
 * @see app/Http/Controllers/AdminController.php:173
 * @route '/administrativo/workers/{id}/activate'
 */
export const activateWorker = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activateWorker.url(args, options),
    method: 'post',
})

activateWorker.definition = {
    methods: ["post"],
    url: '/administrativo/workers/{id}/activate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::activateWorker
 * @see app/Http/Controllers/AdminController.php:173
 * @route '/administrativo/workers/{id}/activate'
 */
activateWorker.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return activateWorker.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::activateWorker
 * @see app/Http/Controllers/AdminController.php:173
 * @route '/administrativo/workers/{id}/activate'
 */
activateWorker.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activateWorker.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::activateWorker
 * @see app/Http/Controllers/AdminController.php:173
 * @route '/administrativo/workers/{id}/activate'
 */
    const activateWorkerForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: activateWorker.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::activateWorker
 * @see app/Http/Controllers/AdminController.php:173
 * @route '/administrativo/workers/{id}/activate'
 */
        activateWorkerForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: activateWorker.url(args, options),
            method: 'post',
        })
    
    activateWorker.form = activateWorkerForm
/**
* @see \App\Http\Controllers\AdminController::deactivateWorker
 * @see app/Http/Controllers/AdminController.php:163
 * @route '/administrativo/workers/{id}/deactivate'
 */
export const deactivateWorker = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deactivateWorker.url(args, options),
    method: 'post',
})

deactivateWorker.definition = {
    methods: ["post"],
    url: '/administrativo/workers/{id}/deactivate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::deactivateWorker
 * @see app/Http/Controllers/AdminController.php:163
 * @route '/administrativo/workers/{id}/deactivate'
 */
deactivateWorker.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return deactivateWorker.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::deactivateWorker
 * @see app/Http/Controllers/AdminController.php:163
 * @route '/administrativo/workers/{id}/deactivate'
 */
deactivateWorker.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deactivateWorker.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::deactivateWorker
 * @see app/Http/Controllers/AdminController.php:163
 * @route '/administrativo/workers/{id}/deactivate'
 */
    const deactivateWorkerForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deactivateWorker.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::deactivateWorker
 * @see app/Http/Controllers/AdminController.php:163
 * @route '/administrativo/workers/{id}/deactivate'
 */
        deactivateWorkerForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deactivateWorker.url(args, options),
            method: 'post',
        })
    
    deactivateWorker.form = deactivateWorkerForm
/**
* @see \App\Http\Controllers\AdminController::listVacations
 * @see app/Http/Controllers/AdminController.php:184
 * @route '/administrativo/vacations'
 */
export const listVacations = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listVacations.url(options),
    method: 'get',
})

listVacations.definition = {
    methods: ["get","head"],
    url: '/administrativo/vacations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listVacations
 * @see app/Http/Controllers/AdminController.php:184
 * @route '/administrativo/vacations'
 */
listVacations.url = (options?: RouteQueryOptions) => {
    return listVacations.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listVacations
 * @see app/Http/Controllers/AdminController.php:184
 * @route '/administrativo/vacations'
 */
listVacations.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listVacations.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::listVacations
 * @see app/Http/Controllers/AdminController.php:184
 * @route '/administrativo/vacations'
 */
listVacations.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listVacations.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::listVacations
 * @see app/Http/Controllers/AdminController.php:184
 * @route '/administrativo/vacations'
 */
    const listVacationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: listVacations.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::listVacations
 * @see app/Http/Controllers/AdminController.php:184
 * @route '/administrativo/vacations'
 */
        listVacationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listVacations.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::listVacations
 * @see app/Http/Controllers/AdminController.php:184
 * @route '/administrativo/vacations'
 */
        listVacationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listVacations.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    listVacations.form = listVacationsForm
/**
* @see \App\Http\Controllers\AdminController::updateVacationStatus
 * @see app/Http/Controllers/AdminController.php:196
 * @route '/administrativo/vacations/{id}/status'
 */
export const updateVacationStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateVacationStatus.url(args, options),
    method: 'post',
})

updateVacationStatus.definition = {
    methods: ["post"],
    url: '/administrativo/vacations/{id}/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updateVacationStatus
 * @see app/Http/Controllers/AdminController.php:196
 * @route '/administrativo/vacations/{id}/status'
 */
updateVacationStatus.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateVacationStatus.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateVacationStatus
 * @see app/Http/Controllers/AdminController.php:196
 * @route '/administrativo/vacations/{id}/status'
 */
updateVacationStatus.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateVacationStatus.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::updateVacationStatus
 * @see app/Http/Controllers/AdminController.php:196
 * @route '/administrativo/vacations/{id}/status'
 */
    const updateVacationStatusForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateVacationStatus.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::updateVacationStatus
 * @see app/Http/Controllers/AdminController.php:196
 * @route '/administrativo/vacations/{id}/status'
 */
        updateVacationStatusForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateVacationStatus.url(args, options),
            method: 'post',
        })
    
    updateVacationStatus.form = updateVacationStatusForm
/**
* @see \App\Http\Controllers\AdminController::listVacationPayments
 * @see app/Http/Controllers/AdminController.php:394
 * @route '/administrativo/vacation-payments'
 */
export const listVacationPayments = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listVacationPayments.url(options),
    method: 'get',
})

listVacationPayments.definition = {
    methods: ["get","head"],
    url: '/administrativo/vacation-payments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listVacationPayments
 * @see app/Http/Controllers/AdminController.php:394
 * @route '/administrativo/vacation-payments'
 */
listVacationPayments.url = (options?: RouteQueryOptions) => {
    return listVacationPayments.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listVacationPayments
 * @see app/Http/Controllers/AdminController.php:394
 * @route '/administrativo/vacation-payments'
 */
listVacationPayments.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listVacationPayments.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::listVacationPayments
 * @see app/Http/Controllers/AdminController.php:394
 * @route '/administrativo/vacation-payments'
 */
listVacationPayments.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listVacationPayments.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::listVacationPayments
 * @see app/Http/Controllers/AdminController.php:394
 * @route '/administrativo/vacation-payments'
 */
    const listVacationPaymentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: listVacationPayments.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::listVacationPayments
 * @see app/Http/Controllers/AdminController.php:394
 * @route '/administrativo/vacation-payments'
 */
        listVacationPaymentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listVacationPayments.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::listVacationPayments
 * @see app/Http/Controllers/AdminController.php:394
 * @route '/administrativo/vacation-payments'
 */
        listVacationPaymentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listVacationPayments.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    listVacationPayments.form = listVacationPaymentsForm
/**
* @see \App\Http\Controllers\AdminController::storeVacationPayment
 * @see app/Http/Controllers/AdminController.php:427
 * @route '/administrativo/vacation-payments'
 */
export const storeVacationPayment = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeVacationPayment.url(options),
    method: 'post',
})

storeVacationPayment.definition = {
    methods: ["post"],
    url: '/administrativo/vacation-payments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storeVacationPayment
 * @see app/Http/Controllers/AdminController.php:427
 * @route '/administrativo/vacation-payments'
 */
storeVacationPayment.url = (options?: RouteQueryOptions) => {
    return storeVacationPayment.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeVacationPayment
 * @see app/Http/Controllers/AdminController.php:427
 * @route '/administrativo/vacation-payments'
 */
storeVacationPayment.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeVacationPayment.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::storeVacationPayment
 * @see app/Http/Controllers/AdminController.php:427
 * @route '/administrativo/vacation-payments'
 */
    const storeVacationPaymentForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeVacationPayment.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::storeVacationPayment
 * @see app/Http/Controllers/AdminController.php:427
 * @route '/administrativo/vacation-payments'
 */
        storeVacationPaymentForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeVacationPayment.url(options),
            method: 'post',
        })
    
    storeVacationPayment.form = storeVacationPaymentForm
/**
* @see \App\Http\Controllers\AdminController::getPaidYears
 * @see app/Http/Controllers/AdminController.php:414
 * @route '/administrativo/vacation-payments/paid-years/{workerId}'
 */
export const getPaidYears = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPaidYears.url(args, options),
    method: 'get',
})

getPaidYears.definition = {
    methods: ["get","head"],
    url: '/administrativo/vacation-payments/paid-years/{workerId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::getPaidYears
 * @see app/Http/Controllers/AdminController.php:414
 * @route '/administrativo/vacation-payments/paid-years/{workerId}'
 */
getPaidYears.url = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getPaidYears.definition.url
            .replace('{workerId}', parsedArgs.workerId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::getPaidYears
 * @see app/Http/Controllers/AdminController.php:414
 * @route '/administrativo/vacation-payments/paid-years/{workerId}'
 */
getPaidYears.get = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPaidYears.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::getPaidYears
 * @see app/Http/Controllers/AdminController.php:414
 * @route '/administrativo/vacation-payments/paid-years/{workerId}'
 */
getPaidYears.head = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getPaidYears.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::getPaidYears
 * @see app/Http/Controllers/AdminController.php:414
 * @route '/administrativo/vacation-payments/paid-years/{workerId}'
 */
    const getPaidYearsForm = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getPaidYears.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::getPaidYears
 * @see app/Http/Controllers/AdminController.php:414
 * @route '/administrativo/vacation-payments/paid-years/{workerId}'
 */
        getPaidYearsForm.get = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPaidYears.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::getPaidYears
 * @see app/Http/Controllers/AdminController.php:414
 * @route '/administrativo/vacation-payments/paid-years/{workerId}'
 */
        getPaidYearsForm.head = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPaidYears.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getPaidYears.form = getPaidYearsForm
/**
* @see \App\Http\Controllers\AdminController::listTypesNomina
 * @see app/Http/Controllers/AdminController.php:232
 * @route '/administrativo/types-nomina'
 */
export const listTypesNomina = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listTypesNomina.url(options),
    method: 'get',
})

listTypesNomina.definition = {
    methods: ["get","head"],
    url: '/administrativo/types-nomina',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listTypesNomina
 * @see app/Http/Controllers/AdminController.php:232
 * @route '/administrativo/types-nomina'
 */
listTypesNomina.url = (options?: RouteQueryOptions) => {
    return listTypesNomina.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listTypesNomina
 * @see app/Http/Controllers/AdminController.php:232
 * @route '/administrativo/types-nomina'
 */
listTypesNomina.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listTypesNomina.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::listTypesNomina
 * @see app/Http/Controllers/AdminController.php:232
 * @route '/administrativo/types-nomina'
 */
listTypesNomina.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listTypesNomina.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::listTypesNomina
 * @see app/Http/Controllers/AdminController.php:232
 * @route '/administrativo/types-nomina'
 */
    const listTypesNominaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: listTypesNomina.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::listTypesNomina
 * @see app/Http/Controllers/AdminController.php:232
 * @route '/administrativo/types-nomina'
 */
        listTypesNominaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listTypesNomina.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::listTypesNomina
 * @see app/Http/Controllers/AdminController.php:232
 * @route '/administrativo/types-nomina'
 */
        listTypesNominaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listTypesNomina.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    listTypesNomina.form = listTypesNominaForm
/**
* @see \App\Http\Controllers\AdminController::storeTypeNomina
 * @see app/Http/Controllers/AdminController.php:237
 * @route '/administrativo/types-nomina'
 */
export const storeTypeNomina = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTypeNomina.url(options),
    method: 'post',
})

storeTypeNomina.definition = {
    methods: ["post"],
    url: '/administrativo/types-nomina',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storeTypeNomina
 * @see app/Http/Controllers/AdminController.php:237
 * @route '/administrativo/types-nomina'
 */
storeTypeNomina.url = (options?: RouteQueryOptions) => {
    return storeTypeNomina.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeTypeNomina
 * @see app/Http/Controllers/AdminController.php:237
 * @route '/administrativo/types-nomina'
 */
storeTypeNomina.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTypeNomina.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::storeTypeNomina
 * @see app/Http/Controllers/AdminController.php:237
 * @route '/administrativo/types-nomina'
 */
    const storeTypeNominaForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeTypeNomina.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::storeTypeNomina
 * @see app/Http/Controllers/AdminController.php:237
 * @route '/administrativo/types-nomina'
 */
        storeTypeNominaForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeTypeNomina.url(options),
            method: 'post',
        })
    
    storeTypeNomina.form = storeTypeNominaForm
/**
* @see \App\Http\Controllers\AdminController::updateTypeNomina
 * @see app/Http/Controllers/AdminController.php:253
 * @route '/administrativo/types-nomina/{id}'
 */
export const updateTypeNomina = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateTypeNomina.url(args, options),
    method: 'post',
})

updateTypeNomina.definition = {
    methods: ["post"],
    url: '/administrativo/types-nomina/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updateTypeNomina
 * @see app/Http/Controllers/AdminController.php:253
 * @route '/administrativo/types-nomina/{id}'
 */
updateTypeNomina.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateTypeNomina.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateTypeNomina
 * @see app/Http/Controllers/AdminController.php:253
 * @route '/administrativo/types-nomina/{id}'
 */
updateTypeNomina.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateTypeNomina.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::updateTypeNomina
 * @see app/Http/Controllers/AdminController.php:253
 * @route '/administrativo/types-nomina/{id}'
 */
    const updateTypeNominaForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateTypeNomina.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::updateTypeNomina
 * @see app/Http/Controllers/AdminController.php:253
 * @route '/administrativo/types-nomina/{id}'
 */
        updateTypeNominaForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateTypeNomina.url(args, options),
            method: 'post',
        })
    
    updateTypeNomina.form = updateTypeNominaForm
/**
* @see \App\Http\Controllers\AdminController::toggleTypeNominaStatus
 * @see app/Http/Controllers/AdminController.php:265
 * @route '/administrativo/types-nomina/{id}/toggle'
 */
export const toggleTypeNominaStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleTypeNominaStatus.url(args, options),
    method: 'post',
})

toggleTypeNominaStatus.definition = {
    methods: ["post"],
    url: '/administrativo/types-nomina/{id}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::toggleTypeNominaStatus
 * @see app/Http/Controllers/AdminController.php:265
 * @route '/administrativo/types-nomina/{id}/toggle'
 */
toggleTypeNominaStatus.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleTypeNominaStatus.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::toggleTypeNominaStatus
 * @see app/Http/Controllers/AdminController.php:265
 * @route '/administrativo/types-nomina/{id}/toggle'
 */
toggleTypeNominaStatus.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleTypeNominaStatus.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::toggleTypeNominaStatus
 * @see app/Http/Controllers/AdminController.php:265
 * @route '/administrativo/types-nomina/{id}/toggle'
 */
    const toggleTypeNominaStatusForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleTypeNominaStatus.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::toggleTypeNominaStatus
 * @see app/Http/Controllers/AdminController.php:265
 * @route '/administrativo/types-nomina/{id}/toggle'
 */
        toggleTypeNominaStatusForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleTypeNominaStatus.url(args, options),
            method: 'post',
        })
    
    toggleTypeNominaStatus.form = toggleTypeNominaStatusForm
/**
* @see \App\Http\Controllers\AdminController::listConcepts
 * @see app/Http/Controllers/AdminController.php:280
 * @route '/administrativo/concepts'
 */
export const listConcepts = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listConcepts.url(options),
    method: 'get',
})

listConcepts.definition = {
    methods: ["get","head"],
    url: '/administrativo/concepts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listConcepts
 * @see app/Http/Controllers/AdminController.php:280
 * @route '/administrativo/concepts'
 */
listConcepts.url = (options?: RouteQueryOptions) => {
    return listConcepts.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listConcepts
 * @see app/Http/Controllers/AdminController.php:280
 * @route '/administrativo/concepts'
 */
listConcepts.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listConcepts.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::listConcepts
 * @see app/Http/Controllers/AdminController.php:280
 * @route '/administrativo/concepts'
 */
listConcepts.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listConcepts.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::listConcepts
 * @see app/Http/Controllers/AdminController.php:280
 * @route '/administrativo/concepts'
 */
    const listConceptsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: listConcepts.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::listConcepts
 * @see app/Http/Controllers/AdminController.php:280
 * @route '/administrativo/concepts'
 */
        listConceptsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listConcepts.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::listConcepts
 * @see app/Http/Controllers/AdminController.php:280
 * @route '/administrativo/concepts'
 */
        listConceptsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listConcepts.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    listConcepts.form = listConceptsForm
/**
* @see \App\Http\Controllers\AdminController::storeConcept
 * @see app/Http/Controllers/AdminController.php:285
 * @route '/administrativo/concepts'
 */
export const storeConcept = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeConcept.url(options),
    method: 'post',
})

storeConcept.definition = {
    methods: ["post"],
    url: '/administrativo/concepts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storeConcept
 * @see app/Http/Controllers/AdminController.php:285
 * @route '/administrativo/concepts'
 */
storeConcept.url = (options?: RouteQueryOptions) => {
    return storeConcept.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeConcept
 * @see app/Http/Controllers/AdminController.php:285
 * @route '/administrativo/concepts'
 */
storeConcept.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeConcept.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::storeConcept
 * @see app/Http/Controllers/AdminController.php:285
 * @route '/administrativo/concepts'
 */
    const storeConceptForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeConcept.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::storeConcept
 * @see app/Http/Controllers/AdminController.php:285
 * @route '/administrativo/concepts'
 */
        storeConceptForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeConcept.url(options),
            method: 'post',
        })
    
    storeConcept.form = storeConceptForm
/**
* @see \App\Http\Controllers\AdminController::updateConcept
 * @see app/Http/Controllers/AdminController.php:299
 * @route '/administrativo/concepts/{id}'
 */
export const updateConcept = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateConcept.url(args, options),
    method: 'post',
})

updateConcept.definition = {
    methods: ["post"],
    url: '/administrativo/concepts/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updateConcept
 * @see app/Http/Controllers/AdminController.php:299
 * @route '/administrativo/concepts/{id}'
 */
updateConcept.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateConcept.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateConcept
 * @see app/Http/Controllers/AdminController.php:299
 * @route '/administrativo/concepts/{id}'
 */
updateConcept.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateConcept.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::updateConcept
 * @see app/Http/Controllers/AdminController.php:299
 * @route '/administrativo/concepts/{id}'
 */
    const updateConceptForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateConcept.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::updateConcept
 * @see app/Http/Controllers/AdminController.php:299
 * @route '/administrativo/concepts/{id}'
 */
        updateConceptForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateConcept.url(args, options),
            method: 'post',
        })
    
    updateConcept.form = updateConceptForm
/**
* @see \App\Http\Controllers\AdminController::toggleConceptStatus
 * @see app/Http/Controllers/AdminController.php:314
 * @route '/administrativo/concepts/{id}/toggle'
 */
export const toggleConceptStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleConceptStatus.url(args, options),
    method: 'post',
})

toggleConceptStatus.definition = {
    methods: ["post"],
    url: '/administrativo/concepts/{id}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::toggleConceptStatus
 * @see app/Http/Controllers/AdminController.php:314
 * @route '/administrativo/concepts/{id}/toggle'
 */
toggleConceptStatus.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleConceptStatus.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::toggleConceptStatus
 * @see app/Http/Controllers/AdminController.php:314
 * @route '/administrativo/concepts/{id}/toggle'
 */
toggleConceptStatus.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleConceptStatus.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::toggleConceptStatus
 * @see app/Http/Controllers/AdminController.php:314
 * @route '/administrativo/concepts/{id}/toggle'
 */
    const toggleConceptStatusForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleConceptStatus.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::toggleConceptStatus
 * @see app/Http/Controllers/AdminController.php:314
 * @route '/administrativo/concepts/{id}/toggle'
 */
        toggleConceptStatusForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleConceptStatus.url(args, options),
            method: 'post',
        })
    
    toggleConceptStatus.form = toggleConceptStatusForm
/**
* @see \App\Http\Controllers\AdminController::processPayment
 * @see app/Http/Controllers/AdminController.php:328
 * @route '/administrativo/payroll/pay'
 */
export const processPayment = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: processPayment.url(options),
    method: 'post',
})

processPayment.definition = {
    methods: ["post"],
    url: '/administrativo/payroll/pay',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::processPayment
 * @see app/Http/Controllers/AdminController.php:328
 * @route '/administrativo/payroll/pay'
 */
processPayment.url = (options?: RouteQueryOptions) => {
    return processPayment.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::processPayment
 * @see app/Http/Controllers/AdminController.php:328
 * @route '/administrativo/payroll/pay'
 */
processPayment.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: processPayment.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::processPayment
 * @see app/Http/Controllers/AdminController.php:328
 * @route '/administrativo/payroll/pay'
 */
    const processPaymentForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: processPayment.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::processPayment
 * @see app/Http/Controllers/AdminController.php:328
 * @route '/administrativo/payroll/pay'
 */
        processPaymentForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: processPayment.url(options),
            method: 'post',
        })
    
    processPayment.form = processPaymentForm
/**
* @see \App\Http\Controllers\AdminController::listCargos
 * @see app/Http/Controllers/AdminController.php:352
 * @route '/administrativo/cargos'
 */
export const listCargos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listCargos.url(options),
    method: 'get',
})

listCargos.definition = {
    methods: ["get","head"],
    url: '/administrativo/cargos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listCargos
 * @see app/Http/Controllers/AdminController.php:352
 * @route '/administrativo/cargos'
 */
listCargos.url = (options?: RouteQueryOptions) => {
    return listCargos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listCargos
 * @see app/Http/Controllers/AdminController.php:352
 * @route '/administrativo/cargos'
 */
listCargos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listCargos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::listCargos
 * @see app/Http/Controllers/AdminController.php:352
 * @route '/administrativo/cargos'
 */
listCargos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listCargos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::listCargos
 * @see app/Http/Controllers/AdminController.php:352
 * @route '/administrativo/cargos'
 */
    const listCargosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: listCargos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::listCargos
 * @see app/Http/Controllers/AdminController.php:352
 * @route '/administrativo/cargos'
 */
        listCargosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listCargos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::listCargos
 * @see app/Http/Controllers/AdminController.php:352
 * @route '/administrativo/cargos'
 */
        listCargosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listCargos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    listCargos.form = listCargosForm
/**
* @see \App\Http\Controllers\AdminController::storeCargo
 * @see app/Http/Controllers/AdminController.php:357
 * @route '/administrativo/cargos'
 */
export const storeCargo = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCargo.url(options),
    method: 'post',
})

storeCargo.definition = {
    methods: ["post"],
    url: '/administrativo/cargos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storeCargo
 * @see app/Http/Controllers/AdminController.php:357
 * @route '/administrativo/cargos'
 */
storeCargo.url = (options?: RouteQueryOptions) => {
    return storeCargo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeCargo
 * @see app/Http/Controllers/AdminController.php:357
 * @route '/administrativo/cargos'
 */
storeCargo.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCargo.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::storeCargo
 * @see app/Http/Controllers/AdminController.php:357
 * @route '/administrativo/cargos'
 */
    const storeCargoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeCargo.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::storeCargo
 * @see app/Http/Controllers/AdminController.php:357
 * @route '/administrativo/cargos'
 */
        storeCargoForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeCargo.url(options),
            method: 'post',
        })
    
    storeCargo.form = storeCargoForm
/**
* @see \App\Http\Controllers\AdminController::updateCargo
 * @see app/Http/Controllers/AdminController.php:367
 * @route '/administrativo/cargos/{id}'
 */
export const updateCargo = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateCargo.url(args, options),
    method: 'post',
})

updateCargo.definition = {
    methods: ["post"],
    url: '/administrativo/cargos/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updateCargo
 * @see app/Http/Controllers/AdminController.php:367
 * @route '/administrativo/cargos/{id}'
 */
updateCargo.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateCargo.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateCargo
 * @see app/Http/Controllers/AdminController.php:367
 * @route '/administrativo/cargos/{id}'
 */
updateCargo.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateCargo.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::updateCargo
 * @see app/Http/Controllers/AdminController.php:367
 * @route '/administrativo/cargos/{id}'
 */
    const updateCargoForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateCargo.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::updateCargo
 * @see app/Http/Controllers/AdminController.php:367
 * @route '/administrativo/cargos/{id}'
 */
        updateCargoForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateCargo.url(args, options),
            method: 'post',
        })
    
    updateCargo.form = updateCargoForm
/**
* @see \App\Http\Controllers\AdminController::toggleCargoStatus
 * @see app/Http/Controllers/AdminController.php:378
 * @route '/administrativo/cargos/{id}/toggle'
 */
export const toggleCargoStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleCargoStatus.url(args, options),
    method: 'post',
})

toggleCargoStatus.definition = {
    methods: ["post"],
    url: '/administrativo/cargos/{id}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::toggleCargoStatus
 * @see app/Http/Controllers/AdminController.php:378
 * @route '/administrativo/cargos/{id}/toggle'
 */
toggleCargoStatus.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleCargoStatus.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::toggleCargoStatus
 * @see app/Http/Controllers/AdminController.php:378
 * @route '/administrativo/cargos/{id}/toggle'
 */
toggleCargoStatus.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleCargoStatus.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::toggleCargoStatus
 * @see app/Http/Controllers/AdminController.php:378
 * @route '/administrativo/cargos/{id}/toggle'
 */
    const toggleCargoStatusForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleCargoStatus.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::toggleCargoStatus
 * @see app/Http/Controllers/AdminController.php:378
 * @route '/administrativo/cargos/{id}/toggle'
 */
        toggleCargoStatusForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleCargoStatus.url(args, options),
            method: 'post',
        })
    
    toggleCargoStatus.form = toggleCargoStatusForm
/**
* @see \App\Http\Controllers\AdminController::listEducationLevels
 * @see app/Http/Controllers/AdminController.php:386
 * @route '/administrativo/education-levels'
 */
export const listEducationLevels = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listEducationLevels.url(options),
    method: 'get',
})

listEducationLevels.definition = {
    methods: ["get","head"],
    url: '/administrativo/education-levels',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listEducationLevels
 * @see app/Http/Controllers/AdminController.php:386
 * @route '/administrativo/education-levels'
 */
listEducationLevels.url = (options?: RouteQueryOptions) => {
    return listEducationLevels.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listEducationLevels
 * @see app/Http/Controllers/AdminController.php:386
 * @route '/administrativo/education-levels'
 */
listEducationLevels.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listEducationLevels.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::listEducationLevels
 * @see app/Http/Controllers/AdminController.php:386
 * @route '/administrativo/education-levels'
 */
listEducationLevels.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listEducationLevels.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::listEducationLevels
 * @see app/Http/Controllers/AdminController.php:386
 * @route '/administrativo/education-levels'
 */
    const listEducationLevelsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: listEducationLevels.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::listEducationLevels
 * @see app/Http/Controllers/AdminController.php:386
 * @route '/administrativo/education-levels'
 */
        listEducationLevelsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listEducationLevels.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::listEducationLevels
 * @see app/Http/Controllers/AdminController.php:386
 * @route '/administrativo/education-levels'
 */
        listEducationLevelsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listEducationLevels.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    listEducationLevels.form = listEducationLevelsForm
const AdminController = { listWorkers, storeWorker, updateWorker, activateWorker, deactivateWorker, listVacations, updateVacationStatus, listVacationPayments, storeVacationPayment, getPaidYears, listTypesNomina, storeTypeNomina, updateTypeNomina, toggleTypeNominaStatus, listConcepts, storeConcept, updateConcept, toggleConceptStatus, processPayment, listCargos, storeCargo, updateCargo, toggleCargoStatus, listEducationLevels }

export default AdminController