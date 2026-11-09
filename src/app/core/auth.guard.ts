import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from './auth.service';
export const authGuard: CanActivateFn = () => {
 const auth=inject(AuthService),router=inject(Router);
 return auth.checkSession().pipe(map(allowed=>allowed?true:router.createUrlTree(['/access-denied'])));
};
