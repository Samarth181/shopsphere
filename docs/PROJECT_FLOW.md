# ShopSphere - the full flow, step by step

This file follows one real session from opening the website to finishing
checkout. For every step it lists: what the user does, which React component
runs, the API request, the controller, the service method, the repository
operation, the database change, the response, and the UI update.

Legend: **DB** = MySQL `shopsphere`, **API** = `http://localhost:8080`,
**UI** = `http://localhost:5173`.

---

## Step 0 - The browser opens http://localhost:5173

| Item | Detail |
|---|---|
| User action | Types the URL |
| React | `main.jsx` mounts `BrowserRouter` -> `AuthProvider` -> `App` |
| API request | No token in localStorage, so `AuthContext` makes none |
| Controller / service / repository | - |
| DB | - |
| Response | - |
| UI update | `Navbar` shows `Login` and `Register`; `HomePage` renders |

`AuthProvider` sets `loading = true` first. If a token existed it would call
`GET /api/auth/me`; with no token it sets `loading = false` immediately.

## Step 1 - Home page loads products

| Item | Detail |
|---|---|
| User action | Opens `/` |
| React | `HomePage` -> `useEffect` -> `api.getProducts()` |
| API request | `GET /api/products` |
| Controller | `ProductController.list(null, null)` |
| Service | `ProductService.searchActiveProducts(null, null)` |
| Repository | `ProductRepository.searchActiveProducts(null, null)` |
| SQL (Hibernate) | `SELECT ... FROM products p1_0 WHERE p1_0.active=1 ORDER BY p1_0.name` |
| DB | Reads `products` (15 active rows) |
| Response | `200` array of `ProductResponse` |
| UI update | `setProducts(data.slice(0, 6))` -> six `ProductCard`s; `Loading` disappears |

## Step 2 - The user searches and filters on /products

| Item | Detail |
|---|---|
| User action | Types `java` in the search box, then picks category `Books` |
| React | `ProductsPage` - `setSearch('java')`, then `setCategoryId('2')` |
| Effect rerun | `useEffect([search, categoryId])` runs on every change |
| API request | `GET /api/products?search=java&categoryId=2` |
| Controller | `ProductController.list("java", 2L)` |
| Service | trims the search, calls the repository |
| Repository | the `@Query` with `:search IS NULL OR ...` and `:categoryId IS NULL OR ...` |
| DB | `products WHERE active = 1 AND LOWER(name) LIKE '%java%' AND category_id = 2` |
| Response | `200` -> `[{"id":7,"name":"Effective Java",...}]` (1 row) |
| UI update | One card, result count re-renders; an empty result shows `EmptyState` |

## Step 3 - The user opens a product

| Item | Detail |
|---|---|
| User action | Clicks "View details" on Cricket Ball |
| React | Router navigates to `/products/14`; `ProductDetailsPage` reads `useParams().id` |
| API request | `GET /api/products/14` |
| Controller | `ProductController.getById(14L)` |
| Service | `ProductService.getActiveProduct(14L)` |
| Repository | `findByIdAndActiveTrue(14L)` |
| DB | `SELECT ... FROM products WHERE id = 14 AND active = 1` (plus the category via `@ManyToOne`) |
| Response | `200` `{"id":14,"name":"Cricket Ball","price":349.00,"stock":66,...}` |
| UI update | Grey image box, name, price, description, stock and the quantity input |

If the product were inactive, the same URL returns `404` and the page shows the
message from the server instead of a blank screen.

## Step 4 - Login as the demo customer

| Item | Detail |
|---|---|
| User action | Goes to `/login`, types the demo email and password, clicks Login |
| React | `LoginPage` validates locally, then `AuthContext.login(email, password)` |
| API request | `POST /api/auth/login` `{"email":"customer@shopsphere.test","password":"Customer@12345"}` |
| Controller | `AuthController.login(@Valid LoginRequest)` |
| Service | `AuthService.login` -> `findByEmail`, `passwordEncoder.matches`, `jwtService.generateToken` |
| Repository | `UserRepository.findByEmail("customer@shopsphere.test")` |
| DB | `SELECT ... FROM users WHERE email = ?` (read only, no change) |
| Response | `200` `{token, tokenType, expiresInSeconds: 3600, user:{id:2, role:"CUSTOMER"}}` |
| UI update | `saveToken(token)` writes to localStorage, `setUser(user)` -> navbar shows "Demo Customer" + Logout, and the page redirects to `/products` |

## Step 5 - Add to cart

| Item | Detail |
|---|---|
| User action | Sets quantity `3` and clicks "Add to cart" |
| React | `ProductDetailsPage.handleAddToCart()` |
| API request | `POST /api/cart/items` `{"productId":14,"quantity":3}` + `Authorization: Bearer <token>` |
| Security | `JwtAuthenticationFilter` validates the token and fills the `SecurityContext` |
| Controller | `CartController.addItem(@Valid AddCartItemRequest)`; `currentUser.getId()` = 2 |
| Service | `CartService.addItem`: load active product, look for an existing line, `checkStock`, save, then rebuild the cart |
| Repository | `findByIdAndActiveTrue(14)`, `findByUserIdAndProductId(2,14)`, `save(cartItem)`, `findCartOfUser(2)` |
| DB | `INSERT INTO cart_items (user_id, product_id, quantity, created_at, updated_at) VALUES (2, 14, 3, ...)` |
| Response | `201` `{"items":[{"id":5,"productId":14,"productName":"Cricket Ball","unitPrice":349.00,"quantity":3,"lineTotal":1047.00,"availableStock":66}],"itemCount":3,"totalAmount":1047.00}` |
| UI update | Green box "Added to cart." The navbar already offers Cart |

Adding the same product again would run `UPDATE cart_items SET quantity = 6`
because of `UNIQUE(user_id, product_id)`; the service merges instead of inserting.

## Step 6 - Open the cart

| Item | Detail |
|---|---|
| User action | Clicks "Cart" |
| React | `ProtectedRoute` passes (logged in), `CartPage` mounts |
| API request | `GET /api/cart` |
| Controller | `CartController.getCart()` |
| Service | `CartService.getCart(2)` -> `toCartResponse` |
| Repository | `findCartOfUser(2)` (with `JOIN FETCH c.product p JOIN FETCH p.category`) |
| DB | `SELECT ... FROM cart_items c JOIN products ... WHERE c.user_id = 2 ORDER BY c.id` |
| Response | `200` the cart with `itemCount: 3`, `totalAmount: 1047.00` |
| UI update | Table with product, unit price, quantity buttons, line total, Remove; summary row |

## Step 7 - Change the quantity

| Item | Detail |
|---|---|
| User action | Clicks `+` next to Cricket Ball |
| React | `CartPage.changeQuantity(item, 4)` sets `busyItemId`, then calls the API |
| API request | `PUT /api/cart/items/5` `{"quantity":4}` |
| Controller | `CartController.updateItem(5L, @Valid UpdateCartItemRequest)` |
| Service | `CartService.updateQuantity(2, 5, 4)` -> `findOwnedItem` -> `checkStock` -> save |
| Repository | `findByIdAndUserId(5, 2)`, `save(cartItem)`, `findCartOfUser(2)` |
| DB | `UPDATE cart_items SET quantity = 4, updated_at = ... WHERE id = 5` |
| Response | `200` cart with `quantity: 4`, `lineTotal: 1396.00`, `totalAmount: 1396.00` |
| UI update | `setCart(response)` - the number and both totals change; the buttons are
disabled while the request is in flight |

The `+` button is disabled when `quantity >= availableStock`, and `-` when
`quantity <= 1`, so the UI prevents the obvious errors before the API does.

## Step 8 - Remove an item

| Item | Detail |
|---|---|
| User action | Clicks "Remove" |
| API request | `DELETE /api/cart/items/5` |
| Controller / service | `CartController.removeItem` -> `CartService.removeItem(2, 5)` |
| Repository | `findByIdAndUserId(5, 2)`, `delete(item)`, `findCartOfUser(2)` |
| DB | `DELETE FROM cart_items WHERE id = 5` |
| Response | `200` the remaining cart |
| UI update | The row disappears; if nothing is left, `EmptyState` shows "Your cart is empty." |

## Step 9 - Checkout page

| Item | Detail |
|---|---|
| User action | Clicks "Go to checkout" |
| React | Router shows `/checkout`; `CheckoutPage` loads the cart again on purpose |
| API request | `GET /api/cart` |
| Response | `200` the cart with the server-calculated `totalAmount` |
| UI update | Read-only table (no quantities to change here) plus "Total to pay" |

## Step 10 - Place the order

| Item | Detail |
|---|---|
| User action | Clicks "Place order" |
| React | `CheckoutPage.placeOrder()` sets `placing = true` |
| API request | `POST /api/orders/checkout` (no body) |
| Controller | `OrderController.checkout()` -> `orderService.checkout(currentUser.getId())` |
| Service | `OrderService.checkout(2)` - **one `@Transactional` method** |
| Repository (1) | `findCartOfUser(2)` -> the cart lines, with products loaded |
| Repository (2) | `findById(2)` on `UserRepository` -> the customer |
| Check | cart not empty, product active, `quantity <= stock` for every line |
| Repository (3) | `save(product)` per line, stock reduced in memory |
| DB (1) | `UPDATE products SET stock = ?, updated_at = ? WHERE id = ?` per line |
| Repository (4) | `save(order)` -> cascades to the items |
| DB (2) | `INSERT INTO orders (user_id, status, total_amount, ...) VALUES (2, 'PLACED', 1396.00, ...)` |
| DB (3) | `INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, ...)` |
| Repository (5) | `deleteAll(cartItems)` |
| DB (4) | `DELETE FROM cart_items WHERE id = ?` |
| Commit | All of the above become permanent together |
| Response | `201` `{"id":2,"userId":2,"status":"PLACED","totalAmount":1396.00,"items":[{...}],...}` |
| UI update | `navigate('/orders/2', {state:{justPlaced:true}})` |

**If stock is not enough:** `OrderService` throws
`BadRequestException("Insufficient stock for Cricket Ball")`. Spring rolls the
transaction back, so the `UPDATE products` never sticks, no order is inserted and
the cart is not cleared. `GlobalExceptionHandler` returns `400` with that message
and `CheckoutPage` shows it in a red box under the table.

## Step 11 - Order details page

| Item | Detail |
|---|---|
| React | `OrderDetailsPage` reads `useParams().id` = 2 and `location.state.justPlaced` |
| API request | `GET /api/orders/2` |
| Controller | `OrderController.myOrder(2L)` |
| Service | `OrderService.findMyOrder(2, 2)` |
| Repository | `findByIdAndUserId(2, 2)` |
| DB | `SELECT ... FROM orders WHERE id = 2 AND user_id = 2`, then the items |
| Response | `200` the order with `productName` and `unitPrice` **as stored at purchase time** |
| UI update | Green "Thank you, your order has been placed.", order number, status badge, item table, total |

If the id belonged to another customer, the same request returns `404 Order not
found` - the query filtered on `user_id` and found nothing.

## Step 12 - Order history

| Item | Detail |
|---|---|
| User action | Clicks "My Orders" |
| API request | `GET /api/orders` |
| Controller / service | `OrderController.myOrders()` -> `OrderService.findMyOrders(2)` |
| Repository | `findByUserIdOrderByIdDesc(2)` |
| DB | `SELECT ... FROM orders WHERE user_id = 2 ORDER BY id DESC` |
| Response | `200` array of orders, newest first (`items` is `[]` here) |
| UI update | Table with order number, date, total, coloured status |

## Step 13 - Logout

| Item | Detail |
|---|---|
| User action | Clicks Logout |
| React | `AuthContext.logout()` -> `clearToken()` + `setUser(null)` |
| API request | **None.** There is no `/api/auth/logout` in this project |
| DB | - |
| UI update | Navbar shows Login / Register. If the current page needs a login, `ProtectedRoute` sends the visitor to `/login` |

The token is gone from the browser, but the server would still accept that token
string until it expires. See the README section on logout for the honest version
of this trade-off.

---

## The admin side

### A1 - Admin logs in

Same as step 4 with `admin@shopsphere.test` / `Admin@12345`. The token's payload
contains `"role":"ADMIN"`, and `GET /api/auth/me` returns
`{"role":"ADMIN"}` so the navbar shows the two admin links.

### A2 - Open Admin Products

| Item | Detail |
|---|---|
| React | `ProtectedRoute adminOnly` - `isAdmin` is true, so `AdminProductsPage` renders |
| API requests | `GET /api/admin/products` and `GET /api/categories` |
| Controller | `AdminProductController.list()` (security already checked the role) |
| Service / repository | `ProductService.findAllForAdmin()` -> `findAllByOrderByIdAsc()` |
| DB | `SELECT ... FROM products ORDER BY id` (16 rows, including the inactive one) |
| Response | `200` every product with `active` flags |
| UI update | Form on top, table below; the inactive row's "Deactivate" button is disabled |

### A3 - Add a product

| Item | Detail |
|---|---|
| User action | Fills the form and clicks "Add product" |
| React | Local validation, then `api.createProduct(body)` |
| API request | `POST /api/admin/products` `{"name":"Desk Lamp","description":"...","price":1199.50,"stock":10,"categoryId":4}` |
| Security | JWT valid **and** `hasRole("ADMIN")` |
| Controller | `AdminProductController.create(@Valid ProductRequest)` |
| Service | `ProductService.create` -> `findCategory(4)` -> `new Product(...)` -> save |
| Repository | `CategoryRepository.findById(4)`, `ProductRepository.save(product)` |
| DB | `INSERT INTO products (name, description, price, stock, active, category_id, ...) VALUES (...)` |
| Response | `201` the created product with id 17 |
| UI update | Success message, form cleared, table reloaded with the new row |

### A4 - Update the stock

Stock is a normal product field, so there is no separate stock endpoint:

| Item | Detail |
|---|---|
| User action | Clicks "Edit" on Desk Lamp, changes Stock to `5`, clicks "Save changes" |
| API request | `PUT /api/admin/products/17` with the full product body |
| Controller | `AdminProductController.update(17L, @Valid ProductRequest)` |
| Service | `ProductService.update` - copies name, description, price, stock, category |
| Repository | `findById(17)`, `save(product)` |
| DB | `UPDATE products SET name=?, description=?, price=?, stock=5, category_id=?, updated_at=? WHERE id=17` |
| Response | `200` the updated product |
| UI update | Success message; the table row now shows `5` |

### A5 - Deactivate a product

| Item | Detail |
|---|---|
| User action | Clicks "Deactivate" |
| API request | `DELETE /api/admin/products/17` |
| Controller | `AdminProductController.deactivate(17L)` |
| Service | `ProductService.deactivate` -> `product.setActive(false)` -> save |
| DB | `UPDATE products SET active = 0, updated_at = ? WHERE id = 17` (no `DELETE`) |
| Response | `200` `{"message":"Product deactivated"}` |
| UI update | Row shows `Inactive`, the button is disabled, and the product is gone from `/api/products` while old orders still reference it |

### A6 - Change an order status

| Item | Detail |
|---|---|
| User action | Opens Admin Orders, picks `DELIVERED` in the dropdown |
| React | `AdminOrdersPage.handleStatusChange(order, 'DELIVERED')` |
| API request | `PUT /api/admin/orders/1/status` `{"status":"DELIVERED"}` |
| Controller | `AdminOrderController.updateStatus(1L, @Valid UpdateOrderStatusRequest)` |
| Service | `OrderService.updateStatus` - refuses to change an order that is already `DELIVERED` or `CANCELLED` |
| DB | `UPDATE orders SET status = 'DELIVERED', updated_at = ? WHERE id = 1` |
| Response | `200` the updated order |
| UI update | Success message, badge changes colour, the dropdown is disabled because the status is final |

The customer then sees the new value on `/orders/1` because every page reads the
current row from MySQL - there is no cached copy in the browser.

---

## Quick reference: URL -> component -> endpoint

| URL | Component | Endpoints used |
|---|---|---|
| `/` | HomePage | `GET /api/products` |
| `/products` | ProductsPage | `GET /api/products`, `GET /api/categories` |
| `/products/:id` | ProductDetailsPage | `GET /api/products/{id}`, `POST /api/cart/items` |
| `/login` | LoginPage | `POST /api/auth/login`, `GET /api/auth/me` |
| `/register` | RegisterPage | `POST /api/auth/register`, then `POST /api/auth/login` |
| `/cart` | CartPage | `GET /api/cart`, `PUT /api/cart/items/{id}`, `DELETE /api/cart/items/{id}` |
| `/checkout` | CheckoutPage | `GET /api/cart`, `POST /api/orders/checkout` |
| `/orders` | OrdersPage | `GET /api/orders` |
| `/orders/:id` | OrderDetailsPage | `GET /api/orders/{id}` |
| `/admin/products` | AdminProductsPage | `GET /api/admin/products`, `GET /api/categories`, `POST/PUT/DELETE /api/admin/products` |
| `/admin/orders` | AdminOrdersPage | `GET /api/admin/orders`, `PUT /api/admin/orders/{id}/status` |
