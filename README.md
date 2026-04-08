# Slot Booking System — Backend (API)

Node.js + Express + MongoDB backend for a simple scheduling/booking system:

- **Auth**: register + OTP email verification, login, JWT access token, refresh-token rotation (httpOnly cookie)
- **Availability**: host users save their available windows
- **Visitor booking**: visitors pick a host, see open slots, and book (visitor name/email is stored)

> Frontend repo: `slot-booking-system-frontend`

---

## Tech stack

- Node.js (ES modules, `"type": "module"`)
- Express (v5)
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Cookies: `cookie-parser`
- Email: **Resend** (`resend`)
- Logging: `morgan`

---

## Project structure (key files)

- `server.js` - entrypoint (connect DB + start server)
- `src/app.js` - express app (middleware + route mounting)
- `src/config/config.js` - env loading + validation
- `src/config/database.js` - mongoose connection
- `src/middleware/auth.middleware.js` - reads `Authorization: Bearer <token>` and sets `req.user.id`
- `src/controllers/` - request handlers
- `src/routes/` - route definitions
- `src/models/` - mongoose schemas/models
- `src/utils/slotGenerator.js` - 30-minute slot generator

---

## Environment variables

Required (validated in `src/config/config.js`):

- `MONGO_URI`
- `JWT_SECRET`
- `RESEND_API_KEY`

> Note: the repo currently validates some `GOOGLE_*` variables even though email sending uses Resend. If you don’t use Gmail OAuth, you can remove those checks in `src/config/config.js`.

Example `.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_key
PORT=3000
```

---

## Run locally

```bash
npm install
npm run dev
```

Server runs on `PORT` (default `3000`).

---

## CORS (important for cookies)

`src/app.js` currently allows:

- `http://localhost:3000`
- `http://localhost:3001`

with `credentials: true`.

If your frontend origin changes, update the `origin` list.

---

## API reference

Base URL (local): `http://localhost:3000`

### Auth (`/api/auth`)

- **POST** `/api/auth/register`  
  Body:
  ```json
  { "username": "user1", "email": "user1@example.com", "password": "secret" }
  ```

- **GET** `/api/auth/verify-email?otp=123456&email=user1@example.com`

- **POST** `/api/auth/login`  
  Body:
  ```json
  { "email": "user1@example.com", "password": "secret" }
  ```
  Returns `{ accessToken, user }` and sets refresh token cookie.

- **GET** `/api/auth/get-me`  
  Header: `Authorization: Bearer <accessToken>`  
  Returns `user` including `id`.

- **GET** `/api/auth/refresh-token` (uses httpOnly cookie)
- **GET** `/api/auth/logout` (uses httpOnly cookie)
- **GET** `/api/auth/logout-all` (uses httpOnly cookie)

- **POST** `/api/auth/forgot-password`  
  Body: `{ "email": "user1@example.com" }`

- **POST** `/api/auth/reset-password`  
  Body: `{ "token": "...", "email": "user1@example.com", "newPassword": "newSecret" }`

### Users (`/api/users`) — public visitor discovery

- **GET** `/api/users`  
  Optional query: `?hasAvailability=true` (returns only users who have any availability)

- **GET** `/api/users/:userId`

### Availability (`/api/availability`)

> All write/read-my-data endpoints require auth (`Authorization: Bearer <accessToken>`).

- **GET** `/api/availability` (auth)  
  Returns the signed-in user’s availability windows.

- **POST** `/api/availability` (auth)  
  Body:
  ```json
  { "date": "2026-04-10", "startTime": "10:00", "endTime": "14:00" }
  ```

- **GET** `/api/availability/dates/:userId` (public)  
  Returns available dates for a host: `["2026-04-10","2026-04-11"]`

### Booking (`/api/booking`) — visitor booking

- **GET** `/api/booking/by-user/:userId?date=2026-04-10` (public)  
  Returns:
  ```json
  { "availableSlots": [ { "start":"10:00","end":"10:30" } ], "bookings": [ ... ] }
  ```

- **POST** `/api/booking` (public)  
  Body:
  ```json
  {
    "userId": "HOST_USER_ID",
    "date": "2026-04-10",
    "startTime": "10:30",
    "endTime": "11:00",
    "name": "Jane Visitor",
    "email": "jane@example.com"
  }
  ```

---

## Notes / security

- Passwords are hashed with **SHA-256** in this repo (for demos). For production, use a slow password hash like **bcrypt/argon2**.
- Refresh token is stored in an **httpOnly** cookie and tracked server-side in `sessions`.

