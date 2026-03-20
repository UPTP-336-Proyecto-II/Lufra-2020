import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import users from './users'
/**
 * @see routes/modules.php:56
 * @route '/superusuario'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/superusuario',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/modules.php:56
 * @route '/superusuario'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
 * @see routes/modules.php:56
 * @route '/superusuario'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
 * @see routes/modules.php:56
 * @route '/superusuario'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserListController::users_data
 * @see app/Http/Controllers/UserListController.php:39
 * @route '/superusuario/users-data'
 */
export const users_data = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users_data.url(options),
    method: 'get',
})

users_data.definition = {
    methods: ["get","head"],
    url: '/superusuario/users-data',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserListController::users_data
 * @see app/Http/Controllers/UserListController.php:39
 * @route '/superusuario/users-data'
 */
users_data.url = (options?: RouteQueryOptions) => {
    return users_data.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserListController::users_data
 * @see app/Http/Controllers/UserListController.php:39
 * @route '/superusuario/users-data'
 */
users_data.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users_data.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserListController::users_data
 * @see app/Http/Controllers/UserListController.php:39
 * @route '/superusuario/users-data'
 */
users_data.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: users_data.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserListController::create_default
 * @see app/Http/Controllers/UserListController.php:113
 * @route '/superusuario/create-superuser'
 */
export const create_default = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create_default.url(options),
    method: 'post',
})

create_default.definition = {
    methods: ["post"],
    url: '/superusuario/create-superuser',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserListController::create_default
 * @see app/Http/Controllers/UserListController.php:113
 * @route '/superusuario/create-superuser'
 */
create_default.url = (options?: RouteQueryOptions) => {
    return create_default.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserListController::create_default
 * @see app/Http/Controllers/UserListController.php:113
 * @route '/superusuario/create-superuser'
 */
create_default.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create_default.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::workers_list
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/superusuario/workers-list'
 */
export const workers_list = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: workers_list.url(options),
    method: 'get',
})

workers_list.definition = {
    methods: ["get","head"],
    url: '/superusuario/workers-list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::workers_list
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/superusuario/workers-list'
 */
workers_list.url = (options?: RouteQueryOptions) => {
    return workers_list.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::workers_list
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/superusuario/workers-list'
 */
workers_list.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: workers_list.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::workers_list
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/superusuario/workers-list'
 */
workers_list.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: workers_list.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserListController::reports_users
 * @see app/Http/Controllers/UserListController.php:39
 * @route '/superusuario/reports/users'
 */
export const reports_users = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports_users.url(options),
    method: 'get',
})

reports_users.definition = {
    methods: ["get","head"],
    url: '/superusuario/reports/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserListController::reports_users
 * @see app/Http/Controllers/UserListController.php:39
 * @route '/superusuario/reports/users'
 */
reports_users.url = (options?: RouteQueryOptions) => {
    return reports_users.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserListController::reports_users
 * @see app/Http/Controllers/UserListController.php:39
 * @route '/superusuario/reports/users'
 */
reports_users.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports_users.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserListController::reports_users
 * @see app/Http/Controllers/UserListController.php:39
 * @route '/superusuario/reports/users'
 */
reports_users.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports_users.url(options),
    method: 'head',
})
const superusuario = {
    dashboard: Object.assign(dashboard, dashboard),
users_data: Object.assign(users_data, users_data),
users: Object.assign(users, users),
create_default: Object.assign(create_default, create_default),
workers_list: Object.assign(workers_list, workers_list),
reports_users: Object.assign(reports_users, reports_users),
}

export default superusuario