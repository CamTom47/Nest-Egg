INSERT INTO users (
    first_name,
    last_name,
    username,
    email,
    password,
    is_admin
)

VALUES(
    'adminFirst',
    'adminLast',
    'systemAdmin',
    'test@test.com',
    'testAdminpassword',
    true
    );

INSERT INTO categories(
    name,
    system_default
)

VALUES
    ('Income', true),
    ('Bills & Utilities', true),
    ('Shopping', true),
    ('Food', true),
    ('Home', true),
    ('Gas', true),
    ('Travel', true),
    ('Housing', true),
    ('Transportation', true),
    ('Clothing', true),
    ('Medical/Healthcare', true),
    ('Insurance', true),
    ('Personal', true),
    ('Debt', true),
    ('Gifts/Donations', true),
    ('Entertainment', true),
    ('Other', true);

INSERT INTO subcategories(name, category_id, user_id, system_default)
VALUES('Salary', 1, 1, true);

INSERT INTO expense_types(name)
VALUES('Needs'),
        ('Wants'),
        ('Savings');

INSERT INTO expense_types(name)
VALUES('Annual'),
        ('Monthly'),
        ('Weekly'),
        ('Biweekly'),
        ('Semi-monthly'),
        ('Daily');