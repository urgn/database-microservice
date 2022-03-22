import { Router, Request, Response } from "express";
import { injectable } from "inversify";
import { AppRouter } from "../../shared/httpServer";
@injectable()
export class PostRouter implements AppRouter {

    private router: Router;

    constructor(
    ) {
        this.router = Router({mergeParams: true});

        this.router.post("/", this.handlePost.bind(this));
        this.router.get("/:postId", this.handleGetOne.bind(this));
        this.router.put("/:postId", this.handleUpdate.bind(this));
        this.router.delete("/:postId", this.handleDelete.bind(this));
    }

    get path() {
        return "/blog/:slug";
    }

    get expressRouter() {
        return this.router;
    }

    async handlePost(req: Request, res: Response) {
        res.send({
            result: "post created",
            blog: req.params.slug
        });
    }

    async handleGetOne(req: Request, res: Response) {
        res.send({
            result: "post returned",
            blog: req.params.slug,
            post: req.params.postId
        });
    }

    async handleUpdate(req: Request, res: Response) {
        res.send({
            result: "post updated",
            blog: req.params.slug,
            post: req.params.postId
        });
    }

    async handleDelete(req: Request, res: Response) {
        res.send({
            result: "post deleted",
            blog: req.params.slug,
            post: req.params.postId
        });
    }
}