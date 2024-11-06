let categoryMap = {
  name: 'name',
  description: 'description',
  userId: 'user_id',
  systemDefault: 'system_default',
};

let subcategoryMap = {
  name: 'name',
  description: 'description',
  userId: 'user_id',
  categoryId: 'category_id',
  systemDefault: 'system_default',
};

let budgetMap = {
  name: 'name',
  description: 'description',
  userId: 'user_id',
};

let userMap = {
   firstName: "first_name",
   lastName: "last_name",
   username: "username",
   email: "email",
   password: "password",
   isAdmin: "is_admin",
   dateCreated: "date_created"
};

let allocationMap = {
   amount: "amount",
   subcategoryId: "subcategory_id",
   budgetId: "budget_id"
};

/**
 * Mapper function that ensure that data being passed from frontend to backend queries is changed from camelCase to snake_case to adhere to sql query syntax.
 *
 *  data = { name, description, userId, systemDefault } => {name, description, user_id, system_default}
 */

const mapper = (data: {}, type: string) => {
  let map = {};
  switch (type) {
    case 'category':
      map = categoryMap;

    case 'subcategory':
      map = subcategoryMap;
    case 'budget':
      map = budgetMap;
    case 'user':
      map = userMap
    case 'allocation':
      map = allocationMap
  }

  const keyValues = Object.entries(data);
  let mappedObj = {};

  for (let [key, value] of keyValues) {
    mappedObj[map[key]] = value;
  }

  return mappedObj;
};

export default mapper;
