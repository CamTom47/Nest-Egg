CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL,
    date_created TIMESTAMP DEFAULT now()
);
 
CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT now()
);
 
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    systemDefault BOOLEAN NOT NULL
);
 
CREATE TABLE subcategories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    systemDefault BOOLEAN NOT NULL
);

CREATE TABLE budgets_categories(
    id SERIAL PRIMARY KEY,
    budget_id INTEGER REFERENCES budgets(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE
);
 

 
