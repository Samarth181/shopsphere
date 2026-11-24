# ShopSphere - development log

This is the real history of building this project in one continuous session.
Problems that were actually hit are listed with the actual fix. Nothing here is
reconstructed to look tidy.

Environment at the start of the session:

| Tool | Found | Action |
|---|---|---|
| OS | Debian GNU/Linux 13 (trixie) | - |
| Java | OpenJDK **11** (`/usr/lib/jvm/jdk-11`) | Java 25 was required, so Temurin **25.0.5.1** was installed to `/opt/tools/jdk-25.0.5.1+2` |
| Maven | **not installed** | Apache Maven **3.9.16** installed to `/opt/tools/apache-maven-3.9.16` |
| Node / npm | v20.20.2 / 10.8.2 | fine as-is |
| MySQL | **not installed** | MySQL **8.4.6** (minimal Linux build) installed to `/opt/tools/mysql`, data directory `/opt/mysql-data`, server on `127.0.0.1:3306` |
| Workspace | empty (`/home/user` had no files) | nothing to overwrite; project created at `/home/user/shopsphere` |

---

## Phase 1 - Choosing versions (checked before writing code)

- Sorted out which Spring Boot release is current and supports Java 25.
  Spring Boot **4.2.0** (released 19 Nov 2026) was the latest stable, built on
  Spring Framework 7.1.0 / Spring Security 7.2.0 / Hibernate 7.4.15, and supports
  Java 17-27. Spring Boot 3.5 reached end of open-source support in June 2026,
  so 3.5 was rejected.
- Checked that `spring-boot-starter-web`, `-data-jpa`, `-security`,
  `-validation` and `-test` all exist for 4.2.0.
- Chose jjwt **0.13.0**.
- Built a throwaway probe project (`/opt/probe`) with exactly the planned
  dependencies to confirm - **before** starting the real code - that:
  - `mvn compile` succeeds on `release 25`,
  - JWT creation/parsing with `jjwt` works,
  - `BCryptPasswordEncoder` works,
  - `spring-boot-starter-test` pulls JUnit **6.1.3** and Mockito **5.24.0**,
  - Mockito mocking works on Java 25.
  Result: `BUILD SUCCESS`, and `TEST_RC=0`.

## Phase 2 - Database

- Wrote `database/schema.sql` (6 tables, PKs, FKs, unique email, unique
  `(user_id, product_id)`, DECIMAL(10,2) prices, CHECK constraints for
  `stock >= 0`, `quantity >= 1`, `total_amount >= 0` and the status/role
  enumerations, indexes on product name, `category_id`, `active`, `user_id`,
  `status`, `order_id`).
- Generated two real BCrypt hashes with a small Java program using the actual
  `BCryptPasswordEncoder`, and confirmed with `matches()` that they belong to
  `Admin@12345` and `Customer@12345`:
  - `$2a$10$.LJSAg1BG8HvuS.uAkFl7e2GMG4k41WcgFEjJzxL2mIOn3bnuUsFG`
  - `$2a$10$eWzmD2ON1ep.kl7neK2Kq.UpitwiaB1eULaQV7evgXeaIubZd038S`
- Wrote `database/data.sql`: 2 users, 5 categories, 15 active products plus 1
  inactive product (`Old Model Headphones`) so the admin screen has something to
  demonstrate a soft-deleted row.
- Loaded both into MySQL 8.4.6: schema OK, data OK, 16 products, both hashes
  start with `$2a$10$`.

**Problem hit:** MySQL's first `--initialize-insecure` run failed with
`InnoDB Database creation was aborted with error I/O error`, then
`Operating system error number 28 ... No space left on device`.
**Cause:** `/tmp` on this machine is a 992 MB tmpfs, and the extracted package
plus the data directory did not fit.
**Fix:** moved the toolchain to `/opt/tools` (on the 25 GB root filesystem) and
used `--innodb-flush-method=fsync`; initialisation then succeeded.

**Problem hit:** `mysqld` refused to start with
`error while loading shared libraries: libaio.so.1`.
**Fix:** installed `libaio1t64` and symlinked it to the name the binary expects
(`/usr/lib/x86_64-linux-gnu/libaio.so.1`).

## Phase 3 - Backend foundation

- `pom.xml` with `java.version=25`, Spring Boot 4.2.0 parent, and the dependency
  list above.
- `application.yml` with every secret and the CORS origin coming from
  environment variables, `ddl-auto: none`, `sql.init.mode: never`,
  `open-in-view: false`.
- `.env.example` at the repository root with placeholders only.
- 6 entities, 6 enums/classes (`Role`, `OrderStatus`), 19 DTO records,
  5 repository interfaces, 5 services, 7 controllers, the security package and
  the exception package.

**Problem hit (1):** compilation failed with
`package com.fasterxml.jackson.databind does not exist` in
`RestAuthenticationEntryPoint` and `RestAccessDeniedHandler`.
**Cause:** Spring Boot 4 uses **Jackson 3**, whose coordinates are
`tools.jackson.core`, not `com.fasterxml.jackson.core`. `com.fasterxml.jackson`
was only present at runtime scope (pulled in by `jjwt-jackson`), so it was not
on the compile classpath.
**Fix:** `import tools.jackson.databind.ObjectMapper;` in both classes. This is a
real Spring Boot 4 migration detail, worth remembering in an interview.

**Problem hit (2):** `no suitable constructor found for ApiError(int, String, String, Map)`.
**Fix:** added a second compact convenience constructor
`ApiError(int status, String error, String message, Map<String,String> fieldErrors)`.

After both fixes: `mvn compile` clean (56 source files).

## Phase 4 - Running the backend against real MySQL

- Packaged the jar (`target/shopsphere-backend-1.0.0.jar`, 61 MB) and started it.
- Startup log confirmed: Java 25.0.5.1, Spring Boot 4.2.0, Tomcat 11.0.27 on
  port 8080, Hikari pool started, **Database version: 8.4.6**, dialect
  `MySQLDialect`, `Started ShopSphereApplication in 7.058 seconds`.

## Phase 5 - End-to-end verification with curl (real results)

Every number below is from an actual response.

| # | Call | Result |
|---|---|---|
| 1 | `GET /api/products` | `200`, 15 active products |
| 2 | `POST /api/auth/register` new user | `201` `{"id":3,...,"role":"CUSTOMER"}` |
| 3 | same email again | `409` "An account with this email already exists" |
| 4 | invalid register body | `400` with `fieldErrors` for name, email and password |
| 5 | `POST /api/auth/login` customer | `200`, token length 238, `expiresInSeconds: 3600` |
| 6 | `GET /api/auth/me` | `200` `{"id":2,"name":"Demo Customer","role":"CUSTOMER"}` |
| 7 | `GET /api/auth/me` without token | `401` "Authentication is required" |
| 8 | `GET /api/admin/products` as customer | `403` "You do not have permission to do this" |
| 9 | `?search=java` | 1 product (Effective Java); `?categoryId=2` -> 4 books |
| 10 | `GET /api/products/999` | `404` |
| 11 | add 2x product 1 | `201`, total 1298.00 |
| 12 | add same product again | quantity merged to 3, total 1947.00 |
| 13 | add inactive product 16 | `404` "Product not found or no longer available" |
| 14 | quantity 0 | `400` fieldErrors.quantity "Quantity must be at least 1" |
| 15 | quantity 9999 (stock 12) | `400` "Only 12 unit(s) of Clean Code are available" |
| 16 | `PUT` quantity to 5 | `200`, total 4044.00 |
| 17 | checkout | `201`, order 1, total 4044.00; stock 40->35 and 12->11; cart emptied |
| 18 | checkout again | `400` "Your cart is empty" |
| 19 | `GET /api/orders/1` | `200` with both items |
| 20 | second customer opens order 1 | `404` "Order not found" |
| 21 | second customer deletes cart item 1 | `404` "Cart item not found" |
| 22 | admin login | `200`, role ADMIN |
| 23 | admin creates product | `201` id 17 |
| 24 | admin edits product 17 | `200`, stock 3, price 1099.00 |
| 25 | admin deactivates product 17 | `200`; public list drops to 15; `GET /api/products/17` -> `404` |
| 26 | admin order list | `200`, items included |
| 27 | admin sets order 1 to SHIPPED | `200`; the customer's view showed `SHIPPED` |
| 28 | invalid status `FLYING` | `400` "Request body is missing or malformed" |
| 29 | deactivate an already ordered product (1) | `200`, and order 1 still returned `4044.00` with `Wireless Mouse @ 649.00` |

**Rollback test (the important one):** added 4 keyboards to the cart, then set
that product's stock to 1 as the admin, then checked out. Response:
`400 Insufficient stock for Mechanical Keyboard`. MySQL afterwards: order count
still 1, keyboard stock still 1, cart still holding the 4 units. **The
transaction really rolled back.**

**CORS check:** preflight from `http://localhost:5173` returned
`Access-Control-Allow-Origin: http://localhost:5173`; a preflight from
`http://evil.example` was rejected with `403`.

## Phase 6 - Backend tests

- Wrote `AuthServiceTest` (2 tests) and `OrderServiceTest` (4 tests) with JUnit 5
  and Mockito, using the real `BCryptPasswordEncoder` where hashing is the point
  of the test.

**Problem hit:** `Category() has protected access in com.shopsphere.entity.Category`.
**Cause:** JPA entities have a `protected` no-arg constructor, and the test lives
in a different package.
**Fix:** a small `newCategory()` helper in the test that instantiates it with
`getDeclaredConstructor()` and `setAccessible(true)`. No production code was
changed to make a test pass.

Final result: `Tests run: 6, Failures: 0, Errors: 0, Skipped: 0`, `BUILD SUCCESS`
(2 tests in `AuthServiceTest`, 4 in `OrderServiceTest`). Run twice, same result.

## Phase 7 - Frontend

- Vite + React 18 + React Router 6, plain JavaScript.
- 12 pages, 8 shared components, one `api/client.js`, one `AuthContext`, one CSS
  file (598 lines) with CSS variables and a single 640 px breakpoint.
- `npm install` and `npm run build` both succeeded:

```
vite v5.4.21 building for production...
✓ 56 modules transformed.
dist/index.html                   0.40 kB
dist/assets/index-CuOSqbdt.css    7.25 kB
dist/assets/index-DqA6E1oy.js   191.59 kB
✓ built in 1.46s
```

**Problem hit:** the Vite dev server refused the preview host with
`403 Blocked request. This host ... is not allowed`.
**Fix:** `server.allowedHosts: true` in `vite.config.js` (development only,
documented in the file). The server was restarted and the warning disappeared.

## Phase 8 - Real browser verification

Playwright + Chromium was installed and a 12-step script drove the real UI
against the real API. This is where the frontend bugs showed up.

**Bug 1 - success message never appeared after saving a product.**
Symptom: `POST /api/admin/products` returned `201`, but no green box was shown.
Cause: `startCreate()` (which clears the form *and* the messages) was called
after `setSuccess(...)`, so it wiped the message it had just set.
Fix: capture `idBeingEdited`, `await loadProducts()`, then `startCreate()`, then
`setSuccess(...)`. Re-verified in the browser: "Product created." appears.

**Bug 2 - my own test script was wrong (not an app bug).**
The cart-quantity check failed with "expected 3, got 4" because leftover cart
rows from the earlier curl session were still in MySQL. Fix: reset the database
with `data.sql` and make the script clear its cart before measuring. The app was
correct; the test was not.

**Bug 3 - logout left the user on a protected page.**
Symptom: clicking Logout while on a page that needs a login did not move the
user anywhere.
Cause: the protected page re-rendered as "not logged in" but React Router had
nothing to navigate to, so the URL stayed as it was (the data was already gone
from screen, but the URL was misleading).
Fix: `logout()` now only clears the token and the user; `ProtectedRoute`
redirects to `/login` on the next render, which is one clear behaviour instead
of two competing navigations. Verified: logout from a protected page lands on
`/login`, logout from a public page keeps the page and switches the navbar to
Login/Register.

**Bug 4 - React Router v6 future-flag warnings in the console.**
Fix: `future={{ v7_startTransition: true, v7_relativeSplatPath: true }}` on
`BrowserRouter`. The console is now clean.

Final browser run: **12 of 12 checks passed, zero console or page errors**, with
10 screenshots saved to `docs/screenshots/`. The checks covered: home page,
search + category filter, customer login, add to cart, cart quantity buttons,
checkout, order history, customer blocked from admin page, logout, protected
route redirect, admin add/edit product + order status change, and the mobile
width layout.

## Phase 9 - Code review pass

- Removed `OrderItemRepository`: it was written early and never used (orders
  load their items through `Order`). Unused code that a reviewer would ask
  about. Verified nothing referenced it, then rebuilt: 56 source files,
  `Tests run: 6`, `BUILD SUCCESS`.
- Re-read `checkout`, `CartService` and the security config for leftover TODOs
  or dead branches: none.
- Confirmed no secrets are in the repository (only `${ENV_VAR}` references and
  `.env.example` placeholders).

## Phase 10 - Documentation

Written after the code was working, so every claim could be checked against a
real result: `README.md`, `docs/CHECKLIST.md`, `docs/PROJECT_FLOW.md`,
`docs/INTERVIEW_PREPARATION.md`, this log, `.gitignore`, and `.env.example`
files for the backend and the frontend.

---

## Phase 11 - Deployment readiness (later pass, same repository)

Reason: the project needed to be showable to a recruiter on a live URL for free, and
the learning/deployment/resume material was asked for as a separate guide.

Changes made, and why each one was needed:

| Change | Why it was needed |
|---|---|
| `application.yml` now has local development defaults and reads `${PORT}` as a fallback | Before this, a fresh clone would not start without five environment variables, and free hosts inject `PORT` rather than `SERVER_PORT` |
| New `application-prod.yml` (`server.port: ${PORT}`, `forward-headers-strategy: framework`, `require-explicit-secret: true`) | Makes the app work behind a host's load balancer, and makes a missing secret fatal in production |
| `JwtService` gained a `require-explicit-secret` flag that rejects the public dev key | The dev key is in the repository, so running production with it would let anyone forge tokens |
| New `JwtServiceTest` (5 tests) | The secret guard is security-critical, so it is tested rather than trusted |
| `backend/Dockerfile` + `.dockerignore` | Free hosts (Render, Railway, Koyeb) build a container; multi-stage keeps the final image small and non-root |
| `frontend/vercel.json` + `frontend/public/_redirects` | Without an SPA rewrite, refreshing `/orders/2` 404s on a static host |
| `.env.example` and `frontend/.env.example` rewritten | Document the deployed values, the `PORT` behaviour and the build-time nature of `VITE_*` |
| New `docs/LEARNING_AND_DEPLOYMENT_GUIDE.md` | The requested deliverable: learn-per-stack, free deployment, resume text |
| README gained §16 "Deploying it for free"; test counts updated from 6 to 11 | Documentation must match the code |

Problems hit in this phase:

- **Jackson had already been fixed in phase 3** (Spring Boot 4 uses `tools.jackson`),
  so nothing in this phase touched serialisation.
- **No Docker on the build machine.** `docker build` of the new Dockerfile could
  therefore not be verified. Rather than claim it works, the repository and the guide
  both mark image building as unverified. The base image tags
  (`maven:3.9-eclipse-temurin-25`, `eclipse-temurin:25-jre-alpine`) were checked to
  exist on Docker Hub (HTTP 200 each), which is the most that could be done here.
- **No cloud accounts.** A real Render/Vercel/filess.io deployment was not performed,
  so the guide is written as instructions plus a verification checklist, and says so.

Verified in this phase (real runs):

```
mvn clean test
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0 -- JwtServiceTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0 -- AuthServiceTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0 -- OrderServiceTest
[INFO] Tests run: 11, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS

SPRING_PROFILES_ACTIVE=prod PORT=8081 (no SERVER_PORT, explicit JWT_SECRET)
-> Tomcat started on port 8081 (http)
-> curl GET :8081/api/products = 200

SPRING_PROFILES_ACTIVE=prod (no JWT_SECRET)
-> exit code 1
-> IllegalStateException: JWT_SECRET must be set to a private random value of at
   least 32 characters when the application runs in the prod profile.

(no environment variables at all, default profile)
-> Started ShopSphereApplication
-> GET :8083/api/products = 200, POST :8083/api/auth/login = 200

npm run build
-> 56 modules transformed, built in 3.16s
-> dist/_redirects exists (SPA rewrite reaches the build output)
```

---

## Phase 12 - Comment removal (later pass)

Request: the same code with every comment removed.

What was done: a language-aware stripper (string-literal aware) removed comments from
86 source and config files: 53 of the 56 main Java files, the 3 test files, 24
frontend files (pages, components, api client, styles), both SQL files, both YAML files,
`Dockerfile`, `.dockerignore`, the root `.env.example` and `_redirects`. Three main Java
files had no comments to begin with. Markdown documentation was left alone, and
`.gitignore` was skipped because its lines are directives, not comments. Net effect:
**607 lines removed across 86 files**, no executable line changed. (The stripper's own
tally was 87 files / 604 lines; recounting against this backup gives 86 / 607 - the
difference is trailing-blank-line tidying.)

Problems hit in this phase - both worth remembering:

1. **The first stripper corrupted `SecurityConfig`.** It treated the `/*` inside the
   string `"/api/admin/**"` as the start of a block comment and deleted real code.
   The compile failed with `unclosed string literal`. The fix was to stop doing naive
   line scanning and write a character-level scanner that tracks string literals
   (including Java text blocks and JS template literals). Lesson: `/**` inside a URL
   pattern is not a comment.
2. **A test was flaky and it was my fault, not the stripper's.** The first full run
   after stripping failed `JwtServiceTest.tokensFromOtherKeysAreRejected`. The test
   tampered with the token's *last* base64 character. The final character of a base64
   string can carry padding bits, so changing it can leave the decoded bytes identical -
   the signature stays valid and the "tampered" token is legitimately accepted. The data
   was the same; only the indentation differed, which is why it surfaced now. Fix:
   tamper with a character in the middle of the token, with a comment explaining why.
   The test now passes in 3 consecutive runs.

Verified after the change (all real runs):

```
mvn clean package
[INFO] Compiling 56 source files with javac [debug parameters release 25]
[INFO] Tests run: 11, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS              (run 3 extra times: same result)

npm run build
dist/assets/index-CuOSqbdt.css    7.25 kB   <- identical hash to before, so no styling changed
dist/assets/index-C8Esfy_z.js   191.63 kB   <- identical hash to before, so no behaviour changed
✓ built in 2.40s

mysql < database/schema.sql && mysql < database/data.sql
-> tables=6 products=16 users=2

Running the stripper a second time: "TOTAL (0 files)" - it is idempotent.

Browser walkthrough against the comment-free build: 12/12 PASS, no console errors.
Prod guard still fires without JWT_SECRET (exit 1); PORT=8086 still honoured (200).
```

Docs were reconciled afterwards: the two `OrderService` code comments quoted in the
README's walkthrough were removed from the snippet, the sample SQL queries were split
into labelled blocks instead of using `--` comments, and this log was updated.

---

## Summary of the sessions's real numbers

| Item | Result |
|---|---|
| Backend source files | 56 Java files in `src/main` |
| Backend tests | 11 tests, 0 failures, 0 errors, 0 skipped (re-verified after comment removal) |
| Endpoints | 19, all called successfully with curl |
| Frontend build | `✓ built in 1.46s`, 56 modules |
| Browser checks | 12 of 12 passed, no console errors |
| Real bugs found and fixed | 4 (Jackson 3 import, `ApiError` constructor, lost success message, logout navigation) |
| Deployment files added | `Dockerfile`, `.dockerignore`, `application-prod.yml`, `vercel.json`, `public/_redirects` |
| Test-code problem fixed | 1 (`protected Category()` constructor) |
| Environment problems fixed | 3 (tmpfs space, `libaio.so.1`, no JDK 25/Maven/MySQL) |
| Unverified | an actually expired JWT (same code path as an invalid token, which was verified), a deliberate 500, every branch of the exception handler, `docker build`, and any real cloud deployment |
