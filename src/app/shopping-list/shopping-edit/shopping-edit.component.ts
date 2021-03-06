import { Component, OnInit, ViewChild, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @Output() ingredientAdded = new EventEmitter<Ingredient>();
  @ViewChild('f', {static: false}) slForm: NgForm;
  subscription: Subscription;
  changesSaved = false;
  editMode = false;
  editedItem: Ingredient

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      } else {
        this.editMode = false;
      }
    })
   
  }

  // canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
  //   const name: string = this.nameInputRef.nativeElement.value;
  //   const amount: number = this.amountInputRef.nativeElement.value;
  //   if ((name || amount) && !this.changesSaved) {
  //     return confirm('Do you want to discard the changes?');
  //   }
  //   return true;
  // }

  resetForm() {
    this.editMode = false;
    this.slForm.reset();
  }
  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient))
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.resetForm();
    //this.changesSaved = true;
    //this.router.navigate(['/'], {relativeTo: this.route})
  }

  onClear() {
    this.resetForm();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.resetForm();
  }



  ngOnDestroy() {
    this.store.dispatch(new ShoppingListActions.StopEdit());
    this.subscription.unsubscribe();
  }
}
