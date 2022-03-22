import { Router, Request, Response } from "express";
import { injectable } from "inversify";
import { Post } from "../../models";
import { AppRouter } from "../../shared/httpServer";
import { BlogFilter, BlogWithId } from "./blogInterfaces";
import { BlogController } from "./controller";

export type BlogResponse = BlogWithId & {
    posts: Post[];
}

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
        this.router.put("/:slug", this.handleUpdate.bind(this));
        this.router.delete("/:slug", this.handleDelete.bind(this));
    }

    get path() {
        return "/blog";
    }

    get expressRouter() {
        return this.router;
    }

    async handlePost(req: Request, res: Response) {
        const { posts, ...blog } = req.body;
        const createdBlog = await this.blogController.createBlog(blog);
        res.send(this.mapToBlogResponse(createdBlog, []));
    }

    async handleGetAll(req: Request, res: Response) {
        const filter: BlogFilter = {};
        const blogs = await this.blogController.readBlogs(filter);
        res.send(blogs.map(blog => this.mapToBlogResponse(blog, [])));
    }

    async handleGetOne(req: Request, res: Response) {
        const blogs = await this.blogController.readBlogs({
            slug: req.params.slug
        });

        if (!blogs?.length) {
            res.status(404);
            return res.send();
        }

        res.send(this.mapToBlogResponse(blogs[0], []));
    }

    async handleUpdate(req: Request, res: Response) {
        const { posts, ...blog } = req.body;
        const targetBlog = await this.blogController.getBlogBySlug(req.params.slug);

        if (!targetBlog) {
            res.status(404);
            return res.send();
        }

        const updatedBlog = await this.blogController.updateBlog(targetBlog.id, blog);

        res.status(200);
        res.send(this.mapToBlogResponse(updatedBlog, []));
    }

    async handleDelete(req: Request, res: Response) {
        const blog = await this.blogController.getBlogBySlug(req.params.slug);

        if (!blog) {
            res.status(404);
            return res.send();
        }

        await this.blogController.deleteBlog(blog.id);

        res.status(200);
        res.send();
    }

    mapToBlogResponse(blog: BlogWithId, posts: Post[]): BlogResponse {
        const { id, name, slug } = blog;

        return {
            id,
            name,
            slug,
            posts: []
        };
    }
}