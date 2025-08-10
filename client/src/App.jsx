import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import { FiLoader } from "react-icons/fi";
import RecipeDisplay from "./RecipeDisplay";

const RecipeCard = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    ingredients: "",
    mealType: "Breakfast",
    cuisine: "",
    cookingTime: "30-60 minutes",
    complexity: "Beginner",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.ingredients.trim()) {
      alert("Please enter at least one ingredient");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="w-[400px] rounded-2xl overflow-hidden shadow-lg p-6 bg-white/80 backdrop-blur-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        🍳 Smart Recipe Generator
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          {
            label: "Ingredients",
            id: "ingredients",
            type: "text",
            placeholder: "Enter ingredients",
          },
          {
            label: "Cuisine Preference",
            id: "cuisine",
            type: "text",
            placeholder: "e.g., Italian, Mexican",
          },
        ].map((field) => (
          <div key={field.id}>
            <label
              htmlFor={field.id}
              className="block text-gray-700 font-medium mb-1"
            >
              {field.label}
            </label>
            <input
              id={field.id}
              name={field.id}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.id]}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            />
          </div>
        ))}

        {/* Meal Type */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Meal Type
          </label>
          <select
            name="mealType"
            value={formData.mealType}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          >
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Snack</option>
          </select>
        </div>

        {/* Cooking Time */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Cooking Time
          </label>
          <select
            name="cookingTime"
            value={formData.cookingTime}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          >
            <option>Less than 30 minutes</option>
            <option>30-60 minutes</option>
            <option>More than 1 hour</option>
          </select>
        </div>

        {/* Complexity */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Complexity
          </label>
          <select
            name="complexity"
            value={formData.complexity}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-lg font-semibold text-lg bg-gradient-to-r from-teal-400 to-emerald-500 text-white shadow-md hover:scale-105 transition transform disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <FiLoader className="animate-spin" /> Generating...
            </span>
          ) : (
            "Generate Recipe"
          )}
        </button>
      </form>
    </div>
  );
};

function App() {
  const [recipeText, setRecipeText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecipe = async (data) => {
    setIsLoading(true);
    setRecipeText("");

    try {
      const response = await axios.post("http://localhost:3001/recipe", data, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data?.recipe) {
        setRecipeText(response.data.recipe);
      } else {
        setRecipeText("Unexpected response format from server");
      }
    } catch (error) {
      setRecipeText("Error generating recipe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f0] via-[#fce9e4] to-[#f9f3e6] flex items-center justify-center p-6">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl w-full justify-center">
        <RecipeCard onSubmit={fetchRecipe} isLoading={isLoading} />
        <RecipeDisplay recipeText={recipeText} />
      </div>
    </div>
  );
}

export default App;
