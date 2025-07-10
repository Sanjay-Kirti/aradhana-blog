# Blog Frontend

This is the frontend for the Blog Application, built with React, Vite, Tailwind CSS, and React Hook Form.  
It provides a clean, modern UI for users to register, log in, create, edit, and view blog posts, as well as comment and like posts.

## Features

- User authentication (JWT)
- Create, edit, and delete blog posts (with optional image)
- View all posts and detailed post pages
- Comment on and like/unlike posts
- Responsive, modern UI (Tailwind CSS)
- Form validation with React Hook Form + Zod

## Tech Stack

- React + Vite
- Tailwind CSS
- React Hook Form + Zod
- Context API for auth state
- Axios/fetch for API calls

## Getting Started

### 1. Install dependencies

```sh
npm install
```

### 2. Set environment variables

Create a `.env` file in `blog-frontend/`:

```
VITE_API_URL=https://your-backend-url.onrender.com
```

### 3. Run locally

```sh
npm run dev
```

### 4. Build for production

```sh
npm run build
```

## Deployment

- Recommended: [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/)
- Set `VITE_API_URL` in your deployment environment variables to your backend API URL.

## Folder Structure

- `src/pages/` — Main pages (Login, Register, Posts, Post Detail, Create/Edit Post)
- `src/components/` — Reusable UI components (NavBar)
- `src/store/` — Auth context
- `src/utils/` — API helper

## License

MIT
