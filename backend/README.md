# Spring Boot Backend

This backend lives in its own `backend/` folder so it stays separate from the Vite frontend.

## Stack included

- Spring Web for REST APIs
- Spring Security with stateless JWT authentication
- BCrypt password hashing
- Spring Data JPA with Hibernate
- H2 by default and optional MySQL profile
- Jakarta Validation on request DTOs
- Lombok in entity and DTO code
- Method-level security with `@PreAuthorize`
- CORS configured for local frontend development

## Main API routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/shops`
- `GET /api/shops/{shopId}`
- `POST /api/orders`
- `GET /api/orders/me`
- `POST /api/orders/{orderId}/rating`
- `GET /api/vendor/orders`
- `PATCH /api/vendor/shops/{shopId}/status`
- `PATCH /api/vendor/orders/{orderId}/status`

## Demo users

- Customer: `customer@example.com` / `password123`
- Vendor: `vendor@example.com` / `password123`
- Admin: `admin@example.com` / `password123`

## Run

From the `backend/` folder:

```bash
mvn spring-boot:run
```

The default setup is MySQL-first and points to:

- Database: `foodapp`
- Username: `root`
- Password: `Dheeraj@123`

You can still override these with environment variables:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`

To use the H2 fallback profile instead:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

## Frontend integration notes

- Send the JWT as `Authorization: Bearer <token>`
- Local CORS is open for `http://localhost:5173` and `http://localhost:3000`
- Roles are `CUSTOMER`, `VENDOR`, and `ADMIN`
