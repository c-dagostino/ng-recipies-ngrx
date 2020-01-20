import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as actions from './store/shopping-list.actions';
@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent {
  ingredients: Observable<{ingredients: Ingredient[]}>;

  constructor(private store: Store<fromApp.AppState>) { 
      this.ingredients = this.store.select('shoppingList');
}


  onIngredientAdded(ingredient: Ingredient) {
    this.store.dispatch(new actions.AddIngredient(ingredient));
  }

  onEditItem(index: number) {
    this.store.dispatch(new actions.StartEdit(index))
  }

}
