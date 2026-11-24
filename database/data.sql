USE shopsphere;

DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM cart_items;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM users;

INSERT INTO users (id, name, email, password_hash, role) VALUES
(1, 'ShopSphere Admin', 'admin@shopsphere.test',
 '$2a$10$.LJSAg1BG8HvuS.uAkFl7e2GMG4k41WcgFEjJzxL2mIOn3bnuUsFG', 'ADMIN'),
(2, 'Demo Customer', 'customer@shopsphere.test',
 '$2a$10$eWzmD2ON1ep.kl7neK2Kq.UpitwiaB1eULaQV7evgXeaIubZd038S', 'CUSTOMER');

INSERT INTO categories (id, name) VALUES
(1, 'Electronics'),
(2, 'Books'),
(3, 'Clothing'),
(4, 'Home and Kitchen'),
(5, 'Sports');

INSERT INTO products (id, name, description, price, stock, active, category_id) VALUES
(1,  'Wireless Mouse',            'Simple 2.4 GHz wireless mouse with a USB receiver.',        649.00,  40, TRUE, 1),
(2,  'Mechanical Keyboard',       'Tenkeyless keyboard with blue switches and a USB cable.',  2299.00, 25, TRUE, 1),
(3,  'USB-C Charger 65W',         'Compact 65W charger for laptops and phones.',               1899.00, 30, TRUE, 1),
(4,  'Bluetooth Headphones',      'Over-ear headphones, about 20 hours of battery life.',     3499.00, 15, TRUE, 1),
(5,  'Power Bank 10000mAh',       '10000 mAh power bank with two output ports.',               1299.00, 50, TRUE, 1),
(6,  'Clean Code',                'A handbook of agile software craftsmanship.',                799.00, 12, TRUE, 2),
(7,  'Effective Java',            'Best practices for the Java platform, 3rd edition.',        1450.00, 10, TRUE, 2),
(8,  'Spring in Action',          'Practical guide to Spring and Spring Boot.',                1250.00,  8, TRUE, 2),
(9,  'Learning SQL',              'A beginner friendly book about SQL and databases.',          650.00, 20, TRUE, 2),
(10, 'Cotton T-Shirt',            'Plain cotton t-shirt, round neck, grey.',                    499.00, 60, TRUE, 3),
(11, 'Denim Jeans',               'Straight fit denim jeans, dark blue.',                      1599.00, 35, TRUE, 3),
(12, 'Steel Water Bottle',        '1 litre stainless steel bottle, keeps water cold.',          599.00, 45, TRUE, 4),
(13, 'Non-Stick Frying Pan',      '24 cm non-stick frying pan with a wooden handle.',          1099.00, 18, TRUE, 4),
(14, 'Cricket Ball',              'Leather cricket ball, 156 g, red.',                          349.00, 70, TRUE, 5),
(15, 'Yoga Mat',                  '6 mm yoga mat with a carry strap.',                          899.00, 22, TRUE, 5),

(16, 'Old Model Headphones',      'Discontinued model, kept for order history.',                999.00,  0, FALSE, 1);
