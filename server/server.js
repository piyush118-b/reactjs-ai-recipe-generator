require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const API_KEY = process.env.OPENROUTER_API_KEY;

// --- Health Check ---
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// --- Test OpenRouter ---
app.get("/test-openrouter", async (req, res) => {
  if (!API_KEY) {
    return res.status(400).json({ error: "OPENROUTER_API_KEY is missing in .env" });
  }
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await response.json();
    res.json({ success: true, data });
  } catch (error) {
    console.error("OpenRouter test failed:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- Recipe Generation ---
app.post("/recipe", async (req, res) => {
  try {
    const { ingredients, mealType, cuisine, cookingTime, complexity } = req.body;

    if (!ingredients?.trim()) {
      return res.status(400).json({ error: "Ingredients are required" });
    }
    if (!mealType?.trim()) {
      return res.status(400).json({ error: "Meal type is required" });
    }

    const prompt = [
      "Generate a recipe based on the following details:",
      `Ingredients: ${ingredients}`,
      `Meal Type: ${mealType}`,
      cuisine ? `Cuisine: ${cuisine}` : "",
      cookingTime ? `Cooking Time: ${cookingTime}` : "",
      complexity ? `Complexity: ${complexity}` : "",
      "Please provide a detailed recipe with ingredients and step-by-step instructions.",
      "Include preparation time, cooking time, and serving size at the top.",
      "Format the response with clear sections for ingredients and instructions."
    ].filter(Boolean).join("\n");

    console.log("Sending request to OpenRouter...");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        "Referer": "http://localhost:3000", // Correct header name
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // fallback model
        messages: [
          { role: "system", content: "You are a helpful cooking assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter API error:", data);
      return res.status(response.status).json({
        error: "Recipe generation failed",
        details: data
      });
    }

    if (!data.choices?.[0]?.message?.content) {
      return res.status(500).json({ error: "Unexpected API response format" });
    }

    res.json({
      recipe: data.choices[0].message.content,
      metadata: { model: data.model, usage: data.usage }
    });

  } catch (error) {
    console.error("Error in /recipe endpoint:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
