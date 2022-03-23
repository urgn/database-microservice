import { injectable } from "inversify";
import { BlogCollection } from "./blogCollection";
import {
	Blog,
	BlogWithId,
	BlogId,
	BlogFilter
} from "./blogInterfaces";

@injectable()
export class BlogController {

	constructor(
        private blogCollection: BlogCollection
	) {
	}

	async createBlog(spec: Blog): Promise<BlogWithId> {
		return await this.blogCollection.create(spec);
	}

	async readBlogs(filter: BlogFilter): Promise<BlogWithId[]> {
		return await this.blogCollection.read(filter);

	}

	async getBlogBySlug(slug: string): Promise<BlogWithId> {
		const blogs = await this.blogCollection.read({ slug });

		if (blogs.length !== 1) {
			return null;
		}

		return blogs[0];
	}

	async updateBlog(blogId: BlogId, data: Blog): Promise<BlogWithId> {
		return await this.blogCollection.update(blogId, data);
	}

	async deleteBlog(blogId: BlogId): Promise<void> {
		await this.blogCollection.delete(blogId);
	}
}