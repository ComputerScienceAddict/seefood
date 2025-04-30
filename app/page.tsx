"use client"

import { useState } from "react"
import { PulsatingCircle } from "@/components/pulsating-circle"
import ImageCapture from "@/components/image-capture"
import { NutritionalFacts } from "@/components/nutritional-facts"
import { SimilarFoods } from "@/components/similar-foods"
import { identifyFood } from "./actions/identify-food"
import { Utensils, Bell, Home, BarChart2, Settings } from "lucide-react"

interface FoodData {
  name: string
  description: string
  nutritionalFacts: {
    calories: string
    protein: string
    carbs: string
    fat: string
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
  similarLookingFoods: Array<{
    name: string
    description: string
  }>
}

export default function Home() {
  const [isScanning, setIsScanning] = useState(false)
  const [foodData, setFoodData] = useState<FoodData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'nutrition' | 'recipe'>('nutrition')

  const handleImageCapture = async (base64Image: string) => {
    setPreviewImage(base64Image)
    setIsScanning(true)
    setError(null)

    try {
      const result = await identifyFood(base64Image)
      console.log("Identification result:", result)

      if (result.success && result.data) {
        setFoodData(result.data)
      } else {
        setError(result.error || "Failed to identify food. Please try again with a clearer image.")
      }
    } catch (err) {
      console.error("Error in handleImageCapture:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsScanning(false)
    }
  }

  const resetApp = () => {
    setFoodData(null)
    setPreviewImage(null)
    setError(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-full backdrop-blur-lg">
            <Utensils className="h-5 w-5 text-white" />
            <h1 className="text-xl font-medium text-white">FoodLens</h1>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-md mx-auto">
          {!foodData ? (
            <div className="flex flex-col items-center w-full">
              {/* Main scan button */}
              <div className="relative mb-8 w-full">
                <div
                  className={`w-full aspect-square rounded-3xl flex items-center justify-center ${
                    isScanning ? 'bg-white bg-opacity-20' : 'bg-white bg-opacity-10'
                  } transition-colors duration-300 backdrop-blur-lg`}
                  style={{
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {previewImage ? (
                    <div className="w-4/5 h-4/5 rounded-2xl overflow-hidden">
                      <img
                        src={previewImage || "/placeholder.svg"}
                        alt="Food preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="text-white text-center p-4">
                      <Utensils className="h-16 w-16 mx-auto mb-4" />
                      <p className="font-medium text-xl">Upload or Take Photo</p>
                      <p className="text-base opacity-80">Identify your food</p>
                    </div>
                  )}
                </div>
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full aspect-square rounded-3xl border-2 border-white animate-pulse" />
                  </div>
                )}
              </div>

              {/* Camera and upload buttons */}
              <div className="w-full grid grid-cols-2 gap-4">
                <div className="w-full">
                  <ImageCapture onImageCapture={handleImageCapture} isScanning={isScanning} />
                </div>
                <div className="w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          handleImageCapture(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                    id="upload-input"
                  />
                  <label
                    htmlFor="upload-input"
                    className="w-full flex items-center justify-center gap-2 px-4 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.99] cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span className="text-lg font-medium">Upload Photo</span>
                  </label>
                </div>
              </div>

              {/* Status text */}
              {isScanning && (
                <div className="text-center mt-8 animate-pulse">
                  <p className="text-lg font-medium text-white">Analyzing your food...</p>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="text-center mt-8">
                  <p className="text-red-200">{error}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              {/* Result header */}
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
                  <img 
                    src={previewImage || ""} 
                    alt={foodData.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900">{foodData.name}</h2>
                  <p className="text-gray-600">{foodData.description}</p>
                </div>
              </div>

              {/* Tab buttons */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setActiveTab('nutrition')}
                  className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                    activeTab === 'nutrition'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Nutrition Facts
                </button>
                <button
                  onClick={() => setActiveTab('recipe')}
                  className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                    activeTab === 'recipe'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Recipe
                </button>
              </div>

              {/* Content based on active tab */}
              {activeTab === 'nutrition' ? (
                <div className="bg-indigo-600 bg-opacity-10 rounded-2xl p-6">
                  <NutritionalFacts 
                    nutritionalFacts={foodData.nutritionalFacts}
                    servingSize={foodData.servingSize}
                    totalQuantity={foodData.totalQuantity}
                    servingQuantity={foodData.servingQuantity}
                    dailyValues={foodData.dailyValues}
                  />
                </div>
              ) : (
                <div className="bg-indigo-600 bg-opacity-10 rounded-2xl p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-gray-900">Ingredients:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {foodData.recipe?.ingredients.map((ingredient, index) => (
                          <li key={index} className="text-gray-700">{ingredient}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-gray-900">Instructions:</h4>
                      <p className="text-gray-700 whitespace-pre-line">{foodData.recipe?.instructions}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Reset button */}
              <button
                onClick={resetApp}
                className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md"
              >
                Scan Another Food
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
