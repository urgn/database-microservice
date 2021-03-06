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
		if (posts.length < 1) {
			return [];
		}
		return await this.postCollection.createMany(
			posts.map(post => ({
				...post,
				blogId
			}))
		);
	}

	async getPostsByBlogId(
		blogId: BlogId
	): Promise<PostAppInternal[]> {
		return await this.postCollection.read({ blogId });
	}

	async getPostsByBlogIds(
		blogIds: BlogId[]
	): Promise<PostAppInternal[]> {
		return await this.postCollection.read({ blogIds });
	}

	async getOnePost(
		postId: PostId
	): Promise<PostAppInternal> {
		const posts = await this.postCollection.read({
			id: postId
		});

		if (posts.length !== 1) {
			return null;
		}

		return posts[0];
	}

	async updatePost(
		postId: PostId,
		postBody: Post
	): Promise<PostAppInternal> {
		return await this.postCollection.update(postId, postBody);
	}

	async deletePost(
		postId: PostId
	): Promise<void> {
		await this.postCollection.delete(postId);
	}
}