import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::listWorkers
* @see app/Http/Controllers/AdminController.php:19
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
* @see app/Http/Controllers/AdminController.php:19
* @route '/administrativo/workers'
*/
listWorkers103990ad9019aea90cd328d659bb8d11.url = (options?: RouteQueryOptions) => {
    return listWorkers103990ad9019aea90cd328d659bb8d11.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listWorkers
* @see app/Http/Controllers/AdminController.php:19
* @route '/administrativo/workers'
*/
listWorkers103990ad9019aea90cd328d659bb8d11.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listWorkers103990ad9019aea90cd328d659bb8d11.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listWorkers
* @see app/Http/Controllers/AdminController.php:19
* @route '/administrativo/workers'
*/
listWorkers103990ad9019aea90cd328d659bb8d11.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listWorkers103990ad9019aea90cd328d659bb8d11.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::listWorkers
* @see app/Http/Controllers/AdminController.php:19
* @route '/administrativo/workers'
*/
const listWorkers103990ad9019aea90cd328d659bb8d11Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listWorkers103990ad9019aea90cd328d659bb8d11.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listWorkers
* @see app/Http/Controllers/AdminController.php:19
* @route '/administrativo/workers'
*/
listWorkers103990ad9019aea90cd328d659bb8d11Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listWorkers103990ad9019aea90cd328d659bb8d11.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listWorkers
* @see app/Http/Controllers/AdminController.php:19
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
* @see app/Http/Controllers/AdminController.php:19
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
* @see app/Http/Controllers/AdminController.php:19
* @route '/superusuario/workers-list'
*/
listWorkers44fb511f151905f56c316d7da27997c1.url = (options?: RouteQueryOptions) => {
    return listWorkers44fb511f151905f56c316d7da27997c1.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listWorkers
* @see app/Http/Controllers/AdminController.php:19
* @route '/superusuario/workers-list'
*/
listWorkers44fb511f151905f56c316d7da27997c1.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listWorkers44fb511f151905f56c316d7da27997c1.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listWorkers
* @see app/Http/Controllers/AdminController.php:19
* @route '/superusuario/workers-list'
*/
listWorkers44fb511f151905f56c316d7da27997c1.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listWorkers44fb511f151905f56c316d7da27997c1.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::listWorkers
* @see app/Http/Controllers/AdminController.php:19
* @route '/superusuario/workers-list'
*/
const listWorkers44fb511f151905f56c316d7da27997c1Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listWorkers44fb511f151905f56c316d7da27997c1.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listWorkers
* @see app/Http/Controllers/AdminController.php:19
* @route '/superusuario/workers-list'
*/
listWorkers44fb511f151905f56c316d7da27997c1Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listWorkers44fb511f151905f56c316d7da27997c1.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listWorkers
* @see app/Http/Controllers/AdminController.php:19
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
/**
* @see \App\Http\Controllers\AdminController::listWorkers
* @see app/Http/Controllers/AdminController.php:19
* @route '/superusuario/admin/workers'
*/
const listWorkersbeb66491fd330f211cb9b02a0613bbc6 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listWorkersbeb66491fd330f211cb9b02a0613bbc6.url(options),
    method: 'get',
})

listWorkersbeb66491fd330f211cb9b02a0613bbc6.definition = {
    methods: ["get","head"],
    url: '/superusuario/admin/workers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listWorkers
* @see app/Http/Controllers/AdminController.php:19
* @route '/superusuario/admin/workers'
*/
listWorkersbeb66491fd330f211cb9b02a0613bbc6.url = (options?: RouteQueryOptions) => {
    return listWorkersbeb66491fd330f211cb9b02a0613bbc6.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listWorkers
* @see app/Http/Controllers/AdminController.php:19
* @route '/superusuario/admin/workers'
*/
listWorkersbeb66491fd330f211cb9b02a0613bbc6.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listWorkersbeb66491fd330f211cb9b02a0613bbc6.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listWorkers
* @see app/Http/Controllers/AdminController.php:19
* @route '/superusuario/admin/workers'
*/
listWorkersbeb66491fd330f211cb9b02a0613bbc6.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listWorkersbeb66491fd330f211cb9b02a0613bbc6.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::listWorkers
* @see app/Http/Controllers/AdminController.php:19
* @route '/superusuario/admin/workers'
*/
const listWorkersbeb66491fd330f211cb9b02a0613bbc6Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listWorkersbeb66491fd330f211cb9b02a0613bbc6.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listWorkers
* @see app/Http/Controllers/AdminController.php:19
* @route '/superusuario/admin/workers'
*/
listWorkersbeb66491fd330f211cb9b02a0613bbc6Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listWorkersbeb66491fd330f211cb9b02a0613bbc6.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listWorkers
* @see app/Http/Controllers/AdminController.php:19
* @route '/superusuario/admin/workers'
*/
listWorkersbeb66491fd330f211cb9b02a0613bbc6Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listWorkersbeb66491fd330f211cb9b02a0613bbc6.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

listWorkersbeb66491fd330f211cb9b02a0613bbc6.form = listWorkersbeb66491fd330f211cb9b02a0613bbc6Form

export const listWorkers = {
    '/administrativo/workers': listWorkers103990ad9019aea90cd328d659bb8d11,
    '/superusuario/workers-list': listWorkers44fb511f151905f56c316d7da27997c1,
    '/superusuario/admin/workers': listWorkersbeb66491fd330f211cb9b02a0613bbc6,
}

/**
* @see \App\Http\Controllers\AdminController::storeWorker
* @see app/Http/Controllers/AdminController.php:71
* @route '/administrativo/workers'
*/
const storeWorker103990ad9019aea90cd328d659bb8d11 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeWorker103990ad9019aea90cd328d659bb8d11.url(options),
    method: 'post',
})

storeWorker103990ad9019aea90cd328d659bb8d11.definition = {
    methods: ["post"],
    url: '/administrativo/workers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storeWorker
* @see app/Http/Controllers/AdminController.php:71
* @route '/administrativo/workers'
*/
storeWorker103990ad9019aea90cd328d659bb8d11.url = (options?: RouteQueryOptions) => {
    return storeWorker103990ad9019aea90cd328d659bb8d11.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeWorker
* @see app/Http/Controllers/AdminController.php:71
* @route '/administrativo/workers'
*/
storeWorker103990ad9019aea90cd328d659bb8d11.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeWorker103990ad9019aea90cd328d659bb8d11.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::storeWorker
* @see app/Http/Controllers/AdminController.php:71
* @route '/administrativo/workers'
*/
const storeWorker103990ad9019aea90cd328d659bb8d11Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeWorker103990ad9019aea90cd328d659bb8d11.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::storeWorker
* @see app/Http/Controllers/AdminController.php:71
* @route '/administrativo/workers'
*/
storeWorker103990ad9019aea90cd328d659bb8d11Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeWorker103990ad9019aea90cd328d659bb8d11.url(options),
    method: 'post',
})

storeWorker103990ad9019aea90cd328d659bb8d11.form = storeWorker103990ad9019aea90cd328d659bb8d11Form
/**
* @see \App\Http\Controllers\AdminController::storeWorker
* @see app/Http/Controllers/AdminController.php:71
* @route '/superusuario/admin/workers'
*/
const storeWorkerbeb66491fd330f211cb9b02a0613bbc6 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeWorkerbeb66491fd330f211cb9b02a0613bbc6.url(options),
    method: 'post',
})

storeWorkerbeb66491fd330f211cb9b02a0613bbc6.definition = {
    methods: ["post"],
    url: '/superusuario/admin/workers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storeWorker
* @see app/Http/Controllers/AdminController.php:71
* @route '/superusuario/admin/workers'
*/
storeWorkerbeb66491fd330f211cb9b02a0613bbc6.url = (options?: RouteQueryOptions) => {
    return storeWorkerbeb66491fd330f211cb9b02a0613bbc6.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeWorker
* @see app/Http/Controllers/AdminController.php:71
* @route '/superusuario/admin/workers'
*/
storeWorkerbeb66491fd330f211cb9b02a0613bbc6.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeWorkerbeb66491fd330f211cb9b02a0613bbc6.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::storeWorker
* @see app/Http/Controllers/AdminController.php:71
* @route '/superusuario/admin/workers'
*/
const storeWorkerbeb66491fd330f211cb9b02a0613bbc6Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeWorkerbeb66491fd330f211cb9b02a0613bbc6.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::storeWorker
* @see app/Http/Controllers/AdminController.php:71
* @route '/superusuario/admin/workers'
*/
storeWorkerbeb66491fd330f211cb9b02a0613bbc6Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeWorkerbeb66491fd330f211cb9b02a0613bbc6.url(options),
    method: 'post',
})

storeWorkerbeb66491fd330f211cb9b02a0613bbc6.form = storeWorkerbeb66491fd330f211cb9b02a0613bbc6Form

export const storeWorker = {
    '/administrativo/workers': storeWorker103990ad9019aea90cd328d659bb8d11,
    '/superusuario/admin/workers': storeWorkerbeb66491fd330f211cb9b02a0613bbc6,
}

/**
* @see \App\Http\Controllers\AdminController::updateWorker
* @see app/Http/Controllers/AdminController.php:134
* @route '/administrativo/workers/{id}'
*/
const updateWorker01eac7e6b4d0f5d73ce38d9313e2faf5 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateWorker01eac7e6b4d0f5d73ce38d9313e2faf5.url(args, options),
    method: 'post',
})

updateWorker01eac7e6b4d0f5d73ce38d9313e2faf5.definition = {
    methods: ["post"],
    url: '/administrativo/workers/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updateWorker
* @see app/Http/Controllers/AdminController.php:134
* @route '/administrativo/workers/{id}'
*/
updateWorker01eac7e6b4d0f5d73ce38d9313e2faf5.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateWorker01eac7e6b4d0f5d73ce38d9313e2faf5.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateWorker
* @see app/Http/Controllers/AdminController.php:134
* @route '/administrativo/workers/{id}'
*/
updateWorker01eac7e6b4d0f5d73ce38d9313e2faf5.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateWorker01eac7e6b4d0f5d73ce38d9313e2faf5.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateWorker
* @see app/Http/Controllers/AdminController.php:134
* @route '/administrativo/workers/{id}'
*/
const updateWorker01eac7e6b4d0f5d73ce38d9313e2faf5Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateWorker01eac7e6b4d0f5d73ce38d9313e2faf5.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateWorker
* @see app/Http/Controllers/AdminController.php:134
* @route '/administrativo/workers/{id}'
*/
updateWorker01eac7e6b4d0f5d73ce38d9313e2faf5Form.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateWorker01eac7e6b4d0f5d73ce38d9313e2faf5.url(args, options),
    method: 'post',
})

updateWorker01eac7e6b4d0f5d73ce38d9313e2faf5.form = updateWorker01eac7e6b4d0f5d73ce38d9313e2faf5Form
/**
* @see \App\Http\Controllers\AdminController::updateWorker
* @see app/Http/Controllers/AdminController.php:134
* @route '/superusuario/admin/workers/{id}'
*/
const updateWorker5f3476c49cd0c32d29d5d763fe94d72c = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateWorker5f3476c49cd0c32d29d5d763fe94d72c.url(args, options),
    method: 'post',
})

updateWorker5f3476c49cd0c32d29d5d763fe94d72c.definition = {
    methods: ["post"],
    url: '/superusuario/admin/workers/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updateWorker
* @see app/Http/Controllers/AdminController.php:134
* @route '/superusuario/admin/workers/{id}'
*/
updateWorker5f3476c49cd0c32d29d5d763fe94d72c.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateWorker5f3476c49cd0c32d29d5d763fe94d72c.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateWorker
* @see app/Http/Controllers/AdminController.php:134
* @route '/superusuario/admin/workers/{id}'
*/
updateWorker5f3476c49cd0c32d29d5d763fe94d72c.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateWorker5f3476c49cd0c32d29d5d763fe94d72c.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateWorker
* @see app/Http/Controllers/AdminController.php:134
* @route '/superusuario/admin/workers/{id}'
*/
const updateWorker5f3476c49cd0c32d29d5d763fe94d72cForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateWorker5f3476c49cd0c32d29d5d763fe94d72c.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateWorker
* @see app/Http/Controllers/AdminController.php:134
* @route '/superusuario/admin/workers/{id}'
*/
updateWorker5f3476c49cd0c32d29d5d763fe94d72cForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateWorker5f3476c49cd0c32d29d5d763fe94d72c.url(args, options),
    method: 'post',
})

updateWorker5f3476c49cd0c32d29d5d763fe94d72c.form = updateWorker5f3476c49cd0c32d29d5d763fe94d72cForm

export const updateWorker = {
    '/administrativo/workers/{id}': updateWorker01eac7e6b4d0f5d73ce38d9313e2faf5,
    '/superusuario/admin/workers/{id}': updateWorker5f3476c49cd0c32d29d5d763fe94d72c,
}

/**
* @see \App\Http\Controllers\AdminController::activateWorker
* @see app/Http/Controllers/AdminController.php:213
* @route '/administrativo/workers/{id}/activate'
*/
const activateWorker66dece10e93f3c93dd32c4dc29dc857a = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activateWorker66dece10e93f3c93dd32c4dc29dc857a.url(args, options),
    method: 'post',
})

activateWorker66dece10e93f3c93dd32c4dc29dc857a.definition = {
    methods: ["post"],
    url: '/administrativo/workers/{id}/activate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::activateWorker
* @see app/Http/Controllers/AdminController.php:213
* @route '/administrativo/workers/{id}/activate'
*/
activateWorker66dece10e93f3c93dd32c4dc29dc857a.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return activateWorker66dece10e93f3c93dd32c4dc29dc857a.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::activateWorker
* @see app/Http/Controllers/AdminController.php:213
* @route '/administrativo/workers/{id}/activate'
*/
activateWorker66dece10e93f3c93dd32c4dc29dc857a.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activateWorker66dece10e93f3c93dd32c4dc29dc857a.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::activateWorker
* @see app/Http/Controllers/AdminController.php:213
* @route '/administrativo/workers/{id}/activate'
*/
const activateWorker66dece10e93f3c93dd32c4dc29dc857aForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: activateWorker66dece10e93f3c93dd32c4dc29dc857a.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::activateWorker
* @see app/Http/Controllers/AdminController.php:213
* @route '/administrativo/workers/{id}/activate'
*/
activateWorker66dece10e93f3c93dd32c4dc29dc857aForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: activateWorker66dece10e93f3c93dd32c4dc29dc857a.url(args, options),
    method: 'post',
})

activateWorker66dece10e93f3c93dd32c4dc29dc857a.form = activateWorker66dece10e93f3c93dd32c4dc29dc857aForm
/**
* @see \App\Http\Controllers\AdminController::activateWorker
* @see app/Http/Controllers/AdminController.php:213
* @route '/superusuario/admin/workers/{id}/activate'
*/
const activateWorker05127549dee01d5b08e38d5c4b1fd416 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activateWorker05127549dee01d5b08e38d5c4b1fd416.url(args, options),
    method: 'post',
})

activateWorker05127549dee01d5b08e38d5c4b1fd416.definition = {
    methods: ["post"],
    url: '/superusuario/admin/workers/{id}/activate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::activateWorker
* @see app/Http/Controllers/AdminController.php:213
* @route '/superusuario/admin/workers/{id}/activate'
*/
activateWorker05127549dee01d5b08e38d5c4b1fd416.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return activateWorker05127549dee01d5b08e38d5c4b1fd416.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::activateWorker
* @see app/Http/Controllers/AdminController.php:213
* @route '/superusuario/admin/workers/{id}/activate'
*/
activateWorker05127549dee01d5b08e38d5c4b1fd416.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activateWorker05127549dee01d5b08e38d5c4b1fd416.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::activateWorker
* @see app/Http/Controllers/AdminController.php:213
* @route '/superusuario/admin/workers/{id}/activate'
*/
const activateWorker05127549dee01d5b08e38d5c4b1fd416Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: activateWorker05127549dee01d5b08e38d5c4b1fd416.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::activateWorker
* @see app/Http/Controllers/AdminController.php:213
* @route '/superusuario/admin/workers/{id}/activate'
*/
activateWorker05127549dee01d5b08e38d5c4b1fd416Form.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: activateWorker05127549dee01d5b08e38d5c4b1fd416.url(args, options),
    method: 'post',
})

activateWorker05127549dee01d5b08e38d5c4b1fd416.form = activateWorker05127549dee01d5b08e38d5c4b1fd416Form

export const activateWorker = {
    '/administrativo/workers/{id}/activate': activateWorker66dece10e93f3c93dd32c4dc29dc857a,
    '/superusuario/admin/workers/{id}/activate': activateWorker05127549dee01d5b08e38d5c4b1fd416,
}

/**
* @see \App\Http\Controllers\AdminController::deactivateWorker
* @see app/Http/Controllers/AdminController.php:201
* @route '/administrativo/workers/{id}/deactivate'
*/
const deactivateWorkerd1867c47ad5e5f3b03a55c4d5a6d9534 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deactivateWorkerd1867c47ad5e5f3b03a55c4d5a6d9534.url(args, options),
    method: 'post',
})

deactivateWorkerd1867c47ad5e5f3b03a55c4d5a6d9534.definition = {
    methods: ["post"],
    url: '/administrativo/workers/{id}/deactivate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::deactivateWorker
* @see app/Http/Controllers/AdminController.php:201
* @route '/administrativo/workers/{id}/deactivate'
*/
deactivateWorkerd1867c47ad5e5f3b03a55c4d5a6d9534.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return deactivateWorkerd1867c47ad5e5f3b03a55c4d5a6d9534.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::deactivateWorker
* @see app/Http/Controllers/AdminController.php:201
* @route '/administrativo/workers/{id}/deactivate'
*/
deactivateWorkerd1867c47ad5e5f3b03a55c4d5a6d9534.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deactivateWorkerd1867c47ad5e5f3b03a55c4d5a6d9534.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::deactivateWorker
* @see app/Http/Controllers/AdminController.php:201
* @route '/administrativo/workers/{id}/deactivate'
*/
const deactivateWorkerd1867c47ad5e5f3b03a55c4d5a6d9534Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deactivateWorkerd1867c47ad5e5f3b03a55c4d5a6d9534.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::deactivateWorker
* @see app/Http/Controllers/AdminController.php:201
* @route '/administrativo/workers/{id}/deactivate'
*/
deactivateWorkerd1867c47ad5e5f3b03a55c4d5a6d9534Form.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deactivateWorkerd1867c47ad5e5f3b03a55c4d5a6d9534.url(args, options),
    method: 'post',
})

deactivateWorkerd1867c47ad5e5f3b03a55c4d5a6d9534.form = deactivateWorkerd1867c47ad5e5f3b03a55c4d5a6d9534Form
/**
* @see \App\Http\Controllers\AdminController::deactivateWorker
* @see app/Http/Controllers/AdminController.php:201
* @route '/superusuario/admin/workers/{id}/deactivate'
*/
const deactivateWorkere4f50da6d0c96e43b06cf09230ac277e = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deactivateWorkere4f50da6d0c96e43b06cf09230ac277e.url(args, options),
    method: 'post',
})

deactivateWorkere4f50da6d0c96e43b06cf09230ac277e.definition = {
    methods: ["post"],
    url: '/superusuario/admin/workers/{id}/deactivate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::deactivateWorker
* @see app/Http/Controllers/AdminController.php:201
* @route '/superusuario/admin/workers/{id}/deactivate'
*/
deactivateWorkere4f50da6d0c96e43b06cf09230ac277e.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return deactivateWorkere4f50da6d0c96e43b06cf09230ac277e.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::deactivateWorker
* @see app/Http/Controllers/AdminController.php:201
* @route '/superusuario/admin/workers/{id}/deactivate'
*/
deactivateWorkere4f50da6d0c96e43b06cf09230ac277e.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deactivateWorkere4f50da6d0c96e43b06cf09230ac277e.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::deactivateWorker
* @see app/Http/Controllers/AdminController.php:201
* @route '/superusuario/admin/workers/{id}/deactivate'
*/
const deactivateWorkere4f50da6d0c96e43b06cf09230ac277eForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deactivateWorkere4f50da6d0c96e43b06cf09230ac277e.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::deactivateWorker
* @see app/Http/Controllers/AdminController.php:201
* @route '/superusuario/admin/workers/{id}/deactivate'
*/
deactivateWorkere4f50da6d0c96e43b06cf09230ac277eForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deactivateWorkere4f50da6d0c96e43b06cf09230ac277e.url(args, options),
    method: 'post',
})

deactivateWorkere4f50da6d0c96e43b06cf09230ac277e.form = deactivateWorkere4f50da6d0c96e43b06cf09230ac277eForm

export const deactivateWorker = {
    '/administrativo/workers/{id}/deactivate': deactivateWorkerd1867c47ad5e5f3b03a55c4d5a6d9534,
    '/superusuario/admin/workers/{id}/deactivate': deactivateWorkere4f50da6d0c96e43b06cf09230ac277e,
}

/**
* @see \App\Http\Controllers\AdminController::listVacations
* @see app/Http/Controllers/AdminController.php:226
* @route '/administrativo/vacations'
*/
const listVacationsc0adfaf27c4c86eb65fe4d6bcc91a5cf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listVacationsc0adfaf27c4c86eb65fe4d6bcc91a5cf.url(options),
    method: 'get',
})

listVacationsc0adfaf27c4c86eb65fe4d6bcc91a5cf.definition = {
    methods: ["get","head"],
    url: '/administrativo/vacations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listVacations
* @see app/Http/Controllers/AdminController.php:226
* @route '/administrativo/vacations'
*/
listVacationsc0adfaf27c4c86eb65fe4d6bcc91a5cf.url = (options?: RouteQueryOptions) => {
    return listVacationsc0adfaf27c4c86eb65fe4d6bcc91a5cf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listVacations
* @see app/Http/Controllers/AdminController.php:226
* @route '/administrativo/vacations'
*/
listVacationsc0adfaf27c4c86eb65fe4d6bcc91a5cf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listVacationsc0adfaf27c4c86eb65fe4d6bcc91a5cf.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listVacations
* @see app/Http/Controllers/AdminController.php:226
* @route '/administrativo/vacations'
*/
listVacationsc0adfaf27c4c86eb65fe4d6bcc91a5cf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listVacationsc0adfaf27c4c86eb65fe4d6bcc91a5cf.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::listVacations
* @see app/Http/Controllers/AdminController.php:226
* @route '/administrativo/vacations'
*/
const listVacationsc0adfaf27c4c86eb65fe4d6bcc91a5cfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listVacationsc0adfaf27c4c86eb65fe4d6bcc91a5cf.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listVacations
* @see app/Http/Controllers/AdminController.php:226
* @route '/administrativo/vacations'
*/
listVacationsc0adfaf27c4c86eb65fe4d6bcc91a5cfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listVacationsc0adfaf27c4c86eb65fe4d6bcc91a5cf.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listVacations
* @see app/Http/Controllers/AdminController.php:226
* @route '/administrativo/vacations'
*/
listVacationsc0adfaf27c4c86eb65fe4d6bcc91a5cfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listVacationsc0adfaf27c4c86eb65fe4d6bcc91a5cf.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

listVacationsc0adfaf27c4c86eb65fe4d6bcc91a5cf.form = listVacationsc0adfaf27c4c86eb65fe4d6bcc91a5cfForm
/**
* @see \App\Http\Controllers\AdminController::listVacations
* @see app/Http/Controllers/AdminController.php:226
* @route '/superusuario/admin/vacations'
*/
const listVacationsea7e0c46738715d1b04531391354ece4 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listVacationsea7e0c46738715d1b04531391354ece4.url(options),
    method: 'get',
})

listVacationsea7e0c46738715d1b04531391354ece4.definition = {
    methods: ["get","head"],
    url: '/superusuario/admin/vacations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listVacations
* @see app/Http/Controllers/AdminController.php:226
* @route '/superusuario/admin/vacations'
*/
listVacationsea7e0c46738715d1b04531391354ece4.url = (options?: RouteQueryOptions) => {
    return listVacationsea7e0c46738715d1b04531391354ece4.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listVacations
* @see app/Http/Controllers/AdminController.php:226
* @route '/superusuario/admin/vacations'
*/
listVacationsea7e0c46738715d1b04531391354ece4.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listVacationsea7e0c46738715d1b04531391354ece4.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listVacations
* @see app/Http/Controllers/AdminController.php:226
* @route '/superusuario/admin/vacations'
*/
listVacationsea7e0c46738715d1b04531391354ece4.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listVacationsea7e0c46738715d1b04531391354ece4.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::listVacations
* @see app/Http/Controllers/AdminController.php:226
* @route '/superusuario/admin/vacations'
*/
const listVacationsea7e0c46738715d1b04531391354ece4Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listVacationsea7e0c46738715d1b04531391354ece4.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listVacations
* @see app/Http/Controllers/AdminController.php:226
* @route '/superusuario/admin/vacations'
*/
listVacationsea7e0c46738715d1b04531391354ece4Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listVacationsea7e0c46738715d1b04531391354ece4.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listVacations
* @see app/Http/Controllers/AdminController.php:226
* @route '/superusuario/admin/vacations'
*/
listVacationsea7e0c46738715d1b04531391354ece4Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listVacationsea7e0c46738715d1b04531391354ece4.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

listVacationsea7e0c46738715d1b04531391354ece4.form = listVacationsea7e0c46738715d1b04531391354ece4Form

export const listVacations = {
    '/administrativo/vacations': listVacationsc0adfaf27c4c86eb65fe4d6bcc91a5cf,
    '/superusuario/admin/vacations': listVacationsea7e0c46738715d1b04531391354ece4,
}

/**
* @see \App\Http\Controllers\AdminController::updateVacationStatus
* @see app/Http/Controllers/AdminController.php:238
* @route '/administrativo/vacations/{id}/status'
*/
const updateVacationStatus164c524e8afa6f085181c8085d0d1634 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateVacationStatus164c524e8afa6f085181c8085d0d1634.url(args, options),
    method: 'post',
})

updateVacationStatus164c524e8afa6f085181c8085d0d1634.definition = {
    methods: ["post"],
    url: '/administrativo/vacations/{id}/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updateVacationStatus
* @see app/Http/Controllers/AdminController.php:238
* @route '/administrativo/vacations/{id}/status'
*/
updateVacationStatus164c524e8afa6f085181c8085d0d1634.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateVacationStatus164c524e8afa6f085181c8085d0d1634.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateVacationStatus
* @see app/Http/Controllers/AdminController.php:238
* @route '/administrativo/vacations/{id}/status'
*/
updateVacationStatus164c524e8afa6f085181c8085d0d1634.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateVacationStatus164c524e8afa6f085181c8085d0d1634.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateVacationStatus
* @see app/Http/Controllers/AdminController.php:238
* @route '/administrativo/vacations/{id}/status'
*/
const updateVacationStatus164c524e8afa6f085181c8085d0d1634Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateVacationStatus164c524e8afa6f085181c8085d0d1634.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateVacationStatus
* @see app/Http/Controllers/AdminController.php:238
* @route '/administrativo/vacations/{id}/status'
*/
updateVacationStatus164c524e8afa6f085181c8085d0d1634Form.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateVacationStatus164c524e8afa6f085181c8085d0d1634.url(args, options),
    method: 'post',
})

updateVacationStatus164c524e8afa6f085181c8085d0d1634.form = updateVacationStatus164c524e8afa6f085181c8085d0d1634Form
/**
* @see \App\Http\Controllers\AdminController::updateVacationStatus
* @see app/Http/Controllers/AdminController.php:238
* @route '/superusuario/admin/vacations/{id}/status'
*/
const updateVacationStatus7ba21d531d1639fcce2469174a95183a = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateVacationStatus7ba21d531d1639fcce2469174a95183a.url(args, options),
    method: 'post',
})

updateVacationStatus7ba21d531d1639fcce2469174a95183a.definition = {
    methods: ["post"],
    url: '/superusuario/admin/vacations/{id}/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updateVacationStatus
* @see app/Http/Controllers/AdminController.php:238
* @route '/superusuario/admin/vacations/{id}/status'
*/
updateVacationStatus7ba21d531d1639fcce2469174a95183a.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateVacationStatus7ba21d531d1639fcce2469174a95183a.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateVacationStatus
* @see app/Http/Controllers/AdminController.php:238
* @route '/superusuario/admin/vacations/{id}/status'
*/
updateVacationStatus7ba21d531d1639fcce2469174a95183a.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateVacationStatus7ba21d531d1639fcce2469174a95183a.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateVacationStatus
* @see app/Http/Controllers/AdminController.php:238
* @route '/superusuario/admin/vacations/{id}/status'
*/
const updateVacationStatus7ba21d531d1639fcce2469174a95183aForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateVacationStatus7ba21d531d1639fcce2469174a95183a.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateVacationStatus
* @see app/Http/Controllers/AdminController.php:238
* @route '/superusuario/admin/vacations/{id}/status'
*/
updateVacationStatus7ba21d531d1639fcce2469174a95183aForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateVacationStatus7ba21d531d1639fcce2469174a95183a.url(args, options),
    method: 'post',
})

updateVacationStatus7ba21d531d1639fcce2469174a95183a.form = updateVacationStatus7ba21d531d1639fcce2469174a95183aForm

export const updateVacationStatus = {
    '/administrativo/vacations/{id}/status': updateVacationStatus164c524e8afa6f085181c8085d0d1634,
    '/superusuario/admin/vacations/{id}/status': updateVacationStatus7ba21d531d1639fcce2469174a95183a,
}

/**
* @see \App\Http\Controllers\AdminController::listVacationPayments
* @see app/Http/Controllers/AdminController.php:1219
* @route '/administrativo/vacation-payments'
*/
const listVacationPayments74641ab437ba6bcc6ce7519ba601c577 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listVacationPayments74641ab437ba6bcc6ce7519ba601c577.url(options),
    method: 'get',
})

listVacationPayments74641ab437ba6bcc6ce7519ba601c577.definition = {
    methods: ["get","head"],
    url: '/administrativo/vacation-payments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listVacationPayments
* @see app/Http/Controllers/AdminController.php:1219
* @route '/administrativo/vacation-payments'
*/
listVacationPayments74641ab437ba6bcc6ce7519ba601c577.url = (options?: RouteQueryOptions) => {
    return listVacationPayments74641ab437ba6bcc6ce7519ba601c577.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listVacationPayments
* @see app/Http/Controllers/AdminController.php:1219
* @route '/administrativo/vacation-payments'
*/
listVacationPayments74641ab437ba6bcc6ce7519ba601c577.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listVacationPayments74641ab437ba6bcc6ce7519ba601c577.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listVacationPayments
* @see app/Http/Controllers/AdminController.php:1219
* @route '/administrativo/vacation-payments'
*/
listVacationPayments74641ab437ba6bcc6ce7519ba601c577.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listVacationPayments74641ab437ba6bcc6ce7519ba601c577.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::listVacationPayments
* @see app/Http/Controllers/AdminController.php:1219
* @route '/administrativo/vacation-payments'
*/
const listVacationPayments74641ab437ba6bcc6ce7519ba601c577Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listVacationPayments74641ab437ba6bcc6ce7519ba601c577.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listVacationPayments
* @see app/Http/Controllers/AdminController.php:1219
* @route '/administrativo/vacation-payments'
*/
listVacationPayments74641ab437ba6bcc6ce7519ba601c577Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listVacationPayments74641ab437ba6bcc6ce7519ba601c577.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listVacationPayments
* @see app/Http/Controllers/AdminController.php:1219
* @route '/administrativo/vacation-payments'
*/
listVacationPayments74641ab437ba6bcc6ce7519ba601c577Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listVacationPayments74641ab437ba6bcc6ce7519ba601c577.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

listVacationPayments74641ab437ba6bcc6ce7519ba601c577.form = listVacationPayments74641ab437ba6bcc6ce7519ba601c577Form
/**
* @see \App\Http\Controllers\AdminController::listVacationPayments
* @see app/Http/Controllers/AdminController.php:1219
* @route '/superusuario/admin/vacation-payments'
*/
const listVacationPaymentsb3ec670b11ae62023bf717913af3b68b = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listVacationPaymentsb3ec670b11ae62023bf717913af3b68b.url(options),
    method: 'get',
})

listVacationPaymentsb3ec670b11ae62023bf717913af3b68b.definition = {
    methods: ["get","head"],
    url: '/superusuario/admin/vacation-payments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listVacationPayments
* @see app/Http/Controllers/AdminController.php:1219
* @route '/superusuario/admin/vacation-payments'
*/
listVacationPaymentsb3ec670b11ae62023bf717913af3b68b.url = (options?: RouteQueryOptions) => {
    return listVacationPaymentsb3ec670b11ae62023bf717913af3b68b.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listVacationPayments
* @see app/Http/Controllers/AdminController.php:1219
* @route '/superusuario/admin/vacation-payments'
*/
listVacationPaymentsb3ec670b11ae62023bf717913af3b68b.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listVacationPaymentsb3ec670b11ae62023bf717913af3b68b.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listVacationPayments
* @see app/Http/Controllers/AdminController.php:1219
* @route '/superusuario/admin/vacation-payments'
*/
listVacationPaymentsb3ec670b11ae62023bf717913af3b68b.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listVacationPaymentsb3ec670b11ae62023bf717913af3b68b.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::listVacationPayments
* @see app/Http/Controllers/AdminController.php:1219
* @route '/superusuario/admin/vacation-payments'
*/
const listVacationPaymentsb3ec670b11ae62023bf717913af3b68bForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listVacationPaymentsb3ec670b11ae62023bf717913af3b68b.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listVacationPayments
* @see app/Http/Controllers/AdminController.php:1219
* @route '/superusuario/admin/vacation-payments'
*/
listVacationPaymentsb3ec670b11ae62023bf717913af3b68bForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listVacationPaymentsb3ec670b11ae62023bf717913af3b68b.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listVacationPayments
* @see app/Http/Controllers/AdminController.php:1219
* @route '/superusuario/admin/vacation-payments'
*/
listVacationPaymentsb3ec670b11ae62023bf717913af3b68bForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listVacationPaymentsb3ec670b11ae62023bf717913af3b68b.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

listVacationPaymentsb3ec670b11ae62023bf717913af3b68b.form = listVacationPaymentsb3ec670b11ae62023bf717913af3b68bForm

export const listVacationPayments = {
    '/administrativo/vacation-payments': listVacationPayments74641ab437ba6bcc6ce7519ba601c577,
    '/superusuario/admin/vacation-payments': listVacationPaymentsb3ec670b11ae62023bf717913af3b68b,
}

/**
* @see \App\Http\Controllers\AdminController::storeVacationPayment
* @see app/Http/Controllers/AdminController.php:1253
* @route '/administrativo/vacation-payments'
*/
const storeVacationPayment74641ab437ba6bcc6ce7519ba601c577 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeVacationPayment74641ab437ba6bcc6ce7519ba601c577.url(options),
    method: 'post',
})

storeVacationPayment74641ab437ba6bcc6ce7519ba601c577.definition = {
    methods: ["post"],
    url: '/administrativo/vacation-payments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storeVacationPayment
* @see app/Http/Controllers/AdminController.php:1253
* @route '/administrativo/vacation-payments'
*/
storeVacationPayment74641ab437ba6bcc6ce7519ba601c577.url = (options?: RouteQueryOptions) => {
    return storeVacationPayment74641ab437ba6bcc6ce7519ba601c577.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeVacationPayment
* @see app/Http/Controllers/AdminController.php:1253
* @route '/administrativo/vacation-payments'
*/
storeVacationPayment74641ab437ba6bcc6ce7519ba601c577.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeVacationPayment74641ab437ba6bcc6ce7519ba601c577.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::storeVacationPayment
* @see app/Http/Controllers/AdminController.php:1253
* @route '/administrativo/vacation-payments'
*/
const storeVacationPayment74641ab437ba6bcc6ce7519ba601c577Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeVacationPayment74641ab437ba6bcc6ce7519ba601c577.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::storeVacationPayment
* @see app/Http/Controllers/AdminController.php:1253
* @route '/administrativo/vacation-payments'
*/
storeVacationPayment74641ab437ba6bcc6ce7519ba601c577Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeVacationPayment74641ab437ba6bcc6ce7519ba601c577.url(options),
    method: 'post',
})

storeVacationPayment74641ab437ba6bcc6ce7519ba601c577.form = storeVacationPayment74641ab437ba6bcc6ce7519ba601c577Form
/**
* @see \App\Http\Controllers\AdminController::storeVacationPayment
* @see app/Http/Controllers/AdminController.php:1253
* @route '/superusuario/admin/vacation-payments'
*/
const storeVacationPaymentb3ec670b11ae62023bf717913af3b68b = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeVacationPaymentb3ec670b11ae62023bf717913af3b68b.url(options),
    method: 'post',
})

storeVacationPaymentb3ec670b11ae62023bf717913af3b68b.definition = {
    methods: ["post"],
    url: '/superusuario/admin/vacation-payments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storeVacationPayment
* @see app/Http/Controllers/AdminController.php:1253
* @route '/superusuario/admin/vacation-payments'
*/
storeVacationPaymentb3ec670b11ae62023bf717913af3b68b.url = (options?: RouteQueryOptions) => {
    return storeVacationPaymentb3ec670b11ae62023bf717913af3b68b.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeVacationPayment
* @see app/Http/Controllers/AdminController.php:1253
* @route '/superusuario/admin/vacation-payments'
*/
storeVacationPaymentb3ec670b11ae62023bf717913af3b68b.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeVacationPaymentb3ec670b11ae62023bf717913af3b68b.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::storeVacationPayment
* @see app/Http/Controllers/AdminController.php:1253
* @route '/superusuario/admin/vacation-payments'
*/
const storeVacationPaymentb3ec670b11ae62023bf717913af3b68bForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeVacationPaymentb3ec670b11ae62023bf717913af3b68b.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::storeVacationPayment
* @see app/Http/Controllers/AdminController.php:1253
* @route '/superusuario/admin/vacation-payments'
*/
storeVacationPaymentb3ec670b11ae62023bf717913af3b68bForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeVacationPaymentb3ec670b11ae62023bf717913af3b68b.url(options),
    method: 'post',
})

storeVacationPaymentb3ec670b11ae62023bf717913af3b68b.form = storeVacationPaymentb3ec670b11ae62023bf717913af3b68bForm

export const storeVacationPayment = {
    '/administrativo/vacation-payments': storeVacationPayment74641ab437ba6bcc6ce7519ba601c577,
    '/superusuario/admin/vacation-payments': storeVacationPaymentb3ec670b11ae62023bf717913af3b68b,
}

/**
* @see \App\Http\Controllers\AdminController::getPaidYears
* @see app/Http/Controllers/AdminController.php:1239
* @route '/administrativo/vacation-payments/paid-years/{workerId}'
*/
const getPaidYearsa85055d537fb0f4ff52cb45423e55b92 = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPaidYearsa85055d537fb0f4ff52cb45423e55b92.url(args, options),
    method: 'get',
})

getPaidYearsa85055d537fb0f4ff52cb45423e55b92.definition = {
    methods: ["get","head"],
    url: '/administrativo/vacation-payments/paid-years/{workerId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::getPaidYears
* @see app/Http/Controllers/AdminController.php:1239
* @route '/administrativo/vacation-payments/paid-years/{workerId}'
*/
getPaidYearsa85055d537fb0f4ff52cb45423e55b92.url = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getPaidYearsa85055d537fb0f4ff52cb45423e55b92.definition.url
            .replace('{workerId}', parsedArgs.workerId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::getPaidYears
* @see app/Http/Controllers/AdminController.php:1239
* @route '/administrativo/vacation-payments/paid-years/{workerId}'
*/
getPaidYearsa85055d537fb0f4ff52cb45423e55b92.get = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPaidYearsa85055d537fb0f4ff52cb45423e55b92.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::getPaidYears
* @see app/Http/Controllers/AdminController.php:1239
* @route '/administrativo/vacation-payments/paid-years/{workerId}'
*/
getPaidYearsa85055d537fb0f4ff52cb45423e55b92.head = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getPaidYearsa85055d537fb0f4ff52cb45423e55b92.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::getPaidYears
* @see app/Http/Controllers/AdminController.php:1239
* @route '/administrativo/vacation-payments/paid-years/{workerId}'
*/
const getPaidYearsa85055d537fb0f4ff52cb45423e55b92Form = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getPaidYearsa85055d537fb0f4ff52cb45423e55b92.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::getPaidYears
* @see app/Http/Controllers/AdminController.php:1239
* @route '/administrativo/vacation-payments/paid-years/{workerId}'
*/
getPaidYearsa85055d537fb0f4ff52cb45423e55b92Form.get = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getPaidYearsa85055d537fb0f4ff52cb45423e55b92.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::getPaidYears
* @see app/Http/Controllers/AdminController.php:1239
* @route '/administrativo/vacation-payments/paid-years/{workerId}'
*/
getPaidYearsa85055d537fb0f4ff52cb45423e55b92Form.head = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getPaidYearsa85055d537fb0f4ff52cb45423e55b92.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getPaidYearsa85055d537fb0f4ff52cb45423e55b92.form = getPaidYearsa85055d537fb0f4ff52cb45423e55b92Form
/**
* @see \App\Http\Controllers\AdminController::getPaidYears
* @see app/Http/Controllers/AdminController.php:1239
* @route '/superusuario/admin/vacation-payments/paid-years/{workerId}'
*/
const getPaidYears0a987b05cf39535534307bcb5d0a2f70 = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPaidYears0a987b05cf39535534307bcb5d0a2f70.url(args, options),
    method: 'get',
})

getPaidYears0a987b05cf39535534307bcb5d0a2f70.definition = {
    methods: ["get","head"],
    url: '/superusuario/admin/vacation-payments/paid-years/{workerId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::getPaidYears
* @see app/Http/Controllers/AdminController.php:1239
* @route '/superusuario/admin/vacation-payments/paid-years/{workerId}'
*/
getPaidYears0a987b05cf39535534307bcb5d0a2f70.url = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getPaidYears0a987b05cf39535534307bcb5d0a2f70.definition.url
            .replace('{workerId}', parsedArgs.workerId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::getPaidYears
* @see app/Http/Controllers/AdminController.php:1239
* @route '/superusuario/admin/vacation-payments/paid-years/{workerId}'
*/
getPaidYears0a987b05cf39535534307bcb5d0a2f70.get = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPaidYears0a987b05cf39535534307bcb5d0a2f70.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::getPaidYears
* @see app/Http/Controllers/AdminController.php:1239
* @route '/superusuario/admin/vacation-payments/paid-years/{workerId}'
*/
getPaidYears0a987b05cf39535534307bcb5d0a2f70.head = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getPaidYears0a987b05cf39535534307bcb5d0a2f70.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::getPaidYears
* @see app/Http/Controllers/AdminController.php:1239
* @route '/superusuario/admin/vacation-payments/paid-years/{workerId}'
*/
const getPaidYears0a987b05cf39535534307bcb5d0a2f70Form = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getPaidYears0a987b05cf39535534307bcb5d0a2f70.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::getPaidYears
* @see app/Http/Controllers/AdminController.php:1239
* @route '/superusuario/admin/vacation-payments/paid-years/{workerId}'
*/
getPaidYears0a987b05cf39535534307bcb5d0a2f70Form.get = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getPaidYears0a987b05cf39535534307bcb5d0a2f70.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::getPaidYears
* @see app/Http/Controllers/AdminController.php:1239
* @route '/superusuario/admin/vacation-payments/paid-years/{workerId}'
*/
getPaidYears0a987b05cf39535534307bcb5d0a2f70Form.head = (args: { workerId: string | number } | [workerId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getPaidYears0a987b05cf39535534307bcb5d0a2f70.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getPaidYears0a987b05cf39535534307bcb5d0a2f70.form = getPaidYears0a987b05cf39535534307bcb5d0a2f70Form

export const getPaidYears = {
    '/administrativo/vacation-payments/paid-years/{workerId}': getPaidYearsa85055d537fb0f4ff52cb45423e55b92,
    '/superusuario/admin/vacation-payments/paid-years/{workerId}': getPaidYears0a987b05cf39535534307bcb5d0a2f70,
}

/**
* @see \App\Http\Controllers\AdminController::showVacationPayslip
* @see app/Http/Controllers/AdminController.php:1316
* @route '/administrativo/vacation-payments/payslip/{id}'
*/
const showVacationPayslipa91f170e41e767720213870209afd058 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showVacationPayslipa91f170e41e767720213870209afd058.url(args, options),
    method: 'get',
})

showVacationPayslipa91f170e41e767720213870209afd058.definition = {
    methods: ["get","head"],
    url: '/administrativo/vacation-payments/payslip/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::showVacationPayslip
* @see app/Http/Controllers/AdminController.php:1316
* @route '/administrativo/vacation-payments/payslip/{id}'
*/
showVacationPayslipa91f170e41e767720213870209afd058.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return showVacationPayslipa91f170e41e767720213870209afd058.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::showVacationPayslip
* @see app/Http/Controllers/AdminController.php:1316
* @route '/administrativo/vacation-payments/payslip/{id}'
*/
showVacationPayslipa91f170e41e767720213870209afd058.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showVacationPayslipa91f170e41e767720213870209afd058.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::showVacationPayslip
* @see app/Http/Controllers/AdminController.php:1316
* @route '/administrativo/vacation-payments/payslip/{id}'
*/
showVacationPayslipa91f170e41e767720213870209afd058.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showVacationPayslipa91f170e41e767720213870209afd058.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::showVacationPayslip
* @see app/Http/Controllers/AdminController.php:1316
* @route '/administrativo/vacation-payments/payslip/{id}'
*/
const showVacationPayslipa91f170e41e767720213870209afd058Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showVacationPayslipa91f170e41e767720213870209afd058.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::showVacationPayslip
* @see app/Http/Controllers/AdminController.php:1316
* @route '/administrativo/vacation-payments/payslip/{id}'
*/
showVacationPayslipa91f170e41e767720213870209afd058Form.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showVacationPayslipa91f170e41e767720213870209afd058.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::showVacationPayslip
* @see app/Http/Controllers/AdminController.php:1316
* @route '/administrativo/vacation-payments/payslip/{id}'
*/
showVacationPayslipa91f170e41e767720213870209afd058Form.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showVacationPayslipa91f170e41e767720213870209afd058.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showVacationPayslipa91f170e41e767720213870209afd058.form = showVacationPayslipa91f170e41e767720213870209afd058Form
/**
* @see \App\Http\Controllers\AdminController::showVacationPayslip
* @see app/Http/Controllers/AdminController.php:1316
* @route '/superusuario/admin/vacation-payments/payslip/{id}'
*/
const showVacationPayslip6a3bb374acae73e4c36270767ccb463b = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showVacationPayslip6a3bb374acae73e4c36270767ccb463b.url(args, options),
    method: 'get',
})

showVacationPayslip6a3bb374acae73e4c36270767ccb463b.definition = {
    methods: ["get","head"],
    url: '/superusuario/admin/vacation-payments/payslip/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::showVacationPayslip
* @see app/Http/Controllers/AdminController.php:1316
* @route '/superusuario/admin/vacation-payments/payslip/{id}'
*/
showVacationPayslip6a3bb374acae73e4c36270767ccb463b.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return showVacationPayslip6a3bb374acae73e4c36270767ccb463b.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::showVacationPayslip
* @see app/Http/Controllers/AdminController.php:1316
* @route '/superusuario/admin/vacation-payments/payslip/{id}'
*/
showVacationPayslip6a3bb374acae73e4c36270767ccb463b.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showVacationPayslip6a3bb374acae73e4c36270767ccb463b.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::showVacationPayslip
* @see app/Http/Controllers/AdminController.php:1316
* @route '/superusuario/admin/vacation-payments/payslip/{id}'
*/
showVacationPayslip6a3bb374acae73e4c36270767ccb463b.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showVacationPayslip6a3bb374acae73e4c36270767ccb463b.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::showVacationPayslip
* @see app/Http/Controllers/AdminController.php:1316
* @route '/superusuario/admin/vacation-payments/payslip/{id}'
*/
const showVacationPayslip6a3bb374acae73e4c36270767ccb463bForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showVacationPayslip6a3bb374acae73e4c36270767ccb463b.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::showVacationPayslip
* @see app/Http/Controllers/AdminController.php:1316
* @route '/superusuario/admin/vacation-payments/payslip/{id}'
*/
showVacationPayslip6a3bb374acae73e4c36270767ccb463bForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showVacationPayslip6a3bb374acae73e4c36270767ccb463b.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::showVacationPayslip
* @see app/Http/Controllers/AdminController.php:1316
* @route '/superusuario/admin/vacation-payments/payslip/{id}'
*/
showVacationPayslip6a3bb374acae73e4c36270767ccb463bForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showVacationPayslip6a3bb374acae73e4c36270767ccb463b.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showVacationPayslip6a3bb374acae73e4c36270767ccb463b.form = showVacationPayslip6a3bb374acae73e4c36270767ccb463bForm

export const showVacationPayslip = {
    '/administrativo/vacation-payments/payslip/{id}': showVacationPayslipa91f170e41e767720213870209afd058,
    '/superusuario/admin/vacation-payments/payslip/{id}': showVacationPayslip6a3bb374acae73e4c36270767ccb463b,
}

/**
* @see \App\Http\Controllers\AdminController::updateVacationPaymentStatus
* @see app/Http/Controllers/AdminController.php:1419
* @route '/administrativo/vacation-payments/{id}/status'
*/
const updateVacationPaymentStatus39a4ad16a60f323b09f7decf05cdf567 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateVacationPaymentStatus39a4ad16a60f323b09f7decf05cdf567.url(args, options),
    method: 'post',
})

updateVacationPaymentStatus39a4ad16a60f323b09f7decf05cdf567.definition = {
    methods: ["post"],
    url: '/administrativo/vacation-payments/{id}/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updateVacationPaymentStatus
* @see app/Http/Controllers/AdminController.php:1419
* @route '/administrativo/vacation-payments/{id}/status'
*/
updateVacationPaymentStatus39a4ad16a60f323b09f7decf05cdf567.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateVacationPaymentStatus39a4ad16a60f323b09f7decf05cdf567.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateVacationPaymentStatus
* @see app/Http/Controllers/AdminController.php:1419
* @route '/administrativo/vacation-payments/{id}/status'
*/
updateVacationPaymentStatus39a4ad16a60f323b09f7decf05cdf567.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateVacationPaymentStatus39a4ad16a60f323b09f7decf05cdf567.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateVacationPaymentStatus
* @see app/Http/Controllers/AdminController.php:1419
* @route '/administrativo/vacation-payments/{id}/status'
*/
const updateVacationPaymentStatus39a4ad16a60f323b09f7decf05cdf567Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateVacationPaymentStatus39a4ad16a60f323b09f7decf05cdf567.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateVacationPaymentStatus
* @see app/Http/Controllers/AdminController.php:1419
* @route '/administrativo/vacation-payments/{id}/status'
*/
updateVacationPaymentStatus39a4ad16a60f323b09f7decf05cdf567Form.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateVacationPaymentStatus39a4ad16a60f323b09f7decf05cdf567.url(args, options),
    method: 'post',
})

updateVacationPaymentStatus39a4ad16a60f323b09f7decf05cdf567.form = updateVacationPaymentStatus39a4ad16a60f323b09f7decf05cdf567Form
/**
* @see \App\Http\Controllers\AdminController::updateVacationPaymentStatus
* @see app/Http/Controllers/AdminController.php:1419
* @route '/superusuario/admin/vacation-payments/{id}/status'
*/
const updateVacationPaymentStatusd6b9a218f67650abd566c297d1da92f9 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateVacationPaymentStatusd6b9a218f67650abd566c297d1da92f9.url(args, options),
    method: 'post',
})

updateVacationPaymentStatusd6b9a218f67650abd566c297d1da92f9.definition = {
    methods: ["post"],
    url: '/superusuario/admin/vacation-payments/{id}/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updateVacationPaymentStatus
* @see app/Http/Controllers/AdminController.php:1419
* @route '/superusuario/admin/vacation-payments/{id}/status'
*/
updateVacationPaymentStatusd6b9a218f67650abd566c297d1da92f9.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateVacationPaymentStatusd6b9a218f67650abd566c297d1da92f9.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateVacationPaymentStatus
* @see app/Http/Controllers/AdminController.php:1419
* @route '/superusuario/admin/vacation-payments/{id}/status'
*/
updateVacationPaymentStatusd6b9a218f67650abd566c297d1da92f9.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateVacationPaymentStatusd6b9a218f67650abd566c297d1da92f9.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateVacationPaymentStatus
* @see app/Http/Controllers/AdminController.php:1419
* @route '/superusuario/admin/vacation-payments/{id}/status'
*/
const updateVacationPaymentStatusd6b9a218f67650abd566c297d1da92f9Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateVacationPaymentStatusd6b9a218f67650abd566c297d1da92f9.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateVacationPaymentStatus
* @see app/Http/Controllers/AdminController.php:1419
* @route '/superusuario/admin/vacation-payments/{id}/status'
*/
updateVacationPaymentStatusd6b9a218f67650abd566c297d1da92f9Form.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateVacationPaymentStatusd6b9a218f67650abd566c297d1da92f9.url(args, options),
    method: 'post',
})

updateVacationPaymentStatusd6b9a218f67650abd566c297d1da92f9.form = updateVacationPaymentStatusd6b9a218f67650abd566c297d1da92f9Form

export const updateVacationPaymentStatus = {
    '/administrativo/vacation-payments/{id}/status': updateVacationPaymentStatus39a4ad16a60f323b09f7decf05cdf567,
    '/superusuario/admin/vacation-payments/{id}/status': updateVacationPaymentStatusd6b9a218f67650abd566c297d1da92f9,
}

/**
* @see \App\Http\Controllers\AdminController::listPermissionRequests
* @see app/Http/Controllers/AdminController.php:1478
* @route '/administrativo/permission-requests'
*/
const listPermissionRequests75e4b341b2d2408e178f2059b0377421 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listPermissionRequests75e4b341b2d2408e178f2059b0377421.url(options),
    method: 'get',
})

listPermissionRequests75e4b341b2d2408e178f2059b0377421.definition = {
    methods: ["get","head"],
    url: '/administrativo/permission-requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listPermissionRequests
* @see app/Http/Controllers/AdminController.php:1478
* @route '/administrativo/permission-requests'
*/
listPermissionRequests75e4b341b2d2408e178f2059b0377421.url = (options?: RouteQueryOptions) => {
    return listPermissionRequests75e4b341b2d2408e178f2059b0377421.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listPermissionRequests
* @see app/Http/Controllers/AdminController.php:1478
* @route '/administrativo/permission-requests'
*/
listPermissionRequests75e4b341b2d2408e178f2059b0377421.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listPermissionRequests75e4b341b2d2408e178f2059b0377421.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listPermissionRequests
* @see app/Http/Controllers/AdminController.php:1478
* @route '/administrativo/permission-requests'
*/
listPermissionRequests75e4b341b2d2408e178f2059b0377421.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listPermissionRequests75e4b341b2d2408e178f2059b0377421.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::listPermissionRequests
* @see app/Http/Controllers/AdminController.php:1478
* @route '/administrativo/permission-requests'
*/
const listPermissionRequests75e4b341b2d2408e178f2059b0377421Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listPermissionRequests75e4b341b2d2408e178f2059b0377421.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listPermissionRequests
* @see app/Http/Controllers/AdminController.php:1478
* @route '/administrativo/permission-requests'
*/
listPermissionRequests75e4b341b2d2408e178f2059b0377421Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listPermissionRequests75e4b341b2d2408e178f2059b0377421.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listPermissionRequests
* @see app/Http/Controllers/AdminController.php:1478
* @route '/administrativo/permission-requests'
*/
listPermissionRequests75e4b341b2d2408e178f2059b0377421Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listPermissionRequests75e4b341b2d2408e178f2059b0377421.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

listPermissionRequests75e4b341b2d2408e178f2059b0377421.form = listPermissionRequests75e4b341b2d2408e178f2059b0377421Form
/**
* @see \App\Http\Controllers\AdminController::listPermissionRequests
* @see app/Http/Controllers/AdminController.php:1478
* @route '/superusuario/admin/permission-requests'
*/
const listPermissionRequests119c4dfb39e78a178f6cd07ebf5af2d3 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listPermissionRequests119c4dfb39e78a178f6cd07ebf5af2d3.url(options),
    method: 'get',
})

listPermissionRequests119c4dfb39e78a178f6cd07ebf5af2d3.definition = {
    methods: ["get","head"],
    url: '/superusuario/admin/permission-requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listPermissionRequests
* @see app/Http/Controllers/AdminController.php:1478
* @route '/superusuario/admin/permission-requests'
*/
listPermissionRequests119c4dfb39e78a178f6cd07ebf5af2d3.url = (options?: RouteQueryOptions) => {
    return listPermissionRequests119c4dfb39e78a178f6cd07ebf5af2d3.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listPermissionRequests
* @see app/Http/Controllers/AdminController.php:1478
* @route '/superusuario/admin/permission-requests'
*/
listPermissionRequests119c4dfb39e78a178f6cd07ebf5af2d3.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listPermissionRequests119c4dfb39e78a178f6cd07ebf5af2d3.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listPermissionRequests
* @see app/Http/Controllers/AdminController.php:1478
* @route '/superusuario/admin/permission-requests'
*/
listPermissionRequests119c4dfb39e78a178f6cd07ebf5af2d3.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listPermissionRequests119c4dfb39e78a178f6cd07ebf5af2d3.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::listPermissionRequests
* @see app/Http/Controllers/AdminController.php:1478
* @route '/superusuario/admin/permission-requests'
*/
const listPermissionRequests119c4dfb39e78a178f6cd07ebf5af2d3Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listPermissionRequests119c4dfb39e78a178f6cd07ebf5af2d3.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listPermissionRequests
* @see app/Http/Controllers/AdminController.php:1478
* @route '/superusuario/admin/permission-requests'
*/
listPermissionRequests119c4dfb39e78a178f6cd07ebf5af2d3Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listPermissionRequests119c4dfb39e78a178f6cd07ebf5af2d3.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listPermissionRequests
* @see app/Http/Controllers/AdminController.php:1478
* @route '/superusuario/admin/permission-requests'
*/
listPermissionRequests119c4dfb39e78a178f6cd07ebf5af2d3Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listPermissionRequests119c4dfb39e78a178f6cd07ebf5af2d3.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

listPermissionRequests119c4dfb39e78a178f6cd07ebf5af2d3.form = listPermissionRequests119c4dfb39e78a178f6cd07ebf5af2d3Form

export const listPermissionRequests = {
    '/administrativo/permission-requests': listPermissionRequests75e4b341b2d2408e178f2059b0377421,
    '/superusuario/admin/permission-requests': listPermissionRequests119c4dfb39e78a178f6cd07ebf5af2d3,
}

/**
* @see \App\Http\Controllers\AdminController::updatePermissionRequestStatus
* @see app/Http/Controllers/AdminController.php:1510
* @route '/administrativo/permission-requests/{id}/status'
*/
const updatePermissionRequestStatus176537aea248cee03c1541080efc1e09 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePermissionRequestStatus176537aea248cee03c1541080efc1e09.url(args, options),
    method: 'post',
})

updatePermissionRequestStatus176537aea248cee03c1541080efc1e09.definition = {
    methods: ["post"],
    url: '/administrativo/permission-requests/{id}/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updatePermissionRequestStatus
* @see app/Http/Controllers/AdminController.php:1510
* @route '/administrativo/permission-requests/{id}/status'
*/
updatePermissionRequestStatus176537aea248cee03c1541080efc1e09.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updatePermissionRequestStatus176537aea248cee03c1541080efc1e09.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updatePermissionRequestStatus
* @see app/Http/Controllers/AdminController.php:1510
* @route '/administrativo/permission-requests/{id}/status'
*/
updatePermissionRequestStatus176537aea248cee03c1541080efc1e09.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePermissionRequestStatus176537aea248cee03c1541080efc1e09.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updatePermissionRequestStatus
* @see app/Http/Controllers/AdminController.php:1510
* @route '/administrativo/permission-requests/{id}/status'
*/
const updatePermissionRequestStatus176537aea248cee03c1541080efc1e09Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePermissionRequestStatus176537aea248cee03c1541080efc1e09.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updatePermissionRequestStatus
* @see app/Http/Controllers/AdminController.php:1510
* @route '/administrativo/permission-requests/{id}/status'
*/
updatePermissionRequestStatus176537aea248cee03c1541080efc1e09Form.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePermissionRequestStatus176537aea248cee03c1541080efc1e09.url(args, options),
    method: 'post',
})

updatePermissionRequestStatus176537aea248cee03c1541080efc1e09.form = updatePermissionRequestStatus176537aea248cee03c1541080efc1e09Form
/**
* @see \App\Http\Controllers\AdminController::updatePermissionRequestStatus
* @see app/Http/Controllers/AdminController.php:1510
* @route '/superusuario/admin/permission-requests/{id}/status'
*/
const updatePermissionRequestStatusdf854307cc9f29cda76f8b230b1f626e = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePermissionRequestStatusdf854307cc9f29cda76f8b230b1f626e.url(args, options),
    method: 'post',
})

updatePermissionRequestStatusdf854307cc9f29cda76f8b230b1f626e.definition = {
    methods: ["post"],
    url: '/superusuario/admin/permission-requests/{id}/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updatePermissionRequestStatus
* @see app/Http/Controllers/AdminController.php:1510
* @route '/superusuario/admin/permission-requests/{id}/status'
*/
updatePermissionRequestStatusdf854307cc9f29cda76f8b230b1f626e.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updatePermissionRequestStatusdf854307cc9f29cda76f8b230b1f626e.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updatePermissionRequestStatus
* @see app/Http/Controllers/AdminController.php:1510
* @route '/superusuario/admin/permission-requests/{id}/status'
*/
updatePermissionRequestStatusdf854307cc9f29cda76f8b230b1f626e.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePermissionRequestStatusdf854307cc9f29cda76f8b230b1f626e.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updatePermissionRequestStatus
* @see app/Http/Controllers/AdminController.php:1510
* @route '/superusuario/admin/permission-requests/{id}/status'
*/
const updatePermissionRequestStatusdf854307cc9f29cda76f8b230b1f626eForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePermissionRequestStatusdf854307cc9f29cda76f8b230b1f626e.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updatePermissionRequestStatus
* @see app/Http/Controllers/AdminController.php:1510
* @route '/superusuario/admin/permission-requests/{id}/status'
*/
updatePermissionRequestStatusdf854307cc9f29cda76f8b230b1f626eForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePermissionRequestStatusdf854307cc9f29cda76f8b230b1f626e.url(args, options),
    method: 'post',
})

updatePermissionRequestStatusdf854307cc9f29cda76f8b230b1f626e.form = updatePermissionRequestStatusdf854307cc9f29cda76f8b230b1f626eForm

export const updatePermissionRequestStatus = {
    '/administrativo/permission-requests/{id}/status': updatePermissionRequestStatus176537aea248cee03c1541080efc1e09,
    '/superusuario/admin/permission-requests/{id}/status': updatePermissionRequestStatusdf854307cc9f29cda76f8b230b1f626e,
}

/**
* @see \App\Http\Controllers\AdminController::listTypesNomina
* @see app/Http/Controllers/AdminController.php:296
* @route '/administrativo/types-nomina'
*/
const listTypesNomina8455bac953a7877fee3d8793c1650259 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listTypesNomina8455bac953a7877fee3d8793c1650259.url(options),
    method: 'get',
})

listTypesNomina8455bac953a7877fee3d8793c1650259.definition = {
    methods: ["get","head"],
    url: '/administrativo/types-nomina',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listTypesNomina
* @see app/Http/Controllers/AdminController.php:296
* @route '/administrativo/types-nomina'
*/
listTypesNomina8455bac953a7877fee3d8793c1650259.url = (options?: RouteQueryOptions) => {
    return listTypesNomina8455bac953a7877fee3d8793c1650259.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listTypesNomina
* @see app/Http/Controllers/AdminController.php:296
* @route '/administrativo/types-nomina'
*/
listTypesNomina8455bac953a7877fee3d8793c1650259.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listTypesNomina8455bac953a7877fee3d8793c1650259.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listTypesNomina
* @see app/Http/Controllers/AdminController.php:296
* @route '/administrativo/types-nomina'
*/
listTypesNomina8455bac953a7877fee3d8793c1650259.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listTypesNomina8455bac953a7877fee3d8793c1650259.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::listTypesNomina
* @see app/Http/Controllers/AdminController.php:296
* @route '/administrativo/types-nomina'
*/
const listTypesNomina8455bac953a7877fee3d8793c1650259Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listTypesNomina8455bac953a7877fee3d8793c1650259.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listTypesNomina
* @see app/Http/Controllers/AdminController.php:296
* @route '/administrativo/types-nomina'
*/
listTypesNomina8455bac953a7877fee3d8793c1650259Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listTypesNomina8455bac953a7877fee3d8793c1650259.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listTypesNomina
* @see app/Http/Controllers/AdminController.php:296
* @route '/administrativo/types-nomina'
*/
listTypesNomina8455bac953a7877fee3d8793c1650259Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listTypesNomina8455bac953a7877fee3d8793c1650259.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

listTypesNomina8455bac953a7877fee3d8793c1650259.form = listTypesNomina8455bac953a7877fee3d8793c1650259Form
/**
* @see \App\Http\Controllers\AdminController::listTypesNomina
* @see app/Http/Controllers/AdminController.php:296
* @route '/superusuario/admin/types-nomina'
*/
const listTypesNomina6f31893f81d7644fcc34073578f1b6fc = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listTypesNomina6f31893f81d7644fcc34073578f1b6fc.url(options),
    method: 'get',
})

listTypesNomina6f31893f81d7644fcc34073578f1b6fc.definition = {
    methods: ["get","head"],
    url: '/superusuario/admin/types-nomina',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listTypesNomina
* @see app/Http/Controllers/AdminController.php:296
* @route '/superusuario/admin/types-nomina'
*/
listTypesNomina6f31893f81d7644fcc34073578f1b6fc.url = (options?: RouteQueryOptions) => {
    return listTypesNomina6f31893f81d7644fcc34073578f1b6fc.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listTypesNomina
* @see app/Http/Controllers/AdminController.php:296
* @route '/superusuario/admin/types-nomina'
*/
listTypesNomina6f31893f81d7644fcc34073578f1b6fc.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listTypesNomina6f31893f81d7644fcc34073578f1b6fc.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listTypesNomina
* @see app/Http/Controllers/AdminController.php:296
* @route '/superusuario/admin/types-nomina'
*/
listTypesNomina6f31893f81d7644fcc34073578f1b6fc.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listTypesNomina6f31893f81d7644fcc34073578f1b6fc.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::listTypesNomina
* @see app/Http/Controllers/AdminController.php:296
* @route '/superusuario/admin/types-nomina'
*/
const listTypesNomina6f31893f81d7644fcc34073578f1b6fcForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listTypesNomina6f31893f81d7644fcc34073578f1b6fc.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listTypesNomina
* @see app/Http/Controllers/AdminController.php:296
* @route '/superusuario/admin/types-nomina'
*/
listTypesNomina6f31893f81d7644fcc34073578f1b6fcForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listTypesNomina6f31893f81d7644fcc34073578f1b6fc.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listTypesNomina
* @see app/Http/Controllers/AdminController.php:296
* @route '/superusuario/admin/types-nomina'
*/
listTypesNomina6f31893f81d7644fcc34073578f1b6fcForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listTypesNomina6f31893f81d7644fcc34073578f1b6fc.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

listTypesNomina6f31893f81d7644fcc34073578f1b6fc.form = listTypesNomina6f31893f81d7644fcc34073578f1b6fcForm

export const listTypesNomina = {
    '/administrativo/types-nomina': listTypesNomina8455bac953a7877fee3d8793c1650259,
    '/superusuario/admin/types-nomina': listTypesNomina6f31893f81d7644fcc34073578f1b6fc,
}

/**
* @see \App\Http\Controllers\AdminController::storeTypeNomina
* @see app/Http/Controllers/AdminController.php:301
* @route '/administrativo/types-nomina'
*/
const storeTypeNomina8455bac953a7877fee3d8793c1650259 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTypeNomina8455bac953a7877fee3d8793c1650259.url(options),
    method: 'post',
})

storeTypeNomina8455bac953a7877fee3d8793c1650259.definition = {
    methods: ["post"],
    url: '/administrativo/types-nomina',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storeTypeNomina
* @see app/Http/Controllers/AdminController.php:301
* @route '/administrativo/types-nomina'
*/
storeTypeNomina8455bac953a7877fee3d8793c1650259.url = (options?: RouteQueryOptions) => {
    return storeTypeNomina8455bac953a7877fee3d8793c1650259.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeTypeNomina
* @see app/Http/Controllers/AdminController.php:301
* @route '/administrativo/types-nomina'
*/
storeTypeNomina8455bac953a7877fee3d8793c1650259.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTypeNomina8455bac953a7877fee3d8793c1650259.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::storeTypeNomina
* @see app/Http/Controllers/AdminController.php:301
* @route '/administrativo/types-nomina'
*/
const storeTypeNomina8455bac953a7877fee3d8793c1650259Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeTypeNomina8455bac953a7877fee3d8793c1650259.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::storeTypeNomina
* @see app/Http/Controllers/AdminController.php:301
* @route '/administrativo/types-nomina'
*/
storeTypeNomina8455bac953a7877fee3d8793c1650259Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeTypeNomina8455bac953a7877fee3d8793c1650259.url(options),
    method: 'post',
})

storeTypeNomina8455bac953a7877fee3d8793c1650259.form = storeTypeNomina8455bac953a7877fee3d8793c1650259Form
/**
* @see \App\Http\Controllers\AdminController::storeTypeNomina
* @see app/Http/Controllers/AdminController.php:301
* @route '/superusuario/admin/types-nomina'
*/
const storeTypeNomina6f31893f81d7644fcc34073578f1b6fc = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTypeNomina6f31893f81d7644fcc34073578f1b6fc.url(options),
    method: 'post',
})

storeTypeNomina6f31893f81d7644fcc34073578f1b6fc.definition = {
    methods: ["post"],
    url: '/superusuario/admin/types-nomina',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storeTypeNomina
* @see app/Http/Controllers/AdminController.php:301
* @route '/superusuario/admin/types-nomina'
*/
storeTypeNomina6f31893f81d7644fcc34073578f1b6fc.url = (options?: RouteQueryOptions) => {
    return storeTypeNomina6f31893f81d7644fcc34073578f1b6fc.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeTypeNomina
* @see app/Http/Controllers/AdminController.php:301
* @route '/superusuario/admin/types-nomina'
*/
storeTypeNomina6f31893f81d7644fcc34073578f1b6fc.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTypeNomina6f31893f81d7644fcc34073578f1b6fc.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::storeTypeNomina
* @see app/Http/Controllers/AdminController.php:301
* @route '/superusuario/admin/types-nomina'
*/
const storeTypeNomina6f31893f81d7644fcc34073578f1b6fcForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeTypeNomina6f31893f81d7644fcc34073578f1b6fc.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::storeTypeNomina
* @see app/Http/Controllers/AdminController.php:301
* @route '/superusuario/admin/types-nomina'
*/
storeTypeNomina6f31893f81d7644fcc34073578f1b6fcForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeTypeNomina6f31893f81d7644fcc34073578f1b6fc.url(options),
    method: 'post',
})

storeTypeNomina6f31893f81d7644fcc34073578f1b6fc.form = storeTypeNomina6f31893f81d7644fcc34073578f1b6fcForm

export const storeTypeNomina = {
    '/administrativo/types-nomina': storeTypeNomina8455bac953a7877fee3d8793c1650259,
    '/superusuario/admin/types-nomina': storeTypeNomina6f31893f81d7644fcc34073578f1b6fc,
}

/**
* @see \App\Http\Controllers\AdminController::updateTypeNomina
* @see app/Http/Controllers/AdminController.php:322
* @route '/administrativo/types-nomina/{id}'
*/
const updateTypeNomina14e6fdaf10fcf1966659eb104a082931 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateTypeNomina14e6fdaf10fcf1966659eb104a082931.url(args, options),
    method: 'post',
})

updateTypeNomina14e6fdaf10fcf1966659eb104a082931.definition = {
    methods: ["post"],
    url: '/administrativo/types-nomina/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updateTypeNomina
* @see app/Http/Controllers/AdminController.php:322
* @route '/administrativo/types-nomina/{id}'
*/
updateTypeNomina14e6fdaf10fcf1966659eb104a082931.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateTypeNomina14e6fdaf10fcf1966659eb104a082931.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateTypeNomina
* @see app/Http/Controllers/AdminController.php:322
* @route '/administrativo/types-nomina/{id}'
*/
updateTypeNomina14e6fdaf10fcf1966659eb104a082931.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateTypeNomina14e6fdaf10fcf1966659eb104a082931.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateTypeNomina
* @see app/Http/Controllers/AdminController.php:322
* @route '/administrativo/types-nomina/{id}'
*/
const updateTypeNomina14e6fdaf10fcf1966659eb104a082931Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateTypeNomina14e6fdaf10fcf1966659eb104a082931.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateTypeNomina
* @see app/Http/Controllers/AdminController.php:322
* @route '/administrativo/types-nomina/{id}'
*/
updateTypeNomina14e6fdaf10fcf1966659eb104a082931Form.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateTypeNomina14e6fdaf10fcf1966659eb104a082931.url(args, options),
    method: 'post',
})

updateTypeNomina14e6fdaf10fcf1966659eb104a082931.form = updateTypeNomina14e6fdaf10fcf1966659eb104a082931Form
/**
* @see \App\Http\Controllers\AdminController::updateTypeNomina
* @see app/Http/Controllers/AdminController.php:322
* @route '/superusuario/admin/types-nomina/{id}'
*/
const updateTypeNomina76154b725f8445ca1c75401fb274f424 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateTypeNomina76154b725f8445ca1c75401fb274f424.url(args, options),
    method: 'post',
})

updateTypeNomina76154b725f8445ca1c75401fb274f424.definition = {
    methods: ["post"],
    url: '/superusuario/admin/types-nomina/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updateTypeNomina
* @see app/Http/Controllers/AdminController.php:322
* @route '/superusuario/admin/types-nomina/{id}'
*/
updateTypeNomina76154b725f8445ca1c75401fb274f424.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateTypeNomina76154b725f8445ca1c75401fb274f424.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateTypeNomina
* @see app/Http/Controllers/AdminController.php:322
* @route '/superusuario/admin/types-nomina/{id}'
*/
updateTypeNomina76154b725f8445ca1c75401fb274f424.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateTypeNomina76154b725f8445ca1c75401fb274f424.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateTypeNomina
* @see app/Http/Controllers/AdminController.php:322
* @route '/superusuario/admin/types-nomina/{id}'
*/
const updateTypeNomina76154b725f8445ca1c75401fb274f424Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateTypeNomina76154b725f8445ca1c75401fb274f424.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateTypeNomina
* @see app/Http/Controllers/AdminController.php:322
* @route '/superusuario/admin/types-nomina/{id}'
*/
updateTypeNomina76154b725f8445ca1c75401fb274f424Form.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateTypeNomina76154b725f8445ca1c75401fb274f424.url(args, options),
    method: 'post',
})

updateTypeNomina76154b725f8445ca1c75401fb274f424.form = updateTypeNomina76154b725f8445ca1c75401fb274f424Form

export const updateTypeNomina = {
    '/administrativo/types-nomina/{id}': updateTypeNomina14e6fdaf10fcf1966659eb104a082931,
    '/superusuario/admin/types-nomina/{id}': updateTypeNomina76154b725f8445ca1c75401fb274f424,
}

/**
* @see \App\Http\Controllers\AdminController::toggleTypeNominaStatus
* @see app/Http/Controllers/AdminController.php:340
* @route '/administrativo/types-nomina/{id}/toggle'
*/
const toggleTypeNominaStatus5b75ecd75a3429a391113c69467acd63 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleTypeNominaStatus5b75ecd75a3429a391113c69467acd63.url(args, options),
    method: 'post',
})

toggleTypeNominaStatus5b75ecd75a3429a391113c69467acd63.definition = {
    methods: ["post"],
    url: '/administrativo/types-nomina/{id}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::toggleTypeNominaStatus
* @see app/Http/Controllers/AdminController.php:340
* @route '/administrativo/types-nomina/{id}/toggle'
*/
toggleTypeNominaStatus5b75ecd75a3429a391113c69467acd63.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleTypeNominaStatus5b75ecd75a3429a391113c69467acd63.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::toggleTypeNominaStatus
* @see app/Http/Controllers/AdminController.php:340
* @route '/administrativo/types-nomina/{id}/toggle'
*/
toggleTypeNominaStatus5b75ecd75a3429a391113c69467acd63.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleTypeNominaStatus5b75ecd75a3429a391113c69467acd63.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::toggleTypeNominaStatus
* @see app/Http/Controllers/AdminController.php:340
* @route '/administrativo/types-nomina/{id}/toggle'
*/
const toggleTypeNominaStatus5b75ecd75a3429a391113c69467acd63Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleTypeNominaStatus5b75ecd75a3429a391113c69467acd63.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::toggleTypeNominaStatus
* @see app/Http/Controllers/AdminController.php:340
* @route '/administrativo/types-nomina/{id}/toggle'
*/
toggleTypeNominaStatus5b75ecd75a3429a391113c69467acd63Form.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleTypeNominaStatus5b75ecd75a3429a391113c69467acd63.url(args, options),
    method: 'post',
})

toggleTypeNominaStatus5b75ecd75a3429a391113c69467acd63.form = toggleTypeNominaStatus5b75ecd75a3429a391113c69467acd63Form
/**
* @see \App\Http\Controllers\AdminController::toggleTypeNominaStatus
* @see app/Http/Controllers/AdminController.php:340
* @route '/superusuario/admin/types-nomina/{id}/toggle'
*/
const toggleTypeNominaStatusf2ac825250909fcd46e1c86fe562d051 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleTypeNominaStatusf2ac825250909fcd46e1c86fe562d051.url(args, options),
    method: 'post',
})

toggleTypeNominaStatusf2ac825250909fcd46e1c86fe562d051.definition = {
    methods: ["post"],
    url: '/superusuario/admin/types-nomina/{id}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::toggleTypeNominaStatus
* @see app/Http/Controllers/AdminController.php:340
* @route '/superusuario/admin/types-nomina/{id}/toggle'
*/
toggleTypeNominaStatusf2ac825250909fcd46e1c86fe562d051.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleTypeNominaStatusf2ac825250909fcd46e1c86fe562d051.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::toggleTypeNominaStatus
* @see app/Http/Controllers/AdminController.php:340
* @route '/superusuario/admin/types-nomina/{id}/toggle'
*/
toggleTypeNominaStatusf2ac825250909fcd46e1c86fe562d051.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleTypeNominaStatusf2ac825250909fcd46e1c86fe562d051.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::toggleTypeNominaStatus
* @see app/Http/Controllers/AdminController.php:340
* @route '/superusuario/admin/types-nomina/{id}/toggle'
*/
const toggleTypeNominaStatusf2ac825250909fcd46e1c86fe562d051Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleTypeNominaStatusf2ac825250909fcd46e1c86fe562d051.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::toggleTypeNominaStatus
* @see app/Http/Controllers/AdminController.php:340
* @route '/superusuario/admin/types-nomina/{id}/toggle'
*/
toggleTypeNominaStatusf2ac825250909fcd46e1c86fe562d051Form.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleTypeNominaStatusf2ac825250909fcd46e1c86fe562d051.url(args, options),
    method: 'post',
})

toggleTypeNominaStatusf2ac825250909fcd46e1c86fe562d051.form = toggleTypeNominaStatusf2ac825250909fcd46e1c86fe562d051Form

export const toggleTypeNominaStatus = {
    '/administrativo/types-nomina/{id}/toggle': toggleTypeNominaStatus5b75ecd75a3429a391113c69467acd63,
    '/superusuario/admin/types-nomina/{id}/toggle': toggleTypeNominaStatusf2ac825250909fcd46e1c86fe562d051,
}

/**
* @see \App\Http\Controllers\AdminController::listConcepts
* @see app/Http/Controllers/AdminController.php:357
* @route '/administrativo/concepts'
*/
const listConceptsbed6cea360145cb7afaaa757117b549d = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listConceptsbed6cea360145cb7afaaa757117b549d.url(options),
    method: 'get',
})

listConceptsbed6cea360145cb7afaaa757117b549d.definition = {
    methods: ["get","head"],
    url: '/administrativo/concepts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listConcepts
* @see app/Http/Controllers/AdminController.php:357
* @route '/administrativo/concepts'
*/
listConceptsbed6cea360145cb7afaaa757117b549d.url = (options?: RouteQueryOptions) => {
    return listConceptsbed6cea360145cb7afaaa757117b549d.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listConcepts
* @see app/Http/Controllers/AdminController.php:357
* @route '/administrativo/concepts'
*/
listConceptsbed6cea360145cb7afaaa757117b549d.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listConceptsbed6cea360145cb7afaaa757117b549d.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listConcepts
* @see app/Http/Controllers/AdminController.php:357
* @route '/administrativo/concepts'
*/
listConceptsbed6cea360145cb7afaaa757117b549d.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listConceptsbed6cea360145cb7afaaa757117b549d.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::listConcepts
* @see app/Http/Controllers/AdminController.php:357
* @route '/administrativo/concepts'
*/
const listConceptsbed6cea360145cb7afaaa757117b549dForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listConceptsbed6cea360145cb7afaaa757117b549d.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listConcepts
* @see app/Http/Controllers/AdminController.php:357
* @route '/administrativo/concepts'
*/
listConceptsbed6cea360145cb7afaaa757117b549dForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listConceptsbed6cea360145cb7afaaa757117b549d.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listConcepts
* @see app/Http/Controllers/AdminController.php:357
* @route '/administrativo/concepts'
*/
listConceptsbed6cea360145cb7afaaa757117b549dForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listConceptsbed6cea360145cb7afaaa757117b549d.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

listConceptsbed6cea360145cb7afaaa757117b549d.form = listConceptsbed6cea360145cb7afaaa757117b549dForm
/**
* @see \App\Http\Controllers\AdminController::listConcepts
* @see app/Http/Controllers/AdminController.php:357
* @route '/superusuario/admin/concepts'
*/
const listConceptsed46c020425465693a193c3a0d7be80c = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listConceptsed46c020425465693a193c3a0d7be80c.url(options),
    method: 'get',
})

listConceptsed46c020425465693a193c3a0d7be80c.definition = {
    methods: ["get","head"],
    url: '/superusuario/admin/concepts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listConcepts
* @see app/Http/Controllers/AdminController.php:357
* @route '/superusuario/admin/concepts'
*/
listConceptsed46c020425465693a193c3a0d7be80c.url = (options?: RouteQueryOptions) => {
    return listConceptsed46c020425465693a193c3a0d7be80c.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listConcepts
* @see app/Http/Controllers/AdminController.php:357
* @route '/superusuario/admin/concepts'
*/
listConceptsed46c020425465693a193c3a0d7be80c.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listConceptsed46c020425465693a193c3a0d7be80c.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listConcepts
* @see app/Http/Controllers/AdminController.php:357
* @route '/superusuario/admin/concepts'
*/
listConceptsed46c020425465693a193c3a0d7be80c.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listConceptsed46c020425465693a193c3a0d7be80c.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::listConcepts
* @see app/Http/Controllers/AdminController.php:357
* @route '/superusuario/admin/concepts'
*/
const listConceptsed46c020425465693a193c3a0d7be80cForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listConceptsed46c020425465693a193c3a0d7be80c.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listConcepts
* @see app/Http/Controllers/AdminController.php:357
* @route '/superusuario/admin/concepts'
*/
listConceptsed46c020425465693a193c3a0d7be80cForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listConceptsed46c020425465693a193c3a0d7be80c.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listConcepts
* @see app/Http/Controllers/AdminController.php:357
* @route '/superusuario/admin/concepts'
*/
listConceptsed46c020425465693a193c3a0d7be80cForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listConceptsed46c020425465693a193c3a0d7be80c.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

listConceptsed46c020425465693a193c3a0d7be80c.form = listConceptsed46c020425465693a193c3a0d7be80cForm

export const listConcepts = {
    '/administrativo/concepts': listConceptsbed6cea360145cb7afaaa757117b549d,
    '/superusuario/admin/concepts': listConceptsed46c020425465693a193c3a0d7be80c,
}

/**
* @see \App\Http\Controllers\AdminController::storeConcept
* @see app/Http/Controllers/AdminController.php:362
* @route '/administrativo/concepts'
*/
const storeConceptbed6cea360145cb7afaaa757117b549d = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeConceptbed6cea360145cb7afaaa757117b549d.url(options),
    method: 'post',
})

storeConceptbed6cea360145cb7afaaa757117b549d.definition = {
    methods: ["post"],
    url: '/administrativo/concepts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storeConcept
* @see app/Http/Controllers/AdminController.php:362
* @route '/administrativo/concepts'
*/
storeConceptbed6cea360145cb7afaaa757117b549d.url = (options?: RouteQueryOptions) => {
    return storeConceptbed6cea360145cb7afaaa757117b549d.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeConcept
* @see app/Http/Controllers/AdminController.php:362
* @route '/administrativo/concepts'
*/
storeConceptbed6cea360145cb7afaaa757117b549d.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeConceptbed6cea360145cb7afaaa757117b549d.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::storeConcept
* @see app/Http/Controllers/AdminController.php:362
* @route '/administrativo/concepts'
*/
const storeConceptbed6cea360145cb7afaaa757117b549dForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeConceptbed6cea360145cb7afaaa757117b549d.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::storeConcept
* @see app/Http/Controllers/AdminController.php:362
* @route '/administrativo/concepts'
*/
storeConceptbed6cea360145cb7afaaa757117b549dForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeConceptbed6cea360145cb7afaaa757117b549d.url(options),
    method: 'post',
})

storeConceptbed6cea360145cb7afaaa757117b549d.form = storeConceptbed6cea360145cb7afaaa757117b549dForm
/**
* @see \App\Http\Controllers\AdminController::storeConcept
* @see app/Http/Controllers/AdminController.php:362
* @route '/superusuario/admin/concepts'
*/
const storeConcepted46c020425465693a193c3a0d7be80c = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeConcepted46c020425465693a193c3a0d7be80c.url(options),
    method: 'post',
})

storeConcepted46c020425465693a193c3a0d7be80c.definition = {
    methods: ["post"],
    url: '/superusuario/admin/concepts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storeConcept
* @see app/Http/Controllers/AdminController.php:362
* @route '/superusuario/admin/concepts'
*/
storeConcepted46c020425465693a193c3a0d7be80c.url = (options?: RouteQueryOptions) => {
    return storeConcepted46c020425465693a193c3a0d7be80c.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeConcept
* @see app/Http/Controllers/AdminController.php:362
* @route '/superusuario/admin/concepts'
*/
storeConcepted46c020425465693a193c3a0d7be80c.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeConcepted46c020425465693a193c3a0d7be80c.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::storeConcept
* @see app/Http/Controllers/AdminController.php:362
* @route '/superusuario/admin/concepts'
*/
const storeConcepted46c020425465693a193c3a0d7be80cForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeConcepted46c020425465693a193c3a0d7be80c.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::storeConcept
* @see app/Http/Controllers/AdminController.php:362
* @route '/superusuario/admin/concepts'
*/
storeConcepted46c020425465693a193c3a0d7be80cForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeConcepted46c020425465693a193c3a0d7be80c.url(options),
    method: 'post',
})

storeConcepted46c020425465693a193c3a0d7be80c.form = storeConcepted46c020425465693a193c3a0d7be80cForm

export const storeConcept = {
    '/administrativo/concepts': storeConceptbed6cea360145cb7afaaa757117b549d,
    '/superusuario/admin/concepts': storeConcepted46c020425465693a193c3a0d7be80c,
}

/**
* @see \App\Http\Controllers\AdminController::updateConcept
* @see app/Http/Controllers/AdminController.php:377
* @route '/administrativo/concepts/{id}'
*/
const updateConceptb69eed044cc8174e9f091aa5bc36342e = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateConceptb69eed044cc8174e9f091aa5bc36342e.url(args, options),
    method: 'post',
})

updateConceptb69eed044cc8174e9f091aa5bc36342e.definition = {
    methods: ["post"],
    url: '/administrativo/concepts/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updateConcept
* @see app/Http/Controllers/AdminController.php:377
* @route '/administrativo/concepts/{id}'
*/
updateConceptb69eed044cc8174e9f091aa5bc36342e.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateConceptb69eed044cc8174e9f091aa5bc36342e.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateConcept
* @see app/Http/Controllers/AdminController.php:377
* @route '/administrativo/concepts/{id}'
*/
updateConceptb69eed044cc8174e9f091aa5bc36342e.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateConceptb69eed044cc8174e9f091aa5bc36342e.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateConcept
* @see app/Http/Controllers/AdminController.php:377
* @route '/administrativo/concepts/{id}'
*/
const updateConceptb69eed044cc8174e9f091aa5bc36342eForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateConceptb69eed044cc8174e9f091aa5bc36342e.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateConcept
* @see app/Http/Controllers/AdminController.php:377
* @route '/administrativo/concepts/{id}'
*/
updateConceptb69eed044cc8174e9f091aa5bc36342eForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateConceptb69eed044cc8174e9f091aa5bc36342e.url(args, options),
    method: 'post',
})

updateConceptb69eed044cc8174e9f091aa5bc36342e.form = updateConceptb69eed044cc8174e9f091aa5bc36342eForm
/**
* @see \App\Http\Controllers\AdminController::updateConcept
* @see app/Http/Controllers/AdminController.php:377
* @route '/superusuario/admin/concepts/{id}'
*/
const updateConcept1be257de84e03b6f80bc0edd8099dd3e = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateConcept1be257de84e03b6f80bc0edd8099dd3e.url(args, options),
    method: 'post',
})

updateConcept1be257de84e03b6f80bc0edd8099dd3e.definition = {
    methods: ["post"],
    url: '/superusuario/admin/concepts/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updateConcept
* @see app/Http/Controllers/AdminController.php:377
* @route '/superusuario/admin/concepts/{id}'
*/
updateConcept1be257de84e03b6f80bc0edd8099dd3e.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateConcept1be257de84e03b6f80bc0edd8099dd3e.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateConcept
* @see app/Http/Controllers/AdminController.php:377
* @route '/superusuario/admin/concepts/{id}'
*/
updateConcept1be257de84e03b6f80bc0edd8099dd3e.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateConcept1be257de84e03b6f80bc0edd8099dd3e.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateConcept
* @see app/Http/Controllers/AdminController.php:377
* @route '/superusuario/admin/concepts/{id}'
*/
const updateConcept1be257de84e03b6f80bc0edd8099dd3eForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateConcept1be257de84e03b6f80bc0edd8099dd3e.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateConcept
* @see app/Http/Controllers/AdminController.php:377
* @route '/superusuario/admin/concepts/{id}'
*/
updateConcept1be257de84e03b6f80bc0edd8099dd3eForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateConcept1be257de84e03b6f80bc0edd8099dd3e.url(args, options),
    method: 'post',
})

updateConcept1be257de84e03b6f80bc0edd8099dd3e.form = updateConcept1be257de84e03b6f80bc0edd8099dd3eForm

export const updateConcept = {
    '/administrativo/concepts/{id}': updateConceptb69eed044cc8174e9f091aa5bc36342e,
    '/superusuario/admin/concepts/{id}': updateConcept1be257de84e03b6f80bc0edd8099dd3e,
}

/**
* @see \App\Http\Controllers\AdminController::toggleConceptStatus
* @see app/Http/Controllers/AdminController.php:393
* @route '/administrativo/concepts/{id}/toggle'
*/
const toggleConceptStatusa40b1b8f20d526028ba09dc8d3a628a8 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleConceptStatusa40b1b8f20d526028ba09dc8d3a628a8.url(args, options),
    method: 'post',
})

toggleConceptStatusa40b1b8f20d526028ba09dc8d3a628a8.definition = {
    methods: ["post"],
    url: '/administrativo/concepts/{id}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::toggleConceptStatus
* @see app/Http/Controllers/AdminController.php:393
* @route '/administrativo/concepts/{id}/toggle'
*/
toggleConceptStatusa40b1b8f20d526028ba09dc8d3a628a8.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleConceptStatusa40b1b8f20d526028ba09dc8d3a628a8.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::toggleConceptStatus
* @see app/Http/Controllers/AdminController.php:393
* @route '/administrativo/concepts/{id}/toggle'
*/
toggleConceptStatusa40b1b8f20d526028ba09dc8d3a628a8.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleConceptStatusa40b1b8f20d526028ba09dc8d3a628a8.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::toggleConceptStatus
* @see app/Http/Controllers/AdminController.php:393
* @route '/administrativo/concepts/{id}/toggle'
*/
const toggleConceptStatusa40b1b8f20d526028ba09dc8d3a628a8Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleConceptStatusa40b1b8f20d526028ba09dc8d3a628a8.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::toggleConceptStatus
* @see app/Http/Controllers/AdminController.php:393
* @route '/administrativo/concepts/{id}/toggle'
*/
toggleConceptStatusa40b1b8f20d526028ba09dc8d3a628a8Form.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleConceptStatusa40b1b8f20d526028ba09dc8d3a628a8.url(args, options),
    method: 'post',
})

toggleConceptStatusa40b1b8f20d526028ba09dc8d3a628a8.form = toggleConceptStatusa40b1b8f20d526028ba09dc8d3a628a8Form
/**
* @see \App\Http\Controllers\AdminController::toggleConceptStatus
* @see app/Http/Controllers/AdminController.php:393
* @route '/superusuario/admin/concepts/{id}/toggle'
*/
const toggleConceptStatus37c6150fc56992203a520afd0724af20 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleConceptStatus37c6150fc56992203a520afd0724af20.url(args, options),
    method: 'post',
})

toggleConceptStatus37c6150fc56992203a520afd0724af20.definition = {
    methods: ["post"],
    url: '/superusuario/admin/concepts/{id}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::toggleConceptStatus
* @see app/Http/Controllers/AdminController.php:393
* @route '/superusuario/admin/concepts/{id}/toggle'
*/
toggleConceptStatus37c6150fc56992203a520afd0724af20.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleConceptStatus37c6150fc56992203a520afd0724af20.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::toggleConceptStatus
* @see app/Http/Controllers/AdminController.php:393
* @route '/superusuario/admin/concepts/{id}/toggle'
*/
toggleConceptStatus37c6150fc56992203a520afd0724af20.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleConceptStatus37c6150fc56992203a520afd0724af20.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::toggleConceptStatus
* @see app/Http/Controllers/AdminController.php:393
* @route '/superusuario/admin/concepts/{id}/toggle'
*/
const toggleConceptStatus37c6150fc56992203a520afd0724af20Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleConceptStatus37c6150fc56992203a520afd0724af20.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::toggleConceptStatus
* @see app/Http/Controllers/AdminController.php:393
* @route '/superusuario/admin/concepts/{id}/toggle'
*/
toggleConceptStatus37c6150fc56992203a520afd0724af20Form.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleConceptStatus37c6150fc56992203a520afd0724af20.url(args, options),
    method: 'post',
})

toggleConceptStatus37c6150fc56992203a520afd0724af20.form = toggleConceptStatus37c6150fc56992203a520afd0724af20Form

export const toggleConceptStatus = {
    '/administrativo/concepts/{id}/toggle': toggleConceptStatusa40b1b8f20d526028ba09dc8d3a628a8,
    '/superusuario/admin/concepts/{id}/toggle': toggleConceptStatus37c6150fc56992203a520afd0724af20,
}

/**
* @see \App\Http\Controllers\AdminController::processPayment
* @see app/Http/Controllers/AdminController.php:407
* @route '/administrativo/payroll/pay'
*/
const processPaymentaf59e52ca0cabfc57b7d647e6ebdf61e = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: processPaymentaf59e52ca0cabfc57b7d647e6ebdf61e.url(options),
    method: 'post',
})

processPaymentaf59e52ca0cabfc57b7d647e6ebdf61e.definition = {
    methods: ["post"],
    url: '/administrativo/payroll/pay',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::processPayment
* @see app/Http/Controllers/AdminController.php:407
* @route '/administrativo/payroll/pay'
*/
processPaymentaf59e52ca0cabfc57b7d647e6ebdf61e.url = (options?: RouteQueryOptions) => {
    return processPaymentaf59e52ca0cabfc57b7d647e6ebdf61e.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::processPayment
* @see app/Http/Controllers/AdminController.php:407
* @route '/administrativo/payroll/pay'
*/
processPaymentaf59e52ca0cabfc57b7d647e6ebdf61e.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: processPaymentaf59e52ca0cabfc57b7d647e6ebdf61e.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::processPayment
* @see app/Http/Controllers/AdminController.php:407
* @route '/administrativo/payroll/pay'
*/
const processPaymentaf59e52ca0cabfc57b7d647e6ebdf61eForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: processPaymentaf59e52ca0cabfc57b7d647e6ebdf61e.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::processPayment
* @see app/Http/Controllers/AdminController.php:407
* @route '/administrativo/payroll/pay'
*/
processPaymentaf59e52ca0cabfc57b7d647e6ebdf61eForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: processPaymentaf59e52ca0cabfc57b7d647e6ebdf61e.url(options),
    method: 'post',
})

processPaymentaf59e52ca0cabfc57b7d647e6ebdf61e.form = processPaymentaf59e52ca0cabfc57b7d647e6ebdf61eForm
/**
* @see \App\Http\Controllers\AdminController::processPayment
* @see app/Http/Controllers/AdminController.php:407
* @route '/superusuario/admin/payroll/pay'
*/
const processPaymentfcfd5353a1a3a2494054cda13aa3616d = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: processPaymentfcfd5353a1a3a2494054cda13aa3616d.url(options),
    method: 'post',
})

processPaymentfcfd5353a1a3a2494054cda13aa3616d.definition = {
    methods: ["post"],
    url: '/superusuario/admin/payroll/pay',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::processPayment
* @see app/Http/Controllers/AdminController.php:407
* @route '/superusuario/admin/payroll/pay'
*/
processPaymentfcfd5353a1a3a2494054cda13aa3616d.url = (options?: RouteQueryOptions) => {
    return processPaymentfcfd5353a1a3a2494054cda13aa3616d.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::processPayment
* @see app/Http/Controllers/AdminController.php:407
* @route '/superusuario/admin/payroll/pay'
*/
processPaymentfcfd5353a1a3a2494054cda13aa3616d.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: processPaymentfcfd5353a1a3a2494054cda13aa3616d.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::processPayment
* @see app/Http/Controllers/AdminController.php:407
* @route '/superusuario/admin/payroll/pay'
*/
const processPaymentfcfd5353a1a3a2494054cda13aa3616dForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: processPaymentfcfd5353a1a3a2494054cda13aa3616d.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::processPayment
* @see app/Http/Controllers/AdminController.php:407
* @route '/superusuario/admin/payroll/pay'
*/
processPaymentfcfd5353a1a3a2494054cda13aa3616dForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: processPaymentfcfd5353a1a3a2494054cda13aa3616d.url(options),
    method: 'post',
})

processPaymentfcfd5353a1a3a2494054cda13aa3616d.form = processPaymentfcfd5353a1a3a2494054cda13aa3616dForm

export const processPayment = {
    '/administrativo/payroll/pay': processPaymentaf59e52ca0cabfc57b7d647e6ebdf61e,
    '/superusuario/admin/payroll/pay': processPaymentfcfd5353a1a3a2494054cda13aa3616d,
}

/**
* @see \App\Http\Controllers\AdminController::getAllPayslips
* @see app/Http/Controllers/AdminController.php:893
* @route '/administrativo/payroll/history'
*/
const getAllPayslipsb65045f4e864766a395db7d48d4a968d = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAllPayslipsb65045f4e864766a395db7d48d4a968d.url(options),
    method: 'get',
})

getAllPayslipsb65045f4e864766a395db7d48d4a968d.definition = {
    methods: ["get","head"],
    url: '/administrativo/payroll/history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::getAllPayslips
* @see app/Http/Controllers/AdminController.php:893
* @route '/administrativo/payroll/history'
*/
getAllPayslipsb65045f4e864766a395db7d48d4a968d.url = (options?: RouteQueryOptions) => {
    return getAllPayslipsb65045f4e864766a395db7d48d4a968d.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::getAllPayslips
* @see app/Http/Controllers/AdminController.php:893
* @route '/administrativo/payroll/history'
*/
getAllPayslipsb65045f4e864766a395db7d48d4a968d.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAllPayslipsb65045f4e864766a395db7d48d4a968d.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::getAllPayslips
* @see app/Http/Controllers/AdminController.php:893
* @route '/administrativo/payroll/history'
*/
getAllPayslipsb65045f4e864766a395db7d48d4a968d.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getAllPayslipsb65045f4e864766a395db7d48d4a968d.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::getAllPayslips
* @see app/Http/Controllers/AdminController.php:893
* @route '/administrativo/payroll/history'
*/
const getAllPayslipsb65045f4e864766a395db7d48d4a968dForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getAllPayslipsb65045f4e864766a395db7d48d4a968d.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::getAllPayslips
* @see app/Http/Controllers/AdminController.php:893
* @route '/administrativo/payroll/history'
*/
getAllPayslipsb65045f4e864766a395db7d48d4a968dForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getAllPayslipsb65045f4e864766a395db7d48d4a968d.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::getAllPayslips
* @see app/Http/Controllers/AdminController.php:893
* @route '/administrativo/payroll/history'
*/
getAllPayslipsb65045f4e864766a395db7d48d4a968dForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getAllPayslipsb65045f4e864766a395db7d48d4a968d.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getAllPayslipsb65045f4e864766a395db7d48d4a968d.form = getAllPayslipsb65045f4e864766a395db7d48d4a968dForm
/**
* @see \App\Http\Controllers\AdminController::getAllPayslips
* @see app/Http/Controllers/AdminController.php:893
* @route '/superusuario/admin/payroll/history'
*/
const getAllPayslips5bd7e8193a23b87d3ed18df7fde989a0 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAllPayslips5bd7e8193a23b87d3ed18df7fde989a0.url(options),
    method: 'get',
})

getAllPayslips5bd7e8193a23b87d3ed18df7fde989a0.definition = {
    methods: ["get","head"],
    url: '/superusuario/admin/payroll/history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::getAllPayslips
* @see app/Http/Controllers/AdminController.php:893
* @route '/superusuario/admin/payroll/history'
*/
getAllPayslips5bd7e8193a23b87d3ed18df7fde989a0.url = (options?: RouteQueryOptions) => {
    return getAllPayslips5bd7e8193a23b87d3ed18df7fde989a0.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::getAllPayslips
* @see app/Http/Controllers/AdminController.php:893
* @route '/superusuario/admin/payroll/history'
*/
getAllPayslips5bd7e8193a23b87d3ed18df7fde989a0.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAllPayslips5bd7e8193a23b87d3ed18df7fde989a0.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::getAllPayslips
* @see app/Http/Controllers/AdminController.php:893
* @route '/superusuario/admin/payroll/history'
*/
getAllPayslips5bd7e8193a23b87d3ed18df7fde989a0.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getAllPayslips5bd7e8193a23b87d3ed18df7fde989a0.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::getAllPayslips
* @see app/Http/Controllers/AdminController.php:893
* @route '/superusuario/admin/payroll/history'
*/
const getAllPayslips5bd7e8193a23b87d3ed18df7fde989a0Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getAllPayslips5bd7e8193a23b87d3ed18df7fde989a0.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::getAllPayslips
* @see app/Http/Controllers/AdminController.php:893
* @route '/superusuario/admin/payroll/history'
*/
getAllPayslips5bd7e8193a23b87d3ed18df7fde989a0Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getAllPayslips5bd7e8193a23b87d3ed18df7fde989a0.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::getAllPayslips
* @see app/Http/Controllers/AdminController.php:893
* @route '/superusuario/admin/payroll/history'
*/
getAllPayslips5bd7e8193a23b87d3ed18df7fde989a0Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getAllPayslips5bd7e8193a23b87d3ed18df7fde989a0.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getAllPayslips5bd7e8193a23b87d3ed18df7fde989a0.form = getAllPayslips5bd7e8193a23b87d3ed18df7fde989a0Form

export const getAllPayslips = {
    '/administrativo/payroll/history': getAllPayslipsb65045f4e864766a395db7d48d4a968d,
    '/superusuario/admin/payroll/history': getAllPayslips5bd7e8193a23b87d3ed18df7fde989a0,
}

/**
* @see \App\Http\Controllers\AdminController::updatePayslipStatus
* @see app/Http/Controllers/AdminController.php:787
* @route '/administrativo/payroll/{id}/status'
*/
const updatePayslipStatusd32657bc0114300a5bac46d29ab81b3f = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePayslipStatusd32657bc0114300a5bac46d29ab81b3f.url(args, options),
    method: 'post',
})

updatePayslipStatusd32657bc0114300a5bac46d29ab81b3f.definition = {
    methods: ["post"],
    url: '/administrativo/payroll/{id}/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updatePayslipStatus
* @see app/Http/Controllers/AdminController.php:787
* @route '/administrativo/payroll/{id}/status'
*/
updatePayslipStatusd32657bc0114300a5bac46d29ab81b3f.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updatePayslipStatusd32657bc0114300a5bac46d29ab81b3f.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updatePayslipStatus
* @see app/Http/Controllers/AdminController.php:787
* @route '/administrativo/payroll/{id}/status'
*/
updatePayslipStatusd32657bc0114300a5bac46d29ab81b3f.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePayslipStatusd32657bc0114300a5bac46d29ab81b3f.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updatePayslipStatus
* @see app/Http/Controllers/AdminController.php:787
* @route '/administrativo/payroll/{id}/status'
*/
const updatePayslipStatusd32657bc0114300a5bac46d29ab81b3fForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePayslipStatusd32657bc0114300a5bac46d29ab81b3f.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updatePayslipStatus
* @see app/Http/Controllers/AdminController.php:787
* @route '/administrativo/payroll/{id}/status'
*/
updatePayslipStatusd32657bc0114300a5bac46d29ab81b3fForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePayslipStatusd32657bc0114300a5bac46d29ab81b3f.url(args, options),
    method: 'post',
})

updatePayslipStatusd32657bc0114300a5bac46d29ab81b3f.form = updatePayslipStatusd32657bc0114300a5bac46d29ab81b3fForm
/**
* @see \App\Http\Controllers\AdminController::updatePayslipStatus
* @see app/Http/Controllers/AdminController.php:787
* @route '/superusuario/admin/payroll/{id}/status'
*/
const updatePayslipStatusd4a9ae984f6c1f5014463f1c195a6ca9 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePayslipStatusd4a9ae984f6c1f5014463f1c195a6ca9.url(args, options),
    method: 'post',
})

updatePayslipStatusd4a9ae984f6c1f5014463f1c195a6ca9.definition = {
    methods: ["post"],
    url: '/superusuario/admin/payroll/{id}/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updatePayslipStatus
* @see app/Http/Controllers/AdminController.php:787
* @route '/superusuario/admin/payroll/{id}/status'
*/
updatePayslipStatusd4a9ae984f6c1f5014463f1c195a6ca9.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updatePayslipStatusd4a9ae984f6c1f5014463f1c195a6ca9.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updatePayslipStatus
* @see app/Http/Controllers/AdminController.php:787
* @route '/superusuario/admin/payroll/{id}/status'
*/
updatePayslipStatusd4a9ae984f6c1f5014463f1c195a6ca9.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePayslipStatusd4a9ae984f6c1f5014463f1c195a6ca9.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updatePayslipStatus
* @see app/Http/Controllers/AdminController.php:787
* @route '/superusuario/admin/payroll/{id}/status'
*/
const updatePayslipStatusd4a9ae984f6c1f5014463f1c195a6ca9Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePayslipStatusd4a9ae984f6c1f5014463f1c195a6ca9.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updatePayslipStatus
* @see app/Http/Controllers/AdminController.php:787
* @route '/superusuario/admin/payroll/{id}/status'
*/
updatePayslipStatusd4a9ae984f6c1f5014463f1c195a6ca9Form.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePayslipStatusd4a9ae984f6c1f5014463f1c195a6ca9.url(args, options),
    method: 'post',
})

updatePayslipStatusd4a9ae984f6c1f5014463f1c195a6ca9.form = updatePayslipStatusd4a9ae984f6c1f5014463f1c195a6ca9Form

export const updatePayslipStatus = {
    '/administrativo/payroll/{id}/status': updatePayslipStatusd32657bc0114300a5bac46d29ab81b3f,
    '/superusuario/admin/payroll/{id}/status': updatePayslipStatusd4a9ae984f6c1f5014463f1c195a6ca9,
}

/**
* @see \App\Http\Controllers\AdminController::showPayslipAdmin
* @see app/Http/Controllers/AdminController.php:943
* @route '/administrativo/payroll/payslip/{id}'
*/
const showPayslipAdminf5c6051c4092dfcd89e063dd29780cc9 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showPayslipAdminf5c6051c4092dfcd89e063dd29780cc9.url(args, options),
    method: 'get',
})

showPayslipAdminf5c6051c4092dfcd89e063dd29780cc9.definition = {
    methods: ["get","head"],
    url: '/administrativo/payroll/payslip/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::showPayslipAdmin
* @see app/Http/Controllers/AdminController.php:943
* @route '/administrativo/payroll/payslip/{id}'
*/
showPayslipAdminf5c6051c4092dfcd89e063dd29780cc9.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return showPayslipAdminf5c6051c4092dfcd89e063dd29780cc9.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::showPayslipAdmin
* @see app/Http/Controllers/AdminController.php:943
* @route '/administrativo/payroll/payslip/{id}'
*/
showPayslipAdminf5c6051c4092dfcd89e063dd29780cc9.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showPayslipAdminf5c6051c4092dfcd89e063dd29780cc9.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::showPayslipAdmin
* @see app/Http/Controllers/AdminController.php:943
* @route '/administrativo/payroll/payslip/{id}'
*/
showPayslipAdminf5c6051c4092dfcd89e063dd29780cc9.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showPayslipAdminf5c6051c4092dfcd89e063dd29780cc9.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::showPayslipAdmin
* @see app/Http/Controllers/AdminController.php:943
* @route '/administrativo/payroll/payslip/{id}'
*/
const showPayslipAdminf5c6051c4092dfcd89e063dd29780cc9Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showPayslipAdminf5c6051c4092dfcd89e063dd29780cc9.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::showPayslipAdmin
* @see app/Http/Controllers/AdminController.php:943
* @route '/administrativo/payroll/payslip/{id}'
*/
showPayslipAdminf5c6051c4092dfcd89e063dd29780cc9Form.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showPayslipAdminf5c6051c4092dfcd89e063dd29780cc9.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::showPayslipAdmin
* @see app/Http/Controllers/AdminController.php:943
* @route '/administrativo/payroll/payslip/{id}'
*/
showPayslipAdminf5c6051c4092dfcd89e063dd29780cc9Form.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showPayslipAdminf5c6051c4092dfcd89e063dd29780cc9.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showPayslipAdminf5c6051c4092dfcd89e063dd29780cc9.form = showPayslipAdminf5c6051c4092dfcd89e063dd29780cc9Form
/**
* @see \App\Http\Controllers\AdminController::showPayslipAdmin
* @see app/Http/Controllers/AdminController.php:943
* @route '/superusuario/admin/payroll/payslip/{id}'
*/
const showPayslipAdmin30a7f5023f3ac84259728174b8a22cf1 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showPayslipAdmin30a7f5023f3ac84259728174b8a22cf1.url(args, options),
    method: 'get',
})

showPayslipAdmin30a7f5023f3ac84259728174b8a22cf1.definition = {
    methods: ["get","head"],
    url: '/superusuario/admin/payroll/payslip/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::showPayslipAdmin
* @see app/Http/Controllers/AdminController.php:943
* @route '/superusuario/admin/payroll/payslip/{id}'
*/
showPayslipAdmin30a7f5023f3ac84259728174b8a22cf1.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return showPayslipAdmin30a7f5023f3ac84259728174b8a22cf1.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::showPayslipAdmin
* @see app/Http/Controllers/AdminController.php:943
* @route '/superusuario/admin/payroll/payslip/{id}'
*/
showPayslipAdmin30a7f5023f3ac84259728174b8a22cf1.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showPayslipAdmin30a7f5023f3ac84259728174b8a22cf1.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::showPayslipAdmin
* @see app/Http/Controllers/AdminController.php:943
* @route '/superusuario/admin/payroll/payslip/{id}'
*/
showPayslipAdmin30a7f5023f3ac84259728174b8a22cf1.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showPayslipAdmin30a7f5023f3ac84259728174b8a22cf1.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::showPayslipAdmin
* @see app/Http/Controllers/AdminController.php:943
* @route '/superusuario/admin/payroll/payslip/{id}'
*/
const showPayslipAdmin30a7f5023f3ac84259728174b8a22cf1Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showPayslipAdmin30a7f5023f3ac84259728174b8a22cf1.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::showPayslipAdmin
* @see app/Http/Controllers/AdminController.php:943
* @route '/superusuario/admin/payroll/payslip/{id}'
*/
showPayslipAdmin30a7f5023f3ac84259728174b8a22cf1Form.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showPayslipAdmin30a7f5023f3ac84259728174b8a22cf1.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::showPayslipAdmin
* @see app/Http/Controllers/AdminController.php:943
* @route '/superusuario/admin/payroll/payslip/{id}'
*/
showPayslipAdmin30a7f5023f3ac84259728174b8a22cf1Form.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showPayslipAdmin30a7f5023f3ac84259728174b8a22cf1.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showPayslipAdmin30a7f5023f3ac84259728174b8a22cf1.form = showPayslipAdmin30a7f5023f3ac84259728174b8a22cf1Form

export const showPayslipAdmin = {
    '/administrativo/payroll/payslip/{id}': showPayslipAdminf5c6051c4092dfcd89e063dd29780cc9,
    '/superusuario/admin/payroll/payslip/{id}': showPayslipAdmin30a7f5023f3ac84259728174b8a22cf1,
}

/**
* @see \App\Http\Controllers\AdminController::listCargos
* @see app/Http/Controllers/AdminController.php:1153
* @route '/administrativo/cargos'
*/
const listCargose808762a421a9c9c9762c0b779d7afd9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listCargose808762a421a9c9c9762c0b779d7afd9.url(options),
    method: 'get',
})

listCargose808762a421a9c9c9762c0b779d7afd9.definition = {
    methods: ["get","head"],
    url: '/administrativo/cargos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listCargos
* @see app/Http/Controllers/AdminController.php:1153
* @route '/administrativo/cargos'
*/
listCargose808762a421a9c9c9762c0b779d7afd9.url = (options?: RouteQueryOptions) => {
    return listCargose808762a421a9c9c9762c0b779d7afd9.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listCargos
* @see app/Http/Controllers/AdminController.php:1153
* @route '/administrativo/cargos'
*/
listCargose808762a421a9c9c9762c0b779d7afd9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listCargose808762a421a9c9c9762c0b779d7afd9.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listCargos
* @see app/Http/Controllers/AdminController.php:1153
* @route '/administrativo/cargos'
*/
listCargose808762a421a9c9c9762c0b779d7afd9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listCargose808762a421a9c9c9762c0b779d7afd9.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::listCargos
* @see app/Http/Controllers/AdminController.php:1153
* @route '/administrativo/cargos'
*/
const listCargose808762a421a9c9c9762c0b779d7afd9Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listCargose808762a421a9c9c9762c0b779d7afd9.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listCargos
* @see app/Http/Controllers/AdminController.php:1153
* @route '/administrativo/cargos'
*/
listCargose808762a421a9c9c9762c0b779d7afd9Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listCargose808762a421a9c9c9762c0b779d7afd9.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listCargos
* @see app/Http/Controllers/AdminController.php:1153
* @route '/administrativo/cargos'
*/
listCargose808762a421a9c9c9762c0b779d7afd9Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listCargose808762a421a9c9c9762c0b779d7afd9.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

listCargose808762a421a9c9c9762c0b779d7afd9.form = listCargose808762a421a9c9c9762c0b779d7afd9Form
/**
* @see \App\Http\Controllers\AdminController::listCargos
* @see app/Http/Controllers/AdminController.php:1153
* @route '/superusuario/admin/cargos'
*/
const listCargose2f906fb670701db2e1485101cad69e3 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listCargose2f906fb670701db2e1485101cad69e3.url(options),
    method: 'get',
})

listCargose2f906fb670701db2e1485101cad69e3.definition = {
    methods: ["get","head"],
    url: '/superusuario/admin/cargos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listCargos
* @see app/Http/Controllers/AdminController.php:1153
* @route '/superusuario/admin/cargos'
*/
listCargose2f906fb670701db2e1485101cad69e3.url = (options?: RouteQueryOptions) => {
    return listCargose2f906fb670701db2e1485101cad69e3.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listCargos
* @see app/Http/Controllers/AdminController.php:1153
* @route '/superusuario/admin/cargos'
*/
listCargose2f906fb670701db2e1485101cad69e3.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listCargose2f906fb670701db2e1485101cad69e3.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listCargos
* @see app/Http/Controllers/AdminController.php:1153
* @route '/superusuario/admin/cargos'
*/
listCargose2f906fb670701db2e1485101cad69e3.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listCargose2f906fb670701db2e1485101cad69e3.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::listCargos
* @see app/Http/Controllers/AdminController.php:1153
* @route '/superusuario/admin/cargos'
*/
const listCargose2f906fb670701db2e1485101cad69e3Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listCargose2f906fb670701db2e1485101cad69e3.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listCargos
* @see app/Http/Controllers/AdminController.php:1153
* @route '/superusuario/admin/cargos'
*/
listCargose2f906fb670701db2e1485101cad69e3Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listCargose2f906fb670701db2e1485101cad69e3.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listCargos
* @see app/Http/Controllers/AdminController.php:1153
* @route '/superusuario/admin/cargos'
*/
listCargose2f906fb670701db2e1485101cad69e3Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listCargose2f906fb670701db2e1485101cad69e3.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

listCargose2f906fb670701db2e1485101cad69e3.form = listCargose2f906fb670701db2e1485101cad69e3Form

export const listCargos = {
    '/administrativo/cargos': listCargose808762a421a9c9c9762c0b779d7afd9,
    '/superusuario/admin/cargos': listCargose2f906fb670701db2e1485101cad69e3,
}

/**
* @see \App\Http\Controllers\AdminController::listAreas
* @see app/Http/Controllers/AdminController.php:1165
* @route '/administrativo/cargos/areas'
*/
const listAreas6ba29d7475a415db8abe4c527203d2c8 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listAreas6ba29d7475a415db8abe4c527203d2c8.url(options),
    method: 'get',
})

listAreas6ba29d7475a415db8abe4c527203d2c8.definition = {
    methods: ["get","head"],
    url: '/administrativo/cargos/areas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listAreas
* @see app/Http/Controllers/AdminController.php:1165
* @route '/administrativo/cargos/areas'
*/
listAreas6ba29d7475a415db8abe4c527203d2c8.url = (options?: RouteQueryOptions) => {
    return listAreas6ba29d7475a415db8abe4c527203d2c8.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listAreas
* @see app/Http/Controllers/AdminController.php:1165
* @route '/administrativo/cargos/areas'
*/
listAreas6ba29d7475a415db8abe4c527203d2c8.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listAreas6ba29d7475a415db8abe4c527203d2c8.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listAreas
* @see app/Http/Controllers/AdminController.php:1165
* @route '/administrativo/cargos/areas'
*/
listAreas6ba29d7475a415db8abe4c527203d2c8.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listAreas6ba29d7475a415db8abe4c527203d2c8.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::listAreas
* @see app/Http/Controllers/AdminController.php:1165
* @route '/administrativo/cargos/areas'
*/
const listAreas6ba29d7475a415db8abe4c527203d2c8Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listAreas6ba29d7475a415db8abe4c527203d2c8.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listAreas
* @see app/Http/Controllers/AdminController.php:1165
* @route '/administrativo/cargos/areas'
*/
listAreas6ba29d7475a415db8abe4c527203d2c8Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listAreas6ba29d7475a415db8abe4c527203d2c8.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listAreas
* @see app/Http/Controllers/AdminController.php:1165
* @route '/administrativo/cargos/areas'
*/
listAreas6ba29d7475a415db8abe4c527203d2c8Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listAreas6ba29d7475a415db8abe4c527203d2c8.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

listAreas6ba29d7475a415db8abe4c527203d2c8.form = listAreas6ba29d7475a415db8abe4c527203d2c8Form
/**
* @see \App\Http\Controllers\AdminController::listAreas
* @see app/Http/Controllers/AdminController.php:1165
* @route '/superusuario/admin/cargos/areas'
*/
const listAreas129a824a8c25aef8452506660e9db162 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listAreas129a824a8c25aef8452506660e9db162.url(options),
    method: 'get',
})

listAreas129a824a8c25aef8452506660e9db162.definition = {
    methods: ["get","head"],
    url: '/superusuario/admin/cargos/areas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listAreas
* @see app/Http/Controllers/AdminController.php:1165
* @route '/superusuario/admin/cargos/areas'
*/
listAreas129a824a8c25aef8452506660e9db162.url = (options?: RouteQueryOptions) => {
    return listAreas129a824a8c25aef8452506660e9db162.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listAreas
* @see app/Http/Controllers/AdminController.php:1165
* @route '/superusuario/admin/cargos/areas'
*/
listAreas129a824a8c25aef8452506660e9db162.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listAreas129a824a8c25aef8452506660e9db162.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listAreas
* @see app/Http/Controllers/AdminController.php:1165
* @route '/superusuario/admin/cargos/areas'
*/
listAreas129a824a8c25aef8452506660e9db162.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listAreas129a824a8c25aef8452506660e9db162.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::listAreas
* @see app/Http/Controllers/AdminController.php:1165
* @route '/superusuario/admin/cargos/areas'
*/
const listAreas129a824a8c25aef8452506660e9db162Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listAreas129a824a8c25aef8452506660e9db162.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listAreas
* @see app/Http/Controllers/AdminController.php:1165
* @route '/superusuario/admin/cargos/areas'
*/
listAreas129a824a8c25aef8452506660e9db162Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listAreas129a824a8c25aef8452506660e9db162.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listAreas
* @see app/Http/Controllers/AdminController.php:1165
* @route '/superusuario/admin/cargos/areas'
*/
listAreas129a824a8c25aef8452506660e9db162Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listAreas129a824a8c25aef8452506660e9db162.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

listAreas129a824a8c25aef8452506660e9db162.form = listAreas129a824a8c25aef8452506660e9db162Form

export const listAreas = {
    '/administrativo/cargos/areas': listAreas6ba29d7475a415db8abe4c527203d2c8,
    '/superusuario/admin/cargos/areas': listAreas129a824a8c25aef8452506660e9db162,
}

/**
* @see \App\Http\Controllers\AdminController::storeCargo
* @see app/Http/Controllers/AdminController.php:1178
* @route '/administrativo/cargos'
*/
const storeCargoe808762a421a9c9c9762c0b779d7afd9 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCargoe808762a421a9c9c9762c0b779d7afd9.url(options),
    method: 'post',
})

storeCargoe808762a421a9c9c9762c0b779d7afd9.definition = {
    methods: ["post"],
    url: '/administrativo/cargos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storeCargo
* @see app/Http/Controllers/AdminController.php:1178
* @route '/administrativo/cargos'
*/
storeCargoe808762a421a9c9c9762c0b779d7afd9.url = (options?: RouteQueryOptions) => {
    return storeCargoe808762a421a9c9c9762c0b779d7afd9.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeCargo
* @see app/Http/Controllers/AdminController.php:1178
* @route '/administrativo/cargos'
*/
storeCargoe808762a421a9c9c9762c0b779d7afd9.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCargoe808762a421a9c9c9762c0b779d7afd9.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::storeCargo
* @see app/Http/Controllers/AdminController.php:1178
* @route '/administrativo/cargos'
*/
const storeCargoe808762a421a9c9c9762c0b779d7afd9Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeCargoe808762a421a9c9c9762c0b779d7afd9.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::storeCargo
* @see app/Http/Controllers/AdminController.php:1178
* @route '/administrativo/cargos'
*/
storeCargoe808762a421a9c9c9762c0b779d7afd9Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeCargoe808762a421a9c9c9762c0b779d7afd9.url(options),
    method: 'post',
})

storeCargoe808762a421a9c9c9762c0b779d7afd9.form = storeCargoe808762a421a9c9c9762c0b779d7afd9Form
/**
* @see \App\Http\Controllers\AdminController::storeCargo
* @see app/Http/Controllers/AdminController.php:1178
* @route '/superusuario/admin/cargos'
*/
const storeCargoe2f906fb670701db2e1485101cad69e3 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCargoe2f906fb670701db2e1485101cad69e3.url(options),
    method: 'post',
})

storeCargoe2f906fb670701db2e1485101cad69e3.definition = {
    methods: ["post"],
    url: '/superusuario/admin/cargos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storeCargo
* @see app/Http/Controllers/AdminController.php:1178
* @route '/superusuario/admin/cargos'
*/
storeCargoe2f906fb670701db2e1485101cad69e3.url = (options?: RouteQueryOptions) => {
    return storeCargoe2f906fb670701db2e1485101cad69e3.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeCargo
* @see app/Http/Controllers/AdminController.php:1178
* @route '/superusuario/admin/cargos'
*/
storeCargoe2f906fb670701db2e1485101cad69e3.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCargoe2f906fb670701db2e1485101cad69e3.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::storeCargo
* @see app/Http/Controllers/AdminController.php:1178
* @route '/superusuario/admin/cargos'
*/
const storeCargoe2f906fb670701db2e1485101cad69e3Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeCargoe2f906fb670701db2e1485101cad69e3.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::storeCargo
* @see app/Http/Controllers/AdminController.php:1178
* @route '/superusuario/admin/cargos'
*/
storeCargoe2f906fb670701db2e1485101cad69e3Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeCargoe2f906fb670701db2e1485101cad69e3.url(options),
    method: 'post',
})

storeCargoe2f906fb670701db2e1485101cad69e3.form = storeCargoe2f906fb670701db2e1485101cad69e3Form

export const storeCargo = {
    '/administrativo/cargos': storeCargoe808762a421a9c9c9762c0b779d7afd9,
    '/superusuario/admin/cargos': storeCargoe2f906fb670701db2e1485101cad69e3,
}

/**
* @see \App\Http\Controllers\AdminController::updateCargo
* @see app/Http/Controllers/AdminController.php:1189
* @route '/administrativo/cargos/{id}'
*/
const updateCargo3bff59c1a1b10ab4bdbda9144bb51eb5 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateCargo3bff59c1a1b10ab4bdbda9144bb51eb5.url(args, options),
    method: 'post',
})

updateCargo3bff59c1a1b10ab4bdbda9144bb51eb5.definition = {
    methods: ["post"],
    url: '/administrativo/cargos/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updateCargo
* @see app/Http/Controllers/AdminController.php:1189
* @route '/administrativo/cargos/{id}'
*/
updateCargo3bff59c1a1b10ab4bdbda9144bb51eb5.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateCargo3bff59c1a1b10ab4bdbda9144bb51eb5.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateCargo
* @see app/Http/Controllers/AdminController.php:1189
* @route '/administrativo/cargos/{id}'
*/
updateCargo3bff59c1a1b10ab4bdbda9144bb51eb5.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateCargo3bff59c1a1b10ab4bdbda9144bb51eb5.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateCargo
* @see app/Http/Controllers/AdminController.php:1189
* @route '/administrativo/cargos/{id}'
*/
const updateCargo3bff59c1a1b10ab4bdbda9144bb51eb5Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateCargo3bff59c1a1b10ab4bdbda9144bb51eb5.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateCargo
* @see app/Http/Controllers/AdminController.php:1189
* @route '/administrativo/cargos/{id}'
*/
updateCargo3bff59c1a1b10ab4bdbda9144bb51eb5Form.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateCargo3bff59c1a1b10ab4bdbda9144bb51eb5.url(args, options),
    method: 'post',
})

updateCargo3bff59c1a1b10ab4bdbda9144bb51eb5.form = updateCargo3bff59c1a1b10ab4bdbda9144bb51eb5Form
/**
* @see \App\Http\Controllers\AdminController::updateCargo
* @see app/Http/Controllers/AdminController.php:1189
* @route '/superusuario/admin/cargos/{id}'
*/
const updateCargoc487e67041f26443ca5f19764cc58706 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateCargoc487e67041f26443ca5f19764cc58706.url(args, options),
    method: 'post',
})

updateCargoc487e67041f26443ca5f19764cc58706.definition = {
    methods: ["post"],
    url: '/superusuario/admin/cargos/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updateCargo
* @see app/Http/Controllers/AdminController.php:1189
* @route '/superusuario/admin/cargos/{id}'
*/
updateCargoc487e67041f26443ca5f19764cc58706.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateCargoc487e67041f26443ca5f19764cc58706.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateCargo
* @see app/Http/Controllers/AdminController.php:1189
* @route '/superusuario/admin/cargos/{id}'
*/
updateCargoc487e67041f26443ca5f19764cc58706.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateCargoc487e67041f26443ca5f19764cc58706.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateCargo
* @see app/Http/Controllers/AdminController.php:1189
* @route '/superusuario/admin/cargos/{id}'
*/
const updateCargoc487e67041f26443ca5f19764cc58706Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateCargoc487e67041f26443ca5f19764cc58706.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateCargo
* @see app/Http/Controllers/AdminController.php:1189
* @route '/superusuario/admin/cargos/{id}'
*/
updateCargoc487e67041f26443ca5f19764cc58706Form.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateCargoc487e67041f26443ca5f19764cc58706.url(args, options),
    method: 'post',
})

updateCargoc487e67041f26443ca5f19764cc58706.form = updateCargoc487e67041f26443ca5f19764cc58706Form

export const updateCargo = {
    '/administrativo/cargos/{id}': updateCargo3bff59c1a1b10ab4bdbda9144bb51eb5,
    '/superusuario/admin/cargos/{id}': updateCargoc487e67041f26443ca5f19764cc58706,
}

/**
* @see \App\Http\Controllers\AdminController::toggleCargoStatus
* @see app/Http/Controllers/AdminController.php:1201
* @route '/administrativo/cargos/{id}/toggle'
*/
const toggleCargoStatusecef12fefd2d188a8689247cd37e08c7 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleCargoStatusecef12fefd2d188a8689247cd37e08c7.url(args, options),
    method: 'post',
})

toggleCargoStatusecef12fefd2d188a8689247cd37e08c7.definition = {
    methods: ["post"],
    url: '/administrativo/cargos/{id}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::toggleCargoStatus
* @see app/Http/Controllers/AdminController.php:1201
* @route '/administrativo/cargos/{id}/toggle'
*/
toggleCargoStatusecef12fefd2d188a8689247cd37e08c7.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleCargoStatusecef12fefd2d188a8689247cd37e08c7.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::toggleCargoStatus
* @see app/Http/Controllers/AdminController.php:1201
* @route '/administrativo/cargos/{id}/toggle'
*/
toggleCargoStatusecef12fefd2d188a8689247cd37e08c7.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleCargoStatusecef12fefd2d188a8689247cd37e08c7.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::toggleCargoStatus
* @see app/Http/Controllers/AdminController.php:1201
* @route '/administrativo/cargos/{id}/toggle'
*/
const toggleCargoStatusecef12fefd2d188a8689247cd37e08c7Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleCargoStatusecef12fefd2d188a8689247cd37e08c7.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::toggleCargoStatus
* @see app/Http/Controllers/AdminController.php:1201
* @route '/administrativo/cargos/{id}/toggle'
*/
toggleCargoStatusecef12fefd2d188a8689247cd37e08c7Form.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleCargoStatusecef12fefd2d188a8689247cd37e08c7.url(args, options),
    method: 'post',
})

toggleCargoStatusecef12fefd2d188a8689247cd37e08c7.form = toggleCargoStatusecef12fefd2d188a8689247cd37e08c7Form
/**
* @see \App\Http\Controllers\AdminController::toggleCargoStatus
* @see app/Http/Controllers/AdminController.php:1201
* @route '/superusuario/admin/cargos/{id}/toggle'
*/
const toggleCargoStatus19c26b39a1793377a1aec5c5b88f8d1e = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleCargoStatus19c26b39a1793377a1aec5c5b88f8d1e.url(args, options),
    method: 'post',
})

toggleCargoStatus19c26b39a1793377a1aec5c5b88f8d1e.definition = {
    methods: ["post"],
    url: '/superusuario/admin/cargos/{id}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::toggleCargoStatus
* @see app/Http/Controllers/AdminController.php:1201
* @route '/superusuario/admin/cargos/{id}/toggle'
*/
toggleCargoStatus19c26b39a1793377a1aec5c5b88f8d1e.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleCargoStatus19c26b39a1793377a1aec5c5b88f8d1e.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::toggleCargoStatus
* @see app/Http/Controllers/AdminController.php:1201
* @route '/superusuario/admin/cargos/{id}/toggle'
*/
toggleCargoStatus19c26b39a1793377a1aec5c5b88f8d1e.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleCargoStatus19c26b39a1793377a1aec5c5b88f8d1e.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::toggleCargoStatus
* @see app/Http/Controllers/AdminController.php:1201
* @route '/superusuario/admin/cargos/{id}/toggle'
*/
const toggleCargoStatus19c26b39a1793377a1aec5c5b88f8d1eForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleCargoStatus19c26b39a1793377a1aec5c5b88f8d1e.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::toggleCargoStatus
* @see app/Http/Controllers/AdminController.php:1201
* @route '/superusuario/admin/cargos/{id}/toggle'
*/
toggleCargoStatus19c26b39a1793377a1aec5c5b88f8d1eForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleCargoStatus19c26b39a1793377a1aec5c5b88f8d1e.url(args, options),
    method: 'post',
})

toggleCargoStatus19c26b39a1793377a1aec5c5b88f8d1e.form = toggleCargoStatus19c26b39a1793377a1aec5c5b88f8d1eForm

export const toggleCargoStatus = {
    '/administrativo/cargos/{id}/toggle': toggleCargoStatusecef12fefd2d188a8689247cd37e08c7,
    '/superusuario/admin/cargos/{id}/toggle': toggleCargoStatus19c26b39a1793377a1aec5c5b88f8d1e,
}

/**
* @see \App\Http\Controllers\AdminController::listEducationLevels
* @see app/Http/Controllers/AdminController.php:1211
* @route '/administrativo/education-levels'
*/
const listEducationLevelsbbd522321ec91c165cc6890b125bd316 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listEducationLevelsbbd522321ec91c165cc6890b125bd316.url(options),
    method: 'get',
})

listEducationLevelsbbd522321ec91c165cc6890b125bd316.definition = {
    methods: ["get","head"],
    url: '/administrativo/education-levels',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listEducationLevels
* @see app/Http/Controllers/AdminController.php:1211
* @route '/administrativo/education-levels'
*/
listEducationLevelsbbd522321ec91c165cc6890b125bd316.url = (options?: RouteQueryOptions) => {
    return listEducationLevelsbbd522321ec91c165cc6890b125bd316.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listEducationLevels
* @see app/Http/Controllers/AdminController.php:1211
* @route '/administrativo/education-levels'
*/
listEducationLevelsbbd522321ec91c165cc6890b125bd316.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listEducationLevelsbbd522321ec91c165cc6890b125bd316.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listEducationLevels
* @see app/Http/Controllers/AdminController.php:1211
* @route '/administrativo/education-levels'
*/
listEducationLevelsbbd522321ec91c165cc6890b125bd316.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listEducationLevelsbbd522321ec91c165cc6890b125bd316.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::listEducationLevels
* @see app/Http/Controllers/AdminController.php:1211
* @route '/administrativo/education-levels'
*/
const listEducationLevelsbbd522321ec91c165cc6890b125bd316Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listEducationLevelsbbd522321ec91c165cc6890b125bd316.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listEducationLevels
* @see app/Http/Controllers/AdminController.php:1211
* @route '/administrativo/education-levels'
*/
listEducationLevelsbbd522321ec91c165cc6890b125bd316Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listEducationLevelsbbd522321ec91c165cc6890b125bd316.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listEducationLevels
* @see app/Http/Controllers/AdminController.php:1211
* @route '/administrativo/education-levels'
*/
listEducationLevelsbbd522321ec91c165cc6890b125bd316Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listEducationLevelsbbd522321ec91c165cc6890b125bd316.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

listEducationLevelsbbd522321ec91c165cc6890b125bd316.form = listEducationLevelsbbd522321ec91c165cc6890b125bd316Form
/**
* @see \App\Http\Controllers\AdminController::listEducationLevels
* @see app/Http/Controllers/AdminController.php:1211
* @route '/superusuario/admin/education-levels'
*/
const listEducationLevels51c0d3c1e4bbc30b8d05a6fee03425a6 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listEducationLevels51c0d3c1e4bbc30b8d05a6fee03425a6.url(options),
    method: 'get',
})

listEducationLevels51c0d3c1e4bbc30b8d05a6fee03425a6.definition = {
    methods: ["get","head"],
    url: '/superusuario/admin/education-levels',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listEducationLevels
* @see app/Http/Controllers/AdminController.php:1211
* @route '/superusuario/admin/education-levels'
*/
listEducationLevels51c0d3c1e4bbc30b8d05a6fee03425a6.url = (options?: RouteQueryOptions) => {
    return listEducationLevels51c0d3c1e4bbc30b8d05a6fee03425a6.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listEducationLevels
* @see app/Http/Controllers/AdminController.php:1211
* @route '/superusuario/admin/education-levels'
*/
listEducationLevels51c0d3c1e4bbc30b8d05a6fee03425a6.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listEducationLevels51c0d3c1e4bbc30b8d05a6fee03425a6.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listEducationLevels
* @see app/Http/Controllers/AdminController.php:1211
* @route '/superusuario/admin/education-levels'
*/
listEducationLevels51c0d3c1e4bbc30b8d05a6fee03425a6.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listEducationLevels51c0d3c1e4bbc30b8d05a6fee03425a6.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::listEducationLevels
* @see app/Http/Controllers/AdminController.php:1211
* @route '/superusuario/admin/education-levels'
*/
const listEducationLevels51c0d3c1e4bbc30b8d05a6fee03425a6Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listEducationLevels51c0d3c1e4bbc30b8d05a6fee03425a6.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listEducationLevels
* @see app/Http/Controllers/AdminController.php:1211
* @route '/superusuario/admin/education-levels'
*/
listEducationLevels51c0d3c1e4bbc30b8d05a6fee03425a6Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listEducationLevels51c0d3c1e4bbc30b8d05a6fee03425a6.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listEducationLevels
* @see app/Http/Controllers/AdminController.php:1211
* @route '/superusuario/admin/education-levels'
*/
listEducationLevels51c0d3c1e4bbc30b8d05a6fee03425a6Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listEducationLevels51c0d3c1e4bbc30b8d05a6fee03425a6.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

listEducationLevels51c0d3c1e4bbc30b8d05a6fee03425a6.form = listEducationLevels51c0d3c1e4bbc30b8d05a6fee03425a6Form

export const listEducationLevels = {
    '/administrativo/education-levels': listEducationLevelsbbd522321ec91c165cc6890b125bd316,
    '/superusuario/admin/education-levels': listEducationLevels51c0d3c1e4bbc30b8d05a6fee03425a6,
}

/**
* @see \App\Http\Controllers\AdminController::getDatosTrabajador
* @see app/Http/Controllers/AdminController.php:51
* @route '/superusuario/workers/{id}/datos'
*/
export const getDatosTrabajador = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDatosTrabajador.url(args, options),
    method: 'get',
})

getDatosTrabajador.definition = {
    methods: ["get","head"],
    url: '/superusuario/workers/{id}/datos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::getDatosTrabajador
* @see app/Http/Controllers/AdminController.php:51
* @route '/superusuario/workers/{id}/datos'
*/
getDatosTrabajador.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getDatosTrabajador.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::getDatosTrabajador
* @see app/Http/Controllers/AdminController.php:51
* @route '/superusuario/workers/{id}/datos'
*/
getDatosTrabajador.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDatosTrabajador.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::getDatosTrabajador
* @see app/Http/Controllers/AdminController.php:51
* @route '/superusuario/workers/{id}/datos'
*/
getDatosTrabajador.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getDatosTrabajador.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::getDatosTrabajador
* @see app/Http/Controllers/AdminController.php:51
* @route '/superusuario/workers/{id}/datos'
*/
const getDatosTrabajadorForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getDatosTrabajador.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::getDatosTrabajador
* @see app/Http/Controllers/AdminController.php:51
* @route '/superusuario/workers/{id}/datos'
*/
getDatosTrabajadorForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getDatosTrabajador.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::getDatosTrabajador
* @see app/Http/Controllers/AdminController.php:51
* @route '/superusuario/workers/{id}/datos'
*/
getDatosTrabajadorForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getDatosTrabajador.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getDatosTrabajador.form = getDatosTrabajadorForm

/**
* @see \App\Http\Controllers\AdminController::listSystemLogs
* @see app/Http/Controllers/AdminController.php:1556
* @route '/superusuario/system-logs'
*/
export const listSystemLogs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listSystemLogs.url(options),
    method: 'get',
})

listSystemLogs.definition = {
    methods: ["get","head"],
    url: '/superusuario/system-logs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::listSystemLogs
* @see app/Http/Controllers/AdminController.php:1556
* @route '/superusuario/system-logs'
*/
listSystemLogs.url = (options?: RouteQueryOptions) => {
    return listSystemLogs.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::listSystemLogs
* @see app/Http/Controllers/AdminController.php:1556
* @route '/superusuario/system-logs'
*/
listSystemLogs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listSystemLogs.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listSystemLogs
* @see app/Http/Controllers/AdminController.php:1556
* @route '/superusuario/system-logs'
*/
listSystemLogs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listSystemLogs.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::listSystemLogs
* @see app/Http/Controllers/AdminController.php:1556
* @route '/superusuario/system-logs'
*/
const listSystemLogsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listSystemLogs.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listSystemLogs
* @see app/Http/Controllers/AdminController.php:1556
* @route '/superusuario/system-logs'
*/
listSystemLogsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listSystemLogs.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::listSystemLogs
* @see app/Http/Controllers/AdminController.php:1556
* @route '/superusuario/system-logs'
*/
listSystemLogsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listSystemLogs.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

listSystemLogs.form = listSystemLogsForm

/**
* @see \App\Http\Controllers\AdminController::superDashboardMetrics
* @see app/Http/Controllers/AdminController.php:1592
* @route '/superusuario/dashboard-metrics'
*/
export const superDashboardMetrics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: superDashboardMetrics.url(options),
    method: 'get',
})

superDashboardMetrics.definition = {
    methods: ["get","head"],
    url: '/superusuario/dashboard-metrics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::superDashboardMetrics
* @see app/Http/Controllers/AdminController.php:1592
* @route '/superusuario/dashboard-metrics'
*/
superDashboardMetrics.url = (options?: RouteQueryOptions) => {
    return superDashboardMetrics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::superDashboardMetrics
* @see app/Http/Controllers/AdminController.php:1592
* @route '/superusuario/dashboard-metrics'
*/
superDashboardMetrics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: superDashboardMetrics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::superDashboardMetrics
* @see app/Http/Controllers/AdminController.php:1592
* @route '/superusuario/dashboard-metrics'
*/
superDashboardMetrics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: superDashboardMetrics.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::superDashboardMetrics
* @see app/Http/Controllers/AdminController.php:1592
* @route '/superusuario/dashboard-metrics'
*/
const superDashboardMetricsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: superDashboardMetrics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::superDashboardMetrics
* @see app/Http/Controllers/AdminController.php:1592
* @route '/superusuario/dashboard-metrics'
*/
superDashboardMetricsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: superDashboardMetrics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::superDashboardMetrics
* @see app/Http/Controllers/AdminController.php:1592
* @route '/superusuario/dashboard-metrics'
*/
superDashboardMetricsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: superDashboardMetrics.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

superDashboardMetrics.form = superDashboardMetricsForm

const AdminController = { listWorkers, storeWorker, updateWorker, activateWorker, deactivateWorker, listVacations, updateVacationStatus, listVacationPayments, storeVacationPayment, getPaidYears, showVacationPayslip, updateVacationPaymentStatus, listPermissionRequests, updatePermissionRequestStatus, listTypesNomina, storeTypeNomina, updateTypeNomina, toggleTypeNominaStatus, listConcepts, storeConcept, updateConcept, toggleConceptStatus, processPayment, getAllPayslips, updatePayslipStatus, showPayslipAdmin, listCargos, listAreas, storeCargo, updateCargo, toggleCargoStatus, listEducationLevels, getDatosTrabajador, listSystemLogs, superDashboardMetrics }

export default AdminController