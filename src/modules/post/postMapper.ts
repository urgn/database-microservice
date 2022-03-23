import { pick } from "ramda";
import { PostAppInternal, PostResponse } from "./postIntefaces";

export class PostMapper {
    static mapPostAppInternalToPostResponse(
        post: PostAppInternal
    ): PostResponse {
        return pick(["id", "title", "viewCount", "content"], post);
    }
}