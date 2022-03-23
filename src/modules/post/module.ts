import { Container } from "inversify";
import { PostController } from "./controller";
import { PostCollection } from "./postCollection";

import { PostRouter } from "./route";

export const attachPostModule = (container: Container) => {
	container.bind(PostCollection).toSelf();
	container.bind(PostController).toSelf();
	container.bind("ROUTER").to(PostRouter);
};
