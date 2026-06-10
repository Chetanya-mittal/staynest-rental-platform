# StayNest (Backend API)

StayNest is a rental booking platform backend built with Node.js, Express, and MongoDB. This repository currently contains the full backend API for user authentication, property management, and booking workflows.

## 🚀 Features

- User registration and login with JWT access tokens
- Refresh token support via secure HTTP-only cookies
- Role-aware user model with `guest`, `host`, and `admin` roles
- Property CRUD operations for hosts
- Public property search with filtering, pagination, and availability
- Booking creation with date validation and conflict prevention
- Guest and host booking views
- Booking cancellation
- Centralized error handling and validation

## 🧩 Tech Stack

- Node.js
- Express
- MongoDB / Mongoose
- JSON Web Tokens (JWT)
- bcryptjs for password hashing
- dotenv for environment variables
- cors and cookie-parser
- validator for request validation

## 📁 Project Structure

- `backend/server.js` — application entry point
- `backend/config/db.js` — MongoDB connection logic
- `backend/routes/` — Express route definitions
- `backend/controllers/` — request handlers and business logic
- `backend/models/` — Mongoose schemas for User, Property, and Booking
- `backend/middleware/` — authentication and error handling
- `backend/utils/` — helper utilities for token generation, async handling, and date validation

## ⚙️ Backend API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive an access token | No |
| POST | `/api/auth/refresh` | Refresh access token using refresh token cookie | No |
| POST | `/api/auth/logout` | Clear refresh token cookie | Yes |
| GET | `/api/auth/me` | Get current authenticated user profile | Yes |

### Properties

| Method | Endpoint | Description | Auth Required | Notes |
| --- | --- | --- | --- | --- |
| GET | `/api/properties` | List available properties with query filters | No | Supports pagination, location, price filtering |
| GET | `/api/properties/:id` | Get details for a single property | No | |
| POST | `/api/properties` | Create a property | Yes | Authenticated users only |
| PUT | `/api/properties/:id` | Update a property | Yes | Owner only |
| DELETE | `/api/properties/:id` | Delete a property | Yes | Owner only |
| GET | `/api/properties/my` | List properties owned by authenticated user | Yes | |

**Query parameters supported for `GET /api/properties`:**

| Parameter | Type | Description |
| --- | --- | --- |
| `city` | String | Filter by city |
| `state` | String | Filter by state |
| `country` | String | Filter by country |
| `minPrice` | Number | Minimum price per night |
| `maxPrice` | Number | Maximum price per night |
| `guests` | Number | Number of guests |
| `page` | Number | Page number for pagination |
| `limit` | Number | Results per page |

### Bookings

| Method | Endpoint | Description | Auth Required | Notes |
| --- | --- | --- | --- | --- |
| POST | `/api/bookings` | Create a booking for a property | Yes | |
| GET | `/api/bookings/my` | Get bookings made by authenticated guest | Yes | Guest view only |
| GET | `/api/bookings/host` | Get bookings for properties owned by authenticated host | Yes | Host view only |
| GET | `/api/bookings/property/:propertyId` | Get future bookings for a property | Yes | |
| GET | `/api/bookings/:id` | Get booking details | Yes | Guest or host only |
| DELETE | `/api/bookings/:id` | Cancel a booking | Yes | Guest only |

## 🔐 Authentication

- Access tokens are provided as Bearer tokens in the `Authorization` header
- Refresh tokens are stored in an HTTP-only cookie named `refreshToken`
- Protected routes use `backend/middleware/authMiddleware.js`
- Token secrets and expiry values are configured via environment variables

## 🗄️ Database Models

### User

Represents a user in the system with authentication and role-based access.

```javascript
{
  name: String,            // required, trimmed
  email: String,           // required, unique, lowercase
  password: String,        // required, hashed
  role: String,            // guest | host | admin
  avatar: String,          // optional profile image URL
  timestamps: true,
}
```

### Property

Represents a rental property listed by a host.

```javascript
{
  host: ObjectId,          // Reference to User
  title: String,           // required, max 100 chars
  description: String,     // required, max 1000 chars
  location: {
    city: String,          // required
    state: String,         // required
    country: String,       // required
  },
  pricePerNight: Number,   // required, min 1
  maxGuests: Number,       // required, min 1
  bedrooms: Number,        // default 1
  bathrooms: Number,       // default 1
  amenities: [String],     // optional list of features
  images: [String],        // optional image URLs
  isAvailable: Boolean,    // default true
  timestamps: true,
}
```

### Booking

Represents a booking/reservation made by a guest for a property.

```javascript
{
  property: ObjectId,      // Reference to Property
  guest: ObjectId,         // Reference to User
  checkIn: Date,           // required
  checkOut: Date,          // required
  totalPrice: Number,      // required
  totalNights: Number,     // required
  status: String,          // pending | confirmed | cancelled
  guestsCount: Number,     // required, min 1
  timestamps: true,
}
```

## 🧪 Getting Started

1. Open a terminal in the repo root
2. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Create a `.env` file in `backend/`
4. Add the required environment variables:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_ACCESS_SECRET=your_access_token_secret
   JWT_REFRESH_SECRET=your_refresh_token_secret
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_EXPIRY=7d
   ```

5. Start the server:

   ```bash
   npm run dev
   ```

6. Verify the API is running at:

   ```text
   http://localhost:5000/
   ```

## 💡 Notes

- The backend currently allows CORS from `http://localhost:5173` in `backend/server.js`. Update this if your frontend uses a different origin.
- Booking dates are validated so check-in cannot be in the past and check-out must be after check-in.
- Properties are only searchable when `isAvailable` is `true`.
- Hosts cannot book their own properties.
- The app uses ES modules (`type: module`) in `backend/package.json`.

## 📌 Next Improvements

Future enhancements could include:

- payment integration
- property images/uploads
- reviews and ratings
- improved host verification workflows
- availability calendars and booking windows

## 🏁 Summary

This repository currently contains the StayNest backend API for rental booking operations. It is ready to power a frontend client with authentication, property management, and booking flows.

## 👤 Author

### Chetanya Mittal
