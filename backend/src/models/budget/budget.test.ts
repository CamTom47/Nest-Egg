import { describe, test, expect, afterAll, afterEach, beforeAll, beforeEach } from "@jest/globals";
import { BadRequestError, NotFoundError } from "../../../src/ExpressError";
import {
	commonAfterAll,
	commonBeforeAll,
	commonAfterEach,
	commonBeforeEach,
	testBudgetIds,
	testUserIds,
	testCategoryIds,
} from "../../testCommon";
import Budget from "./budget";

afterAll(commonAfterAll);
beforeAll(commonBeforeAll);
afterEach(commonAfterEach);
beforeEach(commonBeforeEach);

describe("Find all budgets", () => {
	test("works", async () => {
		const budgets = await Budget.findAll();
		expect(budgets).toEqual([
			{
				id: expect.any(Number),
				userId: testUserIds[0],
				name: "TestBudget1",
				description: "test1",
				date_created: expect.any(Date),
			},
			{
				id: expect.any(Number),
				userId: testUserIds[0],
				name: "TestBudget2",
				description: "test2",
				date_created: expect.any(Date),
			},
			{
				id: expect.any(Number),
				userId: testUserIds[1],
				name: "TestBudget3",
				description: "test3",
				date_created: expect.any(Date),
			},
		]);
	});
});
describe("Find a budget by ID", () => {
	test("works", async () => {
		const budget = await Budget.findById(testBudgetIds[0]);
		expect(budget).toEqual({
			id: expect.any(Number),
			userId: testUserIds[0],
			name: "TestBudget1",
			description: "test1",
			date_created: expect.any(Date),
		});
	});
	test("throws error on invalid ID", async () => {
		const budget = await Budget.findById(99999);
		expect(budget).toEqual(NotFoundError);
	});
});
describe("Create a new Budget", () => {
	test("works", async () => {
		const data = {
			user_id: testUserIds[1],
			name: "TestBudgetNew",
			description: "testNew",
			date_created: new Date().toISOString(),
		};
		const budget = await Budget.create(data);
		expect(budget).toEqual({
			id: expect.any(Number),
			userId: testUserIds[1],
			name: "TestBudgetNew",
			description: "testNew",
			date_created: expect.any(Date),
		});
	});
});

describe("Update an existing budgets information", () => {
	test("works", async () => {
		const data = {
			name: "budgetUpdate",
		};

		const budget = await Budget.update(testBudgetIds[0], data);
		expect(budget).toEqual({
			id: expect.any(Number),
			userId: testUserIds[0],
			name: "budgetUpdate",
			description: "test1",
			date_created: expect.any(Date),
		});
	});
	test("throws error with incorrect budget ID", async () => {
		await Budget.update(9999, { name: "firstUpdate" });
		expect(NotFoundError);
	});
});
describe("delete", () => {
	test("works", async () => {
		let response: { message?: string } = await Budget.delete(testBudgetIds[0]);
		expect(response.message).toEqual("Budget deleted");
	});
	test("throws errow with invalid budget id", async () => {
		await Budget.delete(testBudgetIds[99]);
		expect(BadRequestError);
	});
	test("throws errow with missing id", async () => {
		await Budget.delete();
		expect(NotFoundError);
	});

	describe("createBudgetCategories", () => {
		test("works", async () => {
			const categories = [testCategoryIds[0], testCategoryIds[1]];
			const response = await Budget.createBudgetCategories(testBudgetIds[0], categories);
			expect(response).toEqual([
				{
					id: expect.any(Number),
					budgetId: testBudgetIds[0],
					categoryId: testCategoryIds[0],
				},
				{
					id: expect.any(Number),
					budgetId: testBudgetIds[0],
					categoryId: testCategoryIds[1],
				},
			]);
		});
	});
});
