import { expect } from "chai";
import axios from "axios";
import { container } from "../src/container";
import { Service } from "../src/service";
import { settings } from "../src/settings";
import { Mongodb } from "../src/shared/mongodb";
import { ObjectId } from "mongodb";

describe("Post test", () => {

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

	const blogSlug = "dummy";
	let mockPostIds: { [key: number]: ObjectId; };
	let mockBlogIds: { [key: number]: ObjectId; };

	beforeEach(async () => {
		const { insertedIds: blogIds } = await mongodb.getCollection("blog")
			.insertMany(
				[
					{
						name: "Testing Blog",
						slug: blogSlug,
					},
					{
						name: "Second Blog",
						slug: "2nd"
					}
				]
			);

		mockBlogIds = blogIds;

		const { insertedIds: postIds } = await mongodb.getCollection("post")
			.insertMany(
				[
					{
						blogId: mockBlogIds[0].toString(),
						title: "Welcome post",
						content: "Lorem ipsum",
						viewCount: 123
					},
					{
						blogId: mockBlogIds[0].toString(),
						title: "Another Post",
						content: "Foo Bar",
						viewCount: 456
					},
					{
						blogId: mockBlogIds[1].toString(),
						title: "Post of different blog",
						content: "Just in case",
						viewCount: -1
					}
				]
			);

		mockPostIds = postIds;
	});

	afterEach(async () => {
		await mongodb.getCollection("blog").deleteMany({});
		await mongodb.getCollection("post").deleteMany({});
	});

	it("should create post", async () => {
		const response = await axios.post(
			`http://localhost:${settings.HTTP_PORT}/blogs/${blogSlug}/posts`,
			{
				title: "New post for testing",
				content: "Hello world!",
				viewCount: 0
			}
		);

		const dbData = await mongodb.getCollection("post").find({}).toArray();

		expect(dbData.length).to.eq(4);

		expect(response.data).to.deep.eq({
			id: dbData[3]._id.toString(),
			title: "New post for testing",
			content: "Hello world!",
			viewCount: 0
		});
	});


	it("should read all posts", async () => {
		const response = await axios.get(
			`http://localhost:${settings.HTTP_PORT}/blogs/${blogSlug}/posts`
		);

		expect(response.data).to.deep.eq([
			{
				id: mockPostIds[0].toString(),
				title: "Welcome post",
				content: "Lorem ipsum",
				viewCount: 123
			},
			{
				id: mockPostIds[1].toString(),
				title: "Another Post",
				content: "Foo Bar",
				viewCount: 456
			}
		]);
	});

	it("should read post by id", async () => {
		const response = await axios.get(
			`http://localhost:${settings.HTTP_PORT}/blogs/${blogSlug}/posts/${mockPostIds[1]}`
		);

		expect(response.data).to.deep.eq({
			id: mockPostIds[1].toString(),
			title: "Another Post",
			content: "Foo Bar",
			viewCount: 456
		});
	});

	it("should fail reading post from another slug", async () => {
		try {
			await axios.get(
				`http://localhost:${settings.HTTP_PORT}/blogs/${blogSlug}/posts/${mockPostIds[2].toString()}`
			);
			expect.fail();
		} catch (error) {
			expect(error).to.match(/404/);
		}
	});

	it("should update post", async () => {
		const response = await axios.put(
			`http://localhost:${settings.HTTP_PORT}/blogs/${blogSlug}/posts/${mockPostIds[0].toString()}`,
			{
				title: "Updated Post",
				content: "Updated content",
				viewCount: 9000
			}
		);

		expect(response.data).to.deep.eq({
			id: mockPostIds[0].toString(),
			title: "Updated Post",
			content: "Updated content",
			viewCount: 9000
		});

		const dbData = await mongodb.getCollection("post").findOne({
			_id: mockPostIds[0]
		});

		expect(dbData).to.deep.eq({
			_id: mockPostIds[0],
			title: "Updated Post",
			content: "Updated content",
			viewCount: 9000,
			blogId: mockBlogIds[0].toString()
		});

	});

	it("should delete post", async () => {
		await axios.delete(
			`http://localhost:${settings.HTTP_PORT}/blogs/${blogSlug}/posts/${mockPostIds[0].toString()}`
		);

		const dbCount = await mongodb.getCollection("post").count({ _id: mockPostIds[0] });

		expect(dbCount).to.eq(0);
	});
});