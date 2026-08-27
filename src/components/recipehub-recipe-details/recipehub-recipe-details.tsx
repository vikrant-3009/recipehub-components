import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';
import { RecipeDetails } from '../../models/recipe-details';

@Component({
  tag: 'recipehub-recipe-details',
  styleUrl: 'recipehub-recipe-details.css',
  shadow: true,
})
export class RecipehubRecipeDetails {
  @Prop() recipe: string = '';

  @Prop() showFavorite: boolean = true;

  @Prop() isFavorite: boolean = false;

  @Prop() showAddToMealPlan: boolean = true;

  @Event() favoriteClick: EventEmitter<string>;

  @Event() addToMealPlan: EventEmitter<string>;

  @Event() categoryClick: EventEmitter<string>;

  @Event() cuisineClick: EventEmitter<string>;

  private getRecipe(): RecipeDetails | null {
    if (!this.recipe) {
      return null;
    }
    try {
      const parsedRecipe = JSON.parse(this.recipe);
      if (!parsedRecipe || typeof parsedRecipe !== 'object') {
        console.error('recipehub-recipe-details: recipe must be a JSON object');
        return null;
      }
      return parsedRecipe as RecipeDetails;
    } catch (error) {
      console.error('recipehub-recipe-details: Invalid recipe JSON', error);
      return null;
    }
  }

  private handleFavorite(): void {
    const recipe = this.getRecipe();
    if (!recipe) {
      return;
    }
    this.favoriteClick.emit(recipe.id);
  }

  private handleAddToMealPlan(): void {
    const recipe = this.getRecipe();
    if (!recipe) {
      return;
    }
    this.addToMealPlan.emit(recipe.id);
  }

  private handleCategoryClick(): void {
    const recipe = this.getRecipe();
    if (!recipe?.category) {
      return;
    }
    this.categoryClick.emit(recipe.category);
  }

  private handleCuisineClick(): void {
    const recipe = this.getRecipe();
    if (!recipe?.area) {
      return;
    }
    this.categoryClick.emit(recipe.area);
  }

  private getInstructionSteps(instructions: string): string[] {
    return instructions
      .split(/\r?\n/)
      .map(step => step.trim())
      .filter(Boolean);
  }

  render() {
    const recipe = this.getRecipe();

    if (!recipe) {
      return (
        <div class="empty-state">
          <p>Recipe details are not available.</p>
        </div>
      );
    }
    const instructionSteps = this.getInstructionSteps(recipe.instructions);

    return (
      <article class="recipe-details">
        <div class="recipe-container">
          <button type="button" class="back-button" onClick={() => window.history.back()}>
            <svg class="back-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span>Back to recipes</span>
          </button>

          <section class="recipe-header">
            <div class="recipe-image-wrapper">
              <img src={recipe.image} alt={recipe.name} class="recipe-image" />
            </div>

            <div class="recipe-summary">
              <h1 class="recipe-title">{recipe.name}</h1>

              <div class="recipe-meta">
                {recipe.category && (
                  <button type="button" class="meta-item" onClick={() => this.handleCategoryClick()}>
                    {recipe.category}
                  </button>
                )}

                {recipe.area && (
                  <button type="button" class="meta-item" onClick={() => this.handleCuisineClick()}>
                    {recipe.area}
                  </button>
                )}
              </div>

              <div class="recipe-actions">
                {this.showFavorite && (
                  <button 
                    type="button" 
                    // class="action-button primary" 
                    class={{
                      'action-button': true,
                      'favorite-button': true,
                      'favorite-selected': this.isFavorite,
                    }}
                    onClick={() => this.handleFavorite()} 
                    aria-pressed={this.isFavorite ? 'true' : 'false'}
                  >
                    {/* <span class="favorites-icon">♡</span> */}
                    <span class="heart-icon" aria-hidden="true">
                      {this.isFavorite ? '♥' : '♡'}
                    </span>
                    <span>{this.isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
                  </button>
                )}

                {this.showAddToMealPlan && (
                  <button 
                    type="button" 
                    // class="action-button secondary" 
                    class="action-button meal-plan-button"
                    onClick={() => this.handleAddToMealPlan()}
                  >
                    <span class="plus-icon" aria-hidden="true">+</span>
                    <span>Add to Meal Plan</span>
                  </button>
                )}
              </div>
            </div>
          </section>

          <section class="ingredients-section">
            <h2 class="section-title">Ingredients</h2>

            <div class="ingredients-list">
              {recipe.ingredients.map(ingredient => (
                <div class="ingredient">
                  <span class="ingredient-name">{ingredient.name}</span>
                  <span class="ingredient-measure">{ingredient.measure}</span>
                </div>
              ))}
            </div>
          </section>

          <section class="instructions-section">
            <h2 class="section-title">Instructions</h2>

            <div class="instructions-list">
              {instructionSteps.map((step, index) => (
                <div class="instruction-step">
                  <span class="step-number">{index + 1}</span>
                  <p class="step-text">{step}</p>
                </div>
              ))}
            </div>
          </section>

          {recipe.youtubeUrl && (
            <section class="video-section">
              <a class="video-button" href={recipe.youtubeUrl} target="_blank" rel="noopener noreferrer">
                <span class="video-icon">▶</span>
                <span>Watch Recipe Video</span>
              </a>
            </section>
          )}
        </div>
      </article>
    );
  }
}
