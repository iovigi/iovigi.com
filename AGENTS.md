# Agent Instructions & Project Documentation

Welcome! This document provides information on the structure, design, database models, localization, and development workflows of iovigi.com. It is intended to help AI agents and developers navigate, understand, and modify the codebase efficiently.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js (using App Router, hybrid Client/Server layout setup).
- **Language:** JavaScript (ES6+).
- **Database:** MongoDB via **Mongoose**.
- **Styling:**
  - **Public Frontend:** Uses the *Blogio* theme, customized with Bootstrap 4/5 structure, font-awesome, custom CSS styles, and a scrolling Starfield animation (`/css/stars.css`).
  - **Admin Panel:** Powered by *AdminLTE 3* (Bootstrap-based dashboard) for managing posts, pages, comments, and widgets.
- **Authentication:** Custom JWT-based token (`admin_token` cookie) verified against secret keys stored in environment variables.

---

## 📁 Repository Structure

Below are the key folders and files in the repository:

- [app/(admin)/layout.js](file:///d:/Projects/iovigi.com/app/(admin)/layout.js) - Layout for the admin dashboard (loads AdminLTE CSS/JS)
- [app/(admin)/admin](file:///d:/Projects/iovigi.com/app/(admin)/admin) - Content management pages (posts, pages, comments, widgets)
- [app/(auth)/layout.js](file:///d:/Projects/iovigi.com/app/(auth)/layout.js) - Basic layout for auth pages
- [app/(auth)/admin/login](file:///d:/Projects/iovigi.com/app/(auth)/admin/login) - Admin Login page
- [app/(public)/layout.js](file:///d:/Projects/iovigi.com/app/(public)/layout.js) - Public facing root layout (includes space-background, navbar, footer)
- [app/(public)/page.js](file:///d:/Projects/iovigi.com/app/(public)/page.js) - Public homepage landing
- [app/(public)/[slug]](file:///d:/Projects/iovigi.com/app/(public)/[slug]) - Dynamic page routing
- [app/(public)/blog](file:///d:/Projects/iovigi.com/app/(public)/blog) - Blog listing and single post view logic
- [app/api/auth/login/route.js](file:///d:/Projects/iovigi.com/app/api/auth/login/route.js) - API route issuing admin JWT token
- [app/ClientLayout.js](file:///d:/Projects/iovigi.com/app/ClientLayout.js) - Client wrapper providing [LanguageContext.js](file:///d:/Projects/iovigi.com/context/LanguageContext.js)
- [app/globals.css](file:///d:/Projects/iovigi.com/app/globals.css) - Global application base styles
- [app/page.module.css](file:///d:/Projects/iovigi.com/app/page.module.css) - Next.js default page CSS module
- [components/HomeContent.js](file:///d:/Projects/iovigi.com/components/HomeContent.js) - Content renderer for the public homepage
- [components/LanguageSwitcher.js](file:///d:/Projects/iovigi.com/components/LanguageSwitcher.js) - Client language selection widget
- [components/LocalizationTabs.js](file:///d:/Projects/iovigi.com/components/LocalizationTabs.js) - Tab selectors for multilingual editing in the admin panel
- [components/PublicNavbar.js](file:///d:/Projects/iovigi.com/components/PublicNavbar.js) - Header menu for page navigation
- [components/PublicFooter.js](file:///d:/Projects/iovigi.com/components/PublicFooter.js) - Footer containing page links and copyright details
- [context/LanguageContext.js](file:///d:/Projects/iovigi.com/context/LanguageContext.js) - Global context managing translation locales and cookies
- [lib/db.js](file:///d:/Projects/iovigi.com/lib/db.js) - Mongoose cached connection utility
- [lib/dictionary.js](file:///d:/Projects/iovigi.com/lib/dictionary.js) - English / Bulgarian translation dictionaries
- [models/Comment.js](file:///d:/Projects/iovigi.com/models/Comment.js) - Mongoose schema for user comments on posts
- [models/Page.js](file:///d:/Projects/iovigi.com/models/Page.js) - Mongoose schema for dynamic pages
- [models/Post.js](file:///d:/Projects/iovigi.com/models/Post.js) - Mongoose schema for posts with bilingual attributes
- [models/User.js](file:///d:/Projects/iovigi.com/models/User.js) - Mongoose schema for admin user credentials
- [models/Widget.js](file:///d:/Projects/iovigi.com/models/Widget.js) - Mongoose schema for dynamic sidebar widgets
- [scripts/seed-admin.js](file:///d:/Projects/iovigi.com/scripts/seed-admin.js) - Script to seed default administrator user
- [scripts/seed-widgets.js](file:///d:/Projects/iovigi.com/scripts/seed-widgets.js) - Script to seed default widgets
- [.env.local](file:///d:/Projects/iovigi.com/.env.local) - Environment configuration (contains database URI, JWT secret, and admin credentials)
- [generate_stars.js](file:///d:/Projects/iovigi.com/generate_stars.js) - CLI utility generating a box-shadow based starfield background
- [proxy.js](file:///d:/Projects/iovigi.com/proxy.js) - Route protection and JWT verification middleware proxy

---

## 🔒 Authentication & Route Protection

1. **Admin Credentials:** Authenticated credentials are configuration-driven using values set inside [.env.local](file:///d:/Projects/iovigi.com/.env.local) (`ADMIN_USERNAME` and `ADMIN_PASSWORD`).
2. **Admin Token:** Successful logins issue a JWT token signed using `JWT_SECRET`, which is saved in a browser cookie named `admin_token`.
3. **Route Protection Proxy:**
   - The [proxy.js](file:///d:/Projects/iovigi.com/proxy.js) module validates `admin_token` for paths matching `/admin/:path*` (except `/admin/login`, and static folders under `/admin/dist` or `/admin/plugins`).
   - If missing/invalid, users are redirected back to `/admin/login`.
   - *Note:* In standard Next.js deployments, route middleware is handled by renaming this or creating a [middleware.js](file:///d:/Projects/iovigi.com/middleware.js) at root which calls the proxy verification.

---

## 🌍 Multilingual & Localization Architecture

The application provides native localization for English (`en`) and Bulgarian (`bg`).

1. **Language Context:**
   - Managed in [LanguageContext.js](file:///d:/Projects/iovigi.com/context/LanguageContext.js). It stores the user's choice in a cookie (`NEXT_LOCALE`) which persists for 365 days.
   - Automatically detects user locale on their first visit based on:
     - The visitor's timezone (`Europe/Sofia` selects `bg`).
     - Browser language settings (`navigator.language` containing `bg` or `bg-bg`).
     - Standard fallback is English (`en`).
2. **Translation Dictionary:**
   - Managed in [dictionary.js](file:///d:/Projects/iovigi.com/lib/dictionary.js).
   - Contains translations for keys (`home`, `readMore`, `visibleEn`, etc.) mapped to both languages.
3. **Database Multilinguality:**
   - Models like [Post.js](file:///d:/Projects/iovigi.com/models/Post.js) and [Page.js](file:///d:/Projects/iovigi.com/models/Page.js) contain separate fields for En and Bg content (e.g., `titleEn` and `titleBg`).
   - The admin panel allows the administrator to switch tabs to input English and Bulgarian titles/content simultaneously when editing.

---

## 💾 Database Schema & Models

Database connection setup is managed inside [db.js](file:///d:/Projects/iovigi.com/lib/db.js).

### Models

- **User** ([User.js](file:///d:/Projects/iovigi.com/models/User.js)):
  - `username` (String, unique, required)
  - `password` (String, hashed using bcryptjs)
- **Post** ([Post.js](file:///d:/Projects/iovigi.com/models/Post.js)):
  - `titleEn` / `titleBg` (String, required)
  - `contentEn` / `contentBg` (String, required)
  - `slug` (String, unique, required)
  - `imageUrl` (String)
  - `published` (Boolean)
  - `createdAt` (Date)
- **Page** ([Page.js](file:///d:/Projects/iovigi.com/models/Page.js)):
  - `titleEn` / `titleBg` (String, required)
  - `contentEn` / `contentBg` (String, required)
  - `slug` (String, unique, required)
  - `showInMenu` (Boolean)
  - `sortOrder` (Number)
- **Comment** ([Comment.js](file:///d:/Projects/iovigi.com/models/Comment.js)):
  - `postId` (ObjectId, ref: 'Post')
  - `author` (String, required)
  - `content` (String, required)
  - `approved` (Boolean)
  - `createdAt` (Date)
- **Widget** ([Widget.js](file:///d:/Projects/iovigi.com/models/Widget.js)):
  - `titleEn` / `titleBg` (String)
  - `contentEn` / `contentBg` (String)
  - `type` (String)
  - `sortOrder` (Number)

---

## ⚙️ Development Workflows

### Standard Commands

1. **Installing Dependencies:**
   ```bash
   npm install
   ```
2. **Database Seeding:**
   Creates default admin user credentials and sidebar widgets:
   ```bash
   npm run seed
   ```
3. **Local Dev Server:**
   Runs Next.js local server at [http://localhost:3000](http://localhost:3000):
   ```bash
   npm run dev
   ```
4. **Starfield Background Generation:**
   Re-generates random space box-shadows:
   ```bash
   node generate_stars.js
   ```

---

## 🧭 Guidelines for AI Agents

When editing or creating new components, layouts, or APIs:
1. **Always connect to DB:** Ensure you import `dbConnect` from `@/lib/db` and execute `await dbConnect();` before performing database operations inside API routes or server components.
2. **Maintain Localization:** Ensure you handle Bulgarian and English inputs in all editing forms. Add key mappings in [dictionary.js](file:///d:/Projects/iovigi.com/lib/dictionary.js) if new user-facing labels are introduced.
3. **Respect Layout & Styling Systems:**
   - Public frontend edits should follow the existing Bootstrap styles and maintain clean visual layout alignment.
   - Admin page dashboard components should utilize AdminLTE 3 cards, grids, and form classes (e.g., `card`, `card-header`, `card-body`, `form-group`) to ensure design visual consistency.
4. **Documentation Integrity:** Preserve all existing comments and documentation blocks. Document new changes clearly in code comments.
