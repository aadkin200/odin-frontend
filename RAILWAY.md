# Railway frontend

Deploy from `odins-chosen-angular/` as the service root (or use its Dockerfile as the build source). Expose port 8080. SPA route refreshes are handled by Nginx.

Frontend-only: no `BACKEND_UPSTREAM` is needed. The default points at an unavailable local port so API calls fail while the public website still serves normally.

Once Spring Boot is deployed, set `BACKEND_UPSTREAM=http://YOUR-BACKEND-SERVICE.railway.internal:8080` on the frontend service and redeploy. Set the backend `FRONTEND_ORIGIN` to your public frontend URL, and `COOKIE_SECURE=true`.

Configure Discord redirect URI to `https://YOUR-FRONTEND-DOMAIN/login/oauth2/code/discord` once OAuth2 is ready. Until then Cashflow is not accessible.
