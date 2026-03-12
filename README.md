# Travetic SaaS

This repo now hosts both the public marketing site and a Node/Express backend that handles bookings and approvals with MongoDB. It is ready to deploy on Render (static + API) with environment variables such as `MONGODB_URI` and `ADMIN_SECRET`.

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your MongoDB URI plus an admin secret token.
3. Run locally:
   ```bash
   npm run dev
   ```
   The server will serve `public/index.html` and expose `/api` endpoints for bookings/admin workflows.

## Render Deployment (backend)

1. Create a Web Service pointing to `npm run start`.
2. Set `PORT`, `MONGODB_URI`, and `ADMIN_SECRET` in the Render dashboard.
3. Render will serve both the marketing front end and the protected APIs from the same origin, so the browser can call `/api/bookings` directly.

## Vercel Deployment (frontend)

1. Point your Vercel project at this repo’s root.
2. Set the static file target (Vercel already serves `index.html` by default).
3. Before deploying, edit `config.js` so `apiRoot` points to your Render backend (for example `https://travetic-api.onrender.com/api`). Vercel has no access to `.env`, so the frontend uses this file to discover the API host.
4. Optionally, control the nav CTA buttons with Vercel’s rewrites so `login.html` and `admin-dashboard.html` stay accessible under your domain.

## MongoDB Schema

- `Booking` stores visitor name, email, message, status (`pending`/`approved`), notes, and timestamps.
- `AdminClaim` remembers which studio was granted the admin seat via the Render API (managed outside the public login page).

## Admin Access

1. Use the admin secret token (from Render) when the CRM gate prompts you, and type the same token again if the gate reloads.
2. After the gate unlocks, approve bookings or add notes; the MongoDB data populates the table via the Render API.  
3. The login page now requests passwordless magic tokens (`/api/magic`) for customers and partners and verifies them via `/api/magic/verify` before granting access.  
4. Visitors who want to submit travel intents or request partner access can use `signup.html`, which writes to `/api/bookings` and `/api/admin/claim`.
