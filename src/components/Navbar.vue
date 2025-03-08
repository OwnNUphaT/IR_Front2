<template>
    <nav class="bg-gray-800 text-white shadow-md">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-bold">RecipeSearch</router-link>
        </div>
        <div class="flex items-center space-x-4">
          <router-link to="/" class="hover:text-gray-300">Home</router-link>
          <router-link to="/search" class="hover:text-gray-300">Search</router-link>
          <div v-if="isLoggedIn">
            <span class="mr-2">{{ username }}</span>
            <button @click="logout" class="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">Logout</button>
          </div>
          <div v-else class="flex space-x-2">
            <router-link to="/login" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">Login</router-link>
            <router-link to="/register" class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded">Register</router-link>
          </div>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'Navbar',
    data() {
      return {
        isLoggedIn: false,
        username: ''
      }
    },
    created() {
      // Check if user is logged in when component is created
      this.checkLoginStatus()
    },
    methods: {
      checkLoginStatus() {
        // Check localStorage for user data
        const userData = localStorage.getItem('user')
        if (userData) {
          const user = JSON.parse(userData)
          this.isLoggedIn = true
          this.username = user.username
        }
      },
      logout() {
        // Clear user data from localStorage
        localStorage.removeItem('user')
        this.isLoggedIn = false
        this.username = ''
        // Redirect to home page
        this.$router.push('/')
      }
    }
  }
  </script>