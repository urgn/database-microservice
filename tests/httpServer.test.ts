import { expect } from "chai";
import { container } from "../src/container";
import { HttpServer } from "../src/shared/httpServer";
import axios from "axios";
import { settings } from "../src/settings";

describe("Mock test", () => {

    let server: HttpServer;

    before(async () => {
        server = container.get(HttpServer);
        await server.start();
    });

    after(async () => {
        await server.stop();
    });

    it("shoul make health check", async () => {
        const response = await axios.get(`http://localhost:${settings.HTTP_PORT}`);

        expect(response.data).to.deep.eq({
            status: "ok"
        });
    });
})