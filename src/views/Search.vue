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
        
        <div v-if="searchResults.length > 0" class="mt-8">
          <h2 class="text-lg font-semibold mb-4 text-center">Search Results</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div v-for="(recipe, index) in searchResults" :key="index" class="bg-gray-700 rounded-lg shadow-lg overflow-hidden">
              <img v-if="recipe.image_url" :src="recipe.image_url" alt="Recipe Image" class="w-full h-48 object-cover" />
              <div class="p-4">
                <h3 class="text-xl font-semibold">{{ recipe.Name }}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from '../components/Navbar.vue';

export default {
  name: 'SearchPage',
  components: { Navbar },
  data() {
    return {
      searchQuery: '',
      searchResults: []
    };
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
        } else {
          console.error('Search error:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    }
  }
};
</script>
