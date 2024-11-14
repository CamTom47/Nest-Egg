import { describe, test, expect, afterEach, afterAll, beforeEach, beforeAll } from "@jest/globals";
import request from "supertest";
import app from "../../index";
import { BadRequestError, NotFoundError } from "../../ExpressError";

import {
	commonAfterAll,
	commonAfterEach,
	commonBeforeAll,
	commonBeforeEach,
	testCategoryIds,
	testUserIds,
	testContributorIds,
	u1token,
	u2token,
	u3token,
} from "../../testCommon";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /", () => {
	test("works", async () => {
		const resp = await request(app).get("/contributors").set("authorization", `Bearer ${u1token}`);

		expect(resp.body).toEqual({
			contributors: [
				{ id: expect.any(Number), userId: testUserIds[0], name: "testContributor1" },
				{ id: expect.any(Number), userId: testUserIds[1], name: "testContributor2" },
				{ id: expect.any(Number), userId: testUserIds[1], name: "testContributor3" },
			],
		});

		expect(resp.statusCode).toEqual(200);
	});

	test("works when a user_id is passed into req.body", async () => {
		const data = {
			user_id: testUserIds[1],
		};

		const resp = await request(app).get("/contributors").set("authorization", `Bearer ${u1token}`).send(data);

		expect(resp.body).toEqual({
			contributors: [
				{ id: expect.any(Number), userId: testUserIds[1], name: "testContributor2" },
				{ id: expect.any(Number), userId: testUserIds[1], name: "testContributor3" },
			],
		});

		expect(resp.statusCode).toEqual(200);
	});

	test("throws error with invalid user_id", async () => {
		const resp = await request(app)
			.get("/contributors")
			.set("authorization", `Bearer ${u1token}`)
			.send({ user_id: 9999 });

		expect(resp.body).toEqual({
			contributors: { message: "No contributors are associated with User ID: 9999", status: 404 },
		});
	});
});

describe("GET /contributors/:contributor_id", () => {
	test("works", async () => {
		const contributor_id = testContributorIds[0];
		const resp = await request(app).get(`/contributors/${contributor_id}`).set("authorization", `Bearer ${u1token}`);

		expect(resp.body).toEqual({
			contributor: { id: expect.any(Number), userId: testUserIds[0], name: "testContributor1" },
		});
		expect(resp.status).toEqual(200);
	});
	test("throws NotFoundError with invalid contributor id", async () => {
		const resp = await request(app).get(`/contributors/9999`).set("authorization", `Bearer ${u1token}`);
		expect(resp.body.contributor.message).toEqual("Not Found");
	});
});

describe("POST /", () => {
	test("works", async () => {
		const data = {
			name: "new contributor",
			description: "new description",
			userId: testUserIds[0],
		};

		const resp = await request(app).post("/contributors").set("authorization", `Bearer ${u1token}`).send(data);

		expect(resp.body).toEqual({
			contributor: {
				id: expect.any(Number),
				name: "new contributor",
				userId: testUserIds[0],
			},
		});

		expect(resp.status).toEqual(201);
	});
	test("throw error with incomplete data", async () => {
		const data = {
			name: "new contributor",
		};

		const resp = await request(app).post("/contributors").set("authorization", `Bearer ${u1token}`).send(data);

		expect(resp.badRequest).toEqual(true);
		expect(resp.status).toEqual(400);
	});
});

describe("PATCH /:contributor_id", () => {
	test("works", async () => {
		const data = {
			name: "update contributor",
		};

		const resp = await request(app)
			.patch(`/contributors/${testContributorIds[2]}`)
			.set("authorization", `Bearer ${u1token}`)
			.send(data);

		expect(resp.body).toEqual({
			contributor: {
				id: testContributorIds[2],
				name: "update contributor",
				userId: testUserIds[1],
			},
		});

		expect(resp.status).toEqual(200);
	});

	test("throw error with invalid contributor_id data", async () => {
		const data = {
			name: "update contributor",
		};

		const resp = await request(app).patch("/contributors/99999").set("authorization", `Bearer ${u1token}`).send(data);

		expect(resp.body.contributor.message).toEqual("Contributor not found: 99999");
		expect(resp.body.contributor.status).toEqual(404);
	});
});

describe("DELETE /:contributor_id", () => {
	test("works", async () => {
		const resp = await request(app)
			.delete(`/contributors/${testContributorIds[0]}`)
			.set("authorization", `bearer ${u1token}`);
		expect(resp.body.contributor.message).toEqual("Contributor Deleted");
	});
});
