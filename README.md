# Express Product API with Caching & Layered Architecture

This repository contains an Express application built with a layered architecture pattern (`Route → Middleware → Controller → Service → Database`) and in-memory response caching with 1-minute TTL and cache invalidation on data modifications.

---

## 📁 Architecture & Folder Structure

```
.
├── routes/             # Defines API endpoints & maps middleware/controllers
│   └── productRoutes.js
├── controllers/        # Handles HTTP request/response logic & status codes
│   └── productController.js
├── services/           # Encapsulates business logic & data transformations
│   └── productService.js
├── database/           # Handles file I/O operations with db.json
│   └── productDatabase.js
├── middleware/         # Caching middleware with TTL & invalidation logic
│   └── cacheMiddleware.js
├── db.json             # JSON file serving as persistent database
├── server.js           # Main Express server entry point
├── test.js             # Automated verification test suite
└── README.md           # Project documentation
```

### Request Flow Pattern
```
Client Request
      ↓
  [Route]
      ↓
[Middleware]  ──(Cache HIT: Return Cached Data + X-Cache: HIT)
      ↓ (Cache MISS: Add X-Cache: MISS header)
 [Controller]
      ↓
  [Service]
      ↓
 [Database] (db.json I/O)
```

---

## ⚡ Caching Mechanism

- **Header Reporting**: All `GET` requests include an `X-Cache` header:
  - `X-Cache: HIT` when data is served from the in-memory cache.
  - `X-Cache: MISS` when data is fetched fresh from the database.
- **Time to Live (TTL)**: 1 minute (60,000 milliseconds). Cache timestamps are recorded upon creation. Expired entries are automatically evicted on subsequent requests.
- **Cache Invalidation**: Successful mutation requests (`POST`, `PUT`, `PATCH`, `DELETE`) automatically invalidate all cached entries so stale data is never served.

---

## 🚀 API Endpoints

| Method | Endpoint | Description | Cache Behavior |
|--------|----------|-------------|----------------|
| `GET` | `/products` | Fetch all products | Cached (1-min TTL, `X-Cache`) |
| `GET` | `/products/:id` | Fetch product by ID | Cached (1-min TTL, `X-Cache`) |
| `POST` | `/products` | Create a new product | Invalidates Cache |
| `PUT` | `/products/:id` | Replace product details | Invalidates Cache |
| `PATCH` | `/products/:id` | Update product details | Invalidates Cache |
| `DELETE`| `/products/:id` | Remove a product | Invalidates Cache |

---

## 🧪 Running Tests & Server

### Start Server
```bash
npm start
```
Server runs locally on `http://localhost:3000`.

### Run Automated Tests
```bash
npm test
```
The test suite validates GET requests, `X-Cache` headers (HIT/MISS), auto ID assignment, POST/PUT/DELETE mutations, and cache invalidation.
