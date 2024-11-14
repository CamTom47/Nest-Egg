CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT ,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    password TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL,
    date_created TIMESTAMP DEFAULT now()
);
 
CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    date_created TIMESTAMP DEFAULT now()
);
 
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    system_default BOOLEAN NOT NULL
);
 
CREATE TABLE subcategories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    system_default BOOLEAN NOT NULL
);
 
 CREATE TABLE allocation_types(
    id SERIAL PRIMARY KEY,
    name TEXT
 );

  CREATE TABLE expense_types(
    id SERIAL PRIMARY KEY,
    name TEXT
 );

 CREATE TABLE frequencies(
    id SERIAL PRIMARY KEY,
    name TEXT
    );

CREATE TABLE allocations(
    id SERIAL PRIMARY KEY,
    allocation_type INTEGER REFERENCES allocation_types(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    budget_id INTEGER REFERENCES budgets(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    subcategory_id INTEGER REFERENCES subcategories(id) ON DELETE CASCADE,
    amount MONEY,
    expense_type INTEGER REFERENCES expense_types(id) ON DELETE CASCADE,
    frequency INTEGER REFERENCES frequencies(id) ON DELETE CASCADE
);

CREATE TABLE contributors(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name TEXT
);

CREATE TABLE budgets_contributors(
    id SERIAL PRIMARY KEY,
    budget_id INTEGER REFERENCES budgets(id) ON DELETE CASCADE,
    contribution_id INTEGER REFERENCES contributors(id) ON DELETE CASCADE
);

CREATE TABLE allocations_contributors(
    id SERIAL PRIMARY KEY,
    allocation_id INTEGER REFERENCES allocations(id) ON DELETE CASCADE,
    contribution_id INTEGER REFERENCES contributors(id) ON DELETE CASCADE
);




 
