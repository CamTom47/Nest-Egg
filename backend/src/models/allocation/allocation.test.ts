import { describe, test, expect, afterAll, afterEach, beforeAll, beforeEach } from "@jest/globals";
import { BadRequestError, NotFoundError } from "../../../src/ExpressError";
import {
	commonAfterAll,
	commonBeforeAll,
	commonAfterEach,
	commonBeforeEach,
	testBudgetIds,
	testSubcategoryIds,
	testAllocationIds,
	testFrequencyIds,
	testCategoryIds,
	testExpenseTypeIds,
	testAllocationTypeIds,
	testUserIds,
} from "../../testCommon";
import Allocation from "./allocation";

afterAll(commonAfterAll);
beforeAll(commonBeforeAll);
afterEach(commonAfterEach);
beforeEach(commonBeforeEach);

describe("Find all allocations", () => {
	test("works", async () => {
		const allocations = await Allocation.findAll();
		expect(allocations).toEqual([
			{
				id: expect.any(Number),
				amount: "$200.00",
				subcategoryId: testSubcategoryIds[0],
				budgetId: testBudgetIds[0],
				allocationType: testAllocationTypeIds[0],
				userId: testUserIds[0],
				categoryId: testCategoryIds[0],
				expenseType: testExpenseTypeIds[0],
				frequency: testFrequencyIds[0],
			},
			{
				id: expect.any(Number),
				amount: "$500.00",
				subcategoryId: testSubcategoryIds[1],
				budgetId: testBudgetIds[1],
				allocationType: testAllocationTypeIds[0],
				userId: testUserIds[1],
				categoryId: testCategoryIds[1],
				expenseType: testExpenseTypeIds[1],
				frequency: testFrequencyIds[1],
			},
			{
				id: expect.any(Number),
				amount: "$770.00",
				subcategoryId: testSubcategoryIds[1],
				budgetId: testBudgetIds[2],
				allocationType: testAllocationTypeIds[1],
				userId: testUserIds[2],
				categoryId: testCategoryIds[2],
				expenseType: testExpenseTypeIds[2],
				frequency: testFrequencyIds[2],
			},
		]);
	});
});
describe("Find all allocations by budget_id", () => {
	test("works", async () => {
		const allocations = await Allocation.findAll(testBudgetIds[1]);
		expect(allocations).toEqual([
			{
				id: expect.any(Number),
				amount: "$500.00",
				subcategoryId: testSubcategoryIds[1],
				budgetId: testBudgetIds[1],
				allocationType: testAllocationTypeIds[0],
				userId: testUserIds[1],
				categoryId: testCategoryIds[1],
				expenseType: testExpenseTypeIds[1],
				frequency: testFrequencyIds[1],
			},
		]);
	});
});
describe("Find a allocation by ID", () => {
	test("works", async () => {
		const allocation = await Allocation.findById(testAllocationIds[0]);
		expect(allocation).toEqual({
			id: expect.any(Number),
			amount: "$200.00",
			subcategoryId: testSubcategoryIds[0],
			budgetId: testBudgetIds[0],
			allocationType: testAllocationTypeIds[0],
			userId: testUserIds[0],
			categoryId: testCategoryIds[0],
			expenseType: testExpenseTypeIds[0],
			frequency: testFrequencyIds[0],
		});
	});
	test("throws error on invalid ID", async () => {
		const allocation = await Allocation.findById(99999);
		expect(allocation).toEqual(NotFoundError);
	});
});

interface NewAllocation {
	amount: number;
	subcategory_id: number;
	budget_id: number;
	allocation_type: number;
	user_id: number;
	category_id: number;
	expense_type: number;
	frequency: number;
}
describe("Create a new Allocation", () => {
	test("works", async () => {
		const data: NewAllocation = {
			amount: 702.09,
			subcategory_id: testSubcategoryIds[0],
			budget_id: testBudgetIds[0],
			allocation_type: testAllocationTypeIds[0],
			user_id: testUserIds[0],
			category_id: testCategoryIds[0],
			expense_type: testExpenseTypeIds[0],
			frequency: testFrequencyIds[0],
		};
		const allocation = await Allocation.create(data);
		expect(allocation).toEqual({
			id: expect.any(Number),
			amount: "$702.09",
			subcategoryId: testSubcategoryIds[0],
			budgetId: testBudgetIds[0],
			allocationType: testAllocationTypeIds[0],
			userId: testUserIds[0],
			categoryId: testCategoryIds[0],
			expenseType: testExpenseTypeIds[0],
			frequency: testFrequencyIds[0],
		});
	});
});

interface UpdateAllocation {
	amount?: number;
	subcategory_id?: number;
	budget_id?: number;
	allocation_type?: number;
	category_id?: number;
	expense_type?: number;
	frequency?: number;
}

describe("Update an existing allocations information", () => {
	test("works with no password", async () => {
		const data: UpdateAllocation = {
			amount: 39.0,
		};

		const allocation = await Allocation.update(testAllocationIds[0], data);
		expect(allocation).toEqual({
      id: expect.any(Number),
      amount: "$39.00",
      subcategoryId: testSubcategoryIds[0],
      budgetId: testBudgetIds[0],
      allocationType: testAllocationTypeIds[0],
      userId: testUserIds[0],
      categoryId: testCategoryIds[0],
      expenseType: testExpenseTypeIds[0],
      frequency: testFrequencyIds[0],
    },);
	});
	test("throws error with incorrect allocation ID", async () => {
		await Allocation.update(9999, { amount: 300 });
		expect(NotFoundError);
	});
});
describe("delete", () => {
	test("works", async () => {
		let response: { message?: string } = await Allocation.delete(testAllocationIds[0]);
		expect(response.message).toEqual("Allocation deleted");
	});
	test("throws errow with invalid allocation id", async () => {
		await Allocation.delete(testBudgetIds[99]);
		expect(BadRequestError);
	});
	test("throws errow with missing id", async () => {
		await Allocation.delete(undefined);
		expect(NotFoundError);
	});
});
