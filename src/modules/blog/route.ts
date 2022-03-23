import { Router, Request, Response, NextFunction } from "express";
import { injectable } from "inversify";
import { AppRouter } from "../../shared/httpServer";
import { PostAppInternal } from "../post/postIntefaces";
import { BlogFilter, BlogResponse, BlogWithId } from "./blogInterfaces";
import { BlogController } from "./controller";
import { NotFound } from "http-errors";
import { PostController } from "../post/controller";
import { isNil, pick } from "ramda";
import { PostMapper } from "../post/postMapper";

@injectable()
export class BlogRouter implements AppRouter {

    private router: Router;

    constructor(
        private blogController: BlogController,
        private postController: PostController
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
            const createdPosts = await this.postController.createPostsInBulk(createdBlog.id, posts);
            return res.send(this.mapToBlogResponse(createdBlog, createdPosts));
        } catch (error) {
            console.error(error);
            return next(error);
        }

    }

    async handleGetAll(req: Request, res: Response, next: NextFunction) {
        try {
            const blogs = await this.blogController.readBlogs({});

            let posts: PostAppInternal[] = [];
            if (!isNil(req.query.showPosts)) {
                posts = await this.postController.getPostsByBlogIds(blogs.map(blog => blog.id));
            }

            return res.send(
                blogs.map(blog => this.mapToBlogResponse(
                    blog,
                    posts.filter(post => post.blogId === blog.id)
                ))
            );
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

            let posts: PostAppInternal[] = [];
            if (!isNil(req.query.showPosts)) {
                posts = await this.postController.getPostsByBlogId(blogs[0].id);
            }

            return res.send(this.mapToBlogResponse(blogs[0], posts));
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

    mapToBlogResponse(blog: BlogWithId, posts: PostAppInternal[]): BlogResponse {
        return {
            ...pick(["name", "slug"], blog),
            posts: posts.map(post => PostMapper.mapPostAppInternalToPostResponse(post))
        };
    }
}