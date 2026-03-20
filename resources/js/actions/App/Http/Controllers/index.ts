import RedirectAfterLoginController from './RedirectAfterLoginController'
import WorkerController from './WorkerController'
import AdminController from './AdminController'
import UserListController from './UserListController'
const Controllers = {
    RedirectAfterLoginController: Object.assign(RedirectAfterLoginController, RedirectAfterLoginController),
WorkerController: Object.assign(WorkerController, WorkerController),
AdminController: Object.assign(AdminController, AdminController),
UserListController: Object.assign(UserListController, UserListController),
}

export default Controllers