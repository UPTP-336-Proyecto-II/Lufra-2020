import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import users from './users'
import menu_config from './menu_config'
import worker from './worker'
import admin from './admin'
/**
* @see routes/modules.php:75
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
* @see routes/modules.php:75
* @route '/superusuario'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see routes/modules.php:75
* @route '/superusuario'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see routes/modules.php:75
* @route '/superusuario'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see routes/modules.php:75
* @route '/superusuario'
*/
const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see routes/modules.php:75
* @route '/superusuario'
*/
dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see routes/modules.php:75
* @route '/superusuario'
*/
dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

dashboard.form = dashboardForm

/**
* @see \App\Http\Controllers\UserListController::users_data
* @see app/Http/Controllers/UserListController.php:72
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
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/users-data'
*/
users_data.url = (options?: RouteQueryOptions) => {
    return users_data.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserListController::users_data
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/users-data'
*/
users_data.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users_data.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserListController::users_data
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/users-data'
*/
users_data.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: users_data.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserListController::users_data
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/users-data'
*/
const users_dataForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: users_data.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserListController::users_data
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/users-data'
*/
users_dataForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: users_data.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserListController::users_data
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/users-data'
*/
users_dataForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: users_data.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

users_data.form = users_dataForm

/**
* @see \App\Http\Controllers\UserListController::create_default
* @see app/Http/Controllers/UserListController.php:171
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
* @see app/Http/Controllers/UserListController.php:171
* @route '/superusuario/create-superuser'
*/
create_default.url = (options?: RouteQueryOptions) => {
    return create_default.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserListController::create_default
* @see app/Http/Controllers/UserListController.php:171
* @route '/superusuario/create-superuser'
*/
create_default.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create_default.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserListController::create_default
* @see app/Http/Controllers/UserListController.php:171
* @route '/superusuario/create-superuser'
*/
const create_defaultForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: create_default.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserListController::create_default
* @see app/Http/Controllers/UserListController.php:171
* @route '/superusuario/create-superuser'
*/
create_defaultForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: create_default.url(options),
    method: 'post',
})

create_default.form = create_defaultForm

/**
* @see \App\Http\Controllers\AdminController::workers_list
* @see app/Http/Controllers/AdminController.php:19
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
* @see app/Http/Controllers/AdminController.php:19
* @route '/superusuario/workers-list'
*/
workers_list.url = (options?: RouteQueryOptions) => {
    return workers_list.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::workers_list
* @see app/Http/Controllers/AdminController.php:19
* @route '/superusuario/workers-list'
*/
workers_list.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: workers_list.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::workers_list
* @see app/Http/Controllers/AdminController.php:19
* @route '/superusuario/workers-list'
*/
workers_list.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: workers_list.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::workers_list
* @see app/Http/Controllers/AdminController.php:19
* @route '/superusuario/workers-list'
*/
const workers_listForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: workers_list.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::workers_list
* @see app/Http/Controllers/AdminController.php:19
* @route '/superusuario/workers-list'
*/
workers_listForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: workers_list.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::workers_list
* @see app/Http/Controllers/AdminController.php:19
* @route '/superusuario/workers-list'
*/
workers_listForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: workers_list.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

workers_list.form = workers_listForm

/**
* @see \App\Http\Controllers\UserListController::reports_users
* @see app/Http/Controllers/UserListController.php:72
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
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/reports/users'
*/
reports_users.url = (options?: RouteQueryOptions) => {
    return reports_users.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserListController::reports_users
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/reports/users'
*/
reports_users.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports_users.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserListController::reports_users
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/reports/users'
*/
reports_users.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports_users.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserListController::reports_users
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/reports/users'
*/
const reports_usersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reports_users.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserListController::reports_users
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/reports/users'
*/
reports_usersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reports_users.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserListController::reports_users
* @see app/Http/Controllers/UserListController.php:72
* @route '/superusuario/reports/users'
*/
reports_usersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reports_users.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

reports_users.form = reports_usersForm

/**
* @see \App\Http\Controllers\AdminController::system_logs
* @see app/Http/Controllers/AdminController.php:1556
* @route '/superusuario/system-logs'
*/
export const system_logs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: system_logs.url(options),
    method: 'get',
})

system_logs.definition = {
    methods: ["get","head"],
    url: '/superusuario/system-logs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::system_logs
* @see app/Http/Controllers/AdminController.php:1556
* @route '/superusuario/system-logs'
*/
system_logs.url = (options?: RouteQueryOptions) => {
    return system_logs.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::system_logs
* @see app/Http/Controllers/AdminController.php:1556
* @route '/superusuario/system-logs'
*/
system_logs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: system_logs.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::system_logs
* @see app/Http/Controllers/AdminController.php:1556
* @route '/superusuario/system-logs'
*/
system_logs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: system_logs.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::system_logs
* @see app/Http/Controllers/AdminController.php:1556
* @route '/superusuario/system-logs'
*/
const system_logsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: system_logs.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::system_logs
* @see app/Http/Controllers/AdminController.php:1556
* @route '/superusuario/system-logs'
*/
system_logsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: system_logs.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::system_logs
* @see app/Http/Controllers/AdminController.php:1556
* @route '/superusuario/system-logs'
*/
system_logsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: system_logs.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

system_logs.form = system_logsForm

/**
* @see \App\Http\Controllers\AdminController::dashboard_metrics
* @see app/Http/Controllers/AdminController.php:1592
* @route '/superusuario/dashboard-metrics'
*/
export const dashboard_metrics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard_metrics.url(options),
    method: 'get',
})

dashboard_metrics.definition = {
    methods: ["get","head"],
    url: '/superusuario/dashboard-metrics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::dashboard_metrics
* @see app/Http/Controllers/AdminController.php:1592
* @route '/superusuario/dashboard-metrics'
*/
dashboard_metrics.url = (options?: RouteQueryOptions) => {
    return dashboard_metrics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::dashboard_metrics
* @see app/Http/Controllers/AdminController.php:1592
* @route '/superusuario/dashboard-metrics'
*/
dashboard_metrics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard_metrics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::dashboard_metrics
* @see app/Http/Controllers/AdminController.php:1592
* @route '/superusuario/dashboard-metrics'
*/
dashboard_metrics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard_metrics.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::dashboard_metrics
* @see app/Http/Controllers/AdminController.php:1592
* @route '/superusuario/dashboard-metrics'
*/
const dashboard_metricsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard_metrics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::dashboard_metrics
* @see app/Http/Controllers/AdminController.php:1592
* @route '/superusuario/dashboard-metrics'
*/
dashboard_metricsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard_metrics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::dashboard_metrics
* @see app/Http/Controllers/AdminController.php:1592
* @route '/superusuario/dashboard-metrics'
*/
dashboard_metricsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard_metrics.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

dashboard_metrics.form = dashboard_metricsForm

const superusuario = {
    dashboard: Object.assign(dashboard, dashboard),
    users_data: Object.assign(users_data, users_data),
    users: Object.assign(users, users),
    create_default: Object.assign(create_default, create_default),
    menu_config: Object.assign(menu_config, menu_config),
    workers_list: Object.assign(workers_list, workers_list),
    reports_users: Object.assign(reports_users, reports_users),
    worker: Object.assign(worker, worker),
    system_logs: Object.assign(system_logs, system_logs),
    dashboard_metrics: Object.assign(dashboard_metrics, dashboard_metrics),
    admin: Object.assign(admin, admin),
}

export default superusuario