import axios, { AxiosError, AxiosResponse } from "axios";

const BASE_URL: string = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

class NestEggApi {
	/** NestEgg API Class
	 *
	 * Static class typing together methods used to get/send to the NestEgg API.
	 * There shouldn't be any frontend-specific stuff here, and there shouldn't be any API-aware stuff elsehwere in the frontend
	 */

	static token: string;

	static async request(endpoint: string, data: object = {}, method: string = "get") {
		console.debug("API Call:", endpoint, data, method);

		const url: string = `${BASE_URL}/${endpoint}`;
		const params = method === "get" ? data : {};
		const headers: {} | undefined =
			NestEggApi.token !== "" ? { Authorization: `Bearer ${NestEggApi.token}` } : undefined;

		try {
			const response = (await axios({ url, params, method, data, headers })).data;
			return response;
		} catch (err: any) {
			console.error("API Error", err.response);
			let message: string = err.response.data.error.message;
			throw Array.isArray(message) ? message : [message];
		}
	}

	/**
	 * Authenticate a user and login to application
	 * @params {data}
	 * {data: {username, password}}
	 * @returns {token}
	 */

	static async login<Promise>(data: { username: string; password: string }): Promise {
		let res = await this.request("auth/login", data, "post");
		return res.token;
	}

	/**
	 * Register a new user
	 * @params {data}
	 * {data: {username, password}}
	 * @returns {token}
	 */

	static async register<Promise>(data: { username: string; password: string }): Promise {
		let res = await this.request("auth/register", data, "post");
		return res.token;
	}

	//Indivual NestEgg API Routes for normal users

	/**
	 * Return all users in the data base if admin
	 * @returns {user}
	 */

	static async findAllUsers<Promise>(): Promise {
		let res = await this.request("users/");
		return res.users;
	}

	/**
	 * Find a user by their user Id
	 * @params {data}
	 * {data: {userId}}
	 * @returns {user}
	 */
	static async findUser<Promise>(data: { userId: number }): Promise {
		let res = await this.request(`users/${data.userId}`, data, "get");
		return res.user;
	}

	/**
	 * Update a users account information
	 * @params {data}
	 * {data: {userId, username, password, firstName, lastName, email}}
	 * @returns {user}
	 */
	static async updateUser<Promise>(data: {
		userId: number;
		username?: string;
		password?: string;
		firstName?: string;
		lastName?: string;
		email?: string;
	}): Promise {
		let res = await this.request(`users/${data.userId}`, data, "put");
		return res.user;
	}

	/**
	 * Delete a user from the application
	 * @params {data}
	 * {data: {userId}}
	 * @returns {message: "User Deleted"}
	 */
	static async deleteUser<Promise>(data: { userId: number }): Promise {
		let res = await this.request(`users/${data.userId}`, data, "delete");
		return res.user;
	}

	//Category Methods

	/**
	 * Return all system default and user created categories to a user.
	 * @returns {categories}
	 */

	static async findAllCategories<Promise>(data: { userId?: number } = {}): Promise {
		let res =  await this.request("categories", data, "get");
		return res.categories;
	}

	/**
	 * Find a category by its Id
	 * @params {data}
	 * {data: {categoryId}}
	 * @returns {category}
	 */
	static async findCategory<Promise>(data: { categoryId: number; userId?: number }): Promise {
		let res;
		if (data.userId) res = await this.request(`categories/${data.categoryId}?userId=${data.userId}`);
		res = await this.request(`categories/${data.categoryId}`);
		return res.category;
	}

	/**
	 * Create a new category
	 * @params {data}
	 * {data: {name, description}}
	 * @returns {category}
	 */
	static async createCategory<Promise>(data: { userId: number; name: string; description: string }): Promise {
		let res = await this.request(`categories/`, data, "post");
		return res.category;
	}

	/**
	 * Update a category
	 * @params {data}
	 * {data: {categoryId, name, description}}
	 * @returns {category}
	 */
	static async updateCategory<Promise>(data: {
		categoryId: number;
		userId?: number;
		name?: string;
		description?: string;
	}): Promise {
		let res = await this.request(`categories/${data.categoryId}`, data, "put");
		return res.category;
	}

	/**
	 * Delete a category from the application
	 * @params {data}
	 * {data: {categoryId}}
	 * @returns {message: "Category Deleted"}
	 */
	static async deleteCategory<Promise>(data: { categoryId: number }): Promise {
		let res = await this.request(`categories/${data.categoryId}`, data, "delete");
		return res.category;
	}

	//Subcategory Methods

	/**
	 * Return all system default and user created subcategories to a user.
	 * @returns {subcategories}
	 */

	static async findAllSubcategories<Promise>(data: {userId? : number} = {}): Promise {
		let res;
		if (data.userId) res = await this.request(`subcategories?userId=${data.userId}`);
		else res = await this.request("subcategories/");
		return res.subcategories;
	}

	/**
	 * Find a subcategory by its Id
	 * @params {data}
	 * {data: {subcategoryId}}
	 * @returns {subcategory}
	 */
	static async findSubcategory<Promise>(data: { subcategoryId: number, userId?: number }): Promise {
		let res;
		if(data.userId) res = await this.request(`subcategories/${data.subcategoryId}?userId=${data.userId}`)
		else res = await this.request(`subcategories/${data.subcategoryId}`, data, "get");
		return res.subcategory;
	}

	/**
	 * Create a new subcategory
	 * @params {data}
	 * {data: {userId, name, description}}
	 * @returns {subcategory}
	 */
	static async createSubcategory<Promise>(data: { userId: number; name: string; description: string }): Promise {
		let res = await this.request(`subcategories/`, data, "post");
		return res.subcategory;
	}

	/**
	 * Update a subcategory
	 * @params {data}
	 * {data: {subcategoryId, userId, name, description}}
	 * @returns {subcategory}
	 */
	static async updateSubcategory<Promise>(data: {
		subcategoryId: number;
		userId?: number;
		name?: string;
		description?: string;
	}): Promise {
		let res = await this.request(`subcategories/${data.subcategoryId}`, data, "put");
		return res.subcategory;
	}

	/**
	 * Delete a subcategory from the application
	 * @params {data}
	 * {data: {subcategoryId}}
	 * @returns {message: "Subcategory Deleted"}
	 */
	static async deleteSubcategory<Promise>(data: { subcategoryId: number }): Promise {
		let res = await this.request(`subcategories/${data.subcategoryId}`, data, "delete");
		return res.subcategory;
	}

	//Allocation Methods

	/**
	 * Return all system default and user created allocations to a user.
	 * @returns {allocations}
	 */

	static async findAllAllocations<Promise>(data: {userId?: number} = {}): Promise {
		let res = await this.request(`allocations`, data, "get");
		return res.allocations;
	}

	/**
	 * Find an allocation by its Id
	 * @params {data}
	 * {data: {allocationId}}
	 * @returns {allocation}
	 */
	static async findAllocation<Promise>(data: { allocationId: number, userId?: number}): Promise {
		let res = await this.request(`allocations/${data.allocationId}`, data, "get");
		return res.allocation;
	}

	/**
	 * Create a new allocation
	 * @params {data}
	 * {data: {amount, subcategoryId, budgetId}}
	 * @returns {allocation}
	 */
	static async createAllocation<Promise>(data: { amount: number; subcategoryId: number; budgetId: number }): Promise {
		let res = await this.request(`allocations`, data, "post");
		return res.allocation;
	}

	/**
	 * Update an allocation
	 * @params {data}
	 * {data: {amount, subcategoryId, budgetId}}
	 * @returns {subcategory}
	 */
	static async updateAllocation<Promise>(data: {
		allocationId: number;
		amount?: number;
		subcategoryId?: number;
		budgetId?: number;
	}): Promise {
		let res = await this.request(`allocations/${data.allocationId}`, data, "put");
		return res.allocation;
	}

	/**
	 * Delete an allocation from the application
	 * @params {data}
	 * {data: {allocationId}}
	 * @returns {message: "Subcategory Deleted"}
	 */
	static async deleteAllocation<Promise>(data: { allocationId: number }): Promise {
		let res = await this.request(`allocations/${data.allocationId}`, data, "delete");
		return res.allocation;
	}

	//Budget Methods

	/**
	 * Return all system default and user created budgets to a user.
	 * @returns {budgets}
	 */

	static async findAllBudgets<Promise>(data: {userId?: number} = {}): Promise {
		let res = await this.request(`budgets`, data, "get");
		return res.budgets;
	}

	/**
	 * Find an allocation by its Id
	 * @params {data}
	 * {data: {allocationId}}
	 * @returns {allocation}
	 */
	static async findBudget<Promise>(data: { budgetId: number, userId?: number }): Promise {
		let res = await this.request(`budgets/${data.budgetId}`, data, "get");
		return res.budget;
	}

	/**
	 * Create a new budget
	 * @params {data}
	 * {data: {amount, subcategoryId, budgetId}}
	 * @returns {budget}
	 */
	static async createBudget<Promise>(data: { userId: number; name: string; description: string }): Promise {
		let res = await this.request(`budgets`, data, "post");
		return res.budget;
	}

	/**
	 * Update an budget
	 * @params {data}
	 * {data: {name, description}}
	 * @returns {subcategory}
	 */
	static async updateBudget<Promise>(
		userId: number,
		data: {
			budgetId: number;
			name?: string;
			description?: string;
		}
	): Promise {
		let res = await this.request(`budgets/${data.budgetId}?userId${userId}`, data, "put");
		return res.budget;
	}

	/**
	 * Delete an budget from the application
	 * @params {data}
	 * {data: {budgetId}}
	 * @returns {message: "Subcategory Deleted"}
	 */
	static async deleteBudget<Promise>(userId: number, data: { budgetId: number }): Promise {
		let res = await this.request(`budgets/${data.budgetId}?userId${userId}`, data, "delete");
		return res.budget;
	}
}

NestEggApi.token = "";

export default NestEggApi;
