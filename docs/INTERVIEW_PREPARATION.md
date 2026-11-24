# ShopSphere - interview preparation

Everything in this file matches the real code. If you say it, you can point at
the file it comes from.

---

## 1. The two-minute spoken explanation

> "ShopSphere is a small e-commerce web app I built to practise full stack Java.
>
> The backend is Spring Boot on Java 25 with MySQL. It has a layered
> architecture: controllers handle HTTP, services hold the business logic, and
> repositories talk to the database through Spring Data JPA and Hibernate.
>
> There are two roles. A customer can register, log in, browse products with
> search and category filter, add items to a cart that is stored in MySQL, and
> then place an order. An admin can add and edit products, change stock,
> deactivate a product instead of deleting it, and move orders through the
> statuses PLACED, SHIPPED, DELIVERED and CANCELLED.
>
> Security is JWT based. Passwords go into the database as BCrypt hashes and a
> login returns a token that expires in an hour. A security filter validates
> that token on every request, and the admin endpoints require the ADMIN role.
> The user id always comes from the security context, never from the request
> body, so a customer cannot touch someone else's cart or orders.
>
> The frontend is React with React Router and plain CSS. All HTTP calls live in
> one API module, and there is a single Context for authentication state. Admin
> pages are guarded in the UI and enforced on the server.
>
> The part I am proudest of is checkout. It is one transactional service method:
> it loads the cart, checks the cart is not empty, checks that every product is
> still active and in stock, copies the product name and price into the order
> items, reduces stock and clears the cart. If anything fails, everything rolls
> back. I proved that by pushing a cart of four items against a stock of one and
> watching the database stay unchanged.
>
> I also wrote six unit tests with JUnit and Mockito, including that passwords
> are stored as BCrypt hashes and that a customer cannot read another customer's
> order."

---

## 2. Workflows to practise out loud

For each one, be able to say the chain: component -> API call -> controller ->
service -> repository -> database -> response -> UI.

### 2.1 Register

1. `RegisterPage` validates name, email shape and password length locally.
2. `AuthContext.register(name, email, password)` -> `POST /api/auth/register`.
3. `AuthController.register(@Valid RegisterRequest)`.
4. `AuthService.register`: email lower-cased, `existsByEmail` -> 409 if used.
5. `passwordEncoder.encode(password)` -> BCrypt hash.
6. `new User(name, email, hash, Role.CUSTOMER)` - the role is hard-coded.
7. `UserRepository.save` -> `INSERT INTO users`.
8. `201` with `{id, name, email, role}` (no password field in `UserResponse`).
9. The frontend logs in right after and navigates to `/products`.

### 2.2 Login

1. `LoginPage` -> `AuthContext.login(email, password)` -> `POST /api/auth/login`.
2. `AuthService.login` -> `findByEmail`; missing user and wrong password give the
   same `401 "Invalid email or password"`.
3. `passwordEncoder.matches(raw, hash)`.
4. `jwtService.generateToken(id, email, role)` -> HS512, `exp` = now + 60 min.
5. `200 {token, tokenType, expiresInSeconds, user}`.
6. `saveToken(token)` into `localStorage`; `setUser(user)`; navbar updates.

### 2.3 Browse and search

1. `ProductsPage` -> `api.getProducts(search, categoryId)`.
2. `GET /api/products?search=java&categoryId=2`.
3. `ProductController.list` -> `ProductService.searchActiveProducts`.
4. One JPQL query with two optional filters (`:search IS NULL OR ...`).
5. `200` array; `setProducts(data)`.
6. Changing the search box re-runs the `useEffect` because of its dependency
   array; the empty result shows `EmptyState`.

### 2.4 Add to cart

1. `ProductDetailsPage` -> `api.addToCart(productId, quantity)`.
2. `POST /api/cart/items {productId, quantity}` with the Bearer token.
3. `JwtAuthenticationFilter` -> SecurityContext.
4. `CartController.addItem` -> `currentUser.getId()` -> `CartService.addItem`.
5. Product must be active; an existing row's quantity is merged; `checkStock`.
6. `INSERT` or `UPDATE cart_items` (unique on user + product).
7. `201` with the whole recalculated cart.

### 2.5 Update quantity

1. `+` / `-` in `CartPage` -> `api.updateCartItem(itemId, quantity)`.
2. `PUT /api/cart/items/{id} {quantity}`.
3. `CartService.updateQuantity` -> `findByIdAndUserId(id, userId)` (ownership!) ->
   `checkStock` -> save.
4. `UPDATE cart_items SET quantity = ?`.
5. `200` cart; the UI replaces its state with the server's answer.

### 2.6 Checkout

1. `CheckoutPage` -> `api.checkout()` -> `POST /api/orders/checkout`.
2. `OrderController.checkout` -> `OrderService.checkout(userId)` (`@Transactional`).
3. Empty cart -> 400. Each line: product active? `quantity <= stock`?
4. Copy `product.getName()` and `product.getPrice()` into the `OrderItem`.
5. Reduce stock, `INSERT orders`, `INSERT order_items`, `DELETE cart_items`.
6. Commit; `201` with the order.
7. UI navigates to `/orders/{id}` and shows the success box.

### 2.7 Admin adds a product

1. `AdminProductsPage` validates, then `api.createProduct(body)`.
2. `POST /api/admin/products` - `hasRole("ADMIN")` is checked by `SecurityConfig`.
3. `ProductService.create` -> `findCategory(categoryId)` -> `new Product(...)` -> save.
4. `INSERT INTO products` with `active = true`.
5. `201`; the table reloads from `GET /api/admin/products`.

### 2.8 Admin updates stock

Stock is a normal field, so it is `PUT /api/admin/products/{id}` with the full
product body. `ProductService.update` copies the new stock and saves ->
`UPDATE products SET stock = ?`. No separate endpoint exists, and the README
says so.

### 2.9 Admin changes an order status

1. `AdminOrdersPage` dropdown -> `api.updateOrderStatus(id, status)`.
2. `PUT /api/admin/orders/{id}/status {"status":"SHIPPED"}`.
3. `OrderService.updateStatus` refuses if the order is already `DELIVERED` or
   `CANCELLED`.
4. `UPDATE orders SET status = ?`.
5. `200`; badge and dropdown update. The customer sees the new status because
   every page reads the row from MySQL.

---

## 3. Project-specific Q&A (30 answers, all matching the code)

**1. What is the overall architecture?**
Three layers plus a security layer. React talks HTTP to `controller`, which calls
`service`, which calls `repository`, which Hibernate turns into SQL against
MySQL. Cross-cutting concerns live in `security` (JWT), `config` (filter chain,
CORS) and `exception` (error format).

**2. Why Spring Boot instead of plain Spring?**
Auto-configuration. `spring-boot-starter-web` brings in Tomcat and Spring MVC,
`-data-jpa` brings JPA and Hibernate, and `application.yml` is read
automatically. In plain Spring I would write XML or `@Configuration` classes for
all of that.

**3. Why MySQL rather than MongoDB?**
The data is relational: an order has items, a product has a category, a cart row
points at a user and a product. Those are foreign keys, and I want the database
to enforce them. Money also needs `DECIMAL`.

**4. Why DTOs, why not return entities?**
Three reasons. `UserResponse` has no password field, so a hash can never be
leaked. The JSON shape stays stable if a table changes. And entities have lazy
relationships that would either blow up in serialisation or expose the whole
object graph. The mapping lives in the service (`ProductService.toResponse`).

**5. How are passwords stored?**
As a BCrypt hash in `users.password_hash` (`VARCHAR(100)`; a BCrypt hash is 60
characters). `AuthService.register` calls `passwordEncoder.encode`, and login
calls `passwordEncoder.matches`. The plain password is never stored, logged or
returned. My test asserts the saved value is not the plain text and still
matches.

**6. How does JWT work in this project?**
`JwtService.generateToken` signs a token with HS512 using `JWT_SECRET` and sets
`sub` = email, plus `userId` and `role` claims and a 60-minute `exp`. The browser
sends it as `Authorization: Bearer ...`. `JwtAuthenticationFilter` validates it
on every request and puts the user into the `SecurityContext`. The payload is
readable by anyone; only the signature stops tampering.

**7. What happens if the token expires?**
`parse()` catches `JwtException`, so the token is treated as invalid, the request
stays anonymous and Spring Security answers `401`. The React app has no refresh
token, so the user logs in again. That is a stated limitation.

**8. How are the admin APIs protected?**
One line in `SecurityConfig`:
`.requestMatchers("/api/admin/**").hasRole("ADMIN")`, plus
`@EnableMethodSecurity` and `.addFilterBefore(jwtFilter, ...)`. The frontend
`ProtectedRoute adminOnly` only hides the page; the server check is the real one.
I verified it with curl: a customer token on `/api/admin/products` returns 403.

**9. How does React talk to Spring Boot?**
Through `src/api/client.js`. One `request()` function builds the URL from
`VITE_API_BASE_URL`, adds the JSON content type, adds the Bearer token, handles
network failure, and turns a non-2xx response into an `Error` carrying the
server's `message` or joined `fieldErrors`. In development Vite proxies `/api`
to `localhost:8080`.

**10. How is the cart stored?**
In the `cart_items` table, one row per (user, product), enforced by
`UNIQUE(user_id, product_id)`. It survives refresh, logout and a different
device. Adding the same product again merges quantities instead of creating a
second row.

**11. How are totals calculated?**
On the server, with `BigDecimal`. `CartService.toCartResponse` multiplies
`unitPrice * quantity` per line and reduces with `BigDecimal::add`.
`Order.addItem` calls `recalculateTotal`, so `orders.total_amount` is derived
from the order items.

**12. Why can't a user change a price?**
Because no request body in the whole API has a price field.
`AddCartItemRequest` is `{productId, quantity}` and `POST /api/orders/checkout`
has no body at all. `OrderService` reads `product.getPrice()` from the database
at checkout and stores that.

**13. What exactly happens at checkout?**
`OrderService.checkout`, one `@Transactional` method: load cart (reject empty),
load user, for every line check `isActive()` and `quantity <= stock`, copy name
and price into a new `OrderItem`, reduce stock and save the product, save the
order (items cascade), delete the cart rows. The order total comes from the
items, never from the client.

**14. Why `@Transactional`?**
Checkout writes to four tables. Without a transaction, a failure halfway would
leave stock reduced with no order, or an order with stale stock. The annotation
makes it all-or-nothing: any exception rolls back every statement.

**15. What happens on insufficient stock?**
`throw new BadRequestException("Insufficient stock for " + product.getName())`.
Spring rolls the transaction back, `GlobalExceptionHandler` turns it into
`400`, and the React page shows that exact message. Nothing is written to the
database - I verified the order count, stock and cart all unchanged.

**16. Why do order items store their own price?**
Because a price is a fact about a moment. If the admin changes a product price
later, old orders must still show what the customer paid. `order_items` keeps
`product_name` and `unit_price` as copies, plus `product_id` as a reference.
Nothing in the code updates `order_items` after checkout.

**17. How are exceptions handled?**
`GlobalExceptionHandler` is a `@RestControllerAdvice`. An `ApiException` family
(`NotFound` 404, `BadRequest` 400, `Conflict` 409, `Unauthorized` 401) carries its
own `HttpStatus`. Validation failures become 400 with `fieldErrors`, malformed
JSON becomes 400, `AccessDeniedException` becomes 403, anything else becomes a
logged 500. So the frontend only ever parses one error shape.

**18. How are services tested?**
With JUnit 5 and Mockito, no Spring context and no database.
`AuthServiceTest` builds a real `AuthService` with a mocked `UserRepository`,
mocked `JwtService` and a **real** `BCryptPasswordEncoder` (the hashing is the
thing under test). `OrderServiceTest` mocks all four repositories so it can set
stock to exactly 1 and prove the failure path. `verify(repo, never()).save(...)`
proves nothing was written.

**19. Why no `@SpringBootTest`?**
The rules I want to protect are pure Java logic in the services. A full context
would need MySQL, be slower, and test Spring rather than my code. The API itself
was verified end to end with curl, which I report honestly as manual
verification rather than as an automated integration test.

**20. How is the user identified in a request?**
Never from the body. `CurrentUser` reads the `Authentication` from the
`SecurityContextHolder`, which the JWT filter filled. `CartController` and
`OrderController` pass `currentUser.getId()` into the service.

**21. How is ownership enforced for carts and orders?**
By putting the user id in the query: `findByIdAndUserId(cartItemId, userId)` and
`findByIdAndUserId(orderId, userId)`. Another customer's row simply is not found,
so the answer is `404` and the caller cannot even tell whether it exists. In a
test, `findMyOrder(2L, 99L)` only ever calls `findByIdAndUserId(99, 2)`.

**22. How is the frontend protected-route logic built?**
`ProtectedRoute` reads `useAuth()`. While `loading` is true (the `/me` check is in
flight) it shows a loading box - that avoids logging a user out on every page
refresh. Then it redirects to `/login` with `state.from` so login can send the
user back, or shows a message when `adminOnly` is set and the role is CUSTOMER.

**23. How do you avoid the N+1 query problem?**
By fetching what I need in one query. `CartItemRepository.findCartOfUser` uses
`JOIN FETCH c.product p JOIN FETCH p.category`, and
`OrderRepository.findAllByOrderByIdDesc` uses
`@EntityGraph(attributePaths = {"items", "user"})`. Other associations stay
`LAZY`.

**24. What is the hardest part of the project?**
Checkout. Not the SQL, but getting four things right at once: server-owned
prices, stock checks, all-or-nothing writes, and the purchase-time copy. The
second hardest was Spring Boot 4 using Jackson 3, which broke my error handlers
until I changed the package to `tools.jackson.databind`.

**25. What would you improve next?**
Pessimistic locking on stock (see question 29), refresh tokens, pagination and
sorting for a large catalogue, an admin dashboard, integration tests with
`@SpringBootTest` and MockMvc, and a real payment flow.

**26. Why did you keep the frontend so plain?**
Because I have to explain every line in an interview. Plain CSS with variables
and one breakpoint, no UI library, no Redux - one Context is enough for "who is
logged in". Fewer moving parts, fewer things I cannot defend.

**27. Where do configuration values come from?**
Environment variables only: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`,
`JWT_SECRET`, `JWT_EXPIRATION_MINUTES`, `CORS_ALLOWED_ORIGIN`, `SERVER_PORT`, and
`VITE_API_BASE_URL` on the frontend. `.env.example` has placeholders, `.env` is
git-ignored, and `JwtService` refuses to start with a secret shorter than 32 bytes.

**28. Why is the schema in SQL files instead of `ddl-auto: update`?**
Because I want one clear source of truth, with indexes, checks and foreign keys
explicitly named, and a `data.sql` that a reviewer can read. `ddl-auto: none` and
`sql.init.mode: never` mean Hibernate never changes the schema behind my back.

**29. What happens if two customers buy the last item at the same moment?**
Honestly: both can succeed. My check is read-then-write - both transactions read
`stock = 1`, both decide it is fine, and both decrement to 0. That is a race
condition, and it is documented in the README as a known limitation. The fix is
pessimistic locking (`@Lock(PESSIMISTIC_WRITE)` on a `findByIdForUpdate` query)
so the second transaction blocks until the first commits, or an atomic
`UPDATE ... SET stock = stock - :q WHERE stock >= :q` and checking the affected
row count.

**30. What did you actually test?**
Eleven automated unit tests: BCrypt storage, duplicate email, checkout success with
purchase-time prices and stock reduction, insufficient stock saving nothing,
customer-cannot-view-another-order, empty cart, plus five JWT tests (the prod profile
refuses to start on the public development secret or a blank secret, short secrets are
rejected, a real token is valid and carries the claims, and tokens signed with another
key or tampered with are rejected). `mvn test` gives
`Tests run: 11, Failures: 0, Errors: 0, Skipped: 0`. Separately I verified all 19
endpoints with curl against real MySQL, and drove the UI in a real browser. I did
not run a coverage tool, so I do not quote a coverage number.

---

## 4. Scenario questions

### 4.1 Two customers buy the last item at the same moment

"Both requests read `stock = 1`, both pass the check, both write
`stock = stock - 1`, and both orders are created. Two items sold, one existed.
My code does not prevent it - I would be guessing if I said it did. What I have
is a transaction, which stops half-written data, but not two transactions reading
the same value at once. The fix is a row lock: with
`@Lock(LockModeType.PESSIMISTIC_WRITE)` on the product read, the second
transaction waits, re-reads `stock = 0`, and fails correctly with 'Insufficient
stock'. I left it out on purpose to keep the project small, and it is written in
the README as a limitation, not as something that works."

### 4.2 Insufficient stock

"Checkout checks `cartItem.getQuantity() > product.getStock()` for every line.
If it fails, `BadRequestException` is thrown, the transaction rolls back, and the
API returns `400` with `Insufficient stock for Mechanical Keyboard`. The order is
not created, stock is not changed and the cart is kept so the customer can fix
the quantity. I verified this against the real database."

### 4.3 Database failure during checkout

"If MySQL fails mid-checkout - say the connection drops after the first stock
`UPDATE` - Hibernate throws a `PersistenceException`, which is not an
`ApiException`, so it falls through to the generic handler: the transaction rolls
back and the client gets `500 "Something went wrong"` while the stack trace goes
to the server log. Nothing is half-written. Note: `500` itself was not
deliberately triggered during verification; the rollback path was verified with
the insufficient-stock case."

### 4.4 Invalid JWT

"`JwtService.parse` catches `JwtException` and returns `null`, so
`isTokenValid` is false. The filter adds no authentication, the request stays
anonymous, and any protected URL gets `401 {"message":"Authentication is
required"}` from `RestAuthenticationEntryPoint`. A tampered payload fails the
signature check, which is exactly the same path as a garbage token."

### 4.5 Unauthorized admin access

"A logged-in customer calling `/api/admin/products` is authenticated but not
authorised. `SecurityConfig`'s `hasRole("ADMIN")` fails, and
`RestAccessDeniedHandler` returns `403 {"message":"You do not have permission to
do this"}`. On the frontend, `ProtectedRoute adminOnly` shows 'This page is for
administrators only.' The server never relies on the frontend check."

### 4.6 A customer opens another customer's order

"`OrderService.findMyOrder` calls `orderRepository.findByIdAndUserId(orderId,
userId)`. The query filters by user, so the row is not found and the answer is
`404 "Order not found"`. I chose 404 rather than 403 so the API does not even
confirm that the order exists. Verified with curl using a second account."

### 4.7 The price changes after a purchase

"Nothing happens to the old order. `order_items.unit_price` was copied at
checkout, and there is no code path anywhere that updates `order_items`. The
admin edits `products.price`, which affects future orders only. I checked this:
after changing and deactivating a product that had been ordered, `GET
/api/orders/1` still returned `Wireless Mouse @ 649.00`."

### 4.8 A product is deactivated after being added to the cart

"Two layers. Adding an inactive product was already impossible
(`findByIdAndActiveTrue` -> 404). If the admin deactivates it while it sits in
someone's cart, `CartService.getCart` still lists it (the cart row exists), but
checkout re-checks `product.isActive()` and throws
`BadRequestException("<name> is no longer available")`, so no order is created
and the customer is told why. The cart is not cleared, which is deliberate: the
customer can remove the item themselves and try again."

---

## 5. The ten most important classes

| # | Class | Purpose | Annotations | Key fields / methods | Collaborators | How to explain it |
|---|---|---|---|---|---|---|
| 1 | `ShopSphereApplication` | starts everything | `@SpringBootApplication` | `main` | all | "The entry point. It scans `com.shopsphere`, starts Tomcat and reads the config." |
| 2 | `config.SecurityConfig` | the security rules | `@Configuration`, `@EnableMethodSecurity` | `securityFilterChain`, `passwordEncoder`, `corsConfigurationSource` | JWT filter, entry point, denied handler | "One place decides who may call what, and it also defines the BCrypt bean and the single allowed CORS origin." |
| 3 | `security.JwtAuthenticationFilter` | turns a token into a logged-in user | `@Component`, extends `OncePerRequestFilter` | `doFilterInternal` | `JwtService`, `AppUserDetailsService` | "Runs once per request, validates the Bearer token and fills the SecurityContext." |
| 4 | `security.JwtService` | create/validate tokens | `@Component` | `generateToken`, `extractEmail`, `isTokenValid` | env variables | "Signs with HS512 and a secret from the environment, sets a 60-minute expiry, and treats any bad token as invalid instead of throwing." |
| 5 | `service.AuthService` | register/login | `@Service`, `@Transactional` | `register`, `login`, `toResponse` | `UserRepository`, encoder, `JwtService` | "Hashes the password, hard-codes the CUSTOMER role, and returns a token on login." |
| 6 | `service.OrderService` | checkout, order history, status | `@Service` | `checkout` (`@Transactional`), `findMyOrders`, `findMyOrder`, `updateStatus` | 4 repositories | "Checkout is the heart: validate, snapshot prices, reduce stock, save, clear the cart - or roll back." |
| 7 | `service.CartService` | cart rules | `@Service` | `addItem`, `updateQuantity`, `removeItem`, `checkStock`, `toCartResponse` | `CartItemRepository`, `ProductService` | "Every query filters by user id, so a cart item can only be touched by its owner." |
| 8 | `entity.Order` + `entity.OrderItem` | order data | `@Entity`, `@OneToMany`, `@ManyToOne` | `addItem`, `recalculateTotal`, `getLineTotal` | each other | "The order owns its items and the total is derived from them; the item keeps its own copy of the price." |
| 9 | `exception.GlobalExceptionHandler` | one error format | `@RestControllerAdvice` | `handleApiException`, `handleValidation`, `handleUnexpected` | `ApiError` | "Exceptions carry their HTTP status, and the client always gets the same JSON shape." |
| 10 | `frontend/src/api/client.js` + `AuthContext` | talking to the API | React hooks, `createContext` | `request`, `api.*`, `login`, `logout`, `useAuth` | localStorage | "One API module and one Context. Every call carries the token, and every error becomes an Error with the server's message." |

---

## 6. Beginner Q&A: Java (15)

1. **What is the JVM?** The program that runs compiled Java bytecode. It is why
   the same `.jar` runs on Windows and Linux.
2. **JDK vs JRE?** The JDK contains the compiler and tools; the JRE is only the
   runtime. You need the JDK to build.
3. **Why `BigDecimal` for money?** `double` cannot represent `0.10` exactly, so
   sums drift. `BigDecimal` is exact - `DECIMAL(10,2)` in MySQL maps to it.
4. **Class vs object?** A class is the definition, an object is one instance of
   it. `Product` vs the Wireless Mouse row.
5. **What is a `record`?** A compact immutable class with generated
   constructor, getters, `equals`, `hashCode` and `toString`. All DTOs here are
   records, e.g. `ProductResponse`.
6. **Interface vs abstract class?** An interface is a contract with no state;
   `ProductRepository` is an interface with no implementation in my code.
7. **Checked vs unchecked exceptions?** Checked ones must be declared
   (`IOException`); unchecked ones extend `RuntimeException` (`NotFoundException`
   here) and do not need `throws`.
8. **What does `Optional` do?** Says "a value may be missing" and forces you to
   handle it - `findByEmail(...).orElseThrow(...)`.
9. **`==` vs `.equals()`?** `==` compares references, `.equals()` compares
   content. Always `.equals()` for strings.
10. **What is a lambda?** A short anonymous function, e.g.
    `items.stream().map(this::toResponse)`.
11. **What is a stream?** A pipeline over a collection: `filter`, `map`,
    `reduce`. The cart total is a `reduce(BigDecimal.ZERO, BigDecimal::add)`.
12. **What is a `List.of(...)`?** An immutable list - used for empty order items.
13. **What does `@Override` do?** Tells the compiler you intend to override a
    method, so a typo becomes a compile error.
14. **What is garbage collection?** Automatic memory cleanup; you do not free
    objects yourself.
15. **Why constructor injection over `@Autowired` on a field?** Dependencies are
    explicit and final, an object cannot be created half-wired, and tests can
    pass mocks into the constructor. Every service in ShopSphere does this.

## 7. Beginner Q&A: Spring Boot (15)

1. **What does `@SpringBootApplication` do?** Combines `@Configuration`,
   `@EnableAutoConfiguration` and `@ComponentScan`.
2. **What is dependency injection?** Spring creates the objects and passes what
   each one needs. `CartService` never writes `new CartItemRepository()`.
3. **`@Component` vs `@Service` vs `@Repository` vs `@Controller`?** All are
   beans; the names document the layer (`@Repository` also translates database
   exceptions).
4. **What is `@RestController`?** `@Controller` + `@ResponseBody`: the return
   value is serialised to JSON.
5. **`@RequestMapping` vs `@GetMapping`?** `@RequestMapping` sets a base path;
   `@GetMapping` maps a specific HTTP method and path.
6. **What does `@RequestBody` do?** Converts the JSON body into a Java object.
7. **What does `@Valid` do?** Runs Bean Validation (`@NotBlank`, `@Min`, `@Email`)
   before the method runs.
8. **`@RequestParam` vs `@PathVariable`?** Query string (`?search=x`) vs part of
   the path (`/products/7`).
9. **What is `ResponseEntity`?** The full response: status + body. It is how I
   return `201` from register and checkout.
10. **What does `@Transactional` do?** Wraps the method in one database
    transaction; an exception rolls back everything.
11. **What is Spring Data JPA?** It generates repository implementations from
    method names and `@Query` annotations.
12. **What is `application.yml`?** Configuration read at startup; mine uses
    `${ENV_VAR}` placeholders everywhere.
13. **What is a filter?** Code that runs before the request reaches a controller.
    `JwtAuthenticationFilter` is one.
14. **What is the `SecurityContextHolder`?** Thread-local storage for "who is
    calling"; `CurrentUser` reads it.
15. **What is the difference between `@Entity` and a DTO?** An entity is a table
    row (with lazy relations); a DTO is the API contract.

## 8. Beginner Q&A: SQL (15)

1. **What is a primary key?** The unique identifier of a row - here `id BIGINT
   AUTO_INCREMENT`.
2. **What is a foreign key?** A column that must match a row in another table,
   e.g. `products.category_id -> categories.id`. The database rejects a bad value.
3. **Why `UNIQUE(email)`?** Two users cannot share a login name; the database
   enforces it, not just the Java check.
4. **What is a composite unique key?** A unique rule over two columns:
   `UNIQUE(user_id, product_id)` in `cart_items`.
5. **What is an index and why `idx_products_name`?** A lookup structure that
   makes `WHERE name LIKE ...` and joins fast, at the cost of disk and slower
   writes.
6. **INNER vs LEFT JOIN?** INNER keeps only matching rows; LEFT keeps all rows
   from the left table with `NULL`s on the right.
7. **What does `CHECK (stock >= 0)` do?** Rejects an insert/update that would
   make stock negative - a second safety net behind the Java check.
8. **Why `DECIMAL(10,2)`?** Exact numbers with 2 decimals, up to 8 integer
   digits. `FLOAT` would round.
9. **What does `ON UPDATE CURRENT_TIMESTAMP` do?** MySQL refreshes
   `updated_at` automatically on every update.
10. **What is a one-to-many relationship?** One order, many order items. The
    "many" side holds `order_id`.
11. **What is `ORDER BY ... DESC`?** Newest first, used by
    `findByUserIdOrderByIdDesc`.
12. **`WHERE` vs `HAVING`?** `WHERE` filters rows before grouping; `HAVING`
    filters after `GROUP BY`.
13. **What is a transaction (in SQL)?** `BEGIN ... COMMIT`, with `ROLLBACK` to
    undo everything since `BEGIN`.
14. **What does `LIKE '%java%'` do?** Substring match anywhere in the text;
    `LOWER()` makes it case-insensitive.
15. **What is normalization?** Storing each fact once. The category name is in
    `categories` only, so renaming it is one `UPDATE`.

## 9. Beginner Q&A: React / JavaScript (15)

1. **What is a component?** A function returning JSX. `ProductCard` is one.
2. **What is JSX?** HTML-like syntax that JavaScript compiles into element
   objects.
3. **What is `useState`?** A hook for local state: `const [products,
   setProducts] = useState([])`. Calling the setter re-renders.
4. **What is `useEffect`?** A hook that runs side effects (fetch, timers) after
   render; the dependency array controls when it re-runs.
5. **Why the cleanup function?** It runs before the next effect and on unmount;
   my `cancelled` flag stops an old response from overwriting a newer one.
6. **What is a dependency array?** `[search, categoryId]` means "re-run when
   either changes" - that is the entire search feature.
7. **What is Context?** A way to share state without passing props down every
   level. `AuthContext` holds the logged-in user.
8. **When does Context re-render consumers?** When its value changes - so login
   and logout update the navbar and every protected page.
9. **What is `useParams`?** Reads `:id` from the URL, used by
    `ProductDetailsPage`.
10. **What is `useNavigate`?** Programmatic navigation, e.g. after checkout.
11. **What is `useLocation`?** Reads the current location, including
    `location.state.from` on the login page.
12. **What is a controlled input?** An input whose value comes from state and
    whose changes go through `onChange`.
13. **`let` vs `const`?** `const` prevents reassignment of the binding (objects
    can still be mutated); prefer it by default.
14. **What does `async/await` do?** Lets you write promise-based code like
    synchronous code; every API call here is awaited inside `try/catch`.
15. **What is `Promise.all` for?** Running independent requests at once. This
    project loads them separately on purpose, so a failure in one (categories)
    does not break the other (products).

---

## 10. Resume material

### 10.1 Three resume bullet points (only verified behaviour)

- Built a full stack e-commerce REST API with **Java 25, Spring Boot 4.2 and
  MySQL 8**, covering JWT authentication, a role-based admin area, a
  database-backed cart and a transactional checkout, verified end to end with
  curl and in a browser.
- Implemented a **single-transaction checkout** in Spring that validates stock,
  snapshots purchase-time prices into `order_items`, reduces stock and clears the
  cart atomically, returning a clear `400` and rolling back on insufficient
  stock (verified in MySQL).
- Wrote **11 JUnit 5 / Mockito unit tests** (BCrypt password storage, duplicate
  email, checkout success, insufficient stock, order ownership, empty cart) and
  built a **React 18 + Vite** frontend with protected routes and a single API
  client module.

### 10.2 Project description for a resume

> **ShopSphere - Full Stack E-Commerce Application**
> A two-role e-commerce app with a Spring Boot 4 (Java 25) REST backend on MySQL
> 8 and a React 18 frontend. Customers register, log in, browse and filter
> products, keep a server-side cart and place orders; admins manage products
> (with soft delete and stock) and order statuses. Features JWT authentication
> with BCrypt password hashing, a layered
> Controller-Service-Repository architecture, DTO-based APIs, global exception
> handling, and a transactional checkout that protects price and stock integrity.

### 10.3 Skills demonstrated

Java 25, Spring Boot 4, Spring Web, Spring Data JPA, Hibernate, Spring Security,
JWT (jjwt), BCrypt, Bean Validation, MySQL 8, SQL schema design, Maven, JUnit 5,
Mockito, React 18, React Router 6, JavaScript (ES6+), Fetch API, React Hooks,
Context API, HTML, CSS, Git.

### 10.4 Short HR explanation

"I built a small online store to practise full stack Java. Customers can
register, log in, browse products, add them to a cart and place orders, and an
admin can manage products and orders. The backend is Spring Boot with MySQL and
JWT login, the frontend is React. I wrote unit tests for the important parts like
password storage and checkout, and I tested the whole app by actually running it."

### 10.5 Technical explanation

"ShopSphere is a three-layer Spring Boot API with a React SPA. Requests carry a
JWT that a security filter validates and turns into a `SecurityContext`, so the
user id is never taken from the request body. Controllers are thin, services own
the rules, repositories are Spring Data interfaces over MySQL. All API traffic
goes through DTOs - there is no entity in a response, which keeps password hashes
out of the JSON. The core is a `@Transactional` checkout that validates stock,
copies product name and price into `order_items` so history is immutable, reduces
stock and clears the cart, rolling everything back on any failure. Products are
soft-deleted so order history stays valid. The tested parts are covered by JUnit
and Mockito unit tests on the service layer; the full API and UI were verified by
running them against real MySQL."

---

## 11. Things NOT to claim in an interview

- Do **not** say checkout is safe under concurrency. It is not - there is no
  locking. Say it is a known limitation and name the fix.
- Do **not** say logout invalidates the token on the server. It removes it from
  the browser only.
- Do **not** quote a code coverage percentage. No coverage tool was run.
- Do **not** say there are integration tests. There are unit tests, plus manual
  verification with curl and a browser.
- Do **not** say tokens are stored in HttpOnly cookies. They are in
  `localStorage`, and the trade-off is written down.
- Do **not** say images are stored. The product picture area is a grey box.
