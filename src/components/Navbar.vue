<template>
  <nav class="bg-gray-800 text-white shadow-md">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <router-link to="/" class="text-2xl font-extrabold tracking-wide text-yellow-400 hover:text-yellow-300 drop-shadow-lg">
        🍽️ FoodFinder
      </router-link>
      <div class="flex items-center space-x-4">
        <router-link to="/" class="hover:text-gray-300">Home</router-link>
        <router-link to="/search" class="hover:text-gray-300">Search</router-link>
        <router-link to="/folder" class="hover:text-gray-300">Folder</router-link>
        
        <div v-if="isLoggedIn" class="flex items-center space-x-3">
          <span class="mr-2 font-semibold text-green-400 hover:text-green-300 transition-colors duration-300">
            👤 {{ username }}
          </span>
          <button @click="logout" class="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">Logout</button>
        </div>
        
        <div v-else class="flex space-x-2">
          <router-link to="/login" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">Login</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
// Same as your existing script...
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const isLoggedIn = ref(false);
const username = ref('');
const router = useRouter();

const checkLoginStatus = () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    const user = JSON.parse(userData);
    isLoggedIn.value = true;
    username.value = user.username;
  } else {
    isLoggedIn.value = false;
    username.value = '';
  }
};

onMounted(() => {
  checkLoginStatus();
});

watch(isLoggedIn, (newValue) => {
  if (newValue) {
    checkLoginStatus();
  }
});

const logout = () => {
  localStorage.removeItem('user');
  isLoggedIn.value = false;
  username.value = '';
  router.push('/');
  setTimeout(() => location.reload(), 100);
};

const loginSuccess = () => {
  checkLoginStatus();
  router.push('/');
  setTimeout(() => location.reload(), 100);
};

window.addEventListener('login-success', loginSuccess);
</script>

<style scoped>
button:hover {
  transition: background-color 0.3s;
}

.drop-shadow-lg {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
}
</style>
