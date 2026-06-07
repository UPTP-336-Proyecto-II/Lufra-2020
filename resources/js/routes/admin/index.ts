import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import seguridad from './seguridad'
import workers52a5e7 from './workers'
import vacations72464b from './vacations'
import vacation_paymentsA5435a from './vacation_payments'
import permission_requests50e352 from './permission_requests'
import types_nomina9f49b4 from './types_nomina'
import conceptsA1ca89 from './concepts'
import payroll from './payroll'
import cargosBe217e from './cargos'
/**
* @see \App\Http\Controllers\AdminController::workers
* @see app/Http/Controllers/AdminController.php:19
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
* @see app/Http/Controllers/AdminController.php:19
* @route '/administrativo/workers'
*/
workers.url = (options?: RouteQueryOptions) => {
    return workers.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::workers
* @see app/Http/Controllers/AdminController.php:19
* @route '/administrativo/workers'
*/
workers.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: workers.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::workers
* @see app/Http/Controllers/AdminController.php:19
* @route '/administrativo/workers'
*/
workers.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: workers.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::workers
* @see app/Http/Controllers/AdminController.php:19
* @route '/administrativo/workers'
*/
const workersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: workers.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::workers
* @see app/Http/Controllers/AdminController.php:19
* @route '/administrativo/workers'
*/
workersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: workers.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::workers
* @see app/Http/Controllers/AdminController.php:19
* @route '/administrativo/workers'
*/
workersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: workers.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

workers.form = workersForm

/**
* @see \App\Http\Controllers\AdminController::vacations
* @see app/Http/Controllers/AdminController.php:226
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
* @see app/Http/Controllers/AdminController.php:226
* @route '/administrativo/vacations'
*/
vacations.url = (options?: RouteQueryOptions) => {
    return vacations.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::vacations
* @see app/Http/Controllers/AdminController.php:226
* @route '/administrativo/vacations'
*/
vacations.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vacations.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::vacations
* @see app/Http/Controllers/AdminController.php:226
* @route '/administrativo/vacations'
*/
vacations.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: vacations.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::vacations
* @see app/Http/Controllers/AdminController.php:226
* @route '/administrativo/vacations'
*/
const vacationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: vacations.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::vacations
* @see app/Http/Controllers/AdminController.php:226
* @route '/administrativo/vacations'
*/
vacationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: vacations.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::vacations
* @see app/Http/Controllers/AdminController.php:226
* @route '/administrativo/vacations'
*/
vacationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: vacations.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

vacations.form = vacationsForm

/**
* @see \App\Http\Controllers\AdminController::vacation_payments
* @see app/Http/Controllers/AdminController.php:1219
* @route '/administrativo/vacation-payments'
*/
export const vacation_payments = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vacation_payments.url(options),
    method: 'get',
})

vacation_payments.definition = {
    methods: ["get","head"],
    url: '/administrativo/vacation-payments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::vacation_payments
* @see app/Http/Controllers/AdminController.php:1219
* @route '/administrativo/vacation-payments'
*/
vacation_payments.url = (options?: RouteQueryOptions) => {
    return vacation_payments.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::vacation_payments
* @see app/Http/Controllers/AdminController.php:1219
* @route '/administrativo/vacation-payments'
*/
vacation_payments.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vacation_payments.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::vacation_payments
* @see app/Http/Controllers/AdminController.php:1219
* @route '/administrativo/vacation-payments'
*/
vacation_payments.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: vacation_payments.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::vacation_payments
* @see app/Http/Controllers/AdminController.php:1219
* @route '/administrativo/vacation-payments'
*/
const vacation_paymentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: vacation_payments.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::vacation_payments
* @see app/Http/Controllers/AdminController.php:1219
* @route '/administrativo/vacation-payments'
*/
vacation_paymentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: vacation_payments.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::vacation_payments
* @see app/Http/Controllers/AdminController.php:1219
* @route '/administrativo/vacation-payments'
*/
vacation_paymentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: vacation_payments.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

vacation_payments.form = vacation_paymentsForm

/**
* @see \App\Http\Controllers\AdminController::permission_requests
* @see app/Http/Controllers/AdminController.php:1478
* @route '/administrativo/permission-requests'
*/
export const permission_requests = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: permission_requests.url(options),
    method: 'get',
})

permission_requests.definition = {
    methods: ["get","head"],
    url: '/administrativo/permission-requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::permission_requests
* @see app/Http/Controllers/AdminController.php:1478
* @route '/administrativo/permission-requests'
*/
permission_requests.url = (options?: RouteQueryOptions) => {
    return permission_requests.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::permission_requests
* @see app/Http/Controllers/AdminController.php:1478
* @route '/administrativo/permission-requests'
*/
permission_requests.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: permission_requests.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::permission_requests
* @see app/Http/Controllers/AdminController.php:1478
* @route '/administrativo/permission-requests'
*/
permission_requests.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: permission_requests.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::permission_requests
* @see app/Http/Controllers/AdminController.php:1478
* @route '/administrativo/permission-requests'
*/
const permission_requestsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: permission_requests.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::permission_requests
* @see app/Http/Controllers/AdminController.php:1478
* @route '/administrativo/permission-requests'
*/
permission_requestsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: permission_requests.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::permission_requests
* @see app/Http/Controllers/AdminController.php:1478
* @route '/administrativo/permission-requests'
*/
permission_requestsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: permission_requests.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

permission_requests.form = permission_requestsForm

/**
* @see \App\Http\Controllers\AdminController::types_nomina
* @see app/Http/Controllers/AdminController.php:296
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
* @see app/Http/Controllers/AdminController.php:296
* @route '/administrativo/types-nomina'
*/
types_nomina.url = (options?: RouteQueryOptions) => {
    return types_nomina.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::types_nomina
* @see app/Http/Controllers/AdminController.php:296
* @route '/administrativo/types-nomina'
*/
types_nomina.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: types_nomina.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::types_nomina
* @see app/Http/Controllers/AdminController.php:296
* @route '/administrativo/types-nomina'
*/
types_nomina.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: types_nomina.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::types_nomina
* @see app/Http/Controllers/AdminController.php:296
* @route '/administrativo/types-nomina'
*/
const types_nominaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: types_nomina.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::types_nomina
* @see app/Http/Controllers/AdminController.php:296
* @route '/administrativo/types-nomina'
*/
types_nominaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: types_nomina.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::types_nomina
* @see app/Http/Controllers/AdminController.php:296
* @route '/administrativo/types-nomina'
*/
types_nominaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: types_nomina.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

types_nomina.form = types_nominaForm

/**
* @see \App\Http\Controllers\AdminController::concepts
* @see app/Http/Controllers/AdminController.php:357
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
* @see app/Http/Controllers/AdminController.php:357
* @route '/administrativo/concepts'
*/
concepts.url = (options?: RouteQueryOptions) => {
    return concepts.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::concepts
* @see app/Http/Controllers/AdminController.php:357
* @route '/administrativo/concepts'
*/
concepts.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: concepts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::concepts
* @see app/Http/Controllers/AdminController.php:357
* @route '/administrativo/concepts'
*/
concepts.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: concepts.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::concepts
* @see app/Http/Controllers/AdminController.php:357
* @route '/administrativo/concepts'
*/
const conceptsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: concepts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::concepts
* @see app/Http/Controllers/AdminController.php:357
* @route '/administrativo/concepts'
*/
conceptsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: concepts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::concepts
* @see app/Http/Controllers/AdminController.php:357
* @route '/administrativo/concepts'
*/
conceptsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: concepts.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

concepts.form = conceptsForm

/**
* @see \App\Http\Controllers\AdminController::cargos
* @see app/Http/Controllers/AdminController.php:1153
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
* @see app/Http/Controllers/AdminController.php:1153
* @route '/administrativo/cargos'
*/
cargos.url = (options?: RouteQueryOptions) => {
    return cargos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::cargos
* @see app/Http/Controllers/AdminController.php:1153
* @route '/administrativo/cargos'
*/
cargos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cargos.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::cargos
* @see app/Http/Controllers/AdminController.php:1153
* @route '/administrativo/cargos'
*/
cargos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cargos.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::cargos
* @see app/Http/Controllers/AdminController.php:1153
* @route '/administrativo/cargos'
*/
const cargosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: cargos.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::cargos
* @see app/Http/Controllers/AdminController.php:1153
* @route '/administrativo/cargos'
*/
cargosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: cargos.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::cargos
* @see app/Http/Controllers/AdminController.php:1153
* @route '/administrativo/cargos'
*/
cargosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: cargos.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

cargos.form = cargosForm

/**
* @see \App\Http\Controllers\AdminController::education_levels
* @see app/Http/Controllers/AdminController.php:1211
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
* @see app/Http/Controllers/AdminController.php:1211
* @route '/administrativo/education-levels'
*/
education_levels.url = (options?: RouteQueryOptions) => {
    return education_levels.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::education_levels
* @see app/Http/Controllers/AdminController.php:1211
* @route '/administrativo/education-levels'
*/
education_levels.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: education_levels.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::education_levels
* @see app/Http/Controllers/AdminController.php:1211
* @route '/administrativo/education-levels'
*/
education_levels.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: education_levels.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::education_levels
* @see app/Http/Controllers/AdminController.php:1211
* @route '/administrativo/education-levels'
*/
const education_levelsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: education_levels.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::education_levels
* @see app/Http/Controllers/AdminController.php:1211
* @route '/administrativo/education-levels'
*/
education_levelsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: education_levels.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::education_levels
* @see app/Http/Controllers/AdminController.php:1211
* @route '/administrativo/education-levels'
*/
education_levelsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: education_levels.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

education_levels.form = education_levelsForm

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

/**
* @see \App\Http\Controllers\UserListController::users
* @see app/Http/Controllers/UserListController.php:9
* @route '/superusuario/admin/users'
*/
const usersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: users.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserListController::users
* @see app/Http/Controllers/UserListController.php:9
* @route '/superusuario/admin/users'
*/
usersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: users.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserListController::users
* @see app/Http/Controllers/UserListController.php:9
* @route '/superusuario/admin/users'
*/
usersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: users.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

users.form = usersForm

const admin = {
    seguridad: Object.assign(seguridad, seguridad),
    workers: Object.assign(workers, workers52a5e7),
    vacations: Object.assign(vacations, vacations72464b),
    vacation_payments: Object.assign(vacation_payments, vacation_paymentsA5435a),
    permission_requests: Object.assign(permission_requests, permission_requests50e352),
    types_nomina: Object.assign(types_nomina, types_nomina9f49b4),
    concepts: Object.assign(concepts, conceptsA1ca89),
    payroll: Object.assign(payroll, payroll),
    cargos: Object.assign(cargos, cargosBe217e),
    education_levels: Object.assign(education_levels, education_levels),
    users: Object.assign(users, users),
}

export default admin