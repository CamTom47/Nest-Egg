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
    description,
    system_default
)

VALUES
    ('Bills & Utilities', null, true),
    ('Shopping', null, true),
    ('Food', null, true),
    ('Home', null, true),
    ('Gas', null, true),
    ('Travel', null, true),
    ('Housing', null, true),
    ('Transportation', null, true),
    ('Clothing', null, true),
    ('Medical/Healthcare', null, true),
    ('Insurance', null, true),
    ('Personal', null, true),
    ('Debt', null, true),
    ('Gifts/Donations', null, true),
    ('Entertainment', null, true),
    ('Other', null, true);