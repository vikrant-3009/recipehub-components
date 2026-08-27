import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';
import { DayName } from '../../components';
import { RecipeCardData } from '../../models/recipe-card-model';

@Component({
  tag: 'recipehub-recipe-picker',
  styleUrl: 'recipehub-recipe-picker.css',
  shadow: true,
})
export class RecipehubRecipePicker {
  @Prop() open: boolean = false;

  @Prop() dayName: DayName = 'Sunday';

  @Prop() recipes: string = '[]';

  @Prop() isLoading: boolean = false;

  @Prop() searchValue: string = '';

  @Prop() placeholderImageSrc: string = '';

  @Event() search: EventEmitter<string>;

  @Event() recipeSelect: EventEmitter<RecipeCardData>;

  @Event() close: EventEmitter<void>;

  private getRecipes(): RecipeCardData[] {
    if (!this.recipes) {
      return [];
    }
    try {
      const parsedRecipes = JSON.parse(this.recipes);
      if (!Array.isArray(parsedRecipes)) {
        console.error('recipehub-recipe-picker: recipes must be a JSON array');
        return [];
      }
      return parsedRecipes as RecipeCardData[];
    } catch (err) {
      console.error('recipehub-recipe-picker: Invalid recipes JSON', err);
      return [];
    }
  }

  private handleSearch(event: Event): void {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const searchValue = String(formData.get('search') ?? '').trim();
    if (!searchValue) {
      return;
    }
    this.search.emit(searchValue);
  }

  private handleRecipeSelect(recipe: RecipeCardData): void {
    this.recipeSelect.emit(recipe);
  }

  private handleClose(): void {
    this.close.emit();
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.handleClose();
    }
  }

  private handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.value.trim()) {
      this.search.emit('');
    }
  }

  render() {
    if (!this.open) {
      return null;
    }

    const recipes = this.getRecipes();

    return (
      <div class="picker-backdrop" role="presentation" onKeyDown={event => this.handleKeyDown(event)}>
        <section class="picker-dialog" role="dialog" aria-modal="true" aria-labelledby="picker-title">
          <header class="picker-header">
            <div>
              <h2 id="picker-title">Add Recipe to {this.dayName}</h2>
              <p>Search and select a recipe to add to your meal plan.</p>
            </div>
            <button type="button" class="close-button" aria-label="Close recipe picker" onClick={() => this.handleClose()}>
              ×
            </button>
          </header>
          <form class="search-form" onSubmit={event => this.handleSearch(event)}>
            <div class="search-input-container">
              <svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" />
              </svg>
              <input 
                type="search" 
                name="search" 
                class="search-input" 
                value={this.searchValue} 
                placeholder="Search recipes..." 
                autocomplete="off" 
                aria-label="Search recipes" 
                onInput={event => this.handleInput(event)}
              />
              <button type="submit" class="search-button">
                Search
              </button>
            </div>
          </form>

          <div class="results-container">
            {this.isLoading ? (
              <div class="state">
                <p>Searching recipes...</p>
              </div>
            ) : recipes.length > 0 ? (
              <div class="recipe-list">
                {recipes.map(recipe => (
                  <article class="recipe-result" key={recipe.id}>
                    <div class="recipe-image-container">
                      {recipe.image ? <img src={recipe.image} alt={recipe.name} class="recipe-image" loading="lazy" /> : <div class="image-placeholder">Recipe Image</div>}
                    </div>
                    <div class="recipe-info">
                      <h3>{recipe.name}</h3>
                      {(recipe.category || recipe.area) && (
                        <p>
                          {recipe.category}
                          {recipe.category && recipe.area && ' • '}
                          {recipe.area}
                        </p>
                      )}
                    </div>
                    <button type="button" class="select-button" onClick={() => this.handleRecipeSelect(recipe)}>
                      Add
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div class="state">
                <p>Search for a recipe to add to your meal plan.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }
}
