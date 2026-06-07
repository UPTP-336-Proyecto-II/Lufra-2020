import CustomLoginController from './CustomLoginController'
import SeguridadController from './SeguridadController'

const Auth = {
    CustomLoginController: Object.assign(CustomLoginController, CustomLoginController),
    SeguridadController: Object.assign(SeguridadController, SeguridadController),
}

export default Auth