import { Router } from "express";
import espController from "./esp.controller";

const espRouter: Router = Router();

espRouter.get('/health', espController.checkHealth)

export default espRouter;