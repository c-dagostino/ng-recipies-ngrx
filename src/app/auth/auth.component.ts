import { Component, ComponentFactoryResolver, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';
@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy, OnInit {
    isLoginMode = true;
    isLoading = false;
    error: string = null;
    @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
    private closeSub: Subscription;
    private storeSub: Subscription;

    ngOnInit() {
       this.storeSub = this.store.select('auth').subscribe (authState => {
                this.isLoading = authState.loading,
                this.error = authState.authError;
                if (this.error) {
                    this.showErrorAlert(this.error);
                }
        });
    }

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private store: Store<fromApp.AppState>){}
    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onHandleError() {
       this.store.dispatch(new AuthActions.ClearError());
    }

    private showErrorAlert(errorMessage: string) {
        const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();
        const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
        componentRef.instance.message = errorMessage;
        this.closeSub = componentRef.instance.close.subscribe(() => {
            hostViewContainerRef.clear();
            this.closeSub.unsubscribe()})

    }

    onSubmit(form: NgForm) {
        const email = form.value.email;
        const password = form.value.password;

        if (form.valid) {
            if (this.isLoginMode) {
               this.store.dispatch(new AuthActions.LoginStart({email, password}));
            } else {
               this.store.dispatch(new AuthActions.SignupStart({email, password}));
            }
        }

        return;
    }

    ngOnDestroy() {
        if (this.closeSub) {
            this.closeSub.unsubscribe();
        }
        if (this.storeSub) {
            this.storeSub.unsubscribe();
        }
    }
}