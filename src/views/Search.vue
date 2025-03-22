<template>
  <div class="min-h-screen bg-gray-800 text-white">
    <div class="container mx-auto px-4 py-16">
      <div class="max-w-3xl mx-auto text-center mb-12">
        <h1 class="text-4xl font-bold mb-4">Find Your Perfect Recipe</h1>
      </div>

      <div class="max-w-2xl mx-auto">
        <div class="bg-gray-700 rounded-lg shadow-lg p-6">
          <div class="flex items-center border-2 border-gray-500 rounded-lg overflow-hidden">
            <input 
              v-model="searchQuery" 
              @keyup.enter="performSearch"
              type="text" 
              placeholder="Search recipes..." 
              class="w-full px-4 py-3 text-gray-200 bg-gray-800 focus:outline-none"
            />
            <button 
              @click="performSearch" 
              class="bg-blue-500 text-white px-6 py-3 hover:bg-blue-600 transition duration-200"
            >
              Search
            </button>
          </div>
        </div>
        <!-- Suggested Correction -->
        <div 
          v-if="suggestedQuery && suggestedQuery !== searchQuery"
          class="mt-6 flex justify-center"
        >
          <div class="bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg shadow-lg">
            <p class="text-lg font-semibold">
              Did you mean 
              <span 
                @click="useSuggestedQuery" 
                class="cursor-pointer underline hover:text-gray-800 transition duration-200"
              >
                {{ suggestedQuery }}
              </span>?
            </p>
          </div>
        </div>

        <div v-if="searchResults.length > 0" class="mt-8">
          <h2 class="text-lg font-semibold mb-4 text-center">Search Results</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div 
              v-for="(recipe, index) in searchResults" 
              :key="index" 
              class="bg-gray-700 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:bg-gray-600 transition duration-200"
              @click="viewRecipeDetailAndTrack(recipe)"
            >
              <img v-if="recipe.image_url" :src="recipe.image_url" alt="Recipe Image" class="w-full h-48 object-cover" />
              <div class="p-4">
                <h3 class="text-xl font-semibold">{{ recipe.Name }}</h3>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="searchQuery && !searchResults.length" class="text-center text-gray-400 mt-6">
          <p>No results found for "{{ searchQuery }}"</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SearchPage',
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      suggestedQuery: null, // Stores suggested word
      comeFromDetail: false
    };
  },
  created() {
    // Check if we're coming from the detail page
    this.comeFromDetail = sessionStorage.getItem('comeFromDetail') === 'true';

    // Restore previous search query and results
    if (this.comeFromDetail) {
      const storedQuery = sessionStorage.getItem('lastSearchQuery');
      const storedResults = sessionStorage.getItem('lastSearchResults');

      if (storedQuery) {
        this.searchQuery = storedQuery;
      }

      if (storedResults) {
        this.searchResults = JSON.parse(storedResults);
      }

      // Reset the flag
      sessionStorage.removeItem('comeFromDetail');
    } else {
      // Clear previous search data
      sessionStorage.removeItem('lastSearchQuery');
      sessionStorage.removeItem('lastSearchResults');
      this.searchQuery = '';
      this.searchResults = [];
    }
  },
  methods: {
    async performSearch() {
      if (!this.searchQuery.trim()) return;

      try {
        const response = await axios.get(`http://127.0.0.1:5000/search`, {
          params: { query: this.searchQuery }
        });

        if (response.data.status === 'success') {
          this.searchResults = response.data.results;

          // If there's a suggested correction, show it
          if (response.data.corrected_query) {
            this.suggestedQuery = response.data.corrected_query;
          } else {
            this.suggestedQuery = null;
          }

          // Save search query and results to sessionStorage
          sessionStorage.setItem('lastSearchQuery', this.searchQuery);
          sessionStorage.setItem('lastSearchResults', JSON.stringify(this.searchResults));
        } else {
          console.error('Search error:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    },

    useSuggestedQuery() {
      this.searchQuery = this.suggestedQuery;
      this.suggestedQuery = null;
      this.performSearch();
    },

    async viewRecipeDetailAndTrack(recipe) {
      try {
        await axios.post('http://127.0.0.1:5000/track_view', { recipe });
      } catch (error) {
        console.error('Track view error:', error);
      }
      sessionStorage.setItem('selectedRecipe', JSON.stringify(recipe));
      this.$router.push({ name: 'RecipeDetail', params: { id: recipe.RecipeId } });
    }
  }
};
</script>

<style scoped>
button:hover {
  transition: background-color 0.3s;
}
</style>
