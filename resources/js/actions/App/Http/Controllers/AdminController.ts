import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
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

export const listWorkers = {
    '/administrativo/workers': listWorkers103990ad9019aea90cd328d659bb8d11,
    '/superusuario/workers-list': listWorkers44fb511f151905f56c316d7da27997c1,
}

/**
* @see \App\Http\Controllers\AdminController::storeWorker
 * @see app/Http/Controllers/AdminController.php:39
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
 * @see app/Http/Controllers/AdminController.php:39
 * @route '/administrativo/workers'
 */
storeWorker.url = (options?: RouteQueryOptions) => {
    return storeWorker.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeWorker
 * @see app/Http/Controllers/AdminController.php:39
 * @route '/administrativo/workers'
 */
storeWorker.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeWorker.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateWorker
 * @see app/Http/Controllers/AdminController.php:96
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
 * @see app/Http/Controllers/AdminController.php:96
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
 * @see app/Http/Controllers/AdminController.php:96
 * @route '/administrativo/workers/{id}'
 */
updateWorker.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateWorker.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::activateWorker
 * @see app/Http/Controllers/AdminController.php:167
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
 * @see app/Http/Controllers/AdminController.php:167
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
 * @see app/Http/Controllers/AdminController.php:167
 * @route '/administrativo/workers/{id}/activate'
 */
activateWorker.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activateWorker.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::deactivateWorker
 * @see app/Http/Controllers/AdminController.php:157
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
 * @see app/Http/Controllers/AdminController.php:157
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
 * @see app/Http/Controllers/AdminController.php:157
 * @route '/administrativo/workers/{id}/deactivate'
 */
deactivateWorker.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deactivateWorker.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::listVacations
 * @see app/Http/Controllers/AdminController.php:178
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
 * @see app/Http/Controllers/AdminController.php:178
 * @route '/administrativo/vacations'
 */
listVacations.url = (options?: RouteQueryOptions) => {
    return listVacations.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listVacations
 * @see app/Http/Controllers/AdminController.php:178
 * @route '/administrativo/vacations'
 */
listVacations.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listVacations.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::listVacations
 * @see app/Http/Controllers/AdminController.php:178
 * @route '/administrativo/vacations'
 */
listVacations.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listVacations.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::updateVacationStatus
 * @see app/Http/Controllers/AdminController.php:189
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
 * @see app/Http/Controllers/AdminController.php:189
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
 * @see app/Http/Controllers/AdminController.php:189
 * @route '/administrativo/vacations/{id}/status'
 */
updateVacationStatus.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateVacationStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::listTypesNomina
 * @see app/Http/Controllers/AdminController.php:208
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
 * @see app/Http/Controllers/AdminController.php:208
 * @route '/administrativo/types-nomina'
 */
listTypesNomina.url = (options?: RouteQueryOptions) => {
    return listTypesNomina.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listTypesNomina
 * @see app/Http/Controllers/AdminController.php:208
 * @route '/administrativo/types-nomina'
 */
listTypesNomina.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listTypesNomina.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::listTypesNomina
 * @see app/Http/Controllers/AdminController.php:208
 * @route '/administrativo/types-nomina'
 */
listTypesNomina.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listTypesNomina.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::storeTypeNomina
 * @see app/Http/Controllers/AdminController.php:213
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
 * @see app/Http/Controllers/AdminController.php:213
 * @route '/administrativo/types-nomina'
 */
storeTypeNomina.url = (options?: RouteQueryOptions) => {
    return storeTypeNomina.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeTypeNomina
 * @see app/Http/Controllers/AdminController.php:213
 * @route '/administrativo/types-nomina'
 */
storeTypeNomina.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTypeNomina.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateTypeNomina
 * @see app/Http/Controllers/AdminController.php:225
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
 * @see app/Http/Controllers/AdminController.php:225
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
 * @see app/Http/Controllers/AdminController.php:225
 * @route '/administrativo/types-nomina/{id}'
 */
updateTypeNomina.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateTypeNomina.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::toggleTypeNominaStatus
 * @see app/Http/Controllers/AdminController.php:237
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
 * @see app/Http/Controllers/AdminController.php:237
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
 * @see app/Http/Controllers/AdminController.php:237
 * @route '/administrativo/types-nomina/{id}/toggle'
 */
toggleTypeNominaStatus.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleTypeNominaStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::listConcepts
 * @see app/Http/Controllers/AdminController.php:245
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
 * @see app/Http/Controllers/AdminController.php:245
 * @route '/administrativo/concepts'
 */
listConcepts.url = (options?: RouteQueryOptions) => {
    return listConcepts.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listConcepts
 * @see app/Http/Controllers/AdminController.php:245
 * @route '/administrativo/concepts'
 */
listConcepts.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listConcepts.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::listConcepts
 * @see app/Http/Controllers/AdminController.php:245
 * @route '/administrativo/concepts'
 */
listConcepts.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listConcepts.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::storeConcept
 * @see app/Http/Controllers/AdminController.php:250
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
 * @see app/Http/Controllers/AdminController.php:250
 * @route '/administrativo/concepts'
 */
storeConcept.url = (options?: RouteQueryOptions) => {
    return storeConcept.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeConcept
 * @see app/Http/Controllers/AdminController.php:250
 * @route '/administrativo/concepts'
 */
storeConcept.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeConcept.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateConcept
 * @see app/Http/Controllers/AdminController.php:264
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
 * @see app/Http/Controllers/AdminController.php:264
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
 * @see app/Http/Controllers/AdminController.php:264
 * @route '/administrativo/concepts/{id}'
 */
updateConcept.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateConcept.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::toggleConceptStatus
 * @see app/Http/Controllers/AdminController.php:279
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
 * @see app/Http/Controllers/AdminController.php:279
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
 * @see app/Http/Controllers/AdminController.php:279
 * @route '/administrativo/concepts/{id}/toggle'
 */
toggleConceptStatus.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleConceptStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::processPayment
 * @see app/Http/Controllers/AdminController.php:293
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
 * @see app/Http/Controllers/AdminController.php:293
 * @route '/administrativo/payroll/pay'
 */
processPayment.url = (options?: RouteQueryOptions) => {
    return processPayment.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::processPayment
 * @see app/Http/Controllers/AdminController.php:293
 * @route '/administrativo/payroll/pay'
 */
processPayment.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: processPayment.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::listCargos
 * @see app/Http/Controllers/AdminController.php:321
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
 * @see app/Http/Controllers/AdminController.php:321
 * @route '/administrativo/cargos'
 */
listCargos.url = (options?: RouteQueryOptions) => {
    return listCargos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listCargos
 * @see app/Http/Controllers/AdminController.php:321
 * @route '/administrativo/cargos'
 */
listCargos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listCargos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::listCargos
 * @see app/Http/Controllers/AdminController.php:321
 * @route '/administrativo/cargos'
 */
listCargos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listCargos.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::storeCargo
 * @see app/Http/Controllers/AdminController.php:327
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
 * @see app/Http/Controllers/AdminController.php:327
 * @route '/administrativo/cargos'
 */
storeCargo.url = (options?: RouteQueryOptions) => {
    return storeCargo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeCargo
 * @see app/Http/Controllers/AdminController.php:327
 * @route '/administrativo/cargos'
 */
storeCargo.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCargo.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateCargo
 * @see app/Http/Controllers/AdminController.php:338
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
 * @see app/Http/Controllers/AdminController.php:338
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
 * @see app/Http/Controllers/AdminController.php:338
 * @route '/administrativo/cargos/{id}'
 */
updateCargo.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateCargo.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::toggleCargoStatus
 * @see app/Http/Controllers/AdminController.php:349
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
 * @see app/Http/Controllers/AdminController.php:349
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
 * @see app/Http/Controllers/AdminController.php:349
 * @route '/administrativo/cargos/{id}/toggle'
 */
toggleCargoStatus.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleCargoStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::listEducationLevels
 * @see app/Http/Controllers/AdminController.php:357
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
 * @see app/Http/Controllers/AdminController.php:357
 * @route '/administrativo/education-levels'
 */
listEducationLevels.url = (options?: RouteQueryOptions) => {
    return listEducationLevels.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listEducationLevels
 * @see app/Http/Controllers/AdminController.php:357
 * @route '/administrativo/education-levels'
 */
listEducationLevels.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listEducationLevels.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::listEducationLevels
 * @see app/Http/Controllers/AdminController.php:357
 * @route '/administrativo/education-levels'
 */
listEducationLevels.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listEducationLevels.url(options),
    method: 'head',
})
const AdminController = { listWorkers, storeWorker, updateWorker, activateWorker, deactivateWorker, listVacations, updateVacationStatus, listTypesNomina, storeTypeNomina, updateTypeNomina, toggleTypeNominaStatus, listConcepts, storeConcept, updateConcept, toggleConceptStatus, processPayment, listCargos, storeCargo, updateCargo, toggleCargoStatus, listEducationLevels }

export default AdminController