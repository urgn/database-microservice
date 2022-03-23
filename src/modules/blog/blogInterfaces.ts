import { Post } from "../post/postIntefaces";

export interface Blog {
    name: string;
    slug: string;
}

export type BlogId = string;

export type BlogWithId = Blog & { id: BlogId };

export type BlogFilter = Partial<BlogWithId>;

export interface ReadBlogFilter {
    id: BlogId;
    slug: string;
}

export type BlogResponse = BlogWithId & {
    posts: Post[];
}