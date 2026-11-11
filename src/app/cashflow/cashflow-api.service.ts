import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { switchMap } from "rxjs";
@Injectable({ providedIn: "root" })
export class CashflowApi {
  private http = inject(HttpClient);
  get<T>(path: string) {
    return this.http.get<T>("/api/cashflow/" + path, { withCredentials: true });
  }
  post<T>(path: string, data: unknown) {
    return this.http
      .get<{ token: string }>("/api/auth/csrf", { withCredentials: true })
      .pipe(
        switchMap((csrf) =>
          this.http.post<T>("/api/cashflow/" + path, data, {
            withCredentials: true,
            headers: { "X-XSRF-TOKEN": csrf.token },
          }),
        ),
      );
  }
}
