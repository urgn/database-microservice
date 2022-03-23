import { BlogId } from "../blog/blogInterfaces";

export interface Post {
    title: string;
    content: string;
    viewCount: number;
}

export type PostId = string;

export type PostWithId = Post & { id: PostId };
export type PostRelatedToBlog = Post & { blogId: BlogId };

export type PostAppInternal = PostRelatedToBlog & PostWithId;

export type PostResponse = PostWithId;

export type PostFilter = Partial<PostAppInternal>;