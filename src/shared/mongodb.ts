import { injectable, inject } from "inversify";
import { Collection, Db, MongoClient } from "mongodb";

@injectable()
export class Mongodb {
	private client: MongoClient;
	private db: Db;

	constructor(@inject("Settings.DB_URL") private uri: string) { }

	public async connect() {
		this.client = await MongoClient.connect(this.uri);
		this.db = this.client.db();
	}

	public async stop() {
		await this.client.close();
	}

	public getCollection<T = any>(name: string): Collection<T> {
		return this.db.collection<T>(name);
	}
}
