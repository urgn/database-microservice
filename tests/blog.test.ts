import { expect } from "chai";
import axios from "axios";
import { container } from "../src/container";
import { Service } from "../src/service";
import { settings } from "../src/settings";
import { Mongodb } from "../src/shared/mongodb";

describe("Mock test", () => {

    let service: Service;
    let mongodb: Mongodb;

    before(async () => {

        service = container.get(Service);
        mongodb = container.get(Mongodb);

        await service.start();
    });

    after(async () => {
        await mongodb.getCollection("blog").deleteMany({});
        await service.stop();
    });

    it("shoul create blog", async () => {
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

        expect(dbData.length).to.eq(1);

        expect(response.data).to.deep.eq({
            id: dbData[0]._id.toString(),
            name: "TestBlog",
            slug: "tst",
            posts: []
        });
    });
})