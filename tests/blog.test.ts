import { expect } from "chai";
import axios from "axios";
import { container } from "../src/container";
import { Service } from "../src/service";
import { settings } from "../src/settings";
import { Mongodb } from "../src/shared/mongodb";
import { omit } from "ramda";
import { ObjectId } from "mongodb";

describe("Mock test", () => {

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

    let dbIds = {};

    beforeEach(async () => {
        const { insertedIds } = await mongodb.getCollection("blog").insertMany([
            {
                name: "Initial Blog",
                slug: "init",
            },
            {
                name: "Second Blog Ever",
                slug: "2nd"
            }
        ]);

        dbIds = insertedIds;
    });

    afterEach(async () => {
        await mongodb.getCollection("blog").deleteMany({});
    });

    it("should create blog", async () => {
        const response = await axios.post(
            `http://localhost:${settings.HTTP_PORT}/blog`,
            {
                name: "TestBlog",
                slug: "tst",
                posts: [
                    {
                        foo: "bar"
                    }
                ]
            }
        );

        const dbData = await mongodb.getCollection("blog").find({}).toArray();

        expect(dbData.length).to.eq(3);

        expect(response.data).to.deep.eq({
            id: dbData[2]._id.toString(),
            name: "TestBlog",
            slug: "tst",
            posts: []
        });
    });

    it("should read blogs", async () => {
        const response = await axios.get(`http://localhost:${settings.HTTP_PORT}/blog`);

        const dbData = await mongodb.getCollection("blog").find({}).toArray();

        expect(dbData.length).to.eq(2);

        expect(response.data).to.deep.eq([
            {
                id: dbIds[0].toString(),
                name: "Initial Blog",
                slug: "init",
                posts: []
            },
            {
                id: dbIds[1].toString(),
                name: "Second Blog Ever",
                slug: "2nd",
                posts: []
            }
        ]);
    });

    it("should read blog by slug", async () => {
        const testSlug = "2nd";
        const response = await axios.get(`http://localhost:${settings.HTTP_PORT}/blog/${testSlug}`);

        expect(response.data).to.deep.eq(
            {
                id: dbIds[1].toString(),
                name: "Second Blog Ever",
                slug: "2nd",
                posts: []
            }
        );
    });

    it("should get error while missing blog", async () => {
        const testSlug = "na";

        try {
            await axios.get(`http://localhost:${settings.HTTP_PORT}/blog/${testSlug}`);
            expect.fail();
        } catch (e) {
            expect(e.toString()).to.match(/404/);
        }
    });

    it.skip("should update blog", async () => {
        const testSlug = "init";

        const response = await axios.put(
            `http://localhost:${settings.HTTP_PORT}/blog/${testSlug}`,
            {
                name: "Original Blog",
                slug: "orig"
            }
        );

        expect(response.data).to.deep.eq({
            id: dbIds[0]._id.toString(),
            name: "Original Blog",
            slug: "orig",
            posts: []
        });

        const dbData = await mongodb.getCollection("blog").findOne({
            slug: "orig"
        });
        
        expect(dbData.length).to.eq(1);

        expect(response.data).to.deep.eq({
            id: dbIds[0]._id.toString(),
            name: "Original Blog",
            slug: "orig",
            posts: []
        });

    });

    it.skip("should delete blog", async () => {
        const testSlug = "init";

        await axios.delete(
            `http://localhost:${settings.HTTP_PORT}/blog/${testSlug}`,
        );

        const dbData = await mongodb.getCollection("blog").find({}).toArray();
        expect(dbData.length).to.eq(1);
    });
})