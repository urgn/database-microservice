import { injectable } from "inversify";
import { BlogId } from "../blog/blogInterfaces";
import { PostCollection } from "./postCollection";
import { Post, PostAppInternal, PostId } from "./postIntefaces";

@injectable()
export class PostController {
    constructor(
        private postCollection: PostCollection
    ) {

    }

    async createPost(blogId: BlogId, post: Post): Promise<PostAppInternal> {
        return await this.postCollection.create({
            ...post,
            blogId
        });
    }

    async createPostsInBulk(
        blogId: BlogId,
        posts: Post[]
    ): Promise<PostAppInternal[]> {
        throw new Error("Not implemented yet!");
    }

    async getPosts(
        blogId: BlogId
    ): Promise<PostAppInternal> {
        throw new Error("Not implemented yet!");

    }

    async getOnePost(
        postId: PostId
    ): Promise<PostAppInternal> {
        throw new Error("Not implemented yet!");
    }

    async updatePost(
        postId: PostId,
        postBody: Post
    ): Promise<PostAppInternal> {
        throw new Error("Not implemented yet!");
    }

    async deletePost(
        postId: PostId
    ): Promise<void> {
        throw new Error("Not implemented yet!");
    }
}