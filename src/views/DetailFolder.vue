<template>
    <div class="min-h-screen bg-gray-800 text-white">
      <div class="container mx-auto px-4 py-16">
        <div v-if="recipe" class="max-w-2xl mx-auto bg-gray-700 rounded-lg shadow-lg p-6">
          <h1 class="text-3xl font-bold text-center mb-4">{{ recipe.name }}</h1>
          <img v-if="recipe.image_url" :src="recipe.image_url" alt="Recipe Image" class="w-full h-64 object-cover rounded-lg mb-4" />
          <p class="text-gray-300">{{ recipe.description }}</p>
  
          <div class="mt-4">
            <h2 class="text-lg font-semibold">Ingredients:</h2>
            <ul class="list-decimal list-inside text-gray-400">
              <li v-for="(ingredient, index) in formattedIngredients" :key="index">{{ ingredient }}</li>
            </ul>
          </div>
  
          <div class="mt-4">
            <h2 class="text-lg font-semibold">Instructions:</h2>
            <ol class="list-decimal list-inside text-gray-400">
              <li v-for="(step, index) in formattedInstructions" :key="index">{{ step }}</li>
            </ol>
          </div>
  
          <div class="mt-4 flex justify-between text-gray-400">
            <p><strong>Calories:</strong> {{ recipe.calories || "N/A" }}</p>
            <p><strong>Total Time:</strong> {{ formattedTotalTime }}</p>
            <p><strong>Rating:</strong> ⭐ {{ recipe.rating || "No rating" }}</p>
          </div>
  
          <div class="mt-6 flex justify-center">
            <button @click="goBackToFolder" class="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600">
              Back to Folder
            </button>
          </div>
        </div>
  
        <div v-else class="text-center">
          <p>Recipe not found. Please try again.</p>
          <button @click="goBackToFolder" class="mt-6 bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600">
            Back to Folder
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "SavedRecipeDetail",
    data() {
      return {
        recipe: null,
      };
    },
    computed: {
      formattedIngredients() {
        return this.recipe?.ingredients ? this.recipe.ingredients.split(", ") : [];
      },
      formattedInstructions() {
        return this.recipe?.instructions
          ? this.recipe.instructions.split(". ").map((step) => step.trim()).filter((step) => step)
          : [];
      },
      formattedTotalTime() {
        return this.recipe?.total_time ? this.recipe.total_time.replace(/^PT/, "") : "N/A";
      },
    },
    created() {
      const storedRecipe = sessionStorage.getItem("savedRecipe");
  
      if (storedRecipe) {
        this.recipe = JSON.parse(storedRecipe);
      }
    },
    methods: {
      goBackToFolder() {
        this.$router.push("/folder");
      },
    },
  };
  </script>
  
  <style scoped>
  button:hover {
    transition: background-color 0.3s;
  }
  </style>
  