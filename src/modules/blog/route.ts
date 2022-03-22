import { Router, Request, Response } from "express";
import { injectable } from "inversify";
import { AppRouter } from "../../shared/httpServer";
import { BlogController } from "./controller";

@injectable()
export class BlogRouter implements AppRouter {

    private router: Router;

    constructor(
        private blogController: BlogController
    ) {
        this.router = Router();

        this.router.post("/", this.handlePost.bind(this));
        this.router.get("/", this.handleGet.bind(this));
    }

    get path() {
        return "/blog";
    }

    get expressRouter() {
        return this.router;
    }

    async handlePost(req: Request, res: Response) {
        res.send(await this.blogController.createBlog(req.body));
    }

    async handleGet(req: Request, res: Response) {
        res.send({
            foo: "bar"
        });
    }
}