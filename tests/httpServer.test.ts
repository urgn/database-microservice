import { expect } from "chai";
import { container } from "../src/container";
import { HttpServer } from "../src/shared/httpServer";
import axios from "axios";
import { settings } from "../src/settings";
import { Service } from "../src/service";

describe("Mock test", () => {

    let service: Service;

    before(async () => {
        service = container.get(Service);
        await service.start();
    });

    after(async () => {
        await service.stop();
    });

    it("shoul make health check", async () => {
        const response = await axios.get(`http://localhost:${settings.HTTP_PORT}/health`);

        expect(response.data).to.deep.eq({
            status: "ok"
        });
    });
})