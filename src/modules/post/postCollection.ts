import { injectable } from "inversify";
import { ObjectId } from "mongodb";

import { Mongodb } from "../../shared/mongodb";
import { Post } from "../../models";

export type MongoPost = Post & {
    _id: ObjectId;
}

@injectable()
export class PostCollection {
    constructor(
        private mongodb: Mongodb
    ) { }

    public collection() {
        return this.mongodb.getCollection<MongoPost>("post");
    }
}