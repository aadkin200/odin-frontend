# Railway deployment — Odin's Chosen Angular

Deploy this directory as a **separate Railway service** from Spring Boot.

1. Set `BACKEND_UPSTREAM=http://<your-backend-service>.railway.internal:8080` on the Angular Railway service. Use your actual Railway backend service name. The private network DNS name is not a public URL.
2. Deploy Angular via the included Dockerfile. Nginx listens on **8080**. In Railway set the frontend service port to **8080** if necessary, and generate a public domain.
3. Set Spring Boot `FRONTEND_ORIGIN=https://<your-frontend-domain>` (no trailing slash), and `COOKIE_SECURE=true`.
4. On Spring Boot set `server.forward-headers-strategy=framework` in application.yml so Discord OAuth2 calculates the public HTTPS redirect URI behind Nginx/Railway proxies.
5. In the Discord Developer Portal set the OAuth2 redirect URI to `https://<your-frontend-domain>/login/oauth2/code/discord`.
6. Ensure the backend is listening on 8080 internally (or update `BACKEND_UPSTREAM` to its actual port). Railway backend public domain is not required for browser requests.
7. Do **not** set secrets or OAuth client credentials in Angular; keep them in Spring Boot environment variables.

The proxy ensures same-origin browser requests for `/api/`, `/oauth2/`, and `/login/oauth2/`, and Angular route refreshes fall back to `index.html`.

IMPORTANT: The current Angular app and Spring Boot foundation are not yet verified by an end-to-end production build. The existing Angular logout request also needs CSRF handling and Spring Security logout path alignment. The initial login flow and backend OAuth2 configuration require integration testing before production use.
