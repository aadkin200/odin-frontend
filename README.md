# Odin's Chosen — Angular 21 frontend

Rebuilt from the provided React website, retaining its public routes, written content, and supplied images.

## Run
Requires Node.js compatible with Angular 21 (Node 20.19+, 22.12+, or 24+).

```bash
npm install
npm start
```

Build with `npm run build`.

## Routes
- `/` public home
- `/introduction`
- `/odins-law`
- `/structure`
- `/cashflow` High Command-only shell
- `/access-denied`

## Authentication integration (NOT IMPLEMENTED IN BACKEND YET)
Angular redirects login to `/oauth2/authorization/discord` and checks `/api/auth/me`.
Expected response: `{ "discordId": "...", "displayName": "...", "highCommand": true, "chapters": ["SOCAL"] }`.
Backend MUST verify the Discord `OC | High Command` role on every protected request and return 403 when unauthorized. Angular guards alone are not security.

For local development configure reverse proxy for `/api` and `/oauth2` to Spring Boot. No fake login or mock authorization is provided. Until backend exists, Cashflow denies access.

## Status
Frontend foundation and public page migration provided. Cashflow dashboard is an honest placeholder, not a functional financial management application. Discord OAuth, API, transaction forms, analytics, PDF/Excel and Railway deployment remain future phases.
