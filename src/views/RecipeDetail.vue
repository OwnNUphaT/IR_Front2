<template>
  <div class="min-h-screen bg-gray-800 text-white">
    <div class="container mx-auto px-4 py-16">
      <div v-if="recipe && recipe.Name" class="max-w-2xl mx-auto bg-gray-700 rounded-lg shadow-lg p-6">
        <h1 class="text-3xl font-bold text-center mb-4">{{ recipe.Name }}</h1>
        <img 
          v-if="recipe.image_url" 
          :src="recipe.image_url" 
          alt="Recipe Image" 
          class="w-full h-64 object-cover rounded-lg mb-4" 
        />
        <p class="text-gray-300">{{ recipe.Description }}</p>

        <!-- Ingredients Section -->
        <div class="mt-4">
          <h2 class="text-lg font-semibold">Ingredients:</h2>
          <ul class="list-decimal list-inside text-gray-400">
            <li v-for="(ingredient, index) in formattedIngredients" :key="index">
              {{ ingredient }}
            </li>
          </ul>
        </div>

        <!-- Instructions Section -->
        <div class="mt-4">
          <h2 class="text-lg font-semibold">Instructions:</h2>
          <ol class="list-decimal list-inside text-gray-400">
            <li v-for="(step, index) in formattedInstructions" :key="index">
              {{ step }}
            </li>
          </ol>
        </div>

        <!-- Recipe Details -->
        <div class="mt-4 flex justify-between text-gray-400">
          <p><strong>Calories:</strong> {{ recipe.Calories }}</p>
          <p><strong>Total Time:</strong> {{ formattedTotalTime }}</p>
        </div>

        <!-- Save to Folder & Rate -->
        <div v-if="isLoggedIn" class="mt-6">
          <h2 class="text-lg font-semibold mb-2">Save to Folder & Rate</h2>

          <div class="flex items-center space-x-3">
            <!-- Folder Selection -->
            <select 
              v-model="selectedFolder" 
              class="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-500"
            >
              <option disabled value="">Select a folder</option>
              <option v-for="folder in folders" :key="folder.id" :value="folder.id">
                {{ folder.name }}
              </option>
            </select>

            <!-- Rating Selection -->
            <select 
              v-model="selectedRating" 
              class="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-500"
            >
              <option disabled value="">Rate (1-5)</option>
              <option v-for="n in 5" :key="n" :value="n">{{ n }} ⭐</option>
            </select>

            <button 
              @click="saveRecipe" 
              class="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Save & Rate
            </button>
          </div>
        </div>

        <!-- Show login prompt if not logged in -->
        <div v-else class="mt-6 text-center">
          <p class="text-red-500">You must be logged in to save recipes.</p>
          <button 
            @click="redirectToLogin" 
            class="mt-2 bg-yellow-500 px-4 py-2 rounded-lg hover:bg-yellow-600"
          >
            Go to Login
          </button>
        </div>

        <!-- Back to Search -->
        <div class="mt-6">
          <button 
            @click="goBackToSearch" 
            class="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Search
          </button>
        </div>

      </div>

      <div v-else class="text-center">
        <p>Recipe not found. Please try again.</p>
        <button 
          @click="goBackToSearch" 
          class="mt-6 bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Back to Search
        </button>
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
      selectedRating: "",
      folders: [],
      username: null,
      isLoggedIn: false
    };
  },
  computed: {
    formattedIngredients() {
      return this.recipe?.RecipeIngredientParts 
        ? this.recipe.RecipeIngredientParts.split(', ') 
        : [];
    },
    formattedInstructions() {
      return this.recipe?.RecipeInstructions 
        ? this.recipe.RecipeInstructions.split('. ')
          .map(step => step.trim())
          .filter(step => step) 
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
      await this.fetchFolders();
    }
  },
  methods: {
    redirectToLogin() {
      this.$router.push('/login');
    },
    goBackToSearch() {
      sessionStorage.setItem('comeFromDetail', 'true');
      this.$router.push('/search');
    },
    async fetchFolders() {
      if (!this.username) return;

      try {
        const response = await axios.post('http://127.0.0.1:5000/folders', {
          username: this.username
        });

        if (response.data.status === 'success') {
          this.folders = response.data.folders;
        } else {
          console.error("Error fetching folders:", response.data.message);
        }
      } catch (error) {
        console.error('Error fetching folders:', error);
      }
    },
    async saveRecipe() {
      if (!this.selectedFolder) {
        alert('Please select a folder.');
        return;
      }
      if (!this.selectedRating) {
        alert('Please provide a rating.');
        return;
      }

      try {
        const response = await axios.post('http://127.0.0.1:5000/save_recipe', {
          username: this.username,
          folder_id: this.selectedFolder,
          recipe: this.recipe,
          rating: this.selectedRating
        });

        if (response.data.status === 'success') {
          alert('Recipe saved with rating!');
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
  transition: background-color 0.3s;
}
</style>
