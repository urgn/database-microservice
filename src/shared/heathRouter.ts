import { Router, Request, Response } from "express";
import { injectable } from "inversify";
import { AppRouter } from "./httpServer";

@injectable()
export class HealthRouter implements AppRouter {

    private router: Router;

    constructor() {
        this.router = Router();
        this.router.get("/", this.onHealthChech.bind(this));
    }

    get path() {
        return "health";
    }

    get expressRouter() {
        return this.router;
    }

    onHealthChech(req: Request, res: Response) {
        res.status(200);
        res.json({
            status: "ok"
        });
    }
}