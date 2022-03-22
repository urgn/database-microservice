import { Container } from "inversify";

import { PostRouter } from "./route";

export const attachPostModule = (container: Container) => {
    container.bind("ROUTER").to(PostRouter);
};
