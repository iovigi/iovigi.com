# iovigi's blog

This is the personal blog of **Iliya Nedelchev**, built using **Google Antigravity**.

A modern, dynamic blog application developed with Next.js, featuring a custom administrative panel and a public-facing frontend.

## Features

-   **Public Frontend**: using the *Blogio* theme.
-   **Admin Panel**: Powered by *AdminLTE 3*, allowing full content management.
-   **Authentication**: Secure admin login with MongoDB-backed credentials and hashed passwords.
-   **Dynamic Content**:
    -   Create, Edit, and Delete Blog Posts.
    -   Manage Dynamic Pages (e.g., About, Contact).
    -   Image Upload support for posts.
    -   Dynamic browser titles for better SEO (`[Post Title] | iovigi's blog`).

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org) (App Router)
-   **Database**: MongoDB (Mongoose)
-   **Styling**: Bootstrap, Custom CSS
-   **Auth**: JWT, bcryptjs

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Seeding

To set up the initial admin user (configured in `.env.local`), run:

```bash
npm run seed
```
