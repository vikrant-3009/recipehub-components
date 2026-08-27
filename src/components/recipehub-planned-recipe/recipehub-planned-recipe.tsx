import { Component, Event, EventEmitter, Prop, State, h } from '@stencil/core';
import { MealPlanItem } from '../../models/recipe-meal-plan-model';

@Component({
  tag: 'recipehub-planned-recipe',
  styleUrl: 'recipehub-planned-recipe.css',
  shadow: true,
})
export class RecipehubPlannedRecipe {
  @Prop() recipe: string = '';

  @Prop() placeholderImageSrc: string = '';

  @Event() recipeSelect: EventEmitter<MealPlanItem>;

  @Event() removeRecipe: EventEmitter<string>;

  @State() imageLoadFailed: boolean = false;

  private getRecipe(): MealPlanItem | null {
    if (!this.recipe) {
      return null;
    }
    try {
      const parsedRecipe = JSON.parse(this.recipe);
      if (!parsedRecipe || typeof parsedRecipe !== 'object') {
        console.error('recipehub-planned-recipe: recipe must be a JSON object');
        return null;
      }
      return parsedRecipe as MealPlanItem;
    } catch (error) {
      console.error('recipehub-planned-recipe: Invalid recipe JSON', error);
      return null;
    }
  }

  private handleRecipeSelect(): void {
    const recipe = this.getRecipe();
    if (!recipe) {
      return;
    }
    this.recipeSelect.emit(recipe);
  }

  private handleRemove(event: MouseEvent): void {
    event.stopPropagation();
    const recipe = this.getRecipe();
    if (!recipe) {
      return;
    }
    this.removeRecipe.emit(recipe.id);
  }

  private handleImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    const fallbackImage = this.placeholderImageSrc;
    if (fallbackImage && image.src !== fallbackImage) {
      image.src = fallbackImage;
      return;
    }
    this.imageLoadFailed = true;
  }

  render() {
    const recipe = this.getRecipe();

    if (!recipe) {
      return null;
    }

    const initialImage = recipe.recipeImage || this.placeholderImageSrc;

    return (
      <div class="recipe-main">
        <button 
          type="button" 
          class="recipe-select-button" 
          onClick={() => this.handleRecipeSelect()} 
          aria-label={`View ${recipe.recipeName}`}
        >
          <div class="recipe-image-container">
            {this.imageLoadFailed || !initialImage ? (
              <div class="recipe-image-placeholder" aria-label="Recipe image unavailable">
                <span>Recipe Image</span>
              </div>
            ) : (
              <img 
                class="recipe-image" 
                src={initialImage} 
                alt={recipe.recipeName} 
                loading="lazy" 
                onError={event => this.handleImageError(event)} 
              />
            )}
          </div>

          <div class="recipe-content">
            <h3 class="recipe-name" title={recipe.recipeName}>
              {recipe.recipeName}
            </h3>
          </div>
        </button>

        <button type="button" class="remove-button" onClick={event => this.handleRemove(event)} aria-label={`Remove ${recipe.recipeName} from meal plan`}>
          Remove
        </button>
      </div>
    );
  }
}
