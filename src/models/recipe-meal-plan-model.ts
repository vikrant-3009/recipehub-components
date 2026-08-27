export type RecipeSource = 'mealdb' | 'my-recipes';

export type DayName =
	'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface MealPlanItem {
	id: string;
	recipeId: string;
	recipeName: string;
	recipeImage?: string;
	source: RecipeSource;
}

export interface MealPlanDay {
	date: string;
	dayName: DayName;
	meals: MealPlanItem[];
}

export interface RemoveMealEvent {
	date: string;
	mealId: string;
}
