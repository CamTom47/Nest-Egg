CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL,
    date_created DATE
);
 
CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    date_created DATE NOT NULL
);
 
CREATE TABLE users_budgets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    budget_id INTEGER REFERENCES budgets(id) ON DELETE CASCADE
);
 
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    balance INTEGER,
    budget_id INTEGER REFERENCES budgets(id) ON DELETE CASCADE
);

CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    rule TEXT NOT NULL
);
 
CREATE TABLE budgets_alerts (
    id SERIAL PRIMARY KEY,
    budget_id INTEGER REFERENCES budgets(id) ON DELETE CASCADE,
    alert_id INTEGER REFERENCES alerts(id) ON DELETE CASCADE
);
 
CREATE TABLE users_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE
);
 
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL,
    category INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    date INTEGER NOT NULL
);
 
CREATE TABLE accounts_transactions (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
    transaction_id INTEGER REFERENCES transactions(id) ON DELETE CASCADE
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
    systemDefault BOOLEAN NOT NULL
);

CREATE TABLE budgets_categories(
    id SERIAL PRIMARY KEY,
    budget_id INTEGER REFERENCES budgets(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE accounts_budgets(
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
    budget_id INTEGER REFERENCES budgets(id) ON DELETE CASCADE
);
 
CREATE TABLE transactions_categories(
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES transactions(id) ON DELETE CASCADE,
    budget_id INTEGER REFERENCES categories(id) ON DELETE CASCADE
);
 

 
