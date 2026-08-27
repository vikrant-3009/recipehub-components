import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';
import { DayName, MealPlanItem, RemoveMealEvent } from '../../models/recipe-meal-plan-model';

@Component({
  tag: 'recipehub-meal-plan-day',
  styleUrl: 'recipehub-meal-plan-day.css',
  shadow: true,
})
export class RecipehubMealPlanDay {
  @Prop() date: string = '';

  @Prop() dayName: DayName = 'Sunday';

  @Prop() meals: string = '[]';

  @Prop() placeholderImageSrc: string = '';

  @Event() addRecipe: EventEmitter<string>;

  @Event() recipeSelect: EventEmitter<MealPlanItem>;

  @Event() removeRecipe: EventEmitter<RemoveMealEvent>;

  private getMeals(): MealPlanItem[] {
    if (!this.meals) {
      return [];
    }

    try {
      const parsedMeals = JSON.parse(this.meals);
      if (!Array.isArray(parsedMeals)) {
        console.error('recipehub-meal-plan-day: meals must be a JSON array');
        return [];
      }
      return parsedMeals as MealPlanItem[];
    } catch (err) {
      console.error('recipehub-meal-plan-day: Invalid meals JSON', err);
      return [];
    }
  }

  private formatDate(): string {
    if (!this.date) {
      return '';
    }
    const parsedDate = new Date(`${this.date}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) {
      return this.date;
    }
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(parsedDate);
  }

  private handleAddRecipe(): void {
    this.addRecipe.emit(this.date);
  }

  private handleRemoveRecipe(event: CustomEvent<string>): void {
    this.removeRecipe.emit({
      date: this.date,
      mealId: event.detail,
    });
  }

  private handleRecipeSelect(event: CustomEvent<MealPlanItem>): void {
    this.recipeSelect.emit(event.detail);
  }

  render() {
    const meals = this.getMeals();

    return (
      <article class="meal-plan-day">
        <header class="day-header">
          <div class="day-info">
            <h2 class="day-name">{this.dayName}</h2>
            {this.date && <span class="day-date">{this.formatDate()}</span>}
          </div>
        </header>
        <div class="day-content">
          {meals.length > 0 ? (
            <div class="planned-meals">
              {meals.map(meal => (
                <recipehub-planned-recipe
                  key={meal.id}
                  recipe={JSON.stringify(meal)}
                  placeholderImageSrc={this.placeholderImageSrc}
                  onRecipeSelect={event => this.handleRecipeSelect(event)}
                  onRemoveRecipe={event => this.handleRemoveRecipe(event)}
                ></recipehub-planned-recipe>
              ))}
            </div>
          ) : (
            <div class="empty-day">
              <span>No meals planned</span>
            </div>
          )}

          <button type="button" class="add-recipe-button" onClick={() => this.handleAddRecipe()}>
            <svg class="add-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Add Recipe</span>
          </button>
        </div>
      </article>
    );
  }
}
