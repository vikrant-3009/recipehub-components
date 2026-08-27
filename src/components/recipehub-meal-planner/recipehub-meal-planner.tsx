import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';
import { DayName } from '../../components';
import { MealPlanDay, MealPlanItem, RemoveMealEvent } from '../../models/recipe-meal-plan-model';

@Component({
  tag: 'recipehub-meal-planner',
  styleUrl: 'recipehub-meal-planner.css',
  shadow: true,
})
export class RecipehubMealPlanner {
  @Prop() weekLabel: string = '';

  @Prop() days: string = '[]';

  @Prop() placeholderImageSrc: string = '';

  @Event() previousWeek: EventEmitter<void>;

  @Event() nextWeek: EventEmitter<void>;

  @Event() addRecipe: EventEmitter<string>;

  @Event() recipeSelect: EventEmitter<MealPlanItem>;

  @Event() removeRecipe: EventEmitter<RemoveMealEvent>;

  private readonly dayOrder: DayName[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  private getDays(): MealPlanDay[] {
    if (!this.days) {
      return [];
    }

    try {
      const parsedDays = JSON.parse(this.days);
      if (!Array.isArray(parsedDays)) {
        console.error('recipehub-meal-planner: days must be a JSON array');
        return [];
      }
      return parsedDays as MealPlanDay[];
    } catch (err) {
      console.error('recipehub-meal-planner: Invalid days JSON', err);
      return [];
    }
  }

  private getOrderedDays(): MealPlanDay[] {
    const days = this.getDays();
    return [...days].sort((firstDay, secondDay) => this.dayOrder.indexOf(firstDay.dayName) - this.dayOrder.indexOf(secondDay.dayName));
  }

  private handlePreviousWeek(): void {
    this.previousWeek.emit();
  }

  private handleNextWeek(): void {
    this.nextWeek.emit();
  }

  private handleAddRecipe(event: CustomEvent<string>): void {
    this.addRecipe.emit(event.detail);
  }

  private handleRecipeSelect(event: CustomEvent<MealPlanItem>): void {
    this.recipeSelect.emit(event.detail);
  }

  private handleRemoveRecipe(event: CustomEvent<RemoveMealEvent>): void {
    this.removeRecipe.emit(event.detail);
  }

  render() {
    const days = this.getOrderedDays();

    return (
      <section class="meal-planner">
        <header class="planner-header">
          <button type="button" class="week-navigation-button" aria-label="Previous week" onClick={() => this.handlePreviousWeek()}>
            <svg class="navigation-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 class="week-label">{this.weekLabel || 'Weekly Meal Planner'}</h1>
          <button type="button" class="week-navigation-button" aria-label="Next week" onClick={() => this.handleNextWeek()}>
            <svg class="navigation-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </header>
        {days.length === 7 ? (
          <div class="planner-grid">
            {days.map(day => (
              <recipehub-meal-plan-day
                key={day.date}
                date={day.date}
                dayName={day.dayName}
                meals={JSON.stringify(day.meals)}
                placeholder-image-src={this.placeholderImageSrc}
                onAddRecipe={event => this.handleAddRecipe(event)}
                onRecipeSelect={event => this.handleRecipeSelect(event)}
                onRemoveRecipe={event => this.handleRemoveRecipe(event)}
              ></recipehub-meal-plan-day>
            ))}
          </div>
        ) : (
          <div class="empty-state">
            <p>Unable to display the meal plan.</p>
          </div>
        )}
      </section>
    );
  }
}
