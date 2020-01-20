import { Component, OnInit } from '@angular/core';
import { LoggingService } from './shared/services/logging.service';
import * as fromApp from './store/app.reducer';
import { Store } from '@ngrx/store';
import * as authActions from './auth/store/auth.actions'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
 
  constructor(private store: Store<fromApp.AppState>) {

  }

  ngOnInit() {
    this.store.dispatch(new authActions.AutoLogin());
  }
 
}
