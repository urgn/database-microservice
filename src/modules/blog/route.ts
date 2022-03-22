import { Router, Request, Response } from "express";
import { injectable } from "inversify";
import { AppRouter } from "../../shared/httpServer";
import { BlogFilter } from "./blogCollection";
import { BlogController } from "./controller";

@injectable()
export class BlogRouter implements AppRouter {

    private router: Router;

    constructor(
        private blogController: BlogController
    ) {
        this.router = Router();

        this.router.post("/", this.handlePost.bind(this));
        this.router.get("/", this.handleGetAll.bind(this));
        this.router.get("/:slug", this.handleGetOne.bind(this));
    }

    get path() {
        return "/blog";
    }

    get expressRouter() {
        return this.router;
    }

    async handlePost(req: Request, res: Response) {
        const { posts, ...blog } = req.body;
        res.send(await this.blogController.createBlog(blog));
    }

    async handleGetAll(req: Request, res: Response) {
        const filter: BlogFilter = {};

        if (req.query.id) {
            filter.id = `${req.query.id}`;
        }

        if (req.query.slug) {
            filter.id = `${req.query.id}`;
        }

        if (req.query.name) {
            filter.name = `${req.query.name}`;
        }

        res.send(await this.blogController.readBlogs(filter));
    }

    async handleGetOne(req: Request, res: Response) {

        const blogs = await this.blogController.readBlogs({
            slug: req.params.slug
        });

        if (!blogs?.length) {
            res.status(404);
            return res.send();
        }

        res.send(blogs[0]);
    }
}