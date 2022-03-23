import { injectable, multiInject, inject } from "inversify";
import express, { Express, Router } from "express";
import { Server } from "http";
import * as bodyParser from "body-parser";
import { expressErrorHandler } from "./expressErrorHandler";

export interface AppRouter {
	path: string;
	expressRouter: Router;
	init?: () => Promise<void>
}

@injectable()
export class HttpServer {
	private expressApp: Express;
	private server?: Server;

	constructor(
		@inject("Settings.HTTP_PORT") private httpPort: string,
		@multiInject("ROUTER") private routes: AppRouter[]
	) {
		this.expressApp = express();
		this.expressApp.use(bodyParser.json());
		this.routes.forEach(router => {
			this.expressApp.use(router.path, router.expressRouter);
		});
		this.expressApp.use(expressErrorHandler());
	}

	async start() {
		for (const router of this.routes) {
			router.init && await router.init();
		}

		this.server = await new Promise(res => {
			const server = this.expressApp.listen(this.httpPort, () => {
				res(server);
			});
		});
	}

	async stop() {
		new Promise((res, rej) => {
			if (!this.server) {
				rej(new Error("Server not started"));
				return;
			}

			this.server.close((err) => {
				if (err) {
					rej(err);
				}
				res(null);
			});
		});
	}

	get app() {
		return this.expressApp;
	}
}