<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="container mx-auto px-4 py-16">
      <div class="max-w-3xl mx-auto text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">Find Your Perfect Recipe</h1>
        <p class="text-lg text-gray-600">Search by ingredients, dish name, or cooking method</p>
      </div>
      
      <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
            <input 
              v-model="searchQuery" 
              @keyup.enter="performSearch"
              type="text" 
              placeholder="Search recipes..." 
              class="w-full px-4 py-3 text-gray-700 focus:outline-none"
            />
            <button 
              @click="performSearch" 
              class="bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition duration-200"
            >
              Search
            </button>
          </div>
        </div>
        
        <div v-if="searchResults.length > 0" class="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-lg font-semibold mb-4">Search Results</h2>
          <div v-for="(recipe, index) in searchResults" :key="index" class="mb-4 border-b pb-4">
            <h3 class="text-xl font-semibold">{{ recipe.Name }}</h3>
            <p class="text-gray-600">{{ recipe.Description }}</p>
            <img v-if="recipe.image_link" :src="recipe.image_link" alt="Recipe Image" class="w-full h-48 object-cover rounded-lg mt-2" />
            <p class="text-sm text-gray-500">Calories: {{ recipe.Calories }}</p>
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
      recentSearches: [],
      searchResults: []
    };
  },
  created() {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      this.recentSearches = JSON.parse(savedSearches);
    }
  },
  methods: {
    async performSearch() {
      if (!this.searchQuery.trim()) return;

      if (!this.recentSearches.includes(this.searchQuery)) {
        this.recentSearches.unshift(this.searchQuery);
        this.recentSearches = this.recentSearches.slice(0, 5);
        localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
      }
      
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
    },
    useRecentSearch(search) {
      this.searchQuery = search;
      this.performSearch();
    }
  }
};
</script>
