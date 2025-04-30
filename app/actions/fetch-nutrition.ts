"use server"

interface OpenFoodFactsResponse {
  product: {
    product_name: string
    product_name_en: string
    generic_name: string
    ingredients_text: string
    nutriments: {
      energy_100g: number
      proteins_100g: number
      carbohydrates_100g: number
      fat_100g: number
      "saturated-fat_100g": number
      "trans-fat_100g": number
      cholesterol_100g: number
      sodium_100g: number
      fiber_100g: number
      sugars_100g: number
    }
    serving_size: string
    serving_quantity: number
    quantity: string
  }
}

export async function fetchNutritionData(foodName: string) {
  try {
    // First, search for the product
    const searchResponse = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
        foodName
      )}&search_simple=1&action=process&json=1&page_size=1`
    );

    if (!searchResponse.ok) {
      throw new Error("Failed to search for food product");
    }

    const searchData = await searchResponse.json();
    const productCode = searchData.products[0]?.code;

    if (!productCode) {
      throw new Error("No matching product found");
    }

    // Then, fetch detailed product information
    const productResponse = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${productCode}.json`
    );

    if (!productResponse.ok) {
      throw new Error("Failed to fetch product details");
    }

    const productData: OpenFoodFactsResponse = await productResponse.json();

    // Calculate daily values based on a 2000 calorie diet
    const calculateDailyValue = (value: number, dailyValue: number) => {
      return Math.round((value / dailyValue) * 100);
    };

    const nutriments = productData.product.nutriments;
    const servingSize = productData.product.serving_size || "100g";
    const servingQuantity = productData.product.serving_quantity || 100;
    const totalQuantity = productData.product.quantity || "100g";

    // Calculate calories per serving (more precise conversion from kJ to kcal)
    const caloriesPerServing = Math.round((nutriments.energy_100g / 4.184) * (servingQuantity / 100));
    const caloriesPer100g = Math.round(nutriments.energy_100g / 4.184);

    // Calculate macronutrients per serving with more precision
    const calculateNutrient = (value: number, unit: string = 'g') => {
      const perServing = value * (servingQuantity / 100);
      return `${perServing.toFixed(1)} ${unit}`;
    };

    // Calculate sodium with proper unit conversion
    const calculateSodium = (value: number) => {
      const perServing = value * 1000 * (servingQuantity / 100);
      return `${perServing.toFixed(1)} mg`;
    };

    // Format ingredients list
    const formatIngredients = (ingredients: string) => {
      if (!ingredients) return [];
      return ingredients
        .split(',')
        .map(ingredient => ingredient.trim())
        .filter(ingredient => ingredient.length > 0);
    };

    // Generate recipe instructions based on food type
    const generateInstructions = (foodName: string, genericName: string) => {
      if (genericName) {
        return `This is a ${genericName.toLowerCase()}. Follow standard preparation methods for this type of food.`;
      }
      return `Standard preparation instructions for ${foodName.toLowerCase()}.`;
    };

    return {
      name: productData.product.product_name_en || productData.product.product_name,
      description: productData.product.generic_name || "",
      servingSize,
      totalQuantity,
      servingQuantity,
      recipe: {
        ingredients: formatIngredients(productData.product.ingredients_text),
        instructions: generateInstructions(
          productData.product.product_name_en || productData.product.product_name,
          productData.product.generic_name
        )
      },
      nutritionalFacts: {
        calories: `${caloriesPerServing} kcal (${caloriesPer100g} kcal per 100g)`,
        protein: calculateNutrient(nutriments.proteins_100g),
        carbs: calculateNutrient(nutriments.carbohydrates_100g),
        fat: calculateNutrient(nutriments.fat_100g),
        saturatedFat: calculateNutrient(nutriments["saturated-fat_100g"]),
        transFat: calculateNutrient(nutriments["trans-fat_100g"]),
        cholesterol: calculateNutrient(nutriments.cholesterol_100g, 'mg'),
        sodium: calculateSodium(nutriments.sodium_100g),
        fiber: calculateNutrient(nutriments.fiber_100g),
        sugar: calculateNutrient(nutriments.sugars_100g),
      },
      dailyValues: {
        calories: `${calculateDailyValue(caloriesPerServing, 2000)}%`,
        protein: `${calculateDailyValue(nutriments.proteins_100g * (servingQuantity / 100), 50)}%`,
        carbs: `${calculateDailyValue(nutriments.carbohydrates_100g * (servingQuantity / 100), 275)}%`,
        fat: `${calculateDailyValue(nutriments.fat_100g * (servingQuantity / 100), 78)}%`,
        saturatedFat: `${calculateDailyValue(nutriments["saturated-fat_100g"] * (servingQuantity / 100), 20)}%`,
        cholesterol: `${calculateDailyValue(nutriments.cholesterol_100g * (servingQuantity / 100), 300)}%`,
        sodium: `${calculateDailyValue(nutriments.sodium_100g * 1000 * (servingQuantity / 100), 2300)}%`,
        fiber: `${calculateDailyValue(nutriments.fiber_100g * (servingQuantity / 100), 28)}%`,
      },
    };
  } catch (error) {
    console.error("Error fetching nutrition data:", error);
    throw new Error("Failed to fetch nutritional information");
  }
} 