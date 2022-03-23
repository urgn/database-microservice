import { Router, Request, Response, NextFunction } from "express";
import { injectable } from "inversify";
import { AppRouter } from "../../shared/httpServer";
import { BlogController } from "../blog/controller";
import { PostController } from "./controller";
import { NotFound, BadRequest } from "http-errors";
import { BlogWithId } from "../blog/blogInterfaces";
import { PostAppInternal, PostResponse } from "./postIntefaces";


@injectable()
export class PostRouter implements AppRouter {

    private router: Router;

    constructor(
        private blogController: BlogController,
        private postController: PostController
    ) {
        this.router = Router({ mergeParams: true });

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

    async handlePost(req: Request, res: Response, next: NextFunction) {
        try {
            const blog = await this.fetchBlogBySlug(req);
            const { ...postInput } = req.body;

            const post = await this.postController.createPost(blog.id, postInput);

            res.send(this.mapPostAppInternalToPostResponse(post));
        } catch (error) {
            next(error);
        }
    }

    async handleGetOne(req: Request, res: Response, next: NextFunction) {
        try {
            const post = await this.fetchPostRelatedToBlog(req);
            return res.send(this.mapPostAppInternalToPostResponse(post));
        } catch (error) {
            return next(error);
        }
    }

    async handleUpdate(req: Request, res: Response) {
        res.send({
            result: "post updated",
            blog: req.params.slug,
            post: req.params.postId
        });
    }

    async handleDelete(req: Request, res: Response, next: NextFunction) {
        try {
            const post = await this.fetchPostRelatedToBlog(req);
            await this.postController.deletePost(post.id);
            return res.send(this.mapPostAppInternalToPostResponse(post));
        } catch (error) {
            return next(error);
        }
    }

    private async fetchBlogBySlug(req: Request): Promise<BlogWithId> {
        const { slug } = req.params;

        if (!slug) {
            throw new BadRequest("Invalid blog slug");
        }

        const relatedBlog = await this.blogController.getBlogBySlug(slug)

        if (!relatedBlog) {
            throw new NotFound("Blog not found");
        }

        return relatedBlog
    }

    private async fetchPostRelatedToBlog(req) {
        const blog = await this.fetchBlogBySlug(req);
        const { postId } = req.params;

        if (!postId) {
            throw new BadRequest("Missing post id");
        }

        const post = await this.postController.getOnePost(postId);

        if (!post || post.blogId !== blog.id) {
            throw new NotFound(`Post with id ${postId} not found`);
        }

        return post;
    }

    private mapPostAppInternalToPostResponse(
        { id, title, viewCount, content }: PostAppInternal
    ): PostResponse {
        return ({
            id, title, viewCount, content
        })
    }
}