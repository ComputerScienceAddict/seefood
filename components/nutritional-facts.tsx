interface NutritionalFactsProps {
  nutritionalFacts?: {
    calories?: string
    protein?: string
    carbs?: string
    fat?: string
    saturatedFat?: string
    transFat?: string
    cholesterol?: string
    sodium?: string
    fiber?: string
    sugar?: string
  }
  servingSize?: string
  totalQuantity?: string
  servingQuantity?: number
  dailyValues?: {
    calories?: string
    protein?: string
    carbs?: string
    fat?: string
    saturatedFat?: string
    cholesterol?: string
    sodium?: string
    fiber?: string
  }
  recipe?: {
    ingredients: string[]
    instructions: string
  }
}

export function NutritionalFacts({ nutritionalFacts, servingSize, totalQuantity, servingQuantity, dailyValues, recipe }: NutritionalFactsProps) {
  if (!nutritionalFacts) {
    return (
      <div className="bg-white bg-opacity-10 rounded-2xl p-6 shadow-lg backdrop-blur-lg">
        <p className="text-white text-center">Nutritional information not available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Nutritional Facts */}
      <div className="bg-white bg-opacity-95 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold mb-3 text-gray-900">Nutritional Facts</h3>
        
        {/* Portion Information */}
        <div className="mb-4 space-y-1">
          {servingSize && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Serving Size:</span> {servingSize}
            </p>
          )}
          {totalQuantity && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Total Quantity:</span> {totalQuantity}
            </p>
          )}
          {servingQuantity && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Servings per Container:</span> {Math.round(100 / servingQuantity)}
            </p>
          )}
        </div>
        
        <div className="border-t border-gray-200 pt-2">
          {/* Calories */}
          {nutritionalFacts.calories && (
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium text-gray-900">Calories:</span>
              </div>
              <div className="text-sm text-right text-gray-700">
                <span>{nutritionalFacts.calories}</span>
                {dailyValues?.calories && (
                  <span className="text-gray-500 ml-2">({dailyValues.calories} DV)</span>
                )}
              </div>
            </div>
          )}

          {/* Macronutrients */}
          <div className="mt-4">
            <h4 className="text-sm font-bold text-gray-900 mb-2">Macronutrients</h4>
            <div className="space-y-2">
              {nutritionalFacts.protein && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-gray-900">Protein:</span>
                  </div>
                  <div className="text-sm text-right text-gray-700">
                    <span>{nutritionalFacts.protein}</span>
                    {dailyValues?.protein && (
                      <span className="text-gray-500 ml-2">({dailyValues.protein} DV)</span>
                    )}
                  </div>
                </div>
              )}
              {nutritionalFacts.carbs && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm font-medium text-gray-900">Carbohydrates:</span>
                  </div>
                  <div className="text-sm text-right text-gray-700">
                    <span>{nutritionalFacts.carbs}</span>
                    {dailyValues?.carbs && (
                      <span className="text-gray-500 ml-2">({dailyValues.carbs} DV)</span>
                    )}
                  </div>
                </div>
              )}
              {nutritionalFacts.fat && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-gray-900">Total Fat:</span>
                  </div>
                  <div className="text-sm text-right text-gray-700">
                    <span>{nutritionalFacts.fat}</span>
                    {dailyValues?.fat && (
                      <span className="text-gray-500 ml-2">({dailyValues.fat} DV)</span>
                    )}
                  </div>
                </div>
              )}
              {nutritionalFacts.saturatedFat && (
                <div className="grid grid-cols-2 gap-2 pl-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">Saturated Fat:</span>
                  </div>
                  <div className="text-sm text-right text-gray-700">
                    <span>{nutritionalFacts.saturatedFat}</span>
                    {dailyValues?.saturatedFat && (
                      <span className="text-gray-500 ml-2">({dailyValues.saturatedFat} DV)</span>
                    )}
                  </div>
                </div>
              )}
              {nutritionalFacts.transFat && (
                <div className="grid grid-cols-2 gap-2 pl-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">Trans Fat:</span>
                  </div>
                  <div className="text-sm text-right text-gray-700">{nutritionalFacts.transFat}</div>
                </div>
              )}
            </div>
          </div>

          {/* Micronutrients */}
          <div className="mt-4">
            <h4 className="text-sm font-bold text-gray-900 mb-2">Micronutrients</h4>
            <div className="space-y-2">
              {nutritionalFacts.cholesterol && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">Cholesterol:</span>
                  </div>
                  <div className="text-sm text-right text-gray-700">
                    <span>{nutritionalFacts.cholesterol}</span>
                    {dailyValues?.cholesterol && (
                      <span className="text-gray-500 ml-2">({dailyValues.cholesterol} DV)</span>
                    )}
                  </div>
                </div>
              )}
              {nutritionalFacts.sodium && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">Sodium:</span>
                  </div>
                  <div className="text-sm text-right text-gray-700">
                    <span>{nutritionalFacts.sodium}</span>
                    {dailyValues?.sodium && (
                      <span className="text-gray-500 ml-2">({dailyValues.sodium} DV)</span>
                    )}
                  </div>
                </div>
              )}
              {nutritionalFacts.fiber && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">Fiber:</span>
                  </div>
                  <div className="text-sm text-right text-gray-700">
                    <span>{nutritionalFacts.fiber}</span>
                    {dailyValues?.fiber && (
                      <span className="text-gray-500 ml-2">({dailyValues.fiber} DV)</span>
                    )}
                  </div>
                </div>
              )}
              {nutritionalFacts.sugar && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">Sugars:</span>
                  </div>
                  <div className="text-sm text-right text-gray-700">{nutritionalFacts.sugar}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recipe */}
      {recipe && (
        <div className="bg-white bg-opacity-95 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold mb-3 text-gray-900">Recipe Information</h3>
          {recipe.ingredients.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-bold text-gray-900 mb-2">Ingredients</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}
          {recipe.instructions && (
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">Instructions</h4>
              <p className="text-sm text-gray-700">{recipe.instructions}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
