import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../../recipe.model';
import { RecipeService } from 'src/app/recipes/recipe.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class recipeItemComponent implements OnInit {
  @Input() recipe: Recipe;
  @Input() recipeIndex: number;
  
  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
  }

}
