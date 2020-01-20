import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(private authService: AuthService, private router: Router, private store: Store<fromApp.AppState>) {}
    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean> | boolean {
                    return this.store.select('auth').pipe(
                        take(1),
                        map(authState => authState.user),
                        map(user => {
                        const isAuthenticated = !!user;
                        if (isAuthenticated) {
                            return true;
                        }
                        return this.router.createUrlTree(['/auth']);
                    })
                    )}
    canActivateChild(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean> | boolean {
            return this.canActivate(route, state);
        }
}