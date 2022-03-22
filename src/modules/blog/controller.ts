import { injectable } from "inversify";
import { Blog, Post } from "../../models";
import {
    BlogWithId,
    BlogCollection,
    BlogId,
    BlogFilter
} from "./blogCollection";

export type BlogResponse = BlogWithId & {
    posts: []
}

export interface ReadBlogFilter {
    id: BlogId;
    slug: string;
}

@injectable()
export class BlogController {

    constructor(
        private blogCollection: BlogCollection
    ) {
    }

    async createBlog(spec: Blog): Promise<BlogResponse> {
        const blog = await this.blogCollection.create(spec);
        return this.mapToBlogResponse(blog, []);
    }

    async readBlogs(filter: BlogFilter) {
        const blogs = await this.blogCollection.read(filter);

        return blogs.map(blog => this.mapToBlogResponse(blog, []));
    }

    updateBlog(blogId: BlogId, data: Partial<Blog>) {
        
    }

    deleteBlog(blogId: BlogId) {

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