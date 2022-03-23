import { expect } from "chai";
import axios from "axios";
import { container } from "../src/container";
import { Service } from "../src/service";
import { settings } from "../src/settings";
import { Mongodb } from "../src/shared/mongodb";
import { ObjectId } from "mongodb";

describe("Post test", () => {

    let service: Service;
    let mongodb: Mongodb;

    before(async () => {

        service = container.get(Service);
        mongodb = container.get(Mongodb);

        await service.start();
    });

    after(async () => {
        await service.stop();
    });

    const blogSlug = "dummy";
    let postId = "unknown";
    let mockBlogId: ObjectId;

    beforeEach(async () => {
        const { insertedId } = await mongodb.getCollection("blog")
            .insertOne(
                {
                    name: "Testing Blog",
                    slug: blogSlug,
                }
            );

        mockBlogId = insertedId;
    });

    afterEach(async () => {
        await mongodb.getCollection("blog").deleteMany({});
        await mongodb.getCollection("post").deleteMany({});
    });

    it("should create post", async () => {
        const response = await axios.post(
            `http://localhost:${settings.HTTP_PORT}/blog/${blogSlug}`,
            {
                title: "New post for testing",
                content: "Hello world!",
                viewCount: 0
            }
        );

        const dbData = await mongodb.getCollection("post").find({}).toArray();

        expect(dbData.length).to.eq(1);

        expect(response.data).to.deep.eq({
            id: dbData[0]._id.toString(),
            title: "New post for testing",
            content: "Hello world!",
            viewCount: 0
        });
    });

    it("should read post by id", async () => {
        const response = await axios.get(
            `http://localhost:${settings.HTTP_PORT}/blog/${blogSlug}/${postId}`
        );

        expect(response.data).to.deep.eq({
            blog: blogSlug,
            post: postId,
            result: "post returned"
        });
    });

    it("should update post", async () => {
        const response = await axios.put(
            `http://localhost:${settings.HTTP_PORT}/blog/${blogSlug}/${postId}`,
            {
                foo: "bar"
            }
        );

        expect(response.data).to.deep.eq({
            blog: blogSlug,
            post: postId,
            result: "post updated"
        });

    });

    it("should delete post", async () => {
        const response = await axios.delete(
            `http://localhost:${settings.HTTP_PORT}/blog/${blogSlug}/${postId}`
        );

        expect(response.data).to.deep.eq({
            blog: blogSlug,
            post: postId,
            result: "post deleted"
        });
    });
})