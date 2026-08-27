import { Component, Event, EventEmitter, Prop, State, h } from '@stencil/core';
import { RecipeCardData } from '../../models/recipe-card-model';

@Component({
  tag: 'recipehub-recipe-card',
  styleUrl: 'recipehub-recipe-card.css',
  shadow: true,
})
export class RecipehubRecipeCard {
  @Prop() recipe: string = '';

  @Prop() placeholderImageSrc = '';

  @Prop() showFavorite: boolean = false;

  @Prop() isFavorite: boolean = false;

  @Prop() showEdit: boolean = false;

  @Prop() showDelete: boolean = false;

  @State() imageLoadFailed: boolean = false;

  @Event() recipeSelect: EventEmitter<string>;

  @Event() favoriteClick: EventEmitter<string>;

  @Event() editClick: EventEmitter<string>;

  @Event() deleteClick: EventEmitter<string>;

  private getRecipe(): RecipeCardData | null {
    if (!this.recipe) {
      return null;
    }
    try {
      const parsedRecipe = JSON.parse(this.recipe);
      if (!parsedRecipe || typeof parsedRecipe !== 'object') {
        console.error('recipehub-recipe-card: recipe must be a JSON object');
        return null;
      }
      return parsedRecipe as RecipeCardData;
    } catch (error) {
      console.error('recipehub-recipe-card: Invalid recipe JSON', error);
      return null;
    }
  }

  private handleRecipeSelect(): void {
    const recipe = this.getRecipe();
    if (!recipe) {
      return;
    }
    this.recipeSelect.emit(recipe.id);
  }

  private handleFavoriteClick(event: MouseEvent): void {
    event.stopPropagation();
    const recipe = this.getRecipe();
    if (!recipe) {
      return;
    }
    this.favoriteClick.emit(recipe.id);
  }

  private handleEditClick(event: MouseEvent): void {
    event.stopPropagation();
    const recipe = this.getRecipe();
    if (!recipe) {
      return;
    }
    this.editClick.emit(recipe.id);
  }

  private handleDeleteClick(event: MouseEvent): void {
    event.stopPropagation();
    const recipe = this.getRecipe();
    if (!recipe) {
      return;
    }
    this.deleteClick.emit(recipe.id);
  }

  private handleImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    const fallbackImage = this.placeholderImageSrc;
    if (image.src.endsWith(fallbackImage)) {
      this.imageLoadFailed = true;
      return;
    }
    if (fallbackImage) {
      image.src = fallbackImage;
      return;
    }
    this.imageLoadFailed = true;
  }

  render() {
    const recipe = this.getRecipe();

    if (!recipe) {
      return (
        <article class="recipe-card">
          <div class="empty-card">
            <p>Recipe unavailable.</p>
          </div>
        </article>
      );
    }

    const initialImage = recipe.image || this.placeholderImageSrc;
    const isPlaceholderImage = !recipe.image;

    return (
      <article class="recipe-card">
        <div class="recipe-main">
          <button type="button" class="recipe-image-button" onClick={() => this.handleRecipeSelect()} aria-label={`View ${recipe.name}`}>
            <div class="image-container">
              {this.imageLoadFailed ? (
                <div class="image-placeholder" aria-label="Recipe image unavailable">
                  <span>Recipe Image</span>
                </div>
              ) : (
                <img 
                  src={initialImage} 
                  alt={recipe.name}
                  class={{
                    'recipe-image': true,
                    'placeholder-image': isPlaceholderImage,
                  }}
                  loading="lazy" 
                  onError={event => this.handleImageError(event)} 
                />
              )}
            </div>
          </button>

          <div class="recipe-content">
            <div class="title-row">
              <button type="button" class="recipe-name-button" onClick={() => this.handleRecipeSelect()}>
                <h2 class="recipe-name">{recipe.name}</h2>
              </button>

              {this.showFavorite && (
                <button
                  type="button"
                  class={{
                    'favorite-button': true,
                    'favorite-selected': this.isFavorite,
                  }}
                  aria-label={this.isFavorite ? `Remove ${recipe.name} from favorites` : `Add ${recipe.name} to favorites`}
                  aria-pressed={this.isFavorite ? 'true' : 'false'}
                  onClick={event => this.handleFavoriteClick(event)}
                >
                  <span aria-hidden="true">{this.isFavorite ? '♥' : '♡'}</span>
                </button>
              )}
            </div>

            {(recipe.category || recipe.area) && (
              <div class="recipe-meta">
                {recipe.category && <span class="meta-item">{recipe.category}</span>}
                {recipe.category && recipe.area && (
                  <span class="meta-separator" aria-hidden="true">
                    •
                  </span>
                )}
                {recipe.area && <span class="meta-item">{recipe.area}</span>}
              </div>
            )}

            {recipe.description && <p class="recipe-description">{recipe.description}</p>}
          </div>
        </div>

        {(this.showEdit || this.showDelete) && (
          <div class="card-actions">
            {this.showDelete && (
              <button type="button" class="card-action delete-action" onClick={event => this.handleDeleteClick(event)}>
                Delete
              </button>
            )}

            {this.showEdit && (
              <button type="button" class="card-action edit-action" onClick={event => this.handleEditClick(event)}>
                Edit
              </button>
            )}
          </div>
        )}
      </article>
    );
  }
}
