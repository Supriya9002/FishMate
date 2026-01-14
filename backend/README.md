# FishMate Backend

Backend for FishMate (Express + Mongoose). Includes JWT auth, centralized error handling, and Winston logging. A Postman collection is provided for API testing.

## Prerequisites
- Node.js 18+
- MongoDB connection string

## Setup
1. Install dependencies:
   - `npm install`
2. Create `.env` in backend root:
   ```
   Port=2000
   MONGODB_URI=mongodb://localhost:27017/fishmate
   JWT_SECRET=JCok8ibiRY
   ```
   - JWT_SECRET must match the secret used to sign tokens.

## Run
- `node server.js`
- Server listens on `http://localhost:2000`

## Logging
- Winston logger writes to:
  - `logs/error.log`
  - `logs/combined.log`
- Console logging is enabled.

## Error Handling
- Custom `ApplicationError` for known business errors.
- Centralized `errorHandler` middleware returns consistent JSON:
  ```
  {
    success: false,
    error: "...",
    statusCode: 400,
    path: "/api/...",
    method: "GET",
    timestamp: "..."
  }
  ```

## Authentication
- JWT via `Authorization` header (raw token, no Bearer prefix).
- Obtain token from `/api/admin/login`.

## Postman Collection
- Import `Postman.Collection.json`.
- Variables:
  - `baseUrl` (default: `http://localhost:2000`)
  - `token` (auto-set by Login test script)
- Flow:
  1. Admin → Register (optional)
  2. Admin → Login (sets `{{token}}`)
  3. Call protected routes; header `authorization: {{token}}`

## Endpoints
- Root
  - `GET /`
- Admin
  - `POST /api/admin/register`
  - `POST /api/admin/login`
  - `GET /api/admin/profile` (auth)
  - `GET /api/admin/metrics` (auth)
- Fish (auth)
  - `POST /api/fish/add`
  - `GET /api/fish/displayallfish`
  - `GET /api/fish/fishDetails/:fishID`
  - `PUT /api/fish/update/:id`
  - `DELETE /api/fish/delete/:id`
- Coustomer (auth)
  - `POST /api/coustomer/coustomerFishBuy/:fishID`
  - `POST /api/coustomer/coustomerDetails`
  - `GET /api/coustomer/getAllCoustomer`
  - `GET /api/coustomer/getCoustomerDetailsByID/:coustomerID`
  - `POST /api/coustomer/fullPaymentByCoustomer/:coustomerID`
  - `POST /api/coustomer/onePaymentByCoustomer/:coustomerID/:transactionID`

## Notes
- Keep JWT secret consistent across login and verification.
- Authorization header key is lowercase `authorization` to match Express header normalization.
