import { injectable } from "inversify";
import { Collection, Filter, ObjectId, WithId } from "mongodb";
import { Blog, BlogFilter, BlogId, BlogWithId } from "./blogInterfaces";
import { Mongodb } from "../../shared/mongodb";

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
        const blogs = await this.collection().find(
            this.mapFilterToMongoFilter(filter)
        ).toArray();

        return blogs.map(blog => this.mapMongoBlogToApp(blog));
    }

    public async update(blogId: BlogId, contents: Blog): Promise<BlogWithId> {
        const mongdoId = new ObjectId(blogId);
        await this.collection().updateOne(
            {
                _id: mongdoId
            }, {
            $set: contents
        });

        const updatedBlog = await this.collection().findOne({ _id: mongdoId });

        return this.mapMongoBlogToApp(updatedBlog);
    }

    public async delete(blogId: BlogId): Promise<void> {
        this.collection().deleteOne({
            _id: new ObjectId(blogId)
        });
    }

    private mapFilterToMongoFilter(filter: BlogFilter): Filter<Blog> {
        return {
            ...filter,
            ...(filter.id ? { _id: new ObjectId(filter.id) } : {})
        };
    }

    private mapMongoBlogToApp({ _id, name, slug }: WithId<Blog>): BlogWithId {
        return {
            id: _id.toString(),
            name,
            slug
        };
    }
}