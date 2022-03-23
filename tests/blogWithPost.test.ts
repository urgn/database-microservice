import { expect } from "chai";
import axios from "axios";
import { container } from "../src/container";
import { Service } from "../src/service";
import { settings } from "../src/settings";
import { Mongodb } from "../src/shared/mongodb";
import { ObjectId } from "mongodb";

describe("Blog With Post test", () => {

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

    let mockPostIds: { [key: number]: ObjectId; };
    let mockBlogIds: { [key: number]: ObjectId; };

    beforeEach(async () => {
        const { insertedIds: blogIds } = await mongodb.getCollection("blog")
            .insertMany(
                [
                    {
                        name: "Testing Blog",
                        slug: blogSlug,
                    },
                    {
                        name: "Second Blog",
                        slug: "2nd"
                    }
                ]
            );

        mockBlogIds = blogIds;

        const { insertedIds: postIds } = await mongodb.getCollection("post")
            .insertMany(
                [
                    {
                        blogId: mockBlogIds[0].toString(),
                        title: "Welcome post",
                        content: "Lorem ipsum",
                        viewCount: 123
                    },
                    {
                        blogId: mockBlogIds[0].toString(),
                        title: "Another Post",
                        content: "Foo Bar",
                        viewCount: 456
                    },
                    {
                        blogId: mockBlogIds[1].toString(),
                        title: "Post of different blog",
                        content: "Just in case",
                        viewCount: -1
                    }
                ]
            );

        mockPostIds = postIds;
    });

    afterEach(async () => {
        await mongodb.getCollection("blog").deleteMany({});
        await mongodb.getCollection("post").deleteMany({});
    });

    it("should create blog with posts ", async () => {
        const response = await axios.post(
            `http://localhost:${settings.HTTP_PORT}/blog`,
            {
                name: "Blog with posts",
                slug: "bwp",
                posts: [
                    {
                        title: "internal post one",
                        content: "hello there",
                        viewCount: 111
                    },
                    {
                        title: "internal post two",
                        content: "hello there again",
                        viewCount: 222
                    }
                ]
            }
        );

        const dbBlogData = await mongodb.getCollection("blog").findOne({ slug: "bwp" });
        const dbPostsData = await mongodb.getCollection("post").find({ blogId: dbBlogData._id.toString() }).toArray();

        expect(dbPostsData.length).to.eq(2);

        expect(response.data).to.deep.eq(
            {
                name: "Blog with posts",
                slug: "bwp",
                posts: [
                    {
                        id: dbPostsData[0]._id.toString(),
                        title: "internal post one",
                        content: "hello there",
                        viewCount: 111
                    },
                    {
                        id: dbPostsData[1]._id.toString(),
                        title: "internal post two",
                        content: "hello there again",
                        viewCount: 222
                    }
                ]
            }
        );
    });

    it("should read blog with posts", async () => {
        const response = await axios.get(
            `http://localhost:${settings.HTTP_PORT}/blog/${blogSlug}?showPosts`
        );

        expect(response.data).to.deep.eq({
            name: "Testing Blog",
            slug: "dummy",
            posts: [
                {
                    id: mockPostIds[0].toString(),
                    title: "Welcome post",
                    content: "Lorem ipsum",
                    viewCount: 123
                },
                {
                    id: mockPostIds[1].toString(),
                    title: "Another Post",
                    content: "Foo Bar",
                    viewCount: 456
                },
            ]
        });
    });

    it("should read blog without posts", async () => {
        const response = await axios.get(
            `http://localhost:${settings.HTTP_PORT}/blog/${blogSlug}`
        );

        expect(response.data).to.deep.eq({
            name: "Testing Blog",
            slug: "dummy",
            posts: []
        });
    });
})