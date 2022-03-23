import { expect } from "chai";
import axios from "axios";
import { container } from "../src/container";
import { Service } from "../src/service";
import { settings } from "../src/settings";
import { Mongodb } from "../src/shared/mongodb";

describe("Blog test", () => {

	let service: Service;
	let mongodb: Mongodb;

	before(async () => {

		service = container.get(Service);
		mongodb = container.get(Mongodb);

		await service.start();
	});

	after(async () => {
		await service.stop();
	});

	beforeEach(async () => {
		await mongodb.getCollection("blog").insertMany([
			{
				name: "Initial Blog",
				slug: "init",
			},
			{
				name: "Second Blog Ever",
				slug: "2nd"
			}
		]);
	});

	afterEach(async () => {
		await mongodb.getCollection("blog").deleteMany({});
		await mongodb.getCollection("post").deleteMany({});
	});

	it("should create blog", async () => {
		const response = await axios.post(
			`http://localhost:${settings.HTTP_PORT}/blog`,
			{
				name: "TestBlog",
				slug: "tst",
				posts: []
			}
		);

		const dbData = await mongodb.getCollection("blog").find({}).toArray();

		expect(dbData.length).to.eq(3);

		expect(response.data).to.deep.eq({
			name: "TestBlog",
			slug: "tst",
			posts: []
		});
	});

	it("should read blogs", async () => {
		const response = await axios.get(`http://localhost:${settings.HTTP_PORT}/blog`);

		const dbData = await mongodb.getCollection("blog").find({}).toArray();

		expect(dbData.length).to.eq(2);

		expect(response.data).to.deep.eq([
			{
				name: "Initial Blog",
				slug: "init",
				posts: []
			},
			{
				name: "Second Blog Ever",
				slug: "2nd",
				posts: []
			}
		]);
	});

	it("should read blog by slug", async () => {
		const testSlug = "2nd";
		const response = await axios.get(`http://localhost:${settings.HTTP_PORT}/blog/${testSlug}`);

		expect(response.data).to.deep.eq(
			{
				name: "Second Blog Ever",
				slug: "2nd",
				posts: []
			}
		);
	});

	it("should get error while missing blog", async () => {
		const testSlug = "na";

		try {
			await axios.get(`http://localhost:${settings.HTTP_PORT}/blog/${testSlug}`);
			expect.fail();
		} catch (e) {
			expect(e.toString()).to.match(/404/);
		}
	});

	it("should update blog", async () => {
		const testSlug = "init";

		const response = await axios.put(
			`http://localhost:${settings.HTTP_PORT}/blog/${testSlug}`,
			{
				name: "Original Blog",
				slug: "orig"
			}
		);

		expect(response.data).to.deep.eq({
			name: "Original Blog",
			slug: "orig",
			posts: []
		});

		const dbCount = await mongodb.getCollection("blog").count({
			slug: "orig"
		});

		expect(dbCount).to.eq(1);

		expect(response.data).to.deep.eq({
			name: "Original Blog",
			slug: "orig",
			posts: []
		});

	});

	it("should delete blog", async () => {
		const testSlug = "init";

		await axios.delete(
			`http://localhost:${settings.HTTP_PORT}/blog/${testSlug}`,
		);

		const dbData = await mongodb.getCollection("blog").find({}).toArray();
		expect(dbData.length).to.eq(1);
	});
});