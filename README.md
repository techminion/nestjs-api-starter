# NestJS API Starter Template with Authentication

## Overview

This is a **starter NestJS API template** with built-in **authentication** and **user management**. It provides a scalable, well-structured foundation for developing secure RESTful APIs.

## Features

- **User Authentication** (JWT-based login, signup, and email verification)
- **JWT Refresh Token Mechanism** (Automatic access token renewal)
- **Secure Password Hashing** (Using bcrypt)
- **Email Verification & Password Reset** (Using MailerModule)
- **API Documentation** (Swagger UI)
- **Error Handling & Logging** (Global exception filters and logging)
- **Modular Structure** (Easily extendable and maintainable)
- **API Versioning** (Supports multiple versions)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/techminion/nestjs-api-starter.git
cd nestjs-api-starter
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory same as `.env.example`

### 4. Run the Application

```bash
npm run start:dev
```

API is now running on: `http://localhost:3000`

---

## API Endpoints

### Auth Routes

| Method | Endpoint                 | Description                   |
| ------ | ------------------------ | ----------------------------- |
| `POST` | `/auth/signup`           | Register a new user           |
| `POST` | `/auth/login`            | User login, returns JWT token |
| `GET`  | `/auth/verify?token=...` | Verify email address          |
| `POST` | `/auth/forgot-password`  | Send password reset email     |
| `POST` | `/auth/reset-password`   | Reset password using token    |
| `POST` | `/auth/refresh-token`    | Get a new access token        |

### User Routes

| Method | Endpoint         | Description                    |
| ------ | ---------------- | ------------------------------ |
| `GET`  | `/users/profile` | Get authenticated user profile |

---

## API Documentation (Swagger UI)

Swagger documentation is available at:

```
http://localhost:3000/api/docs
```

---

## Best Practices

- Use environment variables for sensitive data.
- Store refresh tokens securely (preferably in HTTP-only cookies).
- Use HTTPS in production.
- Rotate refresh tokens to prevent misuse.
- Enable rate limiting & security middleware.

---

## Built With

- **NestJS** - Modular TypeScript framework for Node.js
- **Mongoose** - MongoDB Object Modeling
- **JWT** - JSON Web Token for authentication
- **Bcrypt** - Secure password hashing
- **Swagger** - API Documentation
- **MailerModule** - Email support for verification & password resets

---

## Contributing

Feel free to submit issues or pull requests to improve this starter template.

---

## License

This project is open-source and available under the **MIT License**.

Happy coding!
