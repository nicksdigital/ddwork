<template>
    <div class="max-w-lg w-full bg-white/10 dark:bg-gray-800/30 backdrop-blur-lg p-10 rounded-lg shadow-2xl text-center">
      <h1 class="text-5xl font-bold text-white">Log In</h1>
      <p class="text-xl text-gray-300 mt-4">Enter your email and password to continue.</p>
  
      <form @submit.prevent="login" class="mt-6">
        <input v-model="email" type="email" placeholder="Email"
          class="w-full p-4 text-xl rounded-lg bg-white/10 text-white placeholder-gray-300 focus:ring-4 focus:ring-primary" required />
  
        <input v-model="password" type="password" placeholder="Password"
          class="w-full p-4 text-xl mt-4 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:ring-4 focus:ring-primary" required />
  
        <button type="submit"
          class="mt-6 w-full px-6 py-3 text-xl bg-primary text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg">
          Log In
        </button>
      </form>
  
      <p v-if="error" class="text-red-400 text-lg mt-4">⚠️ {{ error }}</p>
  
      <p class="text-gray-400 text-sm mt-6">
        Don't have an account? <NuxtLink to="/signup" class="text-primary hover:underline">Sign up</NuxtLink>.
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const email = ref('');
  const password = ref('');
  const error = ref(null);
  
  async function login() {
    try {
      error.value = null;
  
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email: email.value, password: password.value },
      });
  
      if (response.success) {
        router.push('/library'); // Redirect to user's game library
      } else {
        error.value = response.message || 'Login failed.';
      }
    } catch (err) {
      error.value = err.data.message || 'An error occurred.';
    }
  }
  </script>
  