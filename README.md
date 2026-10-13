# EventHorizon - Identity Service API Foundation
Authentication microservice foundation.

# EventHorizon Backend Service

**EventHorizon Backend Service** is a secure and robust RESTful API built with **Node.js, Express, and MongoDB**. This service serves as the foundational gatekeeper for an event management platform specializing in local tech meetups, handling user registration, strict validation, secure authentication, and a token-based email verification flow.

## 🚀 Key Features

*   **Database & Schema Validation:** MongoDB integration via Mongoose with strict schema design.
*   **Request Payload Validation:** Secure data validation using `joi` for all incoming registration and login payloads (enforcing strong alphanumeric, minimum 8-character passwords).
*   **Password Hashing:** One-way password hashing using `bcrypt` before database persistence.
*   **Session Management:** Secure user authentication using JSON Web Tokens (JWT).
*   **Token-Based Email Verification:** A custom, time-sensitive verification email flow (No OTPs) that blocks unverified accounts from logging in or accessing secure areas.
*   **Protected Routes:** Authorization middleware to shield private endpoints like user profiles.

---

## 🛠️ Tech Stack

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB & Mongoose
*   **Validation:** Joi
*   **Security & Auth:** JSON Web Tokens (JWT), Bcrypt
*   **Email Service:** Nodemailer (or preferred SMTP client)

---

## 📂 Project Structure Example

```text
├── config/             # Database and server configurations
├── controllers/        # Request handlers for authentication and user profiles
├── middleware/         # Auth guards and validation catchers
├── models/             # Mongoose schemas (User, VerificationToken)
├── routes/             # API endpoint definitions
├── utils/              # Email helper functions
├── .env.example        # Environment variables template
├── app.js              # Application entry point
└── package.json        # Project dependencies
```

---

## ⚙️ Installation & Setup

Follow these steps to set up and run the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com
cd eventhorizon-backend-techyjaunt3
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and configure the following keys:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eventhorizon
JWT_SECRET=your_super_secure_jwt_secret_key
TOKEN_SECRET=your_email_verification_token_secret

# SMTP Email Configuration
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
FRONTEND_URL=http://localhost:3000
```

### 4. Run the Server
**Development Mode (with Nodemon):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

---

## 📡 API Endpoints

### 🔓 Public Endpoints

#### Register a New User
*   **URL:** `/api/auth/register`
*   **Method:** `POST`
*   **Payload Constraints (Joi):** Password must be at least 8 characters long and alphanumeric.
*   **Behavior:** Hashes the password, generates a unique time-sensitive verification token, stores it, and dispatches a verification link to the user's email.

```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "SecurePassword123"
}
```

#### Verify Email Address
*   **URL:** `/api/auth/verify-email`
*   **Method:** `GET`
*   **Query Parameters:** `?token=xyz123...`
*   **Behavior:** Validates the link token against the database records. If valid and not expired, sets the user status to verified.

#### User Login
*   **URL:** `/api/auth/login`
*   **Method:** `POST`
*   **Behavior:** Validates credentials. **Note:** Unverified users are rejected immediately during login. Returns a JWT upon success.

```json
{
  "email": "johndoe@example.com",
  "password": "SecurePassword123"
}
```

### 🔒 Protected Endpoints (Requires JWT)

#### Get User Profile
*   **URL:** `/api/user/profile`
*   **Method:** `GET`
*   **Headers:** `Authorization: Bearer <Your_JWT_Token>`

