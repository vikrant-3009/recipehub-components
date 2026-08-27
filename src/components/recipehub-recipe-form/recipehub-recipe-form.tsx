import { Component, Event, EventEmitter, Prop, State, h } from '@stencil/core';
import { RecipeFormData, RecipeFormErrors, RecipeIngredient } from '../../models/recipe-form-model';

@Component({
  tag: 'recipehub-recipe-form',
  styleUrl: 'recipehub-recipe-form.css',
  shadow: true,
})
export class RecipehubRecipeForm {
  @Prop() mode: 'create' | 'edit' = 'create';

  @Prop() recipe: string = '';

  @State() formData: RecipeFormData = {
    name: '',
    category: '',
    area: '',
    description: '',
    image: '',
    ingredients: [
      {
        name: '',
        measure: '',
      },
    ],
    instructions: '',
    youtubeUrl: '',
  };

  @State() errors: RecipeFormErrors = {};

  @Event() recipeSubmit: EventEmitter<RecipeFormData>;

  @Event() cancel: EventEmitter<void>;

  componentWillLoad(): void {
    this.loadRecipe();
  }

  /**
   * Load recipe data when the form is used in edit mode.
   *
   * @returns void
   */
  private loadRecipe(): void {
    if (this.mode !== 'edit' || !this.recipe) {
      return;
    }
    try {
      const parsedRecipe: Partial<RecipeFormData> = JSON.parse(this.recipe);
      this.formData = {
        id: parsedRecipe.id,
        name: parsedRecipe.name || '',
        category: parsedRecipe.category || '',
        area: parsedRecipe.area || '',
        description: parsedRecipe.description || '',
        image: parsedRecipe.image || '',
        ingredients:
          Array.isArray(parsedRecipe.ingredients) && parsedRecipe.ingredients.length > 0
            ? parsedRecipe.ingredients.map((ingredient: RecipeIngredient) => ({
                name: ingredient.name || '',
                measure: ingredient.measure || '',
              }))
            : [
                {
                  name: '',
                  measure: '',
                },
              ],
        instructions: parsedRecipe.instructions || '',
        youtubeUrl: parsedRecipe.youtubeUrl || '',
      };
    } catch (error) {
      console.error('recipehub-recipe-form: Invalid recipe JSON', error);
    }
  }

  /**
   * Common handler for normal form fields.
   */
  private handleInputChange(event: Event, field: keyof RecipeFormData): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.formData = {
      ...this.formData,
      [field]: target.value,
    };
    if (field in this.errors) {
      this.clearError(field as keyof RecipeFormErrors);
    }
  }

  /**
   * Handler for ingredient fields.
   */
  private handleIngredientChange(event: Event, index: number, field: keyof RecipeIngredient): void {
    const target = event.target as HTMLInputElement;
    const ingredients = [...this.formData.ingredients];
    ingredients[index] = {
      ...ingredients[index],
      [field]: target.value,
    };
    this.formData = {
      ...this.formData,
      ingredients,
    };
    this.clearError('ingredients');
  }

  /**
   * Add a new ingredient row.
   */
  private addIngredient(): void {
    this.formData = {
      ...this.formData,
      ingredients: [
        ...this.formData.ingredients,
        {
          name: '',
          measure: '',
        },
      ],
    };
  }

  /**
   * Remove an ingredient row.
   */
  private removeIngredient(index: number): void {
    if (this.formData.ingredients.length === 1) {
      return;
    }

    this.formData = {
      ...this.formData,
      ingredients: this.formData.ingredients.filter((_, ingredientIndex) => ingredientIndex !== index),
    };
  }

  /**
   * Validate YouTube URL.
   */
  private isValidYoutubeUrl(value: string): boolean {
    try {
      const url = new URL(value);
      return url.hostname === 'youtube.com' || url.hostname === 'www.youtube.com' || url.hostname === 'youtu.be' || url.hostname === 'www.youtu.be';
    } catch {
      return false;
    }
  }

  /**
   * Clear validation error for a field.
   */
  private clearError(field: keyof RecipeFormErrors): void {
    if (!this.errors[field]) {
      return;
    }
    const updatedErrors = {
      ...this.errors,
    };
    delete updatedErrors[field];
    this.errors = updatedErrors;
  }

  /**
   * Validate the complete form.
   */
  private validate(): boolean {
    const validationErrors: RecipeFormErrors = {};

    if (!this.formData.name.trim()) {
      validationErrors.name = 'Recipe name is required.';
    }

    if (!this.formData.category.trim()) {
      validationErrors.category = 'Category is required.';
    }

    const validIngredients = this.formData.ingredients.filter(ingredient => ingredient.name.trim() || ingredient.measure.trim());

    if (validIngredients.length === 0) {
      validationErrors.ingredients = 'Add at least one ingredient.';
    } else if (validIngredients.some(ingredient => !ingredient.name.trim() || !ingredient.measure.trim())) {
      validationErrors.ingredients = 'Complete each ingredient before submitting.';
    }

    if (!this.formData.instructions.trim()) {
      validationErrors.instructions = 'Instructions are required.';
    }

    if (this.formData.youtubeUrl?.trim() && !this.isValidYoutubeUrl(this.formData.youtubeUrl.trim())) {
      validationErrors.youtubeUrl = 'Enter a valid YouTube URL.';
    }

    this.errors = validationErrors;
    return Object.keys(validationErrors).length === 0;
  }

  /**
   * Submit the recipe.
   */
  private handleSubmit(event: Event): void {
    event.preventDefault();
    if (!this.validate()) {
      return;
    }
    const validIngredients = this.formData.ingredients.filter(ingredient => ingredient.name.trim() && ingredient.measure.trim());
    const submittedRecipe: RecipeFormData = {
      ...this.formData,
      name: this.formData.name.trim(),
      category: this.formData.category.trim(),
      area: this.formData.area.trim(),
      description: this.formData.description.trim(),
      image: this.formData.image.trim(),
      ingredients: validIngredients.map(ingredient => ({
        name: ingredient.name.trim(),
        measure: ingredient.measure.trim(),
      })),
      instructions: this.formData.instructions.trim(),
      youtubeUrl: this.formData.youtubeUrl?.trim(),
    };
    this.recipeSubmit.emit(submittedRecipe);
  }

  /**
   * Cancel the form.
   */
  private handleCancel(): void {
    this.cancel.emit();
  }

  render() {
    const isEditMode = this.mode === 'edit';

    return (
      <section class="recipe-form-section">
        <div class="form-container">
          <div class="form-header">
            <h1 class="form-title">{isEditMode ? 'Edit Recipe' : 'Add Recipe'}</h1>
            <p class="form-subtitle">{isEditMode ? 'Update your recipe details.' : 'Create your own recipe and save it to RecipeHub.'}</p>
          </div>

          <form class="recipe-form" onSubmit={event => this.handleSubmit(event)}>
            {/* Basic Information */}
            <section class="form-section">
              <h2 class="section-title">Basic Information</h2>
              <div class="form-grid">
                {/* Recipe Name */}
                <div class="form-field full-width">
                  <label htmlFor="recipe-name">
                    Recipe Name
                    <span class="required">*</span>
                  </label>
                  <input
                    id="recipe-name"
                    type="text"
                    value={this.formData.name}
                    placeholder="e.g. Special Paneer Tikka"
                    onInput={event => this.handleInputChange(event, 'name')}
                    aria-invalid={this.errors.name ? 'true' : 'false'}
                  />
                  {this.errors.name && <span class="error-message">{this.errors.name}</span>}
                </div>

                {/* Category */}
                <div class="form-field">
                  <label htmlFor="recipe-category">
                    Category
                    <span class="required">*</span>
                  </label>
                  <input
                    id="recipe-category"
                    type="text"
                    value={this.formData.category}
                    placeholder="e.g. Paneer"
                    onInput={event => this.handleInputChange(event, 'category')}
                    aria-invalid={this.errors.category ? 'true' : 'false'}
                  />
                  {this.errors.category && <span class="error-message">{this.errors.category}</span>}
                </div>

                {/* Cuisine */}
                <div class="form-field">
                  <label htmlFor="recipe-area">Cuisine</label>
                  <input id="recipe-area" type="text" value={this.formData.area} placeholder="e.g. Indian" onInput={event => this.handleInputChange(event, 'area')} />
                </div>

                {/* Description */}
                <div class="form-field full-width">
                  <label htmlFor="recipe-description">Description</label>
                  <textarea
                    id="recipe-description"
                    rows={3}
                    value={this.formData.description}
                    placeholder="Tell us a little about your recipe..."
                    onInput={event => this.handleInputChange(event, 'description')}
                  ></textarea>
                </div>

                {/* Image URL */}
                <div class="form-field full-width">
                  <label htmlFor="recipe-image">Image URL</label>
                  <input
                    id="recipe-image"
                    type="url"
                    value={this.formData.image}
                    placeholder="https://example.com/recipe.jpg"
                    onInput={event => this.handleInputChange(event, 'image')}
                  />
                </div>
              </div>
            </section>

            {/* Ingredients */}
            <section class="form-section">
              <div class="section-heading-row">
                <div>
                  <h2 class="section-title">
                    Ingredients
                    <span class="required">*</span>
                  </h2>
                  <p class="section-description">Add the ingredients and their quantities.</p>
                </div>
                <button type="button" class="add-button" onClick={() => this.addIngredient()}>
                  + Add Ingredient
                </button>
              </div>

              <div class="ingredients-form">
                {this.formData.ingredients.map((ingredient, index) => (
                  <div class="ingredient-row" key={index}>
                    {/* Ingredient Name */}
                    <div class="form-field">
                      <label htmlFor={`ingredient-name-${index}`}>Ingredient</label>
                      <input
                        id={`ingredient-name-${index}`}
                        type="text"
                        value={ingredient.name}
                        placeholder="e.g. Paneer"
                        onInput={event => this.handleIngredientChange(event, index, 'name')}
                      />
                    </div>

                    {/* Ingredient Measure */}
                    <div class="form-field">
                      <label htmlFor={`ingredient-measure-${index}`}>Quantity</label>
                      <input
                        id={`ingredient-measure-${index}`}
                        type="text"
                        value={ingredient.measure}
                        placeholder="e.g. 500g"
                        onInput={event => this.handleIngredientChange(event, index, 'measure')}
                      />
                    </div>

                    {/* Remove Ingredient */}
                    <button
                      type="button"
                      class="remove-button"
                      aria-label={`Remove ingredient ${index + 1}`}
                      disabled={this.formData.ingredients.length === 1}
                      onClick={() => this.removeIngredient(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              {this.errors.ingredients && <span class="error-message">{this.errors.ingredients}</span>}
            </section>

            {/* Instructions */}
            <section class="form-section">
              <h2 class="section-title">
                Instructions
                <span class="required">*</span>
              </h2>
              <div class="form-field">
                <textarea
                  id="recipe-instructions"
                  rows={10}
                  value={this.formData.instructions}
                  placeholder="Describe the steps needed to prepare your recipe..."
                  onInput={event => this.handleInputChange(event, 'instructions')}
                  aria-invalid={this.errors.instructions ? 'true' : 'false'}
                ></textarea>
                {this.errors.instructions && <span class="error-message">{this.errors.instructions}</span>}
              </div>
            </section>

            {/* YouTube Video */}
            <section class="form-section">
              <h2 class="section-title">Recipe Video</h2>
              <div class="form-field">
                <label htmlFor="recipe-youtube">YouTube URL</label>
                <input
                  id="recipe-youtube"
                  type="url"
                  value={this.formData.youtubeUrl}
                  placeholder="https://www.youtube.com/watch?v=..."
                  onInput={event => this.handleInputChange(event, 'youtubeUrl')}
                  aria-invalid={this.errors.youtubeUrl ? 'true' : 'false'}
                />
                {this.errors.youtubeUrl && <span class="error-message">{this.errors.youtubeUrl}</span>}
              </div>
            </section>

            {/* Actions */}
            <div class="form-actions">
              <button type="button" class="cancel-button" onClick={() => this.handleCancel()}>
                Cancel
              </button>
              <button type="submit" class="submit-button">
                {isEditMode ? 'Save Changes' : 'Create Recipe'}
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }
}
