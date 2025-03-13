<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <div class="container mx-auto px-4 py-12">
      <div v-if="recipe && recipe.Name" class="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 class="text-4xl font-bold text-center mb-4">{{ recipe.Name }}</h1>
        
        <!-- Recipe Image -->
        <img v-if="recipe.image_url" :src="recipe.image_url" alt="Recipe Image" class="w-full h-64 object-cover rounded-lg mb-6" />

        <!-- Recipe Description -->
        <p class="text-gray-300 text-lg text-center mb-6">{{ recipe.Description }}</p>

        <!-- Ingredients -->
        <div class="mb-6">
          <h2 class="text-2xl font-semibold border-b border-gray-600 pb-2">Ingredients</h2>
          <ul class="list-disc list-inside mt-3 text-gray-300">
            <li v-for="(ingredient, index) in formattedIngredients" :key="index">{{ ingredient }}</li>
          </ul>
        </div>

        <!-- Instructions -->
        <div class="mb-6">
          <h2 class="text-2xl font-semibold border-b border-gray-600 pb-2">Instructions</h2>
          <ol class="list-decimal list-inside mt-3 text-gray-300">
            <li v-for="(step, index) in formattedInstructions" :key="index">{{ step }}</li>
          </ol>
        </div>

        <!-- Extra Info -->
        <div class="flex justify-between text-gray-400 bg-gray-700 p-4 rounded-lg">
          <p><strong>Calories:</strong> {{ recipe.Calories || "N/A" }}</p>
          <p><strong>Total Time:</strong> {{ formattedTotalTime }}</p>
        </div>

        <!-- Save to Folder Section -->
        <div v-if="isLoggedIn" class="mt-6">
          <h2 class="text-lg font-semibold mb-2">Save to Folder</h2>
          <select v-model="selectedFolder" class="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-500">
            <option disabled value="">Select a folder</option>
            <option v-for="folder in folders" :key="folder.id" :value="folder.id">
              {{ folder.name }}
            </option>
          </select>
          <button @click="saveToFolder" class="ml-4 bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600">
            Save Recipe
          </button>
        </div>

        <!-- Show login prompt if not logged in -->
        <div v-else class="mt-6 text-center">
          <p class="text-red-500">You must be logged in to save recipes.</p>
          <button @click="redirectToLogin" class="mt-2 bg-yellow-500 px-4 py-2 rounded-lg hover:bg-yellow-600">
            Go to Login
          </button>
        </div>

        <!-- Back Button -->
        <div class="mt-6">
          <button @click="goBackToSearch" class="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600">
            Back to Search
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RecipeDetail',
  data() {
    return {
      recipe: null,
      selectedFolder: "",
      folders: [],
      username: null,
      isLoggedIn: false
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
  async created() {
    const storedRecipe = sessionStorage.getItem('selectedRecipe');
    if (storedRecipe) {
      this.recipe = JSON.parse(storedRecipe);
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      this.username = JSON.parse(userData).username;
      this.isLoggedIn = true;
      await this.fetchFolders();  // Fetch folders after user is set
    }
  },
  methods: {
    goBackToSearch() {
      sessionStorage.setItem('comeFromDetail', 'true');
      this.$router.push('/search');
    },
    redirectToLogin() {
      this.$router.push('/login');
    },
    async fetchFolders() {
      if (!this.username) return;

      try {
        const response = await axios.post('http://127.0.0.1:5000/folders', {
          username: this.username  // Send username in request
        });

        if (response.data.status === 'success') {
          this.folders = response.data.folders;
          console.log("Fetched folders:", this.folders); // Debugging
        } else {
          console.error("Error fetching folders:", response.data.message);
        }
      } catch (error) {
        console.error('Error fetching folders:', error);
      }
    },
    async saveToFolder() {
      if (!this.selectedFolder) {
        alert('Please select a folder first.');
        return;
      }

      try {
        const response = await axios.post('http://127.0.0.1:5000/save_recipe', {
          username: this.username,
          folder_id: this.selectedFolder,
          recipe: this.recipe
        });

        if (response.data.status === 'success') {
          alert('Recipe saved successfully!');
        } else {
          alert('Error: ' + response.data.message);
        }
      } catch (error) {
        console.error('Error saving recipe:', error);
        alert('Failed to save recipe.');
      }
    }
  }
};
</script>

<style scoped>
button:hover {
  transition: background-color 0.3s ease-in-out;
}
</style>
