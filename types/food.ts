export interface NutritionalFacts {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  saturatedFat: string;
  transFat: string;
  cholesterol: string;
  sodium: string;
  fiber: string;
  sugar: string;
}

export interface DailyValues {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  saturatedFat: string;
  cholesterol: string;
  sodium: string;
  fiber: string;
}

export interface Recipe {
  ingredients: string[];
  instructions: string;
}

export interface SimilarFood {
  name: string;
  description: string;
}

export interface FoodData {
  name: string;
  description: string;
  nutritionalFacts: NutritionalFacts;
  servingSize: string;
  totalQuantity: string;
  servingQuantity: number;
  dailyValues: DailyValues;
  recipe?: Recipe;
  similarFoods: SimilarFood[];
} 