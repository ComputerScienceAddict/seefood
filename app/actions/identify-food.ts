"use server"

import { NutritionalFacts, FoodData } from "@/types/food";

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

function calculateDailyValue(value: number, reference: number): string {
  if (isNaN(value) || isNaN(reference) || reference === 0) {
    return "N/A";
  }
  const percentage = Math.round((value / reference) * 100);
  return `${percentage}%`;
}

function formatNutritionalValue(value: number | undefined, unit: string): string {
  if (value === undefined || isNaN(value)) {
    return "N/A";
  }
  return `${roundToOneDecimal(value)} ${unit}`;
}

export async function identifyFood(imageBase64: string) {
  try {
    // Validate the base64 data
    if (!imageBase64 || imageBase64 === "data:,") {
      throw new Error("Invalid image data received");
    }

    // Remove the data URL prefix if present
    const base64Data = imageBase64.includes("base64,") 
      ? imageBase64.split("base64,")[1] 
      : imageBase64;

    // Validate the base64 data length
    if (base64Data.length < 100) {
      throw new Error("Image data is too small or invalid");
    }

    const apiKey = process.env.GEMINI_API_KEY;
    console.log("API Key present:", !!apiKey);

    if (!apiKey) {
      throw new Error("Gemini API key is not configured");
    }

    console.log("Sending request to Gemini API...");
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
                  Analyze this food image and provide detailed information in JSON format:
                  1. Identify the exact food item and its origin
                  2. Estimate nutritional values per 100g serving
                  3. Provide a detailed recipe
                  4. List 3-5 visually similar foods that might be confused with this dish
                  
                  Return ONLY a valid JSON object with this structure:
                  {
                    "name": "Food Name",
                    "description": "Brief description of what the dish is and its country/region of origin",
                    "nutritionPer100g": {
                      "calories": number,
                      "protein": number,
                      "carbs": number,
                      "fat": number,
                      "saturatedFat": number,
                      "transFat": number,
                      "cholesterol": number,
                      "sodium": number,
                      "fiber": number,
                      "sugar": number
                    },
                    "recipe": {
                      "ingredients": [
                        "Ingredient with precise quantity",
                        "Another ingredient with quantity"
                      ],
                      "instructions": "Numbered steps for preparation"
                    },
                    "similarLookingFoods": [
                      {
                        "name": "Name of similar looking food",
                        "description": "Brief description of how it looks similar and key differences"
                      }
                    ]
                  }
                  
                  Keep the description focused only on what the dish is and its origin.
                  Be precise with nutritional values and measurements.
                  Provide detailed recipe instructions.
                  For similar looking foods, focus on visual similarities and key distinguishing features.
                  `,
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 1024,
          },
        }),
      },
    );

    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log("API Response:", data);

    // Extract the text from the response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("Extracted text:", text);

    if (!text) {
      throw new Error("No text response received from Gemini API");
    }

    // Extract the JSON from the response text
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/{[\s\S]*?}/);
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;
    console.log("Extracted JSON:", jsonString);

    if (!jsonString) {
      throw new Error("No valid JSON response from the API");
    }

    // Parse the JSON
    const result = JSON.parse(jsonString.replace(/```/g, "").trim());
    
    // Validate required fields
    if (!result.name || !result.description || !result.nutritionPer100g) {
      throw new Error("API response missing required fields");
    }

    // Format nutritional facts
    const nutritionalFacts: NutritionalFacts = {
      calories: `${result.nutritionPer100g.calories} kcal`,
      protein: formatNutritionalValue(result.nutritionPer100g.protein, "g"),
      carbs: formatNutritionalValue(result.nutritionPer100g.carbs, "g"),
      fat: formatNutritionalValue(result.nutritionPer100g.fat, "g"),
      saturatedFat: formatNutritionalValue(result.nutritionPer100g.saturatedFat, "g"),
      transFat: formatNutritionalValue(result.nutritionPer100g.transFat, "g"),
      cholesterol: formatNutritionalValue(result.nutritionPer100g.cholesterol, "mg"),
      sodium: formatNutritionalValue(result.nutritionPer100g.sodium, "mg"),
      fiber: formatNutritionalValue(result.nutritionPer100g.fiber, "g"),
      sugar: formatNutritionalValue(result.nutritionPer100g.sugar, "g")
    };

    // Calculate daily values
    const dailyValues = {
      calories: calculateDailyValue(result.nutritionPer100g.calories, 2000),
      protein: calculateDailyValue(result.nutritionPer100g.protein, 50),
      carbs: calculateDailyValue(result.nutritionPer100g.carbs, 275),
      fat: calculateDailyValue(result.nutritionPer100g.fat, 78),
      saturatedFat: calculateDailyValue(result.nutritionPer100g.saturatedFat, 20),
      cholesterol: calculateDailyValue(result.nutritionPer100g.cholesterol, 300),
      sodium: calculateDailyValue(result.nutritionPer100g.sodium, 2300),
      fiber: calculateDailyValue(result.nutritionPer100g.fiber, 28)
    };

    return {
      success: true,
      data: {
        name: result.name,
        description: result.description,
        nutritionalFacts,
        servingSize: "100g",
        totalQuantity: "1 serving (100g)",
        servingQuantity: 1,
        dailyValues,
        recipe: result.recipe,
        similarLookingFoods: result.similarLookingFoods || []
      }
    };
  } catch (error) {
    console.error("Error identifying food:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to identify food. Please try again with a clearer image."
    };
  }
}
