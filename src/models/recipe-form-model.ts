export interface RecipeFormData {
  id?: string;
  name: string;
  category: string;
  area: string;
  description: string;
  image: string;
  ingredients: RecipeIngredient[];
  instructions: string;
  youtubeUrl?: string;
}

export interface RecipeIngredient {
  name: string;
  measure: string;
}

export interface RecipeFormErrors {
  name?: string;
  category?: string;
  ingredients?: string;
  instructions?: string;
  youtubeUrl?: string;
}
