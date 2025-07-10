# Blog Backend

This is the backend for the Blog Application, built with Node.js, Express, and MongoDB (Mongoose).  
It provides a RESTful API for user authentication, blog posts, comments, and likes.

## Features

- User registration and login (JWT authentication)
- Secure password hashing
- CRUD for blog posts (with optional image URL)
- Commenting and like/unlike functionality
- API documentation with Swagger (`/api/docs`)
- CORS and security headers (Helmet)

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- Swagger for API docs

## Getting Started

### 1. Install dependencies

```sh
npm install
```

### 2. Set environment variables

Create a `.env` file in `blog-backend/`:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 3. Run locally

```sh
node src/index.js
```

or (if you have nodemon):

```sh
npx nodemon src/index.js
```

### 4. API Documentation

Visit [http://localhost:5000/api/docs](http://localhost:5000/api/docs) for Swagger API docs.

## Deployment

- Recommended: [Render](https://render.com/) or [Railway](https://railway.app/)
- Set `MONGODB_URI` and `JWT_SECRET` in your deployment environment variables.

## Folder Structure

- `src/routes/` — API route definitions
- `src/controllers/` — Route handlers
- `src/models/` — Mongoose models
- `src/middleware/` — Auth middleware
- `src/utils/` — Utility functions

## License

MIT 