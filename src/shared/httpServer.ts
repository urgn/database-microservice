import { injectable, multiInject, inject } from "inversify";
import express, { Express, Router } from "express";
import { Server } from "http";
import { promisify } from "util";

export interface AppRouter {
    path: string;
    expressRouter: Router;
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
        this.routes.forEach(route => {
            this.expressApp.use(route.expressRouter, route.expressRouter);
        })
    }

    async start() {
        this.server = await new Promise(res => {
            const server = this.expressApp.listen(this.httpPort, () => {
                res(server);
            })
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