import "reflect-metadata";

import { Container } from "inversify";

import { HttpServer } from "./shared/httpServer";
import { HealthRouter } from "./shared/heathRouter";
import { settings } from "./settings";

import { attachBlogModule } from "./modules/blog/module";
import { Mongodb } from "./shared/mongodb";
import { Service } from "./service";

export const container = new Container();

for (const settingKey in settings) {
    container.bind(`Settings.${settingKey}`).toConstantValue(settings[settingKey]);
}

container.bind("ROUTER").to(HealthRouter);

container.bind(HttpServer).toSelf().inSingletonScope();
container.bind(Mongodb).toSelf().inSingletonScope();

container.bind(Service).toSelf();

attachBlogModule(container);
