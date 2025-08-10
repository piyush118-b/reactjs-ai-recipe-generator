import React from "react";
import { FaClock, FaUserFriends, FaUtensils, FaDownload } from "react-icons/fa";

export default function RecipeDisplay({ recipeText }) {
  if (!recipeText) {
    return (
      <div className="w-[400px] h-[565px] flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg text-gray-500 text-center">
        Your AI recipe will appear here 🍽️
      </div>
    );
  }

  const lines = recipeText.split("\n").filter(Boolean);

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([recipeText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    const recipeName = lines[0]?.replace(/\*\*/g, "").replace("Recipe: ", "").trim() || 'recipe';
    element.download = `${recipeName}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-[400px] h-[565px] overflow-y-auto rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg p-6 text-gray-800 relative">
      {recipeText && (
        <button
          onClick={handleDownload}
          className="absolute top-4 right-4 bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-500 hover:to-emerald-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-opacity-50"
          title="Download Recipe"
          aria-label="Download Recipe"
        >
          <FaDownload className="w-5 h-5" />
        </button>
      )}
      {lines.map((line, idx) => {
        if (line.startsWith("**Recipe:")) {
          return (
            <h2
              key={idx}
              className="text-2xl font-extrabold mb-4 text-teal-600"
            >
              {line.replace(/\*\*/g, "").replace("Recipe: ", "")}
            </h2>
          );
        }
        if (line.startsWith("**Preparation Time:**")) {
          return (
            <p key={idx} className="flex items-center gap-2">
              <FaClock className="text-teal-400" />{" "}
              {line.replace(/\*\*/g, "").replace("Preparation Time: ", "")}
            </p>
          );
        }
        if (line.startsWith("**Cooking Time:**")) {
          return (
            <p key={idx} className="flex items-center gap-2">
              <FaUtensils className="text-emerald-400" />{" "}
              {line.replace(/\*\*/g, "").replace("Cooking Time: ", "")}
            </p>
          );
        }
        if (line.startsWith("**Serving Size:**")) {
          return (
            <p key={idx} className="flex items-center gap-2 mb-4">
              <FaUserFriends className="text-orange-400" />{" "}
              {line.replace(/\*\*/g, "").replace("Serving Size: ", "")}
            </p>
          );
        }
        if (line.startsWith("**Ingredients:**")) {
          return (
            <h3
              key={idx}
              className="text-lg font-bold text-teal-500 mt-4 mb-2"
            >
              Ingredients
            </h3>
          );
        }
        if (line.startsWith("-")) {
          return (
            <li key={idx} className="ml-4 list-disc text-gray-700">
              {line.replace("-", "").trim()}
            </li>
          );
        }
        if (line.startsWith("**Instructions:**")) {
          return (
            <h3
              key={idx}
              className="text-lg font-bold text-emerald-500 mt-4 mb-2"
            >
              Instructions
            </h3>
          );
        }
        return <p key={idx} className="mb-1">{line.replace(/\*\*/g, "")}</p>;
      })}
    </div>
  );
}
