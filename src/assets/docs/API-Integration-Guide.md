# Angular Frontend Integration Guide: Custom API (v1.0)

To: Integrity (Angular Development)

## 1. Global Setup & Dependencies

- **Base URL**: Set `apiUrl: 'http://localhost:3000'` in your `environment.ts` and `environment.development.ts` files.
- **Install**: `npm install jwt-decode`

The server returns an `accessToken` on login/register. Decode it on the frontend to extract `userId` for cart and order binding.

## 2. Authentication & Interceptors

### Auth Interceptor

- Intercept non-GET requests and attach: `Authorization: Bearer <accessToken>`.
- GET requests remain open and must not include the header.

### AuthService

(`src/app/core/services/auth.service.ts`)

- `register(user)`: POST `/register` with `{ email, password, name }`.
- `login(credentials)`: POST `/login` with `{ email, password }` — store `accessToken`.
- `getUserId()`: Use `jwt-decode` to parse token and return `userId`.

## 3. Data Services (Public API)

### ProductService

(`src/app/features/products/services/product.service.ts`)

- Get Trips: `GET /trips`
- Get Products by Trip: `GET /products?tripIds={id}`
- Search Products: `GET /products?name_like={keyword}`
- Filter by Price: `GET /products?price_gte={min}&price_lte={max}`
- Sort Products: `GET /products?_sort=price&_order={asc|desc}`

Use `HttpParams` to build query strings dynamically.

## 4. Protected Services & Crucial Business Logic

### CartService

(`src/app/core/services/cart.service.ts`)

- Fetch Cart: `GET /carts?userId={id}` (Public)
- Update Strategy: Fetch current cart, modify `items` array locally, then `PATCH /carts/{cartId}` with full payload: `{ "items": [ { productId, quantity, price } ] }`.

### OrderService

(`src/app/core/services/order.service.ts`)

- Checkout Flow (two-step, sequential):
  1. `POST /orders` with full order payload (`userId`, `orderDate`, `status`, `totalAmount`, `shippingAddress`, `items`).
  2. On success, `PATCH /carts/{cartId}` with `{ "items": [] }` to clear the cart.

Use RxJS (`concatMap` or `switchMap`) to ensure strict ordering.

---

For implementation examples and code patterns, see the project's `src/app/core/interceptors` and `src/app/core/services` folders.
