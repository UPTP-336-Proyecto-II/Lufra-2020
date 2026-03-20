import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import workers52a5e7 from './workers'
import vacations72464b from './vacations'
import types_nomina9f49b4 from './types_nomina'
import conceptsA1ca89 from './concepts'
import payroll from './payroll'
import cargosBe217e from './cargos'
/**
* @see \App\Http\Controllers\AdminController::workers
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/administrativo/workers'
 */
export const workers = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: workers.url(options),
    method: 'get',
})

workers.definition = {
    methods: ["get","head"],
    url: '/administrativo/workers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::workers
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/administrativo/workers'
 */
workers.url = (options?: RouteQueryOptions) => {
    return workers.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::workers
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/administrativo/workers'
 */
workers.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: workers.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::workers
 * @see app/Http/Controllers/AdminController.php:18
 * @route '/administrativo/workers'
 */
workers.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: workers.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::vacations
 * @see app/Http/Controllers/AdminController.php:178
 * @route '/administrativo/vacations'
 */
export const vacations = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vacations.url(options),
    method: 'get',
})

vacations.definition = {
    methods: ["get","head"],
    url: '/administrativo/vacations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::vacations
 * @see app/Http/Controllers/AdminController.php:178
 * @route '/administrativo/vacations'
 */
vacations.url = (options?: RouteQueryOptions) => {
    return vacations.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::vacations
 * @see app/Http/Controllers/AdminController.php:178
 * @route '/administrativo/vacations'
 */
vacations.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vacations.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::vacations
 * @see app/Http/Controllers/AdminController.php:178
 * @route '/administrativo/vacations'
 */
vacations.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: vacations.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::types_nomina
 * @see app/Http/Controllers/AdminController.php:208
 * @route '/administrativo/types-nomina'
 */
export const types_nomina = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: types_nomina.url(options),
    method: 'get',
})

types_nomina.definition = {
    methods: ["get","head"],
    url: '/administrativo/types-nomina',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::types_nomina
 * @see app/Http/Controllers/AdminController.php:208
 * @route '/administrativo/types-nomina'
 */
types_nomina.url = (options?: RouteQueryOptions) => {
    return types_nomina.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::types_nomina
 * @see app/Http/Controllers/AdminController.php:208
 * @route '/administrativo/types-nomina'
 */
types_nomina.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: types_nomina.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::types_nomina
 * @see app/Http/Controllers/AdminController.php:208
 * @route '/administrativo/types-nomina'
 */
types_nomina.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: types_nomina.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::concepts
 * @see app/Http/Controllers/AdminController.php:245
 * @route '/administrativo/concepts'
 */
export const concepts = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: concepts.url(options),
    method: 'get',
})

concepts.definition = {
    methods: ["get","head"],
    url: '/administrativo/concepts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::concepts
 * @see app/Http/Controllers/AdminController.php:245
 * @route '/administrativo/concepts'
 */
concepts.url = (options?: RouteQueryOptions) => {
    return concepts.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::concepts
 * @see app/Http/Controllers/AdminController.php:245
 * @route '/administrativo/concepts'
 */
concepts.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: concepts.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::concepts
 * @see app/Http/Controllers/AdminController.php:245
 * @route '/administrativo/concepts'
 */
concepts.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: concepts.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::cargos
 * @see app/Http/Controllers/AdminController.php:321
 * @route '/administrativo/cargos'
 */
export const cargos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cargos.url(options),
    method: 'get',
})

cargos.definition = {
    methods: ["get","head"],
    url: '/administrativo/cargos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::cargos
 * @see app/Http/Controllers/AdminController.php:321
 * @route '/administrativo/cargos'
 */
cargos.url = (options?: RouteQueryOptions) => {
    return cargos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::cargos
 * @see app/Http/Controllers/AdminController.php:321
 * @route '/administrativo/cargos'
 */
cargos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cargos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::cargos
 * @see app/Http/Controllers/AdminController.php:321
 * @route '/administrativo/cargos'
 */
cargos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cargos.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::education_levels
 * @see app/Http/Controllers/AdminController.php:357
 * @route '/administrativo/education-levels'
 */
export const education_levels = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: education_levels.url(options),
    method: 'get',
})

education_levels.definition = {
    methods: ["get","head"],
    url: '/administrativo/education-levels',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::education_levels
 * @see app/Http/Controllers/AdminController.php:357
 * @route '/administrativo/education-levels'
 */
education_levels.url = (options?: RouteQueryOptions) => {
    return education_levels.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::education_levels
 * @see app/Http/Controllers/AdminController.php:357
 * @route '/administrativo/education-levels'
 */
education_levels.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: education_levels.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::education_levels
 * @see app/Http/Controllers/AdminController.php:357
 * @route '/administrativo/education-levels'
 */
education_levels.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: education_levels.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserListController::users
 * @see app/Http/Controllers/UserListController.php:9
 * @route '/superusuario/admin/users'
 */
export const users = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})

users.definition = {
    methods: ["get","head"],
    url: '/superusuario/admin/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserListController::users
 * @see app/Http/Controllers/UserListController.php:9
 * @route '/superusuario/admin/users'
 */
users.url = (options?: RouteQueryOptions) => {
    return users.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserListController::users
 * @see app/Http/Controllers/UserListController.php:9
 * @route '/superusuario/admin/users'
 */
users.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserListController::users
 * @see app/Http/Controllers/UserListController.php:9
 * @route '/superusuario/admin/users'
 */
users.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: users.url(options),
    method: 'head',
})
const admin = {
    workers: Object.assign(workers, workers52a5e7),
vacations: Object.assign(vacations, vacations72464b),
types_nomina: Object.assign(types_nomina, types_nomina9f49b4),
concepts: Object.assign(concepts, conceptsA1ca89),
payroll: Object.assign(payroll, payroll),
cargos: Object.assign(cargos, cargosBe217e),
education_levels: Object.assign(education_levels, education_levels),
users: Object.assign(users, users),
}

export default admin