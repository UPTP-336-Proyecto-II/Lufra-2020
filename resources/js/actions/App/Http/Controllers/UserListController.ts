import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\UserListController::index
* @see app/Http/Controllers/UserListController.php:9
* @route '/superusuario/admin/users'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/superusuario/admin/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserListController::index
* @see app/Http/Controllers/UserListController.php:9
* @route '/superusuario/admin/users'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserListController::index
* @see app/Http/Controllers/UserListController.php:9
* @route '/superusuario/admin/users'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserListController::index
* @see app/Http/Controllers/UserListController.php:9
* @route '/superusuario/admin/users'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserListController::index
* @see app/Http/Controllers/UserListController.php:9
* @route '/superusuario/admin/users'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserListController::index
* @see app/Http/Controllers/UserListController.php:9
* @route '/superusuario/admin/users'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserListController::index
* @see app/Http/Controllers/UserListController.php:9
* @route '/superusuario/admin/users'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\UserListController::getUsers
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/users-data'
*/
const getUsers0c77b65f9e6c3ae9bef07913726de0d4 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getUsers0c77b65f9e6c3ae9bef07913726de0d4.url(options),
    method: 'get',
})

getUsers0c77b65f9e6c3ae9bef07913726de0d4.definition = {
    methods: ["get","head"],
    url: '/superusuario/users-data',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserListController::getUsers
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/users-data'
*/
getUsers0c77b65f9e6c3ae9bef07913726de0d4.url = (options?: RouteQueryOptions) => {
    return getUsers0c77b65f9e6c3ae9bef07913726de0d4.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserListController::getUsers
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/users-data'
*/
getUsers0c77b65f9e6c3ae9bef07913726de0d4.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getUsers0c77b65f9e6c3ae9bef07913726de0d4.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserListController::getUsers
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/users-data'
*/
getUsers0c77b65f9e6c3ae9bef07913726de0d4.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getUsers0c77b65f9e6c3ae9bef07913726de0d4.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserListController::getUsers
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/users-data'
*/
const getUsers0c77b65f9e6c3ae9bef07913726de0d4Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getUsers0c77b65f9e6c3ae9bef07913726de0d4.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserListController::getUsers
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/users-data'
*/
getUsers0c77b65f9e6c3ae9bef07913726de0d4Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getUsers0c77b65f9e6c3ae9bef07913726de0d4.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserListController::getUsers
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/users-data'
*/
getUsers0c77b65f9e6c3ae9bef07913726de0d4Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getUsers0c77b65f9e6c3ae9bef07913726de0d4.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getUsers0c77b65f9e6c3ae9bef07913726de0d4.form = getUsers0c77b65f9e6c3ae9bef07913726de0d4Form
/**
* @see \App\Http\Controllers\UserListController::getUsers
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/reports/users'
*/
const getUsersb0125deb9a2a53b9c9a9f18c76b67898 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getUsersb0125deb9a2a53b9c9a9f18c76b67898.url(options),
    method: 'get',
})

getUsersb0125deb9a2a53b9c9a9f18c76b67898.definition = {
    methods: ["get","head"],
    url: '/superusuario/reports/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserListController::getUsers
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/reports/users'
*/
getUsersb0125deb9a2a53b9c9a9f18c76b67898.url = (options?: RouteQueryOptions) => {
    return getUsersb0125deb9a2a53b9c9a9f18c76b67898.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserListController::getUsers
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/reports/users'
*/
getUsersb0125deb9a2a53b9c9a9f18c76b67898.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getUsersb0125deb9a2a53b9c9a9f18c76b67898.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserListController::getUsers
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/reports/users'
*/
getUsersb0125deb9a2a53b9c9a9f18c76b67898.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getUsersb0125deb9a2a53b9c9a9f18c76b67898.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserListController::getUsers
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/reports/users'
*/
const getUsersb0125deb9a2a53b9c9a9f18c76b67898Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getUsersb0125deb9a2a53b9c9a9f18c76b67898.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserListController::getUsers
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/reports/users'
*/
getUsersb0125deb9a2a53b9c9a9f18c76b67898Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getUsersb0125deb9a2a53b9c9a9f18c76b67898.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserListController::getUsers
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/reports/users'
*/
getUsersb0125deb9a2a53b9c9a9f18c76b67898Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getUsersb0125deb9a2a53b9c9a9f18c76b67898.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getUsersb0125deb9a2a53b9c9a9f18c76b67898.form = getUsersb0125deb9a2a53b9c9a9f18c76b67898Form

export const getUsers = {
    '/superusuario/users-data': getUsers0c77b65f9e6c3ae9bef07913726de0d4,
    '/superusuario/reports/users': getUsersb0125deb9a2a53b9c9a9f18c76b67898,
}

/**
* @see \App\Http\Controllers\UserListController::store
* @see app/Http/Controllers/UserListController.php:90
* @route '/superusuario/users/store'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/superusuario/users/store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserListController::store
* @see app/Http/Controllers/UserListController.php:90
* @route '/superusuario/users/store'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserListController::store
* @see app/Http/Controllers/UserListController.php:90
* @route '/superusuario/users/store'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserListController::store
* @see app/Http/Controllers/UserListController.php:90
* @route '/superusuario/users/store'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserListController::store
* @see app/Http/Controllers/UserListController.php:90
* @route '/superusuario/users/store'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\UserListController::update
* @see app/Http/Controllers/UserListController.php:123
* @route '/superusuario/users/{id}/update'
*/
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/superusuario/users/{id}/update',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserListController::update
* @see app/Http/Controllers/UserListController.php:123
* @route '/superusuario/users/{id}/update'
*/
update.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserListController::update
* @see app/Http/Controllers/UserListController.php:123
* @route '/superusuario/users/{id}/update'
*/
update.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserListController::update
* @see app/Http/Controllers/UserListController.php:123
* @route '/superusuario/users/{id}/update'
*/
const updateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserListController::update
* @see app/Http/Controllers/UserListController.php:123
* @route '/superusuario/users/{id}/update'
*/
updateForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, options),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\UserListController::activate
* @see app/Http/Controllers/UserListController.php:153
* @route '/superusuario/users/{id}/activate'
*/
export const activate = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activate.url(args, options),
    method: 'post',
})

activate.definition = {
    methods: ["post"],
    url: '/superusuario/users/{id}/activate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserListController::activate
* @see app/Http/Controllers/UserListController.php:153
* @route '/superusuario/users/{id}/activate'
*/
activate.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return activate.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserListController::activate
* @see app/Http/Controllers/UserListController.php:153
* @route '/superusuario/users/{id}/activate'
*/
activate.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserListController::activate
* @see app/Http/Controllers/UserListController.php:153
* @route '/superusuario/users/{id}/activate'
*/
const activateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: activate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserListController::activate
* @see app/Http/Controllers/UserListController.php:153
* @route '/superusuario/users/{id}/activate'
*/
activateForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: activate.url(args, options),
    method: 'post',
})

activate.form = activateForm

/**
* @see \App\Http\Controllers\UserListController::deactivate
* @see app/Http/Controllers/UserListController.php:162
* @route '/superusuario/users/{id}/deactivate'
*/
export const deactivate = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deactivate.url(args, options),
    method: 'post',
})

deactivate.definition = {
    methods: ["post"],
    url: '/superusuario/users/{id}/deactivate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserListController::deactivate
* @see app/Http/Controllers/UserListController.php:162
* @route '/superusuario/users/{id}/deactivate'
*/
deactivate.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return deactivate.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserListController::deactivate
* @see app/Http/Controllers/UserListController.php:162
* @route '/superusuario/users/{id}/deactivate'
*/
deactivate.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deactivate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserListController::deactivate
* @see app/Http/Controllers/UserListController.php:162
* @route '/superusuario/users/{id}/deactivate'
*/
const deactivateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deactivate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserListController::deactivate
* @see app/Http/Controllers/UserListController.php:162
* @route '/superusuario/users/{id}/deactivate'
*/
deactivateForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deactivate.url(args, options),
    method: 'post',
})

deactivate.form = deactivateForm

/**
* @see \App\Http\Controllers\UserListController::createDefault
* @see app/Http/Controllers/UserListController.php:171
* @route '/superusuario/create-superuser'
*/
export const createDefault = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createDefault.url(options),
    method: 'post',
})

createDefault.definition = {
    methods: ["post"],
    url: '/superusuario/create-superuser',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserListController::createDefault
* @see app/Http/Controllers/UserListController.php:171
* @route '/superusuario/create-superuser'
*/
createDefault.url = (options?: RouteQueryOptions) => {
    return createDefault.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserListController::createDefault
* @see app/Http/Controllers/UserListController.php:171
* @route '/superusuario/create-superuser'
*/
createDefault.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createDefault.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserListController::createDefault
* @see app/Http/Controllers/UserListController.php:171
* @route '/superusuario/create-superuser'
*/
const createDefaultForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: createDefault.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserListController::createDefault
* @see app/Http/Controllers/UserListController.php:171
* @route '/superusuario/create-superuser'
*/
createDefaultForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: createDefault.url(options),
    method: 'post',
})

createDefault.form = createDefaultForm

const UserListController = { index, getUsers, store, update, activate, deactivate, createDefault }

export default UserListController