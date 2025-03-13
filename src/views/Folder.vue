<template>
    <div class="min-h-screen bg-gray-800 text-white">
      <div class="container mx-auto px-4 py-16">
        <h1 class="text-3xl font-bold text-center mb-6">My Folders</h1>
  
        <!-- Create Folder Section -->
        <div class="max-w-md mx-auto bg-gray-700 p-6 rounded-lg shadow-lg mb-6">
          <h2 class="text-lg font-semibold mb-2">Create New Folder</h2>
          <input 
            v-model="newFolderName"
            placeholder="Folder Name"
            class="w-full px-3 py-2 border rounded bg-gray-800 text-white focus:outline-none"
          />
          <button @click="createFolder" class="mt-3 bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600">
            Create Folder
          </button>
        </div>
  
        <!-- Display User Folders -->
        <div v-if="folders.length > 0">
          <h2 class="text-xl font-semibold mb-4">Your Folders</h2>
          <ul class="list-disc list-inside">
            <li v-for="folder in folders" :key="folder.id">
              <button @click="fetchFolderRecipes(folder.id)" class="text-blue-400 hover:underline">
                {{ folder.name }}
              </button>
            </li>
          </ul>
        </div>
        <div v-else class="text-center text-gray-400">
          <p>You have no folders yet. Create one above.</p>
        </div>
  
        <!-- Display Recipes in the Selected Folder -->
        <div v-if="folderRecipes.length > 0" class="mt-6">
          <h2 class="text-xl font-semibold mb-4">Recipes in Folder</h2>
          <ul class="list-disc list-inside">
            <li v-for="recipe in folderRecipes" :key="recipe.recipe_id">
              {{ recipe.name }}
              <button @click="removeSavedRecipe(recipe.recipe_id, selectedFolder)" 
                      class="ml-3 text-red-500 hover:underline">
                Remove
              </button>
            </li>
          </ul>
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
        selectedFolder: null,
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
            username: this.username  // Send username instead of JWT
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
          const response = await axios.post(
            'http://127.0.0.1:5000/create_folder',
            { username: this.username, folder_name: this.newFolderName } // Send username instead of JWT
          );
  
          if (response.data.status === 'success') {
            alert('Folder created successfully!');
            this.newFolderName = '';  // Clear input
            this.fetchFolders();  // Refresh folders list
          }
        } catch (error) {
          console.error('Error creating folder:', error);
        }
      },
      async fetchFolderRecipes(folderId) {
        try {
          const response = await axios.post(`http://127.0.0.1:5000/folder_recipes/${folderId}`, {
            username: this.username // Send username instead of JWT
          });
  
          if (response.data.status === 'success') {
            this.folderRecipes = response.data.recipes;
            this.selectedFolder = folderId;  // Store selected folder
          }
        } catch (error) {
          console.error('Error fetching folder recipes:', error);
        }
      },
      async removeSavedRecipe(recipeId, folderId) {
        try {
          const response = await axios.delete('http://127.0.0.1:5000/remove_saved_recipe', {
            data: {
              username: this.username,  // Send username instead of JWT
              recipe_id: recipeId,
              folder_id: folderId
            }
          });
  
          if (response.data.status === 'success') {
            alert('Recipe removed successfully!');
            this.fetchFolderRecipes(folderId); // Refresh the recipe list
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
  
  <style scoped>
  button:hover {
    transition: background-color 0.3s;
  }
  </style>
  