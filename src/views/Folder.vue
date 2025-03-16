<template>
    <div class="min-h-screen bg-gray-900 text-white">
      <div class="container mx-auto px-4 py-12">
        <h1 class="text-4xl font-bold text-center mb-8">My Recipe Folders</h1>
  
        <!-- Create Folder Section -->
        <div class="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 class="text-xl font-semibold mb-2">Create a New Folder</h2>
          <div class="flex gap-2">
            <input 
              v-model="newFolderName"
              placeholder="Enter folder name"
              class="w-full px-4 py-2 border rounded bg-gray-700 text-white focus:outline-none"
            />
            <button @click="createFolder" class="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition">
              Create
            </button>
          </div>
        </div>
  
        <!-- Folder List -->
        <div class="max-w-3xl mx-auto">
          <h2 class="text-2xl font-semibold mb-4">Your Folders</h2>
          <div v-if="folders.length > 0" class="space-y-4">
            <div 
              v-for="folder in folders" 
              :key="folder.id" 
              class="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition cursor-pointer"
              @click="toggleFolder(folder.id)"
            >
              <div class="flex justify-between items-center">
                <!-- Clickable Folder Name -->
                <span class="text-lg font-semibold">{{ folder.name }}</span>
                
                <!-- Delete Button (Prevent Event Bubbling) -->
                <button 
                  @click.stop="deleteFolder(folder.id)" 
                  class="bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600 transition"
                >
                  🗑 Delete
                </button>
              </div>
  
              <!-- Recipes in the Folder -->
              <div v-if="openedFolder === folder.id" class="mt-4 bg-gray-700 p-4 rounded-lg">
                <div v-if="folderRecipes.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div 
                    v-for="recipe in folderRecipes" 
                    :key="recipe.recipe_id" 
                    class="bg-gray-800 p-3 rounded-lg shadow-lg hover:bg-gray-600 transition"
                  >
                    <img v-if="recipe.image_url" :src="recipe.image_url" alt="Recipe Image" class="w-full h-40 object-cover rounded">
                    <h4 class="text-lg font-semibold mt-2 truncate">{{ recipe.name }}</h4>
                    <!-- Remove Recipe Button (Fix event bubbling) -->
                    <button 
                      @click.stop="removeSavedRecipe(recipe.recipe_id, folder.id)" 
                      class="mt-2 bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600 transition w-full"
                    >
                      🗑 Remove
                    </button>
                  </div>
                </div>
                <div v-else class="text-gray-400 text-center mt-2">No recipes saved in this folder.</div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-400">You have no folders yet. Create one above.</div>
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
        folderRecipes: [],
        openedFolder: null,
        username: null
      };
    },
    created() {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.username = JSON.parse(userData).username;
        this.fetchFolders();
      } else {
        this.$router.push('/login'); // Redirect if not logged in
      }
    },
    methods: {
      async fetchFolders() {
        try {
          const response = await axios.post('http://127.0.0.1:5000/folders', {
            username: this.username
          });
  
          if (response.data.status === 'success') {
            this.folders = response.data.folders;
          }
        } catch (error) {
          console.error('Error fetching folders:', error);
        }
      },
      async createFolder() {
        if (!this.newFolderName.trim()) {
          alert('Please enter a folder name.');
          return;
        }
  
        try {
          const response = await axios.post('http://127.0.0.1:5000/create_folder', {
            username: this.username,
            folder_name: this.newFolderName
          });
  
          if (response.data.status === 'success') {
            alert('Folder created successfully!');
            this.newFolderName = '';
            this.fetchFolders();
          }
        } catch (error) {
          console.error('Error creating folder:', error);
        }
      },
      async deleteFolder(folderId) {
        if (!confirm('Are you sure you want to delete this folder? This will also delete all saved recipes inside it!')) {
          return;
        }
  
        try {
          const response = await axios.delete('http://127.0.0.1:5000/delete_folder', {
            data: { username: this.username, folder_id: folderId }
          });
  
          if (response.data.status === 'success') {
            alert('Folder deleted successfully!');
            this.fetchFolders();
          } else {
            alert('Error: ' + response.data.message);
          }
        } catch (error) {
          console.error('Error deleting folder:', error);
        }
      },
      async toggleFolder(folderId) {
        if (this.openedFolder === folderId) {
          this.openedFolder = null;
          this.folderRecipes = [];
        } else {
          this.openedFolder = folderId;
          await this.fetchFolderRecipes(folderId);
        }
      },
      async fetchFolderRecipes(folderId) {
        try {
          const response = await axios.post(`http://127.0.0.1:5000/folder_recipes/${folderId}`, {
            username: this.username
          });
  
          if (response.data.status === 'success') {
            this.folderRecipes = response.data.recipes;
          } else {
            this.folderRecipes = [];
          }
        } catch (error) {
          console.error('Error fetching folder recipes:', error);
        }
      },
      async removeSavedRecipe(recipeId, folderId) {
        try {
          const response = await axios.delete('http://127.0.0.1:5000/remove_saved_recipe', {
            data: { username: this.username, recipe_id: recipeId, folder_id: folderId }
          });
  
          if (response.data.status === 'success') {
            alert('Recipe removed successfully!');
            this.fetchFolderRecipes(folderId); // Refresh recipes after deletion
          } else {
            alert('Error: ' + response.data.message);
          }
        } catch (error) {
          console.error('Error removing recipe:', error);
        }
      }
    }
  };
  </script>
  