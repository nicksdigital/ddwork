<template>
    <div class="max-w-lg w-full bg-white/10 dark:bg-gray-800/30 backdrop-blur-lg p-10 rounded-lg shadow-2xl text-center">
      <h1 class="text-5xl font-bold text-white">Create an Account</h1>
      <p class="text-xl text-gray-300 mt-4">Sign up with your email to start playing.</p>
  
      <form @submit.prevent="signup" class="mt-6">
        <input v-model="username" type="text" placeholder="Username"
          class="w-full p-4 text-xl rounded-lg bg-white/10 text-white placeholder-gray-300 focus:ring-4 focus:ring-primary" required />
  
        <input v-model="email" type="email" placeholder="Email"
          class="w-full p-4 text-xl mt-4 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:ring-4 focus:ring-primary" required />
  
        <input v-model="password" type="password" placeholder="Password"
          class="w-full p-4 text-xl mt-4 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:ring-4 focus:ring-primary" required />
  
        <button type="submit"
          class="mt-6 w-full px-6 py-3 text-xl bg-primary text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg">
          Sign Up
        </button>
      </form>
  
      <p v-if="error" class="text-red-400 text-lg mt-4">⚠️ {{ error }}</p>
      <p v-if="success" class="text-green-400 text-lg mt-4">✅ {{ success }}</p>
  
      <p class="text-gray-400 text-sm mt-6">
        Already have an account? <NuxtLink to="/login" class="text-primary hover:underline">Log in</NuxtLink>.
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const email = ref('');
  const password = ref('');
  const username = ref('');
  const error = ref(null);
  const success = ref(null);
  
  async function signup() {
    try {
      error.value = null;
      success.value = null;
  
      const response = await $fetch('/api/auth/signup', {
        method: 'POST',
        body: { email: email.value, password: password.value, username: username.value },
      });
  
      if (response.success) {
        success.value = response.message;
        setTimeout(() => {
          router.push('/login'); // Redirect to login after success
        }, 2000);
      } else {
        error.value = response.message || 'Signup failed.';
      }
    } catch (err) {
      error.value = err.data.message || 'An error occurred.';
    }
  }
  </script>
  