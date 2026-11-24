# ShopSphere - build checklist

Every box is ticked only after the item was **built and actually run** on this
machine (Java 25.0.5.1, Maven 3.9.16, MySQL 8.4.6, Node 20.20.2).
Items that could not be verified are marked honestly.

## 0. Environment

- [x] Operating system and tool versions checked (Debian 13, no Java/Maven/MySQL preinstalled - installed Temurin JDK 25.0.5.1, Maven 3.9.16, MySQL 8.4.6)
- [x] Spring Boot release compatibility with Java 25 checked before choosing versions (Spring Boot 4.2.0, supports Java 17-27)
- [x] MySQL 8 server installed, started and reachable on `127.0.0.1:3306`

## 1. Database

- [x] `database/schema.sql` creates all 6 tables with keys, indexes, checks and timestamps
- [x] `database/data.sql` seeds 1 admin, 1 customer, 5 categories, 16 products (15 active + 1 inactive)
- [x] Seed passwords are real BCrypt hashes (generated and verified with `BCryptPasswordEncoder.matches`)
- [x] Both scripts run against MySQL 8.4.6 without errors
- [x] Re-running `data.sql` resets the demo data (verified twice)

## 2. Backend

- [x] Maven project builds on Java 25 (`mvn clean package` -> BUILD SUCCESS)
- [x] 6 entities map to the 6 tables
- [x] Repositories for users, categories, products, cart items, orders (5 interfaces)
- [x] DTOs for every request and response; no entity is returned by a controller
- [x] Bean Validation on every request body
- [x] Global `@RestControllerAdvice` returning one JSON error shape
- [x] Services for auth, products, categories, cart, orders
- [x] All 7 controllers / 19 endpoints implemented
- [x] BCrypt password hashing; registration always creates CUSTOMER
- [x] JWT creation (HS512, 60 min), validation filter, `GET /api/auth/me`
- [x] Security filter chain: public catalogue, authenticated cart/orders, ADMIN-only `/api/admin/**`
- [x] Cart: add, update quantity, remove, stock and quantity checks, ownership checks
- [x] Checkout: one `@Transactional` method, server-side prices, stock reduction, cart clearing
- [x] Soft delete (`active = false`), order history survives
- [x] Admin product create/update/stock/deactivate, admin order list and status change

## 3. Tests

- [x] JUnit 5 + Mockito tests written (11 tests: the 5 required scenarios + 6 extra)
- [x] `mvn test` run: `Tests run: 11, Failures: 0, Errors: 0, Skipped: 0`
- [x] Registration-stores-BCrypt-hash test passes
- [x] Duplicate-email test passes
- [x] Checkout success (purchase-time prices, stock reduced) test passes
- [x] Insufficient-stock (no order saved) test passes
- [x] Customer-cannot-view-another-customers-order test passes

## 4. Frontend

- [x] Vite + React 18 project with React Router 6
- [x] All 12 pages implemented (Home, Login, Register, Products, Product Details, Cart, Checkout, My Orders, Order Details, Admin Products, Admin Orders, 404)
- [x] All 8 components implemented
- [x] `npm install` and `npm run build` succeed (56 modules, no warnings that matter)
- [x] Plain CSS in one stylesheet with variables, Flex/Grid, one mobile breakpoint
- [x] Auth Context only; every fetch call lives in `src/api/client.js`
- [x] `npm run dev` starts on port 5173 and proxies `/api` to the backend
- [x] Real browser (Playwright/Chromium) walkthrough: 12 of 12 UI checks passed, no console errors

## 5. Verification with real HTTP calls

- [x] Register (201), duplicate email (409), validation error (400)
- [x] Login (200 + token), `GET /api/auth/me` (200), no token (401)
- [x] Admin endpoint called by a customer (403)
- [x] Product list, search, category filter, details, 404 for unknown/inactive
- [x] Cart add/merge/update/remove, inactive product rejected, quantity 0 rejected, over-stock rejected
- [x] Checkout (201), stock reduced in MySQL, cart emptied, second checkout (400 empty cart)
- [x] Order history and order details; another customer gets 404
- [x] Insufficient stock rollback proven in MySQL (order count, stock and cart unchanged)
- [x] Admin create product (201), update stock (200), deactivate (200), product disappears from the public list
- [x] Admin order list with items, status change (200), invalid status (400)
- [x] CORS preflight from the configured origin allowed; other origins rejected
- [x] UI checked in a real browser at 1100 px and 390 px widths

## 6. Documentation

- [x] `docs/CHECKLIST.md` (this file)
- [x] `README.md` - all 16 required sections
- [x] `docs/INTERVIEW_PREPARATION.md`
- [x] `docs/PROJECT_FLOW.md`
- [x] `docs/DEVELOPMENT_LOG.md` (real history, including the bugs that were found)
- [x] `docs/LEARNING_AND_DEPLOYMENT_GUIDE.md` (learn-per-stack, free deployment, resume text)
- [x] `.gitignore`, `.env.example`, `frontend/.env.example`
- [x] Screenshots in `docs/screenshots/`

## 7. Deployment readiness (added in a later pass)

- [x] `backend/Dockerfile` (multi-stage, non-root, JRE 25) + `.dockerignore`
- [x] `application-prod.yml` maps the host's `PORT` onto `server.port`
- [x] Prod profile refuses to start without an explicit `JWT_SECRET` (unit tested + run)
- [x] Verified: `PORT=8081` + prod profile starts and serves `GET /api/products` -> 200
- [x] Verified: prod profile with no `JWT_SECRET` exits with a clear error
- [x] Verified: with no environment variables at all the default profile still starts
- [x] `frontend/vercel.json` and `frontend/public/_redirects` (SPA rewrite), `_redirects` in `dist/` confirmed
- [ ] `docker build` of the image - Docker is NOT installed on the build machine, so this is unverified
- [ ] A real Render / Vercel / filess.io / TiDB deployment - needs accounts, so it is unverified

## 8. Not done / not verified

- [ ] Frontend automated tests - out of scope for this project (stated in the README)
- [ ] Concurrency safety for two buyers of the last item - known limitation, documented
- [ ] Real deployment (HTTPS, production database, payment gateway) - not part of the scope
