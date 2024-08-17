import { Router, Express } from "express";
import healthRouter from "../features/healthCheck/healthCheck.router";
import loginRouter from "../features/login/login.router";
import espRouter from "../features/esp/esp.router";

export const setupRoutes = (app: Express): void => {
    const router: Router = Router();

    app.use('/api', router);
    router.use(healthRouter);
    router.use('/login',loginRouter);
    router.use('/esp', espRouter)
}