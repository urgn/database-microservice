import { injectable } from "inversify";
import { HttpServer } from "./shared/httpServer";
import { Mongodb } from "./shared/mongodb";

@injectable()
export class Service {

	constructor(
        private httpServer: HttpServer,
        private mongodb: Mongodb
	) { }

	async start() {
		await this.mongodb.connect();
		return await this.httpServer.start();
	}

	async stop() {
		await this.httpServer.stop();
		await this.mongodb.stop();
	}

}