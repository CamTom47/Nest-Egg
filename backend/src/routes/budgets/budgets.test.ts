import { describe, test, expect, afterEach, afterAll, beforeEach, beforeAll, jest } from "@jest/globals";
import request from "supertest";
import app from "../../index";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../ExpressError";

import {
	commonAfterAll,
	commonAfterEach,
	commonBeforeAll,
	commonBeforeEach,
	testCategoryIds,
	testUserIds,
	testBudgetIds,
	testBudgetDates,
	u1token,
	u2token,
} from "../../testCommon";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /", () => {
	test("works", async () => {
		const resp = await request(app).get("/budgets").set("authorization", `Bearer ${u1token}`);

		expect(resp.status).toEqual(200);
		expect(resp.body).toEqual({
			budgets: [
				{
					id: expect.any(Number),
					userId: testUserIds[0],
					name: "TestBudget1",
					description: "test1",
					dateCreated: testBudgetDates[0],
					totalExpense: null,
					totalIncome: null,
				},
				{
					id: expect.any(Number),
					userId: testUserIds[0],
					name: "TestBudget2",
					description: "test2",
					dateCreated: testBudgetDates[1],
					totalExpense: null,
					totalIncome: null,
				},
				{
					id: expect.any(Number),
					userId: testUserIds[1],
					name: "TestBudget3",
					description: "test3",
					dateCreated: testBudgetDates[2],
					totalExpense: null,
					totalIncome: null,
				},
			],
		});
	});
	test("throws error if not logged in", async () => {
		const resp = await request(app).get("/budgets");

		expect(resp.body).toEqual({ error: { message: "Unauthorized", status: 401 } });
	});
});

describe("GET /budgets/:budget_id", () => {
	test("works with admin/correct user ", async () => {
		const resp = await request(app)
			.get(`/budgets/${testBudgetIds[0]}?userId=${testUserIds[0]}`)
			.set("authorization", `Bearer ${u1token}`);

		expect(resp.body).toEqual({
			budget: {
				id: testBudgetIds[0],
				userId: testUserIds[0],
				name: "TestBudget1",
				description: "test1",
				dateCreated: testBudgetDates[0],
				totalExpense: null,
				totalIncome: null,
			},
		});
	});

	test("works with admin/not correct user", async () => {
		const resp = await request(app)
			.get(`/budgets/${testBudgetIds[2]}?userId=${testUserIds[1]}`)
			.set("authorization", `Bearer ${u1token}`);

		expect(resp.body).toEqual({
			budget: {
				id: testBudgetIds[2],
				userId: testUserIds[1],
				name: "TestBudget3",
				description: "test3",
				dateCreated: testBudgetDates[2],
				totalExpense: null,
				totalIncome: null,
			},
		});
	});

	test("works with not admin/correct user", async () => {
		const resp = await request(app)
			.get(`/budgets/${testBudgetIds[2]}?userId=${testUserIds[1]}`)
			.set("authorization", `Bearer ${u2token}`);
		expect(resp.body).toEqual({
			budget: {
				id: testBudgetIds[2],
				userId: testUserIds[1],
				name: "TestBudget3",
				description: "test3",
				dateCreated: testBudgetDates[2],
				totalExpense: null,
				totalIncome: null,
			},
		});
	});

	test("throw error if not admin and not correct user", async () => {
		const resp = await request(app)
			.get(`/budgets/${testBudgetIds[0]}?userId=${testUserIds[0]}`)
			.set("authorization", `Bearer ${u2token}`);

		expect(resp.body).toEqual({ error: { message: "Unauthorized", status: 401 } });
	});

	test("throws error with ", async () => {});
});

describe("POST /", () => {
	test("works", async () => {
		const data = {
			userId: testUserIds[1],
			name: "new budget",
			description: "new budget description",
		};
		const resp = await request(app).post("/budgets").set("authorization", `Bearer ${u2token}`).send(data);

		expect(resp.status).toEqual(201);
		expect(resp.body).toEqual({
			budget: {
				id: expect.any(Number),
				userId: testUserIds[1],
				name: "new budget",
				description: "new budget description",
				dateCreated: expect.any(String),
			},
		});
	});

	test("throws error when not logged in", async () => {
		const data = {
			userId: testUserIds[1],
			name: "new budget",
			description: "new budget description",
		};

		const resp = await request(app).post("/budgets/").send(data);

		expect(resp.status).toEqual(401);
		expect(resp.body).toEqual({ error: { message: "Unauthorized", status: 401 } });
	});
});

describe("PATCH /budgets/:budget_id", () => {
	test("works when admin/not correct user", async () => {
		const data = {
			name: "update budget",
			description: "update budget description",
		};

		const resp = await request(app)
			.patch(`/budgets/${testBudgetIds[2]}?userId=${testUserIds[1]}`)
			.set("authorization", `Bearer ${u1token}`)
			.send(data);
		expect(resp.status).toEqual(200);
		expect(resp.body).toEqual({
			budget: {
				id: expect.any(Number),
				userId: testUserIds[1],
				name: "update budget",
				description: "update budget description",
				dateCreated: expect.any(String),
			},
		});
	});

	test("works when not admin/correct user", async () => {
		const data = {
			name: "update budget",
			description: "update budget description",
		};

		const resp = await request(app)
			.patch(`/budgets/${testBudgetIds[2]}?userId=${testUserIds[1]}`)
			.set("authorization", `Bearer ${u2token}`)
			.send(data);
		expect(resp.status).toEqual(200);
		expect(resp.body).toEqual({
			budget: {
				id: expect.any(Number),
				userId: testUserIds[1],
				name: "update budget",
				description: "update budget description",
				dateCreated: expect.any(String),
			},
		});
	});

	test("throws error when not admin/not correct user", async () => {
		const data = {
			name: "update budget",
			description: "update budget description",
		};

		const resp = await request(app)
			.patch(`/budgets/${testBudgetIds[0]}?userId=${testUserIds[0]}`)
			.set("authorization", `Bearer ${u2token}`)
			.send(data);
		expect(resp.status).toEqual(401);
		expect(resp.body).toEqual({ error: { message: "Unauthorized", status: 401 } });
	});

	test("throws error when invalid budget_id", async () => {
		const data = {
			name: "update budget",
			description: "update budget description",
		};

		const resp = await request(app).patch(`/budgets/9999}`).set("authorization", `Bearer ${u2token}`).send(data);
		expect(resp.body).toEqual({ error: { message: "Unauthorized", status: 401 } });
	});
});

describe("DELETE /budgets/:budget_id", () => {
	test("works when admin/not correct user", async () => {
		const resp = await request(app)
			.delete(`/budgets/${testBudgetIds[2]}?userId=${testUserIds[1]}`)
			.set("authorization", `Bearer ${u1token}`);
		expect(resp.body).toEqual({ message: "Budget deleted" });
	});
	test("works when not admin/correct user", async () => {
		const resp = await request(app)
			.delete(`/budgets/${testBudgetIds[2]}?userId=${testUserIds[1]}`)
			.set("authorization", `Bearer ${u2token}`);
		expect(resp.body).toEqual({ message: "Budget deleted" });
	});
	test("throws error when not admin/ not correct user", async () => {
		const resp = await request(app)
			.delete(`/budgets/${testBudgetIds[1]}?userId=${testUserIds[0]}`)
			.set("authorization", `Bearer ${u2token}`);
		expect(resp.body).toEqual({ error: { message: "Unauthorized", status: 401 } });
	});
});
