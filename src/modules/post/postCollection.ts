import { injectable } from "inversify";
import { ObjectId } from "mongodb";

import { Mongodb } from "../../shared/mongodb";
import { Post, PostAppInternal, PostRelatedToBlog, PostWithId } from "./postIntefaces";

export type MongoPost = Post & {
    _id: ObjectId;
}

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
}