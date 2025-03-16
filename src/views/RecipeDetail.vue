<template>
  <div class="min-h-screen bg-gray-800 text-white">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-center mb-6">Your Folders</h1>

      <div v-for="folder in folders" :key="folder.id" class="bg-gray-700 p-4 rounded-lg shadow-lg mb-4">
        <div class="flex justify-between items-center cursor-pointer" @click="toggleFolder(folder.id)">
          <h2 class="text-lg font-semibold">{{ folder.name }}</h2>
          <button @click.stop="deleteFolder(folder.id)" class="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
            Delete
          </button>
        </div>

        <!-- Show Saved Recipes Inside the Folder -->
        <div v-if="openFolders.includes(folder.id)" class="mt-3">
          <h3 class="text-md font-semibold text-gray-300 mb-2">Saved Recipes:</h3>
          <div v-for="recipe in folder.recipes" :key="recipe.recipe_id" class="bg-gray-600 p-2 rounded mb-2 flex justify-between">
            <div class="cursor-pointer" @click="viewSavedRecipe(recipe)">
              <img v-if="recipe.image_url" :src="recipe.image_url" alt="Recipe Image" class="w-16 h-16 rounded-lg object-cover" />
              <span class="ml-3">{{ recipe.name }}</span>
            </div>
            <button @click.stop="removeRecipe(folder.id, recipe.recipe_id)" class="bg-red-500 px-2 py-1 rounded hover:bg-red-600">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "FolderView",
  data() {
    return {
      folders: [],
      openFolders: [],
      username: null,
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
      try {
        const response = await axios.post("http://127.0.0.1:5000/folders", { username: this.username });
        if (response.data.status === "success") {
          this.folders = response.data.folders;
          // Fetch saved recipes for each folder
          for (let folder of this.folders) {
            await this.fetchSavedRecipes(folder.id);
          }
        }
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    },
    async fetchSavedRecipes(folderId) {
      try {
        const response = await axios.post(`http://127.0.0.1:5000/folder_recipes/${folderId}`, {
          username: this.username,
        });
        if (response.data.status === "success") {
          const folder = this.folders.find((f) => f.id === folderId);
          if (folder) {
            folder.recipes = response.data.recipes;
          }
        }
      } catch (error) {
        console.error("Error fetching saved recipes:", error);
      }
    },
    viewSavedRecipe(recipe) {
      sessionStorage.setItem("savedRecipe", JSON.stringify(recipe));
      this.$router.push("/saved-recipe");
    },
    toggleFolder(folderId) {
      if (this.openFolders.includes(folderId)) {
        this.openFolders = this.openFolders.filter((id) => id !== folderId);
      } else {
        this.openFolders.push(folderId);
      }
    },
    async deleteFolder(folderId) {
      if (!confirm("Are you sure you want to delete this folder?")) return;
      try {
        await axios.delete("http://127.0.0.1:5000/delete_folder", {
          data: { username: this.username, folder_id: folderId },
        });
        this.folders = this.folders.filter((folder) => folder.id !== folderId);
      } catch (error) {
        console.error("Error deleting folder:", error);
      }
    },
    async removeRecipe(folderId, recipeId) {
      if (!confirm("Are you sure you want to remove this recipe?")) return;
      try {
        await axios.delete("http://127.0.0.1:5000/remove_saved_recipe", {
          data: { username: this.username, folder_id: folderId, recipe_id: recipeId },
        });
        const folder = this.folders.find((f) => f.id === folderId);
        if (folder) {
          folder.recipes = folder.recipes.filter((r) => r.recipe_id !== recipeId);
        }
      } catch (error) {
        console.error("Error removing recipe:", error);
      }
    },
  },
};
</script>
