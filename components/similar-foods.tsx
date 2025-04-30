"use client"

import { useState } from "react"
import { identifyFood } from "@/app/actions/identify-food"
import { FoodData } from "@/app/page"

interface SimilarFoodsProps {
  similarLookingFoods: Array<{
    name: string
    description: string
  }>
  onFoodSelect: (foodData: FoodData) => void
}

export function SimilarFoods({ similarLookingFoods, onFoodSelect }: SimilarFoodsProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleFoodClick = async (foodName: string) => {
    setLoading(foodName)
    try {
      // Create a mock image data since we don't have an actual image
      const mockImageData = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy0vLzY3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzb/2wBDAR0dHSAgICggICggICggICggICggICggICggICggICggICggICggICggICAgICAgICAgICAgICAgICAgICAuLzb/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="

      const result = await identifyFood(mockImageData)
      if (result.success && result.data) {
        // Update the food name in the data to match the selected similar food
        const updatedData = {
          ...result.data,
          name: foodName,
          description: `A delicious ${foodName} dish.`,
          // Provide default nutritional values
          nutritionalFacts: {
            calories: "To get accurate nutritional information, please scan the actual food item.",
            protein: "Scan the food item for protein content",
            carbs: "Scan the food item for carbohydrate content",
            fat: "Scan the food item for fat content",
            saturatedFat: "Scan the food item for saturated fat content",
            transFat: "Scan the food item for trans fat content",
            cholesterol: "Scan the food item for cholesterol content",
            sodium: "Scan the food item for sodium content",
            fiber: "Scan the food item for fiber content",
            sugar: "Scan the food item for sugar content"
          },
          dailyValues: {
            calories: "N/A",
            protein: "N/A",
            carbs: "N/A",
            fat: "N/A",
            saturatedFat: "N/A",
            cholesterol: "N/A",
            sodium: "N/A",
            fiber: "N/A"
          },
          // Provide more informative default recipe data
          recipe: {
            ingredients: [
              "To get the complete recipe for this dish, please scan the actual food item.",
              "This will provide you with detailed ingredients and measurements."
            ],
            instructions: `To get the complete recipe for ${foodName}, please scan the actual food item. This will provide you with detailed step-by-step cooking instructions and precise ingredient measurements.`
          }
        }
        onFoodSelect(updatedData)
      }
    } catch (error) {
      console.error("Error fetching food data:", error)
    } finally {
      setLoading(null)
    }
  }

  if (!similarLookingFoods || similarLookingFoods.length === 0) {
    return null
  }

  return (
    <div className="bg-white bg-opacity-95 rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Similar Looking Foods</h3>
      <div className="space-y-3">
        {similarLookingFoods.map((food, index) => (
          <button
            key={index}
            onClick={() => handleFoodClick(food.name)}
            disabled={loading === food.name}
            className={`w-full text-left p-3 rounded-xl transition-all ${
              loading === food.name
                ? 'bg-indigo-100 cursor-wait'
                : 'bg-gray-50 hover:bg-indigo-50'
            }`}
          >
            <div className="font-medium text-gray-900">{food.name}</div>
            <div className="text-sm text-gray-600">{food.description}</div>
            {loading === food.name && (
              <div className="mt-2 text-sm text-indigo-600">Loading...</div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
