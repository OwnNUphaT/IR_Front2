<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        <h2 class="text-2xl font-bold text-center mb-4">{{ isLogin ? 'Login' : 'Register' }}</h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label class="block text-gray-700">Username</label>
            <input v-model="form.username" type="text" class="w-full px-3 py-2 border rounded" required />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Password</label>
            <input v-model="form.password" type="password" class="w-full px-3 py-2 border rounded" required />
          </div>
          <div v-if="!isLogin" class="mb-4">
            <label class="block text-gray-700">Confirm Password</label>
            <input v-model="form.confirmPassword" type="password" class="w-full px-3 py-2 border rounded" required />
          </div>
          <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded">
            {{ isLogin ? 'Login' : 'Register' }}
          </button>
          <p class="text-sm text-center mt-4">
            {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
            <button class="text-blue-500" @click="isLogin = !isLogin">{{ isLogin ? 'Register' : 'Login' }}</button>
          </p>
          <p v-if="errorMessage" class="text-red-500 text-sm text-center mt-2">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const isLogin = ref(true);
  const form = ref({ username: '', password: '', confirmPassword: '' });
  const errorMessage = ref('');
  const isLoggedIn = ref(false);
  const username = ref('');
  const router = useRouter();
  
  onMounted(() => {
    checkLoginStatus();
  });
  
  const checkLoginStatus = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      isLoggedIn.value = true;
      username.value = user.username;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('user');
    isLoggedIn.value = false;
    username.value = '';
    router.push('/');
    setTimeout(() => location.reload(), 100);
  };
  
  const handleSubmit = async () => {
    errorMessage.value = '';
    if (!isLogin.value && form.value.password !== form.value.confirmPassword) {
      errorMessage.value = 'Passwords do not match';
      return;
    }
    try {
      const endpoint = isLogin.value ? '/login' : '/register';
      const { data } = await axios.post(`http://127.0.0.1:5000${endpoint}`, form.value);
      if (data.status === 'success' && isLogin.value) {
        localStorage.setItem('user', JSON.stringify({ username: form.value.username }));
        isLoggedIn.value = true;
        username.value = form.value.username;
        alert('Login successful!');
        window.dispatchEvent(new Event('login-success'));
        setTimeout(() => location.reload(), 100);
      } else if (data.status === 'success') {
        alert('Registration successful! Please login.');
        isLogin.value = true;
      } else {
        errorMessage.value = data.message;
      }
    } catch (error) {
      errorMessage.value = error.response?.data?.message || 'Something went wrong';
    }
  };
  </script>
  
  <style scoped>
  input:focus {
    outline: none;
    border-color: #3b82f6;
  }
  </style>