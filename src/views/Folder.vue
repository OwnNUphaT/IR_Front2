<template>
    <div class="min-h-screen bg-gray-800 text-white">
      <div class="container mx-auto px-4 py-16">
        <h1 class="text-4xl font-bold text-center mb-6">Your Recipe Folders</h1>
  
        <div v-if="folders.length > 0">
          <div v-for="(folder, index) in folders" :key="folder.id" class="bg-gray-700 p-4 rounded-lg shadow-lg mb-4">
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-semibold cursor-pointer" @click="toggleFolder(folder.id)">
                {{ folder.name }}
              </h2>
  
              <button 
                @click="deleteFolder(folder.id)" 
                class="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Delete Folder
              </button>
            </div>
  
            <div v-if="expandedFolders.includes(folder.id)" class="mt-4">
              <h3 class="text-lg font-semibold mb-2">Saved Recipes (Sorted by Rating)</h3>
  
              <div v-if="folder.recipes.length > 0">
                <div v-for="(recipe, index) in folder.recipes" :key="recipe.recipe_id"
                  class="flex items-center justify-between bg-gray-700 p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-600"
                  @click="viewRecipeDetail(recipe)"
                >
                  <div class="flex items-center">
                    <img 
                      v-if="recipe.image_url" 
                      :src="recipe.image_url" 
                      alt="Recipe Image" 
                      class="w-16 h-16 rounded-lg mr-4"
                    />
                    <div>
                      <h4 class="text-lg font-semibold">{{ recipe.name }}</h4>
                      <p class="text-gray-400">Rating: ⭐ {{ recipe.rating }}</p>
                    </div>
                  </div>
  
                  <button 
                    @click.stop="removeRecipe(folder.id, recipe.recipe_id)"
                    class="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
  
              <p v-else class="text-gray-400 mt-2">No recipes saved in this folder.</p>
            </div>
          </div>
        </div>
  
        <div v-else class="text-center text-gray-400">
          <p>You have no folders yet.</p>
        </div>
  
        <div class="mt-6 text-center">
          <h3 class="text-lg font-semibold mb-2">Create New Folder</h3>
          <input 
            v-model="newFolderName" 
            type="text" 
            class="bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-500"
            placeholder="Folder Name"
          />
          <button 
            @click="createFolder" 
            class="ml-4 bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'FolderView',
    data() {
      return {
        folders: [],
        newFolderName: '',
        username: '',
        expandedFolders: []
      };
    },
    async created() {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.username = JSON.parse(userData).username;
        await this.fetchFolders();
      }
    },
    methods: {
      async fetchFolders() {
        if (!this.username) return;
  
        try {
          const response = await axios.post('http://127.0.0.1:5000/folders', { username: this.username });
  
          if (response.data.status === 'success') {
            this.folders = response.data.folders;
  
            // Fetch saved recipes for each folder
            for (let folder of this.folders) {
              await this.fetchFolderRecipes(folder);
            }
          } else {
            console.error("Error fetching folders:", response.data.message);
          }
        } catch (error) {
          console.error('Error fetching folders:', error);
        }
      },
      
      async fetchFolderRecipes(folder) {
        try {
          const response = await axios.post(`http://127.0.0.1:5000/folder_recipes/${folder.id}`, { username: this.username });
  
          if (response.data.status === 'success') {
            folder.recipes = response.data.recipes.sort((a, b) => b.rating - a.rating); // Sort recipes by rating
          } else {
            console.error("Error fetching recipes:", response.data.message);
          }
        } catch (error) {
          console.error('Error fetching recipes:', error);
        }
      },
  
      async createFolder() {
        if (!this.newFolderName.trim()) {
          alert("Folder name cannot be empty.");
          return;
        }
  
        try {
          const response = await axios.post('http://127.0.0.1:5000/create_folder', {
            username: this.username,
            folder_name: this.newFolderName
          });
  
          if (response.data.status === 'success') {
            alert("Folder created successfully!");
            this.newFolderName = '';
            await this.fetchFolders();
          } else {
            alert("Error: " + response.data.message);
          }
        } catch (error) {
          console.error("Error creating folder:", error);
          alert("Failed to create folder.");
        }
      },
  
      async deleteFolder(folderId) {
        if (!confirm("Are you sure you want to delete this folder? This will remove all saved recipes inside.")) {
          return;
        }
  
        try {
          const response = await axios.delete('http://127.0.0.1:5000/delete_folder', {
            data: { username: this.username, folder_id: folderId }
          });
  
          if (response.data.status === 'success') {
            alert("Folder deleted successfully!");
            await this.fetchFolders();
          } else {
            alert("Error: " + response.data.message);
          }
        } catch (error) {
          console.error("Error deleting folder:", error);
          alert("Failed to delete folder.");
        }
      },
  
      async removeRecipe(folderId, recipeId) {
        if (!confirm("Are you sure you want to remove this recipe from the folder?")) {
          return;
        }
  
        try {
          const response = await axios.delete('http://127.0.0.1:5000/remove_saved_recipe', {
            data: { username: this.username, folder_id: folderId, recipe_id: recipeId }
          });
  
          if (response.data.status === 'success') {
            alert("Recipe removed successfully!");
            await this.fetchFolders();
          } else {
            alert("Error: " + response.data.message);
          }
        } catch (error) {
          console.error("Error removing recipe:", error);
          alert("Failed to remove recipe.");
        }
      },
  
      toggleFolder(folderId) {
        if (this.expandedFolders.includes(folderId)) {
          this.expandedFolders = this.expandedFolders.filter(id => id !== folderId);
        } else {
          this.expandedFolders.push(folderId);
        }
      },
  
      viewRecipeDetail(recipe) {
        sessionStorage.setItem('savedRecipe', JSON.stringify(recipe));
        this.$router.push({ name: 'DetailFolder' });
      }
    }
  };
  </script>
  
  <style scoped>
  button:hover {
    transition: background-color 0.3s;
  }
  </style>
  