import { injectable } from "inversify";
import { Blog } from "../../models";
import {
    BlogWithId,
    BlogCollection,
    BlogId
} from "./blogCollection";

export type BlogResponse = BlogWithId & {
    posts: []
}


@injectable()
export class BlogController {

    constructor(
        private blogCollection: BlogCollection
    ) {
    }

    async createBlog(spec: Blog): Promise<BlogResponse> {
        const { id, name, slug } = await this.blogCollection.create(spec);

        return {
            id,
            name,
            slug,
            posts: []
        };
    }

    // readBlog(filter: ReadBlogFilter) {

    // }

    updateBlog(blogId: BlogId, data: Partial<Blog>) {

    }

    deleteBlog(blogId: BlogId) {

    }
}