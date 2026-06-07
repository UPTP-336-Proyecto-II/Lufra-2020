import Auth from './Auth'
import RedirectAfterLoginController from './RedirectAfterLoginController'
import WorkerController from './WorkerController'
import AdminController from './AdminController'
import UserListController from './UserListController'
import MenuConfigController from './MenuConfigController'

const Controllers = {
    Auth: Object.assign(Auth, Auth),
    RedirectAfterLoginController: Object.assign(RedirectAfterLoginController, RedirectAfterLoginController),
    WorkerController: Object.assign(WorkerController, WorkerController),
    AdminController: Object.assign(AdminController, AdminController),
    UserListController: Object.assign(UserListController, UserListController),
    MenuConfigController: Object.assign(MenuConfigController, MenuConfigController),
}

export default Controllers