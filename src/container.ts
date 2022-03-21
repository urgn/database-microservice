import "reflect-metadata";

import { Container } from "inversify";
import { HttpServer } from "./shared/httpServer";
import { HealthRouter } from "./shared/heathRouter";
import { settings } from "./settings";

export const container = new Container();

for (const settingKey in settings) {
    container.bind(`Settings.${settingKey}`).toConstantValue(settings[settingKey]);
}

container.bind("ROUTER").to(HealthRouter);
container.bind(HttpServer).toSelf();
