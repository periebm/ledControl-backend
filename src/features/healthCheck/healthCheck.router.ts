import { Router } from "express";
import healthCheckController from "./healthCheck.controller";
import { authorizationMiddleware } from "../../middlewares/authorization.middleware";

const healthRouter: Router = Router();

healthRouter.get('/health', healthCheckController.checkHealth )

export default healthRouter;