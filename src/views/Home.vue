<template>
    <div class="min-h-screen bg-gray-800 text-white">
      <div class="container mx-auto px-4 py-16">
        <div class="max-w-3xl mx-auto text-center mb-12">
          <h1 class="text-4xl font-bold mb-4">Recommended Recipes For You</h1>
          <p class="text-gray-400">Based on your saved recipes</p>
        </div>
  
        <!-- Personalized Recommendations Section -->
        <div v-if="personalized.length > 0" class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">Personalized Recommendations</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div v-for="(recipe, index) in personalized" :key="index"
                 class="bg-gray-700 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:bg-gray-600 transition duration-200"
                 @click="viewRecipeDetail(recipe)">
              <img v-if="recipe.image_url" :src="recipe.image_url" alt="Recipe Image" class="w-full h-48 object-cover" />
              <div class="p-4">
                <h3 class="text-xl font-semibold">{{ recipe.Name }}</h3>
                <p class="text-gray-400 text-sm mt-2">Calories: {{ recipe.Calories || 'N/A' }}</p>
                <p class="text-gray-400 text-sm mt-1">Time: {{ recipe.TotalTime || 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Folder selection for Suggestions -->
        <div class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Generate Suggestions From Folder</h2>
          <div class="flex items-center space-x-4">
            <select v-model="selectedFolder" class="bg-gray-900 text-white px-4 py-2 rounded">
              <option disabled value="">Select a folder</option>
              <option v-for="folder in folders" :key="folder.id" :value="folder.id">
                {{ folder.name }}
              </option>
            </select>
            <button @click="generateSuggestions" class="bg-green-500 px-6 py-3 rounded-lg hover:bg-green-600">
              Generate Suggestions
            </button>
          </div>
        </div>
  
        <!-- Suggestion List Section -->
        <div v-if="suggestions.length > 0">
          <h2 class="text-2xl font-semibold mb-4">Suggestions for You</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div v-for="(recipe, index) in suggestions" :key="index"
                 class="bg-gray-700 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:bg-gray-600 transition duration-200"
                 @click="viewRecipeDetail(recipe)">
              <img v-if="recipe.image_url" :src="recipe.image_url" alt="Recipe Image" class="w-full h-48 object-cover" />
              <div class="p-4">
                <h3 class="text-xl font-semibold">{{ recipe.Name }}</h3>
                <p class="text-gray-400 text-sm mt-2">Calories: {{ recipe.Calories || 'N/A' }}</p>
                <p class="text-gray-400 text-sm mt-1">Time: {{ recipe.TotalTime || 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Error or Empty Message -->
        <div v-if="errorMessage" class="text-center text-red-400 mt-12">
          <p>{{ errorMessage }}</p>
        </div>
  
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'RecommendationView',
    data() {
      return {
        personalized: [],
        suggestions: [],
        folders: [],
        selectedFolder: '',
        username: '',
        errorMessage: ''
      };
    },
    async created() {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.username = JSON.parse(userData).username;
        await this.fetchPersonalized();
        await this.fetchFolders();
      } else {
        alert('Please login to get recommendations.');
        this.$router.push('/login');
      }
    },
    methods: {
      async fetchPersonalized() {
        try {
          const response = await axios.post('http://127.0.0.1:5000/personalized_recommendation', {
            username: this.username
          });
          if (response.data.status === 'success') {
            this.personalized = response.data.recommendations;
          } else {
            this.errorMessage = response.data.message;
          }
        } catch (error) {
          console.error('Personalized fetch error:', error);
          this.errorMessage = 'Failed to fetch personalized recommendations.';
        }
      },
  
      async fetchFolders() {
        try {
          const response = await axios.post('http://127.0.0.1:5000/folders', {
            username: this.username
          });
          if (response.data.status === 'success') {
            this.folders = response.data.folders;
          }
        } catch (error) {
          console.error('Folder fetch error:', error);
        }
      },
  
      async generateSuggestions() {
        if (!this.selectedFolder) {
          alert('Please select a folder first.');
          return;
        }
        try {
          const response = await axios.post('http://127.0.0.1:5000/generate_suggestions', {
            username: this.username,
            folder_id: this.selectedFolder
          });
          if (response.data.status === 'success') {
            this.suggestions = response.data.suggestions;
          } else {
            this.errorMessage = response.data.message;
          }
        } catch (error) {
          console.error('Suggestions fetch error:', error);
          this.errorMessage = 'Failed to fetch suggestions.';
        }
      },
  
      viewRecipeDetail(recipe) {
        sessionStorage.setItem('selectedRecipe', JSON.stringify(recipe));
        this.$router.push({ name: 'RecipeDetail', params: { id: recipe.RecipeId } });
      },
  
      goBack() {
        this.$router.push('/');
      }
    }
  };
  </script>
  
  <style scoped>
  button:hover {
    transition: background-color 0.3s;
  }
  </style>
  