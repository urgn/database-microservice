import { injectable } from "inversify";
import { Filter, ObjectId, WithId } from "mongodb";
import { omit, pick } from "ramda";
import { Mongodb } from "../../shared/mongodb";
import { PostAppInternal, PostFilter, PostId, PostRelatedToBlog } from "./postIntefaces";

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

    public async createMany(spec: PostRelatedToBlog[]): Promise<PostAppInternal[]> {
        const { insertedIds } = await this.collection().insertMany(spec);

        const insertedPosts = await this.collection().find({
            _id: { $in: Object.values(insertedIds) }
        }).toArray();

        return insertedPosts.map(post => this.mapMongoPostToApp(post));
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

    public async update(postId: PostId, contents: Partial<PostRelatedToBlog>): Promise<PostAppInternal> {
        const mongdoId = new ObjectId(postId);
        await this.collection().updateOne(
            {
                _id: mongdoId
            }, {
            $set: contents
        });

        const updatedBlog = await this.collection().findOne({ _id: mongdoId });

        return this.mapMongoPostToApp(updatedBlog);
    }

    public async delete(postId: PostId): Promise<void> {
        this.collection().deleteOne({
            _id: new ObjectId(postId)
        });
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