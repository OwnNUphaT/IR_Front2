<template>
  <div class="min-h-screen bg-gray-800 text-white">
    <div class="container mx-auto px-4 py-16">
      <div v-if="recipe && recipe.Name" class="max-w-2xl mx-auto bg-gray-700 rounded-lg shadow-lg p-6">
        <h1 class="text-3xl font-bold text-center mb-4">{{ recipe.Name }}</h1>
        <img v-if="recipe.image_url" :src="recipe.image_url" alt="Recipe Image" class="w-full h-64 object-cover rounded-lg mb-4" />
        <p class="text-gray-300">{{ recipe.Description }}</p>

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
          <p><strong>Calories:</strong> {{ recipe.Calories }}</p>
          <p><strong>Total Time:</strong> {{ formattedTotalTime }}</p>
        </div>
        
        <button @click="goBackToSearch" class="mt-6 bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600">
          Back to Search
        </button>
      </div>

      <div v-else class="text-center">
        <p>Recipe not found. Please try again.</p>
        <button @click="goBackToSearch" class="mt-6 bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600">
          Back to Search
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecipeDetail',
  data() {
    return {
      recipe: null
    };
  },
  computed: {
    formattedIngredients() {
      return this.recipe?.RecipeIngredientParts ? this.recipe.RecipeIngredientParts.split(', ') : [];
    },
    formattedInstructions() {
      return this.recipe?.RecipeInstructions 
        ? this.recipe.RecipeInstructions.split('. ').map(step => step.trim()).filter(step => step) 
        : [];
    },
    formattedTotalTime() {
      return this.recipe?.TotalTime ? this.recipe.TotalTime.replace(/^PT/, '') : 'N/A';
    }
  },
  created() {
    // Get recipe data from sessionStorage
    const storedRecipe = sessionStorage.getItem('selectedRecipe');
    
    if (storedRecipe) {
      this.recipe = JSON.parse(storedRecipe);
    }
  },
  methods: {
    goBackToSearch() {
      // Set flag that we're coming from detail page
      sessionStorage.setItem('comeFromDetail', 'true');
      this.$router.push('/search');
    }
  }
};
</script>
