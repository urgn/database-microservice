import { injectable } from "inversify";
import { Filter, ObjectId, WithId } from "mongodb";
import { omit, pick } from "ramda";
import { Mongodb } from "../../shared/mongodb";
import { PostAppInternal, PostFilter, PostRelatedToBlog } from "./postIntefaces";

@injectable()
export class PostCollection {
    constructor(
        private mongodb: Mongodb
    ) { }

    public collection() {
        return this.mongodb.getCollection<PostRelatedToBlog>("post");
    }

    public async create(spec: PostRelatedToBlog): Promise<PostAppInternal> {
        const { insertedId } = await this.collection().insertOne(spec);

        return {
            id: insertedId.toString(),
            ...spec
        }
    }

    public async read(filter: PostFilter): Promise<PostAppInternal[]> {
        const mongoFilter = this.mapFilterToMongoFilter(filter);

        const posts = await this.collection().find(mongoFilter).toArray();

        return posts.map(post => this.mapMongoPostToApp(post));
    }

    private mapFilterToMongoFilter(filter: PostFilter): Filter<WithId<PostRelatedToBlog>> {
        const mongoFilter: Filter<WithId<PostRelatedToBlog>> = omit(["id"], filter);

        if (filter.id) {
            mongoFilter._id = new ObjectId(filter.id)
        }

        return mongoFilter;
    }

    private mapMongoPostToApp(
        post: WithId<PostRelatedToBlog>
    ): PostAppInternal {
        return {
            id: post._id.toString(),
            ...pick(["title", "content", "viewCount", "blogId"], post)
        };
    }
}