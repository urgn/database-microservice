import { Container } from "inversify";

import { BlogController } from "./controller";
import { BlogRouter } from "./route";
import { BlogCollection } from "./blogCollection";

export const attachBlogModule = (container: Container) => {
    container.bind(BlogController).toSelf();
    container.bind(BlogCollection).toSelf();
    container.bind("ROUTER").to(BlogRouter);
};
