import { Router } from "express";
import loginController from "./login.controller";

const loginRouter: Router = Router();

loginRouter.post('/login', loginController.login )
loginRouter.post('/refresh', loginController.refresh )

export default loginRouter;