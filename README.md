# Travetic SaaS

This repo now hosts both the public marketing site (`public/`) and a Node/Express backend that handles bookings, admin claims, and approvals with MongoDB. It is ready to deploy on Render (static + API) with environment variables such as `MONGODB_URI` and `ADMIN_SECRET`.

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

## Render Deployment

1. Create a Web Service pointing to `npm run start`.
2. Set `PORT`, `MONGODB_URI`, and `ADMIN_SECRET` in the Render dashboard.
3. Render will serve both the marketing front end and the protected APIs from the same origin, so the browser can call `/api/bookings` directly.

## MongoDB Schema

- `Bookin` stores visitor name, email, message, status (`pending`/`approved`), and timestamps.
- `AdminClaim` remembers the first studio that claims the Travetic OS admin seat (first signup wins).

## Admin Access

1. Use the admin secret token when prompted in the admin panel to load bookings.
2. Approve bookings directly from the console; the UI refreshes once a booking is approved.
