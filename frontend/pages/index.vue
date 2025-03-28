<template>
  <div class="w-full h-screen flex flex-col items-center justify-center text-center relative">
    <!-- Hero Section -->
    <div class="max-w-3xl w-full bg-white/10 dark:bg-gray-800/30 backdrop-blur-lg p-10 rounded-lg shadow-2xl">
      <h1 class="text-5xl font-extrabold text-white">Unlock Your Game</h1>
      <p class="text-xl text-gray-300 mt-4">
        Enter your serial number to register and download your game.
      </p>

      <!-- Serial Input Form -->
      <form @submit.prevent="validateSerial" class="mt-6">
        <div class="relative">
          <input v-model="serial" type="text" placeholder="Enter your serial number..."
            class="w-full p-5 text-2xl rounded-lg border border-white/30 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary backdrop-blur-md shadow-md"
            required />
          <button type="submit"
            class="absolute top-1/2 right-3 transform -translate-y-1/2 px-6 py-3 text-xl bg-primary text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg">
            Register
          </button>
        </div>
      </form>

      <p v-if="error" class="text-red-400 text-lg mt-4">⚠️ {{ error }}</p>
      <p v-if="success" class="text-green-400 text-lg mt-4">✅ Valid serial! Redirecting...</p>
      
      <!-- Login Link for Existing Users -->
      <p class="text-gray-300 mt-6">
        Already have an account? <NuxtLink to="/login" class="text-primary hover:underline font-semibold">Log in here</NuxtLink>
      </p>
    </div>

    <!-- Steps Section -->
    <div class="mt-12 text-gray-300 max-w-2xl">
      <h2 class="text-3xl font-semibold text-white">How It Works</h2>
      <div class="mt-6 flex flex-col space-y-4 text-lg">
        <div class="flex items-center space-x-3">
          <span class="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full font-bold">1</span>
          <p>Enter your game serial number.</p>
        </div>
        <div class="flex items-center space-x-3">
          <span class="w-8 h-8 flex items-center justify-center bg-gray-500 text-white rounded-full font-bold">2</span>
          <p>Create an account to activate your game.</p>
        </div>
        <div class="flex items-center space-x-3">
          <span class="w-8 h-8 flex items-center justify-center bg-gray-500 text-white rounded-full font-bold">3</span>
          <p>Download and enjoy your game!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const serial = ref('');
const error = ref(null);
const success = ref(false);

async function validateSerial() {
  try {
    error.value = null;
    success.value = false;

    // First validate the serial number and get a token
    const response = await $fetch('/api/serial/token', {
      method: 'POST',
      body: { serial: serial.value },
    });

    if (response.success) {
      success.value = true;
      setTimeout(() => {
        router.push(`/auth?token=${response.token}`); // Redirects to authentication page with token
      }, 2000);
    } else {
      error.value = response.message || 'Invalid serial number';
    }
  } catch (err) {
    error.value = err.data?.message || 'An error occurred. Please try again.';
  }
}
</script>
