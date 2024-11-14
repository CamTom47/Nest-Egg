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
				dateCreated: expect.any( Date),
				totalExpense: null,
				totalIncome: null
			},
			{
				id: expect.any(Number),
				userId: testUserIds[0],
				name: "TestBudget2",
				description: "test2",
				dateCreated: expect.any( Date),
				totalExpense: null,
				totalIncome: null
			},
			{
				id: expect.any(Number),
				userId: testUserIds[1],
				name: "TestBudget3",
				description: "test3",
				dateCreated: expect.any( Date),
				totalExpense: null,
				totalIncome: null
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
			dateCreated: expect.any( Date),
			totalExpense: null,
			totalIncome: null
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
			dateCreated: new Date().toISOString()
		};
		const budget = await Budget.create(data);
		expect(budget).toEqual({
			id: expect.any(Number),
			userId: testUserIds[1],
			name: "TestBudgetNew",
			description: "testNew",
			dateCreated: expect.any(Date),
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
			dateCreated: expect.any(Date),
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
});
