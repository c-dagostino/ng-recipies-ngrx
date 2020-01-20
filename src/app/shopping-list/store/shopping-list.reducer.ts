import { Ingredient } from '../../shared/ingredient.model';
import * as actions from './shopping-list.actions';


export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}

const initialState: State = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
    ],
    editedIngredient: null,
    editedIngredientIndex: -1
}

export function shoppingListReducer(state: State = initialState, action: actions.ShoppingListActions) {
    switch (action.type) {
        case actions.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload]
                    };
        case actions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
                    };
            case actions.UPDATE_INGREDIENT:
                const ingredient = state.ingredients[state.editedIngredientIndex]
                const updatedIngredient = {...ingredient, ...action.payload};
                const updatedIngredients = [...state.ingredients];
                updatedIngredients[state.editedIngredientIndex] = updatedIngredient
                return {
                    ...state,
                    ingredients: updatedIngredients,
                    editedIngredientIndex: -1,
                    editedIngredient: null,
                    };
            case actions.DELETE_INGREDIENT:
                return {
                    ...state,
                    ingredients: state.ingredients.filter((i, index) => {
                        return index !== state.editedIngredientIndex;
                    }),
                    editedIngredientIndex: -1,
                    editedIngredient: null,
                    };
            case actions.START_EDIT:
                return {
                    ...state,
                    editedIngredientIndex: action.payload,
                    editedIngredient: {...state.ingredients[action.payload]},
                    };
            case actions.STOP_EDIT:
                return {
                    ...state,
                    editedIngredientIndex: -1,
                    editedIngredient: null,
                    };
            default: //must always have a default case for initialization
            return state;
    }
}