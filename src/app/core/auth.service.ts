import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
export interface SessionUser { discordId: string; displayName: string; highCommand: boolean; chapters: string[]; }
@Injectable({providedIn:'root'})
export class AuthService {
  private http=inject(HttpClient);
  readonly user=signal<SessionUser|null>(null);
  readonly checked=signal(false);
  checkSession(){return this.http.get<SessionUser>('/api/auth/me',{withCredentials:true}).pipe(map(user=>{this.user.set(user);this.checked.set(true);return user.highCommand;}),catchError(()=>{this.user.set(null);this.checked.set(true);return of(false);}));}
  login(){window.location.assign('/oauth2/authorization/discord');}
  logout(){this.http.post('/api/auth/logout',{}, {withCredentials:true}).subscribe(()=>{this.user.set(null);window.location.assign('/');});}
}
