import { expect } from "chai";
import axios from "axios";
import { container } from "../src/container";
import { Service } from "../src/service";
import { settings } from "../src/settings";
import { Mongodb } from "../src/shared/mongodb";

describe.skip("Blog & Post test", () => {

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

    it("should create blog with posts ", async () => {
        const response = await axios.post(
            `http://localhost:${settings.HTTP_PORT}/blog/${blogSlug}`,
            {
                foo: "bar"
            }
        );

        expect(response.data).to.deep.eq({
            blog: blogSlug,
            result: "post created"
        });
    });

    it("should read blog with posts", async () => {
        const response = await axios.get(
            `http://localhost:${settings.HTTP_PORT}/blog/${blogSlug}/${postId}`
        );

        expect(response.data).to.deep.eq({
            blog: blogSlug,
            post: postId,
            result: "post returned"
        });
    });

    it("should read blog without posts", async () => {
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
})