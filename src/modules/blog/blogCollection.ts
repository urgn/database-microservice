import { injectable } from "inversify";

import { Collection, ObjectId } from "mongodb";
import { Blog } from "../../models";
import { Mongodb } from "../../shared/mongodb";

export type BlogId = string;
export type BlogWithId = Blog & { id: BlogId };
export type BlogFilter = Partial<BlogWithId>;

@injectable()
export class BlogCollection {
    constructor(
        private mongodb: Mongodb
    ) { }

    private collection(): Collection<Blog> {
        return this.mongodb.getCollection<Blog>("blog");
    }

    public async create(spec: Blog): Promise<BlogWithId> {
        const { insertedId } = await this.collection().insertOne(spec);

        return {
            id: insertedId.toString(),
            ...spec
        }
    }

    public async read(filter: BlogFilter = {}): Promise<BlogWithId[]> {
        const blogs = await this.collection().find({
            ...filter,
            ...(filter.id ? { _id: new ObjectId(filter.id) } : {})
        }).toArray();

        return blogs.map(({ _id, name, slug }) => ({
            id: _id.toString(),
            name,
            slug
        }));
    }
}