let categoryMap = {
	name: "name",
	userId: "user_id",
	systemDefault: "system_default",
};

let subcategoryMap = {
	name: "name",
	userId: "user_id",
	categoryId: "category_id",
	systemDefault: "system_default",
};

let budgetMap = {
	name: "name",
	description: "description",
	userId: "user_id",
};

let userMap = {
	firstName: "first_name",
	lastName: "last_name",
	username: "username",
	email: "email",
	password: "password",
	isAdmin: "is_admin",
	dateCreated: "date_created",
};

let allocationMap = {
	amount: "amount",
	subcategoryId: "subcategory_id",
	budgetId: "budget_id",
	allocationType: "allocation_type",
	userId: "user_id",
	categoryId: "category_id",
	expenseType: "expense_type",
	frequency: "frequency",
};
let contributorMap = {
	name: "name",
	userId: "user_id",
};

/**
 * Mapper function that ensure that data being passed from frontend to backend queries is changed from camelCase to snake_case to adhere to sql query syntax.
 *
 *  data = { name, description, userId, systemDefault } => {name, description, user_id, system_default}
 */

const mapper = (data: {}, type: string) => {
	let map = {};
	switch (type) {
		case "category":
			map = categoryMap;
			break;

		case "subcategory":
			map = subcategoryMap;
			break;

		case "budget":
			map = budgetMap;
			break;

		case "user":
			map = userMap;
			break;

		case "allocation":
			map = allocationMap;
			break;
		case "contributor":
			map = contributorMap;
			break;
	}

	const keyValues = Object.entries(data);
	let mappedObj = {};

	for (let [key, value] of keyValues) {
		mappedObj[map[key]] = value;
	}

	return mappedObj;
};

export default mapper;
