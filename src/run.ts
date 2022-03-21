import { container } from "./container";
import { HttpServer } from "./shared/httpServer";

const server = container.get(HttpServer);

server.start().then(() => {
    console.log("Application has started")
}).catch(error => {
    console.error(error);
    process.exit(1);
});