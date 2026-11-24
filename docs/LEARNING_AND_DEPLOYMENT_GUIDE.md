# Learning + Free Deployment + Resume Guide

This is the companion to `README.md`. The README explains **how ShopSphere works**.
This file answers three different questions:

1. **What exactly do I need to learn in each technology so that I can understand
   and defend this project?** (Part 1 and Part 2)
2. **How do I put this on the internet for ₹0 / $0 so I can send a link to a
   recruiter?** (Part 3)
3. **What do I actually write on my resume about it?** (Part 4)

Everything here relates to **the real code in this repository**. File paths are
real paths, so you can open them as you read.

> **Honesty rule for the whole document:** a free host's numbers change every few
> months, and a resume claim you cannot defend in an interview is worse than no
> claim at all. Wherever something must be verified by *you* before you write it
> down, it says so in a **CHECK BEFORE CLAIMING** box.

---

## Table of contents

**Part 0 - How to use this guide**
- [0.1 Three learning levels](#01-three-learning-levels)
- [0.2 A 14-day study plan](#02-a-14-day-study-plan)

**Part 1 - The big picture first**
- [1.1 The one diagram you must be able to draw](#11-the-one-diagram-you-must-be-able-to-draw)
- [1.2 The five sentences that explain the whole project](#12-the-five-sentences-that-explain-the-whole-project)

**Part 2 - Stack by stack: what to learn**
- [2.1 Java 25](#21-java-25)
- [2.2 Maven](#22-maven)
- [2.3 Spring Boot](#23-spring-boot)
- [2.4 Spring Web (Spring MVC)](#24-spring-web-spring-mvc)
- [2.5 Spring Data JPA](#25-spring-data-jpa)
- [2.6 Hibernate and JPQL](#26-hibernate-and-jpql)
- [2.7 MySQL and SQL](#27-mysql-and-sql)
- [2.8 Bean Validation](#28-bean-validation)
- [2.9 Spring Security](#29-spring-security)
- [2.10 BCrypt](#210-bcrypt)
- [2.11 JWT](#211-jwt)
- [2.12 Exception handling](#212-exception-handling)
- [2.13 Transactions](#213-transactions)
- [2.14 JUnit 5 and Mockito](#214-junit-5-and-mockito)
- [2.15 JavaScript (ES6+)](#215-javascript-es6)
- [2.16 React](#216-react)
- [2.17 React Router](#217-react-router)
- [2.18 Fetch API and HTTP](#218-fetch-api-and-http)
- [2.19 HTML and CSS](#219-html-and-css)
- [2.20 Git, GitHub and curl](#220-git-github-and-curl)
- [2.21 What you can safely skip](#221-what-you-can-safely-skip)

**Part 3 - Deploy for free**
- [3.1 What "deploy" actually means for this project](#31-what-deploy-actually-means-for-this-project)
- [3.2 The free-tier landscape (checked November 2026)](#32-the-free-tier-landscape-checked-november-2026)
- [3.3 The recommended free stack](#33-the-recommended-free-stack)
- [3.4 Step 0 - push the code to GitHub](#34-step-0-push-the-code-to-github)
- [3.5 Step 1 - create the cloud MySQL database](#35-step-1-create-the-cloud-mysql-database)
- [3.6 Step 2 - deploy the backend](#36-step-2-deploy-the-backend)
- [3.7 Step 3 - deploy the frontend](#37-step-3-deploy-the-frontend)
- [3.8 Step 4 - connect the two (CORS)](#38-step-4-connect-the-two-cors)
- [3.9 Step 5 - smoke test the live site](#39-step-5-smoke-test-the-live-site)
- [3.10 Production checklist before you share the link](#310-production-checklist-before-you-share-the-link)
- [3.11 Deployment troubleshooting](#311-deployment-troubleshooting)
- [3.12 Keeping it alive, and cold starts](#312-keeping-it-alive-and-cold-starts)
- [3.13 What was and was not verified in this guide](#313-what-was-and-was-not-verified-in-this-guide)

**Part 4 - Resume and portfolio**
- [4.1 The one rule: never write what you cannot defend](#41-the-one-rule-never-write-what-you-cannot-defend)
- [4.2 Three versions of the project entry](#42-three-versions-of-the-project-entry)
- [4.3 The deployed-link line (use only after deploying)](#43-the-deployed-link-line-use-only-after-deploying)
- [4.4 Keywords that matter to recruiters and ATS](#44-keywords-that-matter-to-recruiters-and-ats)
- [4.5 GitHub repository presentation](#45-github-repository-presentation)
- [4.6 LinkedIn and portfolio text](#46-linkedin-and-portfolio-text)
- [4.7 A 90-second demo script](#47-a-90-second-demo-script)
- [4.8 Questions you will get, and the honest answers](#48-questions-you-will-get-and-the-honest-answers)
- [4.9 Pre-application checklist](#49-pre-application-checklist)

---

# Part 0 - How to use this guide

## 0.1 Three learning levels

You do not need to know everything to defend this project. Decide which level you
are aiming for, and stop when you get there.

| Level | Goal | Time from zero | What you can say |
|---|---|---|---|
| **Level 1 - Explain it** | Understand every line of the request path for one feature | ~10-14 days part time | "I can explain how login works, end to end." |
| **Level 2 - Defend it** | Answer "why", "what if" and "what next" questions for every feature | +1-2 weeks | "I can argue why I chose a transaction here and a DTO there." |
| **Level 3 - Extend it** | Add a feature (reviews, pagination, locking) without help | +2-4 weeks | "Give me a ticket and I will ship it." |

For a fresher resume and interview, **Level 2 is the target.** Do not try to reach
Level 3 before applying; the projects you never ship teach you less than the one
you can defend.

## 0.2 A 14-day study plan

Each day is 2-3 focused hours. The "read" column is the actual file you open.

| Day | Topic | Read in this repo | Deliverable for yourself |
|---|---|---|---|
| 1 | Java basics you actually use here | `entity/Product.java`, `dto/ProductResponse.java` | Explain records, `BigDecimal` and access modifiers out loud |
| 2 | Maven and the project layout | `backend/pom.xml` | Say what each dependency does and why it is there |
| 3 | Spring Boot start-up and beans | `ShopSphereApplication.java`, `config/SecurityConfig.java` | Draw the 4 layers on paper |
| 4 | HTTP + Spring MVC | `controller/ProductController.java`, `controller/CartController.java` | Map 5 URLs to methods and status codes |
| 5 | SQL and the schema | `database/schema.sql`, `database/data.sql` | Write 5 queries from memory (README §7.4) |
| 6 | Spring Data JPA and JPQL | `repository/*.java` | Explain `searchActiveProducts` line by line |
| 7 | DTOs and validation | `dto/*.java`, `exception/GlobalExceptionHandler.java` | Explain why no entity leaves the backend |
| 8 | Cart business logic | `service/CartService.java` | Explain the merge-on-second-add behaviour |
| 9 | Checkout and transactions | `service/OrderService.java` | Explain rollback without looking |
| 10 | Security, BCrypt, JWT | `security/*.java`, `config/SecurityConfig.java` | Explain 401 vs 403 and where each comes from |
| 11 | Tests | `test/java/...AuthServiceTest.java`, `OrderServiceTest.java` | Run `mvn test` and explain each assertion |
| 12 | React fundamentals | `pages/ProductsPage.jsx`, `context/AuthContext.jsx` | Explain `useState`, `useEffect`, dependency array |
| 13 | React routing + API layer | `App.jsx`, `components/ProtectedRoute.jsx`, `api/client.js` | Trace "Add to cart" from click to MySQL |
| 14 | Deploy + rehearse | this file, Part 3 and Part 4 | Live URL + 2-minute spoken pitch |

After day 14, re-read `docs/INTERVIEW_PREPARATION.md` and answer the 30 questions
without looking at the answers. Anything you stumble on points at the day you
should repeat.

---

# Part 1 - The big picture first

## 1.1 The one diagram you must be able to draw

If you can draw this from memory on a whiteboard, you already sound like someone
who understands the project.

```
   BROWSER                          SERVER (Spring Boot)                  DATABASE
+----------------+     HTTP      +---------------------------+   JDBC   +----------+
| React pages    |  ---------->  | JWT filter                | -------> | MySQL    |
| api/client.js  |               |   -> SecurityContext      |          | users    |
| AuthContext    |  <----------  | Controller (HTTP only)    | <------- | products |
| localStorage   |     JSON      |   -> Service (rules)      |          | carts    |
| (token)        |               |     -> Repository (data)  |          | orders   |
+----------------+               +---------------------------+          +----------+
```

Say it in one breath: *"React sends a JSON request with a JWT, a security filter
turns the token into a logged-in user, a controller receives the request, a
service applies the business rules, a repository saves or loads rows in MySQL,
and the answer travels back the same way."*

## 1.2 The five sentences that explain the whole project

1. **Who:** two roles - a customer who buys, an admin who manages products and orders.
2. **Where the data lives:** MySQL, 6 tables, with foreign keys and a soft-delete flag.
3. **How identity works:** BCrypt for passwords, a 60-minute JWT for requests.
4. **How the code is organised:** Controller -> Service -> Repository, DTOs at the edges.
5. **What the hard part is:** checkout, one transaction that keeps prices, stock and
   the cart consistent - and it is *not* safe against two buyers racing (known,
   documented limitation).

---

# Part 2 - Stack by stack: what to learn

Each section has the same shape:

- **Why it is in ShopSphere** - one or two lines.
- **Learn exactly this** - a table of concepts with where they appear and a test
  of whether you really understand them.
- **Read these files, in this order.**
- **Common beginner confusion** - the mistakes that make interviewers frown.
- **Practice** - small exercises you can do in this repository.
- **Free resources.**
- **Interview questions.**

---

## 2.1 Java 25

**Why it is in ShopSphere:** it is the language everything on the backend is
written in, and version 25 is the LTS release the project targets.

### Learn exactly this

| Concept | Where in ShopSphere | You understand it when you can... |
|---|---|---|
| Classes, objects, constructors | `entity/Product.java` | explain why the no-arg constructor is `protected` |
| Access modifiers (`private`, `protected`, `public`) | every entity | say why fields are private with getters |
| `final` fields | `service/CartService.java` constructor | explain why dependencies are `final` |
| Interfaces | `repository/ProductRepository.java` | explain that Spring Data writes the implementation |
| `enum` | `entity/Role.java`, `entity/OrderStatus.java` | say why an enum beats a `String` status |
| `record` | `dto/*.java` (16 of them) | list what a record generates for you |
| `BigDecimal` | `entity/Product.price`, `Order.totalAmount` | explain why not `double` for money |
| `Optional` | `repository/UserRepository.findByEmail` | explain `orElseThrow` |
| Exceptions (checked vs unchecked) | `exception/ApiException.java` | say why `ApiException` extends `RuntimeException` |
| Inheritance | `NotFoundException extends ApiException` | explain why the base class carries the HTTP status |
| Collections (`List`, `Map`) | `service/CartService.toCartResponse` | explain `List.of()` for an empty list |
| Streams and lambdas | `.stream().map(this::toResponse).toList()` | read that line out loud in plain English |
| `method references` | `BigDecimal::add` | explain what it replaces |
| Text blocks (`"""`) | `ProductRepository.searchActiveProducts` | say why JPQL is easier to read as a text block |
| `var` | demo/test code only | say when you would avoid it |
| Annotations (just syntax) | everywhere | explain they are metadata, not code that runs |

### Read these files, in this order

1. `backend/src/main/java/com/shopsphere/entity/Product.java` - the plainest class in the project.
2. `backend/src/main/java/com/shopsphere/dto/ProductResponse.java` - a record in 12 lines.
3. `backend/src/main/java/com/shopsphere/service/CartService.java` - real logic with `BigDecimal`.

### Common beginner confusion

- **"A record is just a class with less code."** It is also *immutable* - there are
  no setters. That is exactly why request/response DTOs are records and entities
  are not (Hibernate has to set fields).
- **"`BigDecimal` is slower, `double` is fine."** Money must be exact. `0.1 + 0.2`
  in `double` is not `0.3`; in `BigDecimal` it is.
- **"`static` is for anything shared."** Here `static final` is used only for
  constants like `DEV_DEFAULT_SECRET` in `JwtService`.

### Practice

1. Add a `getItemCount()` method to `entity/Order` that returns the sum of the
   quantities of its items.
2. Change `OrderStatus` to hold a display label (`PLACED("Placed")`) and use it in
   `OrderResponse`. (Then revert it - the project intentionally keeps enums bare.)
3. Explain, in writing, why `ApiException` stores an `HttpStatus` field.

### Free resources

- Oracle Java tutorials: <https://dev.java/learn/>
- Effective Java (3rd ed.) - items 1, 17, 50, 60 are the ones this project follows.
- Baeldung `BigDecimal` guide: <https://www.baeldung.com/java-bigdecimal-biginteger>

### Interview questions

- "Why `BigDecimal` for prices?" (exactness; `DECIMAL(10,2)` in MySQL)
- "What does a `record` generate, and why can't an entity be a record?"

---

## 2.2 Maven

**Why it is in ShopSphere:** it downloads every library, compiles, runs the tests,
and packages the runnable jar that gets deployed.

### Learn exactly this

| Concept | Where in ShopSphere | You understand it when you can... |
|---|---|---|
| `pom.xml` structure | `backend/pom.xml` | name the 4 mandatory elements (modelVersion, groupId, artifactId, version) |
| Parent POM / dependency management | `spring-boot-starter-parent` 4.2.0 | explain why `mysql-connector-j` has no version |
| Starter dependencies | `spring-boot-starter-web`, `-data-jpa`, `-security`, `-validation`, `-test` | explain what a starter is |
| Scopes (`compile`, `runtime`, `test`) | `jjwt-impl` is runtime, `spring-boot-starter-test` is test | say what breaks if you get this wrong |
| Properties | `<java.version>25</java.version>` | explain `${jjwt.version}` reuse |
| The lifecycle (`validate -> compile -> test -> package -> verify -> install`) | `mvn clean package` | say what `clean` adds |
| Plugins | `spring-boot-maven-plugin` | explain how the jar becomes executable |
| Local repository (`~/.m2`) | your machine | explain what "download once, reuse" means |
| `dependency:tree` | run it | find out where JUnit actually comes from |

### Read these files, in this order

1. `backend/pom.xml` - top to bottom, out loud.

### Commands you should know by heart

```bash
mvn -version                          # which Java is Maven using?
mvn clean compile                     # compile only
mvn test                              # run the 11 tests
mvn clean package                     # jar in target/
mvn spring-boot:run                   # run without packaging
mvn dependency:tree                   # where does a library come from?
```

### Common beginner confusion

- **"Maven uses my Java 25."** Not automatically. `mvn -version` shows the JDK it
  uses. If it says 11, fix `JAVA_HOME` first. This is the #1 setup bug.
- **"`mvn package` skips tests."** It runs them. `-DskipTests` skips running but
  still compiles them.
- **"The jar is 61 MB, that's a bug."** It is a fat jar: your code plus Tomcat plus
  every library. Look inside with `jar tf target/*.jar | head`.

### Practice

1. Run `mvn dependency:tree -Dincludes=org.mockito` and write down the version.
2. Add `spring-boot-starter-actuator`, run the app, hit `/actuator/health`, then
   remove it again.
3. Break a test on purpose, run `mvn test`, and read where Maven reports the failure.

### Free resources

- Maven in 5 minutes: <https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html>
- Spring Boot docs, "Build Systems": <https://docs.spring.io/spring-boot/reference/using/build-systems.html>

### Interview questions

- "What is the difference between `compile`, `runtime` and `test` scope?"
- "How does `spring-boot-starter-parent` decide library versions?"

---

## 2.3 Spring Boot

**Why it is in ShopSphere:** it starts an embedded Tomcat, wires your classes
together, reads `application.yml`, and gives you a running API without manual server
setup.

### Learn exactly this

| Concept | Where in ShopSphere | You understand it when you can... |
|---|---|---|
| `@SpringBootApplication` | `ShopSphereApplication.java` | name the 3 annotations it combines |
| Inversion of Control / dependency injection | every service constructor | explain "I never call `new CartService(...)` in production code" |
| Component scanning | `com.shopsphere.**` | say what packages are scanned and why |
| Stereotype annotations | `@Service`, `@Repository`, `@RestController`, `@Component`, `@Configuration` | match each to a layer |
| Bean lifecycle (singleton by default) | `BCryptPasswordEncoder` bean | explain why one bean is shared |
| `@Bean` methods | `SecurityConfig.passwordEncoder()` | explain when you need `@Bean` instead of `@Component` |
| `application.yml` + profiles | `application.yml`, `application-prod.yml` | explain what `SPRING_PROFILES_ACTIVE=prod` changes |
| Externalised configuration | `${DB_URL}`, `${PORT:8080}` | explain the `:` default syntax |
| Auto-configuration | Hikari pool, Jackson, JPA | say what you did *not* have to write |
| Embedded Tomcat | startup log | explain why there is no separate server install |
| `@Value` | `JwtService`, `SecurityConfig` | inject a config value |

### Read these files, in this order

1. `backend/src/main/java/com/shopsphere/ShopSphereApplication.java`
2. `backend/src/main/resources/application.yml` (every line has a purpose)
3. `backend/src/main/java/com/shopsphere/config/SecurityConfig.java` (`@Bean` methods)

### Common beginner confusion

- **"Spring Boot is a language / a server."** It is a framework that *contains* a
  server and a container of objects.
- **"`@Autowired` everywhere."** Constructor injection is preferred: dependencies
  are explicit and testable - every service here does it.
- **"Profile files are optional extras."** Here `application-prod.yml` is what makes
  free hosting work at all, because those hosts inject `PORT`, not `SERVER_PORT`.

### Practice

1. Add a log line in `ProductController.list` showing the search term, then remove it.
2. Start the app with `SPRING_PROFILES_ACTIVE=prod` and no `JWT_SECRET` and read the
   error. (It refuses to start - that is a feature.)
3. Change `server.port` in `application.yml` and observe the new port.

### Free resources

- Spring Boot reference: <https://docs.spring.io/spring-boot/index.html>
- Spring Guides "Building a RESTful Web Service": <https://spring.io/guides/gs/rest-service>

### Interview questions

- "How does dependency injection help you test `CartService`?"
- "What happens at startup, in order, from `main()` to a listening port?"

---

## 2.4 Spring Web (Spring MVC)

**Why it is in ShopSphere:** it maps URLs like `GET /api/products` to Java methods
and turns returned objects into JSON.

### Learn exactly this

| Concept | Where in ShopSphere | You understand it when you can... |
|---|---|---|
| `@RestController` vs `@Controller` | all 7 controllers | explain `@ResponseBody` |
| `@RequestMapping` base path | `@RequestMapping("/api/cart")` | build a full URL from class + method annotations |
| `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping` | all controllers | match HTTP method to intent |
| `@RequestBody` | `AuthController.login` | explain JSON -> Java |
| `@PathVariable` | `ProductController.getById` | `/api/products/{id}` vs `?search=` |
| `@RequestParam` (optional params) | `ProductController.list` | explain `required = false` |
| `ResponseEntity` | every controller | explain status + body |
| Status codes 200/201/204/400/401/403/404/409 | README §13.6 | say which code each situation deserves |
| Jackson serialisation | DTO records -> JSON | explain how a record becomes JSON |
| Content negotiation | `Content-Type: application/json` | explain the header's job |
| DispatcherServlet | (framework internal) | name it as the front controller |

### Read these files, in this order

1. `controller/ProductController.java` - the simplest two endpoints.
2. `controller/CartController.java` - who is calling, and why no user id is in the body.
3. `controller/AdminProductController.java` - who is allowed, and where that is enforced.

### Common beginner confusion

- **"The controller should check the stock."** No: it belongs in the service, or it
  will be duplicated in every endpoint that adds to a cart.
- **"Returning the entity is faster."** It is, and it is wrong: you would leak
  `password_hash` from `User` and break the JSON contract.
- **"404 and 403 are the same."** 401 = "I do not know who you are", 403 = "I know
  who you are and you may not do this", 404 = "not found (for you)".

### Practice

1. Add `GET /api/products/count` returning a number. Which status? Which DTO?
2. Make `GET /api/products` return `400` when `categoryId` is negative.
3. Explain why `POST /api/cart/items` returns `201` but `PUT /api/cart/items/{id}`
   returns `200`.

### Free resources

- Spring MVC docs: <https://docs.spring.io/spring-framework/reference/web/webmvc.html>
- MDN HTTP status codes: <https://developer.mozilla.org/en-US/docs/Web/HTTP/Status>

### Interview questions

- "Walk me through what happens between the HTTP request and your controller method."
- "Where do you decide the HTTP status code, and why there?"

---

## 2.5 Spring Data JPA

**Why it is in ShopSphere:** it turns five interfaces into working database access,
so there is almost no SQL written by hand in Java.

### Learn exactly this

| Concept | Where in ShopSphere | You understand it when you can... |
|---|---|---|
| `JpaRepository<T, ID>` | all 5 repositories | list the methods you get for free (`save`, `findById`, `findAll`, `delete`) |
| Query methods from names | `findByEmail`, `existsByEmail`, `findByIdAndActiveTrue`, `findByUserIdOrderByIdDesc` | invent a correct method name for a new need |
| `@Query` with JPQL | `ProductRepository.searchActiveProducts` | explain why it uses `:name` parameters |
| `@Param` | same | explain the binding |
| `Optional` returns | `findByEmail` | explain why `findById` is not `T findById()` |
| `@EntityGraph` | `OrderRepository.findAllByOrderByIdDesc` | explain the N+1 problem it avoids |
| `JOIN FETCH` | `CartItemRepository.findCartOfUser` | explain why it is needed with `LAZY` |
| Derived delete | `deleteAllByUserId` | explain what SQL that becomes |
| Pagination (`Pageable`) | **not used** | know it exists: `findAll(Pageable)` |

### Read these files, in this order

1. `repository/UserRepository.java` - two derived queries.
2. `repository/ProductRepository.java` - the one custom JPQL query.
3. `repository/OrderRepository.java` - `@EntityGraph` and why.

### Common beginner confusion

- **"Spring Data JPA is Hibernate."** JPA is the *specification*; Hibernate is the
  *implementation*; Spring Data JPA is the convenience layer on top. All three are
  in this project.
- **"`findByIdAndActiveTrue` runs in Java."** It becomes `WHERE id = ? AND active = 1`.
- **"N+1 is a database problem."** It is an ORM usage problem. One order list page
  can fire 1 + N queries; `@EntityGraph` fixes it.

### Practice

1. Add `List<Product> findByCategoryIdAndActiveTrue(Long categoryId)` and use it in a
   scratch endpoint. Which is simpler, this or the `@Query`? Why did the project
   choose the `@Query`?
2. Turn on SQL logging (`logging.level.org.hibernate.SQL: DEBUG`) and count the
   queries fired by `GET /api/admin/orders`.
3. Explain the difference between `getCartOfUser` with and without `JOIN FETCH`.

### Free resources

- Spring Data JPA reference: <https://docs.spring.io/spring-data/jpa/reference/>
- Baeldung "Derived Query Methods": <https://www.baeldung.com/spring-data-derived-queries>

### Interview questions

- "What is the N+1 problem and how did you avoid it here?"
- "When would you write JPQL instead of a derived method name?"

---

## 2.6 Hibernate and JPQL

**Why it is in ShopSphere:** it is the actual ORM - it reads your `@Entity` classes
and produces the SQL that MySQL runs.

### Learn exactly this

| Concept | Where in ShopSphere | You understand it when you can... |
|---|---|---|
| Entity mapping (`@Entity`, `@Table`, `@Column`) | all 6 entities | explain `name = "password_hash"` |
| `@Id` + `@GeneratedValue(IDENTITY)` | every entity | explain who assigns the id (MySQL, not Java) |
| `@ManyToOne` and the owning side | `Product.category` | explain which table holds the foreign key |
| `@OneToMany(mappedBy=...)` | `Order.items` | explain `mappedBy` in one sentence |
| `cascade = ALL`, `orphanRemoval` | `Order.items` | explain why saving an order saves its items |
| `FetchType.LAZY` vs `EAGER` | `@ManyToOne(LAZY)` everywhere | predict when `LazyInitializationException` appears |
| `@Enumerated(EnumType.STRING)` | `User.role`, `Order.status` | explain why not `ORDINAL` |
| `insertable = false` on timestamps | `createdAt` columns | explain that MySQL fills them |
| `ddl-auto: none` | `application.yml` | explain why the schema is *not* generated |
| `open-in-view: false` | `application.yml` | explain what it prevents |
| Dirty checking | `product.setStock(...)` then `save` | explain why no explicit `UPDATE` was written |
| First-level cache / persistence context | inside a `@Transactional` method | explain why two `findById` calls hit the DB once |
| JPQL vs SQL | `ProductRepository` `@Query` | explain `Product` vs `products` |

### Read these files, in this order

1. `entity/Category.java` - one table, no relationships.
2. `entity/Product.java` - the `@ManyToOne`.
3. `entity/Order.java` + `entity/OrderItem.java` - the one-to-many pair and the double-sided `addItem`.

### Common beginner confusion

- **"Hibernate creates my tables."** Only if `ddl-auto` says so. Here `schema.sql`
  owns the schema on purpose, and `ddl-auto: none` makes that explicit.
- **"LAZY is always better."** It is better until you need the data outside the
  transaction; that is why the cart query uses `JOIN FETCH`.
- **"Mapping `@OneToMany` means it loads."** It loads when you touch it, inside a
  session.

### Practice

1. Add a `@OneToMany` from `Category` to `Product` and see what breaks in the JSON.
   (Then revert - that is why the project maps only one direction.)
2. Turn on `format_sql` and read the SQL that `GET /api/products?search=java` runs.
3. Explain why `Order.addItem` sets both sides of the relationship.

### Free resources

- Hibernate User Guide: <https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html>
- Vlad Mihalcea's blog (N+1, fetch types): <https://vladmihalcea.com/>

### Interview questions

- "Explain `mappedBy` and which side owns the foreign key."
- "What is dirty checking, and where does this project rely on it?"

---

## 2.7 MySQL and SQL

**Why it is in ShopSphere:** it is the system of record. Users, products, carts and
orders only exist because rows exist.

### Learn exactly this

| Concept | Where in ShopSphere | You understand it when you can... |
|---|---|---|
| `CREATE TABLE`, data types | `database/schema.sql` | choose `VARCHAR(n)` sizes deliberately |
| `PRIMARY KEY`, `AUTO_INCREMENT` | every table | explain what happens on insert without an id |
| `FOREIGN KEY` and referential integrity | `products.category_id`, `order_items.order_id` | explain why an orphan product is impossible |
| `UNIQUE` (single and composite) | `uq_users_email`, `uq_cart_items_user_product` | explain the cart de-duplication rule |
| `CHECK` constraints | `stock >= 0`, `quantity >= 1`, `role IN (...)` | say "belt and braces" with a straight face |
| `INDEX` | `idx_products_name`, `idx_products_category_id`, `idx_products_active` | explain read speed vs write cost |
| `DECIMAL(p,s)` | prices, totals | explain exactness |
| `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` / `ON UPDATE` | all tables | explain who sets `updated_at` |
| `INSERT`, `UPDATE`, `DELETE` | `database/data.sql` | write them from memory |
| `SELECT` with `WHERE`, `LIKE`, `ORDER BY` | README §7.4 | write a search query |
| `JOIN` (INNER) | `orders` + `order_items` | explain what an inner join drops |
| `GROUP BY` + aggregates | not used in the app | write "revenue per product" anyway |
| Transactions `BEGIN`/`COMMIT`/`ROLLBACK` | checkout | explain what a rollback undoes |
| Normalisation (1NF-3NF, practically) | category name stored once | explain why the category name is not in `products` |
| Isolation levels | MySQL default `REPEATABLE READ` (in the startup log) | name the default and what a phantom read is |
| Race conditions | README §9.6 | explain lost update *before* the interviewer does |
| `mysqldump` / restore | Part 3 | move data to a cloud database |

### Read these files, in this order

1. `database/schema.sql` - read every constraint and say why it exists.
2. `database/data.sql` - note the BCrypt hashes and the `DELETE` order.
3. README §7 (tables, ER diagram, sample queries).

### Common beginner confusion

- **"Deleting a product is fine, orders keep a copy."** They keep a copy *and* a
  foreign key. A hard delete would either fail or (with cascade) erase history. Hence
  the `active` flag.
- **"`DECIMAL` and `DOUBLE` are both numbers."** One is exact, the other is
  approximate.
- **"Indexes are free."** They cost storage and slow down every write.
- **"The transaction prevents two people buying the last item."** It does not - see
  the race-condition section. Say this before you are asked.

### Practice

1. Write a query that lists each category with the number of active products in it.
2. Write a query for total revenue per product from `order_items`.
3. Insert a `cart_items` row for a user/product pair that already exists and read the
   error. Then explain why the service checks first.
4. Try to `UPDATE products SET stock = -1` and read the constraint error.

### Free resources

- MySQL 8.4 reference manual: <https://dev.mysql.com/doc/refman/8.4/en/>
- SQLBolt (interactive basics): <https://sqlbolt.com/>
- Use the real thing: `mysql -u root -p shopsphere` and type queries.

### Interview questions

- "Why `DECIMAL` and not `FLOAT`?"
- "What is the difference between a `UNIQUE` constraint and a validation in Java?"
- "Your checkout reads stock and then writes it. What can go wrong?"

---

## 2.8 Bean Validation

**Why it is in ShopSphere:** every request body is checked before any business code
runs, so a bad request never reaches the database.

### Learn exactly this

| Concept | Where in ShopSphere | You understand it when you can... |
|---|---|---|
| `@Valid` on a `@RequestBody` | `AuthController.register` | explain what runs before the method body |
| `@NotBlank`, `@NotNull`, `@NotEmpty` | DTOs | choose the right one (and know `@NotBlank` is for strings) |
| `@Email`, `@Size`, `@Min`, `@Digits`, `@DecimalMin` | `RegisterRequest`, `ProductRequest`, `AddCartItemRequest` | attach the right constraint to the right field |
| Custom messages | every constraint has one | explain why the message is written for a human |
| `MethodArgumentNotValidException` | `GlobalExceptionHandler` | explain how `fieldErrors` is built |
| Client-side vs server-side validation | `LoginPage.validate()` + DTOs | explain why the browser check is convenience only |

### Read these files, in this order

1. `dto/RegisterRequest.java`
2. `dto/ProductRequest.java`
3. `exception/GlobalExceptionHandler.handleValidation`

### Common beginner confusion

- **"I validate in React, so the backend is safe."** Anyone can call your API with
  curl. The React check is for user experience.
- **"`@NotNull` stops an empty string."** It does not. `""` is not null.
- **"Validation in the entity is enough."** Entities are not the API contract; DTOs are.

### Practice

1. Send `{"name":"","email":"nope","password":"123"}` to `/api/auth/register` with curl
   and read the `fieldErrors` map.
2. Add `@Size(max = 100)` to the cart quantity... and explain why that is a bad idea
   (stock is the real limit).

### Interview questions

- "Where does validation happen in your flow, and why in two places?"
- "How does the frontend know which field failed?"

---

## 2.9 Spring Security

**Why it is in ShopSphere:** it is the gatekeeper. It decides whether a request may
reach a controller at all, and as which user.

### Learn exactly this

| Concept | Where in ShopSphere | You understand it when you can... |
|---|---|---|
| `SecurityFilterChain` | `SecurityConfig.securityFilterChain` | read the chain top to bottom |
| `authorizeHttpRequests` rules (first match wins) | same | predict the result for 6 different URLs |
| `permitAll()` vs `authenticated()` vs `hasRole()` | same | explain `hasRole("ADMIN")` = `ROLE_ADMIN` |
| Stateless sessions | `SessionCreationPolicy.STATELESS` | explain why there is no `JSESSIONID` |
| CSRF disabled | `.csrf(disable)` | explain *why* it is safe with bearer tokens (and when it would not be) |
| Custom filter placement | `addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)` | explain why order matters |
| `SecurityContextHolder` | `CurrentUser` | explain how a service learns who is calling |
| `UserDetails` / `UserDetailsService` | `AppUserDetails`, `AppUserDetailsService` | explain the adapter between Spring and your `User` entity |
| `AuthenticationEntryPoint` (401) vs `AccessDeniedHandler` (403) | `RestAuthenticationEntryPoint`, `RestAccessDeniedHandler` | say which fires when |
| CORS as a security rule | `corsConfigurationSource()` | explain why the origin allow-list is not optional |
| `@EnableMethodSecurity` | `SecurityConfig` | know it enables `@PreAuthorize` (not used here) |
| Password encoder bean | `passwordEncoder()` | explain BCrypt wiring |

### Read these files, in this order

1. `config/SecurityConfig.java`
2. `security/JwtAuthenticationFilter.java`
3. `security/AppUserDetails.java` + `AppUserDetailsService.java`
4. `security/CurrentUser.java`

### Common beginner confusion

- **"Hiding the button protects the API."** It does not. `curl` does not care about
  your React code. `hasRole("ADMIN")` is the protection; `ProtectedRoute` is politeness.
- **"401 and 403 are interchangeable."** They are not: 401 means *unauthenticated*,
  403 means *authenticated but not allowed*.
- **"Disabling CSRF makes the app insecure."** CSRF exploits cookies that browsers
  send automatically. This API uses an `Authorization` header that a browser will not
  attach on its own, so there is nothing to exploit. Say it exactly like that.
- **"`@EnableMethodSecurity` is required for `hasRole` in the chain."** No - it is
  there for method-level annotations. Be precise.

### Practice

1. Call `/api/admin/products` with: no token, a customer token, an admin token.
   Predict and then observe 401, 403, 200.
2. Add a `GET /api/orders/all` to the customer controller and watch it still be
   protected (because `anyRequest().authenticated()`).
3. Explain why `requestMatchers(HttpMethod.GET, "/api/products", "/api/products/**")`
   needs both patterns.

### Free resources

- Spring Security reference: <https://docs.spring.io/spring-security/reference/>
- Spring Security architecture (filters): <https://docs.spring.io/spring-security/reference/servlet/architecture.html>

### Interview questions

- "Explain your filter chain, in order, for a request with a valid token."
- "Where would you add a new public endpoint, and what could go wrong?"

---

## 2.10 BCrypt

**Why it is in ShopSphere:** passwords are stored as one-way hashes so a database
leak does not leak passwords.

### Learn exactly this

| Concept | Where in ShopSphere | You understand it when you can... |
|---|---|---|
| Hashing is one-way | `AuthService.register` | explain why you cannot "decrypt" it |
| Salt | every BCrypt hash contains one | explain why two users with the same password differ |
| Cost factor (here 10) | `$2a$10$...` prefix | explain slow-by-design |
| `encode` vs `matches` | register vs login | explain login never compares strings |
| Hash length 60 chars | `VARCHAR(100)` column | explain the column size |
| Constant-ish error message | "Invalid email or password" | explain why not "no such user" |
| `DelegatingPasswordEncoder` / prefixes | `$2a$` | know that `{bcrypt}` storage formats exist |

### Read these files, in this order

1. `service/AuthService.java` (`register` and `login`)
2. `config/SecurityConfig.passwordEncoder()`
3. `backend/src/test/java/com/shopsphere/service/AuthServiceTest.java`

### Common beginner confusion

- **"BCrypt is encryption."** No. There is no key to decrypt with.
- **"I can compare hashes with `equals`."** You must use `matches` because every hash
  has a different salt.
- **"MD5/SHA-256 is fine, it's a hash."** They are fast, so they are brute-forced
  quickly. BCrypt is deliberately slow.

### Practice

1. Run `AuthServiceTest` and read the assertion that the stored value is 60 characters
   and starts with `$2a$10$`.
2. Log in with a wrong password and confirm the message does not reveal whether the
   email exists.
3. Explain in one paragraph why `VARCHAR(100)` is right (hashes can grow if the cost
   factor rises).

### Interview questions

- "How do you verify a password if you cannot decrypt the hash?"
- "Why is the login error message deliberately vague?"

---

## 2.11 JWT

**Why it is in ShopSphere:** the API is stateless, so every request must carry proof
of who is calling.

### Learn exactly this

| Concept | Where in ShopSphere | You understand it when you can... |
|---|---|---|
| Structure `header.payload.signature` | `JwtService` | decode a token by hand (base64url) |
| Signing (HS512) vs encryption | `signWith(secretKey)` | explain "readable but not forgeable" |
| Claims (`sub`, `iat`, `exp`, custom) | `generateToken` | list this project's claims |
| Expiry | `exp` = now + 60 min | explain what the server does when it passes |
| Validation | `isTokenValid`, `parse` | explain why a bad token is not a 500 |
| `Bearer` header convention | `JwtAuthenticationFilter` | explain the header format exactly |
| Secret hygiene | `JWT_SECRET` env var, `require-explicit-secret` | explain why the dev default is refused in prod |
| Why not sessions | stateless API + React on another origin | explain the trade-off |
| Token storage trade-offs | `localStorage` in `api/client.js` | compare with `HttpOnly` cookies, honestly |
| Revocation problem | logout is client-side | say plainly that the token lives until `exp` |

### Read these files, in this order

1. `security/JwtService.java`
2. `security/JwtAuthenticationFilter.java`
3. `frontend/src/api/client.js` (how the token is attached)
4. `frontend/src/context/AuthContext.jsx` (where it is stored and cleared)

### Practice

1. Take a real token, paste the middle part into a base64 decoder, and read the claims.
   Then change `"role":"CUSTOMER"` to `"ADMIN"` and see the call fail (signature).
2. Decode `exp` with `date -d @<exp>` and confirm it is 60 minutes ahead.
3. Start the app in the `prod` profile with no `JWT_SECRET` and read the shutdown
   message.

### Free resources

- jwt.io (decode and inspect tokens): <https://jwt.io/>
- RFC 7519 (the spec, skimmable): <https://datatracker.ietf.org/doc/html/rfc7519>
- OWASP JWT cheat sheet: <https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html>

### Interview questions

- "How does the server know the token was not modified?"
- "What happens to a logged-out user's token?"
- "Where do you store the token and what is the risk?"

---

## 2.12 Exception handling

**Why it is in ShopSphere:** one error shape for the whole API, so the frontend can
always show a useful message.

### Learn exactly this

| Concept | Where in ShopSphere | You understand it when you can... |
|---|---|---|
| `@RestControllerAdvice` | `GlobalExceptionHandler` | explain why it is needed |
| `@ExceptionHandler` | 7 handlers | explain the "most specific wins" rule |
| Custom exception hierarchy | `ApiException` + 4 subclasses | explain why each carries an `HttpStatus` |
| Status mapping | handler table | map 6 exceptions to status codes |
| Validation error aggregation | `handleValidation` | explain `fieldErrors` |
| Logging unexpected errors | `handleUnexpected` | explain why stack traces go to the log, not the client |
| Not leaking internals | generic 500 message | explain why |

### Read these files, in this order

1. `exception/ApiException.java` and `NotFoundException.java`
2. `exception/GlobalExceptionHandler.java`
3. Any service that throws (search for `throw new`).

### Practice

1. Trigger every handler once with curl and record the status + body.
2. Add `MethodNotAllowedException` handling and explain when it fires.
3. Explain why `ApiException` extends `RuntimeException` and not `Exception`.

### Interview questions

- "What does the client receive for an unexpected exception, and where is the detail?"
- "Why not `try/catch` in every controller?"

---

## 2.13 Transactions

**Why it is in ShopSphere:** checkout writes to four tables and must be all-or-nothing.

### Learn exactly this

| Concept | Where in ShopSphere | You understand it when you can... |
|---|---|---|
| What a transaction is | `OrderService.checkout` | list the statements inside it |
| `@Transactional` + proxy mechanism | same method | explain why a private method annotation does nothing |
| Rollback on unchecked exceptions | insufficient stock path | explain what is undone |
| `readOnly = true` | most read methods | explain the optimisation |
| What is *not* protected (race conditions) | README §9.6 | explain lost update |
| Locking as a fix | not implemented | describe `PESSIMISTIC_WRITE` |
| Long transactions are bad | why no HTTP calls inside | explain connection pool pressure |

### Practice

1. Follow `docs/DEVELOPMENT_LOG.md` "Rollback test" and reproduce it: add 4 units,
   drop stock to 1, check out, then check the tables.
2. Add a deliberate `throw new RuntimeException()` after the first stock update and
   confirm stock is unchanged.
3. Explain why `deleteAll(cartItems)` is *after* `orderRepository.save(order)`.

### Interview questions

- "Show me one thing that would corrupt data without `@Transactional`."
- "Is your checkout safe under concurrent load? Explain."

---

## 2.14 JUnit 5 and Mockito

**Why it is in ShopSphere:** 11 tests protect the rules that are easy to break:
passwords, stock, ownership, JWT secrets.

### Learn exactly this

| Concept | Where in ShopSphere | You understand it when you can... |
|---|---|---|
| `@Test`, `@DisplayName` | all tests | explain why the display name is written as a sentence |
| Assertions | `assertEquals`, `assertThrows`, `assertTrue` | pick the right assertion |
| `@BeforeEach` | test setup | explain the fresh-instance-per-test rule |
| `@Mock` + `@ExtendWith(MockitoExtension.class)` | both service tests | explain what is mocked and why |
| Stubbing `when(...).thenReturn(...)` | `OrderServiceTest` | stub a call chain |
| `thenAnswer` | `save` returning its argument | explain why it is needed |
| Verification | `verify(repo, never()).save(any())` | prove nothing was written |
| `ArgumentCaptor` | captured `Product`, `Order` | inspect what was passed |
| Behaviour vs implementation testing | assertions on the DTO | explain the difference |
| What you do **not** mock | real `BCryptPasswordEncoder` | explain why faking it would be pointless |
| Reflection for test data | `newCategory()`, `setField()` | explain why it is acceptable in a test |
| Unit vs integration tests | README §14.1 | define both and say what this project has |

### Read these files, in this order

1. `AuthServiceTest.java` (BCrypt + duplicate email)
2. `OrderServiceTest.java` (checkout success, insufficient stock, ownership, empty cart)
3. `JwtServiceTest.java` (the prod secret guard)

### Practice

1. Run `mvn test` and read the surefire report in `target/surefire-reports/`.
2. Write a 7th test: changing a cart item that belongs to another user throws
   `NotFoundException`. (Hint: mock `findByIdAndUserId` to return empty.)
3. Delete one assertion at a time and watch the test still pass - prove to yourself
   which assertions actually matter.

### Interview questions

- "Why unit tests here and not `@SpringBootTest`?"
- "How do you test that no order was saved on failure?"

---

## 2.15 JavaScript (ES6+)

**Why it is in ShopSphere:** the entire frontend is plain JavaScript - no TypeScript.

### Learn exactly this

| Concept | Where in ShopSphere | You understand it when you can... |
|---|---|---|
| `const` / `let`, block scope | all files | say why `var` is avoided |
| Arrow functions | `api/client.js` | explain what `this` means inside one |
| Template literals | `` `/api/products/${id}` `` | build a URL |
| Destructuring | `const { user, isLoggedIn } = useAuth()` | explain it |
| Spread | `setForm({ ...form, [name]: value })` | explain the computed key |
| Objects and shorthand | `{ method: 'POST', body }` | explain shorthand properties |
| `async` / `await` | every API call | explain what an `await`ed promise means |
| `try/catch/finally` | page loads | explain why `finally` sets `loading` false |
| Promises | `api.getProducts().then(...)` | rewrite a `.then` chain as `await` |
| Array methods | `.map`, `.slice`, `.filter` | explain `data.slice(0, 6)` |
| Modules (`import`/`export`) | everywhere | explain named vs default exports |
| Optional chaining `?.` | `user?.role === 'ADMIN'` | explain what it prevents |
| `localStorage` | `getToken`, `saveToken` | explain it is per-browser, not per-user |
| `import.meta.env` | `VITE_API_BASE_URL` | explain how Vite exposes env vars |

### Practice

1. Rewrite `AuthContext`'s `loadUser` using `.then()` instead of `async/await`,
   then revert.
2. Break `getToken()` to return `undefined` and see what the UI does.
3. Add a `formatMoney(value)` helper and use it everywhere instead of
   `Number(x).toFixed(2)`.

### Free resources

- MDN JavaScript guide: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide>
- javascript.info: <https://javascript.info/>

### Interview questions

- "What does `await` do, and why does it not block the browser?"
- "Why does `setState` not update the variable immediately?"

---

## 2.16 React

**Why it is in ShopSphere:** the UI is 12 small function components, hooks only, no
Redux and no UI library.

### Learn exactly this

| Concept | Where in ShopSphere | You understand it when you can... |
|---|---|---|
| Components as functions returning JSX | `components/ProductCard.jsx` | explain JSX -> `React.createElement` |
| Props | `<ProductCard product={p} />` | explain one-way data flow |
| `useState` | every page | explain that the setter triggers a re-render |
| `useEffect` and cleanup | page loads | explain the `cancelled` flag |
| Dependency array | `ProductsPage` `[search, categoryId]` | predict when the effect re-runs |
| Controlled inputs | `FormField` usage | explain `value` + `onChange` together |
| Lists and `key` | `.map(... key={p.id})` | explain why the index is a bad key |
| Conditional rendering | `loading && <Loading />` | explain `&&` vs ternary here |
| Context | `AuthContext` | explain why not props, and why not Redux |
| Custom hook | `useAuth()` | explain what it wraps |
| Lifting state up | `App.jsx` routes, state in pages | explain where cart state lives (the server!) |
| StrictMode double-invoke in dev | `main.jsx` | explain why effects run twice in development |
| Loading/error/empty states | every page | explain why all three exist |

### Read these files, in this order

1. `components/ProductCard.jsx` (`props`, JSX, `key`)
2. `pages/ProductsPage.jsx` (state, effect, deps, all three UI states)
3. `context/AuthContext.jsx` (Context, custom hook, async in effects)
4. `pages/AdminProductsPage.jsx` (a form with validation, edit mode, reload after save)

### Common beginner confusion

- **"`setState` is synchronous."** It is not; that is why `console.log` right after it
  shows the old value.
- **"State is global."** Each component instance has its own state; only Context is shared.
- **"`useEffect(() => {...})` with no array runs once."** It runs after *every* render.
  An empty array `[]` means once.
- **"The cart is in React state."** Here it is not: the server owns it, and React
  renders whatever the last response said. That is the important design decision.

### Practice

1. Add a "sort by price" dropdown to `ProductsPage`. Do it on the client first, then
   explain why a real shop would do it on the server.
2. Add a `CartSummary` component used by both `CartPage` and `CheckoutPage`.
3. Delete the `cancelled` flag and type quickly in the search box; explain the bug.

### Free resources

- React docs (hooks): <https://react.dev/learn>
- "Thinking in React": <https://react.dev/learn/thinking-in-react>

### Interview questions

- "Why a Context here and not Redux?"
- "Where does your cart live, and why?"

---

## 2.17 React Router

**Why it is in ShopSphere:** 12 URLs must show 12 components without reloading the page.

### Learn exactly this

| Concept | Where in ShopSphere | You understand it when you can... |
|---|---|---|
| `BrowserRouter` vs `HashRouter` | `main.jsx` | explain why a server rewrite is needed for `BrowserRouter` |
| `Routes` / `Route` | `App.jsx` | add a new page correctly |
| `Link` vs `NavLink` | `Navbar.jsx` | explain the `active` class |
| `useParams` | `ProductDetailsPage` | read `:id` from the URL |
| `useNavigate` | `CheckoutPage` after checkout | navigate in code |
| `useLocation` | `LoginPage`, `OrderDetailsPage` | read `state` you passed |
| `Navigate` (declarative redirect) | `ProtectedRoute` | explain `<Navigate replace />` |
| Route guards (wrapper component) | `ProtectedRoute.jsx` | write one from scratch |
| `state.from` pattern | `ProtectedRoute` + `LoginPage` | explain "come back after login" |
| Catch-all route | `path="*"` | explain the 404 page |
| SPA rewrite on the host | `frontend/vercel.json`, `frontend/public/_redirects` | explain why a refresh on `/orders/2` 404s without it |

### Practice

1. Add `/profile` showing `GET /api/auth/me` data, guarded by `ProtectedRoute`.
2. Remove `replace` from the login redirect and observe the back-button behaviour.
3. Delete `vercel.json`'s rewrite, deploy, and open `/orders/2` directly - see the 404.

### Interview questions

- "How do you protect a route, and why is that not enough?"
- "Why does a direct visit to `/orders/2` need server configuration?"

---

## 2.18 Fetch API and HTTP

**Why it is in ShopSphere:** `fetch` is the only transport between React and Spring Boot.

### Learn exactly this

| Concept | Where in ShopSphere | You understand it when you can... |
|---|---|---|
| HTTP methods and semantics | `api/client.js` | explain why `PUT` here sends the full quantity, not a delta |
| Request headers | `Authorization`, `Content-Type` | explain each |
| `fetch` does not reject on 4xx/5xx | `request()` checks `response.ok` | explain this classic gotcha |
| Reading the body | `await response.text()` then `JSON.parse` | explain why not always `response.json()` |
| Status codes in practice | 201, 400, 401, 403, 404, 409 | map to UI behaviour |
| Query strings | `URLSearchParams` | build a filtered URL |
| CORS preflight | `OPTIONS` + `Access-Control-*` | explain when a preflight happens |
| Network failure vs HTTP error | the `catch` in `request()` | explain "Cannot reach the server" |
| Aborting / cancelling | not used (flag instead) | know `AbortController` exists |

### Practice

1. In DevTools -> Network, click "Add to cart" and read the request headers, the
   payload, and the response.
2. Send the same request from the browser console with a wrong token; read the 401 body.
3. Remove `Authorization` from `request()` and explain every breakage that follows.

### Interview questions

- "Why does `fetch` not throw on a 404?"
- "What is a CORS preflight and when is it sent?"

---

## 2.19 HTML and CSS

**Why it is in ShopSphere:** one plain stylesheet, CSS variables, Flexbox, Grid, one
breakpoint - deliberately boring so it is explainable.

### Learn exactly this

| Concept | Where in ShopSphere | You understand it when you can... |
|---|---|---|
| Semantic HTML | `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, `<table>` | explain why not all `<div>` |
| Forms and labels | `FormField` (`htmlFor` + `id`) | explain click-to-focus and accessibility |
| Tables | orders, admin lists | explain `<thead>` / `<tbody>` / `<th>` |
| CSS variables | `:root { --color-accent: ... }` | change the accent colour in one place |
| Box model + `box-sizing` | `* { box-sizing: border-box }` | explain the difference |
| Flexbox | `.navbar-inner`, `.cart-summary` | lay out a row that wraps |
| Grid | `.product-grid` with `auto-fill minmax()` | explain the responsive card grid |
| Media query | `@media (max-width: 640px)` | explain mobile-first vs this approach |
| Specificity and cascade | `.btn.btn-small` | explain why order matters |
| States | `:hover`, `:focus`, `:disabled` | style a disabled button |
| Utility-ish classes | `.muted`, `.state-box` | explain why not a framework |
| `border-radius: 4px` | `--radius` | explain the deliberate plainness |

### Practice

1. Change `--color-accent` to green and check every screen.
2. Make the product grid 2 columns on mobile and explain the CSS you changed.
3. Add `:focus-visible` outlines and explain why it matters for keyboard users.

### Interview questions

- "Why no Tailwind or Bootstrap here?"
- "How does your grid adapt between mobile and desktop?"

---

## 2.20 Git, GitHub and curl

**Why it is in ShopSphere:** the project only exists as a portfolio piece once it is
committed, pushed, and testable from a terminal.

### Learn exactly this

| Concept | Where in ShopSphere | You understand it when you can... |
|---|---|---|
| `init`, `add`, `commit`, `push` | README §15.3 | run the whole sequence |
| `.gitignore` | root file | explain each ignored entry |
| Never commit secrets | `.env` ignored, `.env.example` committed | explain why the example is safe |
| Meaningful commit messages | the recommended sequence | write one for a new feature |
| Branches (basic) | not used | create one for an experiment, then merge |
| `git log --oneline`, `git diff` | your repo | inspect your own history |
| README as the front door | `README.md` | explain why it matters more than code style to a reviewer |
| `curl` for API checks | README §13 | send an authenticated request |
| Reading JSON responses | `python3 -m json.tool` | format a response |
| GitHub topics and description | README §15.5 | make the repo discoverable |

### Practice

1. Create a branch, add the `GET /api/products/count` endpoint from §2.4, commit it,
   and open a pull request against your own repository. Read the diff.
2. Clone your repo into a fresh folder and follow your own README from scratch. Every
   place you get stuck is a README bug - fix it.
3. Run the curl examples from README §13 against your local server.

### Interview questions

- "How do you keep secrets out of Git?"
- "Walk me through what happens between `git add` and `git push`."

---

## 2.21 What you can safely skip

Being able to say "I did not need that" is a strength, as long as you know what the
thing is.

| Not used here | One-line reason you can give | Would matter if... |
|---|---|---|
| TypeScript | No compile step needed for 24 small files; JavaScript keeps it beginner-readable | the team is larger or the app grows |
| Redux / Zustand | One Context is enough for "who is logged in"; the cart lives on the server | lots of unrelated shared client state |
| Tailwind / Bootstrap / MUI | One 598-line CSS file is easier to explain and debug | you need a design system fast |
| Docker locally | `mvn spring-boot:run` is enough to learn; the Dockerfile is only for deployment | you need identical environments across a team |
| Redis / caching | The dataset is tiny; MySQL handles it | read volume grows |
| Kafka / microservices | One small app with one database | teams must deploy independently |
| Flyway / Liquibase | `schema.sql` is enough for a single-developer project | schema changes must be versioned and reviewed |
| Refresh tokens | A 60-minute token and a fresh login is simpler and honest | sessions must survive longer without login |
| Pessimistic locking | Deliberately out of scope, documented as a limitation | two buyers can race for the last unit |
| Pagination | The spec said no pagination; the catalogue is 16 rows | the catalogue grows |
| Pessimistic/optimistic locking, idempotency keys | Not needed for the current scope | payments and retries |
| Frontend tests | No Jest suite; verified in a real browser instead (state that honestly) | regressions appear in the UI |

---

# Part 3 - Deploy for free

## 3.1 What "deploy" actually means for this project

You have **three separate things** to host, and they are not interchangeable:

| Piece | What it is | Why it cannot live in the same place as the others |
|---|---|---|
| **Frontend** | `npm run build` produces static files (`dist/`) | Static files need a CDN, not a JVM |
| **Backend** | A Java process listening on a port for hours | Needs a real container with 512 MB+ RAM |
| **Database** | MySQL with your 6 tables | Needs a server that persists data |

A recruiter clicking your link hits the frontend. The frontend calls the backend.
The backend calls MySQL. **All three links in that chain must work**, which is why
deployment is mostly about configuration: one wrong URL or one missing CORS origin
breaks the chain visibly.

Your repo is already prepared for this:

| File | Why it exists |
|---|---|
| `backend/Dockerfile` | builds and runs the jar on any container host (multi-stage, non-root, `MaxRAMPercentage=70` for 512 MB hosts) |
| `backend/.dockerignore` | keeps `target/` and `.env` out of the image |
| `backend/src/main/resources/application-prod.yml` | maps the host's `PORT` onto `server.port`, trusts proxy headers, and **refuses to start without a real `JWT_SECRET`** |
| `frontend/vercel.json` | SPA rewrite so `/orders/2` works on refresh |
| `frontend/public/_redirects` | same thing for Netlify / Cloudflare Pages |

## 3.2 The free-tier landscape (checked November 2026)

Free tiers change constantly. These were the facts as of **24 November 2026**;
re-check the official pricing page before you plan around them.

**Backend hosts (need to run a JVM for hours):**

| Platform | Free offer | Catch | Use it? |
|---|---|---|---|
| **Render** | 750 instance hours/month, 512 MB RAM, Docker supported, managed TLS | Free web services **spin down after ~15 minutes idle**; next request takes ~30-60 s to wake; Render may restart free services at any time | **Yes - recommended** |
| **Railway** | One-time **$5 credit for 30 days**, then a Free plan with **$1/month** credits | $1/month is not enough for an always-on JVM; app stops when credits run out | Only for a short demo window |
| **Koyeb** | One 512 MB web service, scales to zero after ~1 h idle | Since Feb 2026 a **credit card with a $29 hold** is required | Only if a card hold is acceptable |
| **Fly.io** | No free tier for new accounts | Small personal bills under ~$5 are waived | No |
| **Heroku** | No free tier (Eco from ~$5/mo) | - | No |

**Databases (need MySQL):**

| Platform | Free offer | Catch | Use it? |
|---|---|---|---|
| **filess.io** | 2 databases up to **10 MB** each, MySQL / MariaDB / PostgreSQL | Tiny storage (fine for 16 products), likely shared/inactive limits, TLS required | **Yes - real MySQL, recommended for authenticity** |
| **TiDB Cloud Starter** (MySQL-compatible) | 5 free instances, 5 GiB row storage + 50M request units each, no card, scale-to-zero | It is **MySQL-compatible, not MySQL**: no stored procedures/triggers, some edge semantics differ; verify constraints load | **Yes - generous alternative** |
| **Aiven** | Always-free PostgreSQL / Valkey / Kafka / OpenSearch | **Free MySQL is closed to new services (6 Nov 2026) and is retired 21 Dec 2026** - do not start there | No (for MySQL) |
| **Render free Postgres** | 1 GB | It is **Postgres, not MySQL**; free instances expire (30 days per current terms) | No - would need code changes |
| **Railway MySQL** | Works, but metered | Burns the $1-5 credit quickly | No |
| **Your own laptop + tunnel** | Free | Only up while your laptop is on | No - not a portfolio link |

**Frontend hosts (static files):**

| Platform | Free offer | Catch | Use it? |
|---|---|---|---|
| **Vercel (Hobby)** | 100 GB fast data transfer, 1M edge requests, HTTPS, custom domain | **Personal / non-commercial use only** - perfect for a portfolio, not for a paying client | **Yes - recommended** |
| **Netlify** | 300 credits/month on new accounts | Credit system is easy to exhaust; sites pause when it runs out | Fine |
| **Cloudflare Pages** | 500 builds/month, unlimited static requests | Fewer integrations for Vite, but works | Fine |
| **GitHub Pages** | Free, unlimited-ish bandwidth | No SPA rewrite, so `/orders/2` 404s on refresh unless you use hash routing | Only for simple static sites |
| **Render static site** | Unlimited, never spins down | You already have a Render account | Fine |

## 3.3 The recommended free stack

For a fresher portfolio, the cheapest path that keeps the project honest is:

```
 Vercel (free)            Render (free Docker)          filess.io or TiDB Cloud (free)
 React static build  ---> Spring Boot on JVM 25  --->  MySQL / MySQL-compatible
 HTTPS, CDN               PORT injected, 512 MB        6 tables + demo rows
```

Total cost: **$0**. Total accounts: **3**. One-time effort: about **45-90 minutes**.

If filess.io's 10 MB feels too tight, swap it for TiDB Cloud Starter and note in your
README that you used a MySQL-compatible cloud database. Both are honest; just say
which one you actually used.

> **CHECK BEFORE CLAIMING:** if you deploy to TiDB, load `database/schema.sql` and
> confirm all six tables and every `CHECK` constraint were accepted. If TiDB rejects
> a constraint, either remove that single constraint (and say so in your README) or
> use filess.io. Do not claim "MySQL 8" if you deployed on TiDB - say
> "MySQL-compatible (TiDB Cloud)".

## 3.4 Step 0: push the code to GitHub

```bash
cd shopsphere
git init
git add .
git status                    # confirm .env, target/, node_modules/ are NOT listed
git commit -m "ShopSphere: full stack e-commerce app (Spring Boot + React + MySQL)"
git branch -M main
git remote add origin https://github.com/<your-username>/shopsphere.git
git push -u origin main
```

Confirm before pushing:

- [ ] `.gitignore` is committed and `backend/target/`, `frontend/node_modules/`,
      `frontend/dist/`, `.env` are absent from `git status`
- [ ] No real `JWT_SECRET` or database password anywhere in the repo
- [ ] The repository is **public** (a private repo cannot be reviewed by a recruiter)

## 3.5 Step 1: create the cloud MySQL database

**Option A - filess.io (real MySQL, 10 MB)**

1. Sign up at <https://filess.io>, create a **MySQL** database.
2. Copy the host, port, database name, username and password it gives you.
3. Load your schema and demo data. Their console has an SQL runner; or from your
   terminal with the MySQL client:

```bash
# TLS is required by most free MySQL hosts
mysql --host=<HOST> --port=<PORT> --user=<USER> --password --ssl-mode=REQUIRED <DB_NAME> \
  < database/schema.sql

mysql --host=<HOST> --port=<PORT> --user=<USER> --password --ssl-mode=REQUIRED <DB_NAME> \
  < database/data.sql
```

> `schema.sql` starts with `CREATE DATABASE shopsphere; USE shopsphere;`. On a shared
> host you usually cannot create databases and the database is already named for you.
> When the console/tool supports it, run the file **inside your database** (as above,
> by passing `<DB_NAME>`), and if the `USE shopsphere;` line causes
> `Unknown database 'shopsphere'`, delete those two lines from a **copy** of the file
> before loading. Keep the original in the repo.

4. Verify:

```sql
SHOW TABLES;                 -- 6 tables
SELECT COUNT(*) FROM products;   -- 16
SELECT email, role FROM users;   -- 2 demo users
```

**Option B - TiDB Cloud Starter (MySQL-compatible)**

1. Sign up at <https://tidbcloud.com> (no card needed), create a **Starter** cluster.
2. Use the **SQL Editor** in the console: paste `database/schema.sql`, then
   `database/data.sql`.
3. Note the host, port (usually `4000`), user, password and the database name
   (often `test`). TiDB requires TLS.

Your JDBC URL for either option:

```
jdbc:mysql://<HOST>:<PORT>/<DB_NAME>?useSSL=true&requireSSL=true&serverTimezone=UTC
```

> Use `useSSL=true` for a cloud database. `allowPublicKeyRetrieval=true` is only
> needed in some setups; add it if the driver complains about public key retrieval.

## 3.6 Step 2: deploy the backend

**Render, via the dashboard**

1. <https://render.com> -> **New +** -> **Web Service** -> connect your GitHub repo.
2. Settings:

| Field | Value |
|---|---|
| Name | `shopsphere-api` (this becomes part of your URL) |
| Language / Runtime | **Docker** |
| Root Directory | `backend` |
| Dockerfile Path | `Dockerfile` (relative to the root directory) |
| Instance Type | **Free** |
| Health Check Path | `/api/products` |
| Auto-Deploy | Yes (deploys on every push to `main`) |

3. **Environment variables** (Render -> your service -> Environment):

| Key | Value |
|---|---|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DB_URL` | `jdbc:mysql://<HOST>:<PORT>/<DB_NAME>?useSSL=true&requireSSL=true&serverTimezone=UTC` |
| `DB_USERNAME` | your database user |
| `DB_PASSWORD` | your database password |
| `JWT_SECRET` | a **new** random 32+ character string - `openssl rand -base64 48` |
| `CORS_ALLOWED_ORIGIN` | put a placeholder now (`https://example.com`), fix it in Step 4 |

Do **not** set `PORT` - Render injects it, and `application-prod.yml` reads it.
Do **not** set `SERVER_PORT` either.

4. Deploy, then watch the logs for:

```
Tomcat started on port 10000 (http) with context path '/'
Started ShopSphereApplication in 7.x seconds
```

5. Your API is live at `https://shopsphere-api.onrender.com`. Test it:

```bash
curl https://shopsphere-api.onrender.com/api/products
curl -X POST https://shopsphere-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@shopsphere.test","password":"Customer@12345"}'
```

**Render, via a Blueprint file (optional but nicer to show off)**

Committing a `render.yaml` at the repo root lets Render create the service from a
file. If you add one, keep it next to `backend/` with
`rootDir: backend`, `runtime: docker`, and `envVars` marked `sync: false` for the
secrets - never put secret **values** in it.

**Railway / Koyeb** work the same way: point them at the repo, set the same
environment variables, let them build `backend/Dockerfile`. Remember the credit
limits from §3.2.

## 3.7 Step 3: deploy the frontend

**Vercel**

1. <https://vercel.com> -> **Add New** -> **Project** -> import your repo.
2. Settings:

| Field | Value |
|---|---|
| Framework Preset | **Vite** |
| Root Directory | `frontend` |
| Build Command | `npm run build` (auto-detected) |
| Output Directory | `dist` (auto-detected) |
| Install Command | `npm install` |

3. **Environment variable** (Production *and* Preview):

| Key | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://shopsphere-api.onrender.com` (no trailing slash) |

4. Deploy. Vercel gives you `https://shopsphere-xxxx.vercel.app`.
5. `vercel.json` already rewrites all paths to `index.html`, so refreshing
   `/orders/2` works.

> **Important:** Vite bakes `VITE_*` variables into the JavaScript **at build time**.
> If you change `VITE_API_BASE_URL` later, you must **redeploy** the frontend. This is
> the single most common "why is it still calling localhost?" bug.

**Netlify / Cloudflare Pages** alternatives: same root directory, build
`npm run build`, output `dist`, same environment variable. `frontend/public/_redirects`
is copied into `dist/` automatically and handles the SPA rewrite.

## 3.8 Step 4: connect the two (CORS)

The chain is only closed when the backend allows the frontend's origin.

1. Copy your exact Vercel URL, e.g. `https://shopsphere-xxxx.vercel.app`.
2. Render -> your service -> Environment -> set
   `CORS_ALLOWED_ORIGIN=https://shopsphere-xxxx.vercel.app`
   (scheme + host, **no trailing slash**, no wildcard).
3. Save; Render redeploys automatically. Wait for "Live".
4. Verify from your terminal:

```bash
curl -i -X OPTIONS https://shopsphere-api.onrender.com/api/cart \
  -H "Origin: https://shopsphere-xxxx.vercel.app" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: authorization"
```

You want `200` with `Access-Control-Allow-Origin: https://shopsphere-xxxx.vercel.app`.
A `403` means the origin string does not match exactly (a trailing slash is the usual
culprit).

> If you later add a custom domain, update this variable again. One origin per
> deployment is a deliberate simplification in this project.

## 3.9 Step 5: smoke test the live site

Do this in order; it takes five minutes and catches almost every deployment mistake.

| # | Action on the live URL | Expected |
|---|---|---|
| 1 | Open the Vercel URL | Home page with 6 product cards (first load after idle may take ~30-60 s - cold start) |
| 2 | Products -> search `java` | 1 result |
| 3 | Products -> category `Books` | 4 results |
| 4 | Register a new account | You land on Products, navbar shows your name |
| 5 | Log out, log in as `customer@shopsphere.test` | 200, navbar shows Demo Customer |
| 6 | Open a product, add 2 to cart | Green "Added to cart." |
| 7 | Cart -> `+` | Quantity and total update |
| 8 | Checkout -> Place order | "Thank you, your order has been placed." |
| 9 | My Orders | The new order with status PLACED |
| 10 | Log out, log in as `admin@shopsphere.test` | Admin links appear |
| 11 | Admin Products -> Edit a product's stock | "Saved product #N." |
| 12 | Admin Orders -> change a status to SHIPPED | Success message, badge changes |
| 13 | In the browser, call an admin URL with the customer's token | `403` |
| 14 | Refresh the page on `/orders/1` | Still loads (SPA rewrite works) |
| 15 | Open DevTools console | No red CORS or mixed-content errors |

If 13 returns `401` instead of `403`, you are not logged in. If 6 fails with a CORS
error, go back to Step 4.

## 3.10 Production checklist before you share the link

- [ ] `JWT_SECRET` is a fresh random value, at least 32 characters, **not** the one in
      `application.yml`
- [ ] `SPRING_PROFILES_ACTIVE=prod` (so a missing secret fails loudly instead of
      running on the public dev key)
- [ ] Database password is different from your local one
- [ ] `CORS_ALLOWED_ORIGIN` is exactly your frontend origin
- [ ] `DB_URL` uses `useSSL=true` for the cloud database
- [ ] The demo accounts are still demo: `admin@shopsphere.test` / `Admin@12345`.
      **Either** keep them and label them "demo only" in the README **or** change the
      admin password in the cloud database with a BCrypt hash you generate. Never
      reuse a real password.
- [ ] README top section shows the live link, the API link, and the demo credentials
      marked demo only
- [ ] You checked that `npm run build` has no `localhost` in it:
      `grep -r "localhost" frontend/dist` should return nothing
- [ ] The backend container is not running as root (the Dockerfile handles this)
- [ ] You wrote down which database you used (filess.io vs TiDB) so your resume is accurate

Optional hardening, only if you have time and can explain it:

- Turn off registration in production (add an env flag checked in `AuthService.register`)
  so nobody can fill your 10 MB database. Explain it as a deliberate choice.
- Schedule a weekly `mysqldump` so a wiped free database does not cost you the demo.
- Add `/api/products` as the Render health check (already in Step 2) so a cold start is
  triggered by the platform's probe.

## 3.11 Deployment troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Backend log: `JWT_SECRET must be set to a private random value...` and the service exits | `prod` profile without a real secret | set `JWT_SECRET` (this is the guard working) |
| Service "Live" but the URL times out | cold start (free tier sleeps) | wait 30-60 s, reload; check logs for "Started ShopSphereApplication" |
| `Communications link failure` / `Access denied` | wrong DB host, user, password, or TLS | re-copy the credentials; `useSSL=true`; check the DB is not paused |
| `Unknown database` | the DB name in `DB_URL` is wrong (`test` on TiDB) | fix the URL |
| `Public Key Retrieval is not allowed` | driver needs the key | add `allowPublicKeyRetrieval=true` to `DB_URL` |
| Browser console: `blocked by CORS policy` | origin mismatch | exact origin in `CORS_ALLOWED_ORIGIN`, no trailing slash, redeploy |
| Browser console: `Mixed Content` | frontend on `https`, API on `http` | use the `https://` API URL only |
| Requests still go to `localhost:8080` | `VITE_API_BASE_URL` was set **after** the build, or is set only for Production while you view a Preview URL | set it for all environments and **redeploy the frontend** |
| `/orders/2` returns 404 on refresh | SPA rewrite missing | keep `vercel.json` (Vercel) or `public/_redirects` (Netlify/Cloudflare) |
| Render build fails: `mvn: not found` | you used a runtime image instead of the Dockerfile, or set Root Directory wrong | Runtime **Docker**, Root Directory `backend` |
| Render build is killed / slow | free 512 MB building and testing | the Dockerfile already builds inside Maven; if it still fails, add `-DskipTests` to the `package` step **and say so** |
| `502` right after a deploy | app still starting | wait, then check logs for a stack trace |
| Login works but cart returns `401` | token expired (60 min) or `JWT_SECRET` changed between deploys | log in again; keep the secret stable |
| Everything works, then dies next week | free instance recycled / DB paused / credit used | see §3.12 |

## 3.12 Keeping it alive, and cold starts

Free tiers are "free" because you give up always-on availability:

- **Render free** sleeps after ~15 minutes without traffic and wakes in ~30-60 s
  (one wake per visitor, not per request). It may also restart at any time.
- **filess.io / TiDB free** databases may pause or throttle; TiDB refuses *new*
  connections once the monthly quota is hit.
- **Vercel** static files never sleep.

How to handle it like a professional, not a victim:

1. **Say it first.** Put one line in your README: *"Hosted on Render's free tier, so
   the first request after 15 minutes of inactivity can take up to a minute to wake."*
   A reviewer who reads that trusts everything else you wrote.
2. **Warm it before a demo.** Open the API URL (`/api/products`) in a tab, wait for
   JSON, then open your app. Do this 2 minutes before any interview or screen recording.
3. **Put a live badge on the README** and a screenshot, so a reviewer sees something
   even if the app is asleep.
4. **Keep a 60-90 second screen recording** (see §4.7). It never sleeps.
5. **Do not build a cron job to ping yourself** just to fake always-on; several hosts
   treat it as abuse. If you want always-on, that is what the paid $7 tier is for.

## 3.13 What was and was not verified in this guide

Being precise here matters, because you will repeat these claims.

**Verified while writing this project (on the machine it was built on):**

- `mvn clean test` -> **11 tests, 0 failures** (6 service tests + 5 new JWT tests)
- `npm run build` -> success, and `dist/_redirects` is produced from `public/_redirects`
- The backend starts in the **`prod` profile with `PORT=8081` and no `SERVER_PORT`**,
  logs `Tomcat started on port 8081`, and `GET /api/products` returns `200`
- The backend **refuses to start** in the `prod` profile with no `JWT_SECRET`
  (exit code 1, `IllegalStateException: JWT_SECRET must be set ...`)
- With **no environment variables at all**, the default profile starts and login works
  (local defaults exist so a beginner's first run does not fail)
- Local CORS preflight allowed for the configured origin, rejected for another origin

**Not verified, because it needs accounts I do not have:**

- `docker build` of `backend/Dockerfile` - Docker is not installed on the build machine.
  The Dockerfile uses the official `maven:3.9-eclipse-temurin-25` and
  `eclipse-temurin:25-jre-alpine` images, whose tags were confirmed to exist.
  **Build it once locally before your first deploy.**
- An actual Render / Vercel / filess.io / TiDB deployment.

**CHECK BEFORE CLAIMING:** only write "deployed on Render + Vercel" on your resume
**after** you have completed Step 5 and seen all 15 checks pass on the live URL.

---

# Part 4 - Resume and portfolio

## 4.1 The one rule: never write what you cannot defend

Three failure modes to avoid:

| Bad claim | Why it hurts you | Say this instead |
|---|---|---|
| "Used by 500 users" | The first follow-up question exposes it | "Built as a personal project with a live demo" |
| "Deployed with Docker, Kubernetes and CI/CD" | You have a Dockerfile and no cluster; the interview goes badly | "Containerised with a multi-stage Dockerfile and deployed on Render" |
| "Implemented locking to prevent race conditions" | The code has no locking, and the README says so | "Identified the concurrent-purchase race condition; the fix (pessimistic locking) is documented as the next improvement" |

The last row is worth reading twice. **Admitting a known limitation and explaining
the fix is a stronger signal than a vague claim of perfection** - it is exactly what
senior engineers do in code review comments.

## 4.2 Three versions of the project entry

Pick one based on the space you have. All three are true of this repository.

**A. Two lines (for a dense, one-page resume)**

> **ShopSphere - Full Stack E-Commerce App** | Java 25, Spring Boot 4, React, MySQL
> Two-role e-commerce app with JWT authentication, a database-backed cart, and a
> transactional checkout; live demo link in the GitHub repo.

**B. Four bullets (standard fresher resume - recommended)**

> **ShopSphere - Full Stack E-Commerce Application** | *Java 25, Spring Boot 4.2, Spring Data JPA, Spring Security, React 18, MySQL 8*
> - Built a layered REST API (Controller → Service → Repository) with 19 endpoints, DTO-based JSON contracts and a global exception handler returning consistent status codes (200/201/400/401/403/404/409).
> - Implemented JWT authentication with BCrypt password hashing, role-based access control for admin endpoints, and ownership checks so customers can only access their own cart and orders.
> - Designed a 6-table MySQL schema with foreign keys, indexes, unique and check constraints; implemented a single-transaction checkout that snapshots purchase-time prices, reduces stock and clears the cart, rolling back fully on insufficient stock.
> - Wrote 11 JUnit 5 + Mockito unit tests (password storage, duplicate email, checkout success, insufficient stock, order ownership, JWT secret enforcement); built the React frontend with protected routes and a single API client module.
> - **Live demo:** `<your vercel url>` · **Code:** `<your github url>`

**C. Six bullets (for a project section with room, or a portfolio page)**

> **ShopSphere - Full Stack E-Commerce Application**
> - **Backend:** Java 25 and Spring Boot 4.2 REST API, 7 controllers / 19 endpoints, constructor injection, Bean Validation, `@RestControllerAdvice` for one global error format.
> - **Security:** BCrypt hashing, stateless JWT (60-minute expiry) validated by a custom servlet filter, role-based rules for `/api/admin/**`, user identity always read from the `SecurityContext` rather than the request body.
> - **Data:** MySQL 8 schema with 6 normalised tables, `DECIMAL(10,2)` money columns, soft delete to preserve order history, and one JPQL query handling optional search and category filters.
> - **Business logic:** cart merging on duplicate adds, server-side price calculation, and a `@Transactional` checkout that validates stock per line and rolls back completely on failure (verified by inspecting the database after a failed checkout).
> - **Testing:** 11 JUnit 5 + Mockito unit tests covering password hashing, duplicate email, checkout totals, purchase-time prices, insufficient stock, order ownership and JWT secret enforcement.
> - **Frontend:** React 18 + React Router 6 with 12 pages, Context-based auth, a single `fetch` wrapper, and plain CSS (variables, Flexbox, Grid, one mobile breakpoint).
> - **Deployment:** containerised with a multi-stage Dockerfile and deployed free on Render; React build hosted on Vercel; MySQL on `<filess.io | TiDB Cloud>`.

## 4.3 The deployed-link line (use only after deploying)

Put it at the very top of the project entry, where the eye lands:

```
Live demo: https://shopsphere-yourname.vercel.app   (free tier - first load may take ~30s to wake)
Code:      https://github.com/yourname/shopsphere
Demo login: customer@shopsphere.test / Customer@12345  ·  admin@shopsphere.test / Admin@12345
```

Three details that make a reviewer's life easier, in order of impact:

1. **Say it may be slow to wake.** It sets expectations instead of looking broken.
2. **Give the demo login.** A reviewer will not register an account to look at your app.
3. **Link the code.** Some reviewers only read code; both paths should be one click away.

## 4.4 Keywords that matter to recruiters and ATS

Resume screening software looks for exact technology words. Use them naturally, once
each, and only where they are true:

```
Java, Java 25, Spring Boot, Spring MVC, Spring Data JPA, Hibernate, Spring Security,
REST API, RESTful, JWT, BCrypt, Bean Validation, JPA, JPQL, MySQL, SQL,
relational database, database design, normalisation, indexes, foreign keys,
transactions, Maven, JUnit 5, Mockito, unit testing, React, React Router,
JavaScript, ES6, React Hooks, Context API, Fetch API, HTML, CSS, responsive design,
Git, GitHub, Docker, Dockerfile, deployment, CI on push, Vercel, Render, CORS,
layered architecture, DTO, exception handling, role-based access control
```

Words to leave out because this project does not have them: Kubernetes, microservices,
Kafka, Redis, MongoDB, TypeScript, Next.js, AWS, GraphQL, CI/CD pipelines (you have
auto-deploy on push - say "auto-deploy", not "CI/CD pipeline", unless you add tests to
the pipeline).

## 4.5 GitHub repository presentation

A reviewer gives your repo about 20 seconds before deciding. Make those 20 seconds count.

**Repository description (the one-liner on your profile):**

> Small full stack e-commerce app: Spring Boot 4 (Java 25) REST API with JWT auth and
> MySQL, plus a React frontend. Products, cart, checkout and admin order management.

**Topics:** `spring-boot` `java` `react` `mysql` `jwt` `rest-api` `hibernate`
`full-stack` `java-25` `portfolio-project`

**Top of your README** (above everything else, before the long explanation):

```markdown
# ShopSphere

Small full stack e-commerce app - Spring Boot 4 (Java 25) + MySQL + React 18.

**Live demo:** https://shopsphere-yourname.vercel.app
**API:** https://shopsphere-api.onrender.com/api/products
**Demo login (demo data only):** customer@shopsphere.test / Customer@12345
**Admin login (demo data only):** admin@shopsphere.test / Admin@12345

> Hosted on a free tier: the first request after 15 minutes of inactivity can take
> up to a minute while the backend wakes up.

![Home page](docs/screenshots/01-home.png)
```

**Repo hygiene a reviewer checks in those 20 seconds:**

- [ ] Public repo, clear name (`shopsphere`)
- [ ] A description and topics set
- [ ] README renders with a screenshot near the top
- [ ] No `node_modules/`, `target/`, `dist/` or `.env` committed
- [ ] Commits are meaningful, not `final`, `final2`, `update` - see README §15.3
- [ ] `docs/` is visible: it shows you document, which most fresher repos do not

## 4.6 LinkedIn and portfolio text

**LinkedIn "Projects" entry:**

> **ShopSphere** - Full Stack E-Commerce Application
> Built a two-role e-commerce app end to end: Spring Boot 4 REST API (Java 25) with
> JWT authentication, Spring Security, Spring Data JPA and MySQL 8, plus a React 18
> frontend with protected routes. Implemented a transactional checkout that keeps
> prices, stock and cart consistent, and covered the critical rules with 11 JUnit and
> Mockito unit tests. Deployed on free-tier hosting with a live demo.
> *Tools: Java, Spring Boot, Hibernate, MySQL, React, JavaScript, Git, Docker*

**LinkedIn post (short, honest, no hype):**

> I finished my first full stack project: ShopSphere, a small e-commerce app.
>
> Backend: Java 25 + Spring Boot 4, MySQL, JWT auth, BCrypt passwords, 19 REST
> endpoints, 11 unit tests.
> Frontend: React 18 with React Router and plain CSS.
>
> The part I learned the most from was checkout: one transaction that validates
> stock, stores the price at purchase time, reduces stock and clears the cart - and
> rolls back completely if anything fails. I also found a real limitation: two buyers
> racing for the last item is not protected, and I documented the fix (pessimistic
> locking) rather than pretending otherwise.
>
> Live demo (free tier, may take a moment to wake): <link>
> Code: <link>
>
> Feedback is welcome.

**Portfolio card:**

> **ShopSphere** · Spring Boot, React, MySQL
> E-commerce app with customer and admin roles, JWT login, a persistent cart and
> transactional checkout. 19 API endpoints, 11 unit tests, deployed live.
> [Live demo] [Source code] [How it works → docs/README.md]

## 4.7 A 90-second demo script

Record this with any screen recorder and put the video link in your README. It is the
single highest-value thing you can add, because it works even when the free tier sleeps.

| Time | Do this | Say this |
|---|---|---|
| 0:00-0:10 | Show the Products page | "This is ShopSphere, a small e-commerce app. Spring Boot backend, React frontend, MySQL database." |
| 0:10-0:25 | Search "java", pick category Books | "Search and category filter are query parameters, filtered in MySQL, not in the browser." |
| 0:25-0:40 | Log in as the customer, add a product, open the cart, press `+` | "The cart is a database table, not browser state - so it survives a refresh. Totals are calculated on the server." |
| 0:40-0:55 | Checkout | "Checkout is one transaction: validate stock, copy the price into the order, reduce stock, clear the cart. If stock is short, everything rolls back." |
| 0:55-1:05 | My Orders, open the order | "Order items keep the price at purchase time, so later price changes never alter history." |
| 1:05-1:20 | Log in as admin, change a status, deactivate a product | "Admin endpoints require the ADMIN role - enforced on the server, not just hidden in the UI. Deactivating is a soft delete, so order history stays valid." |
| 1:20-1:30 | Show the terminal: `mvn test` output | "Eleven unit tests cover the rules that matter: hashing, duplicate email, checkout, stock, ownership." |

## 4.8 Questions you will get, and the honest answers

**"Is this deployed?"**
> "Yes - the frontend is on Vercel and the backend on Render's free tier, with a
> MySQL database on `<provider>`. The free backend sleeps after 15 minutes of idle
> time, so the first request can take up to a minute."

**"How many users does it have?"**
> "It is a personal project with a live demo, not a product - no real users yet. What
> I focused on is correctness: 11 unit tests, and a checkout that rolls back properly."

**"Did you use Docker?"**
> "For deployment, yes: a multi-stage Dockerfile that builds the jar with Maven and
> runs it on a JRE 25 image as a non-root user. Locally I just run
> `mvn spring-boot:run`, because for one developer Docker adds nothing."

**"Is it secure?"**
> "For its scope: BCrypt hashes, short-lived JWTs, role checks on the server,
> ownership checks in the queries, and secrets in environment variables. It is not
> production-hardened - no rate limiting, no refresh tokens, and the token lives in
> `localStorage`, which is vulnerable to XSS. Those are written down as limitations."

**"What would you do with two more weeks?"**
> "Pessimistic locking on stock, integration tests with MockMvc, pagination, and
> refresh tokens - in that order, because locking is the only one that is a real
> correctness bug today."

**"Why is it slow the first time?"**
> "The free backend spins down after inactivity. Warm it by opening the API URL, or
> pay for an always-on instance - it is a hosting characteristic, not an application
> problem."

## 4.9 Pre-application checklist

Do not send a resume with this project until every box is true.

- [ ] `mvn clean test` passes locally (11 tests)
- [ ] `npm run build` passes locally
- [ ] The repo is public, with a description, topics and a screenshot in the README
- [ ] The app is deployed and all 15 checks in §3.9 pass on the **live** URL
- [ ] `CORS_ALLOWED_ORIGIN` matches the deployed frontend exactly
- [ ] `JWT_SECRET` in production is new and random (never the repo default)
- [ ] The README's live-demo section lists the demo credentials, marked demo only
- [ ] You can draw the request path on paper, from click to MySQL, in under 2 minutes
- [ ] You can explain checkout, rollback and the race-condition limitation without notes
- [ ] You can run `mvn test` and explain each of the 11 tests in one sentence
- [ ] Your resume bullets only claim what is in this repository (compare with §4.2)
- [ ] A 60-90 second screen recording exists and is linked
- [ ] You read your own README as if you were the interviewer, and fixed one confusing
      sentence

When all of that is true, the project stops being "a thing I built" and becomes
"a thing I can defend" - which is the only version of it that helps in an interview.
