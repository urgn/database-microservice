import { Router, Request, Response, NextFunction } from "express";
import { injectable } from "inversify";
import { AppRouter } from "../../shared/httpServer";
import { Post } from "../post/postIntefaces";
import { BlogFilter, BlogResponse, BlogWithId } from "./blogInterfaces";
import { BlogController } from "./controller";
import { NotFound } from "http-errors";

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

    async handlePost(req: Request, res: Response, next: NextFunction) {
        try {
            const { posts, ...blog } = req.body;
            const createdBlog = await this.blogController.createBlog(blog);
            return res.send(this.mapToBlogResponse(createdBlog, []));
        } catch (error) {
            console.error(error);
            return next(error);
        }

    }

    async handleGetAll(req: Request, res: Response, next: NextFunction) {
        try {
            const filter: BlogFilter = {};
            const blogs = await this.blogController.readBlogs(filter);
            return res.send(blogs.map(blog => this.mapToBlogResponse(blog, [])));
        } catch (error) {
            console.error(error);
            return next(error);
        }
    }

    async handleGetOne(req: Request, res: Response, next: NextFunction) {
        try {
            const blogs = await this.blogController.readBlogs({
                slug: req.params.slug
            });

            if (!blogs?.length) {
                return next(new NotFound("Blog not found"));
            }

            return res.send(this.mapToBlogResponse(blogs[0], []));
        } catch (error) {
            console.error(error);
            return next(error);
        }
    }

    async handleUpdate(req: Request, res: Response, next: NextFunction) {
        try {
            const { posts, ...blog } = req.body;
            const targetBlog = await this.blogController.getBlogBySlug(req.params.slug);

            if (!targetBlog) {
                return next(new NotFound("Blog not found"));
            }

            const updatedBlog = await this.blogController.updateBlog(targetBlog.id, blog);

            return res.status(200).send(this.mapToBlogResponse(updatedBlog, []));
        } catch (error) {
            console.error(error);
            return next(error);
        }
    }

    async handleDelete(req: Request, res: Response, next: NextFunction) {
        try {
            const blog = await this.blogController.getBlogBySlug(req.params.slug);

            if (!blog) {
                return next(new NotFound("Blog not found"));
            }

            await this.blogController.deleteBlog(blog.id);

            return res.status(200).send();
        } catch (error) {
            console.error(error);
            return next(error);
        }
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