import { RecipeIngredient } from "./recipe-form-model";

export interface RecipeDetails {
  id: string;
  name: string;
  category: string;
  area: string;
  instructions: string;
  image: string;
  ingredients: RecipeIngredient[];
  youtubeUrl?: string;
  tags?: string[];
  sourceUrl?: string;
}
