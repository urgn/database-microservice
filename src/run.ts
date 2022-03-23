import { container } from "./container";
import { Service } from "./service";

const service = container.get(Service);

service.start().then(() => {
	console.log("Application has started");
}).catch(error => {
	console.error(error);
	process.exit(1);
});